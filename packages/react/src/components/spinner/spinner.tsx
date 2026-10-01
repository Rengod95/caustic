'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { spinnerVariants, type SpinnerVariantProps } from './spinner.variants.ts';

export interface SpinnerProps extends Omit<ComponentProps<'span'>, 'children'>, SpinnerVariantProps {
  /** Accessible name (aria-label). */
  label?: string;
  /** aria-hidden with no role; use inside a control that already says it is busy. */
  decorative?: boolean;
}

/** Indeterminate progress ring. Prefer Progress when the amount is known. */
export function Spinner({ size, tone, label = 'Loading', decorative = false, className, ...props }: SpinnerProps) {
  return (
    <span
      data-slot="spinner"
      data-tone={tone ?? 'default'}
      data-size={size ?? 'md'}
      role={decorative ? undefined : 'status'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      className={cn(spinnerVariants({ tone, size }), className)}
      {...props}
    />
  );
}
