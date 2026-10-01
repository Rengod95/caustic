import { cva } from 'class-variance-authority';

export const exportControlsVariants = cva('grid gap-3.5');
export const exportControlsScaleVariants = cva('flex items-center justify-between gap-2');
export const exportControlsScaleLabelVariants = cva('text-micro text-text-tertiary');
export const exportControlsActionsVariants = cva('flex items-center justify-between gap-2');
export const exportControlsStatusVariants = cva('flex items-center gap-2 text-ui-sm font-normal text-text-secondary');
export const exportControlsStatusIconVariants = cva('size-icon-sm shrink-0 text-success-text');
