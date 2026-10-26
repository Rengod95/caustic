import { cva, type VariantProps } from 'class-variance-authority';

export const fontPickerVariants = cva('grid min-w-0 gap-3.5 font-ui', {
  variants: { inline: { true: '', false: '' } },
  defaultVariants: { inline: false },
});

export const fontPickerTriggerVariants = cva([
  'flex h-control-md w-full items-center gap-2 rounded-md bg-neutral-well px-2 text-left text-text-primary outline-none',
  'transition-[background-color,box-shadow] duration-120 ease-out motion-reduce:transition-none',
  'hover:bg-neutral-hover focus-visible:shadow-focus disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text',
]);

/** "Aa" in the current face (the face is the runtime --face variable). */
export const fontPickerSampleVariants = cva('w-control-compact-xs shrink-0 text-center text-title-3 font-normal [font-family:var(--face)] data-[italic]:italic');

export const fontPickerListVariants = cva(
  'glass glass-thick glass-shadow-4 z-40 grid max-h-(--radix-popover-content-available-height) w-popover-md max-w-full overflow-y-auto justify-self-center gap-px rounded-2xl p-1.5 text-ui text-text-primary outline-none',
);

export const fontPickerOptionVariants = cva([
  'grid cursor-pointer grid-cols-[1fr_auto] items-center gap-2 rounded-lg px-2 py-1.5 text-left outline-none',
  'hover:bg-neutral-hover focus-visible:bg-neutral-hover',
  // Selected is neutral (list selection): neutral.selected, the selection edge and the check mark; never accent.soft.
  'data-[selected]:bg-neutral-selected data-[selected]:shadow-[inset_0_0_0_1px_var(--cs-color-selection-edge)]',
  'data-[selected]:hover:bg-neutral-selected-hover data-[selected]:focus-visible:bg-neutral-selected-hover',
]);

export const fontPickerOptionNameVariants = cva('block truncate text-title-overlay font-normal text-text-primary [font-family:var(--face)] data-[italic]:italic');

export type FontPickerVariantProps = VariantProps<typeof fontPickerVariants>;

/** Shown instead of the options when the list is empty (same row as the Combobox empty message). */
export const fontPickerEmptyVariants = cva('flex h-menu-item items-center px-2 text-ui text-text-tertiary');
