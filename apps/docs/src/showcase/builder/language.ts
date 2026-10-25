// Proposed colour language (PROPOSAL-color-language.md): every hued colour gets its own light and dark 1–11 ramp,
// step 9 is the picked solid, and components read slots (soft = 3, border = 7, text = 11 ...) instead of alpha tints.
// Preview only: it overrides the shipped semantic variables and adds --lang-* ramps for the matrix.
import { contrast, css, ensure, gamutMap, type LCH } from '../color.ts';
import { neutralsFor, surfaceFor, type Palette, type Theme } from '../palettes.ts';

export type Ramp11 = LCH[];
export type LangTone = 'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'agent';
export const LANG_TONES: LangTone[] = ['accent', 'neutral', 'success', 'warning', 'danger', 'info', 'agent'];

// Steps 1–6 sit at fixed lightness so tints line up across hues; 7–8 lead into the solid; 9 is the pick.
// Light: step 1 is the lightest. Dark: step 1 is the darkest tint, kept just above the dark surfaces.
const L_FIXED: Record<Theme, number[]> = {
  light: [0.985, 0.965, 0.935, 0.905, 0.87, 0.8],
  dark: [0.225, 0.255, 0.29, 0.32, 0.355, 0.42],
};
// Share of the solid's chroma per step 1–8: soft steps keep real chroma instead of an alpha wash.
const C_SHARE: Record<Theme, number[]> = {
  light: [0.14, 0.28, 0.46, 0.58, 0.7, 0.8, 0.9, 1],
  dark: [0.22, 0.32, 0.46, 0.56, 0.66, 0.76, 0.88, 1],
};

/** Step 10: the solid's hover, the same nudge the proposals use. */
const hoverOf = (solid: LCH, t: Theme): LCH => {
  const dl = t === 'light' ? (solid[0] < 0.4 ? 0.12 : -0.05) : (solid[0] > 0.9 ? -0.08 : 0.05);
  return gamutMap([Math.min(0.97, Math.max(0.05, solid[0] + dl)), solid[1], solid[2]]);
};

/** A hued ramp for one mode, anchored so step 9 is the picked solid; text (11) holds 4.5:1 on the surface and on soft 3–5. */
export function hueRamp(pick: LCH, t: Theme, surface: LCH): Ramp11 {
  const solid = gamutMap(pick);
  const [L9, C9, H] = solid;
  const out: LCH[] = [];
  for (let i = 0; i < 6; i++) out.push(gamutMap([L_FIXED[t][i]!, C9 * C_SHARE[t][i]!, H]));
  const L6 = L_FIXED[t][5]!;
  out.push(gamutMap([L6 + (L9 - L6) * 0.4, C9 * C_SHARE[t][6]!, H]));
  // graphic marks (icons, chart lines, 1px status edges) need 3:1 on the surface even for light solids
  out.push(ensure(gamutMap([L6 + (L9 - L6) * 0.7, C9 * C_SHARE[t][7]!, H]), surface, 3));
  out.push(solid);
  out.push(hoverOf(solid, t));
  // text is the far end of the ramp: a little past the solid and its hover, then pushed until it reads on every soft step
  const hover = out[9]!;
  let text: LCH = gamutMap([t === 'light' ? Math.max(0.05, Math.min(L9, hover[0]) - 0.04) : Math.min(0.97, Math.max(L9, hover[0]) + 0.04), C9, H]);
  for (const bg of [surface, out[2]!, out[3]!, out[4]!]) text = ensure(text, bg, 4.5);
  out.push(gamutMap(text));
  return out;
}

/** The neutral tone reads the locked neutral ramp of the mode as is. */
export const neutralRamp = (p: Palette, t: Theme): Ramp11 => neutralsFor(p, t).slice();

export interface LangRamps { tones: Record<LangTone, Ramp11>; on: Record<LangTone, LCH>; surface: LCH }

/** Ink or paper, whichever reads better on the solid (step 9). */
const onFor = (solid: LCH, p: Palette): LCH => {
  const ink = neutralsFor(p, 'light')[10]!, paper = neutralsFor(p, 'light')[0]!;
  return contrast(ink, solid) >= contrast(paper, solid) ? ink : paper;
};

export function langRamps(p: Palette, t: Theme): LangRamps {
  const surface = surfaceFor(p, t);
  const tones = {
    accent: hueRamp(p.accent[t], t, surface),
    neutral: neutralRamp(p, t),
    success: hueRamp(p.success[t], t, surface),
    warning: hueRamp(p.warning[t], t, surface),
    danger: hueRamp(p.danger[t], t, surface),
    info: hueRamp(p.info[t], t, surface),
    agent: hueRamp(p.spectrum[0][t], t, surface),
  } satisfies Record<LangTone, Ramp11>;
  const on = {} as Record<LangTone, LCH>;
  for (const k of LANG_TONES) on[k] = onFor(tones[k][8]!, p);
  return { tones, on, surface };
}

/** Ramps for every editable colour (shown under each control). */
export function rampFor(pick: LCH, p: Palette, t: Theme): Ramp11 {
  return hueRamp(pick, t, surfaceFor(p, t));
}

/**
 * Variable overrides for the proposed language: the --lang-{tone}-{1..11} ramps and named slots for the matrix,
 * plus the shipped semantic variables re-pointed at slots (solid 9, soft 3 opaque, text 11, accent border 7).
 */
export function langVars(p: Palette, t: Theme): Record<string, string> {
  const { tones, on } = langRamps(p, t);
  const v: Record<string, string> = {};
  for (const k of LANG_TONES) {
    const r = tones[k];
    r.forEach((c, i) => { v[`--lang-${k}-${i + 1}`] = css(c); });
    v[`--lang-${k}-on`] = css(on[k]);
  }
  const s = (k: LangTone, n: number) => css(tones[k][n - 1]!);
  // accent (ink)
  v['--cs-color-accent-solid'] = s('accent', 9);
  v['--cs-color-accent-fill'] = s('accent', 9);
  v['--cs-color-accent-hover'] = s('accent', 10);
  v['--cs-color-accent-fill-hover'] = s('accent', 10);
  v['--cs-color-accent-on'] = css(on.accent);
  v['--cs-color-accent-text'] = s('accent', 11);
  v['--cs-color-text-link'] = s('accent', 11);
  v['--cs-color-accent-soft'] = s('accent', 3);
  v['--cs-color-accent-tint'] = s('accent', 2);
  v['--cs-color-accent-border'] = s('accent', 7);
  v['--cs-color-canvas-marquee'] = css(tones.accent[8]!, 0.14);
  // status
  for (const k of ['success', 'warning', 'danger', 'info'] as const) {
    v[`--cs-color-${k}-solid`] = s(k, 9);
    v[`--cs-color-${k}-on`] = css(on[k]);
    v[`--cs-color-${k}-text`] = s(k, 11);
    v[`--cs-color-${k}-soft`] = s(k, 3);
  }
  // diff lines: the tint steps of success and danger, opaque
  v['--cs-color-diff-add'] = s('success', 3);
  v['--cs-color-diff-remove'] = s('danger', 3);
  return v;
}

export interface StepCheck { label: string; ratio: number; need: number }

/** Contrast of the proposed slots for one tone (text on surface and on soft 3–5, on-label on solid). */
export function langChecks(p: Palette, t: Theme, k: Exclude<LangTone, 'neutral'>): StepCheck[] {
  const { tones, on, surface } = langRamps(p, t);
  const r = tones[k];
  const worstSoft = Math.min(contrast(r[10]!, r[2]!), contrast(r[10]!, r[3]!), contrast(r[10]!, r[4]!));
  return [
    { label: 'text 11 on surface', ratio: contrast(r[10]!, surface), need: 4.5 },
    { label: 'text 11 on soft 3–5', ratio: worstSoft, need: 4.5 },
    { label: 'on vs solid 9', ratio: contrast(on[k], r[8]!), need: k === 'accent' || k === 'danger' ? 4.5 : 3 },
    { label: 'graphic 8 vs surface', ratio: contrast(r[7]!, surface), need: 3 },
  ];
}
