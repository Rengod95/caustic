import { cva, type VariantProps } from 'class-variance-authority';

// Meter (C-05): a bounded gauge. The track is neutral; only the bar takes a threshold tone (normal neutral, warning, danger).
export const meterVariants = cva('relative block w-full overflow-hidden rounded-full bg-neutral-track', {
  variants: { size: { sm: 'h-1', md: 'h-progress-h' } },
  defaultVariants: { size: 'md' },
});

export const meterIndicator = cva('block h-full w-(--cs-meter) rounded-[inherit] transition-[width] duration-base ease-standard', {
  variants: { level: { normal: 'bg-neutral-solid', warning: 'bg-warning-solid', danger: 'bg-danger-solid' } },
  defaultVariants: { level: 'normal' },
});

export type MeterVariantProps = VariantProps<typeof meterVariants>;
