'use client';
import { useRef, type ComponentProps, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { clamp, round } from '../../lib/color-math.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { colorPlaneThumbVariants, colorPlaneVariants } from './color-plane.variants.ts';

export interface PlaneValue { s: number; v: number }

export interface ColorPlaneProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
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

/** Saturation (horizontal) and brightness (vertical) of one hue: drag the thumb or use the arrow keys. */
export function ColorPlane({ label, valueText, value, defaultValue = { s: 0, v: 1 }, hue = 0, pickedColor, disabled = false, onValueChange, onValueCommit, className, style, ...props }: ColorPlaneProps) {
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
    '--plane-hue': Math.round(hue * 100) / 100,
    '--plane-color': `hsl(${Math.round(hue * 100) / 100} 100% 50%)`,
    '--plane-x': `${current.s * 100}%`,
    '--plane-y': `${(1 - current.v) * 100}%`,
    ...(pickedColor ? { '--plane-picked': pickedColor } : {}),
  } as CSSProperties;
  return (
    <div
      data-slot="color-plane" data-disabled={disabled || undefined}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      className={cn(colorPlaneVariants(), className)} style={vars} {...props}
    >
      <span
        data-slot="color-plane-thumb" role="slider" tabIndex={disabled ? -1 : 0}
        aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(current.s * 100)} aria-disabled={disabled || undefined}
        aria-valuetext={valueText?.(Math.round(current.s * 100), Math.round(current.v * 100))}
        onKeyDown={keyDown} onKeyUp={keyUp}
        className={colorPlaneThumbVariants()}
      />
    </div>
  );
}
