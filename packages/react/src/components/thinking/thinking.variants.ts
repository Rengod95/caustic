import { cva, type VariantProps } from 'class-variance-authority';

// tone sets --tone-rule (the body's start rule: border.default when neutral, the tone border otherwise) and --tone-fill.
// variant is the aside's container: ghost = no fill (the specimen); soft = tone soft fill; outline = 1px tone hairline;
// solid = surface.raised fill; the three containers pad 4px 12px.
export const thinkingVariants = cva('', {
  variants: {
    tone: {
      neutral: '[--tone-rule:var(--cs-color-border-default)] [--tone-fill:var(--cs-color-neutral-soft)]',
      accent: '[--tone-rule:var(--cs-color-accent-border)] [--tone-fill:var(--cs-color-accent-soft)]',
      success: '[--tone-rule:var(--cs-color-success-border)] [--tone-fill:var(--cs-color-success-soft)]',
      warning: '[--tone-rule:var(--cs-color-warning-border)] [--tone-fill:var(--cs-color-warning-soft)]',
      danger: '[--tone-rule:var(--cs-color-danger-border)] [--tone-fill:var(--cs-color-danger-soft)]',
      info: '[--tone-rule:var(--cs-color-info-border)] [--tone-fill:var(--cs-color-info-soft)]',
      agent: '[--tone-rule:var(--cs-color-agent-border)] [--tone-fill:var(--cs-color-agent-soft)]',
    },
    variant: {
      ghost: '',
      soft: 'bg-(--tone-fill) px-3 py-1',
      outline: 'px-3 py-1 shadow-[inset_0_0_0_1px_var(--tone-rule)]',
      solid: 'bg-surface-raised px-3 py-1',
    },
    // The default key keeps the component's own corner and shadow (''); every other key sets that token (the radiusClass / shadowClass names of common-props.ts, written out so Tailwind, which scans ./components only, generates them).
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { tone: 'neutral', variant: 'ghost', radius: 'xl', shadow: 'none' },
});

/** The trigger row; size steps its type (ui-dense at md, the specimen). Hover lifts the chevron and a done label to
 *  text.secondary so the row reads as openable (owner 2026-10-28). */
export const thinkingSummaryVariants = cva(
  'flex w-full cursor-pointer items-center gap-2 rounded-md py-1 text-left text-text-tertiary outline-none transition-colors duration-base ease-out hover:text-text-secondary focus-visible:shadow-focus',
  {
    variants: { size: { xs: 'text-ui-xs', sm: 'text-ui-sm', md: 'text-ui-dense', lg: 'text-ui' } },
    defaultVariants: { size: 'md' },
  },
);

// A done label inherits the summary colour (tertiary at rest, secondary on hover); the thinking label shimmers.
export const thinkingLabelVariants = cva('', {
  variants: { status: { thinking: 'shimmer', done: '' } },
  defaultVariants: { status: 'thinking' },
});

export type ThinkingVariantProps = VariantProps<typeof thinkingLabelVariants>;
