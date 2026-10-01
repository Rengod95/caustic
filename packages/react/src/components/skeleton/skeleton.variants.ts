import { cva, type VariantProps } from 'class-variance-authority';

export const skeletonVariants = cva(
  [
    'block h-(--skeleton-h) w-(--skeleton-w) shrink-0 bg-fill-pressed',
    'bg-[linear-gradient(90deg,var(--cs-color-fill-pressed)_25%,var(--cs-color-fill-selected)_50%,var(--cs-color-fill-pressed)_75%)] bg-[length:300%_100%]',
    'animate-slide [animation-duration:var(--cs-duration-shimmer)] motion-reduce:animate-none motion-reduce:bg-none',
  ],
  {
    variants: { radius: { sm: 'rounded-sm', lg: 'rounded-lg' } },
    defaultVariants: { radius: 'sm' },
  },
);
export type SkeletonVariantProps = VariantProps<typeof skeletonVariants>;
