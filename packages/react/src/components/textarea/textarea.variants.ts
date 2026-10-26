import { cva, type VariantProps } from 'class-variance-authority';

// One focus edge (P9): the container swaps its hairline for focus-field; the native textarea draws nothing.
// The invalid and readonly looks apply only while enabled, so a disabled field drops its tone and shows the disabled axis.
export const textareaVariants = cva(
  [
    'grid min-w-0 cursor-text rounded-xl bg-surface-translucent transition-[box-shadow,background-color] duration-120 ease-out',
    'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
    'hover:shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
    'focus-within:shadow-[var(--cs-focus-field)] hover:focus-within:shadow-[var(--cs-focus-field)]',
    'data-[invalid]:not-data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]',
    'data-[readonly]:not-data-[disabled]:bg-bg-inset data-[readonly]:not-data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] data-[readonly]:focus-within:shadow-[var(--cs-focus-field)]',
    'data-[disabled]:pointer-events-none data-[disabled]:bg-disabled-fill data-[disabled]:text-disabled-text data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  ],
  // sm: the specimen's inspector field is a textarea with the browser's 2px default padding; the 2px frame reproduces it.
  { variants: { size: { md: '', sm: 'p-0.5' } }, defaultVariants: { size: 'md' } },
);

export const textareaControlVariants = cva(
  'block w-full min-w-0 border-0 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder in-data-[readonly]:not-disabled:text-text-secondary disabled:text-disabled-text disabled:placeholder:text-disabled-text',
  {
    variants: {
      size: {
        md: 'min-h-textarea-min resize-y px-3 py-2.5 text-ui-relaxed',
        sm: 'resize-none px-2.5 py-2 text-ui',
      },
    },
    defaultVariants: { size: 'md' },
  },
);
export type TextareaVariantProps = VariantProps<typeof textareaVariants>;
