import { cva, type VariantProps } from 'class-variance-authority';

// Common props (lib/common-props.ts): radius, shadow and size on the root (size steps the stack gap; the graph, chips
// and field keep their own size); tone and variant on the preview ball, the one filled mark of the part.
// The root is the curve width (size-curve-w, at most its column), so the graph, the chips, the stage and the footer share
// one width and a longer cubic-bezier() text can no longer widen the part and shift the centred graph (owner 2026-10-27).
export const easingCurveVariants = cva('grid w-curve-w max-w-full min-w-0 gap-3.5 font-ui', {
  variants: {
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: 'gap-2', sm: 'gap-3', md: '', lg: 'gap-4' },
  },
  defaultVariants: { radius: 'none', shadow: 'none', size: 'md' },
});

export const easingCurveGraphVariants = cva('relative aspect-square w-full touch-none rounded-xl bg-bg-inset');

export const easingCurveSvgVariants = cva('absolute inset-0 size-full overflow-visible');

// SVG strokes take their color from currentColor: the token is the element's text color.
export const easingCurveGridLineVariants = cva('stroke-current text-border-subtle');
export const easingCurveDiagonalVariants = cva('stroke-current text-border-default');
export const easingCurveHandleLineVariants = cva('stroke-current text-text-tertiary');
export const easingCurvePathVariants = cva('fill-none stroke-current text-text-primary');
export const easingCurveEndpointVariants = cva('fill-current text-text-primary');

// The handles are ink like the curve and the ball (owner 2026-10-27, proposal A): accent reads as a selection elsewhere.
export const easingCurveHandleVariants = cva(
  'cursor-grab fill-control-thumb stroke-ink-solid outline-none focus-visible:stroke-focus-ring focus-visible:shadow-focus active:cursor-grabbing aria-disabled:cursor-default',
);

// The row wraps and never clips: chips keep their natural width and a long label takes another row (K2e).
export const easingCurvePresetsVariants = cva('flex min-w-0 flex-wrap gap-1.5 [&>*]:shrink-0');

export const easingCurveStageVariants = cva('relative h-motion-stage-h overflow-hidden rounded-lg bg-bg-inset');

/** The ball's path (owner 2026-10-27, proposal B): a 1px border.subtle line through the middle of the stage, from the
 *  ball's start to its end, so the start and end of the motion read. */
export const easingCurveTrackVariants = cva('pointer-events-none absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-border-subtle');

/** The ball travels with the edited curve and duration (runtime variables --p, --s, --o, --ease, --dur). */
// solid (default) is today's ink ball with elevation 2; a tone takes its solid fill.
export const easingCurveBallVariants = cva(
  [
    'absolute top-3.5 size-7 rounded-md bg-ink-solid shadow-2',
    'left-[calc(var(--spacing)*3+(100%-var(--spacing)*13)*var(--p))] scale-(--s) opacity-(--o)',
    'transition-[left,transform,opacity] [transition-duration:var(--dur)] [transition-timing-function:var(--ease)] motion-reduce:transition-none',
  ],
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: { solid: '', soft: '', outline: '', ghost: '' },
    },
    compoundVariants: [
      { variant: 'solid', tone: 'accent', className: 'bg-accent-solid' },
      { variant: 'solid', tone: 'success', className: 'bg-success-solid' },
      { variant: 'solid', tone: 'warning', className: 'bg-warning-solid' },
      { variant: 'solid', tone: 'danger', className: 'bg-danger-solid' },
      { variant: 'solid', tone: 'info', className: 'bg-info-solid' },
      { variant: 'solid', tone: 'agent', className: 'bg-agent-solid' },
      { variant: 'soft', tone: 'neutral', className: 'bg-neutral-track' },
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
      { variant: 'outline', tone: 'neutral', className: 'bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-neutral-graphic)]' },
      { variant: 'outline', tone: 'accent', className: 'bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-graphic)]' },
      { variant: 'outline', tone: 'success', className: 'bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-success-graphic)]' },
      { variant: 'outline', tone: 'warning', className: 'bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-warning-graphic)]' },
      { variant: 'outline', tone: 'danger', className: 'bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-graphic)]' },
      { variant: 'outline', tone: 'info', className: 'bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-info-graphic)]' },
      { variant: 'outline', tone: 'agent', className: 'bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-agent-graphic)]' },
      { variant: 'ghost', tone: 'neutral', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
      { variant: 'ghost', tone: 'accent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
      { variant: 'ghost', tone: 'success', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
      { variant: 'ghost', tone: 'warning', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
      { variant: 'ghost', tone: 'danger', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
      { variant: 'ghost', tone: 'info', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
      { variant: 'ghost', tone: 'agent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'solid' },
  },
);

export const easingCurveFooterVariants = cva('flex min-w-0 items-center justify-between gap-2');

export type EasingCurveVariantProps = VariantProps<typeof easingCurveVariants>;
