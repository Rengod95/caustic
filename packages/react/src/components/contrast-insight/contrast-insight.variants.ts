import { cva, type VariantProps } from 'class-variance-authority';

/** The stack: readout card, suggestion card, note. */
export const contrastInsightVariants = cva('grid gap-3 font-ui');

/** The readout card: opaque inline surface (never glass, P1) with a hairline edge and elevation 1. */
export const contrastInsightSummaryVariants = cva(
  'grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl bg-surface-base px-inset-regular-x py-inset-regular-y shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--cs-elevation-1)]',
);

/** The measured ratio, large, with tabular numerals. */
export const contrastInsightRatioVariants = cva('text-stat-lg tabular-nums text-text-primary');

export const contrastInsightUnitVariants = cva('text-ui-lg font-medium text-text-tertiary');

export const contrastInsightLevelsVariants = cva('mt-2 flex flex-wrap gap-1.5');

/** One level badge: soft status tint, a check or a cross so the result is not only color. */
export const contrastInsightLevelVariants = cva(
  'inline-flex h-control-compact-xs items-center gap-1 rounded-sm px-2 text-micro [&_svg]:size-icon-xs [&_svg]:flex-none [&_svg]:stroke-[3]',
  {
    variants: {
      result: {
        pass: 'bg-success-soft text-success-text',
        fail: 'bg-danger-soft text-danger-text',
      },
    },
    defaultVariants: { result: 'pass' },
  },
);
export type ContrastInsightVariantProps = VariantProps<typeof contrastInsightLevelVariants>;

/** The measured pair as "Aa": the colors come from the --pair-bg and --pair-fg custom properties. */
export const contrastInsightSampleVariants = cva(
  'grid h-contrast-sample-h w-contrast-sample-w place-items-center rounded-xl bg-(--pair-bg) text-sample text-(--pair-fg) shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
);

/** The agent suggestion card: opaque, with the agent rim. */
export const contrastInsightSuggestionVariants = cva(
  'agent-rim relative grid gap-2 overflow-hidden rounded-xl bg-surface-base p-2.5 shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--cs-elevation-1)]',
);

export const contrastInsightSuggestionTextVariants = cva('text-footnote text-text-secondary');

export const contrastInsightActionsVariants = cva('flex flex-wrap items-center gap-2');

export const contrastInsightNoteVariants = cva('');
