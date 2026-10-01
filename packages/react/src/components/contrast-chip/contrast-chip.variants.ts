import { cva, type VariantProps } from 'class-variance-authority';

/** The chip: 24px, soft status tint with matching text. The ratio text carries the result, the tint is redundant. */
export const contrastChipVariants = cva(
  'inline-flex h-control-xs flex-none items-center gap-1.5 whitespace-nowrap rounded-md ps-1 pe-2 font-ui text-hint font-medium',
  {
    variants: {
      result: {
        pass: 'bg-success-soft text-success-text',
        fail: 'bg-danger-soft text-danger-text',
      },
    },
    defaultVariants: { result: 'pass' },
  },
);
export type ContrastChipVariantProps = VariantProps<typeof contrastChipVariants>;

/** The WCAG level badge: solid status fill with its on-color, 16px tall. */
export const contrastChipLevelVariants = cva(
  'inline-flex h-icon-md items-center rounded-xs px-1 text-micro',
  {
    variants: {
      result: {
        pass: 'bg-success-solid text-success-on',
        fail: 'bg-danger-solid text-danger-on',
      },
    },
    defaultVariants: { result: 'pass' },
  },
);
