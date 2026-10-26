import { cva, type VariantProps } from 'class-variance-authority';

/**
 * One choice row (a button with role radio or checkbox). Same box and separator as a List row:
 * the separator starts at the text edge, 14 in single mode and 14 + 18 + 12 in multiple mode (data-lead).
 * The focus ring is inset visually (outline) so the surface clip does not cut it; the shadow-focus token stays on the box.
 * A checked row inverts (selected utility, owner 2026-10-26): ink fill, paper text, no edge; its check (box or tick),
 * title and description invert with it. Hover while checked: selection.fill-hover. Focus keeps the ring only.
 * Disabled is colour: the row text and the check drop to the disabled slots; a checked disabled row drops the inversion
 * and takes disabled.fill.
 */
export const listSelectionRowVariants = cva([
  'group relative flex min-h-list-row w-full cursor-pointer items-center gap-3 px-3.5 py-2 text-left font-ui text-ui text-text-primary',
  'transition-[background-color] duration-120 ease-out outline-none hover:bg-neutral-hover',
  'aria-checked:not-disabled:selected aria-checked:not-disabled:hover:bg-selection-fill-hover',
  'focus-visible:shadow-focus focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring',
  'disabled:pointer-events-none disabled:text-disabled-text disabled:aria-checked:bg-disabled-fill',
  'before:absolute before:right-0 before:top-0 before:h-[1px] before:bg-border-subtle',
  'before:left-[calc(var(--spacing)*3.5+var(--li-lead,0px)+var(--spacing)*3)] first-of-type:before:hidden',
  'data-[lead=none]:before:left-3.5',
], {
  variants: {
    mode: {
      single: '',
      multiple: '[--li-lead:var(--cs-size-check)]',
    },
  },
  defaultVariants: { mode: 'single' },
});

/** The 18px box at the start of a multiple-mode row. Same box as Checkbox; decorative, the row carries aria-checked. Checked: accent.solid with the accent.on check, which the inverted row re-points to selection.on with a selection.fill check. Disabled: disabled fill and border. */
export const listSelectionIndicatorVariants = cva(
  'grid size-check flex-none place-items-center rounded-sm bg-surface-base text-accent-on shadow-[inset_0_0_0_1px_var(--cs-color-border-control)] transition-[background-color] duration-120 ease-out group-aria-checked:bg-accent-solid group-aria-checked:shadow-none [&_svg]:size-icon-sm [&_svg]:stroke-3 [&_svg]:opacity-0 group-aria-checked:[&_svg]:opacity-100 group-disabled:bg-disabled-fill group-disabled:group-aria-checked:bg-disabled-fill group-disabled:text-disabled-text group-disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
);

/** The 18px check at the end of a single-mode row; invisible until checked; accent.text, which reads selection.on on the inverted row. */
export const listSelectionTickVariants = cva(
  'size-check flex-none text-accent-text opacity-0 transition-[opacity] duration-120 ease-out group-aria-checked:opacity-100 group-disabled:text-disabled-text',
);

export const listSelectionTitleVariants = cva('truncate text-ui-md text-text-primary group-disabled:text-disabled-text');

/** The List description line; on a disabled row it drops to the disabled colour with the title (the shared List description has no disabled state). */
export const listSelectionDescriptionVariants = cva('truncate text-ui-sm font-normal text-text-tertiary group-disabled:text-disabled-text');

export type ListSelectionVariantProps = VariantProps<typeof listSelectionRowVariants>;
