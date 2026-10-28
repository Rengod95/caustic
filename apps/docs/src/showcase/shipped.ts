// The shipped colour language, read from @caustic/tokens (dist/tokens.mjs, built from packages/tokens/src/tokens.mjs),
// plus the spec grammar of build.mjs, so the lab resolves every semantic colour the way the token build does.
// apps/docs/src/tokens.d.ts types only what the foundation page reads; the colour-language fields are typed here.
import tokens from '@caustic/tokens/tokens';
import type { LCH } from './color.ts';

type Mode = 'light' | 'dark';
export const MODES: readonly Mode[] = ['light', 'dark'];

export interface ShippedSolid { name: string; role: string; light: LCH; dark: LCH }

interface ColourLanguage {
  rampRule: { fixedL: Record<Mode, number[]>; chromaShare: Record<Mode, number[]>; graphicMin: number; textMin: number };
  /** One authored solid (step 9) per mode for every hued ramp: accent, success … agent-1..3, extra-1..2, canvas-guide. */
  solids: Record<string, ShippedSolid>;
  neutral: { name: string; hue: number; chroma: number; light: number[]; dark: number[] };
  slotSteps: Record<string, number | 'on'>;
  /** Tone → the ramp it reads (agent reads agent-1). */
  tones: Record<string, string>;
  aliases: Record<string, string>;
  /** Semantic colour → spec ("<ramp>.<step>[/<alpha>]", "<ramp>-light.<step>", "<ramp>.on", "white/<a>", "=<ref>"). */
  themes: Record<Mode, Record<string, string>>;
}

export const SHIPPED = tokens as unknown as ColourLanguage;

export const kebab = (s: string) => s.replace(/\./g, '-');
export const cssVar = (name: string) => `--cs-color-${kebab(name)}`;

export interface Spec { ref: string | null; ramp: string; step: string; alpha: number }

/** build.mjs parse(). */
export function parseSpec(spec: string): Spec {
  if (spec.startsWith('=')) return { ref: spec.slice(1), ramp: '', step: '', alpha: 1 };
  const [refPart = '', a] = spec.split('/');
  const dot = refPart.lastIndexOf('.');
  const [ramp, step] = dot < 0 ? [refPart, ''] : [refPart.slice(0, dot), refPart.slice(dot + 1)];
  return { ref: null, ramp, step, alpha: a === undefined ? 1 : +a };
}

/** Steps 1–11 and the on-label of one ramp in one mode. */
export interface RampSteps { steps: readonly LCH[]; on: LCH }
export type RampSet = Record<string, Record<Mode, RampSteps>>;

/** build.mjs rampOf(): "<ramp>-light" / "<ramp>-dark" pin a mode, a bare name follows `mode`. */
export function rampOf(ramp: string, mode: Mode, set: RampSet): [string, Mode] | null {
  for (const m of MODES) if (ramp.endsWith(`-${m}`) && set[ramp.slice(0, -m.length - 1)]) return [ramp.slice(0, -m.length - 1), m];
  return set[ramp] ? [ramp, mode] : null;
}

/** build.mjs primitive(): the colour a non-reference spec reads in `mode`. Null for "=" references. */
export function resolveSpec(spec: string, mode: Mode, set: RampSet): { c: LCH; alpha: number } | null {
  const p = parseSpec(spec);
  if (p.ref !== null) return null;
  if (p.ramp === 'white') return { c: [1, 0, 0], alpha: p.alpha };
  if (p.ramp === 'black') return { c: [0, 0, 0], alpha: p.alpha };
  const r = rampOf(p.ramp, mode, set);
  if (!r) throw new Error(`unknown ramp ${p.ramp} in ${spec}`);
  const ramp = set[r[0]]![r[1]];
  const c = p.step === 'on' ? ramp.on : ramp.steps[+p.step - 1];
  if (!c) throw new Error(`${spec} missing`);
  return { c, alpha: p.alpha };
}

const r4 = (n: number) => +n.toFixed(4);
/** build.mjs emitLch(): a generated ramp step as the build stores it (L and h at 4 decimals, chroma floored into gamut). */
export const emitLch = ([L, C, h]: LCH): LCH => [r4(L), Math.floor(C * 1e4) / 1e4, r4(h)];
/** build.mjs oklch(): the exact CSS text the token build writes. */
export const emit = ([L, C, h]: LCH, alpha = 1) => `oklch(${r4(L)} ${r4(C)} ${r4(h)}${alpha < 1 ? ` / ${alpha}` : ''})`;

/**
 * "=" references (the old names kept as aliases, focus-offset, required-mark, syntax-comment) as CSS variable → target.
 * The token CSS declares them on :root as var(--cs-color-<target>), so they follow overrides written on <html>.
 */
export const REFS: Record<string, string> = Object.fromEntries(MODES.flatMap(m => Object.entries(SHIPPED.themes[m])
  .flatMap(([name, spec]) => (spec.startsWith('=') ? [[cssVar(name), cssVar(spec.slice(1))]] : []))));
