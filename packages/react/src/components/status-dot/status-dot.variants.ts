import { cva, type VariantProps } from 'class-variance-authority';

// StatusDot (C-23): the tone is on the dot only; the label is always text.secondary.
export const statusDotVariants = cva('inline-flex items-center gap-1.5 whitespace-nowrap font-ui');

export const statusDotMarkVariants = cva('inline-block size-1.5 flex-none rounded-full', {
  variants: { tone: { neutral: 'bg-neutral-graphic', success: 'bg-success-graphic', warning: 'bg-warning-graphic', danger: 'bg-danger-graphic', info: 'bg-info-graphic' } },
  defaultVariants: { tone: 'neutral' },
});

export const statusDotLabelVariants = cva('text-ui-dense text-text-secondary');

export type StatusDotVariantProps = VariantProps<typeof statusDotMarkVariants>;
