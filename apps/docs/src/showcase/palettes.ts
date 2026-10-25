import { contrast, css, ensure, gamutMap, label, over, contrastLin, linRgb, type LCH } from './color.ts';

export type Theme = 'light' | 'dark';
export type Swatch = { name: string; light: LCH; dark: LCH };
/** 11 steps. Step 1 is the background end (lightest in light, darkest in dark), step 11 the strongest text. */
export type Ramp = readonly [LCH, LCH, LCH, LCH, LCH, LCH, LCH, LCH, LCH, LCH, LCH];

export interface Palette {
  id: string;
  name: string;
  concept: string;
  /** true = the shipped tokens, no overrides. */
  current?: boolean;
  /** Each mode has its own neutral ramp; dark is tuned for the dark ladder, not a flipped light ramp. */
  neutralLight?: Ramp;
  neutralDark?: Ramp;
  /** Overrides of the dark role→step links (role name as in NEUTRAL_ROLES); the ramp values stay. */
  accent: Swatch; success: Swatch; warning: Swatch; danger: Swatch; info: Swatch;
  /** Agent gradient: the Ask agent border, agent progress, glow and avatar ring. */
  spectrum: [Swatch, Swatch, Swatch];
  /** Extra chart series 5-6, illustrations and empty states. */
  extras: [Swatch, Swatch];
}

const s = (name: string, light: LCH, dark: LCH = light): Swatch => ({ name, light, dark });

/** Neutral chroma ceiling: a neutral may carry at most one drop of hue. */
export const NEUTRAL_MAX_C = 0.004;

const ramp = (ls: number[], c = 0, h = 0): Ramp => ls.map(l => [l, c, h] as LCH) as unknown as Ramp;
const LIGHT_L = [0.995, 0.975, 0.93, 0.875, 0.79, 0.6, 0.55, 0.5, 0.44, 0.32, 0.15];
const DARK_L = [0.105, 0.175, 0.23, 0.285, 0.4, 0.56, 0.62, 0.67, 0.72, 0.81, 0.965];

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
 * a little darker instead; 'subtle' is the default, the other two stay for comparison in the lab.
 */
export const DARK_RAMPS = {
  subtle: [0.09, 0.145, 0.195, 0.245, 0.365, 0.545, 0.605, 0.655, 0.71, 0.8, 0.965],
  more: [0.09, 0.135, 0.18, 0.225, 0.345, 0.535, 0.595, 0.645, 0.7, 0.795, 0.96],
  previous: [0.09, 0.16, 0.215, 0.27, 0.39, 0.56, 0.62, 0.67, 0.72, 0.81, 0.97],
} as const;
export type DarkRamp = keyof typeof DARK_RAMPS;
export const darkRamp = (k: DarkRamp): Ramp => ramp([...DARK_RAMPS[k]]);

const SIGNAL_STATUS = {
  success: s('Pad Green', [0.55, 0.085, 155], [0.77, 0.085, 155]),
  warning: s('Tape Yellow', [0.66, 0.1, 95], [0.82, 0.1, 95]),
  danger: s('Signal Orange', [0.54, 0.13, 40], [0.72, 0.11, 40]),
  info: s('Panel Blue', [0.53, 0.075, 235], [0.75, 0.07, 235]),
};
const BLACK = s('Black', [0.16, 0, 0], [0.96, 0, 0]);
const GREY = { neutralLight: ramp(LIGHT_L), neutralDark: ramp(DARK_L) };

export const palettes: Palette[] = [
  {
    id: 'current', name: 'Current', current: true,
    concept: 'As shipped: ramp steps peaking at chroma ~0.14. The baseline the others are judged against.',
    accent: s('Lagoon', [0.525, 0.135, 205], [0.735, 0.13, 205]),
    success: s('Mint', [0.525, 0.135, 158], [0.735, 0.13, 158]),
    warning: s('Amber', [0.635, 0.142, 72], [0.735, 0.13, 72]),
    danger: s('Coral', [0.525, 0.135, 25], [0.735, 0.13, 25]),
    info: s('Iris', [0.525, 0.135, 295], [0.735, 0.13, 295]),
    spectrum: [s('Lagoon', [0.8, 0.13, 205]), s('Mint', [0.86, 0.15, 158]), s('Sun', [0.87, 0.14, 80])],
    extras: [s('Slate', [0.48, 0.012, 260]), s('Lagoon 200', [0.88, 0.075, 205])],
  },
  {
    id: 'signal', name: 'Signal Grey',
    concept: 'The original: true-grey panels, black ink, one dusty orange signal with tape yellow and panel blue.',
    ...GREY, accent: BLACK, ...SIGNAL_STATUS,
    spectrum: [s('Signal', [0.78, 0.09, 55], [0.74, 0.09, 55]), s('Panel', [0.78, 0.06, 235], [0.75, 0.06, 235]), s('Pad', [0.8, 0.08, 150], [0.76, 0.08, 150])],
    extras: [s('Knob Orange', [0.64, 0.12, 50], [0.72, 0.11, 50]), s('Dust Blue', [0.6, 0.07, 240], [0.72, 0.065, 240])],
  },
  {
    id: 'deep', name: 'Signal Grey · Deep Black',
    concept: 'The original with denser ink: near-pure black accent and darker strong text, a slightly deeper dark canvas.',
    neutralLight: ramp([0.995, 0.975, 0.93, 0.875, 0.79, 0.6, 0.55, 0.5, 0.44, 0.29, 0.12]),
    neutralDark: darkRamp('subtle'),
    accent: s('Deep Black', [0.11, 0, 0], [0.97, 0, 0]), ...SIGNAL_STATUS,
    spectrum: [s('Signal', [0.78, 0.09, 55], [0.74, 0.09, 55]), s('Panel', [0.78, 0.06, 235], [0.75, 0.06, 235]), s('Pad', [0.8, 0.08, 150], [0.76, 0.08, 150])],
    extras: [s('Knob Orange', [0.64, 0.12, 50], [0.72, 0.11, 50]), s('Dust Blue', [0.6, 0.07, 240], [0.72, 0.065, 240])],
  },
  {
    id: 'tape', name: 'Tape',
    concept: 'Masking-tape yellow leads the agent gradient through straw into pad green; neutrals carry one drop of warmth.',
    neutralLight: ramp(LIGHT_L, 0.003, 90), neutralDark: ramp(DARK_L, 0.003, 90),
    accent: BLACK, ...SIGNAL_STATUS,
    spectrum: [s('Tape', [0.86, 0.1, 95], [0.82, 0.1, 95]), s('Straw', [0.82, 0.09, 75], [0.78, 0.09, 75]), s('Pad', [0.8, 0.08, 150], [0.76, 0.08, 150])],
    extras: [s('Mustard', [0.66, 0.11, 85], [0.76, 0.1, 85]), s('Olive', [0.58, 0.08, 125], [0.7, 0.08, 125])],
  },
  {
    id: 'pad', name: 'Pad',
    concept: 'Drum-pad green leads: lichen, pad and pool water, like a sampler with its green pads lit.',
    ...GREY, accent: BLACK, ...SIGNAL_STATUS,
    spectrum: [s('Pad', [0.8, 0.09, 155], [0.76, 0.09, 155]), s('Lichen', [0.83, 0.08, 120], [0.79, 0.08, 120]), s('Pool', [0.79, 0.07, 200], [0.75, 0.07, 200])],
    extras: [s('Moss', [0.58, 0.09, 145], [0.72, 0.085, 145]), s('Teal Dust', [0.6, 0.07, 195], [0.72, 0.065, 195])],
  },
  {
    id: 'panel', name: 'Panel',
    concept: 'Cool panel blue leads through lilac grey and ice: the calmest variant, hue reads as light on metal.',
    ...GREY, accent: BLACK, ...SIGNAL_STATUS,
    spectrum: [s('Panel', [0.78, 0.07, 240], [0.75, 0.07, 240]), s('Lilac', [0.78, 0.07, 290], [0.75, 0.07, 290]), s('Ice', [0.84, 0.06, 210], [0.8, 0.06, 210])],
    extras: [s('Cobalt Dust', [0.55, 0.085, 255], [0.7, 0.08, 255]), s('Periwinkle', [0.62, 0.08, 285], [0.73, 0.075, 285])],
  },
  {
    id: 'coral', name: 'Coral Field',
    concept: 'A warm red field: coral, rose and peach on the agent, brick reserved for danger so the two never meet.',
    ...GREY, accent: BLACK, ...SIGNAL_STATUS,
    danger: s('Brick', [0.5, 0.12, 30], [0.71, 0.1, 30]),
    spectrum: [s('Coral', [0.76, 0.1, 25], [0.73, 0.1, 25]), s('Rose', [0.78, 0.08, 355], [0.75, 0.08, 355]), s('Peach', [0.84, 0.08, 60], [0.8, 0.08, 60])],
    extras: [s('Salmon', [0.64, 0.11, 30], [0.73, 0.1, 30]), s('Dusk Rose', [0.6, 0.08, 350], [0.72, 0.075, 350])],
  },
  {
    id: 'dual', name: 'Dual Signal',
    concept: 'Two signals and nothing else: dusty orange and panel blue alternate on the agent, the charts and the art.',
    ...GREY, accent: BLACK, ...SIGNAL_STATUS,
    spectrum: [s('Signal', [0.76, 0.1, 50], [0.73, 0.1, 50]), s('Mist', [0.86, 0.03, 220], [0.8, 0.03, 220]), s('Panel', [0.74, 0.08, 240], [0.72, 0.08, 240])],
    extras: [s('Signal Orange', [0.62, 0.12, 48], [0.72, 0.11, 48]), s('Panel Blue', [0.56, 0.08, 240], [0.71, 0.075, 240])],
  },
];

export const paletteById = (id: string) => palettes.find(p => p.id === id) ?? palettes[0]!;

/** The neutral ramp of a mode (Current falls back to the grey ramps, for display only). */
export function neutralsFor(p: Palette, t: Theme): Ramp {
  const r = t === 'light' ? p.neutralLight : p.neutralDark;
  return r ?? ramp(t === 'light' ? LIGHT_L : DARK_L);
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
  v['--cs-color-text-disabled'] = six;
  v['--cs-color-border-control'] = six;
  v['--cs-color-control-off'] = six;
  v['--cs-color-text-inverse'] = t === 'light' ? at(1) : at(2);
  v['--cs-color-border-subtle'] = a(0.05);
  v['--cs-color-border-default'] = a(t === 'light' ? 0.08 : 0.07);
  v['--cs-color-border-strong'] = a(t === 'light' ? 0.13 : 0.12);
  v['--cs-color-fill-hover'] = a(t === 'light' ? 0.045 : 0.05);
  v['--cs-color-fill-pressed'] = a(t === 'light' ? 0.075 : 0.08);
  v['--cs-color-fill-selected'] = a(t === 'light' ? 0.11 : 0.12);
  v['--cs-color-control-thumb'] = css(paper);
  v['--cs-color-control-raised-hover'] = t === 'light' ? at(2) : at(5);
  v['--cs-color-control-edge'] = a(t === 'light' ? 0.07 : 0.06);
  v['--cs-color-ink-solid'] = n('ink button');
  v['--cs-color-ink-hover'] = t === 'light' ? at(10) : at(6);
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
}

/** CSS variable overrides: semantic tokens only, so ramp renames underneath cannot break them. */
export function paletteVars(p: Palette, t: Theme): Record<string, string> {
  if (p.current) return {};
  const r = resolve(p, t);
  const v: Record<string, string> = {};
  neutralVars(p, t, v);
  const A = r.role.accent;
  const a = (c: LCH, al: number) => css(c, al);
  v['--cs-color-accent-solid'] = css(A.solid);
  v['--cs-color-accent-hover'] = css(A.hover);
  v['--cs-color-accent-on'] = css(A.on);
  v['--cs-color-accent-text'] = css(A.text);
  v['--cs-color-text-link'] = css(A.text);
  v['--cs-color-accent-soft'] = a(A.solid, A.softAlpha);
  v['--cs-color-accent-tint'] = a(A.solid, 0.09);
  v['--cs-color-accent-border'] = a(A.solid, 0.5);
  v['--cs-color-accent-glow'] = a(A.solid, 0.3);
  v['--cs-color-accent-fill'] = css(A.solid);
  v['--cs-color-accent-fill-hover'] = css(A.hover);
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
  v['--cs-color-diff-add'] = a(r.role.success.solid, t === 'light' ? 0.22 : 0.2);
  v['--cs-color-diff-remove'] = a(r.role.danger.solid, t === 'light' ? 0.18 : 0.2);
  v['--cs-color-canvas-guide'] = css(r.role.danger.solid);
  v['--cs-color-canvas-guide-on'] = css(r.role.danger.on);
  v['--cs-color-canvas-guide-user'] = css(r.role.info.solid);
  v['--cs-color-chart-1'] = css(A.solid);
  v['--cs-color-chart-2'] = css(r.role.info.solid);
  v['--cs-color-chart-3'] = css(r.role.success.solid);
  v['--cs-color-chart-4'] = css(r.role.warning.solid);
  v['--cs-color-identity-coral'] = css(r.role.danger.text);
  v['--cs-color-identity-iris'] = css(r.role.info.text);
  v['--cs-color-identity-mint'] = css(r.role.success.text);
  v['--cs-color-identity-amber'] = css(r.role.warning.text);
  v['--cs-color-agent-glow'] = a(p.spectrum[0][t], 0.45);
  v['--cs-spectrum-1'] = css(p.spectrum[0][t]);
  v['--cs-spectrum-2'] = css(p.spectrum[1][t]);
  v['--cs-spectrum-3'] = css(p.spectrum[2][t]);
  v['--sc-extra-1'] = css(p.extras[0][t]);
  v['--sc-extra-2'] = css(p.extras[1][t]);
  return v;
}

// ---------- contrast report ----------

export interface Row { label: string; fg: LCH; bg: LCH | { lin: number[] }; ratio: number; need: number; pass: boolean; note?: string }

export function report(p: Palette, t: Theme): Row[] {
  const r = resolve(p, t);
  const rows: Row[] = [];
  const add = (label: string, fg: LCH, bg: LCH | { lin: number[] }, need: number, note?: string) => {
    const ratio = 'lin' in bg ? contrastLin(linRgb(fg), bg.lin) : contrast(fg, bg);
    rows.push({ label, fg, bg, ratio, need, pass: ratio >= need - 1e-9, note });
  };
  const names: [keyof Resolved['role'], string][] = [['accent', 'Accent'], ['success', 'Success'], ['warning', 'Warning'], ['danger', 'Danger'], ['info', 'Info']];
  for (const [k, n] of names) {
    const x = r.role[k];
    add(`${n}: label on solid fill`, x.on, x.solid, 4.5);
    add(`${n}: text on surface`, x.text, r.surface, 4.5);
    add(`${n}: text on its soft badge`, x.text, { lin: x.softBg }, 4.5);
    add(`${n}: solid vs surface (graphic)`, x.solid, r.surface, 3, k === 'accent' ? undefined : 'fill carries ink; edge not relied on');
  }
  return rows;
}

export const NEUTRAL_BGS = ['surface', 'raised', 'app', 'canvas'] as const;
export const NEUTRAL_FGS: [string, string, number][] = [
  ['Text primary', 'text primary', 4.5], ['Text secondary', 'text secondary', 4.5], ['Text tertiary', 'text tertiary', 4.5],
  ['Placeholder', 'text placeholder', 4.5], ['Border control', 'control off · border control · text disabled', 3],
];

/** Neutral text and control steps against every background they sit on. */
export function neutralReport(p: Palette, t: Theme): Row[] {
  const bg: Record<(typeof NEUTRAL_BGS)[number], LCH> = { surface: N(p, t, 'surface base'), raised: N(p, t, 'surface raised'), app: N(p, t, 'bg app'), canvas: N(p, t, 'bg canvas') };
  const rows: Row[] = [];
  for (const [name, role, need] of NEUTRAL_FGS) {
    const fg = N(p, t, role);
    for (const b of NEUTRAL_BGS) {
      const ratio = contrast(fg, bg[b]);
      rows.push({ label: `${name} on ${b}`, fg, bg: bg[b], ratio, need, pass: ratio >= need - 1e-9 });
    }
  }
  return rows;
}

/** Extra chart / illustration colours against the surface (they draw lines and small marks). */
export function extrasReport(p: Palette, t: Theme): Row[] {
  const surface = surfaceFor(p, t);
  return p.extras.map((sw, i) => {
    const ratio = contrast(sw[t], surface);
    return { label: `Extra ${i + 1} vs surface`, fg: sw[t], bg: surface, ratio, need: 3, pass: ratio >= 3 - 1e-9 };
  });
}

/** Ink or paper, whichever reads better on `c`. */
export function bestOn(c: LCH, p: Palette): LCH {
  const lr = neutralsFor(p, 'light');
  return contrast(lr[10], c) >= contrast(lr[0], c) ? lr[10] : lr[0];
}

/** Tailwind utilities read `--color-*` twins resolved at :root, so a scoped wrapper must restate them (plus the derived focus/spectrum vars). */
export function scopeVars(vars: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = { ...vars };
  for (const [k, val] of Object.entries(vars)) if (k.startsWith('--cs-color-')) out[`--color-${k.slice('--cs-color-'.length)}`] = val;
  out['--cs-spectrum-conic'] = 'conic-gradient(from var(--cs-spin, 0deg), var(--cs-spectrum-1), var(--cs-spectrum-2), var(--cs-spectrum-3), var(--cs-spectrum-1))';
  out['--cs-spectrum-linear'] = 'linear-gradient(90deg, var(--cs-spectrum-1), var(--cs-spectrum-2), var(--cs-spectrum-3), var(--cs-spectrum-1))';
  out['--cs-focus-field'] = 'inset 0 0 0 1.5px var(--cs-color-focus-ring)';
  out['--cs-focus'] = '0 0 0 1px var(--cs-color-surface-base), 0 0 0 3px var(--cs-color-focus-ring)';
  out['--cs-elevation-agent'] = '0 8px 30px -12px var(--cs-color-agent-glow)';
  out['--shadow-focus-field'] = 'var(--cs-focus-field)';
  out['--shadow-focus'] = 'var(--cs-focus)';
  out['--shadow-agent'] = 'var(--cs-elevation-agent)';
  return out;
}

export { label, css };
