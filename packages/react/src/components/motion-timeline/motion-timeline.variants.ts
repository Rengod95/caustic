import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The player surface. Common props (owner 2026-10-26), unset = today: tone is the keyframe colour (--mt-key: the ring and
 * the selected fill), accent by default; variant is the surface: solid (default) surface.base with the border.subtle
 * hairline, soft the tone's soft 3 without edge, outline no fill with the tone's border 6 edge, ghost no fill or edge.
 * radius replaces the xl corner; shadow adds an elevation (it replaces the hairline: one depth cue).
 */
export const motionTimelineVariants = cva('overflow-hidden rounded-xl bg-surface-base font-ui text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]', {
  variants: {
    tone: {
      neutral: '[--mt-key:var(--cs-color-neutral-solid)]',
      accent: '',
      success: '[--mt-key:var(--cs-color-success-solid)]',
      warning: '[--mt-key:var(--cs-color-warning-solid)]',
      danger: '[--mt-key:var(--cs-color-danger-solid)]',
      info: '[--mt-key:var(--cs-color-info-solid)]',
      agent: '[--mt-key:var(--cs-color-agent-solid)]',
    },
    variant: { solid: '', soft: '', outline: '', ghost: 'bg-transparent shadow-none' },
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  compoundVariants: [
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft shadow-none' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft shadow-none' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft shadow-none' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft shadow-none' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft shadow-none' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft shadow-none' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft shadow-none' },
    { variant: 'outline', tone: 'neutral', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
  ],
  defaultVariants: { tone: 'accent', variant: 'solid', radius: 'xl', shadow: 'none' },
});

export const motionTimelineBodyVariants = cva('relative');

/** Time ruler: starts after the label column, a hairline below and a tick every 5 % along the bottom. */
export const motionTimelineRulerVariants = cva([
  'relative ml-timeline-label-w h-6 cursor-col-resize touch-none border-b border-border-subtle',
  'bg-[repeating-linear-gradient(90deg,var(--cs-color-border-default)_0_1px,transparent_1px_5%)] bg-position-[0_100%] bg-size-[100%_calc(var(--spacing)*1.5)] bg-no-repeat',
]);

export const motionTimelineRulerLabelVariants = cva('absolute top-1 left-(--x) -translate-x-1/2 font-mono text-mono-sm whitespace-nowrap text-text-tertiary');

/** One lane row; size steps its height (xs 24 · sm 28 · md 32 · lg 40). Bars and keyframes centre on it. */
export const motionTimelineLaneVariants = cva('grid grid-cols-[var(--cs-size-timeline-label-w)_1fr] items-center border-b border-border-subtle last:border-b-0', {
  variants: { size: { xs: 'h-6', sm: 'h-7', md: 'h-8', lg: 'h-10' } },
  defaultVariants: { size: 'md' },
});

/**
 * Lane name. With onLaneSelect it is a toggle button: focus draws the ring and the selected lane inverts (selected utility).
 * size steps the type (xs ui-xs · sm and md ui-sm · lg ui).
 */
export const motionTimelineLaneLabelVariants = cva([
  'flex h-full items-center gap-1.5 overflow-hidden px-2.5 font-normal whitespace-nowrap text-text-secondary outline-none [&_svg]:size-chip-icon [&_svg]:shrink-0 [&_svg]:stroke-[1.75]',
  'transition-control [&[role=button]]:press [&[role=button]]:cursor-pointer [&[role=button]]:hover:bg-neutral-hover focus-visible:shadow-focus aria-pressed:selected aria-pressed:hover:bg-selection-fill-hover',
], {
  variants: { size: { xs: 'text-ui-xs', sm: 'text-ui-sm', md: 'text-ui-sm', lg: 'text-ui' } },
  defaultVariants: { size: 'md' },
});

export const motionTimelineTrackVariants = cva('relative h-full cursor-col-resize touch-none');

/** The animated range: a chart-family series colour (PROPOSAL E9), not accent; the chart family has no edge. Centred on the lane. */
export const motionTimelineBarVariants = cva('absolute top-[calc(50%-var(--spacing)*1.75)] left-(--l) h-3.5 w-(--w) rounded-xs bg-chart-1');

/** A keyframe, centred on the lane: its ring and selected fill read --mt-key (the root tone), accent by default. */
export const motionTimelineKeyframeVariants = cva([
  'absolute top-[calc(50%-var(--spacing)*1.5)] left-(--l) size-2.5 -translate-x-1/2 rotate-45 cursor-pointer rounded-2xs bg-surface-base outline-none transition-control press-sm',
  'shadow-[inset_0_0_0_1.5px_var(--mt-key,var(--cs-color-accent-solid))]',
  'focus-visible:shadow-focus aria-pressed:bg-[color:var(--mt-key,var(--cs-color-accent-solid))]',
]);

export const motionTimelinePlayheadVariants = cva([
  'pointer-events-none absolute inset-y-0 z-10 w-[1.5px] bg-canvas-guide',
  'left-[calc(var(--cs-size-timeline-label-w)+(100%-var(--cs-size-timeline-label-w))*var(--t))]',
  'before:absolute before:top-0 before:left-1/2 before:size-2.5 before:-translate-x-1/2 before:rounded-t-2xs before:rounded-b-xs before:bg-canvas-guide before:content-[""]',
]);

/** The slider on the playhead head: an invisible 24px target over the 10px head. */
export const motionTimelineSeekVariants = cva('absolute top-0 left-1/2 size-6 -translate-x-1/2 -translate-y-1.75 rounded-full outline-none focus-visible:shadow-focus');

export const motionTimelinePlayerVariants = cva('flex items-center gap-2 border-t border-border-subtle px-2 py-1.5');

export const motionTimelineTimeVariants = cva('font-mono text-mono-sm text-text-secondary');

export type MotionTimelineVariantProps = VariantProps<typeof motionTimelineVariants>;
