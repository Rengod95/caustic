import { cva, type VariantProps } from 'class-variance-authority';

export const colorWellVariants = cva(
  [
    'relative inline-block shrink-0 overflow-hidden align-middle',
    'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
    'data-[selected]:shadow-[0_0_0_2px_var(--cs-color-surface-base),0_0_0_3.5px_var(--cs-color-focus-ring),var(--cs-focus)]',
  ],
  {
    variants: {
      appearance: { flat: '', checker: 'checker' },
      size: { sm: 'size-control-2xs rounded-sm', md: 'size-control-md rounded-md' },
      interactive: { true: 'cursor-pointer outline-none focus-visible:shadow-focus', false: '' },
    },
    defaultVariants: { appearance: 'flat', size: 'md', interactive: false },
  },
);

export const colorWellPaintVariants = cva(
  'absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
  {
    variants: {
      split: { true: '[clip-path:polygon(100%_0,100%_100%,0_100%)]', false: '' },
      mixed: { true: 'bg-[repeating-linear-gradient(135deg,var(--cs-color-fill-selected)_0_calc(var(--spacing)*0.75),transparent_calc(var(--spacing)*0.75)_calc(var(--spacing)*1.5))]', false: '[background:var(--well-color)]' },
    },
    defaultVariants: { split: false, mixed: false },
  },
);

export type ColorWellVariantProps = VariantProps<typeof colorWellVariants>;
