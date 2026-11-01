import { cva, type VariantProps } from 'class-variance-authority';

export const paginationVariants = cva('items-center font-ui', {
  variants: {
    layout: {
      numbered: 'flex flex-wrap gap-1',
      compact: 'flex w-full justify-between gap-2',
    },
  },
  defaultVariants: { layout: 'numbered' },
});

/**
 * Prev, Next and page-number buttons share one flat control look. The current page is the segment thumb (PROPOSAL §4 B2):
 * the raised control fill and the control edge, control-raised-hover under the pointer; focus keeps the edge. Disabled is colour.
 * Common props (owner 2026-10-26; Pagination passes them to every button), unset = today:
 *   variant ghost (default) no fill until hover (a hue colours the text) · soft neutral.track (a hue: its soft 3 and text) ·
 *   outline the tone's border 6 edge · solid ink (neutral) or the tone's solid 9 with its on text. The current page keeps the
 *   thumb in every variant: its aria-current rules are (0,2,0) and win. size: xs 22 · sm 24 · md 28 · lg 36 (compact steps).
 */
export const paginationButton = cva([
  'inline-flex items-center justify-center gap-1 px-2',
  'font-ui tabular-nums text-text-secondary outline-none select-none',
  'transition-control press',
  'hover:text-text-primary focus-visible:shadow-focus',
  'disabled:pointer-events-none disabled:bg-transparent disabled:text-disabled-text disabled:shadow-none',
  'aria-[current=page]:bg-control-raised aria-[current=page]:font-semibold aria-[current=page]:text-text-primary',
  'aria-[current=page]:shadow-[inset_0_0_0_0.5px_var(--cs-color-control-edge),var(--cs-elevation-2)] aria-[current=page]:hover:bg-control-raised-hover',
  'aria-[current=page]:focus-visible:shadow-[inset_0_0_0_0.5px_var(--cs-color-control-edge),var(--cs-elevation-2),var(--cs-focus)]',
], {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      // Hover stays inside each emphasis: neutral.hover on ghost, outline and the neutral track; a filled hue steps its own slot.
    variant: { solid: '', soft: '', outline: 'hover:bg-neutral-hover', ghost: 'hover:bg-neutral-hover' },
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: {
      xs: 'h-control-xs min-h-control-xs min-w-control-xs text-ui-xs', sm: 'h-control-sm min-h-control-sm min-w-control-sm text-ui-sm',
      md: 'h-control-md min-h-control-md min-w-control-md text-ui', lg: 'h-control-lg min-h-control-lg min-w-control-lg text-ui-md',
    },
  },
  compoundVariants: [
      { variant: 'solid', tone: 'neutral', className: 'bg-ink-solid text-ink-on hover:bg-ink-solid-hover hover:text-ink-on' },
      { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on hover:bg-accent-solid-hover hover:text-accent-on' },
      { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on hover:bg-success-solid-hover hover:text-success-on' },
      { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on hover:bg-warning-solid-hover hover:text-warning-on' },
      { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on hover:bg-danger-solid-hover hover:text-danger-on' },
      { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on hover:bg-info-solid-hover hover:text-info-on' },
      { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on hover:bg-agent-solid-hover hover:text-agent-on' },
      { variant: 'soft', tone: 'neutral', className: 'bg-neutral-track hover:bg-neutral-hover' },
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft text-accent-text hover:bg-accent-soft-hover hover:text-accent-text' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft text-success-text hover:bg-success-soft-hover hover:text-success-text' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft text-warning-text hover:bg-warning-soft-hover hover:text-warning-text' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft text-danger-text hover:bg-danger-soft-hover hover:text-danger-text' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft text-info-text hover:bg-info-soft-hover hover:text-info-text' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-soft text-agent-text hover:bg-agent-soft-hover hover:text-agent-text' },
      { variant: 'outline', tone: 'neutral', className: 'shadow-[inset_0_0_0_0.5px_var(--cs-color-neutral-border)]' },
      { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] text-accent-text hover:bg-accent-tint hover:text-accent-text' },
      { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] text-success-text hover:bg-success-tint hover:text-success-text' },
      { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] text-warning-text hover:bg-warning-tint hover:text-warning-text' },
      { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] text-danger-text hover:bg-danger-tint hover:text-danger-text' },
      { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] text-info-text hover:bg-info-tint hover:text-info-text' },
      { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] text-agent-text hover:bg-agent-tint hover:text-agent-text' },
      { variant: 'ghost', tone: 'accent', className: 'text-accent-text hover:text-accent-text' },
      { variant: 'ghost', tone: 'success', className: 'text-success-text hover:text-success-text' },
      { variant: 'ghost', tone: 'warning', className: 'text-warning-text hover:text-warning-text' },
      { variant: 'ghost', tone: 'danger', className: 'text-danger-text hover:text-danger-text' },
      { variant: 'ghost', tone: 'info', className: 'text-info-text hover:text-info-text' },
      { variant: 'ghost', tone: 'agent', className: 'text-agent-text hover:text-agent-text' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'ghost', radius: 'md', shadow: 'none', size: 'md' },
});

/** Prev and Next (owner 2026-10-28, proposal A as an option): text (default) = chevron and word; icon = the chevron alone in a
 *  square button as tall as the page buttons (the aria-label keeps the name). */
export const paginationStepVariants = cva('', {
  variants: { stepLabel: { text: '', icon: 'aspect-square px-0' } },
  defaultVariants: { stepLabel: 'text' },
});

export const paginationGap = cva('px-1 font-ui text-ui text-text-tertiary');

export type PaginationVariantProps = VariantProps<typeof paginationVariants>;
