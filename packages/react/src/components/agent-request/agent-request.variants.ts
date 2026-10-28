import { cva, type VariantProps } from 'class-variance-authority';

/*
 * AgentRequest (round 3 merge, owner 2026-10-28, proposal A) folds Proposal, ReviewRequest and PermissionRequest. The
 * root renders on Card: variant agent (spectrum rim) for a pending proposal or review in the agent tone, variant plain
 * otherwise. The classes below are merged after Card's skin (cn, last wins), so each kind keeps the look its former
 * component had (rounds 1–3). Common props (owner 2026-10-26): unset = the kind's own default.
 */

/**
 * kind proposal (was Proposal): an unapplied agent result on Card agent (the spectrum rim) at elevation 2, xl radius.
 * The sections carry their own padding, so Card's inset, gap and header wash are cleared. tone is the edge family (agent
 * = the rim; any other tone = a 1px tone border drawn as an inset outline); variant is the emphasis (solid surface.base,
 * soft the tone soft fill, outline no fill and the edge, ghost no fill, edge or elevation).
 */
export const agentRequestProposalVariants = cva('relative block gap-0 overflow-hidden rounded-xl bg-none p-0 text-text-primary shadow-2', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: 'bg-surface-base', soft: '', outline: 'bg-transparent', ghost: 'bg-transparent shadow-none' },
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
    shadow: { none: 'shadow-none', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { variant: ['solid', 'outline'], tone: 'neutral', className: 'outline outline-1 -outline-offset-1 outline-neutral-border' },
    { variant: ['solid', 'outline'], tone: 'accent', className: 'outline outline-1 -outline-offset-1 outline-accent-border' },
    { variant: ['solid', 'outline'], tone: 'success', className: 'outline outline-1 -outline-offset-1 outline-success-border' },
    { variant: ['solid', 'outline'], tone: 'warning', className: 'outline outline-1 -outline-offset-1 outline-warning-border' },
    { variant: ['solid', 'outline'], tone: 'danger', className: 'outline outline-1 -outline-offset-1 outline-danger-border' },
    { variant: ['solid', 'outline'], tone: 'info', className: 'outline outline-1 -outline-offset-1 outline-info-border' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
  ],
  defaultVariants: { tone: 'agent', variant: 'solid', radius: 'xl', shadow: '2', size: 'md' },
});

/**
 * kind review (was ReviewRequest): a non-modal floating panel of thick material (solid fill, no blur), 3xl radius,
 * elevation 4, on Card agent while pending. The material is re-stated as the background colour so it wins over the
 * agent skin's surface.base. variant: solid = thick material; soft = the tone soft fill as the material; outline = thick
 * material plus a 1px tone border edge; ghost = thick material without elevation. size steps padding and gap.
 */
export const agentRequestReviewVariants = cva('glass grid rounded-3xl bg-none bg-[var(--cs-material)] text-text-primary shadow-4', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: 'glass-thick', soft: '', outline: 'glass-thick', ghost: 'glass-thick shadow-none' },
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
    shadow: { none: 'shadow-none', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: 'gap-2 p-2.5', sm: 'gap-2.5 px-inset-compact-x py-inset-compact-y', md: 'gap-3 px-inset-regular-x py-inset-regular-y', lg: 'gap-4 p-5' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'accent', className: 'outline outline-1 -outline-offset-1 outline-accent-border' },
    { variant: 'solid', tone: 'success', className: 'outline outline-1 -outline-offset-1 outline-success-border' },
    { variant: 'solid', tone: 'warning', className: 'outline outline-1 -outline-offset-1 outline-warning-border' },
    { variant: 'solid', tone: 'danger', className: 'outline outline-1 -outline-offset-1 outline-danger-border' },
    { variant: 'solid', tone: 'info', className: 'outline outline-1 -outline-offset-1 outline-info-border' },
    { variant: 'outline', tone: 'neutral', className: 'outline outline-1 -outline-offset-1 outline-neutral-border' },
    { variant: 'outline', tone: 'accent', className: 'outline outline-1 -outline-offset-1 outline-accent-border' },
    { variant: 'outline', tone: 'success', className: 'outline outline-1 -outline-offset-1 outline-success-border' },
    { variant: 'outline', tone: 'warning', className: 'outline outline-1 -outline-offset-1 outline-warning-border' },
    { variant: 'outline', tone: 'danger', className: 'outline outline-1 -outline-offset-1 outline-danger-border' },
    { variant: 'outline', tone: 'info', className: 'outline outline-1 -outline-offset-1 outline-info-border' },
    { variant: 'soft', tone: 'neutral', className: '[--cs-material:var(--cs-color-neutral-soft)]' },
    { variant: 'soft', tone: 'accent', className: '[--cs-material:var(--cs-color-accent-soft)]' },
    { variant: 'soft', tone: 'success', className: '[--cs-material:var(--cs-color-success-soft)]' },
    { variant: 'soft', tone: 'warning', className: '[--cs-material:var(--cs-color-warning-soft)]' },
    { variant: 'soft', tone: 'danger', className: '[--cs-material:var(--cs-color-danger-soft)]' },
    { variant: 'soft', tone: 'info', className: '[--cs-material:var(--cs-color-info-soft)]' },
    { variant: 'soft', tone: 'agent', className: '[--cs-material:var(--cs-color-agent-soft)]' },
  ],
  defaultVariants: { tone: 'agent', variant: 'solid', radius: '3xl', shadow: '4', size: 'md' },
});

/**
 * Pending glow (owner 2026-10-28): while a review waits for an answer the panel wears the agent spectrum rim and a soft
 * agent glow all around its edge, on top of elevation 4.
 */
export const agentRequestPendingGlow = 'shadow-[var(--cs-elevation-4),0_0_var(--cs-space-5)_var(--cs-color-agent-glow)]';

/**
 * kind permission (was PermissionRequest), and the one-line record every kind collapses to once answered.
 * Pending: surface.base, elevation 2, 2xl radius. The record (answered, allowed, denied): surface.raised with a 1px
 * inset border.subtle hairline and no elevation. variant soft = the tone soft 3, outline = no fill and the tone border 6
 * edge, ghost = no fill, edge or elevation. size steps the inset and gap: xs 8 / 6 · sm 10 / 8 · md compact / 10 · lg 16 / 12.
 */
export const agentRequestCardVariants = cva('grid min-w-0 max-w-full gap-0 rounded-2xl bg-none text-text-primary', {
  variants: {
    status: {
      pending: 'bg-surface-base',
      answered: 'bg-surface-raised shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
      allowed: 'bg-surface-raised shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
      denied: 'bg-surface-raised shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
    },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: 'bg-transparent shadow-none' },
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: 'rounded-xl', '2xl': '', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: 'gap-1.5 p-2', sm: 'gap-2 p-2.5', md: 'gap-2.5 px-inset-compact-x py-inset-compact-y', lg: 'gap-3 p-4' },
  },
  compoundVariants: [
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
    { variant: 'outline', tone: 'neutral', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
  ],
  defaultVariants: { status: 'pending', tone: 'warning', variant: 'solid', radius: '2xl', shadow: '2', size: 'md' },
});

/**
 * Header row. proposal: the padded band (size steps the padding and the header type), orb, quiet lead-in, badge.
 * review: orb and the title block, 10px gap. permission: the 36px tile and the text stack, 12px gap. The record is one
 * quiet line: a small tile, 8px gap.
 */
export const agentRequestHeaderVariants = cva('flex min-w-0 items-center', {
  variants: {
    kind: { proposal: 'gap-2 font-semibold text-text-primary', review: 'gap-2.5', permission: 'gap-3' },
    record: { true: 'gap-2', false: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { kind: 'proposal', record: false, size: 'xs', className: 'px-2 py-1.5 text-ui-xs' },
    { kind: 'proposal', record: false, size: 'sm', className: 'px-2.5 py-2 text-footnote' },
    { kind: 'proposal', record: false, size: 'md', className: 'px-3 py-2.5 text-ui-dense' },
    { kind: 'proposal', record: false, size: 'lg', className: 'px-4 py-3 text-ui' },
  ],
  defaultVariants: { kind: 'proposal', record: false, size: 'md' },
});

/** The spectrum orb, the agent cue of a pending proposal (icon-md 16, the hole at the orb's 14 / 3.4 ratio) or review (orb-md 22 / 7). */
export const agentRequestOrbVariants = cva('orb flex-none', {
  variants: {
    kind: {
      proposal: '[--orb:var(--cs-icon-md)] [--orb-hole:calc(var(--cs-icon-md)*0.24)]',
      review: '[--orb:var(--cs-size-orb-md)] [--orb-hole:var(--cs-size-orb-md-hole)]',
      permission: '',
    },
  },
  defaultVariants: { kind: 'proposal' },
});

/**
 * The status tile: the tone's soft 3 with its text; neutral is the track. Pending permission: the 36px card tile; the
 * record: an icon-lg (20px) tile with an icon-xs glyph, so it stays one line.
 */
export const agentRequestIconVariants = cva('grid shrink-0 place-items-center', {
  variants: {
    tone: {
      neutral: 'bg-neutral-track text-text-secondary',
      accent: 'bg-accent-soft text-accent-text',
      success: 'bg-success-soft text-success-text',
      warning: 'bg-warning-soft text-warning-text',
      danger: 'bg-danger-soft text-danger-text',
      info: 'bg-info-soft text-info-text',
      agent: 'bg-agent-soft text-agent-text',
    },
    record: {
      false: 'size-card-tile rounded-lg [&_svg]:size-card-glyph',
      true: 'size-icon-lg rounded-sm [&_svg]:size-icon-xs',
    },
  },
  defaultVariants: { tone: 'warning', record: false },
});

/** Title and subtitle: a stack, or (the record) one line, title then detail, truncating. */
export const agentRequestHeadingVariants = cva('min-w-0', {
  variants: { record: { false: '', true: 'flex flex-1 items-baseline gap-1.5 whitespace-nowrap' } },
  defaultVariants: { record: false },
});

/**
 * Title. proposal: the quiet lead-in ("Proposal · …" in text.secondary, the header's weight and type) so the serif
 * prose leads. review: the count title, tabular, stepped by size. permission: ui-strong semibold. record: ui-strong medium.
 */
export const agentRequestTitleVariants = cva('min-w-0', {
  variants: {
    kind: { proposal: 'text-text-secondary', review: 'text-text-primary tabular-nums', permission: 'text-ui-strong font-semibold text-text-primary' },
    record: { false: '', true: 'shrink-0 text-ui-strong font-medium text-text-primary' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { kind: 'review', record: false, size: 'xs', className: 'text-ui-strong' },
    { kind: 'review', record: false, size: 'sm', className: 'text-title-4' },
    { kind: 'review', record: false, size: 'md', className: 'text-title-3' },
    { kind: 'review', record: false, size: 'lg', className: 'text-title-2' },
  ],
  defaultVariants: { kind: 'proposal', record: false, size: 'md' },
});

/** Subtitle: the line under the title (review source line, permission consequence), or the record detail on the title line. */
export const agentRequestSubtitleVariants = cva('font-normal', {
  variants: {
    kind: { proposal: 'text-footnote text-text-tertiary', review: 'text-footnote text-text-tertiary', permission: 'mt-0.5 text-ui-sm text-text-secondary' },
    record: { false: '', true: 'mt-0 min-w-0 truncate text-ui-sm text-text-tertiary' },
  },
  defaultVariants: { kind: 'proposal', record: false },
});

/**
 * Body (free children). proposal: the padded section, 12px gap prose to chips, 4px more under the header. review: the
 * panel's own gap. permission: a stack of secondary ui-sm text.
 */
export const agentRequestBodyVariants = cva('grid min-w-0', {
  variants: {
    kind: { proposal: '', review: '', permission: 'text-ui-sm text-text-secondary' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { kind: 'proposal', size: 'xs', className: 'gap-2 px-2 pt-0.5 pb-1.5' },
    { kind: 'proposal', size: 'sm', className: 'gap-2.5 px-2.5 pt-1 pb-2' },
    { kind: 'proposal', size: 'md', className: 'gap-3 px-3 pt-1 pb-2.5' },
    { kind: 'proposal', size: 'lg', className: 'gap-3.5 px-4 pt-1.5 pb-3' },
    { kind: 'review', size: 'xs', className: 'gap-2' },
    { kind: 'review', size: 'sm', className: 'gap-2.5' },
    { kind: 'review', size: 'md', className: 'gap-3' },
    { kind: 'review', size: 'lg', className: 'gap-4' },
    { kind: 'permission', size: 'xs', className: 'gap-1.5' },
    { kind: 'permission', size: 'sm', className: 'gap-2' },
    { kind: 'permission', size: 'md', className: 'gap-2.5' },
    { kind: 'permission', size: 'lg', className: 'gap-3' },
  ],
  defaultVariants: { kind: 'proposal', size: 'md' },
});

/** AgentRequestProse: what the agent will do, in the voice serif. */
export const agentRequestProseVariants = cva('m-0 font-voice text-voice-sm text-text-primary');
/** AgentRequestSummary: the chip row (footprint or toned summary), wrapping, 8px gap. */
export const agentRequestSummaryVariants = cva('flex flex-wrap gap-2');
/** AgentRequestCount: tabular figures, a 2-digit minimum width, left-aligned, so 9 → 10 does not move the words. */
export const agentRequestCountVariants = cva('inline-block min-w-[2ch] text-left tabular-nums');

/**
 * Footer (the actions). proposal: the band, buttons centred between the 1px top border and the bottom edge; under the
 * spectrum rim (which covers the bottom 1.5px) the bottom padding takes 2px more so the visible space matches the top.
 * review: end-aligned, 8px gap. permission: 6px gap and a 6px top margin (16px from the header at md: the footer is
 * optional, so it stands apart).
 */
export const agentRequestFooterVariants = cva('flex flex-wrap items-center', {
  variants: {
    kind: {
      proposal: 'gap-1.5 border-t border-border-subtle bg-surface-raised',
      review: 'justify-end gap-2',
      permission: 'mt-1.5 gap-1.5',
    },
    rim: { true: '', false: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { kind: 'proposal', size: 'xs', className: 'px-2 py-1.5' },
    { kind: 'proposal', size: 'sm', className: 'px-2.5 py-2' },
    { kind: 'proposal', size: 'md', className: 'px-3 py-2.5' },
    { kind: 'proposal', size: 'lg', className: 'px-4 py-3' },
    { kind: 'proposal', rim: true, size: 'xs', className: 'pb-2' },
    { kind: 'proposal', rim: true, size: 'sm', className: 'pb-2.5' },
    { kind: 'proposal', rim: true, size: 'md', className: 'pb-3' },
    { kind: 'proposal', rim: true, size: 'lg', className: 'pb-3.5' },
  ],
  defaultVariants: { kind: 'proposal', rim: false, size: 'md' },
});

/** Footer button size per kind and card size: permission always xs; otherwise xs and sm cards xs, md sm (28px), lg md. */
export const agentRequestButtonSize = {
  proposal: { xs: 'xs', sm: 'xs', md: 'sm', lg: 'md' },
  review: { xs: 'xs', sm: 'xs', md: 'sm', lg: 'md' },
  permission: { xs: 'xs', sm: 'xs', md: 'xs', lg: 'xs' },
} as const;

export type AgentRequestKind = NonNullable<VariantProps<typeof agentRequestHeaderVariants>['kind']>;
export type AgentRequestStatus = NonNullable<VariantProps<typeof agentRequestCardVariants>['status']>;
