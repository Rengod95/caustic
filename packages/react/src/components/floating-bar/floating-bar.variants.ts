import { cva, type VariantProps } from 'class-variance-authority';

export const floatingBarVariants = cva(
  'glass inline-flex items-center gap-0.5 rounded-toolbar',
  {
    variants: {
      size: {
        lg: 'glass-shadow-4 p-1',
        md: 'glass-shadow-3 p-1',
        sm: 'glass-shadow-4 p-0.75',
      },
      orientation: { horizontal: '', vertical: 'flex-col' },
    },
    defaultVariants: { size: 'lg', orientation: 'horizontal' },
  },
);

export const floatingBarGroupVariants = cva('inline-flex items-center gap-0.5', {
  variants: { orientation: { horizontal: '', vertical: 'flex-col' } },
  defaultVariants: { orientation: 'horizontal' },
});

export const floatingBarSeparatorVariants = cva('shrink-0 bg-border-default', {
  variants: { orientation: { horizontal: 'mx-1 h-control-2xs w-px', vertical: 'my-1 h-px w-control-2xs' } },
  defaultVariants: { orientation: 'horizontal' },
});

export const floatingBarItemVariants = cva(
  [
    'relative inline-grid shrink-0 place-items-center select-none rounded-toolbar-item font-ui',
    'bg-transparent text-text-secondary',
    'transition-[background-color,box-shadow,color] duration-120 ease-out',
    'outline-none hover:bg-fill-pressed hover:text-text-primary focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:opacity-42',
    'data-[pressed=true]:bg-fill-selected data-[pressed=true]:text-text-primary',
    'data-[active=true]:bg-ink-solid data-[active=true]:text-ink-on data-[active=true]:shadow-[0_0_0_1px_var(--cs-color-control-edge)]',
    'data-[agent=true]:agent-rim data-[agent=true]:text-text-primary',
  ],
  {
    variants: {
      size: {
        lg: 'size-toolbar-item',
        md: 'size-toolbar-item-md',
        sm: 'size-control-sm',
      },
    },
    defaultVariants: { size: 'lg' },
  },
);

export const floatingBarIconVariants = cva('inline-grid place-items-center [&_svg]:size-full [&_svg]:stroke-[1.75]', {
  variants: { size: { lg: 'size-icon-md', md: 'size-icon-sm', sm: 'size-icon-sm' } },
  defaultVariants: { size: 'lg' },
});

export type FloatingBarVariantProps = VariantProps<typeof floatingBarVariants>;
