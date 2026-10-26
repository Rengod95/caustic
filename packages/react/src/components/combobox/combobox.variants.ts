import { cva } from 'class-variance-authority';

/** Listbox on top of the menu surface: it follows the input width and scrolls past 220px. */
export const comboboxListboxVariants = cva('max-h-listbox-max min-w-0 overflow-y-auto');

/**
 * Option state on top of the menu item anatomy: the chosen option inverts (selected utility: ink fill, paper text, no edge;
 * its leading icon, match, meta and trailing check invert with it), never accent soft and never the focus ring. Hover or
 * highlight on it is selection.fill-hover. A disabled chosen option drops the inversion. Applied after the menu item classes.
 */
export const comboboxOptionVariants = cva([
  'data-[selected]:not-data-[disabled]:selected',
  'data-[selected]:hover:bg-selection-fill-hover data-[selected]:data-[highlighted]:bg-selection-fill-hover',
  'data-[disabled]:data-[selected]:bg-disabled-fill',
]);

/** Trailing check of the chosen option (secondary, which reads selection.on-secondary on the inverted option); it takes the end position when there is no meta. */
export const comboboxCheckVariants = cva('inline-flex shrink-0 items-center text-text-secondary [&_svg]:size-icon-sm [&_svg]:stroke-[2]', {
  variants: { end: { true: 'ml-auto', false: '' } },
  defaultVariants: { end: true },
});

/** Right-aligned type or hint (color, dimension). Tertiary; on the chosen option it reads selection.on-tertiary (the selected utility re-points text.tertiary). */
export const comboboxMetaVariants = cva('ml-auto shrink-0 text-hint text-text-tertiary');

export const comboboxEmptyVariants = cva('flex h-menu-item items-center px-2 text-ui text-text-tertiary');
