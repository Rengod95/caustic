import { cva } from 'class-variance-authority';

export const clarificationVariants = cva('grid gap-1.5');

export const clarificationQuestionVariants = cva('font-voice text-voice-sm text-text-primary');

export const clarificationOptionVariants = cva([
  'group grid grid-cols-[var(--cs-icon-lg)_1fr] gap-2 rounded-lg p-2.5 text-left font-ui text-ui-dense text-text-primary',
  'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] outline-none transition-[box-shadow,background-color] duration-120 ease-out',
  'hover:bg-fill-hover focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-42',
  'data-[state=checked]:bg-accent-soft data-[state=checked]:shadow-focus-field',
]);

export const clarificationRadioVariants = cva(
  'pointer-events-none inline-grid size-check shrink-0 place-items-center rounded-full bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-control)] group-data-[state=checked]:bg-accent-solid group-data-[state=checked]:shadow-none',
);
