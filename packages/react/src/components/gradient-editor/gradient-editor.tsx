'use client';
import { ChevronRight, FlipHorizontal2, Minus, Plus, RotateCw } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent, type PointerEvent, type SyntheticEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { clamp } from '../../lib/color-math.ts';
import {
  axisAngle, axisLength, defaultGradient, gradientCss, newStopColor, positionOnAxis, rotateAxis, snapAxis,
  type BoxSize, type GradientPoint, type GradientStopData, type GradientType, type GradientValue,
} from '../../lib/gradient-math.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { AngleDial } from '../angle-dial/angle-dial.tsx';
import { ColorWell } from '../color-well/color-well.tsx';
import { GradientStrip } from '../gradient-strip/gradient-strip.tsx';
import { HexInput } from '../hex-input/hex-input.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { NumberField, type NumberFieldDraft } from '../number-field/number-field.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import {
  gradientCanvasVariants, gradientControlsVariants, gradientDotVariants, gradientEditorVariants, gradientGuideVariants, gradientHandleVariants,
  gradientPreviewVariants, gradientReadoutVariants, gradientRowVariants, gradientStopsVariants, gradientSummaryVariants,
} from './gradient-editor.variants.ts';

export type { GradientValue, GradientType, GradientPoint, GradientStopData };

export type GradientEditorField = 'type' | 'start' | 'end' | 'angle' | 'stopPosition' | 'stopColor' | 'stops' | 'startX' | 'startY' | 'endX' | 'endY';
export type GradientEditorFieldFlags = Partial<Record<GradientEditorField, boolean>>;
/** What the owner is told about the text of a numeric field or of a stop hex field. */
export interface GradientEditorDraft {
  field: 'angle' | 'stopPosition' | 'stopColor' | 'startX' | 'startY' | 'endX' | 'endY';
  /** The stop row, for stopPosition and stopColor. */
  index?: number | undefined;
  text: string;
  /** The number, the uppercase hex digits of a stop color, or null when the text is not usable. */
  value: number | string | null;
  error: 'empty' | 'syntax' | 'range' | null;
  dirty: boolean;
}
export interface GradientEditorLabels {
  handleStart: string;
  handleEnd: string;
  handleValueText: (x: number, y: number) => string;
  typesGroup: string;
  types: Record<GradientType, string>;
  dial: string;
  dialValueText: (degrees: number) => string;
  angle: string;
  rotate: string;
  flip: string;
  stops: string;
  add: string;
  stop: (index: number) => string;
  position: string;
  color: string;
  remove: string;
  details: string;
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  startXShort: string;
  startYShort: string;
  endXShort: string;
  endYShort: string;
  radiusReadout: (px: number) => string;
  mixed: string;
}

export interface GradientEditorProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Controlled gradient. start and end are percentages of the preview box; stops are position 0-100 and a CSS color. */
  value?: GradientValue | undefined;
  defaultValue?: GradientValue | undefined;
  /** Controlled index of the selected stop. */
  selected?: number | undefined;
  /** Uncontrolled selected stop. */
  defaultSelected?: number | undefined;
  /** true disables every control; a record disables the named fields (stops covers add and remove). */
  disabled?: boolean | Partial<Record<'type' | 'start' | 'end' | 'angle' | 'stopPosition' | 'stopColor' | 'stops' | 'startX' | 'startY' | 'endX' | 'endY', boolean>> | undefined;
  /** live (default): the behavior before K2d. release: the NumberField value model and one commit per gesture. */
  commitMode?: 'live' | 'release' | undefined;
  /** Fields whose selection values differ; each shows labels.mixed instead of a value. */
  mixed?: Partial<Record<'type' | 'start' | 'end' | 'angle' | 'stopPosition' | 'stopColor' | 'stops' | 'startX' | 'startY' | 'endX' | 'endY', boolean>> | undefined;
  /** Fields being written or held by another window. */
  reserved?: Partial<Record<'type' | 'start' | 'end' | 'angle' | 'stopPosition' | 'stopColor' | 'stops' | 'startX' | 'startY' | 'endX' | 'endY', boolean>> | undefined;
  /** Every text and accessible name; no English default. */
  labels: GradientEditorLabels;
  onValueChange?: ((value: GradientValue) => void) | undefined;
  onSelectedChange?: ((index: number) => void) | undefined;
  /** A numeric field text, or the hex text of a stop, changed. */
  onDraftChange?: ((draft: GradientEditorDraft) => void) | undefined;
  /** release mode: a gesture is in progress with the value being previewed; null when it ends. */
  onPreviewChange?: ((value: GradientValue | null) => void) | undefined;
}

const wrapAngle = (n: number) => ((Math.round(n) % 360) + 360) % 360;
const isHexColor = (c: string) => /^#[0-9a-fA-F]{3,8}$/.test(c);
const handleKeys: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
const gestureKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];
const types: GradientType[] = ['linear', 'radial', 'angular'];
const hatch = 'repeating-linear-gradient(135deg, var(--cs-color-fill-selected) 0 6px, transparent 6px 12px)';

const flagged = (flags: boolean | GradientEditorFieldFlags | undefined, field: GradientEditorField) => flags === true || (typeof flags === 'object' && flags[field] === true);
/** Attributes of a control whose field is being written elsewhere. */
const busy = { 'aria-busy': true, 'aria-readonly': true, 'data-reserved': true } as const;

/** Edits a gradient the way a design tool does: handles and stops on the preview, a strip, type, angle and a stop list. */
export function GradientEditor({
  value, defaultValue = defaultGradient, selected, defaultSelected = 1, disabled = false, commitMode = 'live', mixed, reserved, labels,
  onValueChange, onSelectedChange, onDraftChange, onPreviewChange, className, ...props
}: GradientEditorProps) {
  const [grad, setGrad] = useControllableState<GradientValue>({ value, defaultValue, onChange: v => onValueChange?.(v) });
  const [sel, setSel] = useControllableState<number>({ value: selected, defaultValue: defaultSelected, onChange: i => onSelectedChange?.(i) });
  const [previewing, setPreviewing] = useState<GradientValue | null>(null);
  const gesture = useRef<GradientValue | null>(null);
  const stripDown = useRef(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<BoxSize>({ w: 0, h: 0 });
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const measure = () => setBox(b => (b.w === el.clientWidth && b.h === el.clientHeight ? b : { w: el.clientWidth, h: el.clientHeight }));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const release = commitMode === 'release';
  const shown = previewing ?? grad;
  const { start, end, stops, type } = shown;
  const isReserved = (f: GradientEditorField) => flagged(reserved, f);
  const isMixed = (f: GradientEditorField) => flagged(mixed, f);
  const isDisabled = (f: GradientEditorField) => flagged(disabled, f);
  /** The slot wrapper of a field being written elsewhere carries the busy state as well. */
  const wrap = (f: GradientEditorField) => (isReserved(f) ? { 'aria-busy': true as const, 'data-reserved': true as const } : {});
  /** A reserved gesture control never receives the pointer or the keys that move it. */
  const block = (f: GradientEditorField) => (isReserved(f)
    ? {
        onPointerDownCapture: (e: SyntheticEvent) => e.stopPropagation(),
        onKeyDownCapture: (e: KeyboardEvent) => { if (gestureKeys.includes(e.key)) e.stopPropagation(); },
      }
    : {});
  const inert = (f: GradientEditorField) => isDisabled(f) || isReserved(f);

  const angle = axisAngle(start, end, box);
  const angleInt = wrapAngle(angle);
  const length = axisLength(start, end, box);
  const css = isMixed('stops') ? hatch : gradientCss(shown, box);
  const startMixed = isMixed('start');
  const endMixed = isMixed('end');
  const angleMixed = isMixed('angle');
  const stopsMixed = isMixed('stops');

  /** A discrete change: one commit. */
  const commit = (next: GradientValue) => setGrad(next);
  const update = (patch: Partial<GradientValue>) => commit({ ...shown, ...patch });
  /** A gesture step: previewed in release mode, committed at once in live mode. */
  const step = (next: GradientValue) => {
    if (release) { gesture.current = next; setPreviewing(next); onPreviewChange?.(next); } else setGrad(next);
  };
  /** The end of a gesture: one commit in release mode. */
  const finish = () => {
    const next = gesture.current;
    gesture.current = null;
    if (!release || next === null) return;
    setPreviewing(null);
    setGrad(next);
    onPreviewChange?.(null);
  };
  const cancel = () => {
    if (gesture.current === null) return;
    gesture.current = null;
    setPreviewing(null);
    onPreviewChange?.(null);
  };
  /** The preview reported by a NumberField scrub (the field commits itself). */
  const preview = (next: GradientValue | null) => { setPreviewing(next); onPreviewChange?.(next); };

  const setStops = (next: GradientStopData[]) => update({ stops: next });
  const stepStops = (next: GradientStopData[]) => step({ ...shown, stops: next });
  const select = (i: number) => { if (i !== sel) setSel(i); };

  const pointAt = (e: PointerEvent<HTMLElement>): GradientPoint => {
    const r = previewRef.current?.getBoundingClientRect();
    if (!r || r.width === 0 || r.height === 0) return { x: 0, y: 0 };
    return { x: clamp(((e.clientX - r.left) / r.width) * 100, 0, 100), y: clamp(((e.clientY - r.top) / r.height) * 100, 0, 100) };
  };
  const handleField = (which: 'start' | 'end'): GradientEditorField => which;
  const moveHandle = (which: 'start' | 'end', p: GradientPoint) => step({ ...shown, [which]: p });
  const handleDown = (which: 'start' | 'end') => (e: PointerEvent<HTMLButtonElement>) => {
    if (inert(handleField(which))) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus({ preventScroll: true });
  };
  const handleMove = (which: 'start' | 'end') => (e: PointerEvent<HTMLButtonElement>) => {
    if (inert(handleField(which)) || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    let p = pointAt(e);
    if (e.shiftKey) p = snapAxis(p, which === 'start' ? end : start, box);
    moveHandle(which, p);
  };
  const handleUp = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    finish();
  };
  const handleCancel = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    cancel();
  };
  const handleKey = (which: 'start' | 'end') => (e: KeyboardEvent<HTMLButtonElement>) => {
    const d = handleKeys[e.key];
    if (!d || inert(handleField(which))) return;
    e.preventDefault();
    const m = e.shiftKey ? 10 : 1;
    const p = which === 'start' ? start : end;
    commit({ ...shown, [which]: { x: clamp(p.x + d[0] * m, 0, 100), y: clamp(p.y + d[1] * m, 0, 100) } });
  };
  const dotDown = (i: number) => (e: PointerEvent<HTMLSpanElement>) => {
    if (inert('stopPosition')) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    select(i);
  };
  const dotMove = (i: number) => (e: PointerEvent<HTMLSpanElement>) => {
    if (inert('stopPosition') || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const r = previewRef.current?.getBoundingClientRect();
    if (!r) return;
    const position = positionOnAxis({ x: e.clientX - r.left, y: e.clientY - r.top }, start, end, box);
    if (position !== stops[i]?.position) stepStops(stops.map((s, k) => (k === i ? { ...s, position } : s)));
  };
  const dotUp = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    finish();
  };
  const dotCancel = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    cancel();
  };

  const rotated = (deg: number): GradientValue => ({ ...shown, ...rotateAxis(start, end, deg, box) });
  const addStop = () => {
    if (inert('stops')) return;
    commit({ ...shown, stops: [...stops, { position: 75, color: newStopColor }] });
    setSel(stops.length);
  };
  const removeStop = (i: number) => {
    if (inert('stops') || stops.length <= 2) return;
    commit({ ...shown, stops: stops.filter((_, k) => k !== i) });
    setSel(0);
  };
  const patchStop = (i: number, patch: Partial<GradientStopData>) => setStops(stops.map((s, k) => (k === i ? { ...s, ...patch } : s)));
  const pointWith = (key: 'start' | 'end', axis: 'x' | 'y', v: number): GradientValue => ({ ...shown, [key]: { ...(key === 'start' ? start : end), [axis]: clamp(v, 0, 100) } });

  /** The props every numeric field shares: value model, mixed, reserved and the draft report. */
  const numeric = (name: GradientEditorField, draft: GradientEditorDraft['field'], index?: number) => ({
    mixed: isMixed(name), mixedLabel: labels.mixed, disabled: isDisabled(name), reserved: isReserved(name), commitMode,
    onDraftChange: (d: NumberFieldDraft) => onDraftChange?.({ ...d, field: draft, ...(index === undefined ? {} : { index }) }),
  });

  // Strip: a press on the bar adds a stop, a handle drag moves one. GradientStrip has no release callback, so the wrapper sees the pointer up.
  const stripBlock = (e: SyntheticEvent) => {
    stripDown.current = true;
    const onStop = (e.target as HTMLElement).closest('[data-slot="gradient-strip-stop"]') !== null;
    if (isReserved('stopPosition') || (!onStop && inert('stops'))) e.stopPropagation();
  };
  const stripUp = () => { stripDown.current = false; finish(); };
  const stripStops = (next: GradientStopData[]) => {
    if (next.length !== stops.length) { if (!inert('stops')) setStops(next); return; }
    if (inert('stopPosition')) return;
    if (stripDown.current) stepStops(next); else setStops(next);
  };

  const vars = (p: GradientPoint) => ({ '--hx': `${p.x}%`, '--hy': `${p.y}%` }) as CSSProperties;
  const a = { x: (start.x / 100) * box.w, y: (start.y / 100) * box.h };
  const b = { x: (end.x / 100) * box.w, y: (end.y / 100) * box.h };

  return (
    <div data-slot="gradient-editor" data-disabled={disabled === true || undefined} className={cn(gradientEditorVariants(), className)} {...props}>
      <div data-slot="gradient-editor-canvas" className={gradientCanvasVariants()}>
        <div ref={previewRef} data-slot="gradient-editor-preview" data-type={type} data-mixed={stopsMixed || undefined} className={gradientPreviewVariants()} style={{ '--gradient': css } as CSSProperties}>
          <svg data-slot="gradient-editor-guide" aria-hidden className={gradientGuideVariants()}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            {type === 'radial' ? <circle cx={a.x} cy={a.y} r={length} /> : null}
          </svg>
          {stopsMixed ? null : stops.map((s, i) => (
            <span
              key={i} data-slot="gradient-editor-dot" data-selected={sel === i || undefined} data-disabled={isDisabled('stopPosition') || undefined} {...wrap('stopPosition')}
              onPointerDown={dotDown(i)} onPointerMove={dotMove(i)} onPointerUp={dotUp} onPointerCancel={dotCancel}
              className={gradientDotVariants()}
              style={{ '--dx': `${start.x + ((end.x - start.x) * s.position) / 100}%`, '--dy': `${start.y + ((end.y - start.y) * s.position) / 100}%`, '--stop-color': s.color } as CSSProperties}
            />
          ))}
          <button
            type="button" role="slider" data-slot="gradient-editor-handle-start" data-disabled={isDisabled('start') || undefined} data-mixed={startMixed || undefined}
            aria-label={labels.handleStart} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(start.x)}
            aria-valuetext={startMixed ? labels.mixed : labels.handleValueText(Math.round(start.x), Math.round(start.y))}
            onPointerDown={handleDown('start')} onPointerMove={handleMove('start')} onPointerUp={handleUp} onPointerCancel={handleCancel} onKeyDown={handleKey('start')}
            className={gradientHandleVariants({ end: false, mixed: startMixed })} style={vars(start)}
            {...(isReserved('start') ? busy : {})}
          />
          <button
            type="button" role="slider" data-slot="gradient-editor-handle-end" data-disabled={isDisabled('end') || undefined} data-mixed={endMixed || undefined}
            aria-label={labels.handleEnd} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(end.x)}
            aria-valuetext={endMixed ? labels.mixed : labels.handleValueText(Math.round(end.x), Math.round(end.y))}
            onPointerDown={handleDown('end')} onPointerMove={handleMove('end')} onPointerUp={handleUp} onPointerCancel={handleCancel} onKeyDown={handleKey('end')}
            className={gradientHandleVariants({ end: true, mixed: endMixed })} style={vars(end)}
            {...(isReserved('end') ? busy : {})}
          />
          <span
            data-slot="gradient-editor-readout" aria-hidden className={gradientReadoutVariants()}
            style={{ '--rx': `${(start.x + end.x) / 2}%`, '--ry': `${(start.y + end.y) / 2}%` } as CSSProperties}
          >
            {angleMixed ? labels.mixed : type === 'radial' ? labels.radiusReadout(Math.round(length)) : `${angleInt}°`}
          </span>
        </div>
        <div
          data-slot="gradient-editor-strip" data-mixed={stopsMixed || undefined} {...wrap('stopPosition')}
          onPointerDownCapture={stripBlock} onPointerUp={stripUp} onPointerCancel={stripUp}
          onKeyDownCapture={e => { if (isReserved('stopPosition') && gestureKeys.includes(e.key)) e.stopPropagation(); }}
        >
          <GradientStrip
            stopLabel={labels.stop} stops={stopsMixed ? [] : stops} selected={sel} disabled={isDisabled('stopPosition')}
            onStopsChange={stripStops} onSelectedChange={select}
          />
        </div>
        <div data-slot="gradient-editor-controls" className={gradientControlsVariants()}>
          <div data-slot="gradient-editor-type" className="inline-flex" {...wrap('type')}>
            <SegmentedControl
              aria-label={labels.typesGroup} size="xs" value={isMixed('type') ? '' : type} disabled={isDisabled('type')}
              onValueChange={t => { if (!isReserved('type')) update({ type: t as GradientType }); }}
              {...(isReserved('type') ? busy : {})}
            >
              {types.map(t => <SegmentedControlItem key={t} value={t}>{labels.types[t]}</SegmentedControlItem>)}
            </SegmentedControl>
          </div>
          <div data-slot="gradient-editor-angle" className="flex items-center gap-1">
            <div data-slot="gradient-editor-dial" className="inline-flex" data-mixed={angleMixed || undefined} {...wrap('angle')} {...block('angle')}>
              <AngleDial
                label={labels.dial} valueText={angleMixed ? () => labels.mixed : labels.dialValueText} value={angleInt} disabled={isDisabled('angle')}
                onValueChange={deg => step(rotated(deg))}
                onValueCommit={() => finish()}
              />
            </div>
            <div data-slot="gradient-editor-angle-field" className="w-gradient-angle-w" {...wrap('angle')}>
              <NumberField
                aria-label={labels.angle} unit="°" value={angleInt}
                onValueChange={v => commit(rotated(wrapAngle(v)))}
                onPreviewChange={n => preview(n === null ? null : rotated(wrapAngle(n)))}
                {...numeric('angle', 'angle')}
              />
            </div>
            <div data-slot="gradient-editor-rotate" className="inline-flex" {...wrap('angle')}>
              <IconButton
                label={labels.rotate} size="xs" disabled={isDisabled('angle')}
                onClick={() => { if (!isReserved('angle')) commit(rotated(angleInt + 90)); }} {...(isReserved('angle') ? busy : {})}
              >
                <RotateCw />
              </IconButton>
            </div>
            <div data-slot="gradient-editor-flip" className="inline-flex" {...wrap('start')}>
              <IconButton
                label={labels.flip} size="xs" disabled={isDisabled('start') || isDisabled('end')}
                onClick={() => { if (!isReserved('start') && !isReserved('end')) update({ start: end, end: start }); }} {...(isReserved('start') || isReserved('end') ? busy : {})}
              >
                <FlipHorizontal2 />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <div data-slot="gradient-editor-stops" className={gradientStopsVariants()}>
        <div data-slot="gradient-editor-stops-head" className="flex items-center justify-between gap-2">
          <span data-slot="gradient-editor-stops-title" className="text-ui-xs font-semibold text-text-tertiary">{labels.stops}</span>
          <div data-slot="gradient-editor-add" className="inline-flex" {...wrap('stops')}>
            <IconButton label={labels.add} size="xs" disabled={isDisabled('stops')} onClick={addStop} {...(isReserved('stops') ? busy : {})}><Plus /></IconButton>
          </div>
        </div>
        <div data-slot="gradient-editor-rows" className="grid gap-1" {...wrap('stops')}>
          {stopsMixed ? (
            <div data-slot="gradient-editor-row" data-mixed className={gradientRowVariants()}>
              <span className="col-span-3 flex items-center gap-1.5 px-1.5 text-footnote italic text-text-secondary">
                <ColorWell size="sm" mixed aria-hidden />
                {labels.mixed}
              </span>
            </div>
          ) : stops.map((s, i) => (
            <div key={i} data-slot="gradient-editor-row" data-selected={sel === i || undefined} onClick={() => select(i)} className={gradientRowVariants()}>
              <div data-slot="gradient-editor-row-position" className="w-16" {...wrap('stopPosition')}>
                <NumberField
                  aria-label={labels.position} containerClassName="rounded-sm" unit="%" min={0} max={100} value={s.position}
                  onFocus={() => select(i)}
                  onValueChange={position => patchStop(i, { position })}
                  onPreviewChange={n => preview(n === null ? null : { ...shown, stops: stops.map((t, k) => (k === i ? { ...t, position: n } : t)) })}
                  {...numeric('stopPosition', 'stopPosition', i)}
                />
              </div>
              <div data-slot="gradient-editor-row-well" className="inline-flex" {...wrap('stopColor')}>
                <ColorWell size="sm" appearance="checker" color={s.color} mixed={isMixed('stopColor')} aria-hidden />
              </div>
              <div data-slot="gradient-editor-row-hex" className="min-w-0" {...wrap('stopColor')}>
                <HexInput
                  aria-label={labels.color} disabled={isDisabled('stopColor')} reserved={isReserved('stopColor')} commitMode={commitMode}
                  mixed={isMixed('stopColor')} mixedLabel={labels.mixed} onFocus={() => select(i)}
                  value={isHexColor(s.color) ? s.color.slice(1).toUpperCase() : undefined} token={isHexColor(s.color) ? undefined : s.color}
                  onValueChange={hex => patchStop(i, { color: `#${hex}` })}
                  onDraftChange={d => onDraftChange?.({ field: 'stopColor', index: i, text: d.text, value: d.value, error: d.error, dirty: d.dirty })}
                />
              </div>
              <div data-slot="gradient-editor-row-remove" className="inline-flex" {...wrap('stops')}>
                <IconButton
                  label={labels.remove} size="xs" disabled={isDisabled('stops') || stops.length <= 2}
                  onClick={e => { e.stopPropagation(); removeStop(i); }} {...(isReserved('stops') ? busy : {})}
                >
                  <Minus />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
        <details data-slot="gradient-editor-details" open className="group">
          <summary data-slot="gradient-editor-summary" className={gradientSummaryVariants()}>
            <ChevronRight aria-hidden className="size-icon-sm shrink-0 stroke-[1.75] transition-transform duration-base ease-out group-open:rotate-90" />
            {labels.details}
          </summary>
          <div data-slot="gradient-editor-details-body" className="mt-1.5 grid grid-cols-2 gap-1.5">
            <div data-slot="gradient-editor-coord" {...wrap('startX')}>
              <NumberField
                label={labels.startXShort} unit="%" aria-label={labels.startX} min={0} max={100} value={Math.round(start.x)}
                onValueChange={v => commit(pointWith('start', 'x', v))} onPreviewChange={n => preview(n === null ? null : pointWith('start', 'x', n))}
                {...numeric('startX', 'startX')}
              />
            </div>
            <div data-slot="gradient-editor-coord" {...wrap('startY')}>
              <NumberField
                label={labels.startYShort} unit="%" aria-label={labels.startY} min={0} max={100} value={Math.round(start.y)}
                onValueChange={v => commit(pointWith('start', 'y', v))} onPreviewChange={n => preview(n === null ? null : pointWith('start', 'y', n))}
                {...numeric('startY', 'startY')}
              />
            </div>
            <div data-slot="gradient-editor-coord" {...wrap('endX')}>
              <NumberField
                label={labels.endXShort} unit="%" aria-label={labels.endX} min={0} max={100} value={Math.round(end.x)}
                onValueChange={v => commit(pointWith('end', 'x', v))} onPreviewChange={n => preview(n === null ? null : pointWith('end', 'x', n))}
                {...numeric('endX', 'endX')}
              />
            </div>
            <div data-slot="gradient-editor-coord" {...wrap('endY')}>
              <NumberField
                label={labels.endYShort} unit="%" aria-label={labels.endY} min={0} max={100} value={Math.round(end.y)}
                onValueChange={v => commit(pointWith('end', 'y', v))} onPreviewChange={n => preview(n === null ? null : pointWith('end', 'y', n))}
                {...numeric('endY', 'endY')}
              />
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
