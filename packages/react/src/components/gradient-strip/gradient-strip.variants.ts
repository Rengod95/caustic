import { cva } from 'class-variance-authority';

export const gradientStripVariants = cva(
  'relative mx-2.25 mt-1.5 mb-4.5 h-6.5 touch-none select-none rounded-sm data-[disabled]:pointer-events-none data-[disabled]:opacity-42',
);

export const gradientBarVariants = cva([
  'absolute inset-0 rounded-sm shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
  'bg-[image:var(--gradient),conic-gradient(var(--cs-color-canvas-checker-b)_25%,var(--cs-color-canvas-checker-a)_0_50%,var(--cs-color-canvas-checker-b)_0_75%,var(--cs-color-canvas-checker-a)_0)]',
  'bg-size-[100%_100%,calc(var(--spacing)*2)_calc(var(--spacing)*2)]',
]);

export const gradientStopVariants = cva(
  [
    'group absolute top-full left-(--stop-pos) h-auto w-4.5 pt-4.5 pb-1 -translate-x-1/2 -translate-y-1.5 cursor-grab touch-none rounded-sm outline-none',
    'active:cursor-grabbing focus-visible:shadow-focus',
  ],
);

export const gradientStemVariants = cva(
  'pointer-events-none absolute top-0 left-1/2 h-2 w-0.5 -translate-x-1/2 bg-control-thumb shadow-[0_0_0_0.5px_var(--cs-color-swatch-edge)]',
);

export const gradientSwatchVariants = cva(
  [
    'pointer-events-none absolute top-1.5 left-0 size-4.5 rounded-sm bg-(--stop-color) shadow-thumb-swatch',
    'group-data-[selected]:shadow-[0_0_0_2px_var(--cs-color-control-thumb),0_0_0_4px_var(--cs-color-focus-ring),0_2px_6px_var(--cs-color-swatch-edge),var(--cs-focus)]',
  ],
);
