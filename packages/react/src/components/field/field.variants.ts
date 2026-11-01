import { cva } from 'class-variance-authority';

// Common props (lib/common-props.ts): radius, shadow and size on the root (size steps the gap and the label type; the
// control inside keeps its own size); tone and variant on the hint. Error, warning and success keep their meaning colour.
export const fieldVariants = cva('grid min-w-0 gap-1.5', {
  variants: {
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: 'gap-1', sm: 'gap-1.25', md: '', lg: 'gap-2' },
  },
  defaultVariants: { radius: 'none', shadow: 'none', size: 'md' },
});

// The label is one step larger than before (owner 2026-10-27): md ui-strong 13 / 500 (was ui-sm 12 / 500), lg ui-lg
// 14 / 500 (was ui 13); xs and sm stay ui-xs for dense rows.
export const fieldLabelVariants = cva('inline-flex items-center gap-1 text-ui-strong text-text-secondary', {
  variants: { size: { xs: 'text-ui-xs', sm: 'text-ui-xs', md: '', lg: 'text-ui-lg' } },
  defaultVariants: { size: 'md' },
});

/** Shared by the hint and the three messages: an inline row, 5px gap, hint type. */
export const fieldMessageVariants = cva('inline-flex items-center gap-1.25 text-hint animate-rise');

/** The 13px glyph that leads a message. */
export const fieldIconVariants = cva('inline-flex size-chip-icon shrink-0 [&_svg]:size-full');

// ghost (default) is today's hint: tertiary text. A tone colours it; soft, outline and solid box it (md radius, 4 / 8).
export const fieldHintVariants = cva('inline-flex items-center gap-1.25 text-hint text-text-tertiary animate-rise', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'rounded-md px-2 py-1 bg-ink-solid text-ink-on' },
    { variant: 'solid', tone: 'accent', className: 'rounded-md px-2 py-1 bg-accent-solid text-accent-on' },
    { variant: 'solid', tone: 'success', className: 'rounded-md px-2 py-1 bg-success-solid text-success-on' },
    { variant: 'solid', tone: 'warning', className: 'rounded-md px-2 py-1 bg-warning-solid text-warning-on' },
    { variant: 'solid', tone: 'danger', className: 'rounded-md px-2 py-1 bg-danger-solid text-danger-on' },
    { variant: 'solid', tone: 'info', className: 'rounded-md px-2 py-1 bg-info-solid text-info-on' },
    { variant: 'solid', tone: 'agent', className: 'rounded-md px-2 py-1 bg-agent-solid text-agent-on' },
    { variant: 'soft', tone: 'neutral', className: 'rounded-md px-2 py-1 bg-neutral-track text-text-secondary' },
    { variant: 'soft', tone: 'accent', className: 'rounded-md px-2 py-1 bg-accent-soft text-accent-text' },
    { variant: 'soft', tone: 'success', className: 'rounded-md px-2 py-1 bg-success-soft text-success-text' },
    { variant: 'soft', tone: 'warning', className: 'rounded-md px-2 py-1 bg-warning-soft text-warning-text' },
    { variant: 'soft', tone: 'danger', className: 'rounded-md px-2 py-1 bg-danger-soft text-danger-text' },
    { variant: 'soft', tone: 'info', className: 'rounded-md px-2 py-1 bg-info-soft text-info-text' },
    { variant: 'soft', tone: 'agent', className: 'rounded-md px-2 py-1 bg-agent-soft text-agent-text' },
    { variant: 'outline', tone: 'neutral', className: 'rounded-md px-2 py-1 shadow-[inset_0_0_0_0.5px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'rounded-md px-2 py-1 text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'rounded-md px-2 py-1 text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'rounded-md px-2 py-1 text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'rounded-md px-2 py-1 text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'rounded-md px-2 py-1 text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'rounded-md px-2 py-1 text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'ghost', tone: 'accent', className: 'text-accent-text' },
    { variant: 'ghost', tone: 'success', className: 'text-success-text' },
    { variant: 'ghost', tone: 'warning', className: 'text-warning-text' },
    { variant: 'ghost', tone: 'danger', className: 'text-danger-text' },
    { variant: 'ghost', tone: 'info', className: 'text-info-text' },
    { variant: 'ghost', tone: 'agent', className: 'text-agent-text' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'ghost' },
});
