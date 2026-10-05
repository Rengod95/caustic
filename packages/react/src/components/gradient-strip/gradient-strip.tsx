'use client';
import { useRef, type ComponentProps, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { clamp } from '../../lib/color-math.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { gradientBarVariants, gradientStemVariants, gradientStopVariants, gradientStripVariants, gradientSwatchVariants } from './gradient-strip.variants.ts';

export interface GradientStop { position: number; color: string }

export interface GradientStripProps extends Omit<ComponentProps<'div'>, 'onChange' | 'children'> {
  /** aria-label of the stop handle index (1-based). Required; no built-in default. */
  stopLabel: (index: number) => string;
  /** Color stops: position 0-100 (whole percent) and a CSS color. */
  stops: GradientStop[];
  /** Index of the selected stop. */
  selected?: number;
  disabled?: boolean;
  onStopsChange?: (stops: GradientStop[]) => void;
  onSelectedChange?: (index: number) => void;
}

/** The color-stop track of a gradient: press the bar to add a stop, drag a handle to move it. */
export function GradientStrip({ stopLabel, stops, selected, disabled = false, onStopsChange, onSelectedChange, className, style, ...props }: GradientStripProps) {
  const [current, setCurrent] = useControllableState<number | undefined>({ value: selected, defaultValue: undefined, onChange: i => { if (i !== undefined) onSelectedChange?.(i); } });
  const rootRef = useRef<HTMLDivElement>(null);
  const drag = useRef<number | null>(null);
  const latest = useRef(stops); latest.current = stops;
  const ordered = stops.map((stop, index) => ({ stop, index })).sort((a, b) => a.stop.position - b.stop.position);
  const ramp = `linear-gradient(90deg, ${ordered.map(({ stop }) => `${stop.color} ${stop.position}%`).join(', ')})`;
  const positionAt = (clientX: number) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return Math.round(clamp((clientX - rect.left) / rect.width, 0, 1) * 100);
  };
  const move = (index: number, position: number) => {
    const next = latest.current.map((s, i) => (i === index ? { ...s, position } : s));
    latest.current = next;
    onStopsChange?.(next);
  };
  const addAt = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0 || (e.target as HTMLElement).closest('[data-slot="gradient-strip-stop"]')) return;
    e.preventDefault();
    const next = [...latest.current, { position: positionAt(e.clientX), color: 'var(--cs-color-media-on)' }];
    latest.current = next;
    onStopsChange?.(next);
    setCurrent(next.length - 1);
  };
  const stopDown = (index: number) => (e: PointerEvent<HTMLButtonElement>) => {
    if (disabled || e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus({ preventScroll: true });
    drag.current = index;
    setCurrent(index);
  };
  const stopMove = (index: number) => (e: PointerEvent<HTMLButtonElement>) => {
    if (drag.current !== index) return;
    const position = positionAt(e.clientX);
    if (position !== latest.current[index]?.position) move(index, position);
  };
  const stopUp = (e: PointerEvent<HTMLButtonElement>) => {
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const stopKey = (index: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const at = latest.current[index]?.position ?? 0;
    const position = clamp(at + dir * (e.shiftKey ? 10 : 1), 0, 100);
    if (position !== at) move(index, position);
  };
  return (
    <div
      ref={rootRef} role="group" aria-label="Gradient stops" data-slot="gradient-strip" data-disabled={disabled || undefined}
      onPointerDown={addAt}
      className={cn(gradientStripVariants(), className)} style={{ ...style, '--gradient': ramp } as CSSProperties} {...props}
    >
      <div data-slot="gradient-strip-bar" aria-hidden className={gradientBarVariants()} />
      {ordered.map(({ stop, index }) => (
        <button
          key={index} type="button" role="slider" data-slot="gradient-strip-stop" data-selected={current === index || undefined}
          aria-disabled={disabled || undefined}
          aria-label={stopLabel(index + 1)} aria-valuemin={0} aria-valuemax={100} aria-valuenow={stop.position} aria-valuetext={`${stop.position} %, ${stop.color}`}
          onPointerDown={stopDown(index)} onPointerMove={stopMove(index)} onPointerUp={stopUp} onPointerCancel={stopUp}
          onKeyDown={stopKey(index)} onFocus={() => { if (current !== index) setCurrent(index); }}
          className={gradientStopVariants()} style={{ '--stop-pos': `${stop.position}%`, '--stop-color': stop.color } as CSSProperties}
        >
          <span data-slot="gradient-strip-stem" aria-hidden className={gradientStemVariants()} />
          <span data-slot="gradient-strip-swatch" aria-hidden className={gradientSwatchVariants()} />
        </button>
      ))}
    </div>
  );
}
