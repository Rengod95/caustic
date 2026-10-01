import { cva, type VariantProps } from 'class-variance-authority';

export const progressVariants = cva('relative block h-progress-h w-full overflow-hidden rounded-sm bg-fill-pressed', {
  variants: { tone: { default: '', agent: '' } },
  defaultVariants: { tone: 'default' },
});

export const progressIndicator = cva('block h-full w-(--progress) rounded-[inherit] transition-[width] duration-320 ease-out', {
  variants: {
    tone: { default: 'bg-accent-solid', agent: 'spectrum-line animate-slide' },
    indeterminate: { true: 'w-[35%] animate-indeterminate', false: '' },
  },
  defaultVariants: { tone: 'default', indeterminate: false },
});
export type ProgressVariantProps = VariantProps<typeof progressVariants>;
