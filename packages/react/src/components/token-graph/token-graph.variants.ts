import { cva } from 'class-variance-authority';

export const tokenGraphVariants = cva('relative h-graph-h w-full overflow-hidden rounded-xl bg-bg-canvas canvas-grid');

export const tokenGraphWiresVariants = cva('pointer-events-none absolute inset-0 size-full');

export const tokenGraphWireVariants = cva('fill-none stroke-border-strong stroke-[1.5px] data-[traced]:stroke-accent-solid data-[traced]:stroke-2');

export const tokenGraphTierVariants = cva('absolute top-2.5 text-caption text-text-tertiary uppercase', {
  variants: { at: { start: 'left-4', center: 'left-[38%]', end: 'right-4' } },
  defaultVariants: { at: 'start' },
});

export const tokenGraphNodeVariants = cva(
  [
    'group absolute top-(--y) left-(--x) grid w-graph-node-w cursor-pointer gap-0.5 rounded-lg px-2.5 py-1.75 font-ui text-ui-xs outline-none',
    'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
    'focus-visible:shadow-focus',
  ],
  {
    variants: {
      // Traced keeps its accent ring inside the outer focus ring, so a focused traced node shows both.
      traced: { true: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-solid)] data-[traced]:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-solid),var(--cs-focus)]', false: '' },
      // Missing is the danger subtle error container (D5, same as tool-call failed): tint 2 fill, danger border 6 edge, kept inside the focus ring.
      missing: { true: 'bg-danger-tint shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] data-[missing]:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border),var(--cs-focus)]', false: '' },
    },
    defaultVariants: { traced: false, missing: false },
  },
);

export const tokenGraphNameVariants = cva('truncate py-px font-mono text-mono-sm text-text-primary group-data-[missing]:text-danger-text');

export const tokenGraphMetaVariants = cva('flex items-center gap-1.25 text-ui-xs font-normal text-text-tertiary');

export const tokenGraphSwatchVariants = cva('size-2.5 shrink-0 rounded-xs bg-(--swatch) shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]');

export const tokenGraphPortVariants = cva(
  [
    'pointer-events-none absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-surface-base',
    'shadow-[inset_0_0_0_1px_var(--cs-color-border-control)]',
    'group-data-[traced]:bg-accent-solid group-data-[traced]:shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-solid)]',
  ],
  { variants: { side: { in: '-left-1', out: '-right-1' } }, defaultVariants: { side: 'in' } },
);
