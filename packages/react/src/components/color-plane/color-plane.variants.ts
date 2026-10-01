import { cva } from 'class-variance-authority';

export const colorPlaneVariants = cva(
  [
    'relative h-color-plane-h w-full cursor-crosshair touch-none select-none overflow-hidden rounded-xl',
    'bg-[linear-gradient(0deg,var(--cs-color-media-shade),transparent),linear-gradient(90deg,var(--cs-color-media-on),var(--plane-color))]',
    'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-42',
  ],
);

export const colorPlaneThumbVariants = cva(
  [
    'pointer-events-none absolute top-(--plane-y) left-(--plane-x) size-icon-md -translate-1/2 rounded-full',
    'border-[calc(var(--spacing)*0.625)] border-media-on bg-(--plane-picked) shadow-thumb-sm outline-none',
    'focus-visible:shadow-focus',
  ],
);
