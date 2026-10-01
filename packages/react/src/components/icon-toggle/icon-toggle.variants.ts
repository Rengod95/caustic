import { cva } from 'class-variance-authority';

export const iconToggleVariants = cva([
  'inline-grid size-control-xs shrink-0 select-none place-items-center rounded-sm bg-transparent font-ui text-text-secondary',
  'transition-[background-color,box-shadow,color] duration-120 ease-out',
  'outline-none hover:bg-fill-pressed hover:text-text-primary focus-visible:shadow-focus',
  'aria-pressed:bg-accent-soft aria-pressed:text-accent-text',
  'disabled:pointer-events-none disabled:opacity-42',
]);
