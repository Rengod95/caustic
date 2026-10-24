import { cva } from 'class-variance-authority';

export const hexInputVariants = cva(
  [
    'relative flex h-control-md min-w-0 items-center gap-1.5 rounded-lg bg-fill-hover px-2 font-mono text-mono-md font-normal',
    'transition-[background-color,box-shadow] duration-120 ease-out',
    'focus-within:bg-surface-base focus-within:shadow-focus-field',
    'data-[invalid]:bg-danger-soft data-[invalid]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-solid)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1px_var(--cs-color-danger-solid)]',
    'data-[bound]:bg-accent-soft data-[bound]:text-accent-text',
    'data-[disabled]:opacity-42',
  ],
);
