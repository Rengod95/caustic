'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { Kbd } from '../kbd/index.ts';

export interface CanvasHintProps extends ComponentProps<'div'> {}

/** The key hints shown at the bottom of the canvas while a gesture runs. The canvas host centers it, 14px above the bottom edge. */
export function CanvasHint({ className, ...props }: CanvasHintProps) {
  return (
    <div
      aria-hidden
      data-slot="canvas-hint"
      className={cn('glass glass-thick flex h-control-md items-center gap-2.5 rounded-xl px-3 text-footnote whitespace-nowrap text-text-secondary', className)}
      {...props}
    />
  );
}

export interface CanvasHintItemProps extends ComponentProps<'span'> {
  /** The key text (⇧, ⌥, esc). */
  keys: string;
}

/** One hint: a key cap and what the key does (children). */
export function CanvasHintItem({ keys, children, className, ...props }: CanvasHintItemProps) {
  return (
    <span data-slot="canvas-hint-item" className={cn('inline-flex items-center gap-0.75', className)} {...props}>
      <Kbd data-slot="canvas-hint-key" className="h-icon-md rounded-xs text-ui-xs font-medium">{keys}</Kbd>
      <span data-slot="canvas-hint-label">{children}</span>
    </span>
  );
}
