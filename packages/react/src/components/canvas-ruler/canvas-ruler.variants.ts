import { cva } from 'class-variance-authority';

/** Measuring strip: thick-glass fill over the canvas, a hairline on the inner edge and drawn ticks (5px every 10, 9px every 100). */
export const canvasRulerVariants = cva(
  'pointer-events-none absolute overflow-hidden bg-material-thick font-mono text-mono-ruler text-text-tertiary backdrop-blur-ultrathin',
  {
    variants: {
      orientation: {
        horizontal:
          'top-0 right-0 left-control-2xs z-10 h-control-2xs border-b border-border-default bg-no-repeat [background-image:repeating-linear-gradient(90deg,var(--cs-color-border-strong)_0_1px,transparent_1px_calc(var(--spacing)*2.5)),repeating-linear-gradient(90deg,var(--cs-color-text-tertiary)_0_1px,transparent_1px_calc(var(--spacing)*25))] [background-position:0_100%,0_100%] [background-size:100%_5px,100%_9px]',
        vertical:
          'top-control-2xs bottom-0 left-0 z-10 w-control-2xs border-r border-border-default bg-no-repeat [background-image:repeating-linear-gradient(180deg,var(--cs-color-border-strong)_0_1px,transparent_1px_calc(var(--spacing)*2.5)),repeating-linear-gradient(180deg,var(--cs-color-text-tertiary)_0_1px,transparent_1px_calc(var(--spacing)*25))] [background-position:100%_0,100%_0] [background-size:5px_100%,9px_100%]',
        corner: 'top-0 left-0 z-20 size-control-2xs border-r border-b border-border-default',
      },
    },
    defaultVariants: { orientation: 'horizontal' },
  },
);

/** Number label at a position along the strip; vertical labels read bottom-to-top. */
export const canvasRulerMarkVariants = cva('absolute', {
  variants: {
    orientation: {
      horizontal: 'top-0.5 left-(--at)',
      vertical: 'top-(--at) left-0.5 rotate-180 [writing-mode:vertical-rl]',
      corner: 'hidden',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

/** Selection range: soft accent fill bounded by two selection-colored lines. */
export const canvasRulerBandVariants = cva('absolute bg-accent-soft', {
  variants: {
    orientation: {
      horizontal: 'inset-y-0 left-(--at) w-(--size) shadow-[inset_1px_0_var(--cs-color-canvas-selection),inset_-1px_0_var(--cs-color-canvas-selection)]',
      vertical: 'inset-x-0 top-(--at) h-(--size) shadow-[inset_0_1px_var(--cs-color-canvas-selection),inset_0_-1px_var(--cs-color-canvas-selection)]',
      corner: 'hidden',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});
