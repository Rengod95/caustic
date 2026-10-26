import { cva } from 'class-variance-authority';

export const iconToggleVariants = cva([
  'inline-grid size-control-xs shrink-0 select-none place-items-center rounded-sm bg-transparent font-ui text-text-secondary',
  'transition-[background-color,box-shadow,color] duration-120 ease-out',
  'outline-none hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus',
  // On = neutral selection (decision 3): neutral-selected fill + selection edge, never accent soft or the focus ring.
  'aria-pressed:bg-neutral-selected aria-pressed:text-text-primary aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-selection-edge)]',
  'aria-pressed:hover:bg-neutral-selected-hover aria-pressed:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-selection-edge),var(--cs-focus)]',
  // Disabled is a colour, not opacity.
  'disabled:pointer-events-none disabled:text-disabled-text disabled:aria-pressed:bg-disabled-fill disabled:aria-pressed:text-disabled-text disabled:aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
]);
