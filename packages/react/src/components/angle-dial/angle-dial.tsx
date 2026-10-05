'use client';
import { useRef, type ComponentProps, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { angleDialHubVariants, angleDialNeedleVariants, angleDialVariants } from './angle-dial.variants.ts';

export interface AngleDialProps extends Omit<ComponentProps<'span'>, 'defaultValue' | 'onChange' | 'children' | 'aria-label'> {
  /** aria-label of the slider ("Angle"). Required; no built-in default. */
  label: string;
  /** aria-valuetext from the angle. Without it the dial has no aria-valuetext. */
  valueText?: ((degrees: number) => string) | undefined;
  /** Controlled angle in degrees, 0-359. */
  value?: number;
  defaultValue?: number;
  /** Arrow step in degrees; Shift and PageUp / PageDown use 15. */
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
}

const wrap = (n: number) => ((Math.round(n) % 360) + 360) % 360;

/** A 32px dial with a short needle: 0 degrees points up, 90 points right. Pair it with an Angle field. */
export function AngleDial({ label, valueText, value, defaultValue = 0, step = 1, disabled = false, onValueChange, onValueCommit, className, style, onKeyDown, onKeyUp, ...props }: AngleDialProps) {
  const [current, setCurrent] = useControllableState<number>({ value, defaultValue, onChange: onValueChange });
  const latest = useRef(current); latest.current = current;
  const dragging = useRef(false);
  const set = (n: number) => { const next = wrap(n); latest.current = next; setCurrent(next); };
  const fromPointer = (e: PointerEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    if (dx === 0 && dy === 0) return;
    set((Math.atan2(dx, -dy) * 180) / Math.PI);
  };
  const down = (e: PointerEvent<HTMLSpanElement>) => {
    if (disabled || e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus({ preventScroll: true });
    dragging.current = true;
    fromPointer(e);
  };
  const move = (e: PointerEvent<HTMLSpanElement>) => { if (dragging.current) fromPointer(e); };
  const up = (e: PointerEvent<HTMLSpanElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    onValueCommit?.(latest.current);
  };
  const keyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(e);
    if (disabled || e.defaultPrevented) return;
    const big = e.shiftKey ? 15 : step;
    const at = latest.current;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = at + big;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = at - big;
    else if (e.key === 'PageUp') next = at + 15;
    else if (e.key === 'PageDown') next = at - 15;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 359;
    if (next === null) return;
    e.preventDefault();
    set(next);
  };
  const keyUp = (e: KeyboardEvent<HTMLSpanElement>) => {
    onKeyUp?.(e);
    if (!disabled && ['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) onValueCommit?.(latest.current);
  };
  return (
    <span
      data-slot="angle-dial" role="slider" tabIndex={disabled ? -1 : 0} data-disabled={disabled || undefined}
      aria-label={label} aria-valuemin={0} aria-valuemax={359} aria-valuenow={current} aria-valuetext={valueText?.(current)} aria-disabled={disabled || undefined}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={keyDown} onKeyUp={keyUp}
      className={cn(angleDialVariants(), className)} style={{ ...style, '--dial-angle': `${current}deg` } as CSSProperties}
      {...props}
    >
      <span data-slot="angle-dial-needle" aria-hidden className={angleDialNeedleVariants()} />
      <span data-slot="angle-dial-hub" aria-hidden className={angleDialHubVariants()} />
    </span>
  );
}
