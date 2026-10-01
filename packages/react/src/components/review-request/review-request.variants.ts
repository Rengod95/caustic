import { cva } from 'class-variance-authority';

/** Floating thick-glass panel. Non-modal. */
export const reviewRequestVariants = cva('glass glass-thick grid gap-3 rounded-3xl px-inset-regular-x py-inset-regular-y text-text-primary shadow-4');
export const reviewHeaderVariants = cva('flex items-center gap-2.5');
export const reviewOrbVariants = cva('orb [--orb:var(--cs-size-orb-md)] [--orb-hole:var(--cs-size-orb-md-hole)] [&[data-slot]]:rounded-full');
export const reviewTitleVariants = cva('text-title-3 text-text-primary');
export const reviewSubtitleVariants = cva('text-footnote text-text-tertiary');
export const reviewSummaryVariants = cva('flex flex-wrap gap-2');
export const reviewActionsVariants = cva('flex justify-end gap-2');
