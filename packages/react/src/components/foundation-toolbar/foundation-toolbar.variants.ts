import { cva, type VariantProps } from 'class-variance-authority';

/** The capsule: regular glass, toolbar radius, a column of the bar line and the domain line. */
export const foundationToolbarVariants = cva('glass glass-shadow-4 flex min-w-0 max-w-full flex-col items-center gap-1.5 rounded-toolbar p-1.5 font-ui', {
  variants: { layout: { row: '', compact: 'w-full' } },
  defaultVariants: { layout: 'row' },
});

export type FoundationToolbarVariantProps = VariantProps<typeof foundationToolbarVariants>;

export const foundationToolbarBarVariants = cva('flex w-full min-w-0 items-center gap-1.5');

export const foundationToolbarActionsVariants = cva('ms-auto flex items-center gap-0.5');

export const foundationToolbarDomainsVariants = cva('flex max-w-full gap-0.5 overflow-x-auto p-0.5');

export const foundationToolbarDomainVariants = cva([
  'inline-flex min-h-control-xl min-w-control-xl shrink-0 cursor-pointer select-none flex-col items-center justify-center gap-1 whitespace-nowrap rounded-md p-1.5 font-ui text-label text-text-secondary outline-none',
  'transition-[background-color,color,box-shadow] duration-120 ease-out',
  'hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus',
  'aria-pressed:bg-neutral-selected aria-pressed:text-text-primary aria-pressed:hover:bg-neutral-selected-hover',
  // Disabled is a colour, not opacity.
  'disabled:pointer-events-none disabled:text-disabled-text disabled:aria-pressed:bg-disabled-fill disabled:aria-pressed:text-disabled-text',
]);

export const foundationToolbarDomainIconVariants = cva('inline-grid size-icon-lg shrink-0 place-items-center [&_svg]:size-full [&_svg]:stroke-[1.75]');

export const foundationToolbarPickerVariants = cva('w-full min-w-0');
