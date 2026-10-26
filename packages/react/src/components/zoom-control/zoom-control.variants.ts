import { cva, type VariantProps } from 'class-variance-authority';

export const zoomControlVariants = cva(
  'inline-flex items-center gap-0.5 rounded-toolbar',
  {
    variants: {
      appearance: {
        glass: 'glass glass-shadow-3 p-1',
        bare: 'bg-transparent p-0',
      },
    },
    defaultVariants: { appearance: 'glass' },
  },
);

export const zoomButtonVariants = cva(
  [
    'inline-grid shrink-0 place-items-center select-none rounded-toolbar-item bg-transparent text-text-secondary',
    'transition-[background-color,box-shadow,color] duration-120 ease-out',
    'outline-none hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:text-disabled-text',
    '[&_svg]:size-icon-sm [&_svg]:stroke-[1.75]',
  ],
  {
    variants: { size: { md: 'size-control-sm', sm: 'size-control-inline' } },
    defaultVariants: { size: 'md' },
  },
);

export const zoomReadoutVariants = cva(
  'inline-flex items-center font-mono text-text-primary',
  {
    variants: {
      readout: {
        menu: [
          'gap-1 rounded-toolbar-item bg-transparent pl-2.5 pr-1.5 text-mono-strong select-none',
          'transition-[background-color,box-shadow] duration-120 ease-out outline-none hover:bg-neutral-hover focus-visible:shadow-focus',
        ],
        static: 'h-control-inline px-1 text-mono-md',
      },
      size: { md: '', sm: '' },
    },
    compoundVariants: [
      { readout: 'menu', size: 'md', className: 'h-control-sm' },
      { readout: 'menu', size: 'sm', className: 'h-control-inline' },
    ],
    defaultVariants: { readout: 'menu', size: 'md' },
  },
);

export type ZoomControlVariantProps = VariantProps<typeof zoomControlVariants>;
