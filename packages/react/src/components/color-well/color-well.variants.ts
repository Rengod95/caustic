import { cva, type VariantProps } from 'class-variance-authority';

export const colorWellVariants = cva(
  [
    'relative inline-block shrink-0 overflow-hidden align-middle transition-control',
    'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
    // Selected is the ink selection ring (selection.fill) outside a surface gap; focus draws its own ring inside it, so both show.
    'data-[selected]:shadow-[0_0_0_2px_var(--cs-color-surface-base),0_0_0_3.5px_var(--cs-color-selection-fill)]',
    // Disabled keeps the user paint; the disabled edge is drawn on the paint layers, which cover the root.
    'aria-disabled:cursor-default',
  ],
  {
    variants: {
      appearance: { flat: '', checker: 'checker' },
      size: { xs: 'size-4 rounded-xs', sm: 'size-control-2xs rounded-sm', md: 'size-control-md rounded-md', lg: 'size-control-lg rounded-lg' },
      // Common props (lib/common-props.ts): variant and tone draw the edge on the paint layer (colorWellPaintVariants);
      // radius / shadow are applied by ColorWell with radiusClass / shadowClass after these classes.
      variant: { solid: '', soft: '', outline: '', ghost: '' },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
      shadow: { none: '', '1': '', '2': '', '3': '', '4': '', '5': '' },
      interactive: { true: 'cursor-pointer outline-none focus-visible:shadow-focus data-[selected]:focus-visible:shadow-[var(--cs-focus),0_0_0_4px_var(--cs-color-surface-base),0_0_0_5.5px_var(--cs-color-selection-fill)]', false: '' },
    },
    defaultVariants: { appearance: 'flat', size: 'md', variant: 'outline', tone: 'neutral', radius: 'md', shadow: 'none', interactive: false },
  },
);

/**
 * The paint layer carries the visible edge: outline (default) = 1px (neutral: swatch.edge, a hue: its border 6), solid =
 * 2px in the graphic 8, soft = a 3px mat in the soft 3, ghost = none. Disabled always draws the disabled.border hairline.
 */
export const colorWellPaintVariants = cva(
  'absolute inset-0 rounded-[inherit] transition-colors duration-quick ease-standard in-aria-disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  {
    variants: {
      split: { true: '[clip-path:polygon(100%_0,100%_100%,0_100%)]', false: '' },
      mixed: { true: 'bg-[repeating-linear-gradient(135deg,var(--cs-color-neutral-selected)_0_calc(var(--spacing)*0.75),transparent_calc(var(--spacing)*0.75)_calc(var(--spacing)*1.5))]', false: '[background:var(--well-color)]' },
      edge: { solid: '', soft: '', outline: '', ghost: '' },
      edgeTone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    },
    compoundVariants: [
      { edge: 'outline', edgeTone: 'neutral', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]' },
      { edge: 'outline', edgeTone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
      { edge: 'outline', edgeTone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
      { edge: 'outline', edgeTone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
      { edge: 'outline', edgeTone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
      { edge: 'outline', edgeTone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
      { edge: 'outline', edgeTone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
      { edge: 'solid', edgeTone: 'neutral', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-neutral-graphic)]' },
      { edge: 'solid', edgeTone: 'accent', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-accent-graphic)]' },
      { edge: 'solid', edgeTone: 'success', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-success-graphic)]' },
      { edge: 'solid', edgeTone: 'warning', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-warning-graphic)]' },
      { edge: 'solid', edgeTone: 'danger', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-danger-graphic)]' },
      { edge: 'solid', edgeTone: 'info', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-info-graphic)]' },
      { edge: 'solid', edgeTone: 'agent', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-agent-graphic)]' },
      { edge: 'soft', edgeTone: 'neutral', className: 'shadow-[inset_0_0_0_calc(var(--spacing)*0.75)_var(--cs-color-neutral-track)]' },
      { edge: 'soft', edgeTone: 'accent', className: 'shadow-[inset_0_0_0_calc(var(--spacing)*0.75)_var(--cs-color-accent-soft)]' },
      { edge: 'soft', edgeTone: 'success', className: 'shadow-[inset_0_0_0_calc(var(--spacing)*0.75)_var(--cs-color-success-soft)]' },
      { edge: 'soft', edgeTone: 'warning', className: 'shadow-[inset_0_0_0_calc(var(--spacing)*0.75)_var(--cs-color-warning-soft)]' },
      { edge: 'soft', edgeTone: 'danger', className: 'shadow-[inset_0_0_0_calc(var(--spacing)*0.75)_var(--cs-color-danger-soft)]' },
      { edge: 'soft', edgeTone: 'info', className: 'shadow-[inset_0_0_0_calc(var(--spacing)*0.75)_var(--cs-color-info-soft)]' },
      { edge: 'soft', edgeTone: 'agent', className: 'shadow-[inset_0_0_0_calc(var(--spacing)*0.75)_var(--cs-color-agent-soft)]' },
    ],
    defaultVariants: { split: false, mixed: false, edge: 'outline', edgeTone: 'neutral' },
  },
);

/** Split only: the opaque top-left triangle; it repeats the disabled edge so a split well shows it on all four sides. */
export const colorWellSolidVariants = cva(
  'absolute inset-0 z-10 transition-colors duration-quick ease-standard [background:var(--well-solid,var(--well-color))] [clip-path:polygon(0_0,100%_0,0_100%)] in-aria-disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
);

/** Selected only: a check on a round surface badge with an ink (selection.fill) hairline, bottom-right above the paint, so it reads on any user colour. */
export const colorWellCheckVariants = cva(
  'animate-enter pointer-events-none absolute right-0.5 bottom-0.5 z-20 inline-grid place-items-center rounded-full bg-surface-base text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-selection-fill)] [&_svg]:size-full',
  {
    variants: { size: { xs: 'size-2.5 p-px', sm: 'size-2.5 p-px', md: 'size-3.5 p-0.5', lg: 'size-4 p-0.5' } },
    defaultVariants: { size: 'md' },
  },
);

export type ColorWellVariantProps = Pick<VariantProps<typeof colorWellVariants>, 'appearance'>;
