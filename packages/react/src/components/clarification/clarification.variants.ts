import { cva } from 'class-variance-authority';

export const clarificationVariants = cva('grid gap-1.5');

export const clarificationQuestionVariants = cva('font-voice text-voice-sm text-text-primary');

export const clarificationOptionVariants = cva([
  'group grid grid-cols-[var(--cs-icon-lg)_1fr] gap-2 rounded-lg p-2.5 text-left font-ui text-ui-dense text-text-primary',
  'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] outline-none transition-[box-shadow,background-color] duration-120 ease-out',
  'hover:bg-neutral-hover focus-visible:shadow-focus',
  // Selected inverts (selected utility, owner 2026-10-26): ink fill, paper text, no edge; the radio mark and hint invert
  // with it. Hover while selected: selection.fill-hover. Focus keeps the ring only.
  'data-[state=checked]:not-disabled:selected data-[state=checked]:not-disabled:shadow-none',
  'data-[state=checked]:not-disabled:hover:bg-selection-fill-hover data-[state=checked]:not-disabled:focus-visible:shadow-focus',
  // Disabled is a colour: the tone drops out to the disabled text and border; a selected disabled row drops the inversion.
  'disabled:pointer-events-none disabled:text-disabled-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  'data-[state=checked]:disabled:shadow-[inset_0_0_0_1.5px_var(--cs-color-disabled-border)]',
]);

export const clarificationRadioVariants = cva([
  'pointer-events-none inline-grid size-check shrink-0 place-items-center rounded-full bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-control)] group-data-[state=checked]:bg-accent-solid group-data-[state=checked]:shadow-none',
  'group-disabled:bg-disabled-fill group-disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  'group-data-[state=checked]:group-disabled:bg-disabled-fill group-data-[state=checked]:group-disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
]);
