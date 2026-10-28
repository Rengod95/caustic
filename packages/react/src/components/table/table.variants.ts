import { cva, type VariantProps } from 'class-variance-authority';

// The container. tone sets --tone-edge (outline hairline), --tone-fill (soft) and --tone-raised (solid); variant picks:
//   outline  surface.translucent fill + 1px tone edge (border.subtle when neutral): the specimen, one depth cue
//   soft     tone soft fill (neutral.well when neutral), no edge
//   solid    raised fill (surface.raised when neutral, tone tint otherwise), no edge
//   ghost    no fill, no edge: the grid sits on the page
// Selected rows always invert (selected utility) and the current page stays the control-raised thumb, in every tone.
export const tableVariants = cva('w-full overflow-hidden rounded-2xl font-ui text-text-primary', {
  variants: {
    tone: {
      neutral: '[--tone-edge:var(--cs-color-border-subtle)] [--tone-fill:var(--cs-color-neutral-well)] [--tone-raised:var(--cs-color-surface-raised)]',
      accent: '[--tone-edge:var(--cs-color-accent-border)] [--tone-fill:var(--cs-color-accent-soft)] [--tone-raised:var(--cs-color-accent-tint)]',
      success: '[--tone-edge:var(--cs-color-success-border)] [--tone-fill:var(--cs-color-success-soft)] [--tone-raised:var(--cs-color-success-tint)]',
      warning: '[--tone-edge:var(--cs-color-warning-border)] [--tone-fill:var(--cs-color-warning-soft)] [--tone-raised:var(--cs-color-warning-tint)]',
      danger: '[--tone-edge:var(--cs-color-danger-border)] [--tone-fill:var(--cs-color-danger-soft)] [--tone-raised:var(--cs-color-danger-tint)]',
      info: '[--tone-edge:var(--cs-color-info-border)] [--tone-fill:var(--cs-color-info-soft)] [--tone-raised:var(--cs-color-info-tint)]',
      agent: '[--tone-edge:var(--cs-color-agent-border)] [--tone-fill:var(--cs-color-agent-soft)] [--tone-raised:var(--cs-color-agent-tint)]',
    },
    variant: {
      outline: 'bg-surface-translucent shadow-[inset_0_0_0_1px_var(--tone-edge)]',
      soft: 'bg-(--tone-fill)',
      solid: 'bg-(--tone-raised)',
      ghost: 'bg-transparent',
    },
      // The default key keeps the component's own corner and shadow (''); every other key sets that token (the radiusClass / shadowClass names of common-props.ts, written out so Tailwind, which scans ./components only, generates them).
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': '', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { tone: 'neutral', variant: 'outline', radius: '2xl', shadow: 'none' },
});

/** Column header cell: 28 / 32 / 38 / 40px for xs / sm / md / lg. Sticky at the top of the scroll area with its raised
 *  (opaque) fill, so rows pass under it. The divider is an inset shadow, not a border: a collapsed border stays in the
 *  grid and would not travel with the sticky cell. */
export const tableHeadingVariants = cva('sticky top-0 z-10 whitespace-nowrap bg-surface-raised-translucent text-ui-sm text-text-tertiary shadow-[inset_0_-1px_0_var(--cs-color-border-subtle)]', {
  variants: { size: { xs: 'h-7 px-2', sm: 'h-8 px-2.5', md: 'h-table-head-h px-3', lg: 'h-10 px-4' } },
  defaultVariants: { size: 'md' },
});

/** Body row: 32 / 40 / 48 / 64px; divider.line hairline (one step lighter than border.subtle, owner 2026-10-28); hover fill;
 *  a selected row inverts (owner 2026-10-26, proposal B). */
export const tableRowVariants = cva('border-b border-divider-line last:border-b-0 hover:bg-neutral-hover aria-selected:selected aria-selected:hover:bg-selection-fill-hover', {
  variants: { size: { xs: 'h-8', sm: 'h-10', md: 'h-12', lg: 'h-16' } },
  defaultVariants: { size: 'md' },
});

/** Data cell: follows the row height, with matching padding and type. */
export const tableCellVariants = cva('text-text-primary', {
  variants: { size: { xs: 'h-8 px-2 text-ui-sm', sm: 'h-10 px-2.5 text-ui-sm', md: 'h-12 px-3 text-ui', lg: 'h-16 px-4 text-ui-lg' } },
  defaultVariants: { size: 'md' },
});

export type TableVariantProps = VariantProps<typeof tableVariants>;
