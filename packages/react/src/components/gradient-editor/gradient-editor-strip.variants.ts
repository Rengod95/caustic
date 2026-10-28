import { cva } from 'class-variance-authority';

// GradientEditor.Strip. The part's common props map onto axes with their own names (barSize, stripRadius, stripShadow,
// barTone, barVariant) so they do not shadow the GradientEditor root axes.

/** The strip; size steps the bar height (md = 26px, today). */
export const gradientStripVariants = cva(
  'relative mx-2.25 mt-1.5 mb-4.5 touch-none select-none rounded-sm data-[disabled]:pointer-events-none',
  {
    variants: { barSize: { xs: 'h-5', sm: 'h-6', md: 'h-6.5', lg: 'h-8' } },
    defaultVariants: { barSize: 'md' },
  },
);

/** Common radius / shadow (lib/common-props) of the strip; the bar follows the radius. */
export const gradientStripFrameVariants = cva('', {
  variants: {
    // Common radius / shadow (lib/common-props): the default key is the component's own look (no class).
    stripRadius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: '', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    stripShadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { stripRadius: 'sm', stripShadow: 'none' },
});

/**
 * The ramp over a checkerboard. The variant is the emphasis of its edge and the tone the edge colour (lib/common-props):
 * outline neutral is the 1px swatch.edge hairline (today); outline hued = border 6; soft = a 2px soft 3 ring outside;
 * solid = a 1.5px solid 9 edge; ghost = no edge. Disabled takes the disabled.border edge in every tone.
 */
export const gradientStripBarVariants = cva(
  [
    'absolute inset-0 rounded-[inherit] in-data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
    'bg-[image:var(--gradient),conic-gradient(var(--cs-color-canvas-checker-b)_25%,var(--cs-color-canvas-checker-a)_0_50%,var(--cs-color-canvas-checker-b)_0_75%,var(--cs-color-canvas-checker-a)_0)]',
    'bg-size-[100%_100%,calc(var(--spacing)*2)_calc(var(--spacing)*2)]',
  ],
  {
    variants: {
      barTone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      barVariant: {
        solid: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-ink-solid)]',
        soft: 'shadow-[0_0_0_2px_var(--cs-color-neutral-soft)]',
        outline: 'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
        ghost: 'shadow-none',
      },
    },
    compoundVariants: [
    // solid × tone
    { barVariant: 'solid', barTone: 'accent', className: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-solid)]' },
    { barVariant: 'solid', barTone: 'success', className: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-success-solid)]' },
    { barVariant: 'solid', barTone: 'warning', className: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-warning-solid)]' },
    { barVariant: 'solid', barTone: 'danger', className: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-solid)]' },
    { barVariant: 'solid', barTone: 'info', className: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-info-solid)]' },
    { barVariant: 'solid', barTone: 'agent', className: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-agent-solid)]' },
    // soft × tone
    { barVariant: 'soft', barTone: 'accent', className: 'shadow-[0_0_0_2px_var(--cs-color-accent-soft)]' },
    { barVariant: 'soft', barTone: 'success', className: 'shadow-[0_0_0_2px_var(--cs-color-success-soft)]' },
    { barVariant: 'soft', barTone: 'warning', className: 'shadow-[0_0_0_2px_var(--cs-color-warning-soft)]' },
    { barVariant: 'soft', barTone: 'danger', className: 'shadow-[0_0_0_2px_var(--cs-color-danger-soft)]' },
    { barVariant: 'soft', barTone: 'info', className: 'shadow-[0_0_0_2px_var(--cs-color-info-soft)]' },
    { barVariant: 'soft', barTone: 'agent', className: 'shadow-[0_0_0_2px_var(--cs-color-agent-soft)]' },
    // outline × tone
    { barVariant: 'outline', barTone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { barVariant: 'outline', barTone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { barVariant: 'outline', barTone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { barVariant: 'outline', barTone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { barVariant: 'outline', barTone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { barVariant: 'outline', barTone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    ],
    defaultVariants: { barTone: 'neutral', barVariant: 'outline' },
  },
);

export const gradientStripStopVariants = cva(
  [
    'group absolute top-full left-(--stop-pos) h-auto w-4.5 pt-4.5 pb-1 -translate-x-1/2 -translate-y-1.5 cursor-grab touch-none rounded-sm outline-none',
    // The swatch covers three sides of the stop box, so the focus ring is drawn on the swatch (below).
    'active:cursor-grabbing focus-visible:shadow-none',
  ],
);

export const gradientStripStemVariants = cva(
  'pointer-events-none absolute top-0 left-1/2 h-2 w-0.5 -translate-x-1/2 bg-control-thumb shadow-[0_0_0_0.5px_var(--cs-color-swatch-edge)] in-data-[disabled]:bg-disabled-border',
);

// The swatch is the batch thumb (owner 2026-10-27): no white ring, a swatch.edge hairline and the stronger thumb shadow
// (thumb + thumb-sm). The selected stop has no mark of its own (owner 2026-10-27): the editor's stop row shows it.
// Focus draws the focus ring.
export const gradientStripSwatchVariants = cva(
  [
    'pointer-events-none absolute top-1.5 left-0 size-4.5 rounded-sm bg-(--stop-color)',
    'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge),var(--cs-elevation-thumb),var(--cs-elevation-thumb-sm)]',
    'group-focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge),var(--cs-focus)]',
  ],
);
