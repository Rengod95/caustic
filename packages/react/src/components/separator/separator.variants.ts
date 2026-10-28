import { cva, type VariantProps } from 'class-variance-authority';

// Common props (owner 2026-10-26). The line carries them (the root on a plain rule, the two lines on a labelled one):
//   variant  solid = the default line (neutral: border.default, today; a hue: its solid 9); soft = a lighter line
//            (border.subtle; a hue: its soft 3); outline = a stronger line (border.strong; a hue: its border 6);
//            ghost = no line (spacing only; a label stays)
//   tone     the hue of that line
//   size     line thickness (xs 0.5px, sm and md 1px = today, lg 2px) and the label type and gap
//   radius   the line ends (none by default; full rounds a thick line); shadow is the line's elevation (flat by default)
export const separatorVariants = cva('shrink-0', {
  variants: {
    orientation: {
      horizontal: 'w-full',
      vertical: 'self-stretch',
    },
    labeled: {
      true: 'h-auto flex items-center bg-transparent font-normal text-text-tertiary',
      false: '',
    },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: 'bg-transparent' },
    radius: {
      none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { orientation: 'horizontal', labeled: false, size: 'xs', className: 'h-[0.5px]' },
    { orientation: 'horizontal', labeled: false, size: ['sm', 'md'], className: 'h-px' },
    { orientation: 'horizontal', labeled: false, size: 'lg', className: 'h-0.5' },
    { orientation: 'vertical', size: 'xs', className: 'w-[0.5px]' },
    { orientation: 'vertical', size: ['sm', 'md'], className: 'w-px' },
    { orientation: 'vertical', size: 'lg', className: 'w-0.5' },
    { labeled: true, size: 'xs', className: 'gap-1.5 text-caption' },
    { labeled: true, size: 'sm', className: 'gap-2 text-ui-xs' },
    { labeled: true, size: 'md', className: 'gap-3 text-ui-sm' },
    { labeled: true, size: 'lg', className: 'gap-4 text-ui' },
    { labeled: false, variant: 'solid', tone: 'neutral', className: 'bg-border-default' },
    { labeled: false, variant: 'solid', tone: 'accent', className: 'bg-accent-solid' },
    { labeled: false, variant: 'solid', tone: 'success', className: 'bg-success-solid' },
    { labeled: false, variant: 'solid', tone: 'warning', className: 'bg-warning-solid' },
    { labeled: false, variant: 'solid', tone: 'danger', className: 'bg-danger-solid' },
    { labeled: false, variant: 'solid', tone: 'info', className: 'bg-info-solid' },
    { labeled: false, variant: 'solid', tone: 'agent', className: 'bg-agent-solid' },
    { labeled: false, variant: 'soft', tone: 'neutral', className: 'bg-border-subtle' },
    { labeled: false, variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
    { labeled: false, variant: 'soft', tone: 'success', className: 'bg-success-soft' },
    { labeled: false, variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
    { labeled: false, variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
    { labeled: false, variant: 'soft', tone: 'info', className: 'bg-info-soft' },
    { labeled: false, variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
    { labeled: false, variant: 'outline', tone: 'neutral', className: 'bg-border-strong' },
    { labeled: false, variant: 'outline', tone: 'accent', className: 'bg-accent-border' },
    { labeled: false, variant: 'outline', tone: 'success', className: 'bg-success-border' },
    { labeled: false, variant: 'outline', tone: 'warning', className: 'bg-warning-border' },
    { labeled: false, variant: 'outline', tone: 'danger', className: 'bg-danger-border' },
    { labeled: false, variant: 'outline', tone: 'info', className: 'bg-info-border' },
    { labeled: false, variant: 'outline', tone: 'agent', className: 'bg-agent-border' },
  ],
  defaultVariants: { orientation: 'horizontal', labeled: false, tone: 'neutral', variant: 'solid', radius: 'none', shadow: 'none', size: 'md' },
});

/** The two flexible lines either side of a label: the same colour, thickness and ends as a plain rule. */
export const separatorLineVariants = cva('flex-1', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: 'bg-transparent' },
    size: { xs: 'h-[0.5px]', sm: 'h-px', md: 'h-px', lg: 'h-0.5' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'bg-border-default' },
    { variant: 'solid', tone: 'accent', className: 'bg-accent-solid' },
    { variant: 'solid', tone: 'success', className: 'bg-success-solid' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-solid' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-solid' },
    { variant: 'solid', tone: 'info', className: 'bg-info-solid' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-solid' },
    { variant: 'soft', tone: 'neutral', className: 'bg-border-subtle' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
    { variant: 'outline', tone: 'neutral', className: 'bg-border-strong' },
    { variant: 'outline', tone: 'accent', className: 'bg-accent-border' },
    { variant: 'outline', tone: 'success', className: 'bg-success-border' },
    { variant: 'outline', tone: 'warning', className: 'bg-warning-border' },
    { variant: 'outline', tone: 'danger', className: 'bg-danger-border' },
    { variant: 'outline', tone: 'info', className: 'bg-info-border' },
    { variant: 'outline', tone: 'agent', className: 'bg-agent-border' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'solid', size: 'md' },
});

/** The label reads as a section heading (owner 2026-10-28, proposal A): uppercase with the caption tracking, like a
 *  SectionHeader eyebrow; the size keeps its type step and the root's text.tertiary. */
export const separatorLabelVariants = cva('uppercase tracking-[var(--cs-text-caption-tracking)]');

export type SeparatorVariantProps = VariantProps<typeof separatorVariants>;
