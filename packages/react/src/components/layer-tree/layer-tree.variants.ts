import { cva } from 'class-variance-authority';

/** The tree: a grid with a 3px row gap (owner 2026-10-27: 1px was too tight; filled rows now read apart). Relative, because
 *  the drag ghost is positioned inside it. */
export const layerTreeVariants = cva('relative grid gap-0.75 font-ui text-ui-dense text-text-primary');

/** Common shadow (lib/common-props) of the tree; unset keeps it flat (the tree sits on the panel). */
export const layerTreeFrameVariants = cva('', {
  variants: {
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { shadow: 'none' },
});

/** Common radius (lib/common-props): the tree is frameless, so the rows (hover, selection, drop shapes) take it. Unset keeps md. */
export const layerTreeRowRadiusVariants = cva('', {
  variants: {
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: '', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
  },
  defaultVariants: { radius: 'md' },
});

/**
 * One layer row. 28px, 6px inline padding; the depth indent is a margin on the twisty (--depth x tree indent).
 * Selection is neutral (owner 2026-10-27, O3 = decision 3 B), one step lighter than neutral.selected (owner follow-up the same
 * day: the checked rows read too dark): every selected row takes neutral.pressed (neutral.selected under the pointer), no
 * edge, and shows the check glyph in the end cluster, which carries the selection. The primary row reads primary text, the others keep
 * secondary text. Focus is the plain focus ring.
 * data-drop="inside" marks the drop target in the tree tone and variant (lib/common-props): soft accent (default) = accent soft
 * fill with a 1px dashed accent border-strong outline (a temporary target, not a heavy solid frame); solid = solid 9 fill with the on text; outline = the 1.5px solid edge alone; ghost = tint 2.
 * size steps the row height and type (md = 28px / ui-dense, today).
 * A main component reads in one category hue (info text) on the row, its glyph, its label and its tag.
 */
export const layerTreeRowVariants = cva(
  [
    'group relative flex cursor-default select-none items-center gap-1.5 rounded-md px-1.5 text-text-secondary outline-none',
    'transition-[background-color,box-shadow] duration-120 ease-out hover:bg-neutral-hover focus-visible:shadow-focus',
    'data-[component]:text-category-component',
    'data-[selected]:bg-neutral-pressed data-[selected]:hover:bg-neutral-selected data-[selected]:data-[primary]:text-text-primary data-[selected]:data-[secondary]:text-text-secondary',
  ],
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: { solid: '', soft: '', outline: '', ghost: '' },
      size: {
        xs: 'h-control-xs text-ui-xs',
        sm: 'h-6.5 text-ui-sm',
        md: 'h-control-sm text-ui-dense',
        lg: 'h-control-md text-ui',
      },
    },
    compoundVariants: [
      // solid × tone
      { variant: 'solid', tone: 'neutral', className: 'data-[drop=inside]:bg-neutral-solid data-[drop=inside]:text-neutral-on' },
      { variant: 'solid', tone: 'accent', className: 'data-[drop=inside]:bg-accent-solid data-[drop=inside]:text-accent-on' },
      { variant: 'solid', tone: 'success', className: 'data-[drop=inside]:bg-success-solid data-[drop=inside]:text-success-on' },
      { variant: 'solid', tone: 'warning', className: 'data-[drop=inside]:bg-warning-solid data-[drop=inside]:text-warning-on' },
      { variant: 'solid', tone: 'danger', className: 'data-[drop=inside]:bg-danger-solid data-[drop=inside]:text-danger-on' },
      { variant: 'solid', tone: 'info', className: 'data-[drop=inside]:bg-info-solid data-[drop=inside]:text-info-on' },
      { variant: 'solid', tone: 'agent', className: 'data-[drop=inside]:bg-agent-solid data-[drop=inside]:text-agent-on' },
      // soft × tone
      { variant: 'soft', tone: 'neutral', className: 'data-[drop=inside]:bg-neutral-soft data-[drop=inside]:outline-1 data-[drop=inside]:outline-dashed data-[drop=inside]:-outline-offset-1 data-[drop=inside]:outline-neutral-border-strong' },
      { variant: 'soft', tone: 'accent', className: 'data-[drop=inside]:bg-accent-soft data-[drop=inside]:outline-1 data-[drop=inside]:outline-dashed data-[drop=inside]:-outline-offset-1 data-[drop=inside]:outline-accent-border-strong' },
      { variant: 'soft', tone: 'success', className: 'data-[drop=inside]:bg-success-soft data-[drop=inside]:outline-1 data-[drop=inside]:outline-dashed data-[drop=inside]:-outline-offset-1 data-[drop=inside]:outline-success-border-strong' },
      { variant: 'soft', tone: 'warning', className: 'data-[drop=inside]:bg-warning-soft data-[drop=inside]:outline-1 data-[drop=inside]:outline-dashed data-[drop=inside]:-outline-offset-1 data-[drop=inside]:outline-warning-border-strong' },
      { variant: 'soft', tone: 'danger', className: 'data-[drop=inside]:bg-danger-soft data-[drop=inside]:outline-1 data-[drop=inside]:outline-dashed data-[drop=inside]:-outline-offset-1 data-[drop=inside]:outline-danger-border-strong' },
      { variant: 'soft', tone: 'info', className: 'data-[drop=inside]:bg-info-soft data-[drop=inside]:outline-1 data-[drop=inside]:outline-dashed data-[drop=inside]:-outline-offset-1 data-[drop=inside]:outline-info-border-strong' },
      { variant: 'soft', tone: 'agent', className: 'data-[drop=inside]:bg-agent-soft data-[drop=inside]:outline-1 data-[drop=inside]:outline-dashed data-[drop=inside]:-outline-offset-1 data-[drop=inside]:outline-agent-border-strong' },
      // outline × tone
      { variant: 'outline', tone: 'neutral', className: 'data-[drop=inside]:shadow-[inset_0_0_0_1.5px_var(--cs-color-neutral-solid)]' },
      { variant: 'outline', tone: 'accent', className: 'data-[drop=inside]:shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-solid)]' },
      { variant: 'outline', tone: 'success', className: 'data-[drop=inside]:shadow-[inset_0_0_0_1.5px_var(--cs-color-success-solid)]' },
      { variant: 'outline', tone: 'warning', className: 'data-[drop=inside]:shadow-[inset_0_0_0_1.5px_var(--cs-color-warning-solid)]' },
      { variant: 'outline', tone: 'danger', className: 'data-[drop=inside]:shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-solid)]' },
      { variant: 'outline', tone: 'info', className: 'data-[drop=inside]:shadow-[inset_0_0_0_1.5px_var(--cs-color-info-solid)]' },
      { variant: 'outline', tone: 'agent', className: 'data-[drop=inside]:shadow-[inset_0_0_0_1.5px_var(--cs-color-agent-solid)]' },
      // ghost × tone
      { variant: 'ghost', tone: 'neutral', className: 'data-[drop=inside]:bg-neutral-tint' },
      { variant: 'ghost', tone: 'accent', className: 'data-[drop=inside]:bg-accent-tint' },
      { variant: 'ghost', tone: 'success', className: 'data-[drop=inside]:bg-success-tint' },
      { variant: 'ghost', tone: 'warning', className: 'data-[drop=inside]:bg-warning-tint' },
      { variant: 'ghost', tone: 'danger', className: 'data-[drop=inside]:bg-danger-tint' },
      { variant: 'ghost', tone: 'info', className: 'data-[drop=inside]:bg-info-tint' },
      { variant: 'ghost', tone: 'agent', className: 'data-[drop=inside]:bg-agent-tint' },
    ],
    defaultVariants: { tone: 'accent', variant: 'soft', size: 'md' },
  },
);

/** Chevron box: 12px; a leaf renders it empty so labels align. */
export const layerTreeTwistyVariants = cva('ms-[calc(var(--depth)*var(--cs-size-tree-indent))] inline-flex size-icon-xs flex-none items-center justify-center text-neutral-graphic [&_svg]:size-full [&_svg]:stroke-[1.75]');

/** Kind glyph: 14px, tertiary; primary text on the primary row, the component hue, disabled colour when hidden. */
export const layerTreeIconVariants = cva([
  'inline-flex size-icon-sm flex-none items-center justify-center text-text-tertiary [&_svg]:size-full [&_svg]:stroke-[1.75]',
  'group-data-[component]:text-category-component group-data-[primary]:text-text-primary group-data-[hidden]:text-disabled-text',
]);

export const layerTreeLabelVariants = cva('min-w-0 flex-1 truncate group-data-[component]:text-category-component group-data-[hidden]:text-disabled-text');

/** Type tag after the name: 18px, info tint. An extra 8px leading margin (14px from the name in all) keeps a long, truncated
 *  name from running into it. */
export const layerTreeTagVariants = cva('ms-2 inline-flex h-control-compact-2xs flex-none items-center rounded-xs bg-category-component-soft px-1.25 text-micro text-category-component');

/** Trailing cluster. Any svg a consumer puts here is 14px and tertiary (primary on the primary row, disabled colour on a hidden row). */
export const layerTreeEndVariants = cva([
  'ms-auto flex flex-none items-center gap-1',
  '[&_svg]:size-icon-sm [&_svg]:flex-none [&_svg]:stroke-[1.75] [:where(&)_svg]:text-text-tertiary',
  'group-data-[primary]:[&_svg]:text-text-primary group-data-[hidden]:[&_svg]:text-disabled-text',
]);

/** Selection check on every selected row: 14px, primary text (disabled colour on a hidden row). Its svg follows the span colour, not the end cluster's tertiary. */
export const layerTreeCheckVariants = cva('inline-flex size-icon-sm flex-none items-center justify-center text-text-primary group-data-[hidden]:text-disabled-text [&_svg]:size-full [&_svg]:stroke-[1.75] [&_svg]:text-current');

export const layerTreeCaptionVariants = cva('text-ui-xs font-medium text-text-tertiary');

/** Agent mark: a 6px spinning spectrum dot. */
export const layerTreeMarkVariants = cva('size-1.5 flex-none rounded-full spectrum-fill');

/**
 * Visibility and lock toggles: a 14px glyph in a 24px hit area (pseudo-element), fading in on row hover and focus-within.
 * A hidden row always shows the eye, a locked row the lock.
 */
export const layerTreeToggleVariants = cva(
  [
    'relative inline-flex size-icon-sm flex-none cursor-default items-center justify-center rounded-xs text-text-tertiary opacity-0 outline-none',
    'transition-[opacity,color] duration-120 ease-out before:absolute before:-inset-1.25 [&_svg]:size-full [&_svg]:stroke-[1.75]',
    'group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:shadow-focus',
    'group-data-[primary]:text-text-primary',
  ],
  {
    variants: {
      kind: {
        visibility: 'group-data-[hidden]:text-disabled-text group-data-[hidden]:opacity-100',
        lock: 'group-data-[locked]:text-disabled-text group-data-[locked]:opacity-100',
      },
    },
    defaultVariants: { kind: 'visibility' },
  },
);

export const layerTreeVisibilityVariants = () => layerTreeToggleVariants({ kind: 'visibility' });
export const layerTreeLockVariants = () => layerTreeToggleVariants({ kind: 'lock' });

/**
 * Drop line before / after a row: 2px along the edge from the text start, with an 8px ring dot at its start.
 * accent.solid, because canvas.selection is reserved for the canvas.
 */
export const layerTreeDropVariants = cva(
  [
    // Centred in the 3px row gap: half the gap plus half the 2px line above the row edge.
    'pointer-events-none absolute right-1.5 -top-[calc(var(--spacing)*0.625)] h-0.5 rounded-2xs',
    'left-[calc(var(--spacing)*1.5+var(--depth)*var(--cs-size-tree-indent))]',
    'before:absolute before:-left-1 before:-top-0.75 before:size-2 before:rounded-full before:bg-surface-base before:content-[""]',
    'data-[drop=after]:-bottom-[calc(var(--spacing)*0.625)] data-[drop=after]:top-auto',
  ],
  {
    // The line and its ring dot take the tree tone's solid (accent by default).
    variants: {
      tone: {
        neutral: 'bg-neutral-solid before:shadow-[inset_0_0_0_2px_var(--cs-color-neutral-solid)]',
        accent: 'bg-accent-solid before:shadow-[inset_0_0_0_2px_var(--cs-color-accent-solid)]',
        success: 'bg-success-solid before:shadow-[inset_0_0_0_2px_var(--cs-color-success-solid)]',
        warning: 'bg-warning-solid before:shadow-[inset_0_0_0_2px_var(--cs-color-warning-solid)]',
        danger: 'bg-danger-solid before:shadow-[inset_0_0_0_2px_var(--cs-color-danger-solid)]',
        info: 'bg-info-solid before:shadow-[inset_0_0_0_2px_var(--cs-color-info-solid)]',
        agent: 'bg-agent-solid before:shadow-[inset_0_0_0_2px_var(--cs-color-agent-solid)]',
      },
    },
    defaultVariants: { tone: 'accent' },
  },
);

/** The dragged layer under the pointer: a thick glass chip, tilted, ignoring the pointer. */
export const layerTreeGhostVariants = cva(
  'glass glass-thick glass-shadow-4 pointer-events-none absolute left-(--ghost-x) top-(--ghost-y) z-10 flex items-center gap-1.5 rounded-md px-2.5 text-text-primary',
  {
    variants: { size: { xs: 'h-control-xs text-ui-xs', sm: 'h-6.5 text-ui-sm', md: 'h-control-sm text-ui-dense', lg: 'h-control-md text-ui' } },
    defaultVariants: { size: 'md' },
  },
);

export const layerTreeGhostIconVariants = cva('inline-flex size-icon-sm flex-none items-center justify-center [&_svg]:size-full [&_svg]:stroke-[1.75]');
