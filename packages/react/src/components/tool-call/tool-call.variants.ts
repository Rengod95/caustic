import { cva, type VariantProps } from 'class-variance-authority';

// variant is the card at rest: outline = surface.base with a border.subtle hairline (the specimen); solid = surface.raised,
// no hairline; soft = neutral.well, no hairline; ghost = no fill, no hairline. status draws over it: running = the agent
// rim with elevation 1, failed = the danger.border edge. Header and body share the card's one background (owner 2026-10-28:
// no separator, no second fill).
export const toolCallVariants = cva('relative overflow-hidden rounded-xl text-text-primary transition-control', {
  variants: {
    variant: {
      outline: 'bg-surface-base [--card-edge:var(--cs-color-border-subtle)]',
      solid: 'bg-surface-raised [--card-edge:transparent]',
      soft: 'bg-neutral-well [--card-edge:transparent]',
      ghost: 'bg-transparent [--card-edge:transparent]',
    },
    status: {
      running: 'agent-rim overflow-visible shadow-1',
      done: 'shadow-[inset_0_0_0_1px_var(--card-edge)]',
      failed: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]',
    },
    // The default key keeps the component's own corner and shadow (''); every other key sets that token (the radiusClass / shadowClass names of common-props.ts, written out so Tailwind, which scans ./components only, generates them).
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { variant: 'outline', status: 'done', radius: 'xl', shadow: 'none' },
});

/** The header row; size steps its height and type (40px ui-dense at md, the specimen). */
export const toolHeader = cva('flex min-w-0 items-center gap-2 px-2.5', {
  variants: { size: { xs: 'h-7 text-ui-xs', sm: 'h-8 text-ui-sm', md: 'h-10 text-ui-dense', lg: 'h-12 text-ui' } },
  defaultVariants: { size: 'md' },
});

/** The bare tool icon (no tile: owner 2026-10-28); tone colours the glyph (text.secondary when neutral). */
export const toolIcon = cva('inline-grid size-icon-sm shrink-0 place-items-center [&_svg]:size-icon-sm', {
  variants: {
    tone: {
      neutral: 'text-text-secondary',
      accent: 'text-accent-text',
      success: 'text-success-text',
      warning: 'text-warning-text',
      danger: 'text-danger-text',
      info: 'text-info-text',
      agent: 'text-agent-text',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

/** The status pill: neutral.track, full radius, 6px inline padding; failed = danger text on danger.tint. The running label
 * shimmers on its inner span (the shimmer clips its own background to the text, so it cannot share the pill's fill). */
/** The status pill. With a leading glyph (done, failed) the start inset equals the glyph's own inset, (18 - 14) / 2 = 2px, so the
 *  icon sits in the pill's round end and the pill reads as tall as it is wide around the glyph; text-only (running) keeps 6px. */
export const toolStatus = cva('ml-auto flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full text-hint [&_svg]:size-icon-sm', {
  variants: { status: { running: 'bg-neutral-track px-1.5', done: 'bg-neutral-track ps-0.5 pe-1.5 text-text-tertiary', failed: 'bg-danger-tint ps-0.5 pe-1.5 text-danger-text' } },
  defaultVariants: { status: 'done' },
});

/** The running activity label inside the pill: the agent shimmer (flags.agent status=running). */
export const toolActivity = cva('', {
  variants: { status: { running: 'shimmer', done: '', failed: '' } },
  defaultVariants: { status: 'running' },
});

/** The result under the header: no separator and no fill of its own, so it reads on the card's background. */
export const toolBody = cva('grid gap-0.5 px-2.5 pt-0 pb-2.5', {
  variants: { status: { running: '', done: '', failed: 'text-ui-sm text-text-primary' } },
  defaultVariants: { status: 'done' },
});
export type ToolCallVariantProps = VariantProps<typeof toolCallVariants>;
