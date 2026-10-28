'use client';
import { useEffect, useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFieldContract } from '../../hooks/use-field-contract.ts';
import { Chip } from '../chip/chip.tsx';
import { NumberField, type NumberFieldDraft } from '../number-field/number-field.tsx';
import {
  easingCurveBallVariants, easingCurveDiagonalVariants, easingCurveEndpointVariants, easingCurveFooterVariants, easingCurveGraphVariants,
  easingCurveGridLineVariants, easingCurveHandleLineVariants, easingCurveHandleVariants, easingCurvePathVariants, easingCurvePresetsVariants,
  easingCurveStageVariants, easingCurveSvgVariants, easingCurveTrackVariants, easingCurveVariants,
} from './easing-curve.variants.ts';

export type Bezier = [number, number, number, number];
export interface EasingValue { bezier: Bezier; duration: number }
export interface EasingPreset { id: string; label: string; bezier: Bezier }
export type EasingCurveField = 'bezier' | 'preset' | 'duration';
export type EasingCurveFieldFlags = Partial<Record<EasingCurveField, boolean>>;
export interface EasingCurveDraft extends NumberFieldDraft { field: 'duration' }
export type EasingCurveChange = { field: 'bezier'; value: Bezier } | { field: 'preset'; value: string } | { field: 'duration'; value: number };
export interface EasingCurveLabels {
  graph: string;
  handle1: string;
  handle2: string;
  handleValueText: (x: number, y: number) => string;
  presetsGroup: string;
  duration: string;
  mixed: string;
}

export interface EasingCurveProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  value?: EasingValue | undefined;
  defaultValue?: EasingValue | undefined;
  /** Shorthand for the initial control points. */
  defaultBezier?: Bezier | undefined;
  /** The preset chips. There are no built-in presets; an empty list hides the row. */
  presets: EasingPreset[];
  /** Pins the ball position (0-1); ignores autoplay. */
  progress?: number | undefined;
  /** Run the preview loop (1100ms). Stops under prefers-reduced-motion. */
  autoplay?: boolean | undefined;
  /** true disables handles, chips and the field; a record disables the named parts. */
  disabled?: boolean | EasingCurveFieldFlags | undefined;
  /** live (default): the behavior before K2d. release: a handle drag previews and commits on release. */
  commitMode?: 'live' | 'release' | undefined;
  /** Parts whose selection values differ; each shows labels.mixed instead of a value. */
  mixed?: EasingCurveFieldFlags | undefined;
  /** Parts being written or held by another window. */
  reserved?: EasingCurveFieldFlags | undefined;
  /** Every accessible name and the mixed text; no English default. */
  labels: EasingCurveLabels;
  onValueChange?: ((value: EasingValue) => void) | undefined;
  onPresetChange?: ((id: string | null) => void) | undefined;
  /** The duration text changed. */
  onDraftChange?: ((draft: EasingCurveDraft) => void) | undefined;
  /** release mode: a drag or scrub is in progress with the value being previewed; null when it ends or is cancelled. */
  onPreviewChange?: ((value: EasingValue | null) => void) | undefined;
  /** K2e: false removes the motion preview stage. */
  preview?: boolean | undefined;
  /** K2e: fields the owner marks invalid. */
  invalid?: EasingCurveFieldFlags | undefined;
  /** K2e: id of the owner error text per field. */
  describedBy?: Partial<Record<EasingCurveField, string>> | undefined;
  /** K2e: range and step of the duration field. */
  limits?: { duration?: { min?: number | undefined; max?: number | undefined; step?: number | undefined } | undefined } | undefined;
  onFieldFocus?: ((event: { field: EasingCurveField }) => void) | undefined;
  onFieldBlur?: ((event: { field: EasingCurveField; dirty: boolean }) => void) | undefined;
  /** K2e: one field commits; return false to reject. */
  onFieldCommit?: ((change: EasingCurveChange) => boolean | void) | undefined;
  /** Colour family of the preview ball. */
  tone?: Tone | undefined;
  /** Emphasis of the preview ball; solid (default) is the ink ball. */
  variant?: Variant | undefined;
  /** Corner radius of the root; unset = none. */
  radius?: Radius | undefined;
  /** Elevation of the root; unset = none. */
  shadow?: Shadow | undefined;
  /** Stack gap step (xs 8, sm 12, md 14, lg 16); the graph, chips and field keep their size. */
  size?: Size | undefined;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const round = (v: number, n: number) => Math.round(v * 10 ** n) / 10 ** n;
const X = (v: number) => v * 100;
const Y = (v: number) => 100 - v * 100;
const same = (a: Bezier, b: Bezier) => a.every((v, i) => Math.abs(v - b[i]!) < 1e-6);
const flagged = (flags: boolean | EasingCurveFieldFlags | undefined, field: EasingCurveField) => flags === true || (typeof flags === 'object' && flags[field] === true);
/** Attributes of a control whose part is being written elsewhere. */
const busy = { 'aria-busy': true, 'aria-readonly': true, 'data-reserved': true } as const;

/** A cubic-bezier easing edited by dragging two handles, with presets, a live preview and the duration. */
export function EasingCurve({
  value, defaultValue, defaultBezier, presets, progress, autoplay = false, disabled = false, commitMode = 'live', mixed, reserved, labels,
  onValueChange, onPresetChange, onDraftChange, onPreviewChange, preview: showStage = true, invalid, describedBy, limits, onFieldFocus, onFieldBlur, onFieldCommit,
  tone, variant, radius, shadow, size, className, ...props
}: EasingCurveProps) {
  const contract = useFieldContract<EasingCurveChange, EasingCurveField>({ invalid, describedBy, onFieldFocus, onFieldBlur, onFieldCommit });
  const initial: EasingValue = { bezier: defaultBezier ?? defaultValue?.bezier ?? [0.4, 0, 1, 1], duration: defaultValue?.duration ?? 320 };
  const [current, setCurrent] = useControllableState<EasingValue>({ value, defaultValue: initial, onChange: onValueChange });
  const release = commitMode === 'release';
  const [preview, setPreview] = useState<EasingValue | null>(null);
  const previewRef = useRef<EasingValue | null>(null);
  const view = preview ?? current;
  const { bezier: b, duration } = view;
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<number | null>(null);
  const bezierMixed = flagged(mixed, 'bezier');
  const presetMixed = flagged(mixed, 'preset');
  const bezierReserved = flagged(reserved, 'bezier');
  const bezierOff = flagged(disabled, 'bezier');
  const bezierInert = bezierOff || bezierReserved;
  const presetReserved = flagged(reserved, 'preset');
  const durationReserved = flagged(reserved, 'duration');
  const active = bezierMixed ? undefined : presets.find(p => same(p.bezier, b));

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

  const commitBezier = (next: Bezier) => {
    contract.commit('bezier', { field: 'bezier', value: next }, () => {
      if (active && !same(active.bezier, next)) onPresetChange?.(null);
      setCurrent({ ...current, bezier: next });
    });
  };
  const nextBezier = (i: number, x: number, y: number, base: Bezier): Bezier => {
    const next = [...base] as Bezier;
    next[i * 2] = round(clamp(x, 0, 1), 3);
    next[i * 2 + 1] = round(clamp(y, -0.4, 1.4), 3);
    return next;
  };
  const showPreview = (next: EasingValue | null) => { previewRef.current = next; setPreview(next); onPreviewChange?.(next); };
  /** A pointer drag: live commits every move, release previews until the pointer is released. */
  const dragTo = (i: number, x: number, y: number) => {
    if (bezierInert) return;
    const next = nextBezier(i, x, y, previewRef.current?.bezier ?? current.bezier);
    if (release) showPreview({ ...current, bezier: next }); else commitBezier(next);
  };
  const endDrag = (commit: boolean) => {
    if (drag.current === null) return;
    drag.current = null;
    const pv = previewRef.current;
    if (!release || !pv) return;
    previewRef.current = null; setPreview(null);
    if (commit) commitBezier(pv.bezier);
    onPreviewChange?.(null);
  };
  const toPoint = (e: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const q = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: q.x / 100, y: (100 - q.y) / 100 };
  };
  const onKey = (i: number) => (e: KeyboardEvent<SVGCircleElement>) => {
    if (bezierInert) return;
    if (e.key === 'Escape') { if (drag.current !== null) { e.preventDefault(); endDrag(false); } return; }
    const step = e.shiftKey ? 0.1 : 0.01;
    const x = b[i * 2]!, y = b[i * 2 + 1]!;
    const delta: Record<string, [number, number]> = { ArrowRight: [step, 0], ArrowLeft: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    const d = delta[e.key];
    if (d) { e.preventDefault(); commitBezier(nextBezier(i, x + d[0], y + d[1], current.bezier)); }
    else if (e.key === 'Home') { e.preventDefault(); commitBezier(nextBezier(i, 0, y, current.bezier)); }
    else if (e.key === 'End') { e.preventDefault(); commitBezier(nextBezier(i, 1, y, current.bezier)); }
  };

  const css = `cubic-bezier(${b.map(v => round(v, 2)).join(', ')})`;
  const ballVars = {
    ['--p' as string]: at, ['--s' as string]: 0.8 + at * 0.2, ['--o' as string]: 0.5 + at * 0.5,
    ['--ease' as string]: css, ['--dur' as string]: `${duration}ms`,
  } as CSSProperties;

  const handle = (i: number) => (
    <circle
      key={i} data-slot="easing-curve-handle" role="slider" tabIndex={bezierOff ? -1 : 0} aria-disabled={bezierOff || undefined}
      aria-label={i === 0 ? labels.handle1 : labels.handle2} aria-valuemin={0} aria-valuemax={1} aria-valuenow={b[i * 2]}
      aria-valuetext={labels.handleValueText(round(b[i * 2]!, 2), round(b[i * 2 + 1]!, 2))}
      cx={X(b[i * 2]!)} cy={Y(b[i * 2 + 1]!)} r={5} strokeWidth={2}
      className={easingCurveHandleVariants()}
      onKeyDown={onKey(i)}
      data-field="bezier" data-invalid={contract.isInvalid('bezier') || undefined} aria-describedby={contract.describedBy('bezier')}
      onFocus={() => { if (!bezierInert) contract.focus('bezier'); }}
      onBlur={() => { if (!bezierInert) contract.blur('bezier'); }}
      onPointerDown={e => { if (bezierInert) return; e.preventDefault(); drag.current = i; svgRef.current?.setPointerCapture(e.pointerId); (e.currentTarget as SVGCircleElement).focus(); }}
      {...(bezierReserved ? busy : {})}
    />
  );

  return (
    <div data-slot="easing-curve" className={cn(easingCurveVariants({ radius, shadow, size }), className)} {...props}>
      <div data-slot="easing-curve-graph" data-field="bezier" data-invalid={contract.isInvalid('bezier') || undefined} className={easingCurveGraphVariants()}>
        <svg
          ref={svgRef} viewBox="-10 -40 120 180" role="group" aria-label={labels.graph} className={easingCurveSvgVariants()}
          onPointerDown={e => {
            // A mixed selection draws no handles; pressing the graph creates one curve for the whole selection.
            if (!bezierMixed || bezierInert) return;
            const q = toPoint(e);
            drag.current = q.x < 0.5 ? 0 : 1; e.currentTarget.setPointerCapture(e.pointerId); dragTo(drag.current, q.x, q.y);
          }}
          onPointerMove={e => { if (drag.current === null) return; const q = toPoint(e); dragTo(drag.current, q.x, q.y); }}
          onPointerUp={() => endDrag(true)}
          onPointerCancel={() => endDrag(false)}
        >
          {[0, 25, 50, 75, 100].map(t => <line key={t} data-slot="easing-curve-grid-line" x1={0} x2={100} y1={t} y2={t} strokeWidth={1} className={easingCurveGridLineVariants()} />)}
          <line data-slot="easing-curve-diagonal" x1={0} y1={100} x2={100} y2={0} strokeWidth={1} strokeDasharray="3 4" className={easingCurveDiagonalVariants()} />
          {!bezierMixed && <line data-slot="easing-curve-handle-line" x1={0} y1={100} x2={X(b[0])} y2={Y(b[1])} strokeWidth={1.25} className={easingCurveHandleLineVariants()} />}
          {!bezierMixed && <line data-slot="easing-curve-handle-line" x1={100} y1={0} x2={X(b[2])} y2={Y(b[3])} strokeWidth={1.25} className={easingCurveHandleLineVariants()} />}
          {!bezierMixed && <path data-slot="easing-curve-path" d={`M0 100 C ${X(b[0])} ${Y(b[1])}, ${X(b[2])} ${Y(b[3])}, 100 0`} strokeWidth={2.5} className={easingCurvePathVariants()} />}
          <circle data-slot="easing-curve-endpoint" cx={0} cy={100} r={3} className={easingCurveEndpointVariants()} />
          <circle data-slot="easing-curve-endpoint" cx={100} cy={0} r={3} className={easingCurveEndpointVariants()} />
          {!bezierMixed && handle(0)}
          {!bezierMixed && handle(1)}
        </svg>
      </div>
      {presets.length > 0 && (
        <div data-slot="easing-curve-presets" role="group" aria-label={labels.presetsGroup} className={easingCurvePresetsVariants()}>
          {presets.map(pr => (
            <Chip
              key={pr.id} data-slot="easing-curve-preset" appearance="outline" size="md" disabled={flagged(disabled, 'preset')}
              pressed={active?.id === pr.id}
              onClick={() => { if (presetReserved) return; contract.commit('preset', { field: 'preset', value: pr.id }, () => { setCurrent({ ...current, bezier: [...pr.bezier] as Bezier }); onPresetChange?.(pr.id); }); }}
              data-field="preset"
              {...(presetMixed ? { 'aria-pressed': 'mixed' as const } : {})}
              {...(presetReserved ? busy : {})}
            >
              {pr.label}
            </Chip>
          ))}
        </div>
      )}
      {showStage && (
        <div data-slot="easing-curve-stage" aria-hidden className={easingCurveStageVariants()}>
          <span data-slot="easing-curve-track" className={easingCurveTrackVariants()} />
          <span data-slot="easing-curve-ball" className={cn(easingCurveBallVariants({ tone, variant }))} style={ballVars} />
        </div>
      )}
      <div data-slot="easing-curve-footer" className={easingCurveFooterVariants()}>
        <span data-slot="easing-curve-css" className="min-w-0 font-mono text-mono text-text-tertiary">{bezierMixed ? labels.mixed : css}</span>
        <span data-slot="easing-curve-duration" className="flex w-duration-field-w" {...contract.wrapAttrs('duration')} {...(durationReserved ? { 'aria-busy': true as const, 'data-reserved': true as const } : {})}>
          <NumberField
            aria-label={labels.duration} unit="ms" min={0} containerClassName="w-full" value={current.duration}
            disabled={flagged(disabled, 'duration')} reserved={durationReserved} mixed={flagged(mixed, 'duration')} mixedLabel={labels.mixed} commitMode={commitMode}
            {...limits?.duration}
            {...contract.inputProps('duration', durationReserved || flagged(disabled, 'duration'))}
            onValueChange={v => { contract.commit('duration', { field: 'duration', value: v }, () => setCurrent({ ...current, duration: v })); }}
            onDraftChange={d => { contract.draft('duration', d); onDraftChange?.({ ...d, field: 'duration' }); }}
            onPreviewChange={n => showPreview(n === null ? null : { ...current, duration: n })}
          />
        </span>
      </div>
    </div>
  );
}
