import { cva, type VariantProps } from 'class-variance-authority';

export const sliderVariants = cva(
  'group relative flex min-w-0 flex-1 touch-none select-none items-center data-[disabled]:pointer-events-none data-[disabled]:opacity-42',
  {
    variants: {
      appearance: { default: '', gradient: '', alpha: '', ruler: 'h-slider-ruler-h' },
      size: { sm: 'h-4', md: 'h-5', lg: 'h-control-inline' },
    },
    // The ruler is the same height at every size.
    compoundVariants: [{ appearance: 'ruler', size: ['sm', 'md', 'lg'], className: 'h-slider-ruler-h' }],
    defaultVariants: { appearance: 'default', size: 'md' },
  },
);

export const sliderTrack = cva('relative grow', {
  variants: {
    appearance: {
      default: 'h-1 overflow-hidden rounded-xs bg-fill-selected',
      gradient: 'h-3 rounded-sm bg-(image:--track) shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
      alpha: [
        'h-3 rounded-sm shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
        'bg-[image:var(--track),conic-gradient(var(--cs-color-canvas-checker-b)_25%,var(--cs-color-canvas-checker-a)_0_50%,var(--cs-color-canvas-checker-b)_0_75%,var(--cs-color-canvas-checker-a)_0)]',
        'bg-size-[100%_100%,calc(var(--spacing)*2)_calc(var(--spacing)*2)]',
      ],
      ruler: [
        'h-slider-ruler-h rounded-none bg-no-repeat',
        'bg-[repeating-linear-gradient(90deg,var(--cs-color-border-strong)_0_1px,transparent_1px_10%),repeating-linear-gradient(90deg,var(--cs-color-text-tertiary)_0_1px,transparent_1px_50%)]',
        'bg-position-[0_60%,0_100%] bg-size-[100%_30%,calc(100%_+_1px)_55%]',
      ],
    },
    size: { sm: '', md: '', lg: '' },
  },
  compoundVariants: [{ appearance: ['gradient', 'alpha'], size: 'lg', className: 'h-4.5 rounded-lg' }],
  defaultVariants: { appearance: 'default', size: 'md' },
});

export const sliderThumb = cva(
  [
    'relative block rounded-full bg-control-thumb shadow-thumb outline-none transition-transform duration-120 ease-out',
    'before:absolute before:-inset-1.5 before:content-[""]',
    'hover:scale-[1.08] group-active:scale-[1.18] focus-visible:shadow-focus',
  ],
  {
    variants: {
      appearance: {
        default: '',
        gradient: 'size-4.5 bg-(color:--swatch) shadow-thumb-swatch focus-visible:shadow-focus',
        alpha: 'size-4.5 bg-(color:--swatch) shadow-thumb-swatch focus-visible:shadow-focus',
        ruler: 'h-slider-ruler-h w-0.5 rounded-xs bg-accent-solid shadow-none hover:scale-100 group-active:scale-100',
      },
      size: { sm: 'size-3', md: 'size-4', lg: 'size-5' },
    },
    compoundVariants: [
      { appearance: ['gradient', 'alpha'], size: ['sm', 'md', 'lg'], className: 'size-4.5' },
      { appearance: 'ruler', size: ['sm', 'md', 'lg'], className: 'h-slider-ruler-h w-0.5' },
    ],
    defaultVariants: { appearance: 'default', size: 'md' },
  },
);

export type SliderVariantProps = VariantProps<typeof sliderVariants>;
