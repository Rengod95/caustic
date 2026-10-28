import { cva, type VariantProps } from 'class-variance-authority';

// variant is the capsule: glass = regular glass with elevation 3 (the specimen); solid = surface.raised; soft =
// neutral.track; outline = border.default hairline; ghost = no surface, no padding (the old appearance "bare", for use
// inside a FloatingBar). shadow drives the glass elevation (glass-shadow-N) and the plain shadow alike.
export const zoomControlVariants = cva(
  'inline-flex items-center gap-0.5 rounded-toolbar',
  {
    variants: {
      variant: {
        glass: 'glass p-1',
        solid: 'bg-surface-raised p-1',
        soft: 'bg-neutral-track p-1',
        outline: 'bg-transparent p-1 shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
        ghost: 'bg-transparent p-0',
      },
      // The own corner is the toolbar radius (14px), which has no common key: xl stands for it and keeps it.
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: {
        none: 'shadow-none [--cs-shadow:none]', '1': 'glass-shadow-1 shadow-1', '2': 'glass-shadow-2 shadow-2', '3': 'glass-shadow-3', '4': 'glass-shadow-4 shadow-4', '5': 'glass-shadow-5 shadow-5',
      },
    },
    defaultVariants: { variant: 'glass', radius: 'xl', shadow: '3' },
  },
);

export const zoomButtonVariants = cva(
  [
    'inline-grid shrink-0 place-items-center select-none rounded-toolbar-item bg-transparent text-text-secondary',
    'transition-[background-color,box-shadow,color] duration-120 ease-out',
    // Pressed reads as neutral.pressed (owner 2026-10-28): the canvas may apply the zoom late, so the button answers the press itself.
    'outline-none hover:bg-neutral-hover hover:text-text-primary active:bg-neutral-pressed focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:text-disabled-text',
    '[&_svg]:size-icon-sm [&_svg]:stroke-[1.75]',
  ],
  {
    variants: { size: { xs: 'size-control-xs', sm: 'size-control-inline', md: 'size-control-sm', lg: 'size-control-md' } },
    defaultVariants: { size: 'md' },
  },
);

// tone colours the value (text.primary when neutral, the specimen).
export const zoomReadoutVariants = cva(
  'inline-flex items-center font-mono',
  {
    variants: {
      readout: {
        menu: [
          'gap-1 rounded-toolbar-item bg-transparent pl-2.5 pr-1.5 text-mono-strong select-none',
          'transition-[background-color,box-shadow] duration-120 ease-out outline-none hover:bg-neutral-hover focus-visible:shadow-focus',
        ],
        static: 'h-control-inline px-1 text-mono-md',
      },
      tone: {
        neutral: 'text-text-primary',
        accent: 'text-accent-text',
        success: 'text-success-text',
        warning: 'text-warning-text',
        danger: 'text-danger-text',
        info: 'text-info-text',
        agent: 'text-agent-text',
      },
      size: { xs: '', sm: '', md: '', lg: '' },
    },
    compoundVariants: [
      { readout: 'menu', size: 'xs', className: 'h-control-xs' },
      { readout: 'menu', size: 'sm', className: 'h-control-inline' },
      { readout: 'menu', size: 'md', className: 'h-control-sm' },
      { readout: 'menu', size: 'lg', className: 'h-control-md' },
    ],
    defaultVariants: { readout: 'menu', tone: 'neutral', size: 'md' },
  },
);

export type ZoomControlVariantProps = VariantProps<typeof zoomControlVariants>;
