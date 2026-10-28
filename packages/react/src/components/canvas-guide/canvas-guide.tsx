'use client';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';
import { canvasGuideLabelVariants, canvasGuideVariants } from './canvas-guide.variants.ts';

/** Common props: tone / variant colour the line, radius / shadow its box, size the stroke (2px at lg). */
export interface CanvasGuideProps extends Omit<ComponentProps<'div'>, 'children'>, CommonProps {
  /** smart = canvas guide magenta snap guide, user = info blue guide placed by the person, measure = distance with a value, snap = mark at a snapped corner. */
  kind?: 'smart' | 'user' | 'measure' | 'snap';
  orientation?: 'horizontal' | 'vertical';
  /** Position and length in px from the canvas host origin. */
  rect?: OverlayRect;
  /** Measure only: the value text. */
  children?: ReactNode;
}

/** A guide, measurement or snap mark drawn over the canvas. Decorative; the measured value is also in the inspector. */
export function CanvasGuide({ kind = 'smart', orientation = 'horizontal', rect, tone, variant, radius, shadow, size, children, className, style, ...props }: CanvasGuideProps) {
  return (
    <div
      aria-hidden
      data-slot="canvas-guide"
      data-kind={kind}
      data-orientation={orientation}
      className={cn(canvasGuideVariants({ kind, orientation, tone, variant, radius, shadow, size }), className)}
      style={overlayRectStyle(rect, style)}
      {...props}
    >
      {kind === 'measure' && children != null && <b data-slot="canvas-guide-label" className={canvasGuideLabelVariants()}>{children}</b>}
    </div>
  );
}
