import { cva, type VariantProps } from 'class-variance-authority';

export const motionTimelineVariants = cva('overflow-hidden rounded-xl bg-surface-base font-ui text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]');

export const motionTimelineBodyVariants = cva('relative');

/** Time ruler: starts after the label column, a hairline below and a tick every 5 % along the bottom. */
export const motionTimelineRulerVariants = cva([
  'relative ml-timeline-label-w h-6 cursor-col-resize touch-none border-b border-border-subtle',
  'bg-[repeating-linear-gradient(90deg,var(--cs-color-border-default)_0_1px,transparent_1px_5%)] bg-position-[0_100%] bg-size-[100%_calc(var(--spacing)*1.5)] bg-no-repeat',
]);

export const motionTimelineRulerLabelVariants = cva('absolute top-1 left-(--x) -translate-x-1/2 font-mono text-mono-sm whitespace-nowrap text-text-tertiary');

export const motionTimelineLaneVariants = cva('grid h-8 grid-cols-[var(--cs-size-timeline-label-w)_1fr] items-center border-b border-border-subtle last:border-b-0');

export const motionTimelineLaneLabelVariants = cva('flex items-center gap-1.5 overflow-hidden px-2.5 text-ui-sm font-normal whitespace-nowrap text-text-secondary [&_svg]:size-chip-icon [&_svg]:shrink-0 [&_svg]:stroke-[1.75]');

export const motionTimelineTrackVariants = cva('relative h-full cursor-col-resize touch-none');

export const motionTimelineBarVariants = cva('absolute top-2.25 left-(--l) h-3.5 w-(--w) rounded-xs bg-accent-soft');

export const motionTimelineKeyframeVariants = cva([
  'absolute top-2.5 left-(--l) size-2.5 -translate-x-1/2 rotate-45 cursor-pointer rounded-2xs bg-surface-base outline-none',
  'shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-solid)]',
  'focus-visible:shadow-focus aria-pressed:bg-accent-solid',
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
