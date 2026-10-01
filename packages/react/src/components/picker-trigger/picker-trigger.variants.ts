import { cva } from 'class-variance-authority';

// Same box as Input; the whole box is the button. Focus swaps the hairline edge for focus-field (P9).
export const pickerTriggerVariants = cva([
  'frost flex h-field-md w-full min-w-0 cursor-pointer items-center gap-2 rounded-xl bg-surface-translucent px-3 text-left text-ui text-text-primary outline-none',
  'shadow-[inset_0_0_0_1px_var(--cs-color-border-default),var(--cs-elevation-1)] transition-[box-shadow,background-color] duration-120 ease-out',
  'hover:shadow-[inset_0_0_0_1px_var(--cs-color-border-strong),var(--cs-elevation-1)]',
  'focus-visible:shadow-[var(--cs-focus-field),var(--cs-elevation-1)] hover:focus-visible:shadow-[var(--cs-focus-field),var(--cs-elevation-1)]',
  'data-[invalid]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-solid)]',
  'disabled:pointer-events-none disabled:opacity-42',
]);
