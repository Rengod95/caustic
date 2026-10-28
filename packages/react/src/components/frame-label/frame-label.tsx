'use client';
import { Frame } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { SIZES, type Radius, type Shadow, type Size, type Tone, type Variant } from '../../lib/common-props.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';
import { frameLabelMarkerVariants, frameLabelSizeVariants, frameLabelVariants } from './frame-label.variants.ts';

export interface FrameLabelProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** artboard = canvas label with a diamond and mono size; frame = quiet label with a frame icon and sans size. */
  kind?: 'artboard' | 'frame';
  /** Frame name. */
  name: string;
  /** Dimensions text, e.g. "960 × 600". */
  dimensions?: string | undefined;
  /**
   * Type step of the label (xs | sm | md | lg; md is the canvas label). Any other string is the dimensions text.
   * @deprecated as dimensions text: use `dimensions`. Only the Size values are the scale.
   */
  size?: Size | (string & {}) | undefined;
  /** Colour family of the label (and of the tag fill or edge). */
  tone?: Tone | undefined;
  /** ghost (default) = text only; solid, soft and outline turn the label into a tag. */
  variant?: Variant | undefined;
  /** Corner radius of the label tag; unset = none. */
  radius?: Radius | undefined;
  /** Elevation of the label tag; unset = none. */
  shadow?: Shadow | undefined;
  /** The frame is selected: the label takes canvas.selection, the colour of the selection outline (artboard only). */
  selected?: boolean;
  /** Position in px from the canvas host origin. */
  rect?: OverlayRect;
}

/** The name and size of a frame, written above it on the canvas. Decorative over the canvas: the name is also the layer name. */
export function FrameLabel({ kind = 'artboard', name, dimensions, size, selected = false, rect, tone, variant, radius, shadow, className, style, ...props }: FrameLabelProps) {
  // Deprecated alias: a size that is not a scale step is the dimensions text (call sites before the common props).
  const scale = (SIZES as readonly string[]).includes(size ?? '') ? (size as Size) : undefined;
  const dims = dimensions ?? (scale === undefined ? size : undefined);
  return (
    <div
      aria-hidden
      data-slot="frame-label"
      data-kind={kind}
      data-state={selected ? 'selected' : undefined}
      className={cn(frameLabelVariants({ kind, tone, variant, radius, shadow, size: scale }), kind === 'artboard' && selected && 'text-canvas-selection', className)}
      style={overlayRectStyle(rect, style)}
      {...props}
    >
      <span data-slot="frame-label-marker" className={frameLabelMarkerVariants({ kind })}>
        {kind === 'frame' && <Frame />}
      </span>
      {/* A long name ends in an ellipsis at popover-sm; the size stays visible (owner B); the full name is the layer name. */}
      <span data-slot="frame-label-name" className="max-w-popover-sm min-w-0 truncate">{name}</span>
      {dims != null && <span data-slot="frame-label-size" className={frameLabelSizeVariants({ kind })}>{dims}</span>}
    </div>
  );
}
