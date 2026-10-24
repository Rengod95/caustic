import { cva, type VariantProps } from 'class-variance-authority';

// One focus edge (P9): the container swaps its border for focus-field; the inner input draws nothing.
export const inputVariants = cva(
  [
    'flex min-w-0 cursor-text items-center gap-2 text-text-tertiary transition-[box-shadow,background-color] duration-120 ease-out',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-42',
  ],
  {
    variants: {
      appearance: {
        default: [
          'bg-surface-translucent shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
          'hover:shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
          'focus-within:shadow-[var(--cs-focus-field)] hover:focus-within:shadow-[var(--cs-focus-field)]',
          'data-[invalid]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-solid)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1px_var(--cs-color-danger-solid)]',
          'data-[readonly]:bg-bg-inset data-[readonly]:shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] data-[readonly]:focus-within:shadow-[var(--cs-focus-field)]',
        ],
        sunken: [
          'bg-fill-hover hover:bg-fill-pressed focus-within:bg-surface-base focus-within:shadow-focus-field',
          'data-[invalid]:bg-danger-soft data-[invalid]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-solid)]',
        ],
      },
      size: {
        sm: 'h-field-sm rounded-lg px-2.5 text-ui',
        md: 'h-field-md rounded-xl px-3 text-ui',
        lg: 'h-field-lg rounded-2xl px-3.5 text-body',
      },
    },
    compoundVariants: [
      { appearance: 'sunken', size: 'sm', className: 'h-control-md rounded-lg px-2.5' },
      { appearance: 'sunken', size: 'md', className: 'h-control-md rounded-lg px-2.5' },
      { appearance: 'sunken', size: 'lg', className: 'h-control-md rounded-lg px-2.5' },
    ],
    defaultVariants: { appearance: 'default', size: 'md' },
  },
);
export type InputVariantProps = VariantProps<typeof inputVariants>;

// Icons size to 16 unless the icon sets its own size (:where keeps this default weaker than any class on the svg).
export const inputPrefixVariants = cva('inline-flex shrink-0 items-center text-text-tertiary [:where(&)_svg]:size-icon-md [:where(&)_svg]:stroke-[1.75]', {
  variants: { appearance: { default: '', sunken: 'w-3 text-ui-xs font-medium' } },
  defaultVariants: { appearance: 'default' },
});
// An IconButton in the suffix sits 6px closer to the edge so its hit area balances the padding.
export const inputSuffixClass = 'inline-flex shrink-0 items-center gap-2 text-ui text-text-tertiary [:where(&)_svg]:size-icon-md [:where(&)_svg]:stroke-[1.75] [&_[data-slot=icon-button]]:-me-1.5';
