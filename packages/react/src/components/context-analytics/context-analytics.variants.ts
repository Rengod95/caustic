import { cva } from 'class-variance-authority';

export const contextAnalyticsVariants = cva('m-0 grid gap-3.5 font-ui');

/** 12 columns, 4px gap, aligned to the bottom, 80px high. */
export const contextAnalyticsRounds = cva('grid h-rounds-h grid-cols-12 items-end gap-1');

/** The selectable cell of one round: the hit target, bottom-aligned. */
export const contextAnalyticsRoundButton = cva('flex h-full w-full cursor-pointer flex-col justify-end border-0 bg-transparent p-0 outline-none focus-visible:shadow-focus');

/** One round column. Its height (a percentage of the window) arrives as --ca-h. Ring is 1.5px outside when selected. */
export const contextAnalyticsRound = cva('relative block h-[var(--ca-h)] w-full rounded-xs bg-fill-selected', {
  variants: {
    selected: { true: 'shadow-[0_0_0_1.5px_var(--cs-color-text-primary)]', false: '' },
  },
  defaultVariants: { selected: false },
});

/** Output share, filled from the bottom of the column. Its height (a percentage of the column) arrives as --ca-out. */
export const contextAnalyticsRoundOut = cva('absolute inset-x-0 bottom-0 block h-[var(--ca-out)] rounded-[inherit] bg-accent-solid');

export const contextAnalyticsSummary = cva('flex items-center justify-between text-footnote');

export const contextAnalyticsSummaryRound = cva('text-text-tertiary');

export const contextAnalyticsSummaryShare = cva('tabular-nums text-text-primary');

/** Stacked bar: 10px, 2px gap, fully rounded, clipped. */
export const contextAnalyticsComposition = cva('flex h-2.5 gap-0.5 overflow-hidden rounded-full');

/** One part of the context; its width (percent of the window) arrives as --ca-w. Free takes the rest. */
export const contextAnalyticsSegment = cva('block h-full', {
  variants: {
    tone: {
      scene: 'w-[var(--ca-w)] bg-chart-1',
      tokens: 'w-[var(--ca-w)] bg-chart-2',
      transcript: 'w-[var(--ca-w)] bg-chart-3',
      tools: 'w-[var(--ca-w)] bg-chart-4',
      free: 'flex-1 bg-fill-selected',
    },
  },
  defaultVariants: { tone: 'scene' },
});

export const contextAnalyticsLegend = cva('m-0 flex list-none flex-wrap gap-3 p-0 text-ui-xs text-text-secondary');

export const contextAnalyticsLegendItem = cva('inline-flex items-center gap-1.25');

export const contextAnalyticsLegendSwatch = cva('block size-2 rounded-2xs', {
  variants: {
    tone: {
      scene: 'bg-chart-1',
      tokens: 'bg-chart-2',
      transcript: 'bg-chart-3',
      tools: 'bg-chart-4',
      free: 'bg-fill-selected',
    },
  },
  defaultVariants: { tone: 'scene' },
});
