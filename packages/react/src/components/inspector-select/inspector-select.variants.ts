import { cva } from 'class-variance-authority';

// Sunken inspector field box; the whole box is the button. Focus swaps fill for surface + focus-field (P9).
export const inspectorSelectVariants = cva([
  'flex h-control-md w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-lg bg-fill-hover px-2.5 text-left font-ui text-ui-sm font-normal text-text-primary outline-none',
  'transition-[background-color,box-shadow] duration-120 ease-out',
  'hover:bg-fill-pressed',
  'focus-visible:bg-surface-base focus-visible:shadow-focus-field',
  'disabled:pointer-events-none disabled:opacity-42',
]);
