import { cva, type VariantProps } from 'class-variance-authority';

export const optionTilesVariants = cva('grid w-full gap-1.5', {
  variants: { columns: { '3': 'grid-cols-3', '4': 'grid-cols-4', '5': 'grid-cols-5' } },
  defaultVariants: { columns: '4' },
});

/**
 * One tile: flat, bordered inside. The chosen tile is the neutral selection: the selected fill, a 1.5px
 * selection edge and a check in the top-right corner, never the focus ring, so a focused chosen tile shows both.
 * Disabled is a colour, not opacity.
 */
export const optionTilesItemVariants = cva(
  [
    'group relative grid content-center place-items-center rounded-lg bg-transparent font-ui outline-none',
    'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] hover:bg-neutral-hover',
    'aria-checked:bg-neutral-selected aria-checked:shadow-[inset_0_0_0_1.5px_var(--cs-color-selection-edge)] aria-checked:hover:bg-neutral-selected-hover',
    'focus-visible:shadow-focus aria-checked:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-selection-edge),var(--cs-focus)]',
    'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
    'disabled:[&_[data-slot^=option-tiles-]]:text-disabled-text',
  ],
  {
    variants: {
      layout: {
        caption: 'h-option-tile-h gap-0.5 text-ui-sm font-semibold text-text-primary',
        icon: 'h-option-tile-icon-h gap-1 text-hint font-normal text-text-secondary aria-checked:text-text-primary',
      },
    },
    defaultVariants: { layout: 'caption' },
  },
);

export const optionTilesIconVariants = cva('inline-grid size-check place-items-center text-text-primary [&_svg]:size-full');
export const optionTilesCaptionVariants = cva('text-ui-xs font-normal text-text-tertiary group-aria-checked:text-text-secondary');
/** Check of the chosen tile, top-right, 14px in primary text (neutral, not accent); a disabled tile greys it with its other parts. */
export const optionTilesCheckVariants = cva('pointer-events-none absolute top-1 right-1 inline-grid size-icon-sm place-items-center text-text-primary [&_svg]:size-full');

export type OptionTilesVariantProps = VariantProps<typeof optionTilesVariants> & VariantProps<typeof optionTilesItemVariants>;
