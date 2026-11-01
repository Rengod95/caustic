import { cva } from 'class-variance-authority';

/**
 * The stack. The variant frames it and the tone colours the frame (lib/common-props): ghost (default) is the frameless
 * dialog body; outline = a 1px edge (neutral border.subtle, hued border 6); soft = soft 3 fill; solid = the opaque
 * surface.base (hued: border-strong 7 edge). A framed panel takes an xl radius and 14px padding.
 * Three sections separated by space, not lines (owner 2026-10-27, as export-controls): the source tiles; the field and
 * the capture options (12px apart); the footer. The field and the footer add 12px above them (24px between sections).
 */
export const importPanelVariants = cva('grid gap-3', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: {
      solid: 'rounded-xl bg-surface-base p-3.5',
      soft: 'rounded-xl bg-neutral-soft p-3.5',
      outline: 'rounded-xl p-3.5 shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)]',
      ghost: '',
    },
  },
  compoundVariants: [
    // solid × tone
    { variant: 'solid', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)]' },
    { variant: 'solid', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong)]' },
    { variant: 'solid', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong)]' },
    { variant: 'solid', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)]' },
    { variant: 'solid', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong)]' },
    { variant: 'solid', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border-strong)]' },
    // soft × tone
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
    // outline × tone
    { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'ghost' },
});

/** Common radius / shadow (lib/common-props) of the root, applied after its classes so an explicit value wins. */
export const importPanelFrameVariants = cva('', {
  variants: {
    // Common radius / shadow (lib/common-props): the default key is the component's own look (no class).
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    // size only steps the child controls (see import-panel.tsx); the stack itself keeps its gap.
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  defaultVariants: { radius: 'none', shadow: 'none', size: 'md' },
});

export const importPanelOptionsVariants = cva('animate-rise grid grid-cols-2 items-center gap-1.5');
export const importPanelDeviceVariants = cva('justify-self-end');
/** Starts the input section: 12px more above it than the stack gap. */
export const importPanelFieldVariants = cva('mt-3');
/** Starts the footer section: 12px more above it than the stack gap. */
export const importPanelFooterVariants = cva('mt-3 flex items-center justify-between gap-2');

/** The footer note: hint, tertiary; a hued tone colours it with the tone text. */
export const importPanelNoteVariants = cva('text-hint', {
  variants: {
    tone: {
      neutral: 'text-text-tertiary', accent: 'text-accent-text', success: 'text-success-text', warning: 'text-warning-text',
      danger: 'text-danger-text', info: 'text-info-text', agent: 'text-agent-text',
    },
  },
  defaultVariants: { tone: 'neutral' },
});
