// Colour language rules (PROPOSAL-color-language.md §7).
//   CL1 slot-only            components read slot, axis and family tokens; no legacy aliases, no ramps
//   CL2 disabled-colour      disabled is colour (disabled-* slots), never opacity
//   CL3 emphasis-steady      hover / pressed / selected stay inside the rest emphasis, and the tone stays
//   CL4 selection-not-focus  selected is never drawn with the focus ring tokens
//   CL5 invalid-with-focus   invalid draws the danger border-strong edge, and focus does not erase it (nor it focus)
//   CL6 literal-color        no literal colours outside the colour-math and content-fixture allowlists
//   CL7 slot-contrast        slot pairs meet their contrast floors (foundation, from dist/caustic.css)
// CL1–CL6 run inside G2 per component; CL7 runs inside G0. Severity comes from src/color-language.json:
// CL1 blocks for ids in slotOnlyBlocking, CL2–CL6 for ids in migrated, CL7 when contrastBlocking; otherwise warnings.
// The rule functions are pure (sources in, hits out) so the self-test can feed them synthetic snippets.
import ts from 'typescript';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Collector, Gate } from '../report.ts';
import { componentsDir, root, tokensDist } from '../paths.ts';

export type RuleId = 'CL1' | 'CL2' | 'CL3' | 'CL4' | 'CL5' | 'CL6' | 'CL7';
export const RULES: Record<RuleId, string> = {
  CL1: 'CL1 slot-only', CL2: 'CL2 disabled-colour', CL3: 'CL3 emphasis-steady', CL4: 'CL4 selection-not-focus',
  CL5: 'CL5 invalid-with-focus', CL6: 'CL6 literal-color', CL7: 'CL7 slot-contrast',
};

export interface ColorConfig {
  migrated: string[];
  slotOnlyBlocking: string[];
  contrastBlocking: boolean;
  literalColorAllow: { colourMath: string[]; contentFixtures: string[] };
}
export interface RuleHit { rule: RuleId; where: string; message: string; actual?: string; expected?: string; fix?: string }
export interface Source { rel: string; text: string; fixture: boolean }

const configPath = join(dirname(fileURLToPath(import.meta.url)), '../color-language.json');
export function loadColorConfig(path = configPath): ColorConfig {
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  return {
    migrated: raw.migrated ?? [], slotOnlyBlocking: raw.slotOnlyBlocking ?? [], contrastBlocking: !!raw.contrastBlocking,
    literalColorAllow: { colourMath: raw.literalColorAllow?.colourMath ?? [], contentFixtures: raw.literalColorAllow?.contentFixtures ?? [] },
  };
}
const listed = (list: string[], id: string) => list.includes('*') || list.includes(id);
export function isBlocking(cfg: ColorConfig, rule: RuleId, id: string) {
  if (rule === 'CL1') return listed(cfg.slotOnlyBlocking, id);
  if (rule === 'CL7') return cfg.contrastBlocking;
  return listed(cfg.migrated, id);
}

// ── Vocabulary ─────────────────────────────────────────────────────────────────────────────
// Names are matched by pattern (--cs-{tone}-{slot}, with or without the color- prefix), so the rules
// work before and after the token build emits the new slots.
const TONES = 'accent|neutral|success|warning|danger|info|agent|ink';
const SLOT_RE = new RegExp(`^(${TONES})-(tint|soft|soft-hover|soft-pressed|border|border-strong|graphic|solid|solid-hover|text|on|on-muted)$`);
const NEUTRAL_RE = /^neutral-(hover|pressed|selected|selected-hover|track|well)$/;
const RAMP_RE = /^(?:(?:neutral|accent|success|warning|danger|info|agent(?:-\d)?|extra-\d|canvas-guide|mint|amber|coral|iris)-(?:light|dark)-\d{1,2}|(?:neutral|accent|mint|amber|coral|iris|white|black)-\d{1,3})$/;
/** Legacy name → the slot that replaces it (§3 old → new). Same-name aliases (danger-soft, accent-tint…) are slots, not legacy. */
export const LEGACY: Record<string, string> = {
  'accent-fill': 'accent-solid', 'accent-fill-hover': 'accent-solid-hover', 'accent-hover': 'accent-solid-hover',
  'accent-glow': 'agent-glow (agent family)', 'ink-hover': 'ink-solid-hover',
  'fill-hover': 'neutral-hover', 'fill-pressed': 'neutral-pressed (neutral-hover when it is a hover, neutral-well or neutral-track at rest)',
  'fill-selected': 'neutral-selected', 'diff-add': 'diff-add-bg', 'diff-remove': 'diff-remove-bg',
  'material-rim': 'nothing (material-rim is transparent in both modes and is deleted)', 'text-disabled': 'disabled-text',
  'spectrum-1': 'agent-stop-1', 'spectrum-2': 'agent-stop-2', 'spectrum-3': 'agent-stop-3',
};
const COLOR_PROP = /^-?(bg|text|border(?:-[xytrblse])?|ring(?:-offset)?|outline|fill|stroke|from|via|to|decoration|accent|caret|divide|placeholder|shadow|inset-shadow|inset-ring)-(.+)$/;
export const LITERAL_COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color-mix)\(/;

let themeColors: Set<string> | null = null;
/** Colour names theme.css exposes as Tailwind colours (--color-*). */
export function knownColors(): Set<string> {
  if (themeColors) return themeColors;
  themeColors = new Set();
  const f = join(tokensDist, 'theme.css');
  if (existsSync(f)) for (const m of readFileSync(f, 'utf8').matchAll(/--color-([a-z0-9-]+)\s*:/g)) themeColors.add(m[1]!);
  return themeColors;
}
const isColorName = (n: string, known: Set<string>) => n === 'transparent' || known.has(n) || SLOT_RE.test(n) || NEUTRAL_RE.test(n) || RAMP_RE.test(n) || n in LEGACY;

interface Ref { name: string; raw: string }
/** Colour references in one utility: theme colour classes (bg-danger-soft) and token variables (var(--cs-color-x), (--cs-x)). */
export function colorRefs(util: string, known: Set<string>): Ref[] {
  const out: Ref[] = [];
  for (const m of util.matchAll(/--(?:cs-color-|cs-|color-)([a-z0-9-]+)/g)) out.push({ name: m[1]!, raw: m[0] });
  const p = util.match(COLOR_PROP);
  if (p && !/^[[(]/.test(p[2]!)) { const name = p[2]!.replace(/\/[\d.]+$/, ''); if (isColorName(name, known)) out.push({ name, raw: util }); }
  return out;
}

// ── Class parsing ──────────────────────────────────────────────────────────────────────────
export function splitClass(cls: string): { variants: string[]; util: string } {
  const parts: string[] = []; let depth = 0, cur = '';
  for (const ch of cls) {
    if (ch === '[' || ch === '(') depth++;
    else if (ch === ']' || ch === ')') depth = Math.max(0, depth - 1);
    if (ch === ':' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
  }
  parts.push(cur);
  return { variants: parts, util: parts.pop()!.replace(/^!|!$/g, '') };
}

type Kind = 'hover' | 'pressed' | 'selected' | 'focus' | 'disabled' | 'invalid' | 'other';
const SELECTED_RE = /aria-(selected|checked|pressed|current)|state=(on|checked|active)|data-\[(selected|checked|active|current)|data-(selected|checked|active|current)\b|(^|-)checked$/;
function variantKinds(v: string): Kind[] {
  const k: Kind[] = [];
  if (/disabled/.test(v)) k.push('disabled');
  if (/invalid/.test(v)) k.push('invalid');
  if (/focus/.test(v)) k.push('focus');
  if (SELECTED_RE.test(v)) k.push('selected');
  else if (/(^|-)active$|pressed/.test(v)) k.push('pressed');
  if (/hover|highlighted/.test(v)) k.push('hover');
  return k.length ? k : ['other'];
}
/** States implied by code around a class string: `disabled && '…'`, `invalid ? '…' : …`, cva `selected: { true: '…' }`. */
function contextKinds(text: string): Kind[] {
  const k: Kind[] = [];
  if (/=false$/.test(text)) return k;
  if (/disabled/i.test(text)) k.push('disabled');
  if (/invalid|error/i.test(text)) k.push('invalid');
  if (/selected|checked|pressed|\bactive|isActive|current/i.test(text)) k.push('selected');
  return k;
}

interface Occ { cls: string; util: string; variants: string[]; kinds: Set<Kind>; where: string; units: string[]; order: number }

const COMPARISON = new Set([ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken]);
const isStr = (n: ts.Node): n is ts.StringLiteral | ts.NoSubstitutionTemplateLiteral => ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n);
const callName = (n: ts.Node) => ts.isCallExpression(n) && ts.isIdentifier(n.expression) ? n.expression.text : null;

/** Every class-like string in a source with its states and the class groups (units) it belongs to. */
function occurrences(src: Source): Occ[] {
  const sf = ts.createSourceFile(src.rel, src.text, ts.ScriptTarget.Latest, true, src.rel.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const out: Occ[] = []; const done = new Set<ts.Node>(); let order = 0, unitSeq = 0;
  const lineOf = (n: ts.Node) => sf.getLineAndCharacterOfPosition(n.getStart()).line + 1;

  const conditions = (n: ts.Node): string[] => {
    const texts: string[] = [];
    let child: ts.Node = n;
    for (let p = n.parent; p && !ts.isSourceFile(p); child = p, p = p.parent) {
      if (ts.isConditionalExpression(p) && p.whenTrue === child) texts.push(p.condition.getText(sf));
      if (ts.isBinaryExpression(p) && p.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken && p.right === child) texts.push(p.left.getText(sf));
      if (ts.isPropertyAssignment(p) && p.name === child) texts.push(p.initializer.getText(sf)); // cn({ 'opacity-42': disabled })
      if (callName(p) === 'cn' || callName(p) === 'cva' || ts.isJsxAttribute(p) || ts.isFunctionLike(p) || ts.isVariableDeclaration(p)) break;
    }
    return texts;
  };
  const skip = (m: ts.Node, inCn: boolean) =>
    (ts.isPropertyAssignment(m.parent) && m.parent.name === m && !inCn)
    || (ts.isBinaryExpression(m.parent) && COMPARISON.has(m.parent.operatorToken.kind))
    || ts.isCaseClause(m.parent) || ts.isLiteralTypeNode(m.parent) || ts.isImportDeclaration(m.parent) || ts.isExportDeclaration(m.parent)
    || ts.isElementAccessExpression(m.parent);
  const collect = (n: ts.Node, units: string[], extra: string[] = [], inCn = false) => {
    const visit = (m: ts.Node) => {
      if (isStr(m) && !done.has(m)) {
        done.add(m);
        if (skip(m, inCn)) return;
        const ctx = [...extra, ...conditions(m)].flatMap(contextKinds);
        for (const cls of m.text.split(/\s+/).filter(Boolean)) {
          const { variants, util } = splitClass(cls);
          const kinds = new Set<Kind>([...variants.flatMap(variantKinds), ...ctx]);
          out.push({ cls, util, variants, kinds, where: `${src.rel}:${lineOf(m)}`, units, order: order++ });
        }
      }
      ts.forEachChild(m, visit);
    };
    visit(n);
  };
  const keyText = (n: ts.PropertyName) => n.getText(sf).replace(/['"]/g, '');

  const walk = (n: ts.Node) => {
    const fn = callName(n);
    if (fn === 'cva' && ts.isCallExpression(n)) {
      const k = unitSeq++;
      const cfg = n.arguments[1];
      const valueUnits: { key: string; node: ts.Node; ctx: string[] }[] = [];
      if (cfg && ts.isObjectLiteralExpression(cfg)) for (const p of cfg.properties) {
        if (!ts.isPropertyAssignment(p)) continue;
        const key = keyText(p.name);
        if (key === 'variants' && ts.isObjectLiteralExpression(p.initializer)) {
          for (const ax of p.initializer.properties) if (ts.isPropertyAssignment(ax) && ts.isObjectLiteralExpression(ax.initializer))
            for (const v of ax.initializer.properties) if (ts.isPropertyAssignment(v)) {
              const kv = `${keyText(ax.name)}=${keyText(v.name)}`;
              valueUnits.push({ key: `cva${k}:${kv}`, node: v.initializer, ctx: [kv] });
            }
        }
        if (key === 'compoundVariants' && ts.isArrayLiteralExpression(p.initializer)) p.initializer.elements.forEach((el, i) => {
          if (!ts.isObjectLiteralExpression(el)) return;
          const conds = el.properties.filter(ts.isPropertyAssignment).filter(q => !['className', 'class'].includes(keyText(q.name))).map(q => `${keyText(q.name)}=${q.initializer.getText(sf).replace(/['"]/g, '')}`);
          for (const q of el.properties) if (ts.isPropertyAssignment(q) && ['className', 'class'].includes(keyText(q.name))) valueUnits.push({ key: `cva${k}:compound${i}`, node: q.initializer, ctx: conds });
        });
      }
      if (n.arguments[0]) collect(n.arguments[0], [`cva${k}:base`, ...valueUnits.map(v => v.key)]);
      for (const v of valueUnits) collect(v.node, [v.key], v.ctx);
      if (cfg) cfg.forEachChild(function mark(m) { if (isStr(m)) done.add(m); m.forEachChild(mark); });
      return;
    }
    if (fn === 'cn' && ts.isCallExpression(n)) { collect(n, [`cn${unitSeq++}`], [], true); return; }
    if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n) || ts.isTypeNode(n)) return;
    if (isStr(n) && !done.has(n)) { collect(n, [`lit${unitSeq++}`]); return; }
    ts.forEachChild(n, walk);
  };
  walk(sf);
  return out;
}

// ── Emphasis model for CL3 ─────────────────────────────────────────────────────────────────
type Emph = 'none' | 'tint' | 'soft' | 'solid' | 'interaction' | 'surface';
const LEGACY_EMPH: Record<string, [Emph, string]> = {
  'accent-fill': ['solid', 'accent'], 'accent-fill-hover': ['solid', 'accent'], 'accent-hover': ['solid', 'accent'], 'ink-hover': ['solid', 'ink'],
  'fill-hover': ['interaction', 'neutral'], 'fill-pressed': ['interaction', 'neutral'], 'fill-selected': ['interaction', 'neutral'],
};
function emphasis(name: string): { e: Emph; tone: string } | null {
  if (name === 'transparent') return { e: 'none', tone: '' };
  const l = LEGACY_EMPH[name]; if (l) return { e: l[0], tone: l[1] };
  if (/^neutral-(hover|pressed|selected|selected-hover)$/.test(name)) return { e: 'interaction', tone: 'neutral' };
  if (/^neutral-(track|well)$/.test(name) || /^(surface|bg|control|material)-/.test(name)) return { e: 'surface', tone: 'neutral' };
  const m = name.match(SLOT_RE);
  if (m) {
    const slot = m[2]!;
    if (slot === 'tint') return { e: 'tint', tone: m[1]! };
    if (slot.startsWith('soft')) return { e: 'soft', tone: m[1]! };
    if (slot.startsWith('solid')) return { e: 'solid', tone: m[1]! };
  }
  return null;
}
/** Which emphasis a state may move to from its rest emphasis (§2 transition rule 1: soft 3→4→5, solid 9→10, outline/text none→2→3). */
const ALLOWED: Record<Emph, Emph[]> = {
  none: ['none', 'tint', 'soft', 'interaction', 'surface'],
  tint: ['tint', 'soft'],
  soft: ['soft'],
  solid: ['solid'],
  interaction: ['interaction', 'surface'],
  surface: ['surface', 'interaction'],
};
const bgName = (util: string, known: Set<string>) => {
  if (!/^bg-/.test(util)) return null;
  const r = colorRefs(util, known)[0];
  return r ? r.name : (util === 'bg-transparent' ? 'transparent' : null);
};

// ── Helpers for CL4 / CL5 ──────────────────────────────────────────────────────────────────
const hasFocusToken = (util: string) => /(^|[^a-z])focus/.test(util.replace(/^-/, '')) || /--cs-(color-)?focus/.test(util);
function edgeProp(util: string, known: Set<string>): string | null {
  if (/^(shadow|ring|inset-shadow|inset-ring)(-|$)/.test(util) || /^focus-(ring|field)$/.test(util)) return 'box-shadow';
  if (/^border(-[xytrblse])?-/.test(util) && colorRefs(util, known).length) return 'border-color';
  if (/^outline-/.test(util) && colorRefs(util, known).length) return 'outline-color';
  return null;
}

// ── CL1–CL6 for one component ──────────────────────────────────────────────────────────────
export function checkComponent(id: string, sources: Source[], cfg: ColorConfig, known: Set<string> = knownColors()): RuleHit[] {
  const hits: RuleHit[] = []; const seen = new Set<string>();
  const hit = (h: RuleHit) => { const k = `${h.rule}|${h.where}|${h.actual ?? ''}|${h.rule === 'CL3' ? '' : h.message}`; if (!seen.has(k)) { seen.add(k); hits.push(h); } };
  const impl = sources.filter(s => !s.fixture);
  const occs = impl.flatMap(occurrences);

  for (const o of occs) {
    // CL1 · slot tokens only
    for (const r of colorRefs(o.util, known)) {
      if (r.name in LEGACY) hit({ rule: 'CL1', where: o.where, actual: o.cls, message: `"${r.name}" is a legacy colour name.`, fix: `Use ${LEGACY[r.name]}.` });
      else if (RAMP_RE.test(r.name)) hit({ rule: 'CL1', where: o.where, actual: o.cls, message: `"${r.name}" reads a colour ramp step directly.`, fix: 'Components read slots (--cs-{tone}-{slot}), neutral interaction, axis or family tokens; ramps stay inside the token build.' });
    }
    // CL2 · disabled is colour, not opacity
    const op = o.util.match(/^opacity-(\d+)$/);
    if (op && Number(op[1]) < 100 && o.kinds.has('disabled'))
      hit({ rule: 'CL2', where: o.where, actual: o.cls, message: 'Disabled state uses opacity; the tone only fades instead of dropping out.', fix: 'Use the disabled axis: bg-disabled-fill, text-disabled-text, border/shadow with --cs-disabled-border.' });
    // CL4 · selection never borrows the focus ring
    if (o.kinds.has('selected') && !o.kinds.has('focus') && hasFocusToken(o.util))
      hit({ rule: 'CL4', where: o.where, actual: o.cls, message: 'Selected state is drawn with a focus token, so focus and selection look the same.', fix: 'Draw selection with --cs-selection-edge (border 7/8) plus a check mark; keep focus-ring for focus only.' });
  }

  // Units: cva base ∪ each variant value, one cn() call, or one standalone string.
  const units = new Map<string, Occ[]>();
  for (const o of occs) for (const u of o.units) { const l = units.get(u) ?? []; l.push(o); units.set(u, l); }
  for (const list of units.values()) {
    list.sort((a, b) => a.order - b.order);
    // CL3 · state stays inside its emphasis and tone
    const isRest = (o: Occ) => o.variants.length === 0 && o.kinds.size === 0;
    const isState = (o: Occ) => !o.kinds.has('other') && !o.kinds.has('focus') && !o.kinds.has('disabled') && !o.kinds.has('invalid') && o.kinds.size > 0;
    let rest: { name: string; o: Occ } | null = null, selected: { name: string; o: Occ } | null = null;
    for (const o of list) {
      const n = bgName(o.util, known); if (!n) continue;
      if (isRest(o)) rest = { name: n, o };
      else if (isState(o) && o.kinds.has('selected') && !o.kinds.has('hover') && !o.kinds.has('pressed')) selected = { name: n, o };
    }
    for (const o of list) {
      if (!isState(o)) continue;
      const n = bgName(o.util, known); if (!n) continue;
      const base = o.kinds.has('selected') && (o.kinds.has('hover') || o.kinds.has('pressed')) && selected && selected.o !== o ? selected : rest;
      const from = emphasis(base?.name ?? 'transparent'), to = emphasis(n);
      if (!from || !to) continue;
      const state = [...o.kinds].join('+');
      // Emphasis jumps: hover and pressed always; a selected state only when it starts from a soft-like fill
      // (a checkbox, switch or selected day turning solid is the axis's on state, §2 matrix).
      const pureSelected = o.kinds.has('selected') && !o.kinds.has('hover') && !o.kinds.has('pressed');
      const checkJump = !pureSelected || ['soft', 'tint', 'interaction', 'solid'].includes(from.e);
      if (checkJump && !ALLOWED[from.e].includes(to.e))
        hit({ rule: 'CL3', where: o.where, actual: o.cls, expected: `${from.e} emphasis (${ALLOWED[from.e].join(' / ')})`, message: `${state} jumps from ${from.e} (${base?.name ?? 'no fill'}) to ${to.e} (${n}).`, fix: 'Hover and pressed move inside the rest emphasis (soft 3→4→5, solid 9→10); a destructive action is a solid button from the start.' });
      // A toned rest keeps its tone (a neutral control turning accent when checked is the on state, not a tone change).
      else if (from.e !== 'none' && from.tone && from.tone !== 'neutral' && to.tone && from.tone !== to.tone)
        hit({ rule: 'CL3', where: o.where, actual: o.cls, expected: `tone ${from.tone}`, message: `${state} changes the tone from ${from.tone} to ${to.tone}.`, fix: 'The tone never changes with state; use the same tone\'s soft-pressed / solid-hover slot.' });
    }
    // CL5 · invalid edge is danger border-strong and coexists with focus
    const inv = list.filter(o => o.kinds.has('invalid') && !o.kinds.has('focus') && edgeProp(o.util, known));
    const foc = list.filter(o => o.kinds.has('focus') && !o.kinds.has('invalid') && edgeProp(o.util, known) && hasFocusToken(o.util));
    const both = list.filter(o => o.kinds.has('invalid') && o.kinds.has('focus') && edgeProp(o.util, known));
    for (const o of both) {
      if (!hasFocusToken(o.util)) hit({ rule: 'CL5', where: o.where, actual: o.cls, message: 'Invalid + focus draws only the invalid edge: the focus ring disappears.', fix: 'In the invalid + focus state keep both: the danger border-strong edge and the outer focus ring (var(--cs-focus)).' });
      if (!colorRefs(o.util, known).some(r => r.name.startsWith('danger-'))) hit({ rule: 'CL5', where: o.where, actual: o.cls, message: 'Invalid + focus draws only the focus ring: the invalid edge disappears.', fix: 'Keep the danger border-strong edge next to the focus ring.' });
    }
    for (const o of inv) {
      const p = edgeProp(o.util, known);
      if (foc.some(f => edgeProp(f.util, known) === p) && !both.some(b => edgeProp(b.util, known) === p))
        hit({ rule: 'CL5', where: o.where, actual: o.cls, message: `Invalid and focus both set ${p} with no combined invalid + focus rule; one erases the other.`, fix: 'Add an invalid + focus class that draws both, or draw invalid on another property (border-color) than focus (box-shadow).' });
    }
    for (const o of [...inv, ...both]) {
      const refs = colorRefs(o.util, known).filter(r => !/^focus|^elevation/.test(r.name));
      if (refs.length && !refs.some(r => r.name === 'danger-border-strong'))
        hit({ rule: 'CL5', where: o.where, actual: o.cls, expected: 'danger-border-strong', message: `Invalid edge uses ${refs.map(r => r.name).join(', ')}.`, fix: 'Invalid is the danger subtle border (step 7): --cs-danger-border-strong.' });
    }
  }

  // CL6 · literal colours (string literals in component code are already blocked by G2 literal-color;
  // this adds template literals in code and every fixture string, minus the allowlists).
  for (const s of sources) {
    const allowed = s.fixture ? listed(cfg.literalColorAllow.contentFixtures, id) : listed(cfg.literalColorAllow.colourMath, id);
    if (allowed) continue;
    const sf = ts.createSourceFile(s.rel, s.text, ts.ScriptTarget.Latest, true, s.rel.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const visit = (n: ts.Node) => {
      let text: string | null = null;
      if (ts.isTemplateExpression(n)) text = n.head.text + n.templateSpans.map(sp => sp.literal.text).join(' ');
      else if (s.fixture && (isStr(n) || ts.isJsxText(n))) text = n.text;
      if (text !== null && LITERAL_COLOR.test(text) && !ts.isImportDeclaration(n.parent))
        hit({ rule: 'CL6', where: `${s.rel}:${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1}`, actual: text.slice(0, 120), message: `Literal colour in ${s.fixture ? 'a fixture' : 'component code'}.`, fix: s.fixture ? 'Use tokens for UI chrome; list the fixture under literalColorAllow.contentFixtures only when the colour is user content.' : 'Use a slot token; colour-math components go under literalColorAllow.colourMath.' });
      if (!ts.isTemplateExpression(n)) ts.forEachChild(n, visit);
    };
    visit(sf);
  }
  return hits;
}

/** Reads components/<id>/ (code and fixture files). */
export function componentSources(id: string): Source[] {
  const dir = join(componentsDir, id);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter(f => /\.tsx?$/.test(f)).map(f => {
    const file = join(dir, f);
    return { rel: relative(root, file).replace(/\\/g, '/'), text: readFileSync(file, 'utf8'), fixture: f.includes('.fixture.') };
  });
}

function emit(c: Collector, gate: Gate, hits: RuleHit[], blocking: (r: RuleId) => boolean) {
  for (const h of hits) {
    const f = { gate, check: RULES[h.rule], where: h.where, message: h.message, ...(h.expected !== undefined ? { expected: h.expected } : {}), ...(h.actual !== undefined ? { actual: h.actual } : {}), ...(h.fix ? { fix: h.fix } : {}) };
    if (blocking(h.rule)) c.fail(f); else c.warn(f);
  }
}

/** G2 entry: CL1–CL6 for one component. */
export function colorLanguage(c: Collector, id: string, cfg = loadColorConfig()) {
  emit(c, 'G2', checkComponent(id, componentSources(id), cfg), r => isBlocking(cfg, r, id));
}

// ── CL7 · slot contrast pairs ──────────────────────────────────────────────────────────────
type RGBA = [number, number, number, number]; // gamma sRGB 0–1 + alpha
function block(css: string, selector: string): string | null {
  const i = css.indexOf(selector + ' {'); if (i < 0) return null;
  let depth = 0;
  for (let j = css.indexOf('{', i); j < css.length; j++) {
    if (css[j] === '{') depth++;
    else if (css[j] === '}' && --depth === 0) return css.slice(css.indexOf('{', i) + 1, j);
  }
  return null;
}
const decls = (b: string | null) => new Map([...(b ?? '').matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]+);/g)].map(m => [m[1]!, m[2]!.trim()] as [string, string]));
function resolve(v: string, vars: Map<string, string>, depth = 0): string {
  if (depth > 12) return v;
  return v.replace(/var\((--[a-z0-9-]+)\s*(?:,\s*([^()]*))?\)/g, (_, name: string, fb?: string) => {
    const got = vars.get(name); return got !== undefined ? resolve(got, vars, depth + 1) : (fb ?? '');
  }).replace(/var\((--[a-z0-9-]+)\)/g, (_, name: string) => vars.get(name) ?? '');
}
const num = (s: string) => s.endsWith('%') ? parseFloat(s) / 100 : parseFloat(s);
const toGamma = (x: number) => x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
const toLinear = (x: number) => x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
export function parseColor(v: string): RGBA | null {
  const s = v.trim();
  const ok = s.match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+%?))?\s*\)$/);
  if (ok) {
    const L = num(ok[1]!), C = ok[2]!.endsWith('%') ? num(ok[2]!) * 0.4 : num(ok[2]!), h = (parseFloat(ok[3]!) * Math.PI) / 180;
    const a = C * Math.cos(h), b = C * Math.sin(h);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, q = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const lin = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * q, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * q, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * q];
    const [r, g, bl] = lin.map(x => toGamma(Math.min(1, Math.max(0, x)))) as [number, number, number];
    return [r, g, bl, ok[4] ? num(ok[4]) : 1];
  }
  const hex = s.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let h = hex[1]!; if (h.length <= 4) h = [...h].map(x => x + x).join('');
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
    return [n(0), n(2), n(4), h.length === 8 ? n(6) : 1];
  }
  return null;
}
/** Gamma-space source-over, as browsers composite. */
const over = (fg: RGBA, bg: RGBA): RGBA => [0, 1, 2].map(i => fg[i]! * fg[3] + bg[i]! * (1 - fg[3])).concat(1) as RGBA;
const lum = (c: RGBA) => 0.2126 * toLinear(c[0]) + 0.7152 * toLinear(c[1]) + 0.0722 * toLinear(c[2]);
export const contrast = (a: RGBA, b: RGBA) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

const CONTRAST_TONES = ['accent', 'neutral', 'success', 'warning', 'danger', 'info', 'agent'];
/** CL7 over a token stylesheet (dist/caustic.css): light = :root, dark = :root[data-theme="dark"] over light. */
export function slotContrast(css: string): { hits: RuleHit[]; checked: number } {
  const light = decls(block(css, ':root'));
  const dark = new Map([...light, ...decls(block(css, ':root[data-theme="dark"]'))]);
  const hits: RuleHit[] = []; let checked = 0, newSlots = 0;
  for (const [theme, vars] of [['light', light], ['dark', dark]] as const) {
    const color = (name: string) => { for (const v of [`--cs-color-${name}`, `--cs-${name}`]) { const raw = vars.get(v); if (raw !== undefined) { const c = parseColor(resolve(raw, vars)); if (c) return c; } } return null; };
    const surface = color('surface-base'); if (!surface) continue;
    const flat = (c: RGBA) => over(c, surface);
    for (const tone of CONTRAST_TONES) {
      if (color(`${tone}-graphic`) || color(`${tone}-soft-hover`)) newSlots++;
      const pairs: [string, string, number][] = [
        [`${tone}-text`, `${tone}-soft`, 4.5], [`${tone}-text`, `${tone}-soft-hover`, 4.5], [`${tone}-text`, `${tone}-soft-pressed`, 4.5], [`${tone}-text`, 'surface-base', 4.5],
        [`${tone}-on`, `${tone}-solid`, tone === 'accent' || tone === 'danger' ? 4.5 : 3], [`${tone}-graphic`, 'surface-base', 3],
      ];
      for (const [fgN, bgN, min] of pairs) {
        const fg = color(fgN), bgRaw = color(bgN); if (!fg || !bgRaw) continue;
        const bg = flat(bgRaw); const ratio = contrast(over(fg, bg), bg); checked++;
        if (ratio + 1e-9 < min) hits.push({ rule: 'CL7', where: `${theme} · ${fgN} on ${bgN}`, expected: `≥ ${min}`, actual: ratio.toFixed(2), message: `${fgN} on ${bgN} (${theme}) is ${ratio.toFixed(2)}:1.`, fix: 'Fix the ramp in packages/tokens (step 11 text, 8 graphic, on colour); components cannot fix contrast.' });
      }
    }
  }
  if (!newSlots) hits.push({ rule: 'CL7', where: 'packages/tokens/dist/caustic.css', message: `Slot tokens (--cs-{tone}-graphic / -soft-hover) are not in the token build yet; only ${checked} legacy pairs were checked.`, fix: 'Rebuild tokens after the slot ramps land (pnpm tokens).' });
  return { hits, checked };
}

/** G0 entry: CL7 once per gate run. */
export function colorContrast(c: Collector, cfg = loadColorConfig()) {
  const f = join(tokensDist, 'caustic.css'); if (!existsSync(f)) return;
  // The "slots not built yet" notice never blocks; only a measured pair below its floor does.
  const hits = slotContrast(readFileSync(f, 'utf8')).hits;
  for (const h of hits) emit(c, 'G0', [h], () => cfg.contrastBlocking && h.expected !== undefined);
}
