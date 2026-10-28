'use client';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';
import { canvasArtboardLabelClass, canvasArtboardVariants } from './canvas-artboard.variants.ts';

/** Common props: variant / tone the sheet (solid = the artboard fill, own), radius its corner, shadow its elevation, size the outline weight. */
export interface CanvasArtboardProps extends ComponentProps<'div'>, CommonProps {
  /** Bounds in px from the canvas host origin. */
  rect?: OverlayRect;
  /** Optional frame title drawn 6px above the top-start corner (canvas.label, footnote), like a design tool. */
  label?: ReactNode;
}

/** The sheet of a frame on the canvas. It is the user content layer: its fill never follows the interface theme. */
export function CanvasArtboard({ rect, label, tone, variant, radius, shadow, size, className, style, children, ...props }: CanvasArtboardProps) {
  return (
    <div
      data-slot="canvas-artboard"
      className={cn(canvasArtboardVariants({ tone, variant, radius, shadow, size }), className)}
      style={overlayRectStyle(rect, style)}
      {...props}
    >
      {label != null && <span data-slot="canvas-artboard-label" className={canvasArtboardLabelClass}>{label}</span>}
      {children}
    </div>
  );
}
