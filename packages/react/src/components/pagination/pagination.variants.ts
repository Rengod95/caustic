import { cva, type VariantProps } from 'class-variance-authority';

export const paginationVariants = cva('items-center font-ui', {
  variants: {
    layout: {
      numbered: 'flex flex-wrap gap-1',
      compact: 'flex w-full justify-between gap-2',
    },
  },
  defaultVariants: { layout: 'numbered' },
});

/** Prev, Next and page-number buttons share one flat control look; the current page lifts like a raised control. */
export const paginationButton = cva([
  'inline-flex h-control-md min-h-control-md min-w-control-md items-center justify-center gap-1 rounded-md px-2',
  'font-ui text-ui tabular-nums text-text-secondary outline-none select-none',
  'transition-[background-color,color,box-shadow] duration-120 ease-out',
  'hover:bg-fill-hover hover:text-text-primary focus-visible:shadow-focus',
  'disabled:pointer-events-none disabled:opacity-42',
  'aria-[current=page]:bg-control-raised aria-[current=page]:font-semibold aria-[current=page]:text-text-primary',
  'aria-[current=page]:shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)]',
]);

export const paginationGap = cva('px-1 font-ui text-ui text-text-disabled');

export type PaginationVariantProps = VariantProps<typeof paginationVariants>;
