'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { Kbd } from '../kbd/index.ts';
import { canvasHintVariants } from './canvas-hint.variants.ts';

/** Common props: variant / tone the strip (solid = thick glass, own), radius / shadow its box, size height and type. */
export interface CanvasHintProps extends ComponentProps<'div'>, CommonProps {}

/** The key hints shown at the bottom of the canvas while a gesture runs. The canvas host centers it, 14px above the bottom edge. */
export function CanvasHint({ tone, variant, radius, shadow, size, className, ...props }: CanvasHintProps) {
  return (
    <div
      aria-hidden
      data-slot="canvas-hint"
      className={cn(canvasHintVariants({ tone, variant, radius, shadow, size }), className)}
      {...props}
    />
  );
}

export interface CanvasHintItemProps extends ComponentProps<'span'> {
  /** The key text (⇧, ⌥, esc). */
  keys: string;
}

/** One hint: a raised key cap (control.raised, control edge) and what the key does (children). */
export function CanvasHintItem({ keys, children, className, ...props }: CanvasHintItemProps) {
  return (
    <span data-slot="canvas-hint-item" className={cn('inline-flex items-center gap-0.75', className)} {...props}>
      <Kbd data-slot="canvas-hint-key" className="h-icon-md rounded-xs bg-control-raised text-ui-xs font-medium shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)]">{keys}</Kbd>
      <span data-slot="canvas-hint-label">{children}</span>
    </span>
  );
}
