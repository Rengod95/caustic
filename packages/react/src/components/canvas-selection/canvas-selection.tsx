'use client';
import type { ComponentProps, CSSProperties, PointerEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Radius } from '../../lib/common-props.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';
import {
  canvasSelectionHandlePosition, canvasSelectionHandleVariants, canvasSelectionLabelVariants, canvasSelectionRotateVariants, canvasSelectionVariants,
  type CanvasSelectionHandle,
} from './canvas-selection.variants.ts';

export type CanvasSelectionHandleName = CanvasSelectionHandle | 'rotate';
export type CanvasSelectionMode = 'select' | 'hover' | 'marquee' | 'draw';

const ALL: CanvasSelectionHandle[] = ['tl', 'tm', 'tr', 'ml', 'mr', 'bl', 'bm', 'br'];
const CORNERS: CanvasSelectionHandle[] = ['tl', 'tr', 'bl', 'br'];

export interface CanvasSelectionProps extends Omit<ComponentProps<'div'>, 'children'>, Omit<CommonProps, 'radius'> {
  /** select = outline, handles, label; hover = ring only; marquee = dashed selection rectangle; draw = dashed ghost of a shape being created. */
  mode?: CanvasSelectionMode;
  /** Which resize handles (select only): all eight, the four corners, or none (a locked object). */
  handles?: 'all' | 'corners' | 'none';
  /** Show the rotate handle above the top edge (select only). */
  rotate?: boolean;
  /** Size chip text, e.g. "180 × 44" (select, marquee, draw). Omit to hide it. */
  label?: ReactNode;
  /** A custom label part (a CanvasSelectionLabel with its own variant), drawn in place of the label chip. */
  children?: ReactNode;
  /**
   * Corner radius of the box, by radius token (default 2xs: each mode's own corners, square for marquee).
   * A number is the deprecated px form: use objectRadius.
   */
  radius?: Radius | number;
  /** Corner radius of the hovered or selected object in px, so the outline or ring follows the object. Wins over radius. */
  objectRadius?: number;
  /** The object (or dragged rectangle) bounds in px from the canvas host origin. */
  rect?: OverlayRect;
  /** A handle is being dragged: the size chip stays visible and the handles keep the pressed state. */
  dragging?: boolean;
  /** A handle is pressed; the canvas host starts the resize or rotate gesture. */
  onHandlePointerDown?: (info: { handle: CanvasSelectionHandleName; event: PointerEvent }) => void;
}

/**
 * The human selection on the canvas, and the other rects a person draws there (hover ring, marquee, draw ghost). Accent
 * by default, never spectrum, so a person is distinct from agent work (see AgentWorkArea). Drawn for pointer use: aria-hidden.
 */
export function CanvasSelection({
  mode = 'select', handles = 'all', rotate = false, label, children, tone, variant, radius, objectRadius, shadow, size, rect, dragging = false, onHandlePointerDown, className, style, ...props
}: CanvasSelectionProps) {
  const select = mode === 'select';
  const shown = select ? (handles === 'all' ? ALL : handles === 'corners' ? CORNERS : []) : [];
  const px = objectRadius ?? (typeof radius === 'number' ? radius : undefined);
  const token = typeof radius === 'string' ? radius : undefined;
  const vars = px !== undefined ? ({ '--obj-r': `${px}px` } as CSSProperties) : undefined;
  // The dragged rectangles are tinted by default (soft); the selection and hover ring are the line only (outline).
  const look = variant ?? (mode === 'marquee' || mode === 'draw' ? 'soft' : 'outline');
  return (
    <div
      aria-hidden
      data-slot="canvas-selection"
      data-mode={mode}
      data-state={dragging ? 'dragging' : undefined}
      className={cn(canvasSelectionVariants({ mode, tone, variant: look, radius: token, shadow, size }), px !== undefined && 'rounded-(--obj-r)', className)}
      style={overlayRectStyle(rect, { ...vars, ...style })}
      {...props}
    >
      {shown.map(h => (
        <i
          key={h}
          data-slot="canvas-selection-handle"
          data-handle={h}
          className={cn(canvasSelectionHandleVariants({ size }), canvasSelectionHandlePosition[h])}
          onPointerDown={event => onHandlePointerDown?.({ handle: h, event })}
        />
      ))}
      {select && rotate && (
        <span data-slot="canvas-selection-rotate" className={cn(canvasSelectionRotateVariants({ size }))} onPointerDown={event => onHandlePointerDown?.({ handle: 'rotate', event })} />
      )}
      {mode !== 'hover' && (children ?? (label != null && <CanvasSelectionLabel tone={tone} size={size}>{label}</CanvasSelectionLabel>))}
    </div>
  );
}

export interface CanvasSelectionLabelProps extends ComponentProps<'span'>, CommonProps {}

/**
 * The size chip (formerly CanvasSizeLabel): a pill under the rect reporting its size, e.g. "180 × 44". CanvasSelection
 * draws it from `label`; render it as a child only for a chip with its own variant, radius or shadow. Decorative.
 */
export function CanvasSelectionLabel({ tone, variant, radius, shadow, size, className, ...props }: CanvasSelectionLabelProps) {
  return (
    <span
      aria-hidden
      data-slot="canvas-selection-label"
      className={cn(canvasSelectionLabelVariants({ chipTone: tone, chipVariant: variant, chipRadius: radius, chipShadow: shadow, chipSize: size }), className)}
      {...props}
    />
  );
}
