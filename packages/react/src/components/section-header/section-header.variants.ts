import { cva } from 'class-variance-authority';

// Common props (owner 2026-10-26). variant gives the header a band: ghost = none (today); soft = the tone soft fill;
// outline = a 1px tone border edge; solid = the raised surface. A band adds 12px / 10px padding. tone colours the
// soft / outline band and the eyebrow (neutral = text.tertiary, today). radius / shadow shape the root (null when
// unset: no radius, no shadow). size steps the title and the description (md = title-2 / ui-relaxed, today).
export const sectionHeaderVariants = cva('flex w-full flex-wrap items-end gap-3', {
  variants: {
    divided: { true: 'border-b border-border-subtle pb-3', false: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: 'bg-surface-raised px-3 py-2.5', soft: 'px-3 py-2.5', outline: 'px-3 py-2.5', ghost: '' },
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  compoundVariants: [
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
    { variant: 'outline', tone: 'neutral', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
  ],
  defaultVariants: { divided: false, tone: 'neutral', variant: 'ghost', radius: 'none', shadow: 'none' },
});

// eyebrowStyle (owner 2026-10-28, "accent eyebrow as a variant"): muted (default, today) follows the tone (neutral =
// text.tertiary); accent takes accent.text whatever the tone, so the kicker reads as a category without banding the header.
export const sectionHeaderEyebrow = cva('font-ui text-caption uppercase', {
  variants: {
    tone: {
      neutral: 'text-text-tertiary', accent: 'text-accent-text', success: 'text-success-text', warning: 'text-warning-text',
      danger: 'text-danger-text', info: 'text-info-text', agent: 'text-agent-text',
    },
    // The colour comes from tone: SectionHeader passes tone accent when eyebrowStyle is accent (one colour class, no clash).
    eyebrowStyle: { muted: '', accent: '' },
  },
  defaultVariants: { tone: 'neutral', eyebrowStyle: 'muted' },
});

export const sectionHeaderTitle = cva('font-ui text-text-primary text-balance', {
  variants: { size: { xs: 'text-title-4', sm: 'text-title-3', md: 'text-title-2', lg: 'text-title-1' } },
  defaultVariants: { size: 'md' },
});

export const sectionHeaderDescription = cva('max-w-[60ch] font-ui text-text-secondary', {
  variants: { size: { xs: 'text-footnote', sm: 'text-ui-dense-relaxed', md: 'text-ui-relaxed', lg: 'text-body' } },
  defaultVariants: { size: 'md' },
});
