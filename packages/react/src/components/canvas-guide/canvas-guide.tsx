'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';
import { canvasGuideLabelVariants, canvasGuideVariants } from './canvas-guide.variants.ts';

export interface CanvasGuideProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** smart = coral snap guide, user = iris guide placed by the person, measure = distance with a value, snap = mark at a snapped corner. */
  kind?: 'smart' | 'user' | 'measure' | 'snap';
  orientation?: 'horizontal' | 'vertical';
  /** Position and length in px from the canvas host origin. */
  rect?: OverlayRect;
  /** Measure only: the value text. */
  children?: React.ReactNode;
}

/** A guide, measurement or snap mark drawn over the canvas. Decorative; the measured value is also in the inspector. */
export function CanvasGuide({ kind = 'smart', orientation = 'horizontal', rect, children, className, style, ...props }: CanvasGuideProps) {
  return (
    <div
      aria-hidden
      data-slot="canvas-guide"
      data-kind={kind}
      data-orientation={orientation}
      className={cn(canvasGuideVariants({ kind, orientation }), className)}
      style={overlayRectStyle(rect, style)}
      {...props}
    >
      {kind === 'measure' && children != null && <b data-slot="canvas-guide-label" className={canvasGuideLabelVariants()}>{children}</b>}
    </div>
  );
}
