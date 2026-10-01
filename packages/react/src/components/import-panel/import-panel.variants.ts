import { cva } from 'class-variance-authority';

export const importPanelVariants = cva('grid gap-3.5');
export const importPanelOptionsVariants = cva('grid grid-cols-2 items-center gap-1.5');
export const importPanelDeviceVariants = cva('justify-self-end');
export const importPanelFooterVariants = cva('flex items-center justify-between gap-2');
export const importPanelNoteVariants = cva('text-hint text-text-tertiary');
