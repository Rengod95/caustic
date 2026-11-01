import { cva } from 'class-variance-authority';

// SystemRow (C-25): a muted icon, one secondary line, at most one action.
export const systemRowVariants = cva('flex min-w-0 items-center gap-2.5 font-ui text-ui-sm');
export const systemRowIconVariants = cva('inline-flex shrink-0 items-center text-text-tertiary [&_svg]:size-icon-sm');
export const systemRowTextVariants = cva('min-w-0 flex-1 truncate text-text-secondary');
