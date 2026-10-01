'use client';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import { skeletonVariants, type SkeletonVariantProps } from './skeleton.variants.ts';

export interface SkeletonProps extends Omit<ComponentProps<'div'>, 'children'>, SkeletonVariantProps {
  /** Pixels or any CSS length such as "70%". */
  width?: number | string;
  /** Pixels or any CSS length. */
  height?: number | string;
}

const len = (v: number | string) => (typeof v === 'number' ? `${v}px` : v);

/** Decorative loading placeholder; the surrounding region carries aria-busy. */
export function Skeleton({ width = '100%', height = 10, radius, className, style, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton" data-radius={radius ?? 'sm'} aria-hidden="true"
      className={cn(skeletonVariants({ radius }), className)} style={{ '--skeleton-w': len(width), '--skeleton-h': len(height), ...style } as CSSProperties} {...props}
    />
  );
}
