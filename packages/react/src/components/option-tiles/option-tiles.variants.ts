import { cva, type VariantProps } from 'class-variance-authority';

export const optionTilesVariants = cva('grid w-full gap-1.5', {
  variants: { columns: { '3': 'grid-cols-3', '4': 'grid-cols-4', '5': 'grid-cols-5' } },
  defaultVariants: { columns: '4' },
});

/** One tile: flat, bordered inside; the chosen tile takes a 1.5px focus-colored edge and the soft accent fill. */
export const optionTilesItemVariants = cva(
  [
    'group grid content-center place-items-center rounded-lg bg-transparent font-ui outline-none',
    'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] hover:bg-fill-hover',
    'aria-checked:bg-accent-soft aria-checked:shadow-[inset_0_0_0_1.5px_var(--cs-color-focus-ring)]',
    'focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-42',
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
export const optionTilesCaptionVariants = cva('text-ui-xs font-normal text-text-tertiary group-aria-checked:text-accent-text');

export type OptionTilesVariantProps = VariantProps<typeof optionTilesVariants> & VariantProps<typeof optionTilesItemVariants>;
