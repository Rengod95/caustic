'use client';
import { useEffect, useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Chip } from '../chip/chip.tsx';
import { NumberField } from '../number-field/number-field.tsx';
import {
  easingCurveBallVariants, easingCurveDiagonalVariants, easingCurveEndpointVariants, easingCurveFooterVariants, easingCurveGraphVariants,
  easingCurveGridLineVariants, easingCurveHandleLineVariants, easingCurveHandleVariants, easingCurvePathVariants, easingCurvePresetsVariants,
  easingCurveStageVariants, easingCurveSvgVariants, easingCurveVariants,
} from './easing-curve.variants.ts';

export type Bezier = [number, number, number, number];
export interface EasingValue { bezier: Bezier; duration: number }
export interface EasingPreset { id: string; label: string; bezier: Bezier }

export interface EasingCurveProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  value?: EasingValue;
  defaultValue?: EasingValue;
  /** Shorthand for the initial control points. */
  defaultBezier?: Bezier;
  presets?: EasingPreset[];
  /** Pins the ball position (0-1); ignores autoplay. */
  progress?: number;
  /** Run the preview loop (1100ms). Stops under prefers-reduced-motion. */
  autoplay?: boolean;
  disabled?: boolean;
  onValueChange?: (value: EasingValue) => void;
  onPresetChange?: (id: string | null) => void;
}

const DEFAULT_PRESETS: EasingPreset[] = [
  { id: 'out', label: 'out', bezier: [0.2, 0.8, 0.2, 1] },
  { id: 'standard', label: 'standard', bezier: [0.2, 0, 0, 1] },
  { id: 'in', label: 'in', bezier: [0.4, 0, 1, 1] },
  { id: 'back', label: 'back', bezier: [0.34, 1.56, 0.64, 1] },
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const round = (v: number, n: number) => Math.round(v * 10 ** n) / 10 ** n;
const X = (v: number) => v * 100;
const Y = (v: number) => 100 - v * 100;
const same = (a: Bezier, b: Bezier) => a.every((v, i) => Math.abs(v - b[i]!) < 1e-6);

/** A cubic-bezier easing edited by dragging two handles, with presets, a live preview and the duration. */
export function EasingCurve({
  value, defaultValue, defaultBezier, presets = DEFAULT_PRESETS, progress, autoplay = false, disabled = false, onValueChange, onPresetChange, className, ...props
}: EasingCurveProps) {
  const initial: EasingValue = { bezier: defaultBezier ?? defaultValue?.bezier ?? [0.4, 0, 1, 1], duration: defaultValue?.duration ?? 320 };
  const [current, setCurrent] = useControllableState<EasingValue>({ value, defaultValue: initial, onChange: onValueChange });
  const { bezier: b, duration } = current;
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<number | null>(null);
  const active = presets.find(p => same(p.bezier, b));

  // Preview ball position: pinned, or driven by the loop, or flipped once when the curve changes.
  const [p, setP] = useState(0);
  const [reduced, setReduced] = useState(false);
  useEffect(() => { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  useEffect(() => {
    if (!autoplay || progress !== undefined || reduced) return;
    const id = window.setInterval(() => setP(v => (v === 0 ? 1 : 0)), 1100);
    return () => window.clearInterval(id);
  }, [autoplay, progress, reduced]);
  const first = useRef(true);
  const key = `${b.join(',')}|${duration}`;
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!autoplay && progress === undefined) setP(v => (v === 0 ? 1 : 0));
  }, [key, autoplay, progress]);
  const at = progress ?? p;

  const move = (i: number, x: number, y: number) => {
    if (disabled) return;
    const next = [...b] as Bezier;
    next[i * 2] = round(clamp(x, 0, 1), 3);
    next[i * 2 + 1] = round(clamp(y, -0.4, 1.4), 3);
    if (active && !same(active.bezier, next)) onPresetChange?.(null);
    setCurrent({ ...current, bezier: next });
  };
  const toPoint = (e: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const q = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: q.x / 100, y: (100 - q.y) / 100 };
  };
  const onKey = (i: number) => (e: KeyboardEvent<SVGCircleElement>) => {
    if (disabled) return;
    const step = e.shiftKey ? 0.1 : 0.01;
    const x = b[i * 2]!, y = b[i * 2 + 1]!;
    const delta: Record<string, [number, number]> = { ArrowRight: [step, 0], ArrowLeft: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    const d = delta[e.key];
    if (d) { e.preventDefault(); move(i, x + d[0], y + d[1]); }
    else if (e.key === 'Home') { e.preventDefault(); move(i, 0, y); }
    else if (e.key === 'End') { e.preventDefault(); move(i, 1, y); }
  };

  const css = `cubic-bezier(${b.map(v => round(v, 2)).join(', ')})`;
  const ballVars = {
    ['--p' as string]: at, ['--s' as string]: 0.8 + at * 0.2, ['--o' as string]: 0.5 + at * 0.5,
    ['--ease' as string]: css, ['--dur' as string]: `${duration}ms`,
  } as CSSProperties;

  const handle = (i: number) => (
    <circle
      key={i} data-slot="easing-curve-handle" role="slider" tabIndex={disabled ? -1 : 0} aria-disabled={disabled || undefined}
      aria-label={`Easing handle ${i + 1}`} aria-valuemin={0} aria-valuemax={1} aria-valuenow={b[i * 2]}
      aria-valuetext={`x ${round(b[i * 2]!, 2)}, y ${round(b[i * 2 + 1]!, 2)}`}
      cx={X(b[i * 2]!)} cy={Y(b[i * 2 + 1]!)} r={5} strokeWidth={2}
      className={easingCurveHandleVariants()}
      onKeyDown={onKey(i)}
      onPointerDown={e => { if (disabled) return; e.preventDefault(); drag.current = i; svgRef.current?.setPointerCapture(e.pointerId); (e.currentTarget as SVGCircleElement).focus(); }}
    />
  );

  return (
    <div data-slot="easing-curve" className={cn(easingCurveVariants(), className)} {...props}>
      <div data-slot="easing-curve-graph" className={easingCurveGraphVariants()}>
        <svg
          ref={svgRef} viewBox="-10 -40 120 180" className={easingCurveSvgVariants()}
          onPointerMove={e => { if (drag.current === null) return; const q = toPoint(e); move(drag.current, q.x, q.y); }}
          onPointerUp={() => { drag.current = null; }}
          onPointerCancel={() => { drag.current = null; }}
        >
          {[0, 25, 50, 75, 100].map(t => <line key={t} data-slot="easing-curve-grid-line" x1={0} x2={100} y1={t} y2={t} strokeWidth={1} className={easingCurveGridLineVariants()} />)}
          <line data-slot="easing-curve-diagonal" x1={0} y1={100} x2={100} y2={0} strokeWidth={1} strokeDasharray="3 4" className={easingCurveDiagonalVariants()} />
          <line data-slot="easing-curve-handle-line" x1={0} y1={100} x2={X(b[0])} y2={Y(b[1])} strokeWidth={1.25} className={easingCurveHandleLineVariants()} />
          <line data-slot="easing-curve-handle-line" x1={100} y1={0} x2={X(b[2])} y2={Y(b[3])} strokeWidth={1.25} className={easingCurveHandleLineVariants()} />
          <path data-slot="easing-curve-path" d={`M0 100 C ${X(b[0])} ${Y(b[1])}, ${X(b[2])} ${Y(b[3])}, 100 0`} strokeWidth={2.5} className={easingCurvePathVariants()} />
          <circle data-slot="easing-curve-endpoint" cx={0} cy={100} r={3} className={easingCurveEndpointVariants()} />
          <circle data-slot="easing-curve-endpoint" cx={100} cy={0} r={3} className={easingCurveEndpointVariants()} />
          {handle(0)}
          {handle(1)}
        </svg>
      </div>
      <div data-slot="easing-curve-presets" role="group" aria-label="Easing presets" className={easingCurvePresetsVariants()}>
        {presets.map(pr => (
          <Chip
            key={pr.id} data-slot="easing-curve-preset" appearance="outline" size="sm" disabled={disabled}
            pressed={active?.id === pr.id}
            onClick={() => { setCurrent({ ...current, bezier: [...pr.bezier] as Bezier }); onPresetChange?.(pr.id); }}
          >
            {pr.label}
          </Chip>
        ))}
      </div>
      <div data-slot="easing-curve-stage" aria-hidden className={easingCurveStageVariants()}>
        <span data-slot="easing-curve-ball" className={easingCurveBallVariants()} style={ballVars} />
      </div>
      <div data-slot="easing-curve-footer" className={easingCurveFooterVariants()}>
        <span data-slot="easing-curve-css" className="font-mono text-mono text-text-tertiary">{css}</span>
        <span data-slot="easing-curve-duration" className="flex w-duration-field-w">
          <NumberField aria-label="Duration" unit="ms" min={0} locked={disabled} containerClassName="w-full" value={duration} onValueChange={v => setCurrent({ ...current, duration: v })} />
        </span>
      </div>
    </div>
  );
}
