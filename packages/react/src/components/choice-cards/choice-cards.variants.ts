import { cva } from 'class-variance-authority';

export const choiceCardsRoot = cva('grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,calc(var(--spacing)*45)),1fr))] gap-2.5');

export const choiceCardItem = cva([
  'group grid grid-cols-[1fr_auto] items-start gap-1 rounded-xl bg-surface-base p-3.5 text-left font-ui text-text-primary',
  'shadow-[0_0_0_1px_var(--cs-color-border-default)] transition-[box-shadow,background-color] duration-120 ease-out',
  'outline-none hover:shadow-[0_0_0_1px_var(--cs-color-border-default)]',
  'data-[state=checked]:bg-accent-soft data-[state=checked]:shadow-[var(--cs-focus-field)]',
  'focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-42',
]);

export const choiceCardIndicator = cva(
  [
    'col-start-2 row-start-1 inline-grid size-check shrink-0 place-items-center bg-surface-base pointer-events-none',
    'shadow-[inset_0_0_0_1px_var(--cs-color-border-control)]',
    'group-data-[state=checked]:bg-accent-solid group-data-[state=checked]:shadow-none',
  ],
  { variants: { type: { single: 'rounded-full', multiple: 'rounded-sm text-accent-on' } }, defaultVariants: { type: 'single' } },
);
