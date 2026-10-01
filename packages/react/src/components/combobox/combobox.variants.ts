import { cva } from 'class-variance-authority';

/** Listbox on top of the menu surface: it follows the input width and scrolls past 220px. */
export const comboboxListboxVariants = cva('max-h-listbox-max min-w-0 overflow-y-auto');

/** Right-aligned type or hint (color, dimension). */
export const comboboxMetaVariants = cva('ml-auto shrink-0 text-hint text-text-tertiary');

export const comboboxEmptyVariants = cva('flex h-menu-item items-center px-2 text-ui text-text-tertiary');
