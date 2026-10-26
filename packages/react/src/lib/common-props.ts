// The five props every component supports (owner 2026-10-26): tone, variant, radius, shadow, size.
// Each component maps them onto its root, and tone / variant onto the slot that carries its emphasis. Unset means the
// component's own default (its spec states the defaults and what each value changes). The value sets are shared so the
// same word means the same thing everywhere; a component may extend `variant` with its own named variants.

/** Meaning: which semantic colour family the emphasis takes. */
export const TONES = ['neutral', 'accent', 'success', 'warning', 'danger', 'info', 'agent'] as const;
export type Tone = (typeof TONES)[number];

/** Emphasis: solid fill, soft tint, outline edge, or ghost (no fill or edge until hover). */
export const VARIANTS = ['solid', 'soft', 'outline', 'ghost'] as const;
export type Variant = (typeof VARIANTS)[number];

/** Corner radius of the root, by radius token. */
export const RADII = ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full'] as const;
export type Radius = (typeof RADII)[number];

/** Elevation of the root, by elevation token (none = flat). */
export const SHADOWS = ['none', '1', '2', '3', '4', '5'] as const;
export type Shadow = (typeof SHADOWS)[number];

/** Control scale: height, padding, type and icon size step together. */
export const SIZES = ['xs', 'sm', 'md', 'lg'] as const;
export type Size = (typeof SIZES)[number];

export interface CommonProps {
  tone?: Tone;
  variant?: Variant;
  radius?: Radius;
  shadow?: Shadow;
  size?: Size;
}

/** Root classes for an explicit radius; unset keeps the component's own radius. */
export const radiusClass: Record<Radius, string> = {
  none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
  xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
};

/** Root classes for an explicit elevation; unset keeps the component's own shadow. */
export const shadowClass: Record<Shadow, string> = {
  none: 'shadow-none', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5',
};
