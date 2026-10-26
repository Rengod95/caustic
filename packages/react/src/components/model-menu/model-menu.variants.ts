import { cva } from 'class-variance-authority';

/**
 * The surface is the Menu surface (menuSurfaceVariants); this only sets its width. Inline: the full frame, capped at
 * 300px (7.5 x the 40px space step), centered. Floating: the 300px.
 */
export const modelMenuWidthVariants = cva('', {
  variants: {
    inline: {
      true: 'mx-auto w-full max-w-model-menu-w',
      false: 'w-model-menu-w',
    },
  },
  defaultVariants: { inline: false },
});

/** The positioned wrapper of a floating menu: trigger plus surface. */
export const modelMenuAnchorVariants = cva('relative inline-flex');

/** Floating surface placement below the trigger. */
export const modelMenuFloatVariants = cva('absolute left-0 top-full z-60 mt-1.5');

export const modelMenuSearchVariants = cva('mb-1 text-ui');

/** The listbox wrapper: layout-neutral. A grid so the heading and separator margins do not collapse into each other. */
export const modelMenuListVariants = cva('grid');

/**
 * One model. Radius lg is concentric with the Menu surface (2xl minus 6px padding); two-line label so the height is a minimum.
 * Selection as Menu: the chosen model inverts (selected utility: ink fill, paper text, no edge; description and check invert
 * with it); hovered or highlighted while chosen: selection.fill-hover. Disabled drops the inversion: disabled.fill, disabled text.
 */
export const modelMenuItemVariants = cva([
  'group flex min-h-menu-item w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg px-2 py-1.25 text-left text-ui text-text-primary outline-none',
  'hover:bg-neutral-hover data-[highlighted]:bg-neutral-hover',
  'data-[selected]:not-data-[disabled]:selected data-[selected]:hover:bg-selection-fill-hover data-[selected]:data-[highlighted]:bg-selection-fill-hover',
  'data-[disabled]:pointer-events-none data-[disabled]:text-disabled-text data-[disabled]:data-[selected]:bg-disabled-fill',
]);

/**
 * 18px provider tile: ink fill, ink-on text, one centered capital. On the chosen (ink) model it inverts too, so it does not
 * vanish into the fill: selection.on tile, selection.fill capital. Disabled fill and text on a disabled item; the stacked
 * disabled rule (0,3,0) beats the selected one.
 */
export const modelMenuProviderVariants = cva('inline-grid size-check shrink-0 place-items-center rounded-sm bg-ink-solid text-micro text-ink-on group-data-[selected]:bg-selection-on group-data-[selected]:text-selection-fill group-data-[disabled]:bg-disabled-fill group-data-[disabled]:text-disabled-text group-data-[disabled]:group-data-[selected]:bg-disabled-fill group-data-[disabled]:group-data-[selected]:text-disabled-text');

export const modelMenuTextVariants = cva('grid min-w-0 flex-1');

export const modelMenuNameVariants = cva('truncate text-ui text-text-primary group-data-[disabled]:text-disabled-text');

/** Tertiary; on the chosen model it reads selection.on-tertiary (the selected utility re-points text.tertiary); disabled colour. */
export const modelMenuDescriptionVariants = cva('truncate text-ui-xs text-text-tertiary group-data-[disabled]:text-disabled-text');

/**
 * Trailing check box: 16px, kept on every item so rows align; the check shows on the chosen model in primary text (selection.on on the inverted item).
 * A chosen but disabled model drops its check to the disabled colour: the stacked rule (0,3,0) beats the selected one.
 */
export const modelMenuEndVariants = cva('ml-auto inline-flex size-icon-md shrink-0 items-center text-text-tertiary group-data-[selected]:text-text-primary group-data-[disabled]:text-disabled-text group-data-[disabled]:group-data-[selected]:text-disabled-text [&_svg]:size-full');

/** Action row for a provider that is not connected: the item box in tertiary text. */
export const modelMenuConnectVariants = cva([
  'flex min-h-menu-item w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg px-2 py-1.25 text-left text-ui text-text-tertiary outline-none',
  'hover:bg-neutral-hover focus-visible:bg-neutral-hover',
]);

export const modelMenuConnectProviderVariants = cva('inline-grid size-check shrink-0 place-items-center rounded-sm bg-neutral-track text-micro text-text-secondary');

export const modelMenuConnectEndVariants = cva('ml-auto inline-flex size-icon-md shrink-0 items-center text-text-tertiary [&_svg]:size-full');
