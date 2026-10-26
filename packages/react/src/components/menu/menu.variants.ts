import { cva } from 'class-variance-authority';

/** The floating thick-glass surface. Select, Combobox and DatePicker import it: edit the anatomy here only. */
export const menuSurfaceVariants = cva(
  'glass glass-thick glass-shadow-4 min-w-menu-min rounded-2xl p-1.5 text-ui text-text-primary outline-none',
);

/** Group heading: non-interactive label. The 3px / 1px margins bring the block to the specimen height (28px) while the padding stays 5px. */
export const menuHeadingVariants = cva('mb-0.25 mt-0.75 px-2 py-1.25 text-label text-text-tertiary');

/**
 * One action or choice. Radius lg is concentric with the surface (2xl − 6px padding).
 * Hover and the keyboard highlight share neutral-hover. The selected item inverts (selected utility: ink fill, paper text,
 * no edge; its icon, check and meta invert with it); highlighted while selected it takes selection.fill-hover.
 * Disabled is colour and drops the inversion: a disabled selected item is disabled.fill with disabled text.
 */
export const menuItemVariants = cva([
  'flex h-menu-item w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg px-2 text-left text-ui text-text-primary outline-none',
  'hover:bg-neutral-hover data-[highlighted]:bg-neutral-hover',
  'data-[selected]:not-data-[disabled]:selected data-[selected]:hover:bg-selection-fill-hover data-[selected]:data-[highlighted]:bg-selection-fill-hover',
  'data-[disabled]:pointer-events-none data-[disabled]:text-disabled-text data-[disabled]:data-[selected]:bg-disabled-fill',
], {
  variants: { tone: { default: '', danger: 'text-danger-text' } },
  defaultVariants: { tone: 'default' },
});

/**
 * Leading icon / swatch: 16px, tertiary; danger for destructive items; primary on the selected item (its check reads at full strength).
 * Disabled is colour and the tone drops: the stacked disabled rules (0,3,0) beat the danger and selected ones whatever their CSS order.
 */
export const menuIconVariants = cva(
  'inline-flex shrink-0 items-center text-text-tertiary [&_svg]:size-icon-md group-data-[tone=danger]:text-danger-text group-data-[selected]:text-text-primary group-data-[disabled]:text-disabled-text group-data-[disabled]:group-data-[tone=danger]:text-disabled-text group-data-[disabled]:group-data-[selected]:text-disabled-text',
);

/** Trailing meta text or shortcut chord, pushed to the end. Tertiary; on the selected item it reads selection.on-tertiary (the selected utility re-points text.tertiary); disabled colour. */
export const menuEndVariants = cva('ml-auto flex shrink-0 items-center gap-1 text-text-tertiary group-data-[disabled]:text-disabled-text');

export const menuSeparatorVariants = cva('mx-1.5 my-1 h-px bg-border-subtle');
