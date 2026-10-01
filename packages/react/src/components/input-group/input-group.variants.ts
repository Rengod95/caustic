import { cva, type VariantProps } from 'class-variance-authority';

// One focus edge (P9): the container swaps its hairline for focus-field; add-ons and the bare input draw nothing.
export const inputGroupVariants = cva(
  [
    'frost flex min-w-0 cursor-text items-stretch overflow-hidden bg-surface-translucent text-ui transition-[box-shadow] duration-120 ease-out',
    'shadow-[inset_0_0_0_1px_var(--cs-color-border-default),var(--cs-elevation-1)]',
    'focus-within:shadow-[var(--cs-focus-field),var(--cs-elevation-1)]',
    'data-[invalid]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-solid)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-solid)]',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-42',
  ],
  {
    variants: {
      size: {
        sm: 'h-field-sm rounded-lg',
        md: 'h-field-md rounded-xl',
        lg: 'h-field-lg rounded-2xl text-body',
      },
    },
    defaultVariants: { size: 'md' },
  },
);
export type InputGroupVariantProps = VariantProps<typeof inputGroupVariants>;
