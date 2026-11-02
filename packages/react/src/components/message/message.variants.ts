import { cva, type VariantProps } from 'class-variance-authority';

/**
 * One turn. Common props (owner 2026-10-26) style the bubble (user) or the prose panel (agent); unset keeps today's look:
 * the user bubble is variant soft (neutral.track fill, 0.5px border.subtle ring), the agent prose is variant ghost (no
 * panel; Message passes ghost for the agent when variant is unset).
 *   user   solid = ink (neutral) or the tone's solid 9 with its on text · soft = the tone's soft 3 with its text ·
 *          outline = no fill, the tone's border 6 edge · ghost = bare text (a hue colours it)
 *   agent  solid = a raised panel with a hairline (neutral) or the tone's tint 2 with its border 6 · soft = the tone's
 *          soft 3 panel · outline = the tone's border 6 edge · ghost = no panel (default)
 * radius replaces the bubble corners (a uniform corner drops the 6px sender corner); shadow adds an elevation.
 * Every turn rises in once when it mounts (animate-rise). Streaming text inside it is never animated.
 */
export const messageVariants = cva('animate-rise', {
  variants: {
    author: {
      user: 'max-w-[88%] self-end justify-self-end rounded-2xl rounded-br-sm bg-neutral-track text-text-primary shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)]',
      agent: 'grid gap-3',
    },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: { solid: '', soft: '', outline: '', ghost: '' },
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': '', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    // The user bubble steps its inset and type with size (md = 8 / 12, ui-relaxed).
    { author: 'user', size: 'xs', className: 'px-2 py-1 text-ui-sm' },
    { author: 'user', size: 'sm', className: 'px-2.5 py-1.5 text-ui' },
    { author: 'user', size: 'md', className: 'px-3 py-2 text-ui-relaxed' },
    { author: 'user', size: 'lg', className: 'px-3.5 py-2.5 text-ui-lg' },
    { author: 'user', variant: 'solid', tone: 'neutral', className: 'bg-ink-solid text-ink-on shadow-none' },
    { author: 'user', variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on shadow-none' },
    { author: 'user', variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on shadow-none' },
    { author: 'user', variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on shadow-none' },
    { author: 'user', variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on shadow-none' },
    { author: 'user', variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on shadow-none' },
    { author: 'user', variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on shadow-none' },
    { author: 'user', variant: 'soft', tone: 'accent', className: 'bg-accent-soft text-accent-text' },
    { author: 'user', variant: 'soft', tone: 'success', className: 'bg-success-soft text-success-text' },
    { author: 'user', variant: 'soft', tone: 'warning', className: 'bg-warning-soft text-warning-text' },
    { author: 'user', variant: 'soft', tone: 'danger', className: 'bg-danger-soft text-danger-text' },
    { author: 'user', variant: 'soft', tone: 'info', className: 'bg-info-soft text-info-text' },
    { author: 'user', variant: 'soft', tone: 'agent', className: 'bg-agent-soft text-agent-text' },
    { author: 'user', variant: 'outline', tone: 'neutral', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { author: 'user', variant: 'outline', tone: 'accent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { author: 'user', variant: 'outline', tone: 'success', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { author: 'user', variant: 'outline', tone: 'warning', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { author: 'user', variant: 'outline', tone: 'danger', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { author: 'user', variant: 'outline', tone: 'info', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { author: 'user', variant: 'outline', tone: 'agent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { author: 'user', variant: 'ghost', tone: 'neutral', className: 'bg-transparent px-0 shadow-none' },
    { author: 'user', variant: 'ghost', tone: 'accent', className: 'bg-transparent px-0 text-accent-text shadow-none' },
    { author: 'user', variant: 'ghost', tone: 'success', className: 'bg-transparent px-0 text-success-text shadow-none' },
    { author: 'user', variant: 'ghost', tone: 'warning', className: 'bg-transparent px-0 text-warning-text shadow-none' },
    { author: 'user', variant: 'ghost', tone: 'danger', className: 'bg-transparent px-0 text-danger-text shadow-none' },
    { author: 'user', variant: 'ghost', tone: 'info', className: 'bg-transparent px-0 text-info-text shadow-none' },
    { author: 'user', variant: 'ghost', tone: 'agent', className: 'bg-transparent px-0 text-agent-text shadow-none' },
    { author: 'agent', variant: 'solid', tone: 'neutral', className: 'rounded-2xl px-3 py-2 bg-surface-raised shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]' },
    { author: 'agent', variant: 'solid', tone: 'accent', className: 'rounded-2xl px-3 py-2 bg-accent-tint shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { author: 'agent', variant: 'solid', tone: 'success', className: 'rounded-2xl px-3 py-2 bg-success-tint shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { author: 'agent', variant: 'solid', tone: 'warning', className: 'rounded-2xl px-3 py-2 bg-warning-tint shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { author: 'agent', variant: 'solid', tone: 'danger', className: 'rounded-2xl px-3 py-2 bg-danger-tint shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { author: 'agent', variant: 'solid', tone: 'info', className: 'rounded-2xl px-3 py-2 bg-info-tint shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { author: 'agent', variant: 'solid', tone: 'agent', className: 'rounded-2xl px-3 py-2 bg-agent-tint shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { author: 'agent', variant: 'soft', tone: 'neutral', className: 'rounded-2xl px-3 py-2 bg-neutral-soft' },
    { author: 'agent', variant: 'soft', tone: 'accent', className: 'rounded-2xl px-3 py-2 bg-accent-soft' },
    { author: 'agent', variant: 'soft', tone: 'success', className: 'rounded-2xl px-3 py-2 bg-success-soft' },
    { author: 'agent', variant: 'soft', tone: 'warning', className: 'rounded-2xl px-3 py-2 bg-warning-soft' },
    { author: 'agent', variant: 'soft', tone: 'danger', className: 'rounded-2xl px-3 py-2 bg-danger-soft' },
    { author: 'agent', variant: 'soft', tone: 'info', className: 'rounded-2xl px-3 py-2 bg-info-soft' },
    { author: 'agent', variant: 'soft', tone: 'agent', className: 'rounded-2xl px-3 py-2 bg-agent-soft' },
    { author: 'agent', variant: 'outline', tone: 'neutral', className: 'rounded-2xl px-3 py-2 shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { author: 'agent', variant: 'outline', tone: 'accent', className: 'rounded-2xl px-3 py-2 shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { author: 'agent', variant: 'outline', tone: 'success', className: 'rounded-2xl px-3 py-2 shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { author: 'agent', variant: 'outline', tone: 'warning', className: 'rounded-2xl px-3 py-2 shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { author: 'agent', variant: 'outline', tone: 'danger', className: 'rounded-2xl px-3 py-2 shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { author: 'agent', variant: 'outline', tone: 'info', className: 'rounded-2xl px-3 py-2 shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { author: 'agent', variant: 'outline', tone: 'agent', className: 'rounded-2xl px-3 py-2 shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
  ],
  defaultVariants: { author: 'agent', tone: 'neutral', variant: 'soft', radius: '2xl', shadow: 'none', size: 'md' },
});

export type MessageVariantProps = VariantProps<typeof messageVariants>;

/** The agent prose: voice serif; streaming adds the writing cursor; size steps the voice role (xs and sm voice-sm, md voice, lg voice-lg). */
export const messageBodyVariants = cva('font-voice text-text-primary [&_p]:mb-2', {
  variants: {
    size: { xs: 'font-voice text-voice-sm', sm: 'font-voice text-voice-sm', md: 'font-voice text-voice', lg: 'font-voice text-voice-lg' },
    // The writing cursor: a still bar after the last paragraph, never blinking (P8) and gone when the turn is done.
    streaming: { true: '[&>p:last-of-type]:after:ml-0.5 [&>p:last-of-type]:after:inline-block [&>p:last-of-type]:after:h-4 [&>p:last-of-type]:after:w-0.5 [&>p:last-of-type]:after:translate-y-0.5 [&>p:last-of-type]:after:rounded-full [&>p:last-of-type]:after:bg-text-primary [&>p:last-of-type]:after:content-[""]', false: '' },
  },
  defaultVariants: { size: 'md', streaming: false },
});

/** The agent spectrum orb dot; rendered only for the agent author. It turns only while the agent is writing (streaming); a finished turn keeps the still dot. */
export const messageOrbVariants = cva('', {
  variants: {
    author: { user: '', agent: 'orb orb-dot' },
    streaming: { true: '', false: 'animate-none' },
  },
  defaultVariants: { author: 'agent', streaming: false },
});

/**
 * The copy and retry cluster at the end of the meta row (owner 2026-10-28, B): hidden until the message is hovered or holds
 * focus, so a long transcript is not repeated actions under every agent turn; the orb and the summary stay. Always shown on
 * devices without hover. Hidden by opacity, so the buttons stay in the tab order and focusing one reveals the cluster.
 */
export const messageActionsVariants = cva(
  'ml-auto flex items-center gap-2 opacity-0 transition-control group-hover/message:opacity-100 group-focus-within/message:opacity-100 [@media(hover:none)]:opacity-100',
);
