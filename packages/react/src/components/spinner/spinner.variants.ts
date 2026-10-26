import { cva, type VariantProps } from 'class-variance-authority';

export const spinnerVariants = cva(
  'inline-block shrink-0 rounded-full border-solid border-neutral-track animate-spinner motion-reduce:animate-none',
  {
    variants: {
      tone: {
        default: 'border-t-neutral-graphic',
        accent: 'border-t-accent-solid',
      },
      size: {
        sm: 'size-icon-sm border-[1.5px]',
        md: 'size-icon-lg border-2',
        lg: 'size-spinner-lg border-2',
      },
    },
    defaultVariants: { tone: 'default', size: 'md' },
  },
);

export type SpinnerVariantProps = VariantProps<typeof spinnerVariants>;
