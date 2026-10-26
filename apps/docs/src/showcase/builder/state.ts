// Builder state: every hued colour of the shipped language, per theme. Defaults are the shipped solids
// (packages/tokens/src/tokens.mjs `solids`, the owner's builder export of 2026-10-25) on Deep Black neutrals.
// Neutrals stay locked to Deep Black's ramps (only the dark ramp variant is selectable); everything else is derived
// from the picks by the token build's own rule (language.ts), so the default state reproduces the shipped tokens.
import { gamutMap, type LCH } from '../color.ts';
import { darkRamp, neutralsFor, paletteById, type DarkRamp, type Palette, type Swatch, type Theme } from '../palettes.ts';
import { emitLch, SHIPPED, type RampSet } from '../shipped.ts';
import { hueRamp, langRampSet, langVars, surfaceOf, type LangInput } from './language.ts';

export const BASE = paletteById('deep');

export type ColorKey = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'agent1' | 'agent2' | 'agent3' | 'extra1' | 'extra2' | 'guide';

export interface ColorDef { key: ColorKey; name: string; group: 'Accent' | 'Status' | 'Agent gradient' | 'Extra chart / illustration' | 'Canvas'; uses: string }

export const COLORS: ColorDef[] = [
  { key: 'accent', name: 'Accent', group: 'Accent', uses: 'Accent buttons, checks and switches, canvas selection, focus ring, links, chart series 1.' },
  { key: 'success', name: 'Success', group: 'Status', uses: 'Passing checks, added lines, done steps, syntax strings, chart series 3.' },
  { key: 'warning', name: 'Warning', group: 'Status', uses: 'Review states, permission, near-limit meters, chart series 4.' },
  { key: 'danger', name: 'Danger', group: 'Status', uses: 'Errors, removed lines, destructive actions, invalid fields.' },
  { key: 'info', name: 'Info', group: 'Status', uses: 'Notices, invited states, user guides, syntax keywords, chart series 2.' },
  { key: 'agent1', name: 'Agent gradient 1', group: 'Agent gradient', uses: 'The agent tone: Ask agent border, agent progress, glow and avatar ring; gradient stop 1.' },
  { key: 'agent2', name: 'Agent gradient 2', group: 'Agent gradient', uses: 'Second stop of the agent gradient.' },
  { key: 'agent3', name: 'Agent gradient 3', group: 'Agent gradient', uses: 'Third stop of the agent gradient.' },
  { key: 'extra1', name: 'Extra 1', group: 'Extra chart / illustration', uses: 'Chart series 5, syntax properties, illustrations and empty states.' },
  { key: 'extra2', name: 'Extra 2', group: 'Extra chart / illustration', uses: 'Chart series 6, illustrations and empty states.' },
  { key: 'guide', name: 'Canvas guide', group: 'Canvas', uses: 'Smart guides and their measurement labels on the canvas only.' },
];

/** The tokens.mjs `solids` ramp each builder colour is step 9 of. */
export const SOLID_OF: Record<ColorKey, string> = {
  accent: 'accent', success: 'success', warning: 'warning', danger: 'danger', info: 'info',
  agent1: 'agent-1', agent2: 'agent-2', agent3: 'agent-3', extra1: 'extra-1', extra2: 'extra-2', guide: 'canvas-guide',
};

export interface ColorState { light: LCH; dark: LCH; /** dark follows light with this lightness shift */ link: boolean; shift: number }

/** Version of the saved state; saved state of another version is ignored once (it predates the shipped defaults). */
export const STATE_VERSION = 2;

export interface BuilderState {
  v: typeof STATE_VERSION;
  colors: Record<ColorKey, ColorState>;
  /** Accent step 10 (solid-hover) per mode; null: derived from the solid like every other ramp. */
  accentHover: { light: LCH | null; dark: LCH | null };
  /** Which Deep Black neutral-dark ramp to use: 'more' (A bit more) is the shipped one, the others are for comparison. */
  darkRamp: DarkRamp;
}

export function initialState(): BuilderState {
  const colors = {} as Record<ColorKey, ColorState>;
  for (const { key } of COLORS) {
    const sw = SHIPPED.solids[SOLID_OF[key]]!;
    colors[key] = { light: sw.light, dark: sw.dark, link: false, shift: round(sw.dark[0] - sw.light[0]) };
  }
  return { v: STATE_VERSION, colors, accentHover: { light: null, dark: null }, darkRamp: 'more' };
}

export const round = (n: number, d = 3) => Math.round(n * 10 ** d) / 10 ** d;
const clampL = (l: number) => Math.min(1, Math.max(0, l));

/** The dark value a linked colour gets from its light value. */
export const linkedDark = (c: ColorState): LCH => [round(clampL(c.light[0] + c.shift)), c.light[1], c.light[2]];

/** Effective value for a theme (a linked dark follows light). */
export function valueOf(c: ColorState, t: Theme): LCH {
  return t === 'dark' && c.link ? linkedDark(c) : c[t];
}

/** The state as a palette (neutral ramps and the palette-shaped colours), for the neutral panel and the decision page. */
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

const neutralOf = (s: BuilderState): LangInput['neutral'] => {
  const p = toPalette(s);
  return { light: neutralsFor(p, 'light'), dark: neutralsFor(p, 'dark') };
};

/** The language input: every pick by its tokens.mjs ramp name, the neutral ramps, the hover override. */
export function langInput(s: BuilderState): LangInput {
  const solids: LangInput['solids'] = {};
  for (const { key } of COLORS) solids[SOLID_OF[key]] = { light: valueOf(s.colors[key], 'light'), dark: valueOf(s.colors[key], 'dark') };
  return { solids, neutral: neutralOf(s), accentHover: s.accentHover };
}

/** Every ramp, both modes, as the variables carry them. */
export const builderRamps = (s: BuilderState): RampSet => langRampSet(langInput(s));

/** Semantic variable overrides for one theme: the shipped names, generated from the builder's picks. */
export function builderVars(s: BuilderState, t: Theme): Record<string, string> {
  return langVars(langInput(s), t);
}

/** The derived accent hover (step 10, what is used when no override is set). */
export const derivedHover = (s: BuilderState, t: Theme): LCH =>
  emitLch(hueRamp(valueOf(s.colors.accent, t), t, surfaceOf(neutralOf(s), t))[9]!);

// ---------- persistence and export ----------

export const STORAGE_KEY = 'caustic-lab-builder';

export function load(): BuilderState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    // state saved before v2 previewed the retired "current" language with older colours: start from the shipped solids
    if (raw && (JSON.parse(raw) as { v?: unknown } | null)?.v === STATE_VERSION) return parse(raw);
  } catch { /* storage unavailable or bad JSON: start from the shipped solids */ }
  return initialState();
}

export function save(s: BuilderState) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

const isLch = (x: unknown): x is LCH => Array.isArray(x) && x.length === 3 && x.every(n => typeof n === 'number' && Number.isFinite(n));

/**
 * Accepts the builder's own JSON, any version (v1 exports with language "current" and diffAlpha included: their colours load,
 * the retired knobs are ignored). Missing keys fall back to the shipped solids. Throws on anything else.
 */
export function parse(raw: string): BuilderState {
  const j = JSON.parse(raw) as Partial<BuilderState> | null;
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
  if (j.darkRamp === 'subtle' || j.darkRamp === 'more' || j.darkRamp === 'previous') base.darkRamp = j.darkRamp;
  return base;
}

/** Export for handing back: authored values per theme (linked darks resolved) plus the knobs. Paste the solids into tokens.mjs. */
export function exportJson(s: BuilderState): string {
  const colors = {} as Record<ColorKey, { light: LCH; dark: LCH; link: boolean; shift: number }>;
  for (const { key } of COLORS) {
    const c = s.colors[key];
    colors[key] = { light: c.light, dark: valueOf(c, 'dark'), link: c.link, shift: c.shift };
  }
  return JSON.stringify({ v: STATE_VERSION, base: 'Signal Grey · Deep Black neutrals', language: 'proposed', colors, accentHover: s.accentHover,
    darkRamp: s.darkRamp, neutralDark: darkRamp(s.darkRamp).map(c => c[0]) }, null, 2);
}

export function exportCss(s: BuilderState): string {
  const block = (t: Theme, sel: string) => {
    const v = builderVars(s, t);
    return `${sel} {\n${Object.entries(v).map(([k, val]) => `  ${k}: ${val};`).join('\n')}\n}`;
  };
  return `/* Caustic lab builder export · neutrals: Deep Black · neutral-dark ${s.darkRamp} · per-mode 1–11 ramps, slot tokens (--lang-* are lab-only) */\n${block('light', ':root')}\n\n${block('dark', ':root[data-theme="dark"]')}\n`;
}

/** sRGB clip for display of out-of-gamut authored values. */
export const shown = (c: LCH) => gamutMap(c);
