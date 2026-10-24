import { cva } from 'class-variance-authority';

export const autoLayoutVariants = cva('grid grid-cols-[repeat(auto-fit,minmax(min(100%,var(--cs-size-popover-md)),1fr))] gap-4 font-ui aria-disabled:opacity-42');

export const autoLayoutHeading = cva('text-ui-xs font-semibold text-text-tertiary');

export const autoLayoutRow = cva('flex items-center justify-between text-footnote text-text-primary');

// A live illustration: flow, alignment and gap come from the value (--gap is data).
export const autoLayoutPreview = cva(
  'relative flex h-layout-preview gap-(--gap) rounded-xl bg-bg-inset p-2.5 outline outline-1 outline-dashed outline-accent-border -outline-offset-1 transition-all duration-gentle ease-spring',
  {
    variants: {
      flow: { row: 'flex-row', column: 'flex-col', grid: 'flex-row flex-wrap content-start', free: '' },
      justify: { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between' },
      align: { start: 'items-start', center: 'items-center', end: 'items-end' },
    },
    defaultVariants: { flow: 'row', justify: 'start', align: 'center' },
  },
);

export const autoLayoutPreviewItem = cva(
  'w-toolbar-item flex-none rounded-sm bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] transition-all duration-gentle ease-spring',
  {
    variants: {
      size: { a: 'h-control-inline', b: 'h-10', c: 'h-4.5' },
      free: { true: 'absolute top-(--y) left-(--x)', false: '' },
    },
    defaultVariants: { size: 'a', free: false },
  },
);
