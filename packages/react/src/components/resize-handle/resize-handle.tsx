'use client';
import { useEffect, useRef, type ComponentProps, type KeyboardEvent, type PointerEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { resizeHandleLineVariants, resizeHandleVariants, type ResizeHandleVariantProps } from './resize-handle.variants.ts';

export interface ResizeHandleProps
  extends Omit<ComponentProps<'div'>, 'role' | 'children' | 'defaultValue' | 'aria-label' | 'aria-controls'>,
    ResizeHandleVariantProps {
  /** Controlled size in px. */
  value?: number;
  /** Uncontrolled initial size in px. Defaults to min. */
  defaultValue?: number;
  /** Lowest allowed size in px (aria-valuemin). */
  min: number;
  /** Highest allowed size in px (aria-valuemax). */
  max: number;
  /** Arrow-key step in px. */
  step?: number;
  /** Step in px when Shift is held with an arrow key. */
  largeStep?: number;
  /** Size to return to on double-click. */
  resetValue?: number;
  /** The panel grows toward the handle (a right-hand panel): the direction flips. */
  reverse?: boolean;
  /** Accessible name, supplied by the app so it can be translated. */
  label: string;
  /** Builds aria-valuetext from the size. Without it no aria-valuetext is emitted. */
  formatValueText?: (value: number) => string;
  /** id of the panel being resized (aria-controls). */
  controls?: string;
  disabled?: boolean;
  /** A drag step, an arrow / Home / End key or a double-click changed the size (clamped, rounded px). */
  onValueChange?: (value: number) => void;
  /** A pointer drag began; the payload is the size at that moment. */
  onResizeStart?: (value: number) => void;
  /** A pointer drag ended or was cancelled; the payload is the final size. */
  onResizeEnd?: (value: number) => void;
}

interface Drag { pointerId: number; origin: number; start: number; last: number; moved: boolean }

/** Two presses closer than this count as a double click even where the browser reports a click count of 1. */
const DOUBLE_PRESS_MS = 400;

const preventSelect = (e: Event) => e.preventDefault();

/** Window splitter: a focusable separator that owns one size in px and reports every change. The consumer positions it on the panel edge. */
export function ResizeHandle({
  orientation, value, defaultValue, min, max, step = 8, largeStep = 32, resetValue, reverse = false, label, formatValueText, controls,
  disabled = false, onValueChange, onResizeStart, onResizeEnd, className, onKeyDown, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onLostPointerCapture, onDoubleClick, ...props
}: ResizeHandleProps) {
  const axis = orientation ?? 'vertical';
  const clamp = (n: number) => Math.round(Math.min(max, Math.max(min, n)));
  const [raw, setRaw] = useControllableState({ value, defaultValue: defaultValue ?? min, onChange: onValueChange });
  const now = clamp(raw);
  const set = (n: number) => setRaw(clamp(n));
  const drag = useRef<Drag | null>(null);
  const lastPress = useRef(0);

  useEffect(() => () => document.removeEventListener('selectstart', preventSelect), []);

  const grow = axis === 'vertical' ? (reverse ? 'ArrowLeft' : 'ArrowRight') : (reverse ? 'ArrowUp' : 'ArrowDown');
  const shrink = axis === 'vertical' ? (reverse ? 'ArrowRight' : 'ArrowLeft') : (reverse ? 'ArrowDown' : 'ArrowUp');

  const finish = (restore: boolean) => {
    const d = drag.current; if (!d) return;
    drag.current = null;
    document.removeEventListener('selectstart', preventSelect);
    if (restore) set(d.start);
    onResizeEnd?.(restore ? d.start : d.last);
    if (restore || d.moved) { lastPress.current = 0; return; }
    const at = performance.now();
    if (resetValue !== undefined && at - lastPress.current < DOUBLE_PRESS_MS) { lastPress.current = 0; set(resetValue); } else lastPress.current = at;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;
    if (e.key === 'Escape' && drag.current) { e.preventDefault(); finish(true); return; }
    const delta = e.shiftKey ? largeStep : step;
    if (e.key === grow) set(now + delta);
    else if (e.key === shrink) set(now - delta);
    else if (e.key === 'Home') set(min);
    else if (e.key === 'End') set(max);
    else return;
    e.preventDefault();
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(e);
    if (e.defaultPrevented || disabled || e.button !== 0) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = { pointerId: e.pointerId, origin: axis === 'vertical' ? e.clientX : e.clientY, start: now, last: now, moved: false };
    document.addEventListener('selectstart', preventSelect);
    onResizeStart?.(now);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    const d = drag.current;
    if (!d || e.pointerId !== d.pointerId) return;
    const travel = (axis === 'vertical' ? e.clientX : e.clientY) - d.origin;
    const next = clamp(d.start + (reverse ? -travel : travel));
    d.last = next;
    if (next !== d.start) d.moved = true;
    set(next);
  };

  const endPointer = (e: PointerEvent<HTMLDivElement>, restore: boolean) => {
    if (drag.current && e.pointerId === drag.current.pointerId) {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      finish(restore);
    }
  };

  return (
    <div
      data-slot="resize-handle"
      data-orientation={axis}
      data-disabled={disabled ? '' : undefined}
      role="separator"
      aria-orientation={axis}
      aria-valuenow={now}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={formatValueText?.(now)}
      aria-label={label}
      aria-controls={controls}
      aria-disabled={disabled ? true : undefined}
      tabIndex={disabled ? undefined : 0}
      className={cn(resizeHandleVariants({ orientation: axis }), className)}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={e => { onPointerUp?.(e); endPointer(e, false); }}
      onPointerCancel={e => { onPointerCancel?.(e); endPointer(e, true); }}
      onLostPointerCapture={e => { onLostPointerCapture?.(e); endPointer(e, false); }}
      onDoubleClick={e => { onDoubleClick?.(e); if (!disabled && resetValue !== undefined) set(resetValue); }}
      {...props}
    >
      <span data-slot="resize-handle-line" aria-hidden className={resizeHandleLineVariants({ orientation: axis })} />
    </div>
  );
}
