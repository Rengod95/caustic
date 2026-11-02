import { cva, type VariantProps } from 'class-variance-authority';

/** Outer wrapper: stacks an outside heading, lists and a footer note. */
export const listGroupVariants = cva('grid w-full gap-1.5');

/** Caption above a list, outside the surface. */
export const listGroupHeadingVariants = cva('px-3.5 font-ui text-caption uppercase text-text-tertiary');

/** Note below a list, outside the surface. */
export const listGroupFooterVariants = cva('px-3.5 pb-0.25 font-ui text-footnote text-text-tertiary');

/**
 * The inline surface: one depth cue, the 1px inset hairline (no elevation). Never glass (P1).
 * variant (owner 2026-10-28, round 3): grouped (default) is the translucent inset-grouped surface; solid is the common-prop
 * name of the same surface. opaque is the inspector collection (the former AppendList): surface.base, compact rows, a
 * semibold heading, rows with a full-width top edge and an add row; a hue fills it with the tone soft 3. soft = the tone's
 * soft 3 fill, no edge; outline = no fill, the tone's border 6 edge; ghost = no fill or edge. On grouped / solid a hue
 * draws the edge in its border 6. radius / shadow replace the 2xl corner / add an elevation (an elevation replaces the
 * hairline: one depth cue). Unset keeps all of this.
 */
export const listVariants = cva(
  [
    // overflow clip (not hidden) clips the corners without making the list a scroll container, so the heading can stick
    // inside a scrolling parent. --list-edge is the hairline colour, redrawn by the heading band over its own fill.
    'group/list w-full overflow-clip rounded-2xl bg-surface-translucent font-ui text-ui text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] [--list-edge:var(--cs-color-border-subtle)]',
    // One separator column (owner 2026-10-27): every separator starts at 14 + the widest leading element + 12, so a mixed list
    // draws one clean column of hairlines. Each leading kind present publishes its width; the rows take the max.
    'has-[[data-lead=tile]]:[--li-max-tile:var(--cs-size-list-tile)] has-[[data-lead=avatar]]:[--li-max-avatar:var(--cs-size-avatar-lg)]',
    'has-[[data-lead=thumb]]:[--li-max-thumb:calc(var(--spacing)*16)] has-[[data-lead=check]]:[--li-max-check:var(--cs-size-check)]',
    // Reorder rows: the grip (16), or the grip, a 12 gap and the 22px position badge (50) when numbered.
    'has-[[data-lead=grip]]:[--li-max-grip:var(--cs-icon-md)] has-[[data-lead=grip-index]]:[--li-max-grip:calc(var(--spacing)*12.5)]',
    'has-[[data-lead=tile],[data-lead=avatar],[data-lead=thumb],[data-lead=check],[data-lead=grip],[data-lead=grip-index]]:[--li-sep-gap:calc(var(--spacing)*3)]',
  ],
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: { grouped: '', opaque: 'overflow-hidden bg-surface-base', solid: '', soft: '', outline: '', ghost: '' },
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': '', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: {
        none: '', '1': 'shadow-1 [--list-edge:transparent]', '2': 'shadow-2 [--list-edge:transparent]', '3': 'shadow-3 [--list-edge:transparent]',
        '4': 'shadow-4 [--list-edge:transparent]', '5': 'shadow-5 [--list-edge:transparent]',
      },
    },
    compoundVariants: [
      { variant: ['grouped', 'solid'], tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] [--list-edge:var(--cs-color-accent-border)]' },
      { variant: ['grouped', 'solid'], tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] [--list-edge:var(--cs-color-success-border)]' },
      { variant: ['grouped', 'solid'], tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] [--list-edge:var(--cs-color-warning-border)]' },
      { variant: ['grouped', 'solid'], tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] [--list-edge:var(--cs-color-danger-border)]' },
      { variant: ['grouped', 'solid'], tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] [--list-edge:var(--cs-color-info-border)]' },
      { variant: ['grouped', 'solid'], tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] [--list-edge:var(--cs-color-agent-border)]' },
      // opaque in a hue: the tone soft 3 with the hairline (the former AppendList solid × tone).
      { variant: 'opaque', tone: 'accent', className: 'bg-accent-soft' },
      { variant: 'opaque', tone: 'success', className: 'bg-success-soft' },
      { variant: 'opaque', tone: 'warning', className: 'bg-warning-soft' },
      { variant: 'opaque', tone: 'danger', className: 'bg-danger-soft' },
      { variant: 'opaque', tone: 'info', className: 'bg-info-soft' },
      { variant: 'opaque', tone: 'agent', className: 'bg-agent-soft' },
      { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft shadow-none [--list-edge:transparent]' },
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft shadow-none [--list-edge:transparent]' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft shadow-none [--list-edge:transparent]' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft shadow-none [--list-edge:transparent]' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft shadow-none [--list-edge:transparent]' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft shadow-none [--list-edge:transparent]' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-soft shadow-none [--list-edge:transparent]' },
      { variant: 'outline', tone: 'neutral', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)] [--list-edge:var(--cs-color-neutral-border)]' },
      { variant: 'outline', tone: 'accent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] [--list-edge:var(--cs-color-accent-border)]' },
      { variant: 'outline', tone: 'success', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] [--list-edge:var(--cs-color-success-border)]' },
      { variant: 'outline', tone: 'warning', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] [--list-edge:var(--cs-color-warning-border)]' },
      { variant: 'outline', tone: 'danger', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] [--list-edge:var(--cs-color-danger-border)]' },
      { variant: 'outline', tone: 'info', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] [--list-edge:var(--cs-color-info-border)]' },
      { variant: 'outline', tone: 'agent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] [--list-edge:var(--cs-color-agent-border)]' },
      { variant: 'ghost', tone: 'neutral', className: 'bg-transparent shadow-none [--list-edge:transparent]' },
      { variant: 'ghost', tone: 'accent', className: 'bg-transparent shadow-none [--list-edge:transparent]' },
      { variant: 'ghost', tone: 'success', className: 'bg-transparent shadow-none [--list-edge:transparent]' },
      { variant: 'ghost', tone: 'warning', className: 'bg-transparent shadow-none [--list-edge:transparent]' },
      { variant: 'ghost', tone: 'danger', className: 'bg-transparent shadow-none [--list-edge:transparent]' },
      { variant: 'ghost', tone: 'info', className: 'bg-transparent shadow-none [--list-edge:transparent]' },
      { variant: 'ghost', tone: 'agent', className: 'bg-transparent shadow-none [--list-edge:transparent]' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'grouped', radius: '2xl', shadow: 'none' },
  },
);

/** dividers={false}: no separator between rows (the top-edge pseudo-element, or the opaque border-top) and each row takes lg corners so its hover fill reads as a pill. */
export const listDividersVariants = cva('', {
  variants: { dividers: { true: '', false: '[&_[data-slot=list-row]]:rounded-lg [&_[data-slot=list-row]]:border-t-0 [&_[data-slot=list-row]]:before:hidden' } },
  defaultVariants: { dividers: true },
});

/** The opaque surface steps its type with the list size (md = ui-dense, the former AppendList). */
export const listOpaqueVariants = cva('', {
  variants: { size: { xs: 'text-ui-xs', sm: 'text-ui-sm', md: 'text-ui-dense', lg: 'text-ui' } },
  defaultVariants: { size: 'md' },
});

/**
 * Behaviour colours published on the root (owner 2026-10-26, kept through the merge). marks: the selection marks (box,
 * radio, tick); accent (tone unset) is the accent box and tick, which the inverted (checked) row re-points to selection.on;
 * neutral marks in the text colour (inverts with the row too); a hue keeps its solid box and text tick on the inverted row.
 * Disabled rows keep the disabled marks. grip: the held row's grip during a drag or keyboard pick-up (accent by default).
 */
export const listBehaviourVariants = cva('', {
  variants: {
    marks: {
      neutral: '[&_[data-slot=list-indicator][data-state=checked]:not([data-disabled])]:bg-text-primary [&_[data-slot=list-indicator][data-state=checked]:not([data-disabled])]:text-surface-base [&_[data-slot=list-tick]:not([data-disabled])]:text-text-primary',
      accent: '',
      success: '[&_[data-slot=list-indicator][data-state=checked]:not([data-disabled])]:bg-success-solid [&_[data-slot=list-indicator][data-state=checked]:not([data-disabled])]:text-success-on [&_[data-slot=list-tick]:not([data-disabled])]:text-success-text',
      warning: '[&_[data-slot=list-indicator][data-state=checked]:not([data-disabled])]:bg-warning-solid [&_[data-slot=list-indicator][data-state=checked]:not([data-disabled])]:text-warning-on [&_[data-slot=list-tick]:not([data-disabled])]:text-warning-text',
      danger: '[&_[data-slot=list-indicator][data-state=checked]:not([data-disabled])]:bg-danger-solid [&_[data-slot=list-indicator][data-state=checked]:not([data-disabled])]:text-danger-on [&_[data-slot=list-tick]:not([data-disabled])]:text-danger-text',
      info: '[&_[data-slot=list-indicator][data-state=checked]:not([data-disabled])]:bg-info-solid [&_[data-slot=list-indicator][data-state=checked]:not([data-disabled])]:text-info-on [&_[data-slot=list-tick]:not([data-disabled])]:text-info-text',
      agent: '[&_[data-slot=list-indicator][data-state=checked]:not([data-disabled])]:bg-agent-solid [&_[data-slot=list-indicator][data-state=checked]:not([data-disabled])]:text-agent-on [&_[data-slot=list-tick]:not([data-disabled])]:text-agent-text',
    },
    grip: {
      neutral: '[--li-grip:var(--cs-color-neutral-solid)]',
      accent: '',
      success: '[--li-grip:var(--cs-color-success-solid)]',
      warning: '[--li-grip:var(--cs-color-warning-solid)]',
      danger: '[--li-grip:var(--cs-color-danger-solid)]',
      info: '[--li-grip:var(--cs-color-info-solid)]',
      agent: '[--li-grip:var(--cs-color-agent-solid)]',
    },
  },
  defaultVariants: { marks: 'accent', grip: 'accent' },
});

/** Caption inside the surface. grouped: a sticky band (owner 2026-10-27) that keeps the list's own fill, a hairline below,
 *  and sticks to the top of a scrolling parent so long lists keep their context; it redraws the list edge on its top and
 *  sides (its fill would cover the inset hairline) and inherits the top corners. opaque: the collection title row (the
 *  former AppendList heading), semibold primary, no hairline (the first row draws its own top edge). band (headingBand,
 *  default off, owner 2026-10-28): the heading sits on a bg.inset strip so it reads apart from the first row. */
export const listHeadingVariants = cva('flex items-center justify-between font-ui', {
  variants: {
    surface: {
      grouped: [
        'sticky top-0 z-10 rounded-t-[inherit] bg-inherit px-3.5 pb-2 pt-3 text-caption uppercase text-text-tertiary',
        'shadow-[inset_0_-1px_0_var(--cs-color-border-subtle),inset_0_1px_0_var(--list-edge,transparent),inset_1px_0_0_var(--list-edge,transparent),inset_-1px_0_0_var(--list-edge,transparent)]',
      ],
      opaque: 'px-3 font-semibold text-text-primary',
    },
    size: { xs: '', sm: '', md: '', lg: '' },
    band: { true: 'rounded-t-[inherit] bg-bg-inset', false: '' },
  },
  compoundVariants: [
    { surface: 'opaque', size: 'xs', className: 'py-1.5 text-ui-xs' },
    { surface: 'opaque', size: 'sm', className: 'py-2 text-ui-sm' },
    { surface: 'opaque', size: 'md', className: 'py-2.5 text-ui-dense' },
    { surface: 'opaque', size: 'lg', className: 'py-3 text-ui' },
    // The opaque band's fill would cover the inset hairline: it redraws the edge on its top and sides.
    { surface: 'opaque', band: true, className: 'shadow-[inset_0_1px_0_var(--list-edge,transparent),inset_1px_0_0_var(--list-edge,transparent),inset_-1px_0_0_var(--list-edge,transparent)]' },
  ],
  defaultVariants: { surface: 'grouped', size: 'md', band: false },
});

/** The heading text; truncates so a long title never pushes the end content out. */
export const listHeadingTitleVariants = cva('min-w-0 truncate');

export const listHeadingEndVariants = cva('', {
  variants: { surface: { grouped: '', opaque: 'flex flex-none items-center' } },
  defaultVariants: { surface: 'grouped' },
});

/** The ul: list style removed, explicit role on the element. */
export const listItemsVariants = cva('m-0 list-none p-0');

/**
 * One row (the li). The separator is the top edge pseudo-element. Every separator of a list starts at the same inset: 14 +
 * the widest leading element of the list + 12 (the list publishes the widths, listVariants), or 14 when no row has one. A row
 * outside a List falls back to its own leading width. Selection (data-state checked): the row inverts with the selected
 * utility (owner 2026-10-26); hover while checked is selection.fill-hover; data-disabled drops it to disabled.fill and the
 * disabled text. The behaviour axes:
 * - reorder: grab cursor, no text selection, hover fill; it moves by --li-y. data-dragging lifts it like an object in the
 *   hand (owner 2026-10-28): surface.raised, elevation 3, 1.5% larger, lg corners, above its neighbours, no separator.
 *   data-follow (pointer drag) follows the pointer without a translate transition; the rows it passes slide (base duration)
 *   to open its slot. The root's data-settling frame drops the transitions so the slid rows take their committed place
 *   without moving twice. Reduced motion: base.css zeroes the transitions, so rows jump instead of sliding.
 * - actions hover: the row fills on hover (its tools fade in); swipe: the li clips the sliding body and the tray, and the
 *   separator paints above the opaque body.
 */
export const listRowVariants = cva(
  [
    'group/row relative text-ui text-text-primary',
    'before:absolute before:end-0 before:top-0 before:h-px before:bg-border-subtle',
    'before:start-[calc(var(--spacing)*3.5+max(var(--li-lead,0px),var(--li-max-tile,0px),var(--li-max-avatar,0px),var(--li-max-thumb,0px),var(--li-max-check,0px),var(--li-max-grip,0px))+var(--li-sep-gap,0px))] first:before:hidden',
    'has-[[data-slot=list-trigger]]:hover:bg-neutral-hover has-[[data-slot=list-trigger]:active]:bg-neutral-pressed',
    'data-[state=checked]:not-data-[disabled]:selected data-[state=checked]:not-data-[disabled]:hover:bg-selection-fill-hover',
    'data-[disabled]:pointer-events-none data-[disabled]:text-disabled-text data-[disabled]:data-[state=checked]:bg-disabled-fill',
    'data-[dragging]:z-10 data-[dragging]:scale-[1.015] data-[dragging]:rounded-lg data-[dragging]:bg-surface-raised data-[dragging]:shadow-3 data-[dragging]:before:hidden',
    'data-[follow]:cursor-grabbing data-[follow]:transition-[background-color,box-shadow,scale]',
    'group-data-[settling]/list:transition-none',
    // A row that is leaving (data-state closed, set by List while usePresence keeps it drawn) plays the exit and takes no input.
    'data-[state=closed]:pointer-events-none data-[state=closed]:animate-exit',
  ],
  {
    variants: {
      size: { xs: '', sm: '', md: '', lg: '' },
      // The row tone colours the title (listTitleVariants); 'default' is the deprecated alias of neutral (ListRow maps it).
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      status: { idle: '', working: '' },
      // enter: the row was added after the list mounted; the rows of the first paint do not rise.
      enter: { true: 'animate-rise', false: '' },
      reorder: {
        true: 'cursor-grab select-none translate-y-[var(--li-y,0px)] transition-[background-color,box-shadow,scale,translate] duration-base ease-in-out hover:bg-neutral-hover',
        false: 'transition-[background-color] duration-quick ease-standard',
      },
      actions: { none: '', hover: 'hover:bg-neutral-hover', swipe: 'overflow-hidden before:z-20' },
    },
    defaultVariants: { size: 'md', tone: 'neutral', status: 'idle', reorder: false, actions: 'none', enter: false },
  },
);

/** The row box: flex, 12 gap, 14 / 8 padding, minimum height by size. On the li, or on the sliding body of a swipe row. */
export const listRowBoxVariants = cva('flex items-center gap-3 px-3.5 py-2', {
  variants: { size: { xs: 'min-h-control-lg', sm: 'min-h-control-xl', md: 'min-h-list-row', lg: 'min-h-16' } },
  defaultVariants: { size: 'md' },
});

/**
 * The sliding body of a swipe row (rowActions swipe, the former ListActions): opaque so the tray is hidden behind it,
 * translated by --row-x (from the measured tray width and the drag), spring transition except while dragging.
 */
export const listBodyVariants = cva(
  'relative z-10 translate-x-[var(--row-x,0px)] cursor-grab touch-pan-y rounded-[inherit] bg-surface-base font-ui text-ui text-text-primary outline-none transition-[translate] ease-spring duration-spring data-[dragging]:cursor-grabbing data-[dragging]:transition-none',
);

/** The opaque row (variant opaque, the former AppendList row): auto / 1fr / auto with a full-width 1px subtle top edge.
 *  Hover fills it with neutral.hover: rows are usually summaries the consumer opens, so they answer the pointer. */
export const listOpaqueRowVariants = cva(
  'relative grid grid-cols-[auto_1fr_auto] items-center gap-2 border-t border-border-subtle px-3 text-text-primary transition-[background-color] duration-quick ease-standard hover:bg-neutral-hover data-[state=closed]:pointer-events-none data-[state=closed]:animate-exit',
  {
    variants: {
      size: { xs: 'py-1 text-ui-xs', sm: 'py-1 text-ui-sm', md: 'py-1.5 text-ui-dense', lg: 'py-2 text-ui' },
      enter: { true: 'animate-rise', false: '' },
    },
    defaultVariants: { size: 'md', enter: false },
  },
);

/** Opaque row glyph: 14px, decorative; the list tone graphic (neutral graphic by default: no status hue). */
export const listGlyphVariants = cva('inline-flex size-icon-sm flex-none items-center justify-center [&_svg]:size-full', {
  variants: {
    tone: {
      neutral: 'text-neutral-graphic', accent: 'text-accent-graphic', success: 'text-success-graphic', warning: 'text-warning-graphic',
      danger: 'text-danger-graphic', info: 'text-info-graphic', agent: 'text-agent-graphic',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

/** Opaque row text: the name followed by the muted detail on one line. */
export const listInlineTextVariants = cva('min-w-0 truncate');
export const listInlineDescriptionVariants = cva('text-text-tertiary');
export const listInlineEndVariants = cva('inline-flex items-center');

/** Leading width per kind, for a row outside a List (inside one, the list's widest leading wins). */
export const listLeadVariants = cva('', {
  variants: {
    lead: {
      none: '',
      tile: '[--li-lead:var(--cs-size-list-tile)] [--li-sep-gap:calc(var(--spacing)*3)]',
      avatar: '[--li-lead:var(--cs-size-avatar-lg)] [--li-sep-gap:calc(var(--spacing)*3)]',
      thumb: '[--li-lead:calc(var(--spacing)*16)] [--li-sep-gap:calc(var(--spacing)*3)]',
      check: '[--li-lead:var(--cs-size-check)] [--li-sep-gap:calc(var(--spacing)*3)]',
      grip: '[--li-lead:var(--cs-icon-md)] [--li-sep-gap:calc(var(--spacing)*3)]',
      'grip-index': '[--li-lead:calc(var(--spacing)*12.5)] [--li-sep-gap:calc(var(--spacing)*3)]',
    },
  },
  defaultVariants: { lead: 'none' },
});

/** The stretched row action: covers the whole row, controls inside the row sit above it. */
export const listTriggerVariants = cva(
  'absolute inset-1 m-0 block cursor-pointer appearance-none rounded-md border-0 bg-transparent p-0 outline-none after:absolute after:-inset-1 focus-visible:shadow-focus disabled:cursor-default',
);

export const listLeadWrapVariants = cva('flex flex-none items-center');

/** Icon tile: an identity colour (solid 9 per mode) with its own on colour for the glyph. */
export const listTileVariants = cva(
  'grid size-list-tile flex-none place-items-center rounded-md [&_svg]:size-icon-md',
  {
    variants: {
      tint: {
        coral: 'bg-identity-coral text-identity-on-coral', iris: 'bg-identity-iris text-identity-on-iris', mint: 'bg-identity-mint text-identity-on-mint',
        amber: 'bg-identity-amber text-identity-on-amber', slate: 'bg-identity-slate text-identity-on-slate',
      },
    },
    defaultVariants: { tint: 'iris' },
  },
);

export const listThumbVariants = cva(
  'relative block h-thumb-h w-16 flex-none overflow-hidden rounded-md shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)] [&>img]:size-full [&>img]:object-cover',
);

export const listDurationVariants = cva(
  'absolute bottom-1 right-1 inline-flex h-4 items-center rounded-xs bg-media-scrim px-1 font-mono text-mono-sm font-semibold text-media-on',
);

export const listTextVariants = cva('grid min-w-0 flex-1 gap-0.25');

/** Title > value > meta: the title is ui-md medium, the value and the end cluster drop to ui-sm (owner 2026-10-27). A disabled
 *  choice drops to disabled.text. */
export const listTitleVariants = cva('truncate text-ui-md font-medium', {
  variants: {
    tone: {
      neutral: 'text-text-primary', accent: 'text-accent-text', success: 'text-success-text', warning: 'text-warning-text',
      danger: 'text-danger-text', info: 'text-info-text', agent: 'text-agent-text',
    },
    off: { true: 'text-disabled-text', false: '' },
  },
  defaultVariants: { tone: 'neutral', off: false },
});

export const listDescriptionVariants = cva('truncate text-ui-sm font-normal', {
  variants: { off: { true: 'text-disabled-text', false: 'text-text-tertiary' } },
  defaultVariants: { off: false },
});

export const listValueVariants = cva('whitespace-nowrap text-ui-sm text-text-tertiary');

/** Trailing cluster; relative so it paints above the stretched trigger. */
export const listEndVariants = cva('relative flex flex-none items-center gap-1.5 whitespace-nowrap text-ui-sm text-text-tertiary');

/** The spectrum orb exists only while the agent works on the row (status working, P2). */
export const listOrbVariants = cva('', {
  variants: { status: { idle: '', working: 'orb orb-sm' } },
  defaultVariants: { status: 'idle' },
});

export const listChevronVariants = cva('size-icon-md flex-none text-neutral-graphic');

/**
 * Selection mark at the start of a row (ListRowIndicator; decorative, the trigger carries aria-checked): 18px. box
 * (multiple) is the Checkbox box; radio (single, indicator radio, owner 2026-10-28) is the RadioGroup circle with a 7px dot.
 * Checked: accent.solid with the accent.on glyph or dot, which the inverted row re-points to selection.on with a
 * selection.fill mark. Disabled: disabled fill and border.
 */
export const listIndicatorVariants = cva(
  [
    'relative grid size-check flex-none place-items-center bg-surface-base text-accent-on shadow-[inset_0_0_0_1px_var(--cs-color-border-control)] transition-[background-color] duration-quick ease-standard',
    'data-[state=checked]:bg-accent-solid data-[state=checked]:shadow-none',
    'data-[disabled]:bg-disabled-fill data-[disabled]:text-disabled-text data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)] data-[disabled]:data-[state=checked]:bg-disabled-fill',
  ],
  {
    variants: {
      shape: {
        box: 'rounded-sm [&_svg]:size-icon-sm [&_svg]:opacity-0 data-[state=checked]:[&_svg]:opacity-100 data-[state=checked]:[&_svg]:animate-pop',
        radio: 'rounded-full',
      },
    },
    defaultVariants: { shape: 'box' },
  },
);

/** The radio circle's dot: 7px, the indicator's glyph colour, shown when the row is checked. */
export const listDotVariants = cva('size-radio-dot rounded-full bg-current opacity-0 data-[state=checked]:opacity-100 data-[state=checked]:animate-pop');

/** The 18px check at the end of a single-mode row (indicator check); invisible until checked; accent.text, which reads
 *  selection.on on the inverted row. */
export const listTickVariants = cva(
  'relative size-check flex-none text-accent-text opacity-0 transition-control data-[state=checked]:opacity-100 data-[state=checked]:animate-pop data-[disabled]:text-disabled-text',
);

/**
 * The grip button (ListRowHandle): 16px glyph, 24px hit area through a pseudo-element so the layout stays as in the specimen.
 * At rest one step lighter than a graphic (neutral.border-strong, owner 2026-10-28) so it recedes behind the titles; row
 * hover darkens it to text.secondary; on the held row it takes the grip tone (--li-grip, accent.solid by default).
 */
export const listHandleVariants = cva(
  'relative flex size-icon-md flex-none cursor-grab touch-none items-center justify-center rounded-xs text-neutral-border-strong outline-none transition-colors duration-quick ease-standard before:absolute before:-inset-1 group-hover/row:text-text-secondary focus-visible:shadow-focus data-[dragging]:text-[var(--li-grip,var(--cs-color-accent-solid))] [&_svg]:size-icon-md',
);

/** Position badge: 22px square, mono 11px. */
export const listIndexVariants = cva(
  'grid size-index-badge flex-none place-items-center rounded-sm bg-neutral-track font-mono text-mono-sm font-semibold text-text-secondary',
);

/** Swipe tray under the row, pinned to the end edge (ListRowTray). */
export const listTrayVariants = cva('absolute inset-y-0 end-0 flex');

/**
 * One tray action: icon over a short label, 72px wide, full row height. intent is the action's tone and emphasis its
 * variant (lib/common-props); solid (default) is the solid fill: hover takes solid-hover, press takes solid-hover plus a 1px
 * inner edge of the tone's text slot (step 11, §2 solid row), and pressed + focus draws the ring next to that edge.
 * soft = soft 3 → hover 4 → press 5 with the tone text; outline = border 6 edge and tone text, tint 2 hover, soft 3 press;
 * ghost = tone text, tint 2 hover, soft 3 press.
 */
export const listActionVariants = cva(
  'grid w-18 flex-none cursor-pointer place-content-center place-items-center gap-0.5 border-0 font-ui text-micro font-semibold outline-none focus-visible:shadow-focus',
  {
    variants: {
      intent: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      emphasis: { solid: '', soft: '', outline: '', ghost: '' },
    },
    compoundVariants: [
      { emphasis: 'solid', intent: 'neutral', className: 'bg-neutral-solid text-neutral-on hover:bg-neutral-solid-hover active:bg-neutral-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-neutral-text)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-neutral-text),var(--cs-focus)]' },
      { emphasis: 'solid', intent: 'accent', className: 'bg-accent-solid text-accent-on hover:bg-accent-solid-hover active:bg-accent-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-accent-text)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-accent-text),var(--cs-focus)]' },
      { emphasis: 'solid', intent: 'success', className: 'bg-success-solid text-success-on hover:bg-success-solid-hover active:bg-success-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-success-text)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-success-text),var(--cs-focus)]' },
      { emphasis: 'solid', intent: 'warning', className: 'bg-warning-solid text-warning-on hover:bg-warning-solid-hover active:bg-warning-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-warning-text)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-warning-text),var(--cs-focus)]' },
      { emphasis: 'solid', intent: 'danger', className: 'bg-danger-solid text-danger-on hover:bg-danger-solid-hover active:bg-danger-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-danger-text)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-text),var(--cs-focus)]' },
      { emphasis: 'solid', intent: 'info', className: 'bg-info-solid text-info-on hover:bg-info-solid-hover active:bg-info-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-info-text)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-info-text),var(--cs-focus)]' },
      { emphasis: 'solid', intent: 'agent', className: 'bg-agent-solid text-agent-on hover:bg-agent-solid-hover active:bg-agent-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-agent-text)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-agent-text),var(--cs-focus)]' },
      { emphasis: 'soft', intent: 'neutral', className: 'bg-neutral-soft text-neutral-text hover:bg-neutral-soft-hover active:bg-neutral-soft-pressed' },
      { emphasis: 'soft', intent: 'accent', className: 'bg-accent-soft text-accent-text hover:bg-accent-soft-hover active:bg-accent-soft-pressed' },
      { emphasis: 'soft', intent: 'success', className: 'bg-success-soft text-success-text hover:bg-success-soft-hover active:bg-success-soft-pressed' },
      { emphasis: 'soft', intent: 'warning', className: 'bg-warning-soft text-warning-text hover:bg-warning-soft-hover active:bg-warning-soft-pressed' },
      { emphasis: 'soft', intent: 'danger', className: 'bg-danger-soft text-danger-text hover:bg-danger-soft-hover active:bg-danger-soft-pressed' },
      { emphasis: 'soft', intent: 'info', className: 'bg-info-soft text-info-text hover:bg-info-soft-hover active:bg-info-soft-pressed' },
      { emphasis: 'soft', intent: 'agent', className: 'bg-agent-soft text-agent-text hover:bg-agent-soft-hover active:bg-agent-soft-pressed' },
      { emphasis: 'outline', intent: 'neutral', className: 'bg-transparent text-neutral-text shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)] hover:bg-neutral-tint active:bg-neutral-soft' },
      { emphasis: 'outline', intent: 'accent', className: 'bg-transparent text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] hover:bg-accent-tint active:bg-accent-soft' },
      { emphasis: 'outline', intent: 'success', className: 'bg-transparent text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] hover:bg-success-tint active:bg-success-soft' },
      { emphasis: 'outline', intent: 'warning', className: 'bg-transparent text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] hover:bg-warning-tint active:bg-warning-soft' },
      { emphasis: 'outline', intent: 'danger', className: 'bg-transparent text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] hover:bg-danger-tint active:bg-danger-soft' },
      { emphasis: 'outline', intent: 'info', className: 'bg-transparent text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] hover:bg-info-tint active:bg-info-soft' },
      { emphasis: 'outline', intent: 'agent', className: 'bg-transparent text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] hover:bg-agent-tint active:bg-agent-soft' },
      { emphasis: 'ghost', intent: 'neutral', className: 'bg-transparent text-neutral-text hover:bg-neutral-tint active:bg-neutral-soft' },
      { emphasis: 'ghost', intent: 'accent', className: 'bg-transparent text-accent-text hover:bg-accent-tint active:bg-accent-soft' },
      { emphasis: 'ghost', intent: 'success', className: 'bg-transparent text-success-text hover:bg-success-tint active:bg-success-soft' },
      { emphasis: 'ghost', intent: 'warning', className: 'bg-transparent text-warning-text hover:bg-warning-tint active:bg-warning-soft' },
      { emphasis: 'ghost', intent: 'danger', className: 'bg-transparent text-danger-text hover:bg-danger-tint active:bg-danger-soft' },
      { emphasis: 'ghost', intent: 'info', className: 'bg-transparent text-info-text hover:bg-info-tint active:bg-info-soft' },
      { emphasis: 'ghost', intent: 'agent', className: 'bg-transparent text-agent-text hover:bg-agent-tint active:bg-agent-soft' },
    ],
    defaultVariants: { intent: 'neutral', emphasis: 'solid' },
  },
);

export const listActionIconVariants = cva('size-icon-md [&_svg]:size-icon-md');
export const listActionLabelVariants = cva('');

/** Hover tools (rowActions hover): faded in on row hover or focus within; always visible without hover (touch). Above the
 *  stretched trigger. */
export const listToolsVariants = cva(
  'relative flex flex-none items-center gap-0.5 opacity-0 transition-control group-hover/row:opacity-100 group-focus-within/row:opacity-100 pointer-coarse:opacity-100',
);

/**
 * The add row (ListAddRow, from the former AppendList): full width, dashed strong top edge, plus glyph and label in
 * accent.text (the list's one action). opaque steps padding and type with the list size; grouped uses the row inset.
 */
export const listAddVariants = cva(
  [
    'flex w-full cursor-pointer items-center gap-1.5 border-0 border-t border-dashed border-border-strong bg-transparent text-start font-ui text-accent-text outline-none',
    'transition-control hover:bg-neutral-hover focus-visible:shadow-focus',
    '[&_svg]:size-icon-sm [&_svg]:flex-none',
  ],
  {
    variants: {
      surface: { grouped: 'px-3.5 text-ui-md', opaque: 'px-3' },
      size: { xs: '', sm: '', md: '', lg: '' },
    },
    compoundVariants: [
      { surface: 'opaque', size: 'xs', className: 'py-1.5 text-ui-xs' },
      { surface: 'opaque', size: 'sm', className: 'py-1.75 text-ui-sm' },
      { surface: 'opaque', size: 'md', className: 'py-2.25 text-ui-dense' },
      { surface: 'opaque', size: 'lg', className: 'py-2.5 text-ui' },
      { surface: 'grouped', size: 'xs', className: 'min-h-control-lg' },
      { surface: 'grouped', size: 'sm', className: 'min-h-control-xl' },
      { surface: 'grouped', size: 'md', className: 'min-h-list-row' },
      { surface: 'grouped', size: 'lg', className: 'min-h-16' },
    ],
    defaultVariants: { surface: 'grouped', size: 'md' },
  },
);

export type ListVariantProps = VariantProps<typeof listRowVariants>;
export type ListTint = NonNullable<VariantProps<typeof listTileVariants>['tint']>;
