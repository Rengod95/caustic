import { cva, type VariantProps } from 'class-variance-authority';

export const separatorVariants = cva('shrink-0 bg-border-default', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'w-px self-stretch',
    },
    labeled: {
      true: 'h-auto flex items-center gap-3 bg-transparent font-normal text-ui-sm text-text-tertiary',
      false: '',
    },
  },
  defaultVariants: { orientation: 'horizontal', labeled: false },
});

export type SeparatorVariantProps = VariantProps<typeof separatorVariants>;
