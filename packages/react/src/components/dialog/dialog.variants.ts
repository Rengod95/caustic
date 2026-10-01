import { cva, type VariantProps } from 'class-variance-authority';

export const dialogVariants = cva(
  'glass glass-thick glass-shadow-5 grid w-full gap-3 rounded-panel px-inset-regular-x py-inset-regular-y text-text-primary outline-none',
  {
    variants: { size: { sm: 'max-w-dialog-sm', md: 'max-w-dialog-md', lg: 'max-w-dialog-lg' } },
    defaultVariants: { size: 'md' },
  },
);
export type DialogVariantProps = VariantProps<typeof dialogVariants>;
