import { cva } from 'class-variance-authority';

export const choiceCardsRoot = cva('grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,calc(var(--spacing)*45)),1fr))] gap-2.5');

// The selected card inverts (selected utility, owner 2026-10-26): ink fill, paper text, no edge and no hairline; its
// indicator, description and price invert with it. Hover while selected: selection.fill-hover. Focus keeps the ring only.
// Disabled is a colour (disabled fill, text and edge), not opacity, and drops the inversion: a checked disabled card is
// disabled.fill with a 1.5px disabled edge.
export const choiceCardItem = cva([
  'group grid grid-cols-[1fr_auto] items-start gap-1 rounded-xl bg-surface-base p-3.5 text-left font-ui text-text-primary',
  'shadow-[0_0_0_1px_var(--cs-color-border-default)] transition-[box-shadow,background-color] duration-120 ease-out',
  'outline-none hover:shadow-[0_0_0_1px_var(--cs-color-border-default)]',
  'data-[state=checked]:not-disabled:selected data-[state=checked]:not-disabled:shadow-none data-[state=checked]:not-disabled:hover:bg-selection-fill-hover',
  'focus-visible:shadow-focus data-[state=checked]:not-disabled:focus-visible:shadow-focus',
  'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-[0_0_0_1px_var(--cs-color-disabled-border)]',
  'data-[state=checked]:disabled:shadow-[inset_0_0_0_1.5px_var(--cs-color-disabled-border)]',
  'disabled:[&_[data-slot^=choice-cards-]]:text-disabled-text',
]);

export const choiceCardIndicator = cva(
  [
    'col-start-2 row-start-1 inline-grid size-check shrink-0 place-items-center bg-surface-base pointer-events-none',
    'shadow-[inset_0_0_0_1px_var(--cs-color-border-control)]',
    'group-data-[state=checked]:bg-accent-solid group-data-[state=checked]:shadow-none',
    'group-disabled:bg-disabled-fill group-disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
    // Checked or not, a disabled indicator drops the accent: disabled fill and edge, the dot or check in disabled.text.
    'group-data-[state=checked]:group-disabled:bg-disabled-fill group-data-[state=checked]:group-disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  ],
  { variants: { type: { single: 'rounded-full', multiple: 'rounded-sm text-accent-on' } }, defaultVariants: { type: 'single' } },
);
