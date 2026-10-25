import { cva } from 'class-variance-authority';

export const activityTreeVariants = cva('grid gap-3.5');

/** List rows: glyph column, text, auto meta column. */
export const activityStepVariants = cva('grid min-h-7 grid-cols-[var(--cs-size-check)_1fr_auto] items-center gap-2 text-ui-dense text-text-primary');
export const activityCallVariants = cva('grid min-h-7 grid-cols-[var(--cs-size-check)_1fr_auto] items-center gap-2 pl-check text-ui-dense text-text-secondary');
export const activityUnassignedVariants = cva('mt-1.5 grid min-h-7 grid-cols-[var(--cs-size-check)_1fr_auto] items-center gap-2 border-t border-dashed border-border-strong pt-1.5 text-ui-dense text-text-secondary');

export const activityStepGlyphVariants = cva('grid size-icon-md place-items-center [&_svg]:size-icon-sm', {
  variants: { failed: { true: 'text-danger-text', false: 'text-success-text' } },
  defaultVariants: { failed: false },
});
export const activityCallGlyphVariants = cva('grid size-icon-md place-items-center [&_svg]:size-icon-sm', {
  variants: { failed: { true: 'text-danger-text', false: 'text-text-secondary' } },
  defaultVariants: { failed: false },
});

export const activityOrbVariants = cva('mx-0.5 orb orb-sm motion-reduce:animate-none');
export const activityWorkerOrbVariants = cva('orb orb-dot animate-none');
