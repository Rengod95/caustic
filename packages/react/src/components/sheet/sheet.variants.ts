import { cva, type VariantProps } from 'class-variance-authority';

export const sheetVariants = cva(
  'glass glass-thick glass-shadow-5 z-60 flex flex-col text-text-primary outline-none',
  {
    variants: {
      side: {
        right: 'inset-y-2.5 right-2.5 rounded-panel',
        bottom: 'inset-x-2 bottom-2 max-h-[70dvh] rounded-t-4xl rounded-b-panel',
      },
    },
    defaultVariants: { side: 'right' },
  },
);
export type SheetVariantProps = VariantProps<typeof sheetVariants>;
