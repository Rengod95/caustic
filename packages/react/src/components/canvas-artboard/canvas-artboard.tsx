'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';

export interface CanvasArtboardProps extends ComponentProps<'div'> {
  /** Bounds in px from the canvas host origin. */
  rect?: OverlayRect;
}

/** The sheet of a frame on the canvas. It is the user content layer: its fill never follows the interface theme. */
export function CanvasArtboard({ rect, className, style, ...props }: CanvasArtboardProps) {
  return (
    <div
      data-slot="canvas-artboard"
      className={cn('absolute top-(--rect-t) left-(--rect-l) h-(--rect-h) w-(--rect-w) rounded-2xs bg-canvas-artboard shadow-artboard', className)}
      style={overlayRectStyle(rect, style)}
      {...props}
    />
  );
}
