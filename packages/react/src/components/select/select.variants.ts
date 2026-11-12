import { cva } from 'class-variance-authority';

/**
 * Option state on top of the menu item anatomy. The chosen option (data-selected; Radix also sets data-state="checked")
 * takes the light neutral.selected fill and keeps its text colours, with the trailing check (owner 2026-11-12, as the menu
 * item); never accent soft and never the focus ring. Hover or highlight on it moves to neutral.selected-hover.
 * A disabled chosen option is disabled.fill with disabled text. Applied after the menu item classes so it wins over them.
 */
export const selectOptionVariants = cva([
  'data-[state=checked]:not-data-[disabled]:bg-neutral-selected',
  'data-[state=checked]:not-data-[disabled]:hover:bg-neutral-selected-hover data-[state=checked]:not-data-[disabled]:data-[highlighted]:bg-neutral-selected-hover',
  'data-[disabled]:data-[state=checked]:bg-disabled-fill',
]);

/** Trailing check of the chosen option, at the menu end position. Secondary text; disabled colour. */
export const selectCheckVariants = cva('ml-auto inline-flex shrink-0 items-center text-text-secondary group-data-[disabled]:text-disabled-text animate-pop [&_svg]:size-icon-sm');

/**
 * Common props (owner 2026-10-26). The listbox is the shared Menu surface, so tone / variant / radius / shadow are
 * forwarded to menuSurfaceVariants (solid thick material by default; soft = the tone soft material; outline = a 1px
 * tone rim; ghost = no elevation; a hue on solid draws the rim; radius replaces the 2xl corner; shadow picks the
 * elevation, 4 by default). The surface classes live in menu.variants.ts (one anatomy); these axes declare the values
 * Select accepts and add nothing of their own.
 */
export const selectListboxVariants = cva('', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
    shadow: { none: '', '1': '', '2': '', '3': '', '4': '', '5': '' },
  },
  defaultVariants: { tone: 'neutral', variant: 'solid', radius: '2xl', shadow: '4' },
});

/**
 * size steps the trigger and the options together. The trigger is a PickerTrigger (field-md, ui by default); the
 * options are menu items (menuItemVariants size: xs 24 · sm 28 · md 30 · lg 36).
 */
export const selectTriggerVariants = cva('', {
  variants: {
    size: { xs: 'h-field-xs rounded-lg px-2.5 text-ui-dense', sm: 'h-field-sm', md: '', lg: 'h-field-lg text-ui-lg' },
  },
  defaultVariants: { size: 'md' },
});
