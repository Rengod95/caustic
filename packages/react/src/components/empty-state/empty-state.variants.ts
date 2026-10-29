import { cva, type VariantProps } from 'class-variance-authority';

// Common props (lib/common-props.ts): radius, shadow and size on the root; tone and variant on the icon tile, the one
// emphasis of the region. `variant` also takes two presets (owner 2026-10-28): dashed (default, today's empty state)
// and agent (the orb, the serif voice and the canvas dot grid; was CanvasEmpty). The presets only set mark, voice and
// surface; the component resolves them, so the root and tile cvas receive the resolved values.
export const emptyStateVariants = cva('animate-enter grid w-full justify-items-center px-4 text-center', {
  variants: {
    // dashed = 1px dashed border.strong outline inside the edge; grid = the canvas dot grid on bg.canvas, no outline
    // (16px dot step); none = no outline or fill.
    surface: {
      dashed: 'outline-1 -outline-offset-1 outline-dashed outline-border-strong',
      grid: 'canvas-grid [background-size:var(--cs-space-4)_var(--cs-space-4)]',
      none: '',
    },
    // Unset radius resolves to 2xl (xl on the grid surface) in the component.
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    // Padding and the gap between the groups (mark, text, actions) step with the size; md is the empty page, sm an empty
    // list result. Title and description sit closer inside the text group (owner 2026-10-27).
    size: { xs: 'gap-2 px-3 py-3', sm: 'gap-3 py-4.5', md: 'gap-4 py-7', lg: 'gap-5 py-10' },
  },
  defaultVariants: { surface: 'dashed', radius: '2xl', shadow: 'none', size: 'md' },
});

/** The agent orb as the mark. Spectrum light, allowed only for mark=orb (flags.agent, P2). */
export const emptyStateOrb = cva('', {
  variants: { mark: { icon: '', orb: 'orb orb-lg' } },
  defaultVariants: { mark: 'icon' },
});

export const emptyStateIcon = cva('grid place-items-center rounded-xl bg-neutral-track text-text-secondary [&_svg]:size-empty-glyph', {
  variants: {
    size: { xs: 'size-control-md rounded-lg [&_svg]:size-icon-md', sm: 'size-control-lg', md: 'size-control-xl', lg: 'size-control-xl' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    // soft = today's tile (neutral track, secondary glyph). The presets dashed and agent draw the soft tile.
    variant: { solid: '', soft: '', outline: '', ghost: '', dashed: '', agent: '' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'bg-ink-solid text-ink-on shadow-none' },
    { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on shadow-none' },
    { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on shadow-none' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on shadow-none' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on shadow-none' },
    { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on shadow-none' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on shadow-none' },
    { variant: ['soft', 'dashed', 'agent'], tone: 'accent', className: 'bg-accent-soft text-accent-text shadow-none' },
    { variant: ['soft', 'dashed', 'agent'], tone: 'success', className: 'bg-success-soft text-success-text shadow-none' },
    { variant: ['soft', 'dashed', 'agent'], tone: 'warning', className: 'bg-warning-soft text-warning-text shadow-none' },
    { variant: ['soft', 'dashed', 'agent'], tone: 'danger', className: 'bg-danger-soft text-danger-text shadow-none' },
    { variant: ['soft', 'dashed', 'agent'], tone: 'info', className: 'bg-info-soft text-info-text shadow-none' },
    { variant: ['soft', 'dashed', 'agent'], tone: 'agent', className: 'bg-agent-soft text-agent-text shadow-none' },
    { variant: 'outline', tone: 'neutral', className: 'bg-transparent text-text-secondary shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'bg-transparent text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'bg-transparent text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'bg-transparent text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'bg-transparent text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'bg-transparent text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'bg-transparent text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'ghost', tone: 'neutral', className: 'bg-transparent text-text-secondary shadow-none' },
    { variant: 'ghost', tone: 'accent', className: 'bg-transparent text-accent-text shadow-none' },
    { variant: 'ghost', tone: 'success', className: 'bg-transparent text-success-text shadow-none' },
    { variant: 'ghost', tone: 'warning', className: 'bg-transparent text-warning-text shadow-none' },
    { variant: 'ghost', tone: 'danger', className: 'bg-transparent text-danger-text shadow-none' },
    { variant: 'ghost', tone: 'info', className: 'bg-transparent text-info-text shadow-none' },
    { variant: 'ghost', tone: 'agent', className: 'bg-transparent text-agent-text shadow-none' },
  ],
  defaultVariants: { size: 'md', tone: 'neutral', variant: 'dashed' },
});

/**
 * The title. Interface voice: md (the default) is one step up from title-3 (owner 2026-10-27); lg follows; xs and sm keep
 * the list steps. Agent voice (serif): voice-xl at md and lg (owner 2026-10-27: a larger title), voice at sm, voice-sm at xs.
 */
export const emptyStateTitle = cva('text-text-primary', {
  variants: {
    size: { xs: '', sm: '', md: '', lg: '' },
    voice: { false: 'font-ui', true: 'font-voice' },
  },
  compoundVariants: [
    { voice: false, size: 'xs', className: 'text-ui-strong' },
    { voice: false, size: 'sm', className: 'text-title-4' },
    { voice: false, size: 'md', className: 'text-title-2' },
    { voice: false, size: 'lg', className: 'text-title-1' },
    { voice: true, size: 'xs', className: 'font-voice text-voice-sm' },
    { voice: true, size: 'sm', className: 'font-voice text-voice' },
    { voice: true, size: ['md', 'lg'], className: 'font-voice text-voice-xl' },
  ],
  defaultVariants: { size: 'md', voice: false },
});

/** Reason and next step: secondary ui-relaxed at 40ch; under the agent voice one tertiary ui-sm line at 34ch. */
export const emptyStateDescription = cva('m-0 font-ui', {
  variants: {
    voice: { false: 'max-w-[40ch] text-ui-relaxed text-text-secondary', true: 'max-w-[34ch] text-ui-sm font-normal text-text-tertiary' },
  },
  defaultVariants: { voice: false },
});

/** Title and description: one group, tighter than the gap between the groups. */
export const emptyStateText = cva('grid justify-items-center', {
  variants: { size: { xs: 'gap-0.5', sm: 'gap-1', md: 'gap-1', lg: 'gap-1.5' } },
  defaultVariants: { size: 'md' },
});

/** Media in place of the tile or orb: icons and images in a centered row. Icons take text.secondary at the size's icon step; images cap their height. */
export const emptyStateMedia = cva('flex items-center justify-center text-text-secondary', {
  variants: {
    size: {
      xs: 'gap-1.5 [&_img]:max-h-control-sm [&_svg]:size-icon-md',
      sm: 'gap-2 [&_img]:max-h-control-md [&_svg]:size-icon-lg',
      md: 'gap-2 [&_img]:max-h-control-xl [&_svg]:size-icon-xl',
      lg: 'gap-3 [&_img]:max-h-control-xl [&_svg]:size-icon-xl',
    },
  },
  defaultVariants: { size: 'md' },
});

/** One to three buttons, centered, wrapping, 8px gap. */
export const emptyStateActions = cva('flex flex-wrap items-center justify-center gap-2');

export type EmptyStateVariantProps = VariantProps<typeof emptyStateVariants>;
