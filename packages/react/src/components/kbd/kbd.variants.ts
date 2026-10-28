import { cva, type VariantProps } from 'class-variance-authority';

// Key cap. The variant is the emphasis, the tone its colour family (lib/common-props). outline (default) is the resting
// key: neutral.well with a border.default hairline and a 1px bottom lip in the same colour; no blur, no elevation.
// The glyphs of a chord sit a little apart (owner 2026-10-27, B: ⌘⇧K read as one symbol): the caption tracking step
// (0.06em), the nearest tracking token to the proposed 0.08em, over the size's type role.
export const kbdVariants = cva('inline-flex items-center justify-center gap-0.5 font-ui tracking-[var(--cs-text-caption-tracking)]', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: {
      solid: 'bg-ink-solid text-ink-on',
      soft: 'bg-neutral-well text-text-tertiary',
      outline: 'bg-neutral-well text-text-tertiary shadow-[inset_0_0_0_1px_var(--cs-color-border-default),inset_0_-1px_0_var(--cs-color-border-default)]',
      ghost: 'bg-transparent text-text-tertiary',
    },
    size: {
      xs: 'h-4 min-w-4 rounded-xs px-0.75 text-micro',
      sm: 'h-kbd-h min-w-kbd-h rounded-xs px-1 text-label',
      md: 'h-control-2xs min-w-control-2xs rounded-xs px-1.25 text-ui-sm',
      lg: 'h-control-xs min-w-control-xs rounded-sm px-1.5 text-ui',
    },
  },
  compoundVariants: [
    // solid × tone
    { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on' },
    { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on' },
    { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on' },
    // soft × tone
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft text-accent-text' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft text-success-text' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft text-warning-text' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft text-danger-text' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft text-info-text' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft text-agent-text' },
    // outline × tone
    { variant: 'outline', tone: 'accent', className: 'bg-accent-tint text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border),inset_0_-1px_0_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'bg-success-tint text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border),inset_0_-1px_0_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'bg-warning-tint text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border),inset_0_-1px_0_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'bg-danger-tint text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border),inset_0_-1px_0_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'bg-info-tint text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border),inset_0_-1px_0_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'bg-agent-tint text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border),inset_0_-1px_0_var(--cs-color-agent-border)]' },
    // ghost × tone
    { variant: 'ghost', tone: 'accent', className: 'bg-transparent text-accent-text' },
    { variant: 'ghost', tone: 'success', className: 'bg-transparent text-success-text' },
    { variant: 'ghost', tone: 'warning', className: 'bg-transparent text-warning-text' },
    { variant: 'ghost', tone: 'danger', className: 'bg-transparent text-danger-text' },
    { variant: 'ghost', tone: 'info', className: 'bg-transparent text-info-text' },
    { variant: 'ghost', tone: 'agent', className: 'bg-transparent text-agent-text' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'outline', size: 'sm' },
});

/** Common radius / shadow (lib/common-props), applied after the key cap so an explicit value wins. */
export const kbdFrameVariants = cva('', {
  variants: {
    // Common radius / shadow (lib/common-props): the default key is the component's own look (no class).
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: '', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: 'xs', shadow: 'none' },
});

export type KbdVariantProps = VariantProps<typeof kbdVariants>;
