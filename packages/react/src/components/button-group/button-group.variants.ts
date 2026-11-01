import { cva, type VariantProps } from 'class-variance-authority';

// Five common props (lib/common-props.ts). Each axis' default is the group's own look and adds no class:
//   variant / tone  the track: soft neutral = the own neutral.track; soft in a tone = its tint; solid = an opaque surface
//                   (surface.base, or the tone soft); outline = a 1px tone border, no fill; ghost = no track.
//   radius / shadow the track (lg, flat); size steps the items that set no size of their own (IconButton / Button
//                   xs 24 · sm 28 · md 32 · lg 40) and the separator.
// density stays its own axis: the track padding (regular 2px, tight 1px) and, at tight, 14px icons in the items.
// A ghost item hovers as a raised shape lifted off the track (control.raised + the control edge; owner 2026-10-27, B,
// from align-bar): neutral.hover sits too close to the track fill to read.
export const buttonGroupVariants = cva(
  [
    'inline-flex items-stretch gap-px rounded-lg bg-neutral-track font-ui',
    // Items nest in the track: md = the track radius minus its padding (Buttons alone are one step rounder).
    '*:data-[slot=button-group-item]:rounded-md',
    '*:data-[variant=ghost]:hover:bg-control-raised *:data-[variant=ghost]:hover:text-text-primary',
    '*:data-[variant=ghost]:hover:shadow-[inset_0_0_0_0.5px_var(--cs-color-control-edge),var(--cs-elevation-2)]',
  ],
  {
    variants: {
      density: { regular: 'p-0.5', tight: 'p-px [&_[data-slot=icon-button-icon]]:size-icon-sm' },
      variant: { solid: '', soft: '', outline: '', ghost: '' },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      radius: {
        none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: '',
        xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
      },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    },
    compoundVariants: [
      { variant: 'solid', tone: 'neutral', className: 'bg-surface-base' },
      { variant: 'solid', tone: 'accent', className: 'bg-accent-soft' },
      { variant: 'solid', tone: 'success', className: 'bg-success-soft' },
      { variant: 'solid', tone: 'warning', className: 'bg-warning-soft' },
      { variant: 'solid', tone: 'danger', className: 'bg-danger-soft' },
      { variant: 'solid', tone: 'info', className: 'bg-info-soft' },
      { variant: 'solid', tone: 'agent', className: 'bg-agent-soft' },
      { variant: 'soft', tone: 'accent', className: 'bg-accent-tint' },
      { variant: 'soft', tone: 'success', className: 'bg-success-tint' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-tint' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-tint' },
      { variant: 'soft', tone: 'info', className: 'bg-info-tint' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-tint' },
      { variant: 'outline', tone: 'neutral', className: 'bg-transparent shadow-[inset_0_0_0_0.5px_var(--cs-color-neutral-border)]' },
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
    defaultVariants: { density: 'regular', variant: 'soft', tone: 'neutral', radius: 'lg', shadow: 'none' },
  },
);

/** Vertical hairline between two runs of actions: the divider role (PROPOSAL E15). Its height follows the items.
 *  6px each side (owner 2026-10-27, A, from align-bar) so the two groups read apart. */
export const buttonGroupSeparatorVariants = cva('mx-1.5 my-1 w-px self-center bg-divider-line', {
  variants: { size: { xs: 'h-4', sm: 'h-5', md: 'h-6', lg: 'h-8' } },
  defaultVariants: { size: 'md' },
});

export type ButtonGroupVariantProps = Pick<VariantProps<typeof buttonGroupVariants>, 'density'>;
