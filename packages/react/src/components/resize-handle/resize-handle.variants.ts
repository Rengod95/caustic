import { cva, type VariantProps } from 'class-variance-authority';

export const resizeHandleVariants = cva(
  [
    'group/resize-handle flex touch-none select-none items-center justify-center outline-none',
    'focus-visible:shadow-focus',
    'aria-disabled:cursor-default',
  ],
  {
    variants: {
      orientation: {
        vertical: 'w-2 cursor-col-resize',
        horizontal: 'h-2 cursor-row-resize',
      },
    },
    defaultVariants: { orientation: 'vertical' },
  },
);

export const resizeHandleLineVariants = cva(
  [
    'flex-none rounded-full bg-transparent transition-colors duration-quick ease-out motion-reduce:transition-none',
  ],
  {
    variants: {
      // The line is the accent solid. A disabled handle draws no line: disabled is the absence of the affordance,
      // not a faded one.
      disabled: {
        false: 'group-hover/resize-handle:bg-accent-solid group-focus-visible/resize-handle:bg-accent-solid group-active/resize-handle:bg-accent-solid',
        true: 'bg-transparent',
      },
      orientation: {
        vertical: 'h-full w-0.5',
        horizontal: 'h-0.5 w-full',
      },
    },
    defaultVariants: { orientation: 'vertical', disabled: false },
  },
);

export type ResizeHandleVariantProps = VariantProps<typeof resizeHandleVariants>;
