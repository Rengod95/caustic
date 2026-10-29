import { cva, type VariantProps } from 'class-variance-authority';

// Rest is the neutral well; disabled is a colour (disabled fill and edge, marks in disabled slots), not opacity.
// Five common props (lib/common-props.ts); each axis' default is the pad's own look and adds no class:
//   variant / tone  the well: soft = neutral.well with the hairline (own; in another tone its tint), solid = an opaque surface
//                   (surface.base, or the tone soft), outline = the tone border only, ghost = no well. The tone also fills
//                   the selected bars (accent by default: the own look).
//   radius / shadow the well (lg, flat). size: the pad box, lg = the own 96px; md 72, sm 64, xs 48 (dense: cells under 24px).
export const alignmentPadVariants = cva(
  'group/pad grid shrink-0 grid-cols-3 grid-rows-3 rounded-lg bg-neutral-well font-ui shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] aria-disabled:pointer-events-none aria-disabled:bg-disabled-fill aria-disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  {
    variants: {
      variant: { solid: '', soft: '', outline: '', ghost: '' },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      radius: {
        none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: '',
        xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
      },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
      size: { xs: 'size-12 gap-px p-1', sm: 'size-16 gap-0.5 p-1', md: 'size-18 gap-0.5 p-1.25', lg: 'size-pad-box gap-0.5 p-1.5' },
    },
    compoundVariants: [
      { variant: 'solid', tone: 'neutral', className: 'bg-surface-base' },
      { variant: 'solid', tone: 'accent', className: 'bg-accent-soft' },
      { variant: 'solid', tone: 'success', className: 'bg-success-soft' },
      { variant: 'solid', tone: 'warning', className: 'bg-warning-soft' },
      { variant: 'solid', tone: 'danger', className: 'bg-danger-soft' },
      { variant: 'solid', tone: 'info', className: 'bg-info-soft' },
      { variant: 'solid', tone: 'agent', className: 'bg-agent-soft' },
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
    defaultVariants: { variant: 'soft', tone: 'accent', radius: 'lg', shadow: 'none', size: 'lg' },
  },
);

// The selected cell is the current-position thumb (owner 2026-10-27, B): control.raised with the control edge, as the
// segmented thumb, so the bars do not have to carry the selection alone at small sizes. Focus keeps the edge; a disabled
// pad drops the thumb.
export const alignmentPadCell = cva([
  'group grid cursor-pointer place-items-center rounded-xs bg-transparent outline-none focus-visible:shadow-focus transition-control',
  'aria-checked:bg-control-raised aria-checked:shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)]',
  'aria-checked:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-control-edge),var(--cs-focus)]',
  'group-aria-disabled/pad:aria-checked:bg-transparent group-aria-disabled/pad:aria-checked:shadow-none',
]);

// Off: a dot (neutral graphic); hovering an off cell previews the selection colour on the dot (owner 2026-10-27, A): the
// tone graphic step (neutral: text.secondary, as the ink bars have no graphic step). On: three bars along the flow in accent solid; the centre bar is the mark, the other two are its pseudo-elements.
export const alignmentPadMark = cva('relative block transition-colors duration-quick ease-standard', {
  variants: {
    checked: {
      false: 'size-1 rounded-full bg-neutral-graphic group-aria-disabled/pad:bg-disabled-border',
      true: 'rounded-2xs bg-accent-solid before:absolute before:rounded-2xs before:bg-accent-solid after:absolute after:rounded-2xs after:bg-accent-solid group-aria-disabled/pad:bg-disabled-text group-aria-disabled/pad:before:bg-disabled-text group-aria-disabled/pad:after:bg-disabled-text',
    },
    orientation: { row: '', column: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
  },
  compoundVariants: [
    // Hover preview on an off dot: the tone graphic.
    { checked: false, tone: 'neutral', className: 'group-hover:bg-text-secondary' },
    { checked: false, tone: 'accent', className: 'group-hover:bg-accent-graphic' },
    { checked: false, tone: 'success', className: 'group-hover:bg-success-graphic' },
    { checked: false, tone: 'warning', className: 'group-hover:bg-warning-graphic' },
    { checked: false, tone: 'danger', className: 'group-hover:bg-danger-graphic' },
    { checked: false, tone: 'info', className: 'group-hover:bg-info-graphic' },
    { checked: false, tone: 'agent', className: 'group-hover:bg-agent-graphic' },
    // The selected bars take the tone solid (accent is the own look, in the checked base).
    { checked: true, tone: 'neutral', className: 'bg-ink-solid before:bg-ink-solid after:bg-ink-solid' },
    { checked: true, tone: 'success', className: 'bg-success-solid before:bg-success-solid after:bg-success-solid' },
    { checked: true, tone: 'warning', className: 'bg-warning-solid before:bg-warning-solid after:bg-warning-solid' },
    { checked: true, tone: 'danger', className: 'bg-danger-solid before:bg-danger-solid after:bg-danger-solid' },
    { checked: true, tone: 'info', className: 'bg-info-solid before:bg-info-solid after:bg-info-solid' },
    { checked: true, tone: 'agent', className: 'bg-agent-solid before:bg-agent-solid after:bg-agent-solid' },
    { checked: true, orientation: 'row', className: 'h-3 w-0.5 before:-left-1 before:h-3 before:w-0.5 after:-right-1 after:h-3 after:w-0.5' },
    { checked: true, orientation: 'column', className: 'h-0.5 w-3 before:-top-1 before:h-0.5 before:w-3 after:-bottom-1 after:h-0.5 after:w-3' },
  ],
  defaultVariants: { checked: false, orientation: 'row', tone: 'accent' },
});

export type AlignmentPadVariantProps = VariantProps<typeof alignmentPadVariants>;
