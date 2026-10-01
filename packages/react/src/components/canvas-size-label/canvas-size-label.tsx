'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';

export interface CanvasSizeLabelProps extends ComponentProps<'span'> {}

/** The selection-colored chip that reports a size under a selection or a shape being drawn, e.g. "180 × 44". Decorative; the parent positions it. */
export function CanvasSizeLabel({ className, ...props }: CanvasSizeLabelProps) {
  return (
    <span
      aria-hidden
      data-slot="canvas-size-label"
      className={cn('inline-flex h-4.5 items-center rounded-sm bg-canvas-selection px-1.5 font-mono text-mono-sm whitespace-nowrap text-canvas-selection-on', className)}
      {...props}
    />
  );
}
