import { cva } from 'class-variance-authority';

/**
 * Common props (lib/common-props.ts): variant = the round columns (round variants below; soft, the default, is the
 * neutral track), tone = the share figure on the summary row, size = rounds height and composition bar thickness, radius
 * = the column corners; shadow is applied to the figure by ContextAnalytics with shadowClass. The series colours are data
 * (the `series` axis), never the tone.
 */
export const contextAnalyticsVariants = cva('m-0 grid gap-3.5 font-ui', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
    radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
    shadow: { none: '', '1': '', '2': '', '3': '', '4': '', '5': '' },
  },
  defaultVariants: { tone: 'neutral', variant: 'soft', size: 'md', radius: 'sm', shadow: 'none' },
});

/** 12 columns, 4px gap, aligned to the bottom; 80px high at md (48 · 64 · 80 · 80). */
export const contextAnalyticsRounds = cva('grid grid-cols-12 items-end gap-1', {
  variants: { roundsSize: { xs: 'h-12', sm: 'h-16', md: 'h-rounds-h', lg: 'h-rounds-h' } },
  defaultVariants: { roundsSize: 'md' },
});

/** The selectable cell of one round: the hit target, bottom-aligned. */
export const contextAnalyticsRoundButton = cva('flex h-full w-full cursor-pointer flex-col justify-end border-0 bg-transparent p-0 outline-none focus-visible:shadow-focus');

/** One round column. Its height (a percentage of the window) arrives as --ca-h. sm corners (squircle where corner-shape is
 * supported; xs was too small for the shape to read). Selected: a 2px ring in the selection ink (selection.fill) outside a
 * 1px gap in the surface colour, so the ring reads as one crisp dark edge, not a grey halo; the column's fill is data, so it
 * cannot invert and the ring carries the one selection colour. */
export const contextAnalyticsRound = cva('relative block h-[var(--ca-h)] w-full rounded-sm', {
  variants: {
    // soft = neutral.track column; solid = neutral.graphic; outline = a neutral.border hairline, no fill; ghost = only the
    // output share. The selection ring replaces the outline hairline.
    column: {
      soft: 'bg-neutral-track',
      solid: 'bg-neutral-graphic',
      outline: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]',
      ghost: 'bg-transparent',
    },
    selected: { true: 'shadow-[0_0_0_1px_var(--cs-color-surface-base),0_0_0_3px_var(--cs-color-selection-fill)]', false: '' },
  },
  defaultVariants: { column: 'soft', selected: false },
});

/** Output share, filled from the bottom of the column. Its height (a percentage of the column) arrives as --ca-out. */
export const contextAnalyticsRoundOut = cva('absolute inset-x-0 bottom-0 block h-[var(--ca-out)] rounded-[inherit] bg-chart-1');

export const contextAnalyticsSummary = cva('flex items-center justify-between text-footnote');

export const contextAnalyticsSummaryRound = cva('text-text-tertiary');

export const contextAnalyticsSummaryShare = cva('tabular-nums', {
  variants: {
    shareTone: {
      neutral: 'text-text-primary', accent: 'text-accent-text', success: 'text-success-text', warning: 'text-warning-text',
      danger: 'text-danger-text', info: 'text-info-text', agent: 'text-agent-text',
    },
  },
  defaultVariants: { shareTone: 'neutral' },
});

/** Stacked bar: 2px gap, fully rounded, clipped; 10px at md (6 · 8 · 10 · 12). */
export const contextAnalyticsComposition = cva('flex gap-0.5 overflow-hidden rounded-full', {
  variants: { barSize: { xs: 'h-1.5', sm: 'h-2', md: 'h-2.5', lg: 'h-3' } },
  defaultVariants: { barSize: 'md' },
});

/** One part of the context; its width (percent of the window) arrives as --ca-w. Free takes the rest. */
export const contextAnalyticsSegment = cva('block h-full', {
  variants: {
    series: {
      scene: 'w-[var(--ca-w)] bg-chart-1',
      tokens: 'w-[var(--ca-w)] bg-chart-2',
      transcript: 'w-[var(--ca-w)] bg-chart-3',
      tools: 'w-[var(--ca-w)] bg-chart-4',
      free: 'flex-1 bg-neutral-track',
    },
  },
  defaultVariants: { series: 'scene' },
});

export const contextAnalyticsLegend = cva('m-0 flex list-none flex-wrap gap-3 p-0 text-ui-xs text-text-secondary');

export const contextAnalyticsLegendItem = cva('inline-flex items-center gap-1.25');

export const contextAnalyticsLegendSwatch = cva('block size-2 rounded-2xs', {
  variants: {
    series: {
      scene: 'bg-chart-1',
      tokens: 'bg-chart-2',
      transcript: 'bg-chart-3',
      tools: 'bg-chart-4',
      free: 'bg-neutral-track',
    },
  },
  defaultVariants: { series: 'scene' },
});
