// Builder state: every non-neutral colour of a palette, per theme, starting from Signal Grey · Deep Black.
// Neutrals stay locked to Deep Black's two ramps; everything else goes through paletteVars() like the proposals.
import { css, gamutMap, type LCH } from '../color.ts';
import { langVars } from './language.ts';
import { darkRamp, paletteById, paletteVars, resolve, type DarkRamp, type Palette, type Swatch, type Theme } from '../palettes.ts';

export const BASE = paletteById('deep');

export type ColorKey = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'agent1' | 'agent2' | 'agent3' | 'extra1' | 'extra2';

export interface ColorDef { key: ColorKey; name: string; group: 'Accent' | 'Status' | 'Agent gradient' | 'Extra chart / illustration'; uses: string }

export const COLORS: ColorDef[] = [
  { key: 'accent', name: 'Accent ink', group: 'Accent', uses: 'Primary buttons, selection, focus ring, switches, links, chart series 1.' },
  { key: 'success', name: 'Success', group: 'Status', uses: 'Passing checks, added lines, done steps, chart series 3.' },
  { key: 'warning', name: 'Warning', group: 'Status', uses: 'Review states, near-limit meters, chart series 4.' },
  { key: 'danger', name: 'Danger', group: 'Status', uses: 'Errors, removed lines, destructive actions, canvas guides.' },
  { key: 'info', name: 'Info', group: 'Status', uses: 'Notices, invited states, user guides, chart series 2.' },
  { key: 'agent1', name: 'Agent gradient 1', group: 'Agent gradient', uses: 'Ask agent border, agent progress, glow and avatar ring (also the glow colour).' },
  { key: 'agent2', name: 'Agent gradient 2', group: 'Agent gradient', uses: 'Second stop of the agent gradient.' },
  { key: 'agent3', name: 'Agent gradient 3', group: 'Agent gradient', uses: 'Third stop of the agent gradient.' },
  { key: 'extra1', name: 'Extra 1', group: 'Extra chart / illustration', uses: 'Chart series 5, illustrations and empty states.' },
  { key: 'extra2', name: 'Extra 2', group: 'Extra chart / illustration', uses: 'Chart series 6, illustrations and empty states.' },
];

export interface ColorState { light: LCH; dark: LCH; /** dark follows light with this lightness shift */ link: boolean; shift: number }

export interface BuilderState {
  v: 1;
  colors: Record<ColorKey, ColorState>;
  /** null: derived from the solid like the proposals. */
  accentHover: { light: LCH | null; dark: LCH | null };
  diffAlpha: { add: { light: number; dark: number }; remove: { light: number; dark: number } };
  /** Which Deep Black neutral-dark ramp to use: 'subtle' is the decided default, the others are for comparison. */
  darkRamp: DarkRamp;
  /** 'proposed': each colour gets a 1–11 ramp per mode and the semantic variables read slots (PROPOSAL-color-language.md). */
  language: 'current' | 'proposed';
}

const swatchOf = (k: ColorKey, p: Palette): Swatch => {
  if (k === 'agent1') return p.spectrum[0];
  if (k === 'agent2') return p.spectrum[1];
  if (k === 'agent3') return p.spectrum[2];
  if (k === 'extra1') return p.extras[0];
  if (k === 'extra2') return p.extras[1];
  return p[k];
};

export function initialState(): BuilderState {
  const colors = {} as Record<ColorKey, ColorState>;
  for (const { key } of COLORS) {
    const sw = swatchOf(key, BASE);
    colors[key] = { light: sw.light, dark: sw.dark, link: false, shift: round(sw.dark[0] - sw.light[0]) };
  }
  return {
    v: 1, colors, accentHover: { light: null, dark: null },
    diffAlpha: { add: { light: 0.22, dark: 0.2 }, remove: { light: 0.18, dark: 0.2 } },
    darkRamp: 'subtle',
    language: 'current',
  };
}

export const round = (n: number, d = 3) => Math.round(n * 10 ** d) / 10 ** d;
const clampL = (l: number) => Math.min(1, Math.max(0, l));

/** The dark value a linked colour gets from its light value. */
export const linkedDark = (c: ColorState): LCH => [round(clampL(c.light[0] + c.shift)), c.light[1], c.light[2]];

/** Effective value for a theme (a linked dark follows light). */
export function valueOf(c: ColorState, t: Theme): LCH {
  return t === 'dark' && c.link ? linkedDark(c) : c[t];
}

export function toPalette(s: BuilderState): Palette {
  const sw = (k: ColorKey, name: string): Swatch => ({ name, light: valueOf(s.colors[k], 'light'), dark: valueOf(s.colors[k], 'dark') });
  return {
    ...BASE, id: 'builder', name: 'Builder',
    neutralDark: darkRamp(s.darkRamp),
    accent: sw('accent', 'Accent'), success: sw('success', 'Success'), warning: sw('warning', 'Warning'),
    danger: sw('danger', 'Danger'), info: sw('info', 'Info'),
    spectrum: [sw('agent1', 'Agent 1'), sw('agent2', 'Agent 2'), sw('agent3', 'Agent 3')],
    extras: [sw('extra1', 'Extra 1'), sw('extra2', 'Extra 2')],
  };
}

/** Semantic variable overrides for one theme: the proposals' derivation plus the builder's explicit overrides. */
export function builderVars(s: BuilderState, t: Theme): Record<string, string> {
  const p = toPalette(s);
  const v = paletteVars(p, t);
  const hover = s.accentHover[t];
  if (hover) { v['--cs-color-accent-hover'] = css(hover); v['--cs-color-accent-fill-hover'] = css(hover); }
  const r = resolve(p, t);
  v['--cs-color-diff-add'] = css(r.role.success.solid, s.diffAlpha.add[t]);
  v['--cs-color-diff-remove'] = css(r.role.danger.solid, s.diffAlpha.remove[t]);
  // the proposal replaces the alpha derivation (accent hover override still wins)
  if (s.language === 'proposed') Object.assign(v, langVars(p, t));
  if (hover && s.language === 'proposed') { v['--cs-color-accent-hover'] = css(hover); v['--cs-color-accent-fill-hover'] = css(hover); }
  return v;
}

/** The derived hover (what is used when no override is set). */
export const derivedHover = (s: BuilderState, t: Theme): LCH => resolve(toPalette(s), t).role.accent.hover;

// ---------- persistence and export ----------

export const STORAGE_KEY = 'caustic-lab-builder';

export function load(): BuilderState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return parse(raw);
  } catch { /* storage unavailable or bad JSON: start from Deep Black */ }
  return initialState();
}

export function save(s: BuilderState) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

const isLch = (x: unknown): x is LCH => Array.isArray(x) && x.length === 3 && x.every(n => typeof n === 'number' && Number.isFinite(n));

/** Accepts the builder's own JSON (missing keys fall back to Deep Black). Throws on anything else. */
export function parse(raw: string): BuilderState {
  const j = JSON.parse(raw) as Partial<BuilderState>;
  if (!j || typeof j !== 'object' || !j.colors) throw new Error('Not a builder export: "colors" is missing.');
  const base = initialState();
  for (const { key } of COLORS) {
    const c = (j.colors as Partial<Record<ColorKey, Partial<ColorState>>>)[key];
    if (!c) continue;
    if (isLch(c.light)) base.colors[key].light = c.light;
    if (isLch(c.dark)) base.colors[key].dark = c.dark;
    if (typeof c.link === 'boolean') base.colors[key].link = c.link;
    if (typeof c.shift === 'number') base.colors[key].shift = c.shift;
  }
  if (j.accentHover) {
    base.accentHover.light = isLch(j.accentHover.light) ? j.accentHover.light : null;
    base.accentHover.dark = isLch(j.accentHover.dark) ? j.accentHover.dark : null;
  }
  const a = j.diffAlpha;
  if (a?.add && a.remove) {
    for (const t of ['light', 'dark'] as const) {
      if (typeof a.add[t] === 'number') base.diffAlpha.add[t] = a.add[t];
      if (typeof a.remove[t] === 'number') base.diffAlpha.remove[t] = a.remove[t];
    }
  }
  if (j.darkRamp === 'subtle' || j.darkRamp === 'more' || j.darkRamp === 'previous') base.darkRamp = j.darkRamp;
  if (j.language === 'proposed' || j.language === 'current') base.language = j.language;
  return base;
}

/** Export for handing back: authored values per theme (linked darks resolved) plus the knobs. */
export function exportJson(s: BuilderState): string {
  const colors = {} as Record<ColorKey, { light: LCH; dark: LCH; link: boolean; shift: number }>;
  for (const { key } of COLORS) {
    const c = s.colors[key];
    colors[key] = { light: c.light, dark: valueOf(c, 'dark'), link: c.link, shift: c.shift };
  }
  return JSON.stringify({ v: 1, base: 'Signal Grey · Deep Black neutrals', colors, accentHover: s.accentHover, diffAlpha: s.diffAlpha,
    darkRamp: s.darkRamp, neutralDark: darkRamp(s.darkRamp).map(c => c[0]), language: s.language }, null, 2);
}

export function exportCss(s: BuilderState): string {
  const block = (t: Theme, sel: string) => {
    const v = builderVars(s, t);
    return `${sel} {\n${Object.entries(v).map(([k, val]) => `  ${k}: ${val};`).join('\n')}\n}`;
  };
  const links = ` · neutral-dark ${s.darkRamp}` + (s.language === 'proposed' ? ' · proposed colour language (--lang-* ramps, slots)' : '');
  return `/* Caustic lab builder export · neutrals: Signal Grey · Deep Black${links} */\n${block('light', ':root')}\n\n${block('dark', ':root[data-theme="dark"]')}\n`;
}

/** sRGB clip for display of out-of-gamut authored values. */
export const shown = (c: LCH) => gamutMap(c);
