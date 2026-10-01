import { cva } from 'class-variance-authority';

export const gridTracksVariants = cva('grid gap-3 font-ui aria-disabled:opacity-42');

export const gridTracksHeading = cva('text-ui-xs font-semibold text-text-tertiary');

export const gridTracksRow = cva('flex h-control-md items-center gap-1.5');

export const gridTracksIndex = cva('w-4 shrink-0 font-mono text-mono-sm text-text-tertiary');

// A 32px track so the switch lines up with the NumberField beside it; item radius = track radius - 2px inset (P5).
export const gridTracksUnit = cva('inline-flex h-control-md shrink-0 gap-px rounded-md bg-fill-hover p-0.5');

export const gridTracksUnitItem = cva([
  'h-control-sm cursor-pointer whitespace-nowrap rounded-sm bg-transparent px-1.75 font-ui text-ui-xs font-medium text-text-tertiary outline-none',
  'transition-[color,background-color,box-shadow] duration-120 ease-out hover:text-text-primary focus-visible:shadow-focus',
  'aria-checked:bg-control-raised aria-checked:text-text-primary aria-checked:shadow-[0_0_0_1px_var(--cs-color-control-edge),var(--cs-elevation-1)]',
  'disabled:pointer-events-none',
]);

export const gridTracksAdd = cva([
  'flex h-add-row w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed border-border-strong bg-transparent px-3 font-ui text-ui-dense text-text-secondary outline-none',
  'transition-[color,background-color,box-shadow] duration-120 ease-out hover:bg-fill-hover hover:text-text-primary focus-visible:shadow-focus',
  'disabled:pointer-events-none',
]);
