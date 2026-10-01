'use client';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';
import { CanvasSizeLabel } from '../canvas-size-label/index.ts';
import { canvasMarqueeLabelVariants, canvasMarqueeVariants } from './canvas-marquee.variants.ts';

export interface CanvasMarqueeProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** marquee = selection rectangle; draw = ghost of the shape being created. */
  kind?: 'marquee' | 'draw';
  /** Size chip text for draw, e.g. "150 × 96". */
  label?: ReactNode;
  /** Rectangle bounds in px from the canvas host origin. */
  rect?: OverlayRect;
}

/** The rectangle a person drags on the canvas. Drawn for pointer use: aria-hidden and not focusable. */
export function CanvasMarquee({ kind = 'marquee', label, rect, className, style, ...props }: CanvasMarqueeProps) {
  return (
    <div aria-hidden data-slot="canvas-marquee" data-kind={kind} className={cn(canvasMarqueeVariants({ kind }), className)} style={overlayRectStyle(rect, style)} {...props}>
      {kind === 'draw' && label != null && (
        <CanvasSizeLabel data-slot="canvas-marquee-label" className={canvasMarqueeLabelVariants()}>{label}</CanvasSizeLabel>
      )}
    </div>
  );
}
