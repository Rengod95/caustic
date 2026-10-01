import { cva, type VariantProps } from 'class-variance-authority';

export const toggleGroupVariants = cva(
  'inline-flex gap-0.5 rounded-xl p-1',
  {
    variants: {
      appearance: {
        filled: 'bg-bg-inset shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
        outline: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
      },
      orientation: { horizontal: 'flex-row', vertical: 'flex-col' },
    },
    defaultVariants: { appearance: 'filled', orientation: 'horizontal' },
  },
);

export const toggleGroupItem = cva([
  'inline-grid size-control-md shrink-0 place-items-center rounded-md bg-transparent text-text-secondary',
  'transition-[color,background-color,box-shadow] duration-base ease-out outline-none',
  'hover:text-text-primary focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-42',
  'data-[state=on]:frost data-[state=on]:bg-control-raised data-[state=on]:text-text-primary',
  'data-[state=on]:shadow-[0_0_0_1px_var(--cs-color-control-edge),var(--cs-elevation-1)]',
]);

export type ToggleGroupVariantProps = VariantProps<typeof toggleGroupVariants>;
