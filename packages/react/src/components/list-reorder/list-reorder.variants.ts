import { cva } from 'class-variance-authority';

/**
 * One reorderable row: the List row box with a grab cursor and no text selection.
 * data-dragging dims it; data-drop="above" or "below" draws the 2px landing line on that edge (accent, canvas.selection is reserved for the canvas).
 * The separator starts at the text edge: grip 16 + 12 (+ the 22px position badge and 12 when numbered).
 */
export const listReorderRowVariants = cva(
  [
    'group relative flex min-h-list-row cursor-grab select-none items-center gap-3 px-3.5 py-2 font-ui text-ui text-text-primary',
    'transition-[background-color,opacity] duration-120 ease-out hover:bg-fill-hover',
    'before:absolute before:right-0 before:top-0 before:h-[1px] before:bg-border-subtle',
    'before:left-[calc(var(--spacing)*3.5+var(--li-lead,0px)+var(--spacing)*3)] first:before:hidden',
    'data-[dragging]:opacity-64',
    'data-[drop=above]:shadow-[inset_0_2px_0_var(--cs-color-accent-solid)] data-[drop=below]:shadow-[inset_0_-2px_0_var(--cs-color-accent-solid)]',
  ],
  {
    variants: {
      numbered: {
        true: '[--li-lead:calc(var(--spacing)*12.5)]',
        false: '[--li-lead:var(--cs-icon-md)]',
      },
    },
    defaultVariants: { numbered: false },
  },
);

/** The grip button: 16px glyph, 24px hit area through a pseudo-element so the layout stays as in the specimen. */
export const listReorderHandleVariants = cva(
  'relative flex size-icon-md flex-none cursor-grab touch-none items-center justify-center rounded-xs text-text-disabled outline-none transition-[color] duration-120 ease-out before:absolute before:-inset-1 group-hover:text-text-secondary focus-visible:shadow-focus aria-pressed:text-text-primary',
);

/** Position badge: 22px square, mono 11px. */
export const listReorderIndexVariants = cva(
  'grid size-index-badge flex-none place-items-center rounded-sm bg-fill-pressed font-mono text-mono-sm font-semibold text-text-secondary',
);
