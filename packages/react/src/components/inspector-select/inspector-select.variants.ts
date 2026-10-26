import { cva } from 'class-variance-authority';

// Sunken inspector field box; the whole box is the button. Rest is the neutral well, hover the neutral hover.
// Focus swaps the well for surface + focus-field (P9). Invalid is the danger border-strong edge; with focus it keeps
// the edge and adds the outer focus ring, so neither erases the other. Disabled is a colour, not opacity, and the
// tone drops: a disabled invalid box loses the danger edge (the compound beats the data-invalid edge).
export const inspectorSelectVariants = cva([
  'flex h-control-md w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-lg bg-neutral-well px-2.5 text-left font-ui text-ui-sm font-normal text-text-primary outline-none',
  'transition-[background-color,box-shadow] duration-120 ease-out',
  'hover:bg-neutral-hover',
  'focus-visible:bg-surface-base focus-visible:shadow-focus-field',
  'data-[invalid=true]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)]',
  'data-[invalid=true]:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]',
  'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-none disabled:data-[invalid=true]:shadow-none',
]);
