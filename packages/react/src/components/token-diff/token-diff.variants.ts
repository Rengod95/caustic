import { cva } from 'class-variance-authority';

export const tokenDiffVariants = cva('grid grid-cols-[1fr_auto_auto_auto] items-center gap-y-1 font-mono text-mono-relaxed');
export const tokenDiffKeyVariants = cva('min-w-0 truncate text-text-secondary');
export const tokenDiffFromVariants = cva('ml-2 rounded-xs bg-diff-remove-bg px-1 text-diff-remove-text line-through');
export const tokenDiffArrowVariants = cva('ml-2 text-text-tertiary');
export const tokenDiffToVariants = cva('ml-2 rounded-xs bg-diff-add-bg px-1 text-diff-add-text no-underline');
