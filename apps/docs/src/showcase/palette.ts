// The neutral base and the palette helpers of the lab pages (builder, decisions): ramps, role steps, semantic variables.
import { contrast, css, ensure, gamutMap, over, contrastLin, linRgb, type LCH } from './color.ts';
import { cssVar, parseSpec, REFS, resolveSpec, SHIPPED, type RampSet } from './shipped.ts';

export type Theme = 'light' | 'dark';
export type Swatch = { name: string; light: LCH; dark: LCH };
/** 11 steps. Step 1 is the background end (lightest in light, darkest in dark), step 11 the strongest text. */
export type Ramp = readonly [LCH, LCH, LCH, LCH, LCH, LCH, LCH, LCH, LCH, LCH, LCH];

export interface Palette {
  id: string;
  name: string;
  /** Each mode has its own neutral ramp; dark is tuned for the dark ladder, not a flipped light ramp. */
  neutralLight: Ramp;
  neutralDark: Ramp;
  accent: Swatch; success: Swatch; warning: Swatch; danger: Swatch; info: Swatch;
  /** Agent gradient: the Ask agent border, agent progress, glow and avatar ring. */
  spectrum: [Swatch, Swatch, Swatch];
  /** Extra chart series 5-6, illustrations and empty states. */
  extras: [Swatch, Swatch];
}

const s = (name: string, light: LCH, dark: LCH = light): Swatch => ({ name, light, dark });

const ramp = (ls: readonly number[], c = 0, h = 0): Ramp => ls.map(l => [l, c, h] as LCH) as unknown as Ramp;

/**
 * Which step each neutral role reads. Text, borders and controls share a step number in both modes;
 * the background ladder and the ink button differ because light lifts surfaces to white above a darker canvas,
 * while dark lifts them away from the darkest canvas.
 */
export const NEUTRAL_ROLES: { role: string; light: number; dark: number }[] = [
  { role: 'surface base', light: 1, dark: 3 },
  { role: 'surface raised', light: 1, dark: 4 },
  { role: 'bg app', light: 2, dark: 2 },
  { role: 'bg canvas', light: 3, dark: 1 },
  { role: 'control off · border control · text disabled', light: 6, dark: 6 },
  { role: 'text placeholder', light: 8, dark: 8 },
  { role: 'text tertiary', light: 9, dark: 9 },
  { role: 'text secondary', light: 10, dark: 10 },
  { role: 'text primary', light: 11, dark: 11 },
  { role: 'ink button', light: 11, dark: 5 },
];

/**
 * Deep Black's dark ramp. The owner kept the role links (canvas 1, app 2, surface 3, raised 4) and asked for steps 2–11
 * a little darker instead; 'more' is the shipped one (owner, 2026-10-25; read from tokens.mjs `neutral.dark`),
 * the other two stay for comparison in the lab.
 */
export const DARK_RAMPS: Record<'subtle' | 'more' | 'previous', readonly number[]> = {
  subtle: [0.09, 0.145, 0.195, 0.245, 0.365, 0.545, 0.605, 0.655, 0.71, 0.8, 0.965],
  more: SHIPPED.neutral.dark,
  previous: [0.09, 0.16, 0.215, 0.27, 0.39, 0.56, 0.62, 0.67, 0.72, 0.81, 0.97],
};
export type DarkRamp = keyof typeof DARK_RAMPS;
export const darkRamp = (k: DarkRamp): Ramp => ramp([...DARK_RAMPS[k]]);

/**
 * The Deep Black neutral base the builder and the decisions page start from (builder/state.ts BASE). Only its neutral
 * ramps matter: the builder replaces every hued colour with its own picks (toPalette); the hued swatches below are
 * placeholders that keep the Palette shape whole.
 *
 * The temporary palette set that used to live here (Lagoon, Signal Grey, Tape, Pad, Panel, Coral Field, Dual Signal)
 * and its page (#/palettes) were removed on 2026-10-26. The Signal Grey colours are archived at
 * https://claude.ai/artifact/R9WV7fQ2aCBACuxyNXVx4o
 */
export const DEEP_BLACK: Palette = {
  id: 'deep', name: 'Deep Black',
  neutralLight: ramp(SHIPPED.neutral.light),
  neutralDark: darkRamp('more'),
  accent: s('Deep Black', [0.11, 0, 0], [0.97, 0, 0]),
  success: s('Pad Green', [0.55, 0.085, 155], [0.77, 0.085, 155]),
  warning: s('Tape Yellow', [0.66, 0.1, 95], [0.82, 0.1, 95]),
  danger: s('Signal Orange', [0.54, 0.13, 40], [0.72, 0.11, 40]),
  info: s('Panel Blue', [0.53, 0.075, 235], [0.75, 0.07, 235]),
  spectrum: [s('Signal', [0.78, 0.09, 55], [0.74, 0.09, 55]), s('Panel', [0.78, 0.06, 235], [0.75, 0.06, 235]), s('Pad', [0.8, 0.08, 150], [0.76, 0.08, 150])],
  extras: [s('Knob Orange', [0.64, 0.12, 50], [0.72, 0.11, 50]), s('Dust Blue', [0.6, 0.07, 240], [0.72, 0.065, 240])],
};

/** The neutral ramp of a mode. */
export function neutralsFor(p: Palette, t: Theme): Ramp {
  return t === 'light' ? p.neutralLight : p.neutralDark;
}
const step = (p: Palette, t: Theme, n: number): LCH => neutralsFor(p, t)[n - 1]!;
const roleStep = (role: string, t: Theme) => NEUTRAL_ROLES.find(r => r.role === role)![t];
/** The step a role reads in a mode. */
export const roleStepOf = (_p: Palette, t: Theme, role: string) => roleStep(role, t);
const N = (p: Palette, t: Theme, role: string) => step(p, t, roleStepOf(p, t, role));

// ---------- derivation ----------

export interface Resolved {
  surface: LCH; bgApp: LCH; ink: LCH; paper: LCH;
  role: Record<'accent' | 'success' | 'warning' | 'danger' | 'info', {
    solid: LCH; hover: LCH; on: LCH; text: LCH; softBase: LCH; softAlpha: number; softBg: number[];
  }>;
}

export function surfaceFor(p: Palette, t: Theme): LCH {
  return N(p, t, 'surface base');
}

export function resolve(p: Palette, t: Theme): Resolved {
  const surface = surfaceFor(p, t);
  const bgApp = N(p, t, 'bg app');
  // labels on fills use the light ramp's two ends, so a label never picks up hue
  const ink = neutralsFor(p, 'light')[10];
  const paper = neutralsFor(p, 'light')[0];
  const make = (sw: Swatch) => {
    const solid = gamutMap(sw[t]);
    const on = contrast(ink, solid) >= contrast(paper, solid) ? ink : paper;
    const dl = t === 'light' ? (solid[0] < 0.4 ? 0.12 : -0.05) : (solid[0] > 0.9 ? -0.08 : 0.05);
    const hover: LCH = [Math.min(0.97, Math.max(0.05, solid[0] + dl)), solid[1], solid[2]];
    const text = ensure(ensure(solid, surface, 4.5), bgApp, 4.5);
    const softAlpha = t === 'light' ? 0.16 : sw === p.accent ? 0.13 : 0.2;
    // keep text legible on its own tinted background, too
    const softBg = over(solid, softAlpha, surface);
    let tx = text;
    for (let i = 0; i < 60 && contrastLin(linRgb(tx), softBg) < 4.5; i++) tx = nudge(tx, t);
    return { solid, hover, on, text: tx, softBase: solid, softAlpha, softBg };
  };
  return { surface, bgApp, ink, paper, role: { accent: make(p.accent), success: make(p.success), warning: make(p.warning), danger: make(p.danger), info: make(p.info) } };
}
const nudge = (c: LCH, t: Theme): LCH => gamutMap([c[0] + (t === 'light' ? -0.01 : 0.01), c[1], c[2]]);

/** Every neutral semantic variable, read from the mode's own ramp. */
function neutralVars(p: Palette, t: Theme, v: Record<string, string>) {
  const n = (role: string) => css(N(p, t, role));
  const at = (k: number) => css(step(p, t, k));
  const strong = step(p, t, 11);
  const paper = neutralsFor(p, 'light')[0];
  const a = (al: number) => css(t === 'light' ? strong : [1, 0, 0], al);
  for (let i = 1; i <= 11; i++) {
    v[`--cs-neutral-light-${i}`] = css(neutralsFor(p, 'light')[i - 1]!);
    v[`--cs-neutral-dark-${i}`] = css(neutralsFor(p, 'dark')[i - 1]!);
  }
  v['--cs-color-bg-app'] = n('bg app');
  v['--cs-color-bg-canvas'] = n('bg canvas');
  v['--cs-color-bg-inset'] = t === 'light' ? css(strong, 0.04) : css([0, 0, 0], 0.3);
  v['--cs-color-bg-scrim'] = t === 'light' ? css(strong, 0.24) : css([0, 0, 0], 0.5);
  const base = n('surface base'), raised = n('surface raised');
  for (const k of ['surface-base', 'surface-translucent'] as const) v[`--cs-color-${k}`] = base;
  for (const k of ['surface-raised', 'surface-raised-translucent', 'control-raised'] as const) v[`--cs-color-${k}`] = raised;
  for (const k of ['ultrathin', 'thin', 'regular', 'thick'] as const) v[`--cs-color-material-${k}`] = raised;
  v['--cs-color-text-primary'] = n('text primary');
  v['--cs-color-text-secondary'] = n('text secondary');
  v['--cs-color-text-tertiary'] = n('text tertiary');
  v['--cs-color-text-placeholder'] = n('text placeholder');
  const six = n('control off · border control · text disabled');
  v['--cs-color-disabled-text'] = six;
  v['--cs-color-border-control'] = six;
  v['--cs-color-control-off'] = six;
  v['--cs-color-text-inverse'] = t === 'light' ? at(1) : at(2);
  v['--cs-color-border-subtle'] = a(0.05);
  v['--cs-color-border-default'] = a(t === 'light' ? 0.08 : 0.07);
  v['--cs-color-border-strong'] = a(t === 'light' ? 0.13 : 0.12);
  v['--cs-color-neutral-hover'] = a(t === 'light' ? 0.045 : 0.05);
  v['--cs-color-neutral-pressed'] = a(t === 'light' ? 0.075 : 0.08);
  v['--cs-color-neutral-selected'] = a(t === 'light' ? 0.11 : 0.12);
  v['--cs-color-neutral-selected-hover'] = a(t === 'light' ? 0.145 : 0.16);
  v['--cs-color-neutral-track'] = a(t === 'light' ? 0.075 : 0.08);
  v['--cs-color-neutral-well'] = a(t === 'light' ? 0.035 : 0.04);
  v['--cs-color-control-thumb'] = css(paper);
  v['--cs-color-control-raised-hover'] = t === 'light' ? at(2) : at(5);
  v['--cs-color-control-edge'] = a(t === 'light' ? 0.07 : 0.06);
  v['--cs-color-ink-solid'] = n('ink button');
  v['--cs-color-ink-solid-hover'] = t === 'light' ? at(10) : at(6);
  v['--cs-color-ink-on'] = css(paper);
  v['--cs-color-ink-on-muted'] = css(paper, 0.75);
  v['--cs-color-canvas-dot'] = a(t === 'light' ? 0.13 : 0.08);
  v['--cs-color-canvas-handle'] = css(paper);
  v['--cs-color-canvas-label'] = n('text tertiary');
  v['--cs-color-canvas-checker-a'] = t === 'light' ? at(1) : at(4);
  v['--cs-color-canvas-checker-b'] = t === 'light' ? at(3) : at(5);
  v['--cs-color-canvas-artboard'] = css(paper);
  v['--cs-color-identity-slate'] = t === 'light' ? at(9) : at(6);
  v['--cs-color-identity-on'] = css(paper);
  // Every other neutral token (the neutral tone slots tint … text and on, disabled-*, selection-edge …) reads the
  // palette's own neutral ramps with the shipped step mapping (tokens.mjs `themes`).
  const lr = neutralsFor(p, 'light'), dr = neutralsFor(p, 'dark');
  const set: RampSet = { neutral: { light: { steps: lr, on: bestOn(lr[8], p) }, dark: { steps: dr, on: bestOn(dr[8], p) } } };
  for (const [name, spec] of Object.entries(SHIPPED.themes[t])) {
    const key = cssVar(name), ramp = parseSpec(spec).ramp;
    if (key in v || !(ramp === 'neutral' || ramp === 'neutral-light' || ramp === 'neutral-dark')) continue;
    const r = resolveSpec(spec, t, set)!;
    v[key] = css(r.c, r.alpha < 1 ? r.alpha : undefined);
  }
}

/** CSS variable overrides: semantic tokens only, so ramp renames underneath cannot break them. */
export function paletteVars(p: Palette, t: Theme): Record<string, string> {
  const r = resolve(p, t);
  const v: Record<string, string> = {};
  neutralVars(p, t, v);
  const A = r.role.accent;
  const a = (c: LCH, al: number) => css(c, al);
  // Shipped names only: the old names (accent-fill, accent-hover, text-link, fill-*, diff-add …) are aliases that read these.
  v['--cs-color-accent-solid'] = css(A.solid);
  v['--cs-color-accent-solid-hover'] = css(A.hover);
  v['--cs-color-accent-on'] = css(A.on);
  v['--cs-color-accent-text'] = css(A.text);
  v['--cs-color-accent-soft'] = a(A.solid, A.softAlpha);
  v['--cs-color-accent-tint'] = a(A.solid, 0.09);
  // the old alpha accent border is the border-strong slot now (border is the uniform step-6 slot)
  v['--cs-color-accent-border-strong'] = a(A.solid, 0.5);
  v['--cs-color-focus-ring'] = css(contrast(A.solid, r.surface) >= 3 ? A.solid : A.text);
  v['--cs-color-canvas-selection'] = css(A.solid);
  v['--cs-color-canvas-selection-on'] = css(A.on);
  v['--cs-color-canvas-hover'] = a(A.solid, 0.6);
  v['--cs-color-canvas-marquee'] = a(A.solid, 0.14);
  for (const k of ['success', 'warning', 'danger', 'info'] as const) {
    const x = r.role[k];
    v[`--cs-color-${k}-solid`] = css(x.solid);
    v[`--cs-color-${k}-on`] = css(x.on);
    v[`--cs-color-${k}-text`] = css(x.text);
    v[`--cs-color-${k}-soft`] = a(x.solid, x.softAlpha);
  }
  v['--cs-color-diff-add-bg'] = a(r.role.success.solid, t === 'light' ? 0.22 : 0.2);
  v['--cs-color-diff-remove-bg'] = a(r.role.danger.solid, t === 'light' ? 0.18 : 0.2);
  v['--cs-color-diff-add-text'] = css(r.role.success.text);
  v['--cs-color-diff-remove-text'] = css(r.role.danger.text);
  v['--cs-color-canvas-guide'] = css(r.role.danger.solid);
  v['--cs-color-canvas-guide-on'] = css(r.role.danger.on);
  v['--cs-color-canvas-guide-user'] = css(r.role.info.solid);
  v['--cs-color-chart-1'] = css(A.solid);
  v['--cs-color-chart-2'] = css(r.role.info.solid);
  v['--cs-color-chart-3'] = css(r.role.success.solid);
  v['--cs-color-chart-4'] = css(r.role.warning.solid);
  v['--cs-color-chart-5'] = css(p.extras[0][t]);
  v['--cs-color-chart-6'] = css(p.extras[1][t]);
  v['--cs-color-identity-coral'] = css(r.role.danger.text);
  v['--cs-color-identity-iris'] = css(r.role.info.text);
  v['--cs-color-identity-mint'] = css(r.role.success.text);
  v['--cs-color-identity-amber'] = css(r.role.warning.text);
  v['--cs-color-agent-glow'] = a(p.spectrum[0][t], 0.45);
  v['--cs-color-agent-stop-1'] = css(p.spectrum[0][t]);
  v['--cs-color-agent-stop-2'] = css(p.spectrum[1][t]);
  v['--cs-color-agent-stop-3'] = css(p.spectrum[2][t]);
  return v;
}

/** Ink or paper, whichever reads better on `c`. */
export function bestOn(c: LCH, p: Palette): LCH {
  const lr = neutralsFor(p, 'light');
  return contrast(lr[10], c) >= contrast(lr[0], c) ? lr[10] : lr[0];
}

/**
 * Variables that read other variables resolve where they are declared (:root), so a scoped wrapper must restate them:
 * the `--color-*` twins Tailwind utilities read, the "=" references (old alias names such as text-link and fill-hover,
 * focus-offset, required-mark) unless the wrapper sets them itself, and the derived focus / spectrum / agent vars.
 */
export function scopeVars(vars: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = { ...vars };
  for (const [k, target] of Object.entries(REFS)) if (!(k in out)) out[k] = `var(${target})`;
  for (const i of [1, 2, 3]) out[`--cs-spectrum-${i}`] ??= `var(--cs-color-agent-stop-${i})`;
  for (const [k, val] of Object.entries(out)) if (k.startsWith('--cs-color-')) out[`--color-${k.slice('--cs-color-'.length)}`] = val;
  const stop = (i: number) => `var(--cs-color-agent-stop-${i})`;
  out['--cs-spectrum-conic'] = `conic-gradient(from var(--cs-spin, 0deg), ${stop(1)}, ${stop(2)}, ${stop(3)}, ${stop(1)})`;
  out['--cs-spectrum-linear'] = `linear-gradient(90deg, ${stop(1)}, ${stop(2)}, ${stop(3)}, ${stop(1)})`;
  out['--cs-focus-field'] = 'inset 0 0 0 1px var(--cs-color-border-default)';
  out['--cs-focus'] = '0 0 0 1px var(--cs-color-focus-offset), 0 0 0 3px var(--cs-color-focus-ring)';
  out['--cs-elevation-agent'] = '0 8px 30px -12px var(--cs-color-agent-glow)';
  out['--shadow-focus-field'] = 'var(--cs-focus-field)';
  out['--shadow-focus'] = 'var(--cs-focus)';
  out['--shadow-agent'] = 'var(--cs-elevation-agent)';
  return out;
}
