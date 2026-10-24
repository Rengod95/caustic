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

export const LIGHT_SURFACE: LCH = [0.995, 0.001, 260];
export const DARK_SURFACE: LCH = [0.16, 0.009, 260];

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
    id: 'arcade', name: 'Arcade Neon-Pop',
    concept: 'Cabinet glow on clean glass: electric violet with pellet lime, coin yellow and laser cyan. Vivid fills carry black ink.',
    bg: {
      light: { app: [0.965, 0.014, 290], canvas: [0.94, 0.024, 290] },
      dark: { app: [0.15, 0.045, 285], canvas: [0.115, 0.05, 285], surface: [0.19, 0.05, 285], raised: [0.23, 0.055, 285] },
    },
    accent: s('Electric Violet', [0.52, 0.27, 288], [0.72, 0.21, 298]),
    success: s('Pellet Lime', [0.82, 0.27, 142], [0.86, 0.26, 142]),
    warning: s('Coin Yellow', [0.9, 0.19, 98]),
    danger: s('Ghost Red', [0.57, 0.25, 24], [0.7, 0.22, 24]),
    info: s('Laser Cyan', [0.78, 0.14, 215], [0.82, 0.13, 210]),
    spectrum: [s('Laser Cyan', [0.82, 0.15, 205]), s('Hot Magenta', [0.72, 0.27, 335]), s('Coin Yellow', [0.9, 0.19, 100])],
    extras: [s('Hot Magenta', [0.64, 0.27, 340], [0.72, 0.25, 340]), s('Continue Orange', [0.74, 0.19, 55])],
  },
  {
    id: 'riso', name: 'Risograph Print',
    concept: 'Two-drum print on cream paper: fluorescent pink, federal blue, sunflower and riso green. Flat, a little misregistered.',
    bg: {
      light: { app: [0.962, 0.024, 85], canvas: [0.93, 0.034, 85], surface: [0.986, 0.012, 90] },
      dark: { app: [0.18, 0.025, 265], canvas: [0.145, 0.028, 265], surface: [0.22, 0.03, 265], raised: [0.26, 0.034, 265] },
    },
    accent: s('Fluoro Pink', [0.57, 0.25, 8], [0.74, 0.19, 8]),
    success: s('Riso Green', [0.56, 0.15, 165], [0.78, 0.16, 165]),
    warning: s('Sunflower', [0.88, 0.17, 92]),
    danger: s('Vermilion', [0.55, 0.23, 33], [0.7, 0.2, 33]),
    info: s('Federal Blue', [0.48, 0.2, 262], [0.72, 0.15, 262]),
    spectrum: [s('Fluoro Pink', [0.72, 0.22, 5]), s('Sunflower', [0.9, 0.17, 92]), s('Riso Blue', [0.65, 0.18, 255])],
    extras: [s('Mint Ink', [0.85, 0.12, 170]), s('Orchid', [0.62, 0.22, 320], [0.72, 0.2, 320])],
  },
  {
    id: 'candy', name: 'Candy Y2K',
    concept: 'Frosted-plastic iMac era: aqua azure with bubblegum, slime green and cyber lilac over a pastel glaze.',
    bg: {
      light: { app: [0.97, 0.016, 255], canvas: [0.945, 0.03, 300], surface: [0.996, 0.004, 260] },
      dark: { app: [0.2, 0.045, 275], canvas: [0.16, 0.05, 275], surface: [0.25, 0.055, 275], raised: [0.29, 0.06, 275] },
    },
    accent: s('Aqua Azure', [0.55, 0.2, 248], [0.77, 0.15, 235]),
    success: s('Slime', [0.83, 0.25, 135], [0.87, 0.24, 135]),
    warning: s('Tangerine Fizz', [0.8, 0.18, 62]),
    danger: s('Cherry Soda', [0.57, 0.25, 18], [0.72, 0.2, 18]),
    info: s('Cyber Lilac', [0.54, 0.22, 300], [0.74, 0.16, 300]),
    spectrum: [s('Aqua', [0.82, 0.13, 215]), s('Bubblegum', [0.75, 0.2, 350]), s('Lilac', [0.75, 0.15, 300])],
    extras: [s('Bubblegum', [0.7, 0.24, 350]), s('Lemon Drop', [0.92, 0.16, 105])],
  },
  {
    id: 'memphis', name: 'Memphis Pop',
    concept: '80s confetti on cream: tangerine, teal, flamingo and grape, thick outlines and squiggles allowed.',
    bg: {
      light: { app: [0.972, 0.028, 95], canvas: [0.942, 0.045, 95], surface: [0.996, 0.01, 95] },
      dark: { app: [0.17, 0.025, 300], canvas: [0.13, 0.025, 300], surface: [0.21, 0.03, 300], raised: [0.25, 0.035, 300] },
    },
    accent: s('Tangerine', [0.64, 0.2, 45], [0.74, 0.18, 48]),
    success: s('Memphis Teal', [0.54, 0.12, 188], [0.78, 0.12, 188]),
    warning: s('Confetti Yellow', [0.9, 0.18, 98]),
    danger: s('Flamingo Red', [0.57, 0.24, 12], [0.7, 0.2, 12]),
    info: s('Grape', [0.5, 0.24, 295], [0.74, 0.16, 295]),
    spectrum: [s('Tangerine', [0.75, 0.18, 55]), s('Teal', [0.78, 0.12, 185]), s('Flamingo', [0.75, 0.19, 355])],
    extras: [s('Lilac', [0.8, 0.11, 305]), s('Cobalt', [0.5, 0.2, 262], [0.7, 0.16, 262])],
  },
  {
    id: 'acid', name: 'Acid Brutal',
    concept: 'Raw grid, hard edges, toxic green. Signal red, safety yellow and electric blue; dark mode flips to acid lime on black.',
    bg: {
      light: { app: [0.962, 0.004, 105], canvas: [0.92, 0.012, 110], surface: [0.999, 0, 0] },
      dark: { app: [0.12, 0.006, 130], canvas: [0.085, 0.006, 130], surface: [0.165, 0.01, 130], raised: [0.2, 0.012, 130] },
    },
    accent: s('Toxic Green', [0.5, 0.2, 146], [0.9, 0.26, 128]),
    success: s('Acid Mint', [0.82, 0.2, 165], [0.85, 0.19, 165]),
    warning: s('Safety Yellow', [0.93, 0.19, 102]),
    danger: s('Signal Red', [0.58, 0.26, 28], [0.7, 0.22, 28]),
    info: s('Electric Blue', [0.5, 0.25, 262], [0.72, 0.17, 262]),
    spectrum: [s('Acid Lime', [0.92, 0.24, 125]), s('Electric Cyan', [0.85, 0.13, 205]), s('Ultraviolet', [0.7, 0.22, 300])],
    extras: [s('Acid Lime', [0.93, 0.25, 125]), s('Hazard Orange', [0.72, 0.2, 50])],
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
  const bgApp: LCH = p.bg?.[t].app ?? (t === 'light' ? [0.97, 0.003, 260] : [0.13, 0.008, 260]);
  const ink = inkDark(p.accent.light[2]);
  const paper = inkLight;
  const make = (sw: Swatch) => {
    const solid = gamutMap(sw[t]);
    const on = contrast(ink, solid) >= contrast(paper, solid) ? ink : paper;
    const hover: LCH = t === 'light' ? [solid[0] - 0.05, solid[1], solid[2]] : [Math.min(0.97, solid[0] + 0.05), solid[1], solid[2]];
    const text = ensure(ensure(solid, surface, 4.5), bgApp, 4.5);
    const softAlpha = t === 'light' ? 0.16 : 0.2;
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
  v['--cs-color-accent-soft'] = a(A.solid, t === 'light' ? 0.16 : 0.2);
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
