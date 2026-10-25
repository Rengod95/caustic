import { cva } from 'class-variance-authority';

/** Unapplied agent result: opaque surface, elevation 2 and the spectrum rim. */
export const proposalVariants = cva('agent-rim overflow-hidden rounded-xl bg-surface-base text-text-primary shadow-2');
export const proposalHeaderVariants = cva('flex items-center gap-2 px-3 py-2.5 text-ui-dense font-semibold text-text-primary');
export const proposalOrbVariants = cva('orb orb-sm');
export const proposalBodyVariants = cva('grid gap-2 px-3 pb-2.5');
export const proposalSummaryVariants = cva('m-0 font-voice text-voice-sm text-text-primary');
export const proposalChipsVariants = cva('flex flex-wrap gap-2');
export const proposalFooterVariants = cva('flex flex-wrap gap-1.5 border-t border-border-subtle bg-surface-raised px-3 py-2');
