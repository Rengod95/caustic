'use client';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { skeletonVariants } from './skeleton.variants.ts';

export interface SkeletonProps extends Omit<ComponentProps<'div'>, 'children'>, CommonProps {
  /** Pixels or any CSS length such as "70%". */
  width?: number | string;
  /** Pixels or any CSS length. Without it the size sets the line height (md = 10px). */
  height?: number | string;
}

const len = (v: number | string) => (typeof v === 'number' ? `${v}px` : v);

/** Decorative loading placeholder; the surrounding region carries aria-busy. */
export function Skeleton({ width = '100%', height, tone, variant, radius, shadow, size, className, style, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton" data-radius={radius ?? 'full'} aria-hidden="true"
      className={cn(skeletonVariants({ tone, variant, radius, size, shadow: shadow ?? null }), height !== undefined && 'h-(--skeleton-h)', className)}
      style={{ '--skeleton-w': len(width), ...(height !== undefined ? { '--skeleton-h': len(height) } : {}), ...style } as CSSProperties} {...props}
    />
  );
}
