import { cva } from 'class-variance-authority';

// size steps the mono type and the row gap (mono-relaxed at md, the specimen); shadow lifts the list (none: flat).
export const tokenDiffVariants = cva('grid grid-cols-[1fr_auto_auto_auto] items-center gap-y-1 font-mono', {
  variants: {
    size: { xs: 'gap-y-0.5 font-mono text-mono-sm', sm: 'text-mono-md', md: 'text-mono-relaxed', lg: 'gap-y-1.5 text-mono-lg' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { size: 'md', shadow: 'none' },
});

/** The token name cell (the free 1fr column); tone colours it (text.secondary when neutral, the specimen). Every second
 * name sits on a neutral.well band (stripe) so the eye keeps the row across the wide gap (owner 2026-10-28). neutral.well, not
 * neutral.tint: tint equals bg.app, so the band vanished on the app background; well is opaque per surface (round 4). */
export const tokenDiffKeyVariants = cva('flex min-w-0 items-center gap-2 rounded-xs px-1', {
  variants: {
    stripe: { false: '', true: 'bg-neutral-well' },
    tone: {
      neutral: 'text-text-secondary',
      accent: 'text-accent-text',
      success: 'text-success-text',
      warning: 'text-warning-text',
      danger: 'text-danger-text',
      info: 'text-info-text',
      agent: 'text-agent-text',
    },
  },
  defaultVariants: { tone: 'neutral', stripe: false },
});

/** A dotted divider.line leader from the end of the name to the values (2px dots every 6px), so a value reads back to its name. */
export const tokenDiffLeaderVariants = cva(
  'h-1.5 min-w-2 flex-1 bg-[radial-gradient(circle,var(--cs-color-divider-line)_1px,transparent_1px)] bg-size-[calc(var(--spacing)*1.5)_calc(var(--spacing)*1.5)] bg-position-[right_center] bg-repeat-x',
);

// The old and new values. variant: soft = the diff fills and texts (the specimen); solid = danger.solid / success.solid with
// their on colours; outline = the diff texts in a 1px danger / success border; ghost = the diff texts alone.
// radius sets the corner of both values (xs, the own).

export const tokenDiffFromVariants = cva('ml-2 rounded-xs px-1 line-through', {
  variants: {
    variant: { soft: '', solid: '', outline: '', ghost: '' },
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: '', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
  },
  compoundVariants: [
    { variant: 'soft', className: 'bg-diff-remove-bg text-diff-remove-text' },
    { variant: 'solid', className: 'bg-danger-solid text-danger-on' },
    { variant: 'outline', className: 'text-diff-remove-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'ghost', className: 'text-diff-remove-text' },
  ],
  defaultVariants: { variant: 'soft', radius: 'xs' },
});
export const tokenDiffArrowVariants = cva('ml-2 text-text-tertiary');
export const tokenDiffToVariants = cva('ml-2 rounded-xs px-1 no-underline', {
  variants: {
    variant: { soft: '', solid: '', outline: '', ghost: '' },
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: '', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
  },
  compoundVariants: [
    { variant: 'soft', className: 'bg-diff-add-bg text-diff-add-text' },
    { variant: 'solid', className: 'bg-success-solid text-success-on' },
    { variant: 'outline', className: 'text-diff-add-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'ghost', className: 'text-diff-add-text' },
  ],
  defaultVariants: { variant: 'soft', radius: 'xs' },
});
