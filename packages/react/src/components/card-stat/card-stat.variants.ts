import { cva, type VariantProps } from 'class-variance-authority';

export const cardStatVariants = cva('overflow-hidden bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]');

export const cardStatDeltaVariants = cva(
  'inline-flex h-control-2xs items-center gap-0.75 rounded-full px-1.5 font-ui text-hint font-semibold [&_svg]:size-3 [&_svg]:stroke-[2.5]',
  {
    variants: {
      deltaTone: {
        good: 'bg-success-soft text-success-text',
        bad: 'bg-danger-soft text-danger-text',
      },
    },
    defaultVariants: { deltaTone: 'good' },
  },
);

export type CardStatDeltaVariantProps = VariantProps<typeof cardStatDeltaVariants>;

/** Sparkline bleeds to the sides and the bottom edge of the card. */
export const cardStatSparkVariants = cva(
  'block h-card-spark max-w-none',
  {
    variants: {
      size: {
        regular: '-mx-inset-regular-x -mb-inset-regular-y w-[calc(100%+2*var(--cs-inset-regular-x))]',
        compact: '-mx-inset-compact-x -mb-inset-compact-y w-[calc(100%+2*var(--cs-inset-compact-x))]',
      },
    },
    defaultVariants: { size: 'regular' },
  },
);
