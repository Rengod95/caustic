import { cva } from 'class-variance-authority';

/**
 * Option state on top of the menu item anatomy. The chosen option (data-selected, which the menu item already inverts;
 * Radix also sets data-state="checked") inverts: the selected utility (ink fill, paper text, no edge) with its trailing
 * check inverting with it; never accent soft and never the focus ring. Hover or highlight on it moves to selection.fill-hover.
 * A disabled chosen option drops the inversion (disabled fill and text). Applied after the menu item classes so it wins over them.
 */
export const selectOptionVariants = cva([
  'data-[state=checked]:not-data-[disabled]:selected',
  'data-[state=checked]:hover:bg-selection-fill-hover data-[state=checked]:data-[highlighted]:bg-selection-fill-hover',
  'data-[disabled]:data-[state=checked]:bg-disabled-fill',
]);

/** Trailing check of the chosen option, at the menu end position. Secondary text, which reads selection.on-secondary on the inverted option; disabled colour. */
export const selectCheckVariants = cva('ml-auto inline-flex shrink-0 items-center text-text-secondary group-data-[disabled]:text-disabled-text [&_svg]:size-icon-sm [&_svg]:stroke-[2]');
