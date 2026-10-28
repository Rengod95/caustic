import { cva } from 'class-variance-authority';

/**
 * The frame. The variant is its emphasis and the tone the frame colour (lib/common-props): solid (default) is the opaque
 * surface.base with elevation 3 and no hairline (one depth cue); soft = soft 3 fill, flat; outline = a 1px edge, flat
 * (neutral border.subtle, hued border 6); ghost = no fill, edge or elevation. A hued solid adds a border-strong 7 edge.
 */
// overflow-clip (not hidden): it clips to the radius without becoming a scroll container, so the sticky section headers
// stick to the inspector's real scroller.
export const inspectorPanelVariants = cva('w-full overflow-clip rounded-panel bg-surface-base font-ui text-text-primary shadow-3', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: {
      solid: '',
      soft: 'bg-neutral-soft shadow-none',
      outline: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
      ghost: 'bg-transparent shadow-none',
    },
  },
  compoundVariants: [
    // solid × tone
    { variant: 'solid', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong),var(--cs-elevation-3)]' },
    { variant: 'solid', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong),var(--cs-elevation-3)]' },
    { variant: 'solid', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong),var(--cs-elevation-3)]' },
    { variant: 'solid', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-elevation-3)]' },
    { variant: 'solid', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong),var(--cs-elevation-3)]' },
    { variant: 'solid', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border-strong),var(--cs-elevation-3)]' },
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
  defaultVariants: { tone: 'neutral', variant: 'solid' },
});

/** Common radius / shadow (lib/common-props) of the frame; unset keeps the panel radius and elevation 3. */
export const inspectorPanelFrameVariants = cva('', {
  variants: {
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full', panel: '' },
    shadow: { none: 'shadow-none', '1': 'shadow-1', '2': 'shadow-2', '3': '', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: 'panel', shadow: '3' },
});

/** A section: padding and row gap step with the panel size (md = 12 / 8, today). It inherits the panel fill for its sticky header. */
export const inspectorSectionVariants = cva('grid content-start bg-inherit border-b border-border-subtle last:border-b-0', {
  variants: { size: { xs: 'gap-1.5 p-2', sm: 'gap-2 p-2.5', md: 'gap-2 p-3', lg: 'gap-3 p-4' } },
  defaultVariants: { size: 'md' },
});

// The header sticks to the top of the scrolling inspector while its section is on screen (owner 2026-10-27, A), on the
// panel fill (inherited through the section: surface.base by default), above the section's controls.
export const inspectorSectionHeaderVariants = cva('sticky top-0 z-30 flex items-center justify-between bg-inherit font-semibold', {
  variants: { size: { xs: 'text-micro', sm: 'text-hint', md: 'text-hint', lg: 'text-ui-sm' } },
  defaultVariants: { size: 'md' },
});

/** The header row's colour (what its actions inherit): secondary; a hued panel tone colours it with the tone text. */
export const inspectorSectionHeaderToneVariants = cva('', {
  variants: {
    tone: {
      neutral: 'text-text-secondary', accent: 'text-accent-text', success: 'text-success-text', warning: 'text-warning-text',
      danger: 'text-danger-text', info: 'text-info-text', agent: 'text-agent-text',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

/**
 * Section title in the caption style (owner 2026-10-28, options 1–2): uppercase caption type with the caption tracking,
 * text.tertiary, so a section reads as a different layer from the field labels. Every size uses the caption role; a
 * hued panel tone colours it with the tone text. PropertyStack's title uses the same classes.
 */
export const inspectorSectionTitleVariants = cva('text-caption uppercase', {
  variants: {
    tone: {
      neutral: 'text-text-tertiary', accent: 'text-accent-text', success: 'text-success-text', warning: 'text-warning-text',
      danger: 'text-danger-text', info: 'text-info-text', agent: 'text-agent-text',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export const inspectorSectionActionsVariants = cva('flex items-center gap-0.5');
