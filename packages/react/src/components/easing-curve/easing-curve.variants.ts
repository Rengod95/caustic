import { cva, type VariantProps } from 'class-variance-authority';

export const easingCurveVariants = cva('grid min-w-0 gap-3.5 font-ui');

export const easingCurveGraphVariants = cva('relative aspect-square w-curve-w max-w-full touch-none justify-self-center rounded-xl bg-bg-inset');

export const easingCurveSvgVariants = cva('absolute inset-0 size-full overflow-visible');

// SVG strokes take their color from currentColor: the token is the element's text color.
export const easingCurveGridLineVariants = cva('stroke-current text-border-subtle');
export const easingCurveDiagonalVariants = cva('stroke-current text-border-default');
export const easingCurveHandleLineVariants = cva('stroke-current text-text-tertiary');
export const easingCurvePathVariants = cva('fill-none stroke-current text-text-primary');
export const easingCurveEndpointVariants = cva('fill-current text-text-primary');

export const easingCurveHandleVariants = cva(
  'cursor-grab fill-control-thumb stroke-accent-solid outline-none focus-visible:stroke-focus-ring focus-visible:shadow-focus active:cursor-grabbing aria-disabled:cursor-default',
);

export const easingCurvePresetsVariants = cva('flex flex-wrap gap-1.5');

export const easingCurveStageVariants = cva('relative h-thumb-md overflow-hidden rounded-lg bg-bg-inset');

/** The ball travels with the edited curve and duration (runtime variables --p, --s, --o, --ease, --dur). */
export const easingCurveBallVariants = cva(
  [
    'absolute top-3.5 size-7 rounded-md bg-ink-solid shadow-2',
    'left-[calc(var(--spacing)*3+(100%-var(--spacing)*13)*var(--p))] scale-(--s) opacity-(--o)',
    'transition-[left,transform,opacity] [transition-duration:var(--dur)] [transition-timing-function:var(--ease)] motion-reduce:transition-none',
  ],
);

export const easingCurveFooterVariants = cva('flex items-center justify-between gap-2');

export type EasingCurveVariantProps = VariantProps<typeof easingCurveVariants>;
