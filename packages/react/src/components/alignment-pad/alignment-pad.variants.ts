import { cva, type VariantProps } from 'class-variance-authority';

export const alignmentPadVariants = cva(
  'grid size-pad-box shrink-0 grid-cols-3 grid-rows-3 gap-0.5 rounded-lg bg-fill-hover p-1.5 font-ui shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] aria-disabled:pointer-events-none aria-disabled:opacity-42',
);

export const alignmentPadCell = cva(
  'group grid cursor-pointer place-items-center rounded-xs bg-transparent outline-none focus-visible:shadow-focus',
);

// Off: a dot. On: three bars along the flow; the centre bar is the mark, the other two are its pseudo-elements.
export const alignmentPadMark = cva('relative block transition-colors duration-120 ease-out', {
  variants: {
    checked: {
      false: 'size-1 rounded-full bg-text-disabled group-hover:bg-text-secondary',
      true: 'rounded-2xs bg-accent-solid before:absolute before:rounded-2xs before:bg-accent-solid after:absolute after:rounded-2xs after:bg-accent-solid',
    },
    orientation: { row: '', column: '' },
  },
  compoundVariants: [
    { checked: true, orientation: 'row', className: 'h-3 w-0.5 before:-left-1 before:h-3 before:w-0.5 after:-right-1 after:h-3 after:w-0.5' },
    { checked: true, orientation: 'column', className: 'h-0.5 w-3 before:-top-1 before:h-0.5 before:w-3 after:-bottom-1 after:h-0.5 after:w-3' },
  ],
  defaultVariants: { checked: false, orientation: 'row' },
});

export type AlignmentPadVariantProps = VariantProps<typeof alignmentPadVariants>;
