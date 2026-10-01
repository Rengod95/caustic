'use client';
import { Frame } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';
import { frameLabelMarkerVariants, frameLabelSizeVariants, frameLabelVariants } from './frame-label.variants.ts';

export interface FrameLabelProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** artboard = canvas label with a diamond and mono size; frame = quiet label with a frame icon and sans size. */
  kind?: 'artboard' | 'frame';
  /** Frame name. */
  name: string;
  /** Dimensions text, e.g. "960 × 600". */
  size?: string;
  /** The frame is selected: the label takes the accent text color (artboard only). */
  selected?: boolean;
  /** Position in px from the canvas host origin. */
  rect?: OverlayRect;
}

/** The name and size of a frame, written above it on the canvas. Decorative over the canvas: the name is also the layer name. */
export function FrameLabel({ kind = 'artboard', name, size, selected = false, rect, className, style, ...props }: FrameLabelProps) {
  return (
    <div
      aria-hidden
      data-slot="frame-label"
      data-kind={kind}
      data-state={selected ? 'selected' : undefined}
      className={cn(frameLabelVariants({ kind }), kind === 'artboard' && selected && 'text-accent-text', className)}
      style={overlayRectStyle(rect, style)}
      {...props}
    >
      <span data-slot="frame-label-marker" className={frameLabelMarkerVariants({ kind })}>
        {kind === 'frame' && <Frame />}
      </span>
      <span data-slot="frame-label-name">{name}</span>
      {size != null && <span data-slot="frame-label-size" className={frameLabelSizeVariants({ kind })}>{size}</span>}
    </div>
  );
}
