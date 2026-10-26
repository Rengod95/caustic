import { cva } from 'class-variance-authority';

/**
 * Option state on top of the menu item anatomy. The chosen option (data-selected; Radix also sets
 * data-state="checked") is the neutral list selection: selected fill, the selection edge and a trailing check,
 * never accent soft and never the focus ring. Hover on it moves to selected-hover. Applied after the menu item
 * classes so it wins over them.
 */
export const selectOptionVariants = cva([
  'data-[selected]:bg-neutral-selected data-[selected]:shadow-[inset_0_0_0_1px_var(--cs-color-selection-edge)]',
  'data-[selected]:hover:bg-neutral-selected-hover data-[selected]:data-[highlighted]:bg-neutral-selected-hover',
  'data-[state=checked]:bg-neutral-selected data-[state=checked]:shadow-[inset_0_0_0_1px_var(--cs-color-selection-edge)]',
  'data-[state=checked]:hover:bg-neutral-selected-hover data-[state=checked]:data-[highlighted]:bg-neutral-selected-hover',
]);

/** Trailing check of the chosen option, at the menu end position. */
export const selectCheckVariants = cva('ml-auto inline-flex shrink-0 items-center text-text-secondary [&_svg]:size-icon-sm [&_svg]:stroke-[2]');
