import { cva, type VariantProps } from 'class-variance-authority';

/**
 * One choice row (a button with role radio or checkbox). Same box and separator as a List row:
 * the separator starts at the text edge, 14 in single mode and 14 + 18 + 12 in multiple mode (data-lead).
 * The focus ring is inset visually (outline) so the surface clip does not cut it; the shadow-focus token stays on the box.
 */
export const listSelectionRowVariants = cva([
  'group relative flex min-h-list-row w-full cursor-pointer items-center gap-3 px-3.5 py-2 text-left font-ui text-ui text-text-primary',
  'transition-[background-color] duration-120 ease-out outline-none hover:bg-fill-hover',
  'focus-visible:shadow-focus focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring',
  'disabled:pointer-events-none disabled:opacity-42',
  'before:absolute before:right-0 before:top-0 before:h-[1px] before:bg-border-subtle',
  'before:left-[calc(var(--spacing)*3.5+var(--li-lead,0px)+var(--spacing)*3)] first-of-type:before:hidden',
  'data-[lead=none]:before:left-3.5',
], {
  variants: {
    mode: {
      single: '',
      multiple: '[--li-lead:var(--cs-size-check)] aria-checked:bg-accent-soft',
    },
  },
  defaultVariants: { mode: 'single' },
});

/** The 18px box at the start of a multiple-mode row. Same box as Checkbox; decorative, the row carries aria-checked. */
export const listSelectionIndicatorVariants = cva(
  'grid size-check flex-none place-items-center rounded-sm bg-surface-base text-accent-on shadow-[inset_0_0_0_1px_var(--cs-color-border-control)] transition-[background-color] duration-120 ease-out group-aria-checked:bg-accent-solid group-aria-checked:shadow-none [&_svg]:size-icon-sm [&_svg]:stroke-3 [&_svg]:opacity-0 group-aria-checked:[&_svg]:opacity-100',
);

/** The 18px check at the end of a single-mode row; invisible until checked. */
export const listSelectionTickVariants = cva(
  'size-check flex-none text-accent-text opacity-0 transition-[opacity] duration-120 ease-out group-aria-checked:opacity-100',
);

export const listSelectionTitleVariants = cva('truncate text-ui-md text-text-primary group-aria-checked:text-accent-text');

export type ListSelectionVariantProps = VariantProps<typeof listSelectionRowVariants>;
