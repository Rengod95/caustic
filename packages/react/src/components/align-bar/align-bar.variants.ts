import { cva, type VariantProps } from 'class-variance-authority';

export const alignBarVariants = cva('inline-flex items-stretch gap-px rounded-lg bg-fill-hover font-ui', {
  variants: { density: { regular: 'p-0.5', tight: 'p-px' } },
  defaultVariants: { density: 'regular' },
});

export type AlignBarVariantProps = VariantProps<typeof alignBarVariants>;
