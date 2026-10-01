import { cva } from 'class-variance-authority';

export const swatchStripVariants = cva('grid grid-cols-(--swatch-cols) gap-1.5');

export const swatchItemVariants = cva(
  [
    'relative aspect-square min-w-0 cursor-pointer rounded-sm bg-(--swatch) outline-none',
    'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
    'transition-shadow duration-120 ease-out',
    'aria-checked:shadow-[0_0_0_2px_var(--cs-color-surface-base),0_0_0_3.5px_var(--cs-color-focus-ring),var(--cs-focus)]',
    'focus-visible:shadow-focus',
  ],
);

export const swatchDotVariants = cva(
  'pointer-events-none absolute -right-0.5 -bottom-0.5 size-1.75 rounded-full bg-accent-solid shadow-[0_0_0_1.5px_var(--cs-color-surface-base)]',
);
