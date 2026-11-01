import { cva, type VariantProps } from 'class-variance-authority';

// A line cell grid: no gap between cells, each cell draws only its top and left line (line-cell), and the clip on the
// layer trims the outer edge, so lines never double. Cross marks sit on a second, unclipped layer.
export const lineGridVariants = cva('relative grid min-w-0 grid-cols-(--line-grid-cols) grid-rows-(--line-grid-rows)');
export const lineGridLayer = cva('col-span-full row-span-full grid min-w-0 grid-cols-subgrid grid-rows-subgrid', {
  variants: {
    layer: { cells: '[clip-path:inset(1px_0_0_1px)]', marks: 'pointer-events-none' },
  },
});
export const lineGridCell = cva('line-cell relative min-h-12 min-w-0 py-3 outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--cs-color-focus-ring)]', {
  variants: {
    density: { regular: 'px-4', compact: 'px-3' },
    kind: { data: 'text-body text-text-primary', head: 'flex items-baseline gap-2' },
    empty: { true: 'line-cell-hatch', false: '' },
    selected: { true: 'bg-neutral-soft', false: '' },
    interactive: { true: 'cursor-pointer', false: '' },
  },
  compoundVariants: [{ interactive: true, selected: false, className: 'hover:bg-neutral-hover' }],
  defaultVariants: { density: 'regular', kind: 'data', empty: false, selected: false, interactive: false },
});
export const lineGridMark = cva('absolute size-icon-sm -translate-x-1/2 -translate-y-1/2 text-grid-mark', {
  variants: {
    x: { start: 'left-0', end: 'left-full' },
    y: { start: 'top-0', end: 'top-full' },
  },
  defaultVariants: { x: 'start', y: 'start' },
});
export const lineGridDot = cva('size-1.5 flex-none rounded-full', {
  variants: { dot: { danger: 'bg-danger-graphic', warning: 'bg-warning-graphic', neutral: 'bg-neutral-graphic' } },
});
export const lineGridItem = cva('flex min-w-0 items-center gap-2 text-body', {
  variants: { muted: { true: 'text-text-tertiary', false: 'text-text-primary' } },
  defaultVariants: { muted: false },
});

export type LineGridVariantProps = VariantProps<typeof lineGridCell>;
