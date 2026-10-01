import { cva, type VariantProps } from 'class-variance-authority';

export const stepSliderVariants = cva('', {
  variants: {
    appearance: {
      track: 'grid gap-2',
      segmented: 'grid grid-cols-[repeat(var(--n),minmax(0,1fr))] gap-0.75',
      dots: 'flex items-center gap-2.5',
      bars: [
        'inline-flex h-control-inline items-center gap-1.5 rounded-md px-2 text-ui-sm text-text-secondary outline-none',
        'transition-colors duration-120 hover:bg-fill-pressed hover:text-text-primary focus-visible:shadow-focus',
      ],
    },
  },
  defaultVariants: { appearance: 'track' },
});

/** One radio step: a segment or a dot. The hit area is extended past the visual size. */
export const stepVariants = cva(
  'relative bg-fill-selected outline-none focus-visible:shadow-focus disabled:cursor-not-allowed',
  {
    variants: {
      appearance: {
        track: '',
        bars: '',
        segmented: 'h-2 rounded-xs before:absolute before:-inset-x-0.5 before:-inset-y-2 data-[filled]:bg-text-primary',
        dots: 'size-2.5 rounded-full transition-[transform,background-color] duration-200 ease-spring before:absolute before:-inset-1.75 data-[state=checked]:scale-125 data-[state=checked]:bg-text-primary',
      },
    },
    defaultVariants: { appearance: 'track' },
  },
);

export type StepSliderVariantProps = VariantProps<typeof stepSliderVariants>;
