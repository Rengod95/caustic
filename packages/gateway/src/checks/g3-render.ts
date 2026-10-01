// G3 · Render conformance: anatomy, computed token styles, role, axe, behaviour scenarios.
import { createRequire } from 'node:module';
import type { ComponentSpec } from '@caustic/spec';
import { Collector } from '../report.ts';
import { caseFor, caseSelector, expectPayload, forcePseudo, openPage, slotSelector, type CaseDef, type Runtime } from '../runtime.ts';
import { tokenIndex } from '../tokens.ts';

const require = createRequire(import.meta.url);
const THEMES = ['light', 'dark'] as const;

export async function g3(c: Collector, spec: ComponentSpec, rt: Runtime) {
  const t = await tokenIndex();
  const cases = new Map<string, CaseDef>();
  const base = caseFor(spec); cases.set(base.key, base);
  const ruleCases = spec.styles.map(rule => { const k = caseFor(spec, rule.when ?? {}); cases.set(k.key, k); return k; });

  for (const theme of THEMES) {
    const page = await openPage(rt, { c: spec.id, mode: 'cases', theme }, [...cases.values()]);
    try {
      // Anatomy and role (once, light)
      if (theme === 'light') await anatomy(c, spec, page, base);
      // Styles
      for (let i = 0; i < spec.styles.length; i++) {
        const rule = spec.styles[i]!; const kc = ruleCases[i]!;
        const state = (rule.when?.state as string) ?? 'rest';
        const def = spec.states[state as keyof typeof spec.states];
        const target = `${caseSelector(kc.key)} ${slotSelector(spec, rule.slot)}`;
        const exists = await page.locator(target).count();
        if (!exists) { c.fail({ gate: 'G3', check: 'anatomy', where: `case ${describe(kc)}`, message: `Slot "${rule.slot}" is not rendered in this case.`, expected: slotSelector(spec, rule.slot) }); continue; }
        let release: (() => Promise<void>) | null = null;
        if (def?.pseudo?.length) {
          const pseudoTarget = def.target ? `${caseSelector(kc.key)} ${slotSelector(spec, def.target)}` : `${caseSelector(kc.key)} ${slotSelector(spec, 'root')}`;
          release = await forcePseudo(page, pseudoTarget, def.pseudo);
        }
        const payload = expectPayload(t, rule.expect);
        const bad: { key: string; expected: string; actual: string }[] = await page.evaluate(([sel, e]) => (window as any).__gate.measure(document.querySelector(sel as string), e), [target, payload] as const);
        if (release) await release();
        for (const b of bad) c.fail({ gate: 'G3', check: 'tokens', where: `${theme} · ${describe(kc)}${state !== 'rest' ? ` · ${state}` : ''} · slot ${rule.slot}`, message: `${b.key} does not match the spec token.`, expected: b.expected, actual: b.actual, fix: rule.note ?? `Use the utility for ${b.key.split(' ').slice(1).join(' ') || b.key}.` });
      }
      // Accessibility (axe) on every case
      if (theme === 'light' || theme === 'dark') {
        await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
        const violations: any[] = await page.evaluate(async () => (await (window as any).axe.run('.cases', { resultTypes: ['violations'] })).violations);
        for (const v of violations) c.fail({ gate: 'G3', check: `axe:${v.id}`, where: theme, message: `${v.help} (${v.impact}).`, actual: v.nodes.slice(0, 3).map((n: any) => n.target.join(' ')).join(' | '), fix: v.helpUrl });
      }
    } finally { await page.close(); }
  }
  await scenarios(c, spec, rt);
}

function describe(k: CaseDef) { return Object.entries(k.props).map(([a, b]) => `${a}=${b}`).join(' '); }

async function anatomy(c: Collector, spec: ComponentSpec, page: any, base: CaseDef) {
  const scope = caseSelector(base.key);
  const tree: Record<string, { present: boolean; parentOk: boolean; tag: string }> = await page.evaluate(([scopeSel, slots, id]: [string, { name: string; parent?: string; el: string }[], string]) => {
    const scopeEl = document.querySelector(scopeSel)!;
    const attr = (n: string) => (n === 'root' ? id : `${id}-${n}`);
    const out: Record<string, any> = {};
    for (const s of slots) {
      const el = scopeEl.querySelector(`[data-slot="${attr(s.name)}"]`);
      let parentOk = true;
      if (el && s.parent) { const p = el.parentElement?.closest('[data-slot]'); parentOk = !!p && (p.getAttribute('data-slot') === attr(s.parent) || !!el.closest(`[data-slot="${attr(s.parent)}"]`)); }
      out[s.name] = { present: !!el, parentOk, tag: el?.tagName.toLowerCase() ?? '' };
    }
    return out;
  }, [scope, spec.slots, spec.id]);
  for (const s of spec.slots) {
    const r = tree[s.name]!;
    if (!r.present && s.required) c.fail({ gate: 'G3', check: 'anatomy', message: `Required slot "${s.name}" is missing in the default render.`, expected: slotSelector(spec, s.name) });
    if (r.present && !r.parentOk) c.fail({ gate: 'G3', check: 'anatomy', message: `Slot "${s.name}" is not inside "${s.parent}".` });
    if (r.present && s.el !== 'any' && r.tag !== s.el) c.fail({ gate: 'G3', check: 'anatomy', message: `Slot "${s.name}" renders <${r.tag}>, spec says <${s.el}>.` });
  }
  if (spec.role) {
    const snap: string = await page.locator(`${scope} ${slotSelector(spec, 'root')}`).first().ariaSnapshot().catch(() => '');
    const role = snap.trim().replace(/^- /, '').split(/[\s":]/)[0];
    if (role !== spec.role) c.fail({ gate: 'G3', check: 'role', message: 'Root has the wrong accessible role.', expected: spec.role, actual: role || '(none)' });
  }
}

async function scenarios(c: Collector, spec: ComponentSpec, rt: Runtime) {
  for (const sc of spec.behavior.scenarios) {
    const k = caseFor(spec); Object.assign(k.props, sc.props ?? {}); k.key = 'scenario';
    const page = await openPage(rt, { c: spec.id, mode: 'cases', theme: 'light' }, [k]);
    const scope = caseSelector('scenario');
    const loc = (slot = 'root') => page.locator(`${scope} ${slotSelector(spec, slot)}`).first();
    try {
      for (const st of sc.steps) {
        if (st.do === 'click') await loc(st.slot).click({ force: true, timeout: 2000 });
        else if (st.do === 'focus') await loc(st.slot).focus();
        else if (st.do === 'blur') await loc(st.slot).blur();
        else if (st.do === 'hover') await loc(st.slot).hover({ force: true });
        else if (st.do === 'press') await page.keyboard.press(st.key!);
        else if (st.do === 'type') await page.keyboard.type(st.text ?? '');
        else if (st.do === 'drag') { const b = (await loc(st.slot).boundingBox())!; await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width / 2 + (st.by?.x ?? 0), b.y + b.height / 2 + (st.by?.y ?? 0), { steps: 8 }); await page.mouse.up(); }
      }
      await page.waitForTimeout(50);
      const events: { name: string; args: unknown[] }[] = await page.evaluate(() => (window as any).__EVENTS__);
      for (const ex of sc.expect) {
        if (ex.event) {
          const calls = events.filter(e => e.name === ex.event);
          if (ex.calls !== undefined && calls.length !== ex.calls) c.fail({ gate: 'G3', check: 'behavior', where: `scenario "${sc.name}"`, message: `${ex.event} was called ${calls.length}×.`, expected: `${ex.calls}×`, actual: `${calls.length}×` });
          if (ex.args && JSON.stringify(calls.at(-1)?.args.slice(0, ex.args.length)) !== JSON.stringify(ex.args)) c.fail({ gate: 'G3', check: 'behavior', where: `scenario "${sc.name}"`, message: `${ex.event} payload differs.`, expected: JSON.stringify(ex.args), actual: JSON.stringify(calls.at(-1)?.args ?? null) });
        }
        if (ex.attr) for (const [a, v] of Object.entries(ex.attr)) {
          const got = await loc(ex.slot).getAttribute(a);
          if (got !== v) c.fail({ gate: 'G3', check: 'behavior', where: `scenario "${sc.name}"`, message: `[${a}] on slot ${ex.slot ?? 'root'}.`, expected: String(v), actual: String(got) });
        }
        if (ex.focused) { const ok = await loc(ex.focused).evaluate(el => el === document.activeElement || el.contains(document.activeElement)); if (!ok) c.fail({ gate: 'G3', check: 'behavior', where: `scenario "${sc.name}"`, message: `Focus is not on slot ${ex.focused}.` }); }
        if (ex.visible && !(await loc(ex.visible).isVisible())) c.fail({ gate: 'G3', check: 'behavior', where: `scenario "${sc.name}"`, message: `Slot ${ex.visible} is not visible.` });
        if (ex.hidden && (await loc(ex.hidden).isVisible().catch(() => false))) c.fail({ gate: 'G3', check: 'behavior', where: `scenario "${sc.name}"`, message: `Slot ${ex.hidden} is still visible.` });
      }
    } catch (e: any) {
      c.fail({ gate: 'G3', check: 'behavior', where: `scenario "${sc.name}"`, message: `Scenario could not run: ${String(e.message).split('\n')[0]}` });
    } finally { await page.close(); }
  }
}
