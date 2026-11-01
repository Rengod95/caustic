import { cva, type VariantProps } from 'class-variance-authority';

/**
 * CardStat renders on Card (variant surface by default), which owns the root: fill, hairline, tone, radius, elevation
 * and inset. This adds only what the KPI needs on top: overflow hidden so the sparkline clips to the corners, and on a
 * solid card the label, value, unit, delta and note turn to the tone on colour (the delta has no pill of its own, so
 * its graphic colour would sink into the solid fill). radius and shadow are passed through to Card.
 */
export const cardStatVariants = cva('overflow-hidden', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { surface: '', solid: '', soft: '', outline: '', ghost: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { tone: 'neutral', variant: 'solid', class: '[&_[data-slot=card-stat-label]]:text-neutral-on [&_[data-slot=card-stat-value]]:text-neutral-on [&_[data-slot=card-stat-unit]]:text-neutral-on [&_[data-slot=card-stat-delta-note]]:text-neutral-on [&_[data-slot=card-stat-delta]]:text-neutral-on' },
    { tone: 'accent', variant: 'solid', class: '[&_[data-slot=card-stat-label]]:text-accent-on [&_[data-slot=card-stat-value]]:text-accent-on [&_[data-slot=card-stat-unit]]:text-accent-on [&_[data-slot=card-stat-delta-note]]:text-accent-on [&_[data-slot=card-stat-delta]]:text-accent-on' },
    { tone: 'success', variant: 'solid', class: '[&_[data-slot=card-stat-label]]:text-success-on [&_[data-slot=card-stat-value]]:text-success-on [&_[data-slot=card-stat-unit]]:text-success-on [&_[data-slot=card-stat-delta-note]]:text-success-on [&_[data-slot=card-stat-delta]]:text-success-on' },
    { tone: 'warning', variant: 'solid', class: '[&_[data-slot=card-stat-label]]:text-warning-on [&_[data-slot=card-stat-value]]:text-warning-on [&_[data-slot=card-stat-unit]]:text-warning-on [&_[data-slot=card-stat-delta-note]]:text-warning-on [&_[data-slot=card-stat-delta]]:text-warning-on' },
    { tone: 'danger', variant: 'solid', class: '[&_[data-slot=card-stat-label]]:text-danger-on [&_[data-slot=card-stat-value]]:text-danger-on [&_[data-slot=card-stat-unit]]:text-danger-on [&_[data-slot=card-stat-delta-note]]:text-danger-on [&_[data-slot=card-stat-delta]]:text-danger-on' },
    { tone: 'info', variant: 'solid', class: '[&_[data-slot=card-stat-label]]:text-info-on [&_[data-slot=card-stat-value]]:text-info-on [&_[data-slot=card-stat-unit]]:text-info-on [&_[data-slot=card-stat-delta-note]]:text-info-on [&_[data-slot=card-stat-delta]]:text-info-on' },
    { tone: 'agent', variant: 'solid', class: '[&_[data-slot=card-stat-label]]:text-agent-on [&_[data-slot=card-stat-value]]:text-agent-on [&_[data-slot=card-stat-unit]]:text-agent-on [&_[data-slot=card-stat-delta-note]]:text-agent-on [&_[data-slot=card-stat-delta]]:text-agent-on' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'surface', size: 'md' },
});

/** radius and shadow are Card's (passed through); the axes are declared here for the spec. */
export const cardStatShapeVariants = cva('', {
  variants: {
    radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
    shadow: { 'none': '', '1': '', '2': '', '3': '', '4': '', '5': '' },
  },
  defaultVariants: { radius: '3xl', shadow: 'none' },
});

/**
 * The change as coloured text and an arrow, no pill (owner 2026-10-27: three filled pills per row were louder than the
 * value). The colour is the tone graphic step, the brighter one, not the text step.
 */
export const cardStatDeltaVariants = cva(
  'inline-flex h-control-2xs items-center gap-0.75 font-ui text-hint font-semibold [&_svg]:size-3',
  {
    variants: {
      deltaTone: {
        good: 'text-success-graphic',
        bad: 'text-danger-graphic',
      },
    },
    defaultVariants: { deltaTone: 'good' },
  },
);

export type CardStatDeltaVariantProps = VariantProps<typeof cardStatDeltaVariants>;

/** Sparkline bleeds to the sides and the bottom edge of the card by the inset of the card size. */
export const cardStatSparkVariants = cva(
  'block h-card-spark max-w-none',
  {
    variants: {
      size: {
        xs: '-mx-2 -mb-2 w-[calc(100%+var(--spacing)*4)]',
        sm: '-mx-inset-compact-x -mb-inset-compact-y w-[calc(100%+2*var(--cs-inset-compact-x))]',
        md: '-mx-inset-regular-x -mb-inset-regular-y w-[calc(100%+2*var(--cs-inset-regular-x))]',
        lg: '-mx-5 -mb-5 w-[calc(100%+var(--spacing)*10)]',
      },
    },
    defaultVariants: { size: 'md' },
  },
);
