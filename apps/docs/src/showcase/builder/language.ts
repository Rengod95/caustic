// The shipped colour language (PROPOSAL-color-language.md, decisions 2026-10-25), generated live from the builder's picks.
// Every hued colour gets its own light and dark 1–11 ramp with step 9 = the picked solid, exactly as
// packages/tokens/src/build.mjs does, and every semantic colour of tokens.mjs `themes` is resolved from those ramps with
// the build's step mapping. With the shipped solids the output equals dist/caustic.css.
// --lang-{tone}-{1..11,on} are lab-only copies of the tone ramps for the emphasis matrix.
import { contrast, ensure, gamutMap, type LCH } from '../color.ts';
import { surfaceFor, type Palette, type Theme } from '../palettes.ts';
import { cssVar, emit, emitLch, MODES, parseSpec, resolveSpec, SHIPPED, type RampSet } from '../shipped.ts';

export type Ramp11 = LCH[];
export type LangTone = 'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'agent';
export const LANG_TONES: LangTone[] = ['accent', 'neutral', 'success', 'warning', 'danger', 'info', 'agent'];
/** The ramp each tone reads (tokens.mjs `tones`: agent reads agent-1). */
export const toneRamp = (k: LangTone): string => SHIPPED.tones[k] ?? k;

// The ramp rule (tokens.mjs rampRule): steps 1–6 at fixed lightness so tints line up across hues, chroma a share of the solid's.
const { fixedL, chromaShare, graphicMin, textMin } = SHIPPED.rampRule;
/** build.mjs fits step 11 to textMin + 0.1 (a rounding margin); the contrast rules still check textMin. */
const TEXT_MARGIN = 0.1;

/** Step 10: the solid's hover (build.mjs hoverOf). */
const hoverOf = (solid: LCH, t: Theme): LCH => {
  const dl = t === 'light' ? (solid[0] < 0.4 ? 0.12 : -0.05) : (solid[0] > 0.9 ? -0.08 : 0.05);
  return gamutMap([Math.min(0.97, Math.max(0.05, solid[0] + dl)), solid[1], solid[2]]);
};

/** A hued ramp for one mode, anchored so step 9 is the picked solid (build.mjs hueRamp, unrounded). */
export function hueRamp(pick: LCH, t: Theme, surface: LCH): Ramp11 {
  const solid = gamutMap(pick);
  const [L9, C9, H] = solid;
  const out: LCH[] = [];
  for (let i = 0; i < 5; i++) out.push(gamutMap([fixedL[t][i]!, C9 * chromaShare[t][i]!, H]));
  // steps 6–8 run in order between step 5 and the solid; 6 keeps its fixed lightness unless the solid is at or past it
  const L5 = fixedL[t][4]!, F6 = fixedL[t][5]!;
  const L6 = (t === 'light' ? F6 > L9 + 0.03 : F6 < L9 - 0.03) ? F6 : L5 + (L9 - L5) * 0.26;
  out.push(gamutMap([L6, C9 * chromaShare[t][5]!, H]));
  out.push(gamutMap([L6 + (L9 - L6) * 0.4, C9 * chromaShare[t][6]!, H]));
  // graphic 8 follows the solid (not pushed to 3:1); the check below still reports its contrast
  out.push(gamutMap([L6 + (L9 - L6) * 0.7, C9 * chromaShare[t][7]!, H]));
  out.push(solid);
  out.push(hoverOf(solid, t));
  // text is the far end of the ramp: a little past the solid and its hover, then pushed until it reads on every soft step
  const hover = out[9]!;
  let text: LCH = gamutMap([t === 'light' ? Math.max(0.05, Math.min(L9, hover[0]) - 0.04) : Math.min(0.97, Math.max(L9, hover[0]) + 0.04), C9, H]);
  for (const bg of [surface, out[2]!, out[3]!, out[4]!]) text = ensure(text, bg, textMin + TEXT_MARGIN);
  out.push(gamutMap(text));
  return out;
}

/** The step surface.base reads in a mode (the ramp rule measures graphic 8 and text 11 on it). */
export function surfaceOf(neutral: Record<Theme, readonly LCH[]>, t: Theme): LCH {
  const { ramp, step } = parseSpec(SHIPPED.themes[t]['surface.base']!);
  if (ramp !== 'neutral') throw new Error('surface.base must read the neutral ramp');
  return neutral[t][+step - 1]!;
}

export interface LangInput {
  /** Authored solid per mode, keyed by tokens.mjs `solids` name; a missing ramp falls back to the shipped solid. */
  solids: Record<string, Record<Theme, LCH>>;
  neutral: Record<Theme, readonly LCH[]>;
  /** Builder override of accent step 10 (solid-hover) per mode; null keeps the derived step. */
  accentHover?: Partial<Record<Theme, LCH | null>>;
}

/** Every ramp the token build has (neutral + each solid), both modes, as the build emits them. */
export function langRampSet(x: LangInput): RampSet {
  // labels on fills read the light ramp's two ends in both modes, so a label never picks up hue
  const ink = x.neutral.light[10]!, paper = x.neutral.light[0]!;
  const onFor = (solid: LCH): LCH => (contrast(ink, solid) >= contrast(paper, solid) ? ink : paper);
  const set: RampSet = {
    neutral: { light: { steps: x.neutral.light, on: onFor(x.neutral.light[8]!) }, dark: { steps: x.neutral.dark, on: onFor(x.neutral.dark[8]!) } },
  };
  for (const [name, shipped] of Object.entries(SHIPPED.solids)) {
    const pick = x.solids[name] ?? shipped;
    const modes = {} as RampSet[string];
    for (const m of MODES) {
      const steps = hueRamp(pick[m], m, surfaceOf(x.neutral, m)).map(emitLch);
      const on = onFor(steps[8]!);
      const hover = name === 'accent' ? x.accentHover?.[m] : null;
      if (hover) steps[9] = gamutMap(hover);
      modes[m] = { steps, on };
    }
    set[name] = modes;
  }
  return set;
}

/**
 * Variable overrides for one mode: every semantic colour of tokens.mjs `themes` that is not a reference
 * (tone slots, disabled-*, focus, chart-1..6, agent-stop-1..3, diff-*-bg/-text, syntax, canvas, identity …),
 * plus the --lang-* tone ramps for the matrix. References (old alias names, focus-offset, required-mark) are not written:
 * the token CSS declares them on :root as var(--cs-color-<target>), so they follow these values.
 */
/** Neutral interaction fills: the token CSS emits them opaque and surface-relative (build.mjs FILLS), so the builder
 * leaves them alone instead of writing their authored alpha over the whole preview. */
const OPAQUE_FILLS = new Set(['neutral.hover', 'neutral.pressed', 'neutral.selected', 'neutral.selected-hover', 'neutral.track', 'neutral.well', 'bg.inset']);

export function langVars(x: LangInput, t: Theme, set: RampSet = langRampSet(x)): Record<string, string> {
  const v: Record<string, string> = {};
  for (const k of LANG_TONES) {
    const r = set[toneRamp(k)]![t];
    r.steps.forEach((c, i) => { v[`--lang-${k}-${i + 1}`] = emit(c); });
    v[`--lang-${k}-on`] = emit(r.on);
  }
  for (const [name, spec] of Object.entries(SHIPPED.themes[t])) {
    if (OPAQUE_FILLS.has(name)) continue;
    const r = resolveSpec(spec, t, set);
    if (r) v[cssVar(name)] = emit(r.c, r.alpha);
  }
  return v;
}

/** A ramp for one pick on a palette's surface (decision scenes). */
export function rampFor(pick: LCH, p: Palette, t: Theme): Ramp11 {
  return hueRamp(pick, t, surfaceFor(p, t));
}

/** Canvas guides have their own magenta family (decision 4), authored in tokens.mjs `solids['canvas-guide']`. */
export const GUIDE_MAGENTA: Record<Theme, LCH> = { light: SHIPPED.solids['canvas-guide']!.light, dark: SHIPPED.solids['canvas-guide']!.dark };

export interface StepCheck { label: string; ratio: number; need: number | null }

/** Contrast of the slots a ramp feeds, with the thresholds of tokens.mjs contrastRules. */
export function rampChecks(set: RampSet, neutral: Record<Theme, readonly LCH[]>, t: Theme, ramp: string): StepCheck[] {
  const surface = surfaceOf(neutral, t);
  const { steps: r, on } = set[ramp]![t];
  const tone = Object.entries(SHIPPED.tones).find(([, rr]) => rr === ramp)?.[0];
  if (tone) {
    const worstSoft = Math.min(contrast(r[10]!, r[2]!), contrast(r[10]!, r[3]!), contrast(r[10]!, r[4]!));
    return [
      { label: 'text 11 on surface', ratio: contrast(r[10]!, surface), need: textMin },
      { label: 'text 11 on soft 3–5', ratio: worstSoft, need: textMin },
      { label: 'on vs solid 9', ratio: contrast(on, r[8]!), need: tone === 'accent' || tone === 'danger' ? 4.5 : 3 },
      { label: 'graphic 8 vs surface', ratio: contrast(r[7]!, surface), need: graphicMin },
    ];
  }
  // canvas guides keep the designed colour (owner, 2026-10-25): only the measurement label on the guide has a floor
  if (ramp === 'canvas-guide') return [
    { label: 'label on guide 9', ratio: contrast(on, r[8]!), need: 4.5 },
    { label: 'guide 9 vs surface', ratio: contrast(r[8]!, surface), need: null },
  ];
  // extras draw chart series 5–6 from step 8; agent stops 2–3 are a decorative gradient around labelled content
  if (ramp.startsWith('extra-')) return [{ label: 'graphic 8 vs surface', ratio: contrast(r[7]!, surface), need: graphicMin }];
  return [{ label: 'solid 9 vs surface', ratio: contrast(r[8]!, surface), need: null }];
}
