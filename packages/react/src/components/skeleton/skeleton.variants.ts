import { cva, type VariantProps } from 'class-variance-authority';

export const skeletonVariants = cva(
  [
    'block h-(--skeleton-h) w-(--skeleton-w) shrink-0 bg-neutral-track',
    // Rest fills are neutral.track / neutral.well, never the hover or selected interaction fills.
    'bg-[linear-gradient(90deg,var(--cs-color-neutral-track)_25%,var(--cs-color-neutral-well)_50%,var(--cs-color-neutral-track)_75%)] bg-[length:300%_100%]',
    'animate-slide [animation-duration:var(--cs-duration-shimmer)] motion-reduce:animate-none motion-reduce:bg-none',
  ],
  {
    variants: { radius: { sm: 'rounded-sm', lg: 'rounded-lg' } },
    defaultVariants: { radius: 'sm' },
  },
);
export type SkeletonVariantProps = VariantProps<typeof skeletonVariants>;
