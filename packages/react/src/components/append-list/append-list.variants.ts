import { cva } from 'class-variance-authority';

/** Opaque inline surface (never glass, P1): surface base and a hairline edge, no elevation (one depth cue). */
export const appendListVariants = cva(
  'overflow-hidden rounded-2xl bg-surface-base font-ui text-ui-dense text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
);

/** Header row: title at the start, one IconButton xs at the end. */
export const appendListHeadingVariants = cva('flex items-center justify-between px-3 py-2.5 text-ui-dense font-semibold text-text-primary');

export const appendListTitleVariants = cva('min-w-0 truncate');

export const appendListActionVariants = cva('flex flex-none items-center');

/** The ul: list style removed. */
export const appendListListVariants = cva('m-0 list-none p-0');

/** One summary row: auto / 1fr / auto with a 1px subtle top edge. */
export const appendListRowVariants = cva('grid grid-cols-[auto_1fr_auto] items-center gap-2 border-t border-border-subtle px-3 py-1.5 text-ui-dense text-text-primary');

/** Leading glyph: 14px, neutral graphic, decorative (no status hue). */
export const appendListIconVariants = cva('inline-flex size-icon-sm flex-none items-center justify-center text-neutral-graphic [&_svg]:size-full [&_svg]:stroke-[1.75]');

export const appendListTextVariants = cva('min-w-0 truncate');

export const appendListDescriptionVariants = cva('text-text-tertiary');

export const appendListEndVariants = cva('inline-flex items-center');

/** The add row: full width, dashed strong top edge, plus glyph and label. */
export const appendListAddVariants = cva(
  [
    'flex w-full cursor-pointer items-center gap-1.5 border-0 border-t border-dashed border-border-strong bg-transparent px-3 py-2.25 text-left text-ui-dense text-text-secondary outline-none',
    'transition-[background-color,color] duration-120 ease-out hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus',
    '[&_svg]:size-icon-sm [&_svg]:flex-none [&_svg]:stroke-[1.75]',
  ],
);
