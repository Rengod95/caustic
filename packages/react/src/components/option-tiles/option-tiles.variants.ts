import { cva, type VariantProps } from 'class-variance-authority';

export const optionTilesVariants = cva('grid w-full gap-1.5', {
  variants: { columns: { '3': 'grid-cols-3', '4': 'grid-cols-4', '5': 'grid-cols-5' } },
  defaultVariants: { columns: '4' },
});

/**
 * One tile: flat, bordered inside. The chosen tile inverts (selected utility, owner 2026-10-26): ink fill, paper text,
 * no edge, and the check in the top-right corner; its caption and check invert with it. Hover while chosen:
 * selection.fill-hover. Focus keeps the ring only. Disabled is a colour, not opacity, and drops the inversion.
 */
export const optionTilesItemVariants = cva(
  [
    'group relative grid content-center place-items-center rounded-lg bg-transparent font-ui outline-none',
    'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] hover:bg-neutral-hover',
    'aria-checked:not-disabled:selected aria-checked:not-disabled:shadow-none aria-checked:not-disabled:hover:bg-selection-fill-hover',
    'focus-visible:shadow-focus aria-checked:not-disabled:focus-visible:shadow-focus',
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
/** Check of the chosen tile, top-right, 14px in primary text (neutral, not accent; selection.on on the inverted tile); a disabled tile greys it with its other parts. */
export const optionTilesCheckVariants = cva('pointer-events-none absolute top-1 right-1 inline-grid size-icon-sm place-items-center text-text-primary [&_svg]:size-full');

export type OptionTilesVariantProps = VariantProps<typeof optionTilesVariants> & VariantProps<typeof optionTilesItemVariants>;
