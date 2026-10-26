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

// The divider role (PROPOSAL E15), not a border token used as a fill.
export const floatingBarSeparatorVariants = cva('shrink-0 bg-divider-line', {
  variants: { orientation: { horizontal: 'mx-1 h-control-2xs w-px', vertical: 'my-1 h-px w-control-2xs' } },
  defaultVariants: { orientation: 'horizontal' },
});

export const floatingBarItemVariants = cva(
  [
    'relative inline-grid shrink-0 place-items-center select-none rounded-toolbar-item font-ui',
    'bg-transparent text-text-secondary',
    'transition-[background-color,box-shadow,color] duration-120 ease-out',
    'outline-none hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus',
    // Disabled is a colour, not opacity.
    'disabled:pointer-events-none disabled:text-disabled-text',
    // One "on" look for a toggled-on item and the current tool: the neutral selection, as IconButton pressed.
    'data-[pressed=true]:bg-neutral-selected data-[pressed=true]:text-text-primary data-[pressed=true]:hover:bg-neutral-selected-hover',
    'data-[active=true]:bg-neutral-selected data-[active=true]:text-text-primary data-[active=true]:hover:bg-neutral-selected-hover',
    'disabled:data-[pressed=true]:bg-disabled-fill disabled:data-[pressed=true]:text-disabled-text disabled:data-[active=true]:bg-disabled-fill disabled:data-[active=true]:text-disabled-text',
    'data-[agent=true]:agent-rim data-[agent=true]:text-text-primary',
    // Disabled drops the tone: a disabled agent item loses the spectrum rim and takes disabled-text, as Button agent.
    'disabled:data-[agent=true]:text-disabled-text disabled:data-[agent=true]:after:hidden',
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
