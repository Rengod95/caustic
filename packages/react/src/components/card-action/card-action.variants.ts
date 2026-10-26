import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Whole-card target: opaque surface with a hairline ring (one depth cue, no resting elevation); on hover the lift
 * elevation replaces the hairline and the card rises 2px (the transform drops under reduced motion).
 * Selected (radio) inverts (selected utility, owner 2026-10-26): ink fill, paper text, no edge; the radio indicator,
 * tile text and description invert with it. Hover while selected: selection.fill-hover plus the lift. Focus keeps the
 * ring only. A disabled selected card drops the inversion.
 */
export const cardActionVariants = cva(
  [
    'cursor-pointer bg-surface-base text-left no-underline outline-none',
    'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
    'transition-[transform,box-shadow,background-color] duration-base ease-spring',
    'hover:-translate-y-0.5 hover:shadow-[var(--cs-elevation-lift)]',
    'motion-reduce:transition-[box-shadow,background-color] motion-reduce:hover:translate-y-0',
    'focus-visible:shadow-focus',
    'data-[state=checked]:not-disabled:selected data-[state=checked]:not-disabled:shadow-none',
    'data-[state=checked]:not-disabled:hover:bg-selection-fill-hover data-[state=checked]:not-disabled:hover:shadow-[var(--cs-elevation-lift)]',
    'data-[state=checked]:not-disabled:focus-visible:shadow-focus',
  ],
  {
    variants: {
      kind: { link: '', radio: '' },
    },
    defaultVariants: { kind: 'link' },
  },
);

export type CardActionVariantProps = VariantProps<typeof cardActionVariants>;

export const cardActionArrowVariants = cva([
  'inline-flex size-icon-sm flex-none text-text-tertiary hover:text-text-primary [&_svg]:size-full',
  'transition-[transform,color] duration-base ease-spring',
  'group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-text-primary',
  'motion-reduce:group-hover/card:translate-x-0 motion-reduce:group-hover/card:translate-y-0',
]);

export const cardActionIndicatorVariants = cva([
  'pointer-events-none inline-grid size-check flex-none place-items-center rounded-full bg-surface-base',
  'shadow-[inset_0_0_0_1px_var(--cs-color-border-control)]',
  'group-data-[state=checked]/card:bg-accent-solid group-data-[state=checked]/card:shadow-none',
]);
