'use client';
import type { ComponentProps, CSSProperties, PointerEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';
import { CanvasSizeLabel } from '../canvas-size-label/index.ts';
import {
  canvasSelectionHandleClass, canvasSelectionHandlePosition, canvasSelectionLabelClass, canvasSelectionRotateClass, canvasSelectionVariants,
  type CanvasSelectionHandle,
} from './canvas-selection.variants.ts';

export type CanvasSelectionHandleName = CanvasSelectionHandle | 'rotate';

const ALL: CanvasSelectionHandle[] = ['tl', 'tm', 'tr', 'ml', 'mr', 'bl', 'bm', 'br'];
const CORNERS: CanvasSelectionHandle[] = ['tl', 'tr', 'bl', 'br'];

export interface CanvasSelectionProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** selected = outline, handles, label; hover = ring only. */
  mode?: 'selected' | 'hover';
  /** Which resize handles: all eight, the four corners, or none (a locked object). */
  handles?: 'all' | 'corners' | 'none';
  /** Show the rotate handle above the top edge. */
  rotate?: boolean;
  /** Size chip text, e.g. "180 × 44". Omit to hide it. */
  label?: ReactNode;
  /** Corner radius of the hovered or selected object in px. Default 2. */
  radius?: number;
  /** The object bounds in px from the canvas host origin. */
  rect?: OverlayRect;
  /** A handle is being dragged: the size chip stays visible and the handles keep the pressed state. */
  dragging?: boolean;
  /** A handle is pressed; the canvas host starts the resize or rotate gesture. */
  onHandlePointerDown?: (info: { handle: CanvasSelectionHandleName; event: PointerEvent }) => void;
}

/** The human selection on the canvas. Always accent, never spectrum, so a person is distinct from agent work (see AgentWorkArea). Drawn for pointer use: aria-hidden. */
export function CanvasSelection({
  mode = 'selected', handles = 'all', rotate = false, label, radius, rect, dragging = false, onHandlePointerDown, className, style, ...props
}: CanvasSelectionProps) {
  const selected = mode === 'selected';
  const shown = selected ? (handles === 'all' ? ALL : handles === 'corners' ? CORNERS : []) : [];
  const vars = radius !== undefined ? ({ '--obj-r': `${radius}px` } as CSSProperties) : undefined;
  return (
    <div
      aria-hidden
      data-slot="canvas-selection"
      data-mode={mode}
      data-state={dragging ? 'dragging' : undefined}
      className={cn(canvasSelectionVariants({ mode }), radius !== undefined && 'rounded-(--obj-r)', className)}
      style={overlayRectStyle(rect, { ...vars, ...style })}
      {...props}
    >
      {shown.map(h => (
        <i
          key={h}
          data-slot="canvas-selection-handle"
          data-handle={h}
          className={cn(canvasSelectionHandleClass, canvasSelectionHandlePosition[h])}
          onPointerDown={event => onHandlePointerDown?.({ handle: h, event })}
        />
      ))}
      {selected && rotate && (
        <span data-slot="canvas-selection-rotate" className={canvasSelectionRotateClass} onPointerDown={event => onHandlePointerDown?.({ handle: 'rotate', event })} />
      )}
      {selected && label != null && (
        <CanvasSizeLabel data-slot="canvas-selection-label" className={canvasSelectionLabelClass}>{label}</CanvasSizeLabel>
      )}
    </div>
  );
}
