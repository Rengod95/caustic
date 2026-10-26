import { cva, type VariantProps } from 'class-variance-authority';

export const colorWellVariants = cva(
  [
    'relative inline-block shrink-0 overflow-hidden align-middle',
    'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
    // Selected is the ink selection ring (selection.fill) outside a surface gap; focus draws its own ring inside it, so both show.
    'data-[selected]:shadow-[0_0_0_2px_var(--cs-color-surface-base),0_0_0_3.5px_var(--cs-color-selection-fill)]',
    // Disabled keeps the user paint; the disabled edge is drawn on the paint layers, which cover the root.
    'aria-disabled:cursor-default',
  ],
  {
    variants: {
      appearance: { flat: '', checker: 'checker' },
      size: { sm: 'size-control-2xs rounded-sm', md: 'size-control-md rounded-md' },
      interactive: { true: 'cursor-pointer outline-none focus-visible:shadow-focus data-[selected]:focus-visible:shadow-[var(--cs-focus),0_0_0_4px_var(--cs-color-surface-base),0_0_0_5.5px_var(--cs-color-selection-fill)]', false: '' },
    },
    defaultVariants: { appearance: 'flat', size: 'md', interactive: false },
  },
);

export const colorWellPaintVariants = cva(
  'absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)] in-aria-disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  {
    variants: {
      split: { true: '[clip-path:polygon(100%_0,100%_100%,0_100%)]', false: '' },
      mixed: { true: 'bg-[repeating-linear-gradient(135deg,var(--cs-color-neutral-selected)_0_calc(var(--spacing)*0.75),transparent_calc(var(--spacing)*0.75)_calc(var(--spacing)*1.5))]', false: '[background:var(--well-color)]' },
    },
    defaultVariants: { split: false, mixed: false },
  },
);

/** Split only: the opaque top-left triangle; it repeats the disabled edge so a split well shows it on all four sides. */
export const colorWellSolidVariants = cva(
  'absolute inset-0 z-10 [background:var(--well-solid,var(--well-color))] [clip-path:polygon(0_0,100%_0,0_100%)] in-aria-disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
);

/** Selected only: a check on a round surface badge with an ink (selection.fill) hairline, bottom-right above the paint, so it reads on any user colour. */
export const colorWellCheckVariants = cva(
  'pointer-events-none absolute right-0.5 bottom-0.5 z-20 inline-grid place-items-center rounded-full bg-surface-base text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-selection-fill)] [&_svg]:size-full [&_svg]:stroke-3',
  {
    variants: { size: { sm: 'size-2.5 p-px', md: 'size-3.5 p-0.5' } },
    defaultVariants: { size: 'md' },
  },
);

export type ColorWellVariantProps = VariantProps<typeof colorWellVariants>;
