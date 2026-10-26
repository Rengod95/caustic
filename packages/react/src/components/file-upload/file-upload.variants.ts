import { cva, type VariantProps } from 'class-variance-authority';

// The dashed edge is an outline (inside the box, no layout shift), never a border.
// Neutral outline emphasis: hover and drag-over add the neutral hover fill and step the edge to border-strong (6 → 7).
// Disabled is a colour (disabled fill, edge and text), not opacity; the raised icon tile goes flat to the disabled fill and edge.
export const dropzoneVariants = cva([
  'group grid cursor-pointer justify-items-center gap-2 rounded-2xl px-4 py-6.5 text-center text-ui text-text-primary',
  'outline-[1.5px] outline-dashed outline-border-control -outline-offset-[1.5px]',
  'transition-[background-color,outline-color,box-shadow] duration-120 ease-out',
  'hover:bg-neutral-hover hover:outline-neutral-border-strong data-[dragging]:bg-neutral-hover data-[dragging]:outline-neutral-border-strong',
  'focus-visible:shadow-focus',
  'data-[disabled]:pointer-events-none data-[disabled]:bg-disabled-fill data-[disabled]:text-disabled-text data-[disabled]:outline-disabled-border',
  'data-[disabled]:[&_[data-slot^=file-upload-dropzone-]]:text-disabled-text',
]);

export const fileItemVariants = cva(
  'grid grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-xl bg-surface-translucent py-2.5 pl-3 pr-2.5',
  {
    variants: {
      status: {
        done: 'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
        uploading: 'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
        warning: 'shadow-[0_0_0_1px_var(--cs-color-warning-border-strong)]',
        error: 'shadow-[0_0_0_1px_var(--cs-color-danger-border-strong)]',
      },
    },
    defaultVariants: { status: 'done' },
  },
);
export type FileItemVariantProps = VariantProps<typeof fileItemVariants>;
