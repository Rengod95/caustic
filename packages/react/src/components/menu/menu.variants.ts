import { cva } from 'class-variance-authority';

/** The floating thick-glass surface. Select, Combobox and DatePicker import it: edit the anatomy here only. */
export const menuSurfaceVariants = cva(
  'glass glass-thick glass-shadow-4 min-w-menu-min rounded-2xl p-1.5 text-ui text-text-primary outline-none',
);

/** Group heading: non-interactive label. The 3px / 1px margins bring the block to the specimen height (28px) while the padding stays 5px. */
export const menuHeadingVariants = cva('mb-0.25 mt-0.75 px-2 py-1.25 text-label text-text-tertiary');

/** One action or choice. Radius lg is concentric with the surface (2xl − 6px padding). */
export const menuItemVariants = cva([
  'flex h-menu-item w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg px-2 text-left text-ui text-text-primary outline-none',
  'hover:bg-fill-pressed data-[highlighted]:bg-fill-pressed data-[selected]:bg-accent-soft',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-42',
], {
  variants: { tone: { default: '', danger: 'text-danger-text' } },
  defaultVariants: { tone: 'default' },
});

/** Leading icon / swatch: 16px, tertiary; danger for destructive items. A selected item carries one accent signal, its fill, so the icon stays neutral. */
export const menuIconVariants = cva(
  'inline-flex shrink-0 items-center text-text-tertiary [&_svg]:size-icon-md group-data-[tone=danger]:text-danger-text',
);

/** Trailing meta text or shortcut chord, pushed to the end. */
export const menuEndVariants = cva('ml-auto flex shrink-0 items-center gap-1 text-text-tertiary');

export const menuSeparatorVariants = cva('mx-1.5 my-1 h-px bg-border-subtle');
