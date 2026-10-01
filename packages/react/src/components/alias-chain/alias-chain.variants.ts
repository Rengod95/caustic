import { cva } from 'class-variance-authority';

/** The chain: a wrapping line of mono names, tertiary. */
export const aliasChainVariants = cva('m-0 flex list-none flex-wrap items-center gap-1.5 p-0 font-mono text-mono-md font-normal text-text-tertiary');

export const aliasChainItemVariants = cva('');

/** Arrow glyph: 12px, inherits the tertiary color. */
export const aliasChainArrowVariants = cva('inline-flex size-icon-xs flex-none items-center justify-center [&_svg]:size-full [&_svg]:stroke-[1.75]');

/** The name the chain resolves to: primary text, medium weight. */
export const aliasChainResolvedVariants = cva('font-medium text-text-primary');
