import { cva } from 'class-variance-authority';

/**
 * The landmark. kind names what the column holds and sets the row metrics of its parts (read from context): navigation
 * (sidebar pages, the default), pages (a project's canvas pages, was page-list) or sessions (agent sessions, was
 * session-list). size publishes the item icon width (--nav-icon), which places the nesting guide under the parent icon.
 */
export const listNavigationVariants = cva('grid w-full gap-0.5', {
  variants: {
    kind: { navigation: '', pages: '', sessions: '' },
    size: {
      xs: '[--nav-icon:var(--cs-icon-sm)]', sm: '[--nav-icon:var(--cs-icon-md)]', md: '[--nav-icon:var(--cs-icon-md)]',
      lg: '[--nav-icon:var(--cs-icon-lg)]',
    },
  },
  defaultVariants: { kind: 'navigation', size: 'md' },
});

/** Common radius / shadow (lib/common-props) of the landmark; unset keeps it frameless (items sit on the sidebar). */
export const listNavigationFrameVariants = cva('', {
  variants: {
    // Common radius / shadow (lib/common-props): the default key is the component's own look (no class).
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: 'none', shadow: 'none' },
});

/**
 * Section heading. navigation: it starts 2px before the items (8 against their 10, owner 2026-10-28), so the rows read as
 * sitting one step inside the heading. pages (was page-list): the small "Pages" title row, 11px / 600 tertiary, no padding,
 * the add button at the end with an 8px gap.
 */
export const listNavigationHeading = cva('flex items-center justify-between', {
  variants: {
    kind: {
      navigation: 'pb-1 pe-2.5 ps-2 pt-3 font-ui text-caption uppercase text-text-tertiary',
      pages: 'gap-2 text-micro font-semibold text-text-tertiary',
      sessions: 'pb-1 pe-2.5 ps-2 pt-3 font-ui text-caption uppercase text-text-tertiary',
    },
  },
  defaultVariants: { kind: 'navigation' },
});

/**
 * The heading action wrapper. The IconButton xs box is 24 around a 14 glyph, so with the box on the 10px end padding the
 * glyph sat 5px inside the counts and chevrons of the items (owner 2026-10-28: the + did not line up). The wrapper pulls the
 * box out by that 5px, (control-xs − icon-sm) / 2, so the glyph's end edge lands on the item column; the hit area is unchanged.
 * pages keeps page-list's header: the button box ends on the column edge (the rows there have no end padding to match).
 */
export const listNavigationHeadingAction = cva('flex items-center', {
  variants: {
    kind: {
      navigation: '-me-[calc((var(--cs-control-xs)-var(--cs-icon-sm))/2)]',
      pages: '',
      sessions: '-me-[calc((var(--cs-control-xs)-var(--cs-icon-sm))/2)]',
    },
  },
  defaultVariants: { kind: 'navigation' },
});

/** A run of items: 2px apart (page rows keep that minimum gap too, owner 2026-10-28); session rows sit 1px apart. */
export const listNavigationGroup = cva('m-0 grid list-none p-0', {
  variants: { kind: { navigation: 'gap-0.5', pages: 'gap-0.5', sessions: 'gap-px' } },
  defaultVariants: { kind: 'navigation' },
});

/**
 * One link. The current page is the segment thumb (PROPOSAL §4 B2, owner 2026-10-25): the raised control fill and the
 * control edge, as the selected segment of a segmented control; control-raised-hover under the pointer; focus keeps the edge.
 * kind sets the row metrics: navigation 34 / 10 padding / 10 gap / lg, text.secondary; pages (was page-list) 30 / 8 / 8 / md,
 * text.primary; sessions (was session-list) 32 / 8 / 8 / lg, text.primary. `group` lets the pages count follow the row.
 */
export const listNavigationLink = cva(
  [
    'group flex w-full cursor-pointer items-center text-start font-ui no-underline outline-none ease-out',
    'hover:bg-neutral-hover',
    'aria-[current=page]:bg-control-raised aria-[current=page]:font-medium aria-[current=page]:text-text-primary',
    'aria-[current=page]:shadow-[inset_0_0_0_0.5px_var(--cs-color-control-edge),var(--cs-elevation-2)]',
    'aria-[current=page]:hover:bg-control-raised-hover',
    'focus-visible:shadow-focus aria-[current=page]:focus-visible:shadow-[inset_0_0_0_0.5px_var(--cs-color-control-edge),var(--cs-elevation-2),var(--cs-focus)]',
  ],
  {
    variants: {
      kind: {
        navigation: [
          'gap-2.5 rounded-lg px-2.5 text-text-secondary hover:text-text-primary',
          'transition-control [&_svg]:shrink-0',
        ],
        pages: 'gap-2 rounded-md px-2 text-text-primary transition-control',
        sessions: 'gap-2 rounded-lg px-2 text-text-primary transition-control',
      },
      size: { xs: '', sm: '', md: '', lg: '' },
    },
    compoundVariants: [
      { kind: 'navigation', size: 'xs', className: 'h-control-sm text-ui-sm' },
      { kind: 'navigation', size: 'sm', className: 'h-menu-item text-ui-dense' },
      { kind: 'navigation', size: 'md', className: 'h-tab-h text-ui' },
      { kind: 'navigation', size: 'lg', className: 'h-control-lg text-ui-md' },
      { kind: 'pages', size: 'xs', className: 'h-control-sm text-ui-xs' },
      { kind: 'pages', size: 'sm', className: 'h-control-md text-ui-sm' },
      { kind: 'pages', size: 'md', className: 'h-menu-item text-ui-dense' },
      { kind: 'pages', size: 'lg', className: 'h-control-lg text-ui' },
      { kind: 'sessions', size: 'xs', className: 'h-control-xs text-ui-xs' },
      { kind: 'sessions', size: 'sm', className: 'h-control-sm text-ui-dense' },
      { kind: 'sessions', size: 'md', className: 'h-control-md text-ui-dense' },
      { kind: 'sessions', size: 'lg', className: 'h-control-lg text-ui' },
    ],
    defaultVariants: { kind: 'navigation', size: 'md' },
  },
);

/** Leading glyph: 16 (14 at xs, 20 at lg) in the row colour. pages: the 14px file icon in text.tertiary at every size. */
export const listNavigationIcon = cva('inline-grid shrink-0 place-items-center [&_svg]:size-full', {
  variants: {
    kind: { navigation: '', pages: 'size-icon-sm text-text-tertiary', sessions: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { kind: ['navigation', 'sessions'], size: 'xs', className: 'size-icon-sm' },
    { kind: ['navigation', 'sessions'], size: ['sm', 'md'], className: 'size-icon-md' },
    { kind: ['navigation', 'sessions'], size: 'lg', className: 'size-icon-lg' },
  ],
  defaultVariants: { kind: 'navigation', size: 'md' },
});

/** Any leading node (an avatar, a custom mark): centred, never shrinks, sized by its content. */
export const listNavigationLeading = cva('inline-grid shrink-0 place-items-center');

/** Item text; fills the row so the meta and count sit at the end. The running session reads first (medium, proposal C). */
export const listNavigationLabel = cva('min-w-0 flex-1 truncate', {
  variants: { status: { running: 'font-medium', review: '', failed: '', done: '' } },
});

/** Meta: trailing time or status word (session "now", "2h"), ui-xs tertiary. */
export const listNavigationMeta = cva('shrink-0 text-ui-xs text-text-tertiary');

/** Status column (was session-list): a 16px box; colour carries the status (the small dot is a graphic mark, step 8). */
export const listNavigationStatus = cva('grid size-icon-md shrink-0 place-items-center', {
  variants: {
    status: { running: 'text-text-tertiary', review: 'text-info-graphic', failed: 'text-danger-graphic', done: 'text-text-tertiary' },
  },
});

/** The spectrum orb exists only while the agent works on the row (status running, P2). */
export const listNavigationOrb = cva('', { variants: { status: { running: 'orb orb-sm', review: '', failed: '', done: '' } } });

export const listNavigationDot = cva('size-radio-dot rounded-full bg-current');

/** Done check: icon-sm with a heavier stroke (2.5, owner 2026-10-28) so it holds its own next to the dots and the orb. */
export const listNavigationCheck = cva('size-icon-sm animate-pop stroke-[2.5]');

/**
 * The count. A hot count is a pill whose emphasis is the variant and whose colour is the tone (lib/common-props): solid
 * accent (default) = accent solid 9 with the on text; soft = soft 3 with the tone text; outline = border 6 edge; ghost =
 * the tone text alone. Neutral solid is ink. A plain count is text.placeholder in every tone.
 * pages (was page-list, owner 2026-10-28 B): the frame count is ui-xs tertiary and shows only on the current page, under the
 * pointer and while the row has keyboard focus; on devices without hover it stays visible. Hidden by opacity, so it stays
 * in the row's accessible name.
 */
export const listNavigationCount = cva('ms-auto shrink-0 font-ui', {
  variants: {
    hot: { true: 'grid h-control-compact-2xs min-w-control-compact-2xs place-items-center rounded-full px-1.25 font-semibold', false: '' },
    kind: {
      navigation: 'text-hint tabular-nums',
      pages: 'text-ui-xs',
      sessions: 'text-hint tabular-nums',
    },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
  },
  compoundVariants: [
    // A plain count is one step lighter than the label's meta (owner 2026-10-28): text.placeholder, neutral 8.
    { hot: false, kind: ['navigation', 'sessions'], className: 'text-text-placeholder' },
    {
      hot: false, kind: 'pages',
      className: [
        'font-normal text-text-tertiary opacity-0 transition-control',
        'group-hover:opacity-100 group-focus-visible:opacity-100 group-aria-[current=page]:opacity-100 [@media(hover:none)]:opacity-100',
      ],
    },
    { hot: true, variant: 'solid', tone: 'neutral', className: 'bg-ink-solid text-ink-on' },
    { hot: true, variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft text-neutral-text' },
    { hot: true, variant: 'outline', tone: 'neutral', className: 'text-text-secondary shadow-[inset_0_0_0_0.5px_var(--cs-color-neutral-border)]' },
    { hot: true, variant: 'ghost', tone: 'neutral', className: 'text-text-secondary' },
    // solid × tone
    { hot: true, variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on' },
    { hot: true, variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on' },
    { hot: true, variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on' },
    { hot: true, variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on' },
    { hot: true, variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on' },
    { hot: true, variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on' },
    // soft × tone
    { hot: true, variant: 'soft', tone: 'accent', className: 'bg-accent-soft text-accent-text' },
    { hot: true, variant: 'soft', tone: 'success', className: 'bg-success-soft text-success-text' },
    { hot: true, variant: 'soft', tone: 'warning', className: 'bg-warning-soft text-warning-text' },
    { hot: true, variant: 'soft', tone: 'danger', className: 'bg-danger-soft text-danger-text' },
    { hot: true, variant: 'soft', tone: 'info', className: 'bg-info-soft text-info-text' },
    { hot: true, variant: 'soft', tone: 'agent', className: 'bg-agent-soft text-agent-text' },
    // outline × tone
    { hot: true, variant: 'outline', tone: 'accent', className: 'text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { hot: true, variant: 'outline', tone: 'success', className: 'text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { hot: true, variant: 'outline', tone: 'warning', className: 'text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { hot: true, variant: 'outline', tone: 'danger', className: 'text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { hot: true, variant: 'outline', tone: 'info', className: 'text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { hot: true, variant: 'outline', tone: 'agent', className: 'text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    // ghost × tone
    { hot: true, variant: 'ghost', tone: 'accent', className: 'text-accent-text' },
    { hot: true, variant: 'ghost', tone: 'success', className: 'text-success-text' },
    { hot: true, variant: 'ghost', tone: 'warning', className: 'text-warning-text' },
    { hot: true, variant: 'ghost', tone: 'danger', className: 'text-danger-text' },
    { hot: true, variant: 'ghost', tone: 'info', className: 'text-info-text' },
    { hot: true, variant: 'ghost', tone: 'agent', className: 'text-agent-text' },
  ],
  defaultVariants: { hot: false, kind: 'navigation', tone: 'accent', variant: 'solid' },
});

export const listNavigationChevron = cva('ms-auto size-icon-sm shrink-0 text-neutral-graphic transition-[rotate] duration-base ease-out data-[expanded=true]:rotate-90');

/**
 * A nested list. Up to three levels (owner 2026-10-28): depth 2 under a top-level item, depth 3 under a sub-item. Each draws
 * a 1px guide down its whole height in the icon colour (text.secondary, owner 2026-10-28: as strong as the icons), so a
 * long group shows where it ends. The list's start padding sets where its rows begin, so a row's hover and current fill
 * start right of every ancestor guide and never paint over one (round 4): depth 2 rows begin one tree indent before the
 * parent label (nav-indent − tree-indent = 22), depth 3 rows one tree indent further (36). Guides: depth 2 under the centre
 * of the parent icon (10 + --nav-icon / 2); depth 3 4px before its rows' fill (32), right of the depth-2 fill edge.
 */
export const listNavigationSub = cva(
  'relative mx-0 mb-0 mt-0.5 grid list-none gap-0.5 py-0 pe-0 before:pointer-events-none before:absolute before:inset-y-0 before:w-px before:bg-text-secondary',
  {
    variants: {
      depth: {
        2: 'ps-[calc(var(--cs-size-nav-indent)-var(--cs-size-tree-indent))] before:start-[calc(var(--spacing)*2.5+var(--nav-icon,var(--cs-icon-md))/2-0.5px)]',
        3: 'ps-tree-indent before:start-[calc(var(--cs-size-tree-indent)-var(--spacing)-0.5px)]',
      },
    },
    defaultVariants: { depth: 2 },
  },
);

export const listNavigationSubLink = cva(
  [
    'flex w-full cursor-pointer items-center gap-2.5 rounded-lg pe-2.5 text-start font-ui text-text-secondary no-underline outline-none',
    'transition-control',
    'hover:bg-neutral-hover hover:text-text-primary',
    'aria-[current=page]:bg-control-raised aria-[current=page]:font-medium aria-[current=page]:text-text-primary',
    'aria-[current=page]:shadow-[inset_0_0_0_0.5px_var(--cs-color-control-edge),var(--cs-elevation-2)]',
    'aria-[current=page]:hover:bg-control-raised-hover',
    'focus-visible:shadow-focus aria-[current=page]:focus-visible:shadow-[inset_0_0_0_0.5px_var(--cs-color-control-edge),var(--cs-elevation-2),var(--cs-focus)]',
  ],
  {
    variants: {
      size: { xs: 'h-control-xs text-ui-xs', sm: 'h-control-sm text-ui-sm', md: 'h-menu-item text-ui-dense', lg: 'h-control-md text-ui' },
      // The row begins at its list's start padding (right of the guides); one tree indent inside it the text lands under the
      // parent label on level 2 (22 + 14 = 36) and one tree indent further on level 3 (36 + 14 = 50), as before.
      depth: { 2: 'ps-tree-indent', 3: 'ps-tree-indent' },
    },
    defaultVariants: { size: 'md', depth: 2 },
  },
);
