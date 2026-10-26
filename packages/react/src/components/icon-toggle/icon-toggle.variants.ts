import { cva } from 'class-variance-authority';

export const iconToggleVariants = cva([
  'inline-grid size-control-xs shrink-0 select-none place-items-center rounded-sm bg-transparent font-ui text-text-secondary',
  'transition-[background-color,box-shadow,color] duration-120 ease-out',
  'outline-none hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus',
  // On inverts (selected utility, owner 2026-10-26 proposal B): ink fill, paper icon, no edge; hover while on takes
  // selection.fill-hover; focus keeps the ring only. Never accent soft.
  'aria-pressed:not-disabled:selected aria-pressed:not-disabled:hover:bg-selection-fill-hover',
  // Disabled is a colour, not opacity, and drops the inversion.
  'disabled:pointer-events-none disabled:text-disabled-text disabled:aria-pressed:bg-disabled-fill disabled:aria-pressed:text-disabled-text disabled:aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
]);
