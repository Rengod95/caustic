// G5 · Foundation policies P1–P9 (static class rules + runtime rules).
import ts from 'typescript';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { ComponentSpec } from '@caustic/spec';
import { Collector } from '../report.ts';
import { componentsDir, root } from '../paths.ts';
import { caseFor, caseSelector, openPage, slotSelector, type Runtime } from '../runtime.ts';

interface Use { cls: string; where: string; literal: string; variant?: string }

/** Class uses with the cva variant they belong to ("tone=agent"), for variant-scoped policies. */
function classUses(spec: ComponentSpec): Use[] {
  const dir = join(componentsDir, spec.id); const out: Use[] = [];
  for (const f of readdirSync(dir).filter(f => /\.tsx?$/.test(f) && !f.includes('.fixture.'))) {
    const file = join(dir, f); const text = readFileSync(file, 'utf8'); const rel = relative(root, file).replace(/\\/g, '/');
    const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, f.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const walk = (n: ts.Node, variant?: string) => {
      if (ts.isPropertyAssignment(n) && ts.isObjectLiteralExpression(n.parent) && ts.isPropertyAssignment(n.parent.parent) && ts.isObjectLiteralExpression(n.parent.parent.parent) && ts.isPropertyAssignment(n.parent.parent.parent.parent) && n.parent.parent.parent.parent.name.getText(sf) === 'variants') {
        variant = `${n.parent.parent.name.getText(sf).replace(/['"]/g, '')}=${n.name.getText(sf).replace(/['"]/g, '')}`;
      }
      if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
        const line = sf.getLineAndCharacterOfPosition(n.getStart()).line + 1;
        for (const cls of n.text.split(/\s+/).filter(Boolean)) out.push({ cls, where: `${rel}:${line}`, literal: n.text, variant });
      }
      ts.forEachChild(n, m => walk(m, variant));
    };
    walk(sf);
  }
  return out;
}

const SPECTRUM = /^(agent-rim|agent-glow|orb(-sm|-lg|-dot)?|shimmer|spectrum-fill|spectrum-line|animate-agent|animate-orb|animate-shimmer)$/;
const GLASS = /^(glass(-ultrathin|-thin|-thick|-shadow-\d)?|backdrop-blur-(ultrathin|thin|regular|thick|overlay))$/;

export async function g5Static(c: Collector, spec: ComponentSpec) {
  const uses = classUses(spec);
  const agent = spec.flags.agent;
  for (const u of uses) {
    const util = u.cls.split(':').pop()!;
    if (GLASS.test(util) && !spec.flags.floating) c.fail({ gate: 'G5', check: 'P1 glass', where: u.where, message: `"${u.cls}" uses a glass material but the component does not float (flags.floating).`, fix: 'Use a solid surface, or the light frost utility for controls.' });
    if (SPECTRUM.test(util)) {
      const allowed = agent === true || (typeof agent === 'object' && !!u.variant && Object.entries(agent).some(([axis, vals]) => vals.some(v => u.variant === `${axis}=${v}`)));
      if (!allowed) c.fail({ gate: 'G5', check: 'P2 spectrum', where: u.where, message: `"${u.cls}" is agent light outside an agent context${u.variant ? ` (variant ${u.variant})` : ''}.`, fix: 'Spectrum utilities belong only to components or variants listed in flags.agent.' });
    }
    if (/^(bg-linear|bg-radial|bg-conic|inset-shadow|inset-ring|bg-gradient)/.test(util)) c.fail({ gate: 'G5', check: 'P3 flat', where: u.where, message: `"${u.cls}" adds a gradient or inset highlight. Controls are flat.` });
    if (/^text-(voice|voice-sm|thought)$/.test(util) && !u.literal.split(/\s+/).includes('font-voice')) c.fail({ gate: 'G5', check: 'P4 voices', where: u.where, message: `"${u.cls}" needs font-voice in the same class list.` });
    if (/^text-(mono|mono-sm)$/.test(util) && !u.literal.split(/\s+/).includes('font-mono')) c.fail({ gate: 'G5', check: 'P4 voices', where: u.where, message: `"${u.cls}" needs font-mono in the same class list.` });
    if (/^font-voice$/.test(util) && !['agent', 'card', 'list'].includes(spec.category) && agent === false) c.warn({ gate: 'G5', check: 'P4 voices', where: u.where, message: 'font-voice outside an agent component. Agent prose only.' });
    if (/^animate-/.test(util) && util !== 'animate-spinner' && !spec.flags.motionLoop && agent === false) c.fail({ gate: 'G5', check: 'P8 motion', where: u.where, message: `"${u.cls}" loops forever; only agent components may.` });
  }
}

export async function g5Runtime(c: Collector, spec: ComponentSpec, rt: Runtime) {
  // P3 accent once, P5 concentric corners — on every example.
  for (const ex of spec.examples) {
    const page = await openPage(rt, { c: spec.id, mode: 'example', ex: ex.id, theme: 'light', w: '800' });
    try {
      const accents = await page.locator('[data-tone="accent"]').count();
      if (accents > 1) c.fail({ gate: 'G5', check: 'P3 accent once', where: ex.id, message: `${accents} accent buttons in one view.`, expected: '≤ 1' });
      const nested: { child: string; parent: string; rc: number; rp: number; inset: number }[] = await page.evaluate(() => {
        const out: any[] = []; const frame = document.querySelector('.frame')!;
        const rad = (el: Element) => parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
        for (const el of frame.querySelectorAll('*')) {
          const rc = rad(el); if (!rc || rc >= 999) continue;
          let p = el.parentElement; while (p && p !== frame && !(rad(p) > 0)) p = p.parentElement;
          if (!p || p === frame) continue;
          const rp = rad(p); if (rp >= 999) continue;
          const a = el.getBoundingClientRect(), b = p.getBoundingClientRect();
          const dx = a.left - b.left, dy = a.top - b.top;
          if (dx < 0 || dy < 0 || dx > rp || dy > rp) continue; // only children sitting in the parent's corner
          const inset = Math.min(dx, dy);
          // Concentricity only reads when the child hugs the corner; deeper inside, the curves no longer relate.
          if (inset > rp / 2) continue;
          if (rc > rp - inset + 2) out.push({ child: (el.getAttribute('data-slot') || el.tagName.toLowerCase()), parent: (p.getAttribute('data-slot') || p.tagName.toLowerCase()), rc, rp, inset });
        }
        return out;
      });
      for (const n of nested) c.fail({ gate: 'G5', check: 'P5 concentric', where: `${ex.id} · ${n.child} in ${n.parent}`, message: 'Inner corner is rounder than the outer corner allows.', expected: `≤ ${n.rp - n.inset}px (outer ${n.rp} − inset ${n.inset})`, actual: `${n.rc}px` });
    } finally { await page.close(); }
  }
  // P8 reduced motion: nothing may keep animating.
  {
    const page = await openPage(rt, { c: spec.id, mode: 'cases', theme: 'light', freeze: '0' }, [caseFor(spec)], { reducedMotion: true });
    try {
      await page.waitForTimeout(100);
      const running = await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').map(a => (a as any).animationName || a.constructor.name));
      if (running.length) c.fail({ gate: 'G5', check: 'P8 reduced motion', message: 'Animations keep running under prefers-reduced-motion.', actual: running.join(', ') });
    } finally { await page.close(); }
  }
  // P9 a field owns its focus.
  if (spec.flags.field) {
    const k = caseFor(spec); k.key = 'field';
    const page = await openPage(rt, { c: spec.id, mode: 'cases', theme: 'light', freeze: '1' }, [k]);
    try {
      const rootSel = `${caseSelector('field')} ${slotSelector(spec, 'root')}`;
      await page.locator(`${rootSel} input, ${rootSel} textarea, ${rootSel} [contenteditable]`).first().focus();
      await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
      const r = await page.evaluate(sel => {
        const g = (window as any).__gate; const root = document.querySelector(sel)!; const input = root.querySelector('input,textarea,[contenteditable]') as HTMLElement;
        const field = g.resolve('box-shadow', 'var(--cs-focus-field)'), outer = g.resolve('box-shadow', 'var(--cs-focus)');
        const rs = getComputedStyle(root).boxShadow, is = getComputedStyle(input);
        return { hasField: rs.includes(field), hasOuter: rs.includes(outer), inputRing: is.boxShadow !== 'none', inputOutline: is.outlineStyle !== 'none' && parseFloat(is.outlineWidth) > 0, rs };
      }, rootSel);
      if (!r.hasField) c.fail({ gate: 'G5', check: 'P9 field focus', message: 'Focused field does not show the focus-field edge on its container.', actual: r.rs });
      if (r.hasOuter) c.fail({ gate: 'G5', check: 'P9 field focus', message: 'Focused field also shows the outer focus ring. One edge only.' });
      if (r.inputRing || r.inputOutline) c.fail({ gate: 'G5', check: 'P9 field focus', message: 'Inner input draws its own outline or ring.' });
    } finally { await page.close(); }
  }
}
