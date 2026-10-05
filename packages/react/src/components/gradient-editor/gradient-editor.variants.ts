import { cva } from 'class-variance-authority';

export const gradientEditorVariants = cva(
  'grid grid-cols-[repeat(auto-fit,minmax(min(100%,calc(var(--spacing)*75)),1fr))] gap-4 text-ui text-text-primary',
);

export const gradientCanvasVariants = cva('flex min-w-0 flex-col gap-3');

export const gradientPreviewVariants = cva([
  'relative h-gradient-preview-h touch-none rounded-xl select-none',
  'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
  'bg-[image:var(--gradient),conic-gradient(var(--cs-color-canvas-checker-b)_25%,var(--cs-color-canvas-checker-a)_0_50%,var(--cs-color-canvas-checker-b)_0_75%,var(--cs-color-canvas-checker-a)_0)]',
  'bg-size-[100%_100%,calc(var(--spacing)*2.5)_calc(var(--spacing)*2.5)]',
]);

export const gradientGuideVariants = cva([
  'pointer-events-none absolute inset-0 size-full overflow-visible',
  '[&_line]:stroke-canvas-handle [&_line]:stroke-[1.5px] [&_line]:[filter:drop-shadow(0_0_1px_color-mix(in_oklab,var(--cs-color-media-shade)_50%,transparent))]',
  '[&_circle]:fill-none [&_circle]:stroke-canvas-handle [&_circle]:stroke-1 [&_circle]:[stroke-dasharray:4_4] [&_circle]:[filter:drop-shadow(0_0_1px_color-mix(in_oklab,var(--cs-color-media-shade)_50%,transparent))]',
]);

export const gradientHandleVariants = cva(
  [
    'absolute top-(--hy) left-(--hx) z-10 size-icon-md -translate-1/2 cursor-grab touch-none rounded-full outline-none active:cursor-grabbing',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-42',
  ],
  {
    variants: {
      end: {
        false: 'bg-canvas-handle shadow-thumb-sm focus-visible:shadow-focus',
        true: 'bg-transparent shadow-[inset_0_0_0_3px_var(--cs-color-canvas-handle),var(--cs-elevation-thumb-sm)] focus-visible:shadow-[inset_0_0_0_3px_var(--cs-color-canvas-handle),var(--cs-focus)]',
      },
      // A mixed handle has no position to show; it stays reachable and appears while focused.
      mixed: { true: 'opacity-0 focus-visible:opacity-100', false: '' },
    },
    defaultVariants: { end: false, mixed: false },
  },
);

export const gradientDotVariants = cva([
  'absolute top-(--dy) left-(--dx) size-3.5 -translate-1/2 rotate-45 cursor-grab touch-none rounded-xs bg-(--stop-color) active:cursor-grabbing',
  'shadow-[0_0_0_2px_var(--cs-color-canvas-handle),var(--cs-elevation-thumb-sm)]',
  'data-[selected]:shadow-[0_0_0_2px_var(--cs-color-canvas-handle),0_0_0_4px_var(--cs-color-focus-ring),var(--cs-elevation-thumb-sm),var(--cs-focus)]',
  'data-[disabled]:pointer-events-none',
]);

export const gradientReadoutVariants = cva(
  'glass glass-thick pointer-events-none absolute top-(--ry) left-(--rx) -translate-x-1/2 -translate-y-[calc(100%+var(--spacing)*3)] rounded-sm px-2 py-0.75 text-center font-mono text-mono-sm whitespace-nowrap text-text-primary',
);

export const gradientControlsVariants = cva('flex items-center justify-between gap-2');

export const gradientStopsVariants = cva('grid min-w-0 gap-2');

export const gradientRowVariants = cva(
  'grid grid-cols-[calc(var(--spacing)*16)_auto_1fr_auto] items-center gap-1.5 rounded-md p-0.5 data-[selected]:bg-accent-soft',
);

export const gradientSummaryVariants = cva(
  'flex cursor-pointer list-none items-center gap-2 py-1 text-ui-dense text-text-tertiary outline-none focus-visible:shadow-focus [&::-webkit-details-marker]:hidden',
);
