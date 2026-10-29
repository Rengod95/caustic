import { cva, type VariantProps } from 'class-variance-authority';

// Rest fills are neutral.track with a neutral.tint shimmer highlight (a quiet band on dark surfaces for long loads,
// owner 2026-10-28 B; a hue: its soft 3 / soft-hover 4), never the hover or selected interaction
// fills. Common props (owner 2026-10-26):
//   variant solid (default) = the fill with the slow shimmer (today); soft = the fill, still (no shimmer); outline = no
//           fill, a 1px tone border edge; ghost = no fill, only the shimmer band passing over
//   tone    the hue of the fill (neutral = today)
//   radius  corner token (full for text lines by default, so a line reads as text, owner 2026-10-28 A; lg for tiles)
//   shadow  elevation (flat by default)
//   size    line height when no height is given: xs 6, sm 8, md 10 (today), lg 14
export const skeletonVariants = cva(
  [
    'block w-(--skeleton-w) shrink-0',
    'bg-[length:300%_100%] motion-reduce:bg-none',
  ],
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: {
        solid: 'animate-slide [animation-duration:var(--cs-duration-shimmer)]',
        soft: '',
        outline: 'bg-transparent',
        ghost: 'bg-transparent animate-slide [animation-duration:var(--cs-duration-shimmer)]',
      },
      radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
      size: { xs: 'h-1.5', sm: 'h-2', md: 'h-2.5', lg: 'h-3.5' },
    },
    compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'bg-neutral-track bg-[linear-gradient(90deg,var(--cs-color-neutral-track)_25%,var(--cs-color-neutral-tint)_50%,var(--cs-color-neutral-track)_75%)]' },
    { variant: 'solid', tone: 'accent', className: 'bg-accent-soft bg-[linear-gradient(90deg,var(--cs-color-accent-soft)_25%,var(--cs-color-accent-soft-hover)_50%,var(--cs-color-accent-soft)_75%)]' },
    { variant: 'solid', tone: 'success', className: 'bg-success-soft bg-[linear-gradient(90deg,var(--cs-color-success-soft)_25%,var(--cs-color-success-soft-hover)_50%,var(--cs-color-success-soft)_75%)]' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-soft bg-[linear-gradient(90deg,var(--cs-color-warning-soft)_25%,var(--cs-color-warning-soft-hover)_50%,var(--cs-color-warning-soft)_75%)]' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-soft bg-[linear-gradient(90deg,var(--cs-color-danger-soft)_25%,var(--cs-color-danger-soft-hover)_50%,var(--cs-color-danger-soft)_75%)]' },
    { variant: 'solid', tone: 'info', className: 'bg-info-soft bg-[linear-gradient(90deg,var(--cs-color-info-soft)_25%,var(--cs-color-info-soft-hover)_50%,var(--cs-color-info-soft)_75%)]' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-soft bg-[linear-gradient(90deg,var(--cs-color-agent-soft)_25%,var(--cs-color-agent-soft-hover)_50%,var(--cs-color-agent-soft)_75%)]' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-track' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
    { variant: 'outline', tone: 'neutral', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'ghost', tone: 'neutral', className: 'bg-[linear-gradient(90deg,transparent_25%,var(--cs-color-neutral-tint)_50%,transparent_75%)]' },
    { variant: 'ghost', tone: 'accent', className: 'bg-[linear-gradient(90deg,transparent_25%,var(--cs-color-accent-soft)_50%,transparent_75%)]' },
    { variant: 'ghost', tone: 'success', className: 'bg-[linear-gradient(90deg,transparent_25%,var(--cs-color-success-soft)_50%,transparent_75%)]' },
    { variant: 'ghost', tone: 'warning', className: 'bg-[linear-gradient(90deg,transparent_25%,var(--cs-color-warning-soft)_50%,transparent_75%)]' },
    { variant: 'ghost', tone: 'danger', className: 'bg-[linear-gradient(90deg,transparent_25%,var(--cs-color-danger-soft)_50%,transparent_75%)]' },
    { variant: 'ghost', tone: 'info', className: 'bg-[linear-gradient(90deg,transparent_25%,var(--cs-color-info-soft)_50%,transparent_75%)]' },
    { variant: 'ghost', tone: 'agent', className: 'bg-[linear-gradient(90deg,transparent_25%,var(--cs-color-agent-soft)_50%,transparent_75%)]' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'solid', radius: 'full', shadow: 'none', size: 'md' },
  },
);
export type SkeletonVariantProps = VariantProps<typeof skeletonVariants>;
