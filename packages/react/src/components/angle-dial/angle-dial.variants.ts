import { cva } from 'class-variance-authority';

// Five common props (lib/common-props.ts); each axis' default is the dial's own look and adds no class:
//   variant / tone  the face: soft = neutral.well with the border.default ring (own; in a tone, its tint); solid = an
//                   opaque surface (surface.base, or the tone soft); outline = the tone border, no fill; ghost = no face.
//                   The tone also colours the needle and hub (graphic step; neutral = neutral.graphic, own).
//   radius / shadow the face (full, flat). size: the dial and needle, xs 24 · sm 28 · md 32 (own) · lg 40.
export const angleDialVariants = cva(
  [
    'group/dial relative inline-block shrink-0 cursor-grab touch-none select-none rounded-full bg-neutral-well align-middle outline-none',
    'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
    'active:cursor-grabbing focus-visible:shadow-focus',
    'data-[disabled]:pointer-events-none data-[disabled]:bg-disabled-fill data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  ],
  {
    variants: {
      variant: { solid: '', soft: '', outline: '', ghost: '' },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      radius: {
        none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
        xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: '',
      },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
      size: { xs: 'size-control-xs', sm: 'size-control-sm', md: 'size-control-md', lg: 'size-control-lg' },
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
    defaultVariants: { variant: 'soft', tone: 'neutral', radius: 'full', shadow: 'none', size: 'md' },
  },
);

/** Needle and hub colour: the tone graphic (neutral = neutral.graphic); disabled.text when disabled. */
const markTone = {
  neutral: 'bg-neutral-graphic', accent: 'bg-accent-graphic', success: 'bg-success-graphic', warning: 'bg-warning-graphic',
  danger: 'bg-danger-graphic', info: 'bg-info-graphic', agent: 'bg-agent-graphic',
} as const;

// While the dial has keyboard focus the needle and hub take accent.graphic (owner 2026-10-27, proposal B): the part that
// answers the arrow keys is marked, not only ringed.
export const angleDialNeedleVariants = cva(
  'pointer-events-none absolute top-1/2 left-1/2 h-0.5 origin-left rounded-2xs group-focus-visible/dial:bg-accent-graphic in-data-[disabled]:bg-disabled-text [transform:rotate(calc(var(--dial-angle)_-_90deg))]',
  {
    variants: {
      tone: markTone,
      size: { xs: 'w-2', sm: 'w-2', md: 'w-2.5', lg: 'w-3.5' },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
);

export const angleDialHubVariants = cva(
  'pointer-events-none absolute top-1/2 left-1/2 size-1 -translate-1/2 rounded-full group-focus-visible/dial:bg-accent-graphic in-data-[disabled]:bg-disabled-text',
  { variants: { tone: markTone }, defaultVariants: { tone: 'neutral' } },
);

/** Quarter ticks (owner 2026-10-27, proposal A): 1 × 3px border.strong marks just inside the face at 0, 90, 180 and 270°,
 *  so the quarter angles read without the field. disabled.border when disabled. */
export const angleDialTickVariants = cva('pointer-events-none absolute bg-border-strong in-data-[disabled]:bg-disabled-border', {
  variants: {
    at: {
      0: 'top-0.5 left-1/2 h-0.75 w-px -translate-x-1/2',
      90: 'top-1/2 right-0.5 h-px w-0.75 -translate-y-1/2',
      180: 'bottom-0.5 left-1/2 h-0.75 w-px -translate-x-1/2',
      270: 'top-1/2 left-0.5 h-px w-0.75 -translate-y-1/2',
    },
  },
  defaultVariants: { at: 0 },
});
