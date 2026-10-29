import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The stack: readout card, suggestion card, note. Common props (lib/common-props.ts): variant and tone = the readout
 * card (summary variants below; outline, the default, is the opaque surface with the subtle hairline), size = the ratio
 * figure; radius / shadow are applied to the readout and suggestion cards by ContrastInsight with radiusClass /
 * shadowClass after these classes. The level badges keep their result colours.
 */
export const contrastInsightVariants = cva('grid gap-3 font-ui', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
    radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
    shadow: { none: '', '1': '', '2': '', '3': '', '4': '', '5': '' },
  },
  defaultVariants: { tone: 'neutral', variant: 'outline', size: 'md', radius: 'xl', shadow: 'none' },
});

/** The readout card: opaque inline surface (never glass, P1) with a hairline edge as its one depth cue (no elevation). */
export const contrastInsightSummaryVariants = cva(
  'grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-inset-regular-x py-inset-regular-y',
  {
    variants: {
      card: { outline: 'bg-surface-base', soft: 'bg-neutral-track', solid: 'bg-surface-raised', ghost: 'bg-transparent' },
      cardTone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    },
    compoundVariants: [
      { card: 'outline', cardTone: 'neutral', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]' },
      { card: 'outline', cardTone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
      { card: 'outline', cardTone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
      { card: 'outline', cardTone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
      { card: 'outline', cardTone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
      { card: 'outline', cardTone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
      { card: 'outline', cardTone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
      { card: 'soft', cardTone: 'accent', className: 'bg-accent-tint' },
      { card: 'soft', cardTone: 'success', className: 'bg-success-tint' },
      { card: 'soft', cardTone: 'warning', className: 'bg-warning-tint' },
      { card: 'soft', cardTone: 'danger', className: 'bg-danger-tint' },
      { card: 'soft', cardTone: 'info', className: 'bg-info-tint' },
      { card: 'soft', cardTone: 'agent', className: 'bg-agent-tint' },
    ],
    defaultVariants: { card: 'outline', cardTone: 'neutral' },
  },
);

/** The measured ratio, large, with tabular numerals: title-2 · stat · stat-lg · display by size. */
export const contrastInsightRatioVariants = cva('tabular-nums text-text-primary', {
  variants: { ratioSize: { xs: 'text-title-2', sm: 'text-stat', md: 'text-stat-lg', lg: 'text-display' } },
  defaultVariants: { ratioSize: 'md' },
});

/** The " : 1" unit takes the text colour of the best result reached (owner 2026-10-27, proposal A): success when a level
 *  passes, warning when only the large-text level does, danger when none; so the ratio says pass or fail at a glance. */
export const contrastInsightUnitVariants = cva('text-ui-lg font-medium', {
  variants: { result: { pass: 'text-success-text', warning: 'text-warning-text', fail: 'text-danger-text' } },
  defaultVariants: { result: 'pass' },
});

export const contrastInsightLevelsVariants = cva('mt-2 flex flex-wrap gap-1.5');

/** One level badge: soft status tint, a check, a triangle or a cross so the result is not only color. */
export const contrastInsightLevelVariants = cva(
  'inline-flex h-control-compact-xs items-center gap-1 rounded-sm px-2 text-micro transition-colors duration-quick ease-standard [&_svg]:size-icon-xs [&_svg]:flex-none [&_svg]:stroke-[3]',
  {
    variants: {
      result: {
        pass: 'bg-success-soft text-success-text',
        // Reached only for large text (AA large: 3 : 1 and up, below 4.5 : 1).
        warning: 'bg-warning-soft text-warning-text',
        fail: 'bg-danger-soft text-danger-text',
      },
    },
    defaultVariants: { result: 'pass' },
  },
);
export type ContrastInsightLevelVariantProps = VariantProps<typeof contrastInsightLevelVariants>;

/** The measured pair as "Aa": the colors come from the --pair-bg and --pair-fg custom properties. */
export const contrastInsightSampleVariants = cva(
  'grid h-contrast-sample-h w-contrast-sample-w place-items-center rounded-xl bg-(--pair-bg) text-sample text-(--pair-fg) shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)] transition-colors duration-quick ease-standard',
);

/** The agent suggestion card: opaque, with the agent rim; the regular inset like the readout card (owner 2026-10-27, proposal C). */
export const contrastInsightSuggestionVariants = cva(
  'agent-rim relative grid gap-2 overflow-hidden rounded-xl bg-surface-base px-inset-regular-x py-inset-regular-y shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] animate-rise',
);

export const contrastInsightSuggestionTextVariants = cva('text-footnote text-text-secondary');

export const contrastInsightActionsVariants = cva('flex flex-wrap items-center gap-2');

export const contrastInsightNoteVariants = cva('');
