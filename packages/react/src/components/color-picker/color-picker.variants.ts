import { cva } from 'class-variance-authority';

export const colorPickerVariants = cva('relative grid max-w-full text-ui text-text-primary outline-none', {
  variants: {
    embedded: {
      false: 'glass glass-thick glass-shadow-4 z-40 w-color-picker-w overflow-hidden rounded-2xl',
      true: 'w-full',
    },
  },
  defaultVariants: { embedded: false },
});

export const colorPickerHeaderVariants = cva('flex items-center gap-1 px-2 pt-2');

export const colorPickerTypesVariants = cva('flex gap-0.5 px-2 pt-2');

export const colorPickerTypeVariants = cva(
  [
    'grid size-control-sm shrink-0 cursor-pointer place-items-center rounded-md text-text-tertiary outline-none',
    'transition-[background-color,color,box-shadow] duration-120 ease-out',
    'hover:bg-fill-pressed hover:text-text-primary focus-visible:shadow-focus',
    'aria-checked:bg-fill-selected aria-checked:text-text-primary',
    '[&_svg]:size-icon-sm [&_svg]:stroke-[1.75]',
  ],
);

export const colorPickerGlyphVariants = cva('block size-icon-sm rounded-xs shadow-[inset_0_0_0_1.5px_currentColor]', {
  variants: {
    kind: {
      solid: 'bg-current',
      linear: 'bg-[linear-gradient(90deg,currentColor,transparent)]',
      radial: 'rounded-full bg-[radial-gradient(currentColor,transparent_70%)]',
      angular: 'rounded-full bg-[conic-gradient(currentColor,transparent)]',
      diamond: 'rotate-45 scale-[0.82] bg-[linear-gradient(currentColor,transparent)]',
    },
  },
  defaultVariants: { kind: 'solid' },
});

export const colorPickerBodyVariants = cva('grid gap-2.5', {
  variants: { embedded: { false: 'p-2.5', true: '' } },
  defaultVariants: { embedded: false },
});

export const colorPickerSlidersVariants = cva('grid items-center gap-2', {
  variants: { picker: { true: 'grid-cols-[auto_1fr_auto]', false: 'grid-cols-[1fr_auto]' } },
  defaultVariants: { picker: true },
});

export const colorPickerTracksVariants = cva('grid min-w-0 gap-2.5');

export const colorPickerPreviewVariants = cva(
  'checker relative block size-color-preview shrink-0 overflow-hidden rounded-md shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
);

export const colorPickerFieldsVariants = cva(
  'grid h-control-md grid-cols-[var(--cs-size-picker-format-w)_1fr_var(--cs-size-picker-alpha-w)] gap-1',
);

export const colorPickerFormatVariants = cva(
  [
    'flex h-control-md w-picker-format-w cursor-pointer items-center justify-between rounded-md bg-fill-hover pr-1.5 pl-2 text-ui-sm font-normal text-text-primary outline-none',
    'transition-[background-color,box-shadow] duration-120 ease-out hover:bg-fill-pressed focus-visible:shadow-focus',
    '[&_svg]:size-icon-xs [&_svg]:text-text-tertiary [&_svg]:stroke-[1.75]',
  ],
);

export const colorPickerFootVariants = cva('grid gap-1.5 border-t border-border-subtle px-2.5 py-2');

/** The painted layer of the preview: the picked color, or the hatch of a mixed selection. */
export const colorPickerPreviewFillVariants = cva('absolute inset-0', {
  variants: {
    mixed: {
      true: 'bg-[repeating-linear-gradient(135deg,var(--cs-color-fill-selected)_0_calc(var(--spacing)*0.75),transparent_calc(var(--spacing)*0.75)_calc(var(--spacing)*1.5))]',
      false: 'bg-(--picked)',
    },
  },
  defaultVariants: { mixed: false },
});
