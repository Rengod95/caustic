import { cva } from 'class-variance-authority';

export const tokenDiffVariants = cva('grid grid-cols-[1fr_auto_auto_auto] items-center gap-y-1 font-mono text-mono-relaxed');
export const tokenDiffKeyVariants = cva('min-w-0 truncate text-text-secondary');
export const tokenDiffFromVariants = cva('ml-2 rounded-xs bg-diff-remove px-1 text-danger-text line-through');
export const tokenDiffArrowVariants = cva('ml-2 text-text-disabled');
export const tokenDiffToVariants = cva('ml-2 rounded-xs bg-diff-add px-1 text-success-text no-underline');
