// Lab: decisions for the colour language (PROPOSAL-color-language.md §8). Temporary; removed once the owner has decided.
// Every option card renders the same scene under its own scoped variables, computed from the builder's saved colours
// with the proposed language on, so the page follows whatever the owner tuned in #/lab/builder.
import type { CSSProperties } from 'react';
import { contrast, css, gamutMap, type LCH } from '../color.ts';
import { DARK_LINKS_LOWER, neutralsFor, roleStepOf, scopeVars, type Palette, type Theme } from '../palettes.ts';
import { rampFor } from '../builder/language.ts';
import { builderVars, load, toPalette, valueOf, type BuilderState } from '../builder/state.ts';

/** The builder's saved state (read only) with the proposed language switched on. */
export function decisionBase(): BuilderState {
  return { ...load(), language: 'proposed' };
}

/** Scoped style for a wrapper: the builder's variables for one theme, plus option overrides, with the Tailwind twins restated. */
export function scope(s: BuilderState, t: Theme, extra: Record<string, string> = {}): CSSProperties {
  return scopeVars({ ...builderVars(s, t), ...extra }) as CSSProperties;
}

export const withDark = (s: BuilderState, darkSurface: BuilderState['darkSurface']): BuilderState => ({ ...s, darkSurface });

// ---------- Q1: ink.* merged into accent-* ----------

export function mergeInk(s: BuilderState, t: Theme): Record<string, string> {
  const v = builderVars(s, t);
  return {
    '--cs-color-ink-solid': v['--cs-color-accent-solid']!,
    '--cs-color-ink-hover': v['--cs-color-accent-hover']!,
    '--cs-color-ink-on': v['--cs-color-accent-on']!,
    '--cs-color-ink-on-muted': `color-mix(in oklab, ${v['--cs-color-accent-on']!} 75%, transparent)`,
  };
}

// ---------- Q2: neutral interaction fills opaque instead of alpha ----------

/** Fixed neutral steps a fully opaque language would use: one step above the light surface, one above the dark raised. */
export const OPAQUE_STEPS: Record<Theme, { hover: number; pressed: number; selected: number }> = {
  light: { hover: 2, pressed: 3, selected: 4 },
  dark: { hover: 4, pressed: 5, selected: 5 },
};

export function opaqueNeutral(t: Theme): Record<string, string> {
  const o = OPAQUE_STEPS[t];
  const n = (k: number) => `var(--cs-neutral-${t}-${k})`;
  return { '--cs-color-fill-hover': n(o.hover), '--cs-color-fill-pressed': n(o.pressed), '--cs-color-fill-selected': n(o.selected) };
}

/** Lightness of a neutral role and of a fixed step, for the "hover vs its background" readout. */
export const roleL = (p: Palette, t: Theme, role: string) => neutralsFor(p, t)[roleStepOf(p, t, role) - 1]![0];
export const stepL = (p: Palette, t: Theme, k: number) => neutralsFor(p, t)[k - 1]![0];

// ---------- Q3: a hued accent, to show what the selection choice means once the accent has a hue ----------

/** --lang-accent-* replaced by a ramp built from another colour (the owner's info colour stands in for a hued accent). */
export function huedAccent(s: BuilderState, t: Theme): Record<string, string> {
  const p = toPalette(s);
  const r = rampFor(valueOf(s.colors.info, t), p, t);
  const v: Record<string, string> = {};
  r.forEach((c, i) => { v[`--lang-accent-${i + 1}`] = css(c); });
  v['--lang-accent-on'] = css(onOf(r[8]!, p));
  return v;
}

/** Ink or paper (the light ramp's two ends), whichever reads better on a fill. */
export function onOf(fill: LCH, p: Palette): LCH {
  const ink = neutralsFor(p, 'light')[10]!, paper = neutralsFor(p, 'light')[0]!;
  return contrast(ink, fill) >= contrast(paper, fill) ? ink : paper;
}

// ---------- Q4: canvas guides in their own colour ----------

/** A canvas-only magenta, far from every status hue (danger sits near h 40). */
export const GUIDE_OWN: Record<Theme, LCH> = { light: [0.6, 0.2, 345], dark: [0.72, 0.17, 345] };

export function ownGuide(s: BuilderState, t: Theme): Record<string, string> {
  const c = gamutMap(GUIDE_OWN[t]);
  return { '--cs-color-canvas-guide': css(c), '--cs-color-canvas-guide-on': css(onOf(c, toPalette(s))) };
}

// ---------- Q5: dark background ladder ----------

export const LADDER = [['bg canvas', 'canvas'], ['bg app', 'app'], ['surface base', 'surface'], ['surface raised', 'raised']] as const;

export function ladder(s: BuilderState): { role: string; name: string; step: number; L: number }[] {
  const p = toPalette(s);
  return LADDER.map(([role, name]) => ({ role, name, step: roleStepOf(p, 'dark', role), L: roleL(p, 'dark', role) }));
}

export { DARK_LINKS_LOWER };

// ---------- Q7: light solids above L .7 ----------

export const CAP_L = 0.7;
export const capped = (c: LCH): LCH => (c[0] > CAP_L ? gamutMap([CAP_L, c[1], c[2]]) : c);
