'use client';
import { useRef, type ComponentProps, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { radiusClass, shadowClass, type CommonProps } from '../../lib/common-props.ts';
import { clamp, round } from '../../lib/color-math.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { colorPickerPlaneThumbVariants, colorPickerPlaneVariants } from './color-picker-plane.variants.ts';

export interface PlaneValue { s: number; v: number }

/**
 * Common props (lib/common-props.ts): variant = the frame (default outline: 1px inset edge), tone = the frame colour
 * (default neutral = swatch.edge), size = the thumb (xs 12 · sm 14 · md 16 · lg 20; the plane stays 150 high), radius = corners
 * (default xl), shadow = elevation (default none).
 */
export interface ColorPickerPlaneProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'>, CommonProps {
  /** aria-label of the thumb ("Saturation and brightness"). Required; no built-in default. */
  label: string;
  /** aria-valuetext from the rounded percentages. Without it the thumb has no aria-valuetext. */
  valueText?: ((saturation: number, brightness: number) => string) | undefined;
  /** Controlled saturation and brightness, both 0-1. */
  value?: PlaneValue;
  defaultValue?: PlaneValue;
  /** Hue in degrees (0-360). */
  hue?: number;
  /** CSS color at the current value, painted inside the thumb. */
  pickedColor?: string;
  disabled?: boolean;
  onValueChange?: (value: PlaneValue) => void;
  onValueCommit?: (value: PlaneValue) => void;
}

const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'];

/**
 * ColorPicker.Plane: saturation (horizontal) and brightness (vertical) of one hue; drag the thumb or use the arrow keys.
 * ColorPicker renders it for the plane section; it also works on its own.
 */
export function ColorPickerPlane({ label, valueText, value, defaultValue = { s: 0, v: 1 }, hue = 0, pickedColor, disabled = false, onValueChange, onValueCommit, tone, variant, radius, shadow, size, className, style, ...props }: ColorPickerPlaneProps) {
  const [current, setCurrent] = useControllableState<PlaneValue>({ value, defaultValue, onChange: onValueChange });
  const latest = useRef(current); latest.current = current;
  const dragging = useRef(false);
  const set = (next: PlaneValue) => { latest.current = next; setCurrent(next); };
  const fromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    set({ s: round(clamp((e.clientX - rect.left) / rect.width, 0, 1), 3), v: round(1 - clamp((e.clientY - rect.top) / rect.height, 0, 1), 3) });
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
    fromPointer(e);
    e.currentTarget.querySelector<HTMLElement>('[role="slider"]')?.focus({ preventScroll: true });
  };
  const move = (e: PointerEvent<HTMLDivElement>) => { if (dragging.current) fromPointer(e); };
  const up = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    onValueCommit?.(latest.current);
  };
  const keyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return;
    const d = e.shiftKey ? 0.1 : 0.01;
    const { s, v } = latest.current;
    let next: PlaneValue | null = null;
    if (e.key === 'ArrowRight') next = { s: round(clamp(s + d, 0, 1)), v };
    else if (e.key === 'ArrowLeft') next = { s: round(clamp(s - d, 0, 1)), v };
    else if (e.key === 'ArrowUp') next = { s, v: round(clamp(v + d, 0, 1)) };
    else if (e.key === 'ArrowDown') next = { s, v: round(clamp(v - d, 0, 1)) };
    else if (e.key === 'Home') next = { s: 0, v };
    else if (e.key === 'End') next = { s: 1, v };
    if (!next) return;
    e.preventDefault();
    set(next);
  };
  const keyUp = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (!disabled && keys.includes(e.key)) onValueCommit?.(latest.current);
  };
  const vars = {
    ...style,
    '--plane-color': `hsl(${Math.round(hue * 100) / 100} 100% 50%)`,
    '--plane-x': `${current.s * 100}%`,
    '--plane-y': `${(1 - current.v) * 100}%`,
    ...(pickedColor ? { '--plane-picked': pickedColor } : {}),
  } as CSSProperties;
  return (
    <div
      data-slot="color-picker-plane" data-disabled={disabled || undefined}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      className={cn(colorPickerPlaneVariants({ frame: variant, frameTone: tone }), radius && radius !== 'xl' && radiusClass[radius], shadow && shadow !== 'none' && shadowClass[shadow], className)}
      style={vars} {...props}
    >
      <span
        data-slot="color-picker-plane-thumb" role="slider" tabIndex={disabled ? -1 : 0}
        aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(current.s * 100)} aria-disabled={disabled || undefined}
        aria-valuetext={valueText?.(Math.round(current.s * 100), Math.round(current.v * 100))}
        onKeyDown={keyDown} onKeyUp={keyUp}
        className={colorPickerPlaneThumbVariants({ thumbSize: size })}
      />
    </div>
  );
}
