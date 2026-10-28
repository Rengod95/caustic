import { cva, type VariantProps } from 'class-variance-authority';

// Common props (lib/common-props.ts); each axis' default is the avatar's own look and adds no class:
//   variant / tone  solid with tone neutral = the identity colour (own: color picks the hue). Any other tone, or the soft /
//                   outline / ghost variants, replace the identity fill: solid = tone solid with on initials, soft = tone soft,
//                   outline = a 1px tone border on no fill, ghost = the initials alone in the tone text.
//   radius / shadow the circle (full) and its elevation (none: flat, no ring; owner 2026-10-27 dropped the 2px cut-out ring).
export const avatarVariants = cva('relative inline-grid shrink-0 select-none place-items-center rounded-full font-ui', {
  variants: {
    kind: { person: '', agent: 'bg-surface-base' },
    // Identity family: each hue's solid 9 per mode with its own on colour for the initials.
    color: {
      coral: 'bg-identity-coral text-identity-on-coral',
      iris: 'bg-identity-iris text-identity-on-iris',
      mint: 'bg-identity-mint text-identity-on-mint',
      amber: 'bg-identity-amber text-identity-on-amber',
      slate: 'bg-identity-slate text-identity-on-slate',
    },
    size: { xs: 'size-avatar-xs text-micro', sm: 'size-avatar-sm text-micro', md: 'size-avatar-md text-ui-sm', lg: 'size-avatar-lg text-ui-strong' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: '',
    },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  compoundVariants: [
    // The agent kind keeps surface.base over the identity colour (color sorts after kind).
    { kind: 'agent', className: 'bg-surface-base' },
    { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on' },
    { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on' },
    { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft text-text-primary' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft text-accent-text' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft text-success-text' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft text-warning-text' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft text-danger-text' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft text-info-text' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft text-agent-text' },
    { variant: 'outline', tone: 'neutral', className: 'bg-transparent text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'bg-transparent text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'bg-transparent text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'bg-transparent text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'bg-transparent text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'bg-transparent text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'bg-transparent text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'ghost', tone: 'neutral', className: 'bg-transparent text-text-primary shadow-none' },
    { variant: 'ghost', tone: 'accent', className: 'bg-transparent text-accent-text shadow-none' },
    { variant: 'ghost', tone: 'success', className: 'bg-transparent text-success-text shadow-none' },
    { variant: 'ghost', tone: 'warning', className: 'bg-transparent text-warning-text shadow-none' },
    { variant: 'ghost', tone: 'danger', className: 'bg-transparent text-danger-text shadow-none' },
    { variant: 'ghost', tone: 'info', className: 'bg-transparent text-info-text shadow-none' },
    { variant: 'ghost', tone: 'agent', className: 'bg-transparent text-agent-text shadow-none' },
  ],
  defaultVariants: { kind: 'person', color: 'coral', size: 'sm', variant: 'solid', tone: 'neutral', radius: 'full', shadow: 'none' },
});

/** The agent's spectrum core; only the agent kind renders it (P2). It follows the root radius. */
export const avatarCore = cva('absolute inset-1 rounded-[inherit]', {
  variants: { kind: { person: 'hidden', agent: 'spectrum-fill' } },
  defaultVariants: { kind: 'person' },
});
export type AvatarVariantProps = VariantProps<typeof avatarVariants>;
