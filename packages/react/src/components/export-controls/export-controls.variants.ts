import { cva } from 'class-variance-authority';

// Common props (lib/common-props.ts): radius, shadow and size on the root (size steps the stack gap; the tiles, the
// segmented control and the buttons keep their own size); tone and variant on the status line, the part's feedback.
// Two sections (owner 2026-10-27: the parts did not read as separate sections): the settings (format tiles, scale row)
// and the output (actions, status). Inside a section the gap is 12px; the actions add 12px above them (24px between the
// sections), so space, not a line, separates them.
export const exportControlsVariants = cva('grid gap-3', {
  variants: {
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: 'gap-2', sm: 'gap-2.5', md: '', lg: 'gap-4' },
  },
  defaultVariants: { radius: 'none', shadow: 'none', size: 'md' },
});
export const exportControlsScaleVariants = cva('flex items-center justify-between gap-2');
export const exportControlsScaleLabelVariants = cva('text-micro text-text-tertiary');
/** The output section starts here: 12px more above it than the stack gap. */
export const exportControlsActionsVariants = cva('mt-3 flex items-center justify-between gap-2');
// The status has no glyph (owner 2026-10-27). soft (default, with tone success) is the result well of proposal A: the
// tone tint, lg radius, 8 / 12 padding, secondary text. ghost is a plain line in the tone text (neutral: secondary);
// outline boxes it with a 1px tone border and tone text; solid is the tone solid (ink for neutral) with on text.
export const exportControlsStatusVariants = cva('flex items-center gap-2 text-ui-sm font-normal text-text-secondary animate-rise', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: 'rounded-lg px-3 py-2', soft: 'rounded-lg px-3 py-2', outline: 'rounded-lg px-3 py-2', ghost: '' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'bg-ink-solid text-ink-on' },
    { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on' },
    { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on' },
    { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-track' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-tint' },
    { variant: 'soft', tone: 'success', className: 'bg-success-tint' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-tint' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-tint' },
    { variant: 'soft', tone: 'info', className: 'bg-info-tint' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-tint' },
    { variant: 'outline', tone: 'neutral', className: 'shadow-[inset_0_0_0_0.5px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'ghost', tone: 'accent', className: 'text-accent-text' },
    { variant: 'ghost', tone: 'success', className: 'text-success-text' },
    { variant: 'ghost', tone: 'warning', className: 'text-warning-text' },
    { variant: 'ghost', tone: 'danger', className: 'text-danger-text' },
    { variant: 'ghost', tone: 'info', className: 'text-info-text' },
    { variant: 'ghost', tone: 'agent', className: 'text-agent-text' },
  ],
  defaultVariants: { tone: 'success', variant: 'soft' },
});
