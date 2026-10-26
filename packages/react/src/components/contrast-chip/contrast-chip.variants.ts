import { cva, type VariantProps } from 'class-variance-authority';

/** The chip: 24px, soft status tint with matching text. The ratio text carries the result, the tint is redundant. */
export const contrastChipVariants = cva(
  'inline-flex h-control-xs flex-none items-center gap-1.5 whitespace-nowrap rounded-md ps-1 pe-2 font-ui text-hint font-medium',
  {
    variants: {
      result: {
        pass: 'bg-success-soft text-success-text',
        large: 'bg-warning-soft text-warning-text',
        fail: 'bg-danger-soft text-danger-text',
      },
    },
    defaultVariants: { result: 'pass' },
  },
);
export type ContrastChipVariantProps = VariantProps<typeof contrastChipVariants>;

/** The WCAG level badge, 16px tall: soft 3 with text 11 like ContrastInsight's badge, separated from the soft 3 chip
 *  by the tone's border 6 edge. No solid inside the chip, and no interaction slot used as a rest fill. */
export const contrastChipLevelVariants = cva(
  'inline-flex h-icon-md items-center rounded-xs px-1 text-micro',
  {
    variants: {
      result: {
        pass: 'bg-success-soft text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]',
        large: 'bg-warning-soft text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]',
        fail: 'bg-danger-soft text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]',
      },
    },
    defaultVariants: { result: 'pass' },
  },
);
