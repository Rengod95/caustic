import { cva, type VariantProps } from 'class-variance-authority';

export const iconButtonVariants = cva(
  [
    'relative inline-grid shrink-0 place-items-center select-none font-ui',
    'transition-[background-color,box-shadow,transform,color] duration-120 ease-out',
    'outline-none focus-visible:shadow-focus',
    // Disabled is a colour, not opacity.
    'disabled:pointer-events-none disabled:text-disabled-text',
  ],
  {
    variants: {
      tone: {
        ghost: [
          'bg-transparent text-text-secondary hover:bg-neutral-hover hover:text-text-primary',
          // Pressed inverts (selected utility: ink fill, paper icon, no edge); disabled drops the inversion.
          'aria-pressed:not-disabled:selected aria-pressed:not-disabled:hover:bg-selection-fill-hover',
          'disabled:aria-pressed:bg-disabled-fill disabled:aria-pressed:text-disabled-text',
        ],
        ink: 'bg-ink-solid text-ink-on shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)] hover:scale-[1.06] disabled:bg-disabled-fill disabled:shadow-none',
      },
      shape: { rounded: '', circle: 'rounded-full' },
      size: {
        xs: 'size-control-xs rounded-sm',
        sm: 'size-control-sm rounded-md',
        md: 'size-control-md rounded-md',
      },
    },
    compoundVariants: [{ shape: 'circle', className: 'rounded-full' }],
    defaultVariants: { tone: 'ghost', shape: 'rounded', size: 'md' },
  },
);

export const iconButtonIconVariants = cva('inline-grid place-items-center [&_svg]:size-full [&_svg]:stroke-[1.75]', {
  variants: {
    size: { xs: 'size-icon-sm', sm: 'size-icon-md', md: 'size-icon-md' },
    tone: { ghost: '', ink: '' },
  },
  compoundVariants: [{ tone: 'ink', size: 'sm', className: 'size-icon-send [&_svg]:stroke-[2.25]' }],
  defaultVariants: { size: 'md', tone: 'ghost' },
});

export type IconButtonVariantProps = VariantProps<typeof iconButtonVariants>;
