'use client';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import { canvasRulerBandVariants, canvasRulerMarkVariants, canvasRulerVariants } from './canvas-ruler.variants.ts';

export interface CanvasRulerProps extends Omit<ComponentProps<'div'>, 'children'> {
  orientation?: 'horizontal' | 'vertical' | 'corner';
  /** Labels and their positions along the strip, in px from its start. */
  marks?: { at: number; label: string }[];
  /** Selection range in px along the strip. */
  band?: { start: number; size: number };
}

/** One measuring strip of the canvas (top, left or the corner between them). Decorative: exact values are in the inspector. */
export function CanvasRuler({ orientation = 'horizontal', marks, band, className, ...props }: CanvasRulerProps) {
  const o = orientation;
  const strip = o !== 'corner';
  return (
    <div aria-hidden data-slot="canvas-ruler" data-orientation={o} className={cn(canvasRulerVariants({ orientation: o }), className)} {...props}>
      {strip &&
        marks?.map(m => (
          <span key={m.at} data-slot="canvas-ruler-mark" className={canvasRulerMarkVariants({ orientation: o })} style={{ '--at': `${m.at}px` } as CSSProperties}>
            {m.label}
          </span>
        ))}
      {strip && band && (
        <span
          data-slot="canvas-ruler-band"
          className={canvasRulerBandVariants({ orientation: o })}
          style={{ '--at': `${band.start}px`, '--size': `${band.size}px` } as CSSProperties}
        />
      )}
    </div>
  );
}
