import { cva, type VariantProps } from 'class-variance-authority';

/** The stack of binding rows and the add row. */
export const inspectorBindingsVariants = cva('grid gap-2 font-ui');

/** One bound property: a 1fr / auto grid (4px between lines, the 6px column gap is the action's margin), solid base surface with a subtle hairline edge. */
export const inspectorBindingsRowVariants = cva(
  'grid grid-cols-[1fr_auto] items-center gap-1 rounded-lg bg-surface-base p-2 shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
);

export const inspectorBindingsPropertyVariants = cva('flex min-w-0 items-center gap-1.5 text-hint font-medium text-text-secondary');

export const inspectorBindingsPropertyIconVariants = cva('inline-flex size-icon-sm flex-none items-center justify-center [&_svg]:size-full [&_svg]:stroke-[1.75]');

/** End of the first line: Unbind or the count badge. */
export const inspectorBindingsActionVariants = cva('ms-1.5 flex items-center justify-self-end');

/** The bound token as a button across the full row: accent soft with an accent edge, mono; mixed is the warning tint. */
export const inspectorBindingsSelectorVariants = cva(
  [
    'col-span-full flex h-control-md w-full min-w-0 cursor-pointer items-center gap-1.5 rounded-md border-0 ps-1 pe-1.5 text-left font-mono text-mono-md font-normal text-text-primary outline-none',
    'transition-[background-color,box-shadow] duration-120 ease-out focus-visible:shadow-focus',
  ],
  {
    variants: {
      binding: {
        bound: 'bg-accent-soft shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]',
        mixed: 'bg-warning-soft shadow-[inset_0_0_0_1px_var(--cs-color-warning-solid)]',
      },
    },
    defaultVariants: { binding: 'bound' },
  },
);
export type InspectorBindingsVariantProps = VariantProps<typeof inspectorBindingsSelectorVariants>;

/** Link glyph: 12px, accent text; warning text on a mixed row. */
export const inspectorBindingsLinkVariants = cva('size-icon-xs flex-none stroke-[1.75]', {
  variants: {
    binding: { bound: 'text-accent-text', mixed: 'text-warning-text' },
  },
  defaultVariants: { binding: 'bound' },
});

/** Token color: an 18px square with a 1px inset ring; the fill is the --swatch custom property. */
export const inspectorBindingsSwatchVariants = cva('inline-flex size-check flex-none rounded-xs bg-(--swatch) shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]');

export const inspectorBindingsNameVariants = cva('min-w-0 truncate');

export const inspectorBindingsChevronVariants = cva('ms-auto size-icon-xs flex-none stroke-[1.75] text-accent-text');

/** Context line across the full row: one span per fact. */
export const inspectorBindingsContextVariants = cva('col-span-full flex flex-wrap gap-2 text-ui-xs text-text-tertiary');

/** The bind-a-property row: a dashed strong border all round. */
export const inspectorBindingsAddVariants = cva(
  [
    'flex w-full cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-border-strong bg-transparent px-3 py-2.25 text-left font-ui text-ui-dense text-text-secondary outline-none',
    'transition-[background-color,color] duration-120 ease-out hover:bg-fill-hover hover:text-text-primary focus-visible:shadow-focus',
    '[&_svg]:size-icon-sm [&_svg]:flex-none [&_svg]:stroke-[1.75]',
  ],
);
