import { cva } from 'class-variance-authority';

/** The tree: a grid with a 1px row gap. Relative, because the drag ghost is positioned inside it. */
export const layerTreeVariants = cva('relative grid gap-[1px] font-ui text-ui-dense text-text-primary');

/**
 * One layer row. 28px, 6px inline padding; the depth indent is a margin on the twisty (--depth x tree indent).
 * Primary selection is accent soft, the rest of a multi-selection a pressed fill. data-drop="inside" outlines the row.
 */
export const layerTreeRowVariants = cva([
  'group relative flex h-control-sm cursor-default select-none items-center gap-1.5 rounded-md px-1.5 text-ui-dense text-text-secondary outline-none',
  'transition-[background-color,box-shadow] duration-120 ease-out hover:bg-fill-hover focus-visible:shadow-focus',
  'data-[component]:text-identity-iris',
  'data-[secondary]:bg-fill-pressed',
  'data-[primary]:bg-accent-soft data-[primary]:text-text-primary',
  'data-[drop=inside]:bg-accent-soft data-[drop=inside]:shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-solid)]',
]);

/** Chevron box: 12px; a leaf renders it empty so labels align. */
export const layerTreeTwistyVariants = cva('ms-[calc(var(--depth)*var(--cs-size-tree-indent))] inline-flex size-icon-xs flex-none items-center justify-center text-text-disabled [&_svg]:size-full [&_svg]:stroke-[1.75]');

/** Kind glyph: 14px, tertiary; accent on the primary row, component tint, disabled when hidden. */
export const layerTreeIconVariants = cva([
  'inline-flex size-icon-sm flex-none items-center justify-center text-text-tertiary [&_svg]:size-full [&_svg]:stroke-[1.75]',
  'group-data-[component]:text-identity-iris group-data-[primary]:text-accent-text group-data-[hidden]:text-text-disabled',
]);

export const layerTreeLabelVariants = cva('min-w-0 flex-1 truncate group-data-[component]:text-info-text group-data-[hidden]:text-text-disabled');

/** Type tag after the name: 18px, info tint. */
export const layerTreeTagVariants = cva('inline-flex h-4.5 flex-none items-center rounded-xs bg-info-soft px-1.25 text-micro text-info-text');

/** Trailing cluster. Any svg a consumer puts here is 14px and tertiary (accent on the primary row, disabled on a hidden row). */
export const layerTreeEndVariants = cva([
  'ms-auto flex flex-none items-center gap-1',
  '[&_svg]:size-icon-sm [&_svg]:flex-none [&_svg]:stroke-[1.75] [:where(&)_svg]:text-text-tertiary',
  'group-data-[primary]:[&_svg]:text-accent-text group-data-[hidden]:[&_svg]:text-text-disabled',
]);

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
    'group-data-[primary]:text-accent-text',
  ],
  {
    variants: {
      kind: {
        visibility: 'group-data-[hidden]:text-text-disabled group-data-[hidden]:opacity-100',
        lock: 'group-data-[locked]:text-text-disabled group-data-[locked]:opacity-100',
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
