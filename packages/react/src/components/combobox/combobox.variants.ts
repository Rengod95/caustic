import { cva } from 'class-variance-authority';

/** Listbox on top of the menu surface: it follows the input width and scrolls past 220px. */
export const comboboxListboxVariants = cva('max-h-listbox-max min-w-0 overflow-y-auto');

/**
 * Option state on top of the menu item anatomy: the chosen option is the neutral list selection (selected fill,
 * selection edge, trailing check), never accent soft and never the focus ring. Applied after the menu item classes.
 */
export const comboboxOptionVariants = cva([
  'data-[selected]:bg-neutral-selected data-[selected]:shadow-[inset_0_0_0_1px_var(--cs-color-selection-edge)]',
  'data-[selected]:hover:bg-neutral-selected-hover data-[selected]:data-[highlighted]:bg-neutral-selected-hover',
]);

/** Trailing check of the chosen option; it takes the end position when there is no meta. */
export const comboboxCheckVariants = cva('inline-flex shrink-0 items-center text-text-secondary [&_svg]:size-icon-sm [&_svg]:stroke-[2]', {
  variants: { end: { true: 'ml-auto', false: '' } },
  defaultVariants: { end: true },
});

/** Right-aligned type or hint (color, dimension). It stays tertiary on hover, highlight and selected rows (design over contrast). */
export const comboboxMetaVariants = cva('ml-auto shrink-0 text-hint text-text-tertiary');

export const comboboxEmptyVariants = cva('flex h-menu-item items-center px-2 text-ui text-text-tertiary');
