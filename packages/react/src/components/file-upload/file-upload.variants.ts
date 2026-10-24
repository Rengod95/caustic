import { cva, type VariantProps } from 'class-variance-authority';

// The dashed edge is an outline (inside the box, no layout shift), never a border.
export const dropzoneVariants = cva([
  'group grid cursor-pointer justify-items-center gap-2 rounded-2xl px-4 py-6.5 text-center text-ui text-text-primary',
  'outline-[1.5px] outline-dashed outline-border-control -outline-offset-[1.5px]',
  'transition-[background-color,outline-color,box-shadow] duration-120 ease-out',
  'hover:bg-accent-soft hover:outline-accent-solid data-[dragging]:bg-accent-soft data-[dragging]:outline-accent-solid',
  'focus-visible:shadow-focus',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-42',
]);

export const fileItemVariants = cva(
  'grid grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-xl bg-surface-translucent py-2.5 pl-3 pr-2.5',
  {
    variants: {
      status: {
        done: 'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
        uploading: 'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
        error: 'shadow-[0_0_0_1px_var(--cs-color-danger-solid)]',
      },
    },
    defaultVariants: { status: 'done' },
  },
);
export type FileItemVariantProps = VariantProps<typeof fileItemVariants>;
