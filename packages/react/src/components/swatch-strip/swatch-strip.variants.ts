import { cva } from 'class-variance-authority';

export const swatchStripVariants = cva('grid grid-cols-(--swatch-cols) gap-1.5');

export const swatchItemVariants = cva(
  [
    'relative aspect-square min-w-0 cursor-pointer rounded-sm bg-(--swatch) outline-none',
    'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
    'transition-shadow duration-120 ease-out',
    // Checked is the selection edge (neutral 7) outside a surface gap; focus draws its own ring inside it, so both show.
    'aria-checked:shadow-[0_0_0_2px_var(--cs-color-surface-base),0_0_0_3.5px_var(--cs-color-selection-edge)]',
    'focus-visible:shadow-focus',
    'aria-checked:focus-visible:shadow-[var(--cs-focus),0_0_0_4px_var(--cs-color-surface-base),0_0_0_5.5px_var(--cs-color-selection-edge)]',
  ],
);

/** The selection check: a small surface badge centred on the checked swatch (clear of the token dot), neutral so it reads on any user colour. */
export const swatchCheckVariants = cva(
  'pointer-events-none absolute inset-0 m-auto grid size-2.5 place-items-center rounded-full bg-surface-base p-px text-text-primary shadow-[0_0_0_1px_var(--cs-color-selection-edge)] [&_svg]:size-full [&_svg]:stroke-3',
);

export const swatchDotVariants = cva(
  'pointer-events-none absolute -right-0.5 -bottom-0.5 size-1.75 rounded-full bg-accent-solid shadow-[0_0_0_1.5px_var(--cs-color-surface-base)]',
);
