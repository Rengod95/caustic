import { cva, type VariantProps } from 'class-variance-authority';

export const tokenChipVariants = cva(
  'frost inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md font-mono text-mono-md text-text-primary',
  {
    variants: {
      tone: {
        neutral: 'bg-fill-hover shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
        bound: 'bg-accent-soft shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]',
      },
      size: {
        sm: 'h-control-2xs pl-0.75 pr-1.5',
        md: 'h-control-xs pl-1 pr-2',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
);

export const tokenChipSwatchVariants = cva(
  'inline-flex shrink-0 overflow-hidden rounded-xs bg-(--swatch) shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
  {
    variants: { size: { sm: 'size-icon-sm', md: 'size-icon-md' } },
    defaultVariants: { size: 'md' },
  },
);

export type TokenChipVariantProps = VariantProps<typeof tokenChipVariants>;
