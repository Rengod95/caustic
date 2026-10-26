import { cva, type VariantProps } from 'class-variance-authority';

export const segmentedControlVariants = cva(
  'inline-flex gap-0.5 p-1 bg-bg-inset shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
  {
    variants: {
      appearance: {
        raised: '',
        outline: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
        subtle: 'bg-transparent shadow-none',
      },
      shape: { rounded: 'rounded-xl', pill: 'rounded-full' },
      size: { xs: '', md: '' },
      orientation: { horizontal: 'flex-row', vertical: 'flex-col items-stretch' },
    },
    compoundVariants: [{ shape: 'rounded', size: 'xs', className: 'rounded-lg' }],
    defaultVariants: { appearance: 'raised', shape: 'rounded', size: 'md', orientation: 'horizontal' },
  },
);

export const segmentedItemVariants = cva(
  [
    'inline-flex shrink-0 items-center gap-1.25 whitespace-nowrap font-ui font-medium text-text-secondary',
    'transition-[color,background-color,box-shadow] duration-base ease-out outline-none',
    'hover:text-text-primary focus-visible:shadow-focus',
    // Raised: the segment thumb (control family). Outline and subtle: neutral selection (compound variants).
    'data-[state=checked]:bg-control-raised data-[state=checked]:text-text-primary',
    'data-[state=checked]:shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)] data-[state=checked]:focus-visible:shadow-focus',
    // Disabled is a colour, not opacity: the label takes disabled.text and a checked segment flattens to disabled.fill.
    'disabled:pointer-events-none disabled:text-disabled-text disabled:data-[state=checked]:bg-disabled-fill disabled:data-[state=checked]:text-disabled-text disabled:data-[state=checked]:shadow-none',
    '[&_svg]:shrink-0 [&_svg]:stroke-[1.75]',
  ],
  {
    variants: {
      appearance: { raised: '', outline: '', subtle: '' },
      shape: { rounded: '', pill: 'rounded-full' },
      size: {
        xs: 'h-control-compact-xs px-2 text-ui-sm',
        md: 'h-control-inline px-2.5 text-ui-dense',
      },
      content: { label: '', icon: 'px-1.75' },
      orientation: { horizontal: 'justify-center', vertical: 'justify-start [&_svg]:size-icon-sm' },
    },
    compoundVariants: [
      { shape: 'rounded', size: 'xs', className: 'rounded-sm' },
      { shape: 'rounded', size: 'md', className: 'rounded-md' },
      { orientation: 'horizontal', className: '[&_svg]:size-icon-md' },
      { appearance: 'outline', className: 'data-[state=checked]:bg-neutral-selected data-[state=checked]:shadow-none data-[state=checked]:focus-visible:shadow-focus' },
      { appearance: 'subtle', className: 'data-[state=checked]:bg-neutral-selected data-[state=checked]:shadow-none data-[state=checked]:focus-visible:shadow-focus' },
    ],
    defaultVariants: { appearance: 'raised', shape: 'rounded', size: 'md', content: 'label', orientation: 'horizontal' },
  },
);

export type SegmentedControlVariantProps = VariantProps<typeof segmentedControlVariants>;
