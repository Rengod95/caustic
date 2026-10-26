import { cva } from 'class-variance-authority';

export const choiceCardsRoot = cva('grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,calc(var(--spacing)*45)),1fr))] gap-2.5');

// Selected is the neutral selection, never the focus ring, so a focused selected card shows both: the card keeps its
// opaque surface and lays the alpha neutral.selected wash over it, with the 1.5px selection edge and the check indicator.
// Disabled is a colour (disabled fill, text and edge), not opacity; a checked disabled card takes the disabled edge too.
export const choiceCardItem = cva([
  'group grid grid-cols-[1fr_auto] items-start gap-1 rounded-xl bg-surface-base p-3.5 text-left font-ui text-text-primary',
  'shadow-[0_0_0_1px_var(--cs-color-border-default)] transition-[box-shadow,background-color] duration-120 ease-out',
  'outline-none hover:shadow-[0_0_0_1px_var(--cs-color-border-default)]',
  'data-[state=checked]:wash-neutral-selected data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--cs-color-selection-edge)] data-[state=checked]:hover:wash-neutral-selected-hover',
  'focus-visible:shadow-focus data-[state=checked]:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-selection-edge),var(--cs-focus)]',
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
