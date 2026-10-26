import { cva } from 'class-variance-authority';

export const hexInputVariants = cva(
  [
    'relative flex h-control-md min-w-0 items-center gap-1.5 rounded-lg bg-neutral-well px-2 font-mono text-mono-md font-normal',
    'transition-[background-color,box-shadow] duration-120 ease-out',
    'focus-within:bg-surface-base focus-within:shadow-focus-field',
    // Invalid is the danger border-strong edge; invalid + focus keeps it and adds the outer focus ring.
    'data-[invalid]:not-data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]',
    // Bound to a token: accent soft with the accent border-strong edge (the bound edge, step 7).
    'data-[bound]:bg-accent-soft data-[bound]:text-accent-text data-[bound]:not-data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)]',
    // Disabled is a colour, not opacity: the bound and invalid tones drop out (no accent or danger edge, fill or text).
    'data-[disabled]:bg-disabled-fill data-[disabled]:text-disabled-text',
  ],
);
