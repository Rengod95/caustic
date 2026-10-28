'use client';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { canvasRulerBandLabelVariants, canvasRulerBandVariants, canvasRulerMarkVariants, canvasRulerVariants } from './canvas-ruler.variants.ts';

export interface CanvasRulerProps extends Omit<ComponentProps<'div'>, 'children'>, CommonProps {
  /** Which strip: the top ruler, the left ruler or the corner block between them. */
  orientation?: 'horizontal' | 'vertical' | 'corner';
  /** Labels and their positions along the strip, in px from its start. */
  marks?: { at: number; label: string }[];
  /**
   * Selection range in px along the strip. startLabel / endLabel are the selection's start and end values (e.g. "258",
   * "438"), drawn in the band colour just outside each end, like a design tool's ruler. The host computes them.
   */
  band?: { start: number; size: number; startLabel?: string; endLabel?: string };
}

/** One measuring strip of the canvas (top, left or the corner between them). Decorative: exact values are in the inspector. */
export function CanvasRuler({ orientation = 'horizontal', marks, band, tone, variant, radius, shadow, size, className, ...props }: CanvasRulerProps) {
  const o = orientation;
  const strip = o !== 'corner';
  return (
    <div aria-hidden data-slot="canvas-ruler" data-orientation={o} className={cn(canvasRulerVariants({ orientation: o, radius, shadow, size }), className)} {...props}>
      {strip &&
        marks?.map(m => (
          <span key={m.at} data-slot="canvas-ruler-mark" className={canvasRulerMarkVariants({ orientation: o })} style={{ '--at': `${m.at}px` } as CSSProperties}>
            {m.label}
          </span>
        ))}
      {strip && band && (
        <span
          data-slot="canvas-ruler-band"
          className={cn(canvasRulerBandVariants({ orientation: o, tone, variant }))}
          style={{ '--at': `${band.start}px`, '--size': `${band.size}px` } as CSSProperties}
        >
          {band.startLabel != null && <span data-slot="canvas-ruler-band-label" data-edge="start" className={canvasRulerBandLabelVariants({ orientation: o, edge: 'start' })}>{band.startLabel}</span>}
          {band.endLabel != null && <span data-slot="canvas-ruler-band-label" data-edge="end" className={canvasRulerBandLabelVariants({ orientation: o, edge: 'end' })}>{band.endLabel}</span>}
        </span>
      )}
    </div>
  );
}
