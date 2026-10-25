import { contrast, css, ensure, gamutMap, label, over, contrastLin, type LCH } from './color.ts';

export type Theme = 'light' | 'dark';
export type Swatch = { name: string; light: LCH; dark: LCH };
type Bg = { app: LCH; canvas: LCH; surface?: LCH; raised?: LCH };

export interface Palette {
  id: string;
  name: string;
  concept: string;
  /** true = the shipped tokens, no overrides. */
  current?: boolean;
  bg?: { light: Bg; dark: Bg };
  accent: Swatch; success: Swatch; warning: Swatch; danger: Swatch; info: Swatch;
  spectrum: [Swatch, Swatch, Swatch];
  extras: [Swatch, Swatch];
}

const s = (name: string, light: LCH, dark: LCH = light): Swatch => ({ name, light, dark });

export const LIGHT_SURFACE: LCH = [0.995, 0, 0];
export const DARK_SURFACE: LCH = [0.23, 0, 0];

const inkDark = (h: number): LCH => [0.15, 0.03, h];
const inkLight: LCH = [0.995, 0.004, 100];

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
    id: 'putty', name: 'Putty & Clay',
    concept: 'Kinfolk-style editorial: warm paper, soft black ink, hue only as sage, ochre, clay and fog.',
    bg: {
      light: { app: [0.963, 0.012, 80], canvas: [0.935, 0.016, 78], surface: [0.99, 0.006, 85] },
      dark: { app: [0.175, 0.008, 60], canvas: [0.145, 0.008, 60], surface: [0.225, 0.009, 60], raised: [0.265, 0.01, 60] },
    },
    accent: s('Soft Ink', [0.22, 0.008, 60], [0.94, 0.008, 80]),
    success: s('Sage', [0.55, 0.07, 145], [0.76, 0.075, 145]),
    warning: s('Ochre', [0.66, 0.1, 82], [0.8, 0.1, 85]),
    danger: s('Clay', [0.52, 0.115, 33], [0.72, 0.1, 33]),
    info: s('Fog Blue', [0.54, 0.06, 240], [0.75, 0.06, 240]),
    spectrum: [s('Clay', [0.78, 0.08, 45], [0.74, 0.08, 45]), s('Sage', [0.82, 0.07, 145], [0.78, 0.07, 145]), s('Putty', [0.86, 0.06, 90], [0.82, 0.06, 90])],
    extras: [s('Terracotta', [0.62, 0.11, 40], [0.7, 0.1, 40]), s('Oat', [0.9, 0.03, 85], [0.4, 0.03, 85])],
  },
  {
    id: 'fog', name: 'Fog & Slate',
    concept: 'Linear / Vercel register: cool near-neutral surfaces, graphite ink, hue limited to fog blue, moss, straw and brick.',
    bg: {
      light: { app: [0.972, 0.004, 255], canvas: [0.945, 0.006, 255], surface: [0.996, 0.002, 255] },
      dark: { app: [0.17, 0.01, 265], canvas: [0.14, 0.01, 265], surface: [0.22, 0.012, 265], raised: [0.26, 0.014, 265] },
    },
    accent: s('Graphite', [0.2, 0.01, 265], [0.95, 0.004, 265]),
    success: s('Moss Teal', [0.54, 0.075, 170], [0.76, 0.08, 170]),
    warning: s('Straw', [0.65, 0.095, 95], [0.8, 0.095, 95]),
    danger: s('Brick', [0.52, 0.12, 22], [0.72, 0.1, 22]),
    info: s('Fog Blue', [0.53, 0.09, 250], [0.75, 0.08, 250]),
    spectrum: [s('Fog', [0.78, 0.07, 245], [0.75, 0.07, 245]), s('Lilac Grey', [0.78, 0.06, 300], [0.75, 0.06, 300]), s('Sage Teal', [0.82, 0.06, 175], [0.78, 0.06, 175])],
    extras: [s('Slate Blue', [0.45, 0.065, 255], [0.7, 0.06, 255]), s('Mist', [0.9, 0.02, 240], [0.4, 0.02, 240])],
  },
  {
    id: 'mauve', name: 'Mauve & Olive',
    concept: 'Arc-like soft studio: blush-grey paper, plum-black ink, mauve, olive, honey and rosewood as the only hues.',
    bg: {
      light: { app: [0.967, 0.01, 335], canvas: [0.94, 0.014, 335], surface: [0.995, 0.004, 335] },
      dark: { app: [0.175, 0.012, 330], canvas: [0.145, 0.012, 330], surface: [0.225, 0.014, 330], raised: [0.265, 0.016, 330] },
    },
    accent: s('Plum Ink', [0.21, 0.012, 335], [0.94, 0.008, 335]),
    success: s('Olive', [0.54, 0.08, 125], [0.76, 0.08, 125]),
    warning: s('Honey', [0.66, 0.1, 78], [0.8, 0.1, 80]),
    danger: s('Rosewood', [0.5, 0.12, 15], [0.72, 0.1, 15]),
    info: s('Lilac Grey', [0.54, 0.07, 295], [0.76, 0.065, 295]),
    spectrum: [s('Mauve', [0.78, 0.07, 335], [0.74, 0.07, 335]), s('Olive', [0.8, 0.08, 120], [0.76, 0.08, 120]), s('Peach', [0.85, 0.07, 60], [0.8, 0.07, 60])],
    extras: [s('Mauve', [0.62, 0.085, 335], [0.72, 0.08, 335]), s('Pistachio', [0.88, 0.06, 125], [0.4, 0.05, 125])],
  },
  {
    id: 'signal', name: 'Signal Grey',
    concept: 'Teenage Engineering utility: true-grey panels, black ink, one dusty orange signal, tape yellow and panel blue.',
    bg: {
      light: { app: [0.962, 0, 0], canvas: [0.93, 0, 0], surface: [0.994, 0, 0] },
      dark: { app: [0.165, 0, 0], canvas: [0.13, 0, 0], surface: [0.215, 0, 0], raised: [0.255, 0, 0] },
    },
    accent: s('Black', [0.16, 0, 0], [0.96, 0, 0]),
    success: s('Pad Green', [0.55, 0.085, 155], [0.77, 0.085, 155]),
    warning: s('Tape Yellow', [0.66, 0.1, 95], [0.82, 0.1, 95]),
    danger: s('Signal Orange', [0.54, 0.13, 40], [0.72, 0.11, 40]),
    info: s('Panel Blue', [0.53, 0.075, 235], [0.75, 0.07, 235]),
    spectrum: [s('Signal', [0.78, 0.09, 55], [0.74, 0.09, 55]), s('Panel', [0.78, 0.06, 235], [0.75, 0.06, 235]), s('Pad', [0.8, 0.08, 150], [0.76, 0.08, 150])],
    extras: [s('Knob Orange', [0.66, 0.125, 50], [0.72, 0.11, 50]), s('Panel Grey', [0.82, 0, 0], [0.4, 0, 0])],
  },
];

export const paletteById = (id: string) => palettes.find(p => p.id === id) ?? palettes[0]!;

// ---------- derivation ----------

export interface Resolved {
  surface: LCH; bgApp: LCH; ink: LCH; paper: LCH;
  role: Record<'accent' | 'success' | 'warning' | 'danger' | 'info', {
    solid: LCH; hover: LCH; on: LCH; text: LCH; softBase: LCH; softAlpha: number; softBg: number[];
  }>;
}

export function surfaceFor(p: Palette, t: Theme): LCH {
  return p.bg?.[t].surface ?? (t === 'light' ? LIGHT_SURFACE : DARK_SURFACE);
}

export function resolve(p: Palette, t: Theme): Resolved {
  const surface = surfaceFor(p, t);
  const bgApp: LCH = p.bg?.[t].app ?? (t === 'light' ? [0.975, 0, 0] : [0.175, 0, 0]);
  const ink = inkDark(p.accent.light[2]);
  const paper = inkLight;
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
    for (let i = 0; i < 60 && contrastLin(toLin(tx), softBg) < 4.5; i++) tx = nudge(tx, t);
    return { solid, hover, on, text: tx, softBase: solid, softAlpha, softBg };
  };
  return { surface, bgApp, ink, paper, role: { accent: make(p.accent), success: make(p.success), warning: make(p.warning), danger: make(p.danger), info: make(p.info) } };
}
import { linRgb } from './color.ts';
const toLin = (c: LCH) => linRgb(c);
const nudge = (c: LCH, t: Theme): LCH => gamutMap([c[0] + (t === 'light' ? -0.01 : 0.01), c[1], c[2]]);

/** CSS variable overrides: semantic tokens only, so ramp renames underneath cannot break them. */
export function paletteVars(p: Palette, t: Theme): Record<string, string> {
  if (p.current) return {};
  const r = resolve(p, t);
  const v: Record<string, string> = {};
  const A = r.role.accent;
  const bg = p.bg?.[t];
  if (bg) {
    v['--cs-color-bg-app'] = css(bg.app);
    v['--cs-color-bg-canvas'] = css(bg.canvas);
    if (bg.surface) { v['--cs-color-surface-base'] = css(bg.surface); v['--cs-color-surface-translucent'] = css(bg.surface); v['--cs-color-material-regular'] = css(bg.surface); v['--cs-color-material-thick'] = css(bg.surface); v['--cs-color-material-thin'] = css(bg.surface); v['--cs-color-material-ultrathin'] = css(bg.surface); v['--cs-color-canvas-artboard'] = css(bg.surface); v['--cs-color-control-thumb'] = css(bg.surface); }
    if (bg.raised) { v['--cs-color-surface-raised'] = css(bg.raised); v['--cs-color-surface-raised-translucent'] = css(bg.raised); }
    else if (bg.surface) { v['--cs-color-surface-raised'] = css(bg.surface); v['--cs-color-surface-raised-translucent'] = css(bg.surface); }
  }
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
    const ratio = 'lin' in bg ? contrastLin(linRgbOf(fg), bg.lin) : contrast(fg, bg);
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
const linRgbOf = (c: LCH) => linRgb(c);

/** Ink or paper, whichever reads better on `c`. */
export function bestOn(c: LCH, p: Palette): LCH {
  const ink = inkDark(p.accent.light[2]);
  return contrast(ink, c) >= contrast(inkLight, c) ? ink : inkLight;
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
