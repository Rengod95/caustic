import { cva } from 'class-variance-authority';

/** The tree: a grid with a 1px row gap. Relative, because the drag ghost is positioned inside it. */
export const layerTreeVariants = cva('relative grid gap-[1px] font-ui text-ui-dense text-text-primary');

/**
 * One layer row. 28px, 6px inline padding; the depth indent is a margin on the twisty (--depth x tree indent).
 * Selection is neutral (decision 3): every selected row takes neutral-selected (neutral-selected-hover under the pointer) and the
 * check glyph in the end cluster; the primary row also carries the selection edge and primary text, and focus keeps that edge.
 * data-drop="inside" outlines the row.
 * A main component reads in one category hue (info text) on the row, its glyph, its label and its tag.
 */
export const layerTreeRowVariants = cva([
  'group relative flex h-control-sm cursor-default select-none items-center gap-1.5 rounded-md px-1.5 text-ui-dense text-text-secondary outline-none',
  'transition-[background-color,box-shadow] duration-120 ease-out hover:bg-neutral-hover focus-visible:shadow-focus',
  'data-[component]:text-category-component',
  'data-[secondary]:bg-neutral-selected data-[secondary]:hover:bg-neutral-selected-hover',
  'data-[primary]:bg-neutral-selected data-[primary]:text-text-primary data-[primary]:shadow-[inset_0_0_0_1px_var(--cs-color-selection-edge)] data-[primary]:hover:bg-neutral-selected-hover',
  'data-[primary]:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-selection-edge),var(--cs-focus)]',
  'data-[drop=inside]:bg-accent-soft data-[drop=inside]:shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-solid)]',
]);

/** Chevron box: 12px; a leaf renders it empty so labels align. */
export const layerTreeTwistyVariants = cva('ms-[calc(var(--depth)*var(--cs-size-tree-indent))] inline-flex size-icon-xs flex-none items-center justify-center text-neutral-graphic [&_svg]:size-full [&_svg]:stroke-[1.75]');

/** Kind glyph: 14px, tertiary; primary text on the primary row, the component hue, disabled colour when hidden. */
export const layerTreeIconVariants = cva([
  'inline-flex size-icon-sm flex-none items-center justify-center text-text-tertiary [&_svg]:size-full [&_svg]:stroke-[1.75]',
  'group-data-[component]:text-category-component group-data-[primary]:text-text-primary group-data-[hidden]:text-disabled-text',
]);

export const layerTreeLabelVariants = cva('min-w-0 flex-1 truncate group-data-[component]:text-category-component group-data-[hidden]:text-disabled-text');

/** Type tag after the name: 18px, info tint. */
export const layerTreeTagVariants = cva('inline-flex h-control-compact-2xs flex-none items-center rounded-xs bg-category-component-soft px-1.25 text-micro text-category-component');

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
export const layerTreeDropVariants = cva([
  'pointer-events-none absolute right-1.5 -top-[1px] h-0.5 rounded-2xs bg-accent-solid',
  'left-[calc(var(--spacing)*1.5+var(--depth)*var(--cs-size-tree-indent))]',
  'before:absolute before:-left-1 before:-top-0.75 before:size-2 before:rounded-full before:bg-surface-base before:shadow-[inset_0_0_0_2px_var(--cs-color-accent-solid)] before:content-[""]',
  'data-[drop=after]:-bottom-[1px] data-[drop=after]:top-auto',
]);

/** The dragged layer under the pointer: a thick glass chip, tilted, ignoring the pointer. */
export const layerTreeGhostVariants = cva(
  'glass glass-thick glass-shadow-4 pointer-events-none absolute left-(--ghost-x) top-(--ghost-y) z-10 flex h-control-sm items-center gap-1.5 rounded-md px-2.5 text-ui-dense text-text-primary',
);

export const layerTreeGhostIconVariants = cva('inline-flex size-icon-sm flex-none items-center justify-center [&_svg]:size-full [&_svg]:stroke-[1.75]');
