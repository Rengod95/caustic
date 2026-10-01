import { cva, type VariantProps } from 'class-variance-authority';

export const thinkingLabelVariants = cva('', {
  variants: { status: { thinking: 'shimmer', done: 'text-text-tertiary' } },
  defaultVariants: { status: 'thinking' },
});

export type ThinkingVariantProps = VariantProps<typeof thinkingLabelVariants>;
