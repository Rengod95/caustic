import { cva } from 'class-variance-authority';

// Timeline (round 3 merge of checkpoint-timeline, revision-history and list-activity). One vertical spine with one entry per
// row, newest first. Each entry takes one of three layouts, picked by what it shows (every look of the folded components):
// - node: a node dot, title and detail, a trailing time or the item Restore (was CheckpointTimeline);
// - row: selectionMode="single" turns the entries into chosen-rows of a listbox on a ring-dot spine (was RevisionHistory);
// - marker: an entry with a marker (Avatar) or an icon disc reads as a feed sentence with an optional quote (was ListActivity).
// tone and variant land on the slot that carries each layout's emphasis (the selected node, the rows, the icon disc); unset
// keeps that layout's own default. The defaults of the root cva at the end of this file are the spec defaults.

/* ── row layout (selectionMode="single") ───────────────────────────────────────────────────────────────────────────── */

// Rows keep a 2px gap (owner 2026-10-28) so a chosen or hovered row never touches its neighbour; the spine bridges it.
export const timelineRowListVariants = cva('gap-0.5');

// variant is the row emphasis: ghost = no fill until hover (default here); soft = tone soft rows; outline = a 1px tone border
// edge; solid = raised control rows with the control edge. The chosen entry always inverts (selected utility).
export const timelineRowVariants = cva(
  [
    'transition-control press group relative grid w-full cursor-pointer grid-cols-[calc(var(--spacing)*5.5)_1fr_auto_var(--cs-icon-sm)] items-center gap-2 rounded-md px-2 text-left font-ui text-text-primary outline-none',
    'focus-visible:shadow-focus aria-selected:focus-visible:shadow-focus',
    // The chosen entry inverts (selected utility: ink fill, paper text, no edge; detail, time, check and the node invert with
    // it); hover on it is selection.fill-hover. Focus keeps only its ring, whose gap reads the fill.
    'aria-selected:selected aria-selected:hover:bg-selection-fill-hover',
  ],
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      // rise: as timelineMarkerItemVariants (rows of the first paint stay still).
      rise: { true: 'animate-rise', false: '' },
      variant: {
        solid: 'bg-control-raised shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)] hover:bg-control-raised-hover aria-selected:shadow-none',
        soft: '',
        outline: 'hover:bg-neutral-hover aria-selected:shadow-none',
        ghost: 'hover:bg-neutral-hover',
      },
      // A little block padding (owner 2026-10-28) so the two text lines do not touch the row edge: md 40 → 44.
      size: { xs: 'min-h-control-sm py-0.5', sm: 'min-h-control-md py-1', md: 'min-h-control-lg py-1', lg: 'min-h-control-xl py-1.5' },
    },
    compoundVariants: [
      { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft hover:bg-neutral-soft-hover' },
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft hover:bg-accent-soft-hover' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft hover:bg-success-soft-hover' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft hover:bg-warning-soft-hover' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft hover:bg-danger-soft-hover' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft hover:bg-info-soft-hover' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-soft hover:bg-agent-soft-hover' },
      { variant: 'outline', tone: 'neutral', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
      { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
      { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
      { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
      { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
      { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
      { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'ghost', size: 'md', rise: true },
  },
);

/** The spine of a row: 1px border.strong through the node centre (8px inset + half the 22px cell), 1px past each row edge to
 *  bridge the row gap; the first row starts at its middle and the last ends at its middle (proposal C: a firmer line). */
export const timelineRowSpineVariants = cva('absolute -top-px -bottom-px left-[calc(var(--spacing)*4.75)] w-px -translate-x-1/2 bg-border-strong group-first:top-1/2 group-last:bottom-1/2');

export const timelineRowNodeVariants = cva('grid h-full place-items-center');

/** The row dot: a ring dot; agent entries show the spectrum dot; the chosen entry is a paper (selection.on) dot on the inverted row (it wins). */
export const timelineRowDotVariants = cva('relative size-2.5 rounded-full transition-[background-color,box-shadow] duration-quick ease-standard', {
  variants: {
    author: { human: '', agent: 'spectrum-fill', system: '' },
    selected: { true: 'bg-selection-on shadow-[inset_0_0_0_2px_var(--cs-color-selection-on)]', false: '' },
    running: { true: '', false: 'animate-none' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
  },
  compoundVariants: [
    { tone: 'neutral', author: ['human', 'system'], selected: false, className: 'bg-surface-base shadow-[inset_0_0_0_2px_var(--cs-color-neutral-graphic)]' },
    { tone: 'accent', author: ['human', 'system'], selected: false, className: 'bg-surface-base shadow-[inset_0_0_0_2px_var(--cs-color-accent-graphic)]' },
    { tone: 'success', author: ['human', 'system'], selected: false, className: 'bg-surface-base shadow-[inset_0_0_0_2px_var(--cs-color-success-graphic)]' },
    { tone: 'warning', author: ['human', 'system'], selected: false, className: 'bg-surface-base shadow-[inset_0_0_0_2px_var(--cs-color-warning-graphic)]' },
    { tone: 'danger', author: ['human', 'system'], selected: false, className: 'bg-surface-base shadow-[inset_0_0_0_2px_var(--cs-color-danger-graphic)]' },
    { tone: 'info', author: ['human', 'system'], selected: false, className: 'bg-surface-base shadow-[inset_0_0_0_2px_var(--cs-color-info-graphic)]' },
    { tone: 'agent', author: ['human', 'system'], selected: false, className: 'bg-surface-base shadow-[inset_0_0_0_2px_var(--cs-color-agent-graphic)]' },
  ],
  defaultVariants: { author: 'human', selected: false, running: false, tone: 'neutral' },
});

export const timelineRowTitleVariants = cva('block truncate font-ui font-medium text-text-primary', {
  variants: { size: { xs: 'text-ui-xs', sm: 'text-ui-dense', md: 'text-ui-dense', lg: 'text-ui' } },
  defaultVariants: { size: 'md' },
});
export const timelineRowDetailVariants = cva('block font-ui text-ui-xs font-normal text-text-tertiary transition-colors duration-quick ease-standard group-aria-selected:text-text-secondary');
export const timelineRowTimeVariants = cva('font-ui text-ui-xs font-normal text-text-tertiary tabular-nums transition-colors duration-quick ease-standard group-aria-selected:text-text-secondary');
/** Trailing check cell: kept on every row so the times align; the check shows on the chosen entry in primary text (selection.on on the inverted row). */
export const timelineCheckVariants = cva('inline-grid size-icon-sm shrink-0 place-items-center text-text-primary [&_svg]:size-full [&_svg]:stroke-[2]');

/* ── marker layout (an Avatar or an icon disc) ─────────────────────────────────────────────────────────────────────── */

/** A feed entry: the marker column and the content column, 16px bottom padding. size steps the marker column (md = 32px). */
// rise: an entry that appears after the list has painted rises in; the entries of the first paint do not (no shimmer on load).
export const timelineMarkerItemVariants = cva('group relative grid gap-3 pb-4', {
  variants: {
    rise: { true: 'animate-rise', false: '' },
    size: {
      xs: 'grid-cols-[calc(var(--spacing)*6)_1fr]',
      sm: 'grid-cols-[calc(var(--spacing)*7)_1fr]',
      md: 'grid-cols-[calc(var(--spacing)*8)_1fr]',
      lg: 'grid-cols-[calc(var(--spacing)*10)_1fr]',
    },
  },
  defaultVariants: { rise: true, size: 'md' },
});

/** The spine of a feed entry: 1px border.default centred under the marker, from 2px below it to 2px above the entry end; hidden on the last entry. */
export const timelineMarkerSpineVariants = cva('absolute bottom-0.5 w-[1px] bg-border-default group-last:hidden', {
  variants: {
    size: {
      xs: 'left-[calc(var(--spacing)*2.875)] top-[calc(var(--spacing)*6.5)]',
      sm: 'left-[calc(var(--spacing)*3.375)] top-[calc(var(--spacing)*7.5)]',
      md: 'left-[calc(var(--spacing)*3.875)] top-[calc(var(--spacing)*8.5)]',
      lg: 'left-[calc(var(--spacing)*4.875)] top-[calc(var(--spacing)*10.5)]',
    },
  },
  defaultVariants: { size: 'md' },
});

export const timelineMarkerVariants = cva('inline-grid place-items-center rounded-full', {
  variants: { size: { xs: 'size-control-xs', sm: 'size-control-sm', md: 'size-control-md', lg: 'size-control-lg' } },
  defaultVariants: { size: 'md' },
});

/**
 * Icon disc of a system event. The variant is its emphasis and the tone its colour family: soft neutral (default here) is the
 * neutral track with a secondary glyph; hued soft = soft 3 with the tone text; solid = solid 9 with the on glyph (neutral:
 * ink); outline = border 6 edge and tone glyph; ghost = the tone glyph alone.
 */
export const timelineIconVariants = cva('grid place-items-center rounded-full', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: {
      solid: 'bg-ink-solid text-ink-on',
      soft: 'bg-neutral-track text-text-secondary',
      outline: 'bg-transparent text-text-secondary shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]',
      ghost: 'bg-transparent text-text-secondary',
    },
    size: {
      xs: 'size-control-xs [&>svg]:size-icon-sm',
      sm: 'size-control-sm [&>svg]:size-icon-sm',
      md: 'size-control-md [&>svg]:size-icon-md',
      lg: 'size-control-lg [&>svg]:size-icon-lg',
    },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on' },
    { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on' },
    { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft text-accent-text' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft text-success-text' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft text-warning-text' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft text-danger-text' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft text-info-text' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft text-agent-text' },
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
  defaultVariants: { tone: 'neutral', variant: 'soft', size: 'md' },
});

/** Content column of a feed entry; the top padding centres the first line on the marker. */
export const timelineMarkerBodyVariants = cva('min-w-0 pb-[1px] font-ui text-text-secondary', {
  variants: {
    size: { xs: 'pt-0.5 text-ui-dense-relaxed', sm: 'pt-1 text-ui-dense-relaxed', md: 'pt-1.5 text-ui-relaxed', lg: 'pt-2.5 text-ui-md-relaxed' },
  },
  defaultVariants: { size: 'md' },
});

export const timelineStrongVariants = cva('font-medium text-text-primary');

/** A quoted comment (owner 2026-10-28, B): the hairline card with a 2px border.strong rule inside its start edge, so it reads
 *  as quoted words, not a plain card. The rule is an inset shadow (no layout shift) and flips with the direction. */
export const timelineQuoteVariants = cva([
  'mt-2 rounded-xl bg-surface-translucent px-3 py-2.5 font-ui text-ui-dense-relaxed text-text-primary',
  'shadow-[inset_2px_0_0_var(--cs-color-border-strong),0_0_0_1px_var(--cs-color-border-subtle)]',
  'rtl:shadow-[inset_-2px_0_0_var(--cs-color-border-strong),0_0_0_1px_var(--cs-color-border-subtle)]',
]);

/** The time of a feed entry: on its own line under the sentence or the quote. */
export const timelineMarkerTimeVariants = cva('mt-0.5 block font-ui text-hint text-text-tertiary');

/* ── footer (restore="footer") ─────────────────────────────────────────────────────────────────────────────────────── */

export const timelineFooterVariants = cva('flex items-center justify-between gap-2');
export const timelineNoteVariants = cva('text-hint text-text-tertiary');

/* ── node layout (default) ─────────────────────────────────────────────────────────────────────────────────────────── */

/** One entry: grid node / 1fr / auto (node 18px at md). The spine is its own span; the 14px row spacing sits on the body so the item has no padding. */
export const timelineItemVariants = cva('group relative grid grid-cols-[var(--cs-size-check)_1fr_auto] items-start gap-2.5', {
  variants: {
    rise: { true: 'animate-rise', false: '' },
    size: {
      xs: 'grid-cols-[calc(var(--spacing)*3.5)_1fr_auto]',
      sm: 'grid-cols-[calc(var(--spacing)*4)_1fr_auto]',
      md: '',
      lg: 'grid-cols-[calc(var(--spacing)*5)_1fr_auto]',
    },
  },
  defaultVariants: { rise: true, size: 'md' },
});

/** The spine: 1px line from below the node to the row bottom, centred under the node; hidden on the last entry. */
export const timelineSpineVariants = cva('absolute bottom-0 left-[calc(var(--spacing)*2.125)] top-check w-[1px] bg-divider-line group-last:hidden', {
  variants: {
    size: {
      xs: 'top-3.5 left-[calc(var(--spacing)*1.625)]',
      sm: 'top-4 left-[calc(var(--spacing)*1.875)]',
      md: '',
      lg: 'top-5 left-[calc(var(--spacing)*2.375)]',
    },
  },
  defaultVariants: { size: 'md' },
});

/** The node: an 18px cell that holds a solid dot. A resting node draws nothing itself (the dot is the mark); the selected node
 *  takes the tone around its dot (a 1.5px accent graphic ring by default). */
export const timelineNodeVariants = cva('grid size-check place-items-center rounded-full transition-[background-color,box-shadow] duration-quick ease-standard', {
  variants: {
    selected: { true: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-graphic)]', false: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { outline: '', solid: '', soft: '', ghost: '' },
    size: { xs: 'size-3.5', sm: 'size-4', md: '', lg: 'size-5' },
  },
  compoundVariants: [
    { tone: 'neutral', variant: 'outline', selected: true, class: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-neutral-graphic)]' },
    { tone: 'success', variant: 'outline', selected: true, class: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-success-graphic)]' },
    { tone: 'warning', variant: 'outline', selected: true, class: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-warning-graphic)]' },
    { tone: 'danger', variant: 'outline', selected: true, class: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-graphic)]' },
    { tone: 'info', variant: 'outline', selected: true, class: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-info-graphic)]' },
    { tone: 'agent', variant: 'outline', selected: true, class: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-agent-graphic)]' },
    { tone: 'neutral', variant: 'solid', selected: true, class: 'bg-neutral-solid shadow-none' },
    { tone: 'accent', variant: 'solid', selected: true, class: 'bg-accent-solid shadow-none' },
    { tone: 'success', variant: 'solid', selected: true, class: 'bg-success-solid shadow-none' },
    { tone: 'warning', variant: 'solid', selected: true, class: 'bg-warning-solid shadow-none' },
    { tone: 'danger', variant: 'solid', selected: true, class: 'bg-danger-solid shadow-none' },
    { tone: 'info', variant: 'solid', selected: true, class: 'bg-info-solid shadow-none' },
    { tone: 'agent', variant: 'solid', selected: true, class: 'bg-agent-solid shadow-none' },
    { tone: 'neutral', variant: 'soft', selected: true, class: 'bg-neutral-soft shadow-none' },
    { tone: 'accent', variant: 'soft', selected: true, class: 'bg-accent-soft shadow-none' },
    { tone: 'success', variant: 'soft', selected: true, class: 'bg-success-soft shadow-none' },
    { tone: 'warning', variant: 'soft', selected: true, class: 'bg-warning-soft shadow-none' },
    { tone: 'danger', variant: 'soft', selected: true, class: 'bg-danger-soft shadow-none' },
    { tone: 'info', variant: 'soft', selected: true, class: 'bg-info-soft shadow-none' },
    { tone: 'agent', variant: 'soft', selected: true, class: 'bg-agent-soft shadow-none' },
    { variant: 'ghost', selected: true, class: 'shadow-none' },
  ],
  defaultVariants: { selected: false, tone: 'accent', variant: 'outline', size: 'md' },
});

/** The node dot (redesigned in round 1): a solid disc. Resting: 8px neutral.graphic. Agent: a 10px spectrum disc, rotating
 *  only while it is running. Selected (wins over agent): a 10px tone solid disc; on the solid node it shrinks to a 6px
 *  on-colour dot. xs and sm step the discs down with the node. */
export const timelineDotVariants = cva('size-2 rounded-full transition-[width,height,background-color] duration-quick ease-standard', {
  variants: {
    author: { human: '', agent: 'size-2.5 spectrum-fill', system: '' },
    selected: { true: 'size-2.5 bg-accent-solid', false: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
    running: { true: '', false: 'animate-none' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { outline: '', solid: '', soft: '', ghost: '' },
  },
  compoundVariants: [
    { author: ['human', 'system'], selected: false, class: 'bg-neutral-graphic' },
    { tone: 'neutral', variant: ['outline', 'soft', 'ghost'], selected: true, class: 'bg-neutral-solid' },
    { tone: 'success', variant: ['outline', 'soft', 'ghost'], selected: true, class: 'bg-success-solid' },
    { tone: 'warning', variant: ['outline', 'soft', 'ghost'], selected: true, class: 'bg-warning-solid' },
    { tone: 'danger', variant: ['outline', 'soft', 'ghost'], selected: true, class: 'bg-danger-solid' },
    { tone: 'info', variant: ['outline', 'soft', 'ghost'], selected: true, class: 'bg-info-solid' },
    { tone: 'agent', variant: ['outline', 'soft', 'ghost'], selected: true, class: 'bg-agent-solid' },
    { variant: 'solid', selected: true, class: 'size-1.5' },
    { tone: 'neutral', variant: 'solid', selected: true, class: 'bg-neutral-on' },
    { tone: 'accent', variant: 'solid', selected: true, class: 'bg-accent-on' },
    { tone: 'success', variant: 'solid', selected: true, class: 'bg-success-on' },
    { tone: 'warning', variant: 'solid', selected: true, class: 'bg-warning-on' },
    { tone: 'danger', variant: 'solid', selected: true, class: 'bg-danger-on' },
    { tone: 'info', variant: 'solid', selected: true, class: 'bg-info-on' },
    { tone: 'agent', variant: 'solid', selected: true, class: 'bg-agent-on' },
    { size: ['xs', 'sm'], class: 'size-1.5' },
    { size: ['xs', 'sm'], selected: true, class: 'size-2' },
    { size: ['xs', 'sm'], author: 'agent', class: 'size-2' },
    { size: ['xs', 'sm'], variant: 'solid', selected: true, class: 'size-1' },
    { size: 'lg', selected: true, variant: ['outline', 'soft', 'ghost'], class: 'size-3' },
  ],
  defaultVariants: { author: 'human', selected: false, running: false, tone: 'accent', variant: 'outline', size: 'md' },
});

export const timelineBodyVariants = cva('min-w-0 pb-3.5');

export const timelineTitleVariants = cva('block font-ui font-medium text-text-primary', {
  variants: { size: { xs: 'text-ui-xs', sm: 'text-ui-sm', md: 'text-ui-dense', lg: 'text-ui' } },
  defaultVariants: { size: 'md' },
});

export const timelineDetailVariants = cva('block font-ui text-text-tertiary', {
  variants: { size: { xs: 'text-micro', sm: 'text-hint', md: 'text-hint', lg: 'text-ui-sm' } },
  defaultVariants: { size: 'md' },
});

export const timelineTimeVariants = cva('font-ui text-text-tertiary', {
  variants: { size: { xs: 'text-micro', sm: 'text-hint', md: 'text-hint', lg: 'text-ui-sm' } },
  defaultVariants: { size: 'md' },
});

/** The item restore confirm step: spans the body and action columns under the row, on the inset fill. */
// The confirm step keeps its place for the exit (data-state closed) before the list removes it.
export const timelineConfirmVariants = cva('animate-rise data-[state=closed]:animate-exit col-span-2 col-start-2 mb-3.5 grid gap-2 rounded-lg bg-bg-inset px-2.5 py-2');

/* ── root (last, so its defaults are the spec defaults) ────────────────────────────────────────────────────────────── */

/** The list: no gap in the node and marker layouts (entries carry their own bottom padding); the row layout adds its 2px gap. */
export const timelineListVariants = cva('m-0 grid list-none gap-0 p-0');

/** The root: the list, then the footer (14px apart). radius / shadow shape the root (unset: no frame, the spine is the
 *  structure); tone, variant and size are read by every entry. */
export const timelineVariants = cva('grid gap-3.5', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { outline: '', solid: '', soft: '', ghost: '' },
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  defaultVariants: { tone: 'accent', variant: 'outline', radius: 'none', shadow: 'none', size: 'md' },
});
