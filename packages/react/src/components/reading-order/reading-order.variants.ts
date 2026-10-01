import { cva } from 'class-variance-authority';

/** The sequence: an ordered list with a 2px gap and no list styling. */
export const readingOrderVariants = cva('m-0 grid list-none gap-0.5 p-0 font-ui');

/** The li wrapper carries no styling. */
export const readingOrderItemVariants = cva('');

/**
 * The control: a 30px row of 20px / 1fr / auto with an 8px gap, a grab cursor and no text selection.
 * data-dragging dims it on a pressed fill; data-drop="above" or "below" draws the 2px landing line (accent, canvas.selection is reserved for the canvas).
 */
export const readingOrderRowVariants = cva([
  'group grid h-menu-item w-full cursor-grab touch-none select-none grid-cols-[var(--cs-icon-lg)_1fr_auto] items-center gap-2 rounded-md border-0 bg-transparent px-2 text-left font-ui text-ui-dense text-text-primary outline-none',
  'transition-[background-color,opacity] duration-120 ease-out hover:bg-fill-hover focus-visible:shadow-focus',
  'data-[dragging]:bg-fill-pressed data-[dragging]:opacity-64',
  'data-[drop=above]:shadow-[inset_0_2px_0_var(--cs-color-accent-solid)] data-[drop=below]:shadow-[inset_0_-2px_0_var(--cs-color-accent-solid)]',
]);

/** Position badge: an 18px circle in mono; the warning tint flags a row that reads out of visual order. */
export const readingOrderIndexVariants = cva(
  'grid size-4.5 place-items-center rounded-full bg-fill-selected font-mono text-mono-sm font-semibold text-text-primary group-data-[warning]:bg-warning-soft group-data-[warning]:text-warning-text',
);

export const readingOrderLabelVariants = cva('min-w-0 truncate text-text-primary');

/** Grip glyph: 14px, tertiary, decorative. */
export const readingOrderHandleVariants = cva('size-icon-sm flex-none justify-self-end stroke-[1.75] text-text-tertiary');
