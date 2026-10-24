import { cva } from 'class-variance-authority';

// Each cell is its own field box (P9 per cell): the native input draws the fill, edge and focus edge.
export const otpCellVariants = cva([
  'h-otp-h w-otp-w min-w-0 rounded-xl border-0 bg-surface-translucent p-0 text-center font-mono text-mono-lg text-text-primary outline-none',
  'caret-accent-solid transition-[box-shadow] duration-120 ease-out',
  'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
  'focus:shadow-[var(--cs-focus-field)]',
  'data-[filled]:shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] data-[filled]:focus:shadow-[var(--cs-focus-field)]',
  'data-[invalid]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-solid)] data-[invalid]:focus:shadow-[inset_0_0_0_1px_var(--cs-color-danger-solid)]',
  'disabled:pointer-events-none disabled:opacity-42',
]);
