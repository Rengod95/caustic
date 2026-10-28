import { cva } from 'class-variance-authority';

/**
 * The key-hint strip at the bottom of the canvas.
 * Common props (lib/common-props.ts); each axis' default is the own look and adds no class:
 *   variant  solid = thick glass with elevation 3 (own); soft = the tint (neutral.tint or the tone tint); outline = no fill
 *            and a 1px tone border; ghost = no strip (the hints float on the canvas).
 *   tone     the strip colour family outside the own solid glass.
 *   radius / shadow the strip (xl, elevation 3). size: height, padding, gap and type, md = 32 / 16 gap / footnote (own);
 *            the gap between hints is wide (owner 2026-10-27) so each key reads with its own word.
 */
export const canvasHintVariants = cva('relative flex items-center rounded-xl whitespace-nowrap text-text-secondary', {
  variants: {
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
    shadow: { none: 'shadow-none [--cs-shadow:none]', '1': 'glass-shadow-1 shadow-1', '2': 'glass-shadow-2 shadow-2', '3': 'glass-shadow-3 shadow-3', '4': 'glass-shadow-4 shadow-4', '5': 'glass-shadow-5 shadow-5' },
    size: {
      xs: 'h-control-xs gap-2.5 px-2 text-ui-xs',
      sm: 'h-control-sm gap-3 px-2.5 text-footnote',
      md: 'h-control-md gap-4 px-3 text-footnote',
      lg: 'h-control-lg gap-5 px-3.5 text-ui',
    },
  },
  compoundVariants: [
    // The own look is the thick glass; every other variant and tone is a plain opaque fill (no glass, so no ordering
    // fight between the glass utility and the fill or edge utilities).
    { variant: 'solid', tone: 'neutral', className: 'glass glass-thick' },
    { variant: 'solid', tone: 'accent', className: 'bg-accent-soft' },
    { variant: 'solid', tone: 'success', className: 'bg-success-soft' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'solid', tone: 'info', className: 'bg-info-soft' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-soft' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-tint' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-tint' },
    { variant: 'soft', tone: 'success', className: 'bg-success-tint' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-tint' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-tint' },
    { variant: 'soft', tone: 'info', className: 'bg-info-tint' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-tint' },
    { variant: 'outline', tone: 'neutral', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'ghost', tone: 'neutral', className: 'bg-transparent shadow-none' },
    { variant: 'ghost', tone: 'accent', className: 'bg-transparent shadow-none' },
    { variant: 'ghost', tone: 'success', className: 'bg-transparent shadow-none' },
    { variant: 'ghost', tone: 'warning', className: 'bg-transparent shadow-none' },
    { variant: 'ghost', tone: 'danger', className: 'bg-transparent shadow-none' },
    { variant: 'ghost', tone: 'info', className: 'bg-transparent shadow-none' },
    { variant: 'ghost', tone: 'agent', className: 'bg-transparent shadow-none' },
  ],
  defaultVariants: { variant: 'solid', tone: 'neutral', radius: 'xl', shadow: '3', size: 'md' },
});
