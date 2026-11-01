'use client';
import { ChevronRight, FlipHorizontal2, Minus, Plus, RotateCw } from '../../icons/index.ts';
import { useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent, type PointerEvent, type SyntheticEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { clamp } from '../../lib/color-math.ts';
import {
  axisAngle, axisLength, defaultGradient, gradientCss, newStopColor, positionOnAxis, rotateAxis, snapAxis,
  type BoxSize, type GradientPoint, type GradientStopData, type GradientType, type GradientValue,
} from '../../lib/gradient-math.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFieldContract } from '../../hooks/use-field-contract.ts';
import { useFlip } from '../../hooks/use-flip.ts';
import { usePresence } from '../../hooks/use-presence.ts';
import { AngleDial } from '../angle-dial/angle-dial.tsx';
import { ColorWell } from '../color-well/color-well.tsx';
import { HexInput } from '../hex-input/hex-input.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { NumberField, type NumberFieldDraft } from '../number-field/number-field.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import {
  gradientCanvasVariants, gradientControlsVariants, gradientDotVariants, gradientEditorVariants, gradientGuideVariants, gradientHandleVariants,
  gradientPreviewVariants, gradientReadoutVariants, gradientRowVariants, gradientSectionTitleVariants, gradientStopsVariants, gradientStripSlotVariants, gradientSummaryVariants,
} from './gradient-editor.variants.ts';
import { GradientEditorStrip } from './gradient-editor-strip.tsx';

export { GradientEditorStrip, type GradientEditorStripProps, type GradientStop } from './gradient-editor-strip.tsx';

export type { GradientValue, GradientType, GradientPoint, GradientStopData };
/** K2e: diamond is painted like radial in the preview. */
export type GradientEditorType = GradientType | 'diamond';
export interface GradientEditorValue extends Omit<GradientValue, 'type'> { type: GradientEditorType }
export type GradientChange =
  | { field: 'angle' | 'startX' | 'startY' | 'endX' | 'endY'; value: number }
  | { field: 'stopPosition'; index: number; value: number }
  | { field: 'stopColor'; index: number; value: string }
  | { field: 'type'; value: GradientEditorType }
  | { field: 'start' | 'end'; value: GradientPoint }
  | { field: 'stops'; value: GradientStopData[] };
export interface GradientEditorLimit { min?: number | undefined; max?: number | undefined; step?: number | undefined }

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
  types: Record<GradientType, string> & { diamond?: string | undefined };
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
  value?: GradientEditorValue | undefined;
  defaultValue?: GradientEditorValue | undefined;
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
  onValueChange?: ((value: GradientEditorValue) => void) | undefined;
  onSelectedChange?: ((index: number) => void) | undefined;
  /** A numeric field text, or the hex text of a stop, changed. */
  onDraftChange?: ((draft: GradientEditorDraft) => void) | undefined;
  /** release mode: a gesture is in progress with the value being previewed; null when it ends. */
  onPreviewChange?: ((value: GradientEditorValue | null) => void) | undefined;
  /** K2e: fields the owner marks invalid; indexed fields accept "stopPosition:<index>" and "stopColor:<index>". */
  invalid?: Partial<Record<GradientEditorField | `stopPosition:${number}` | `stopColor:${number}`, boolean>> | undefined;
  /** K2e: id of the owner error text per field. */
  describedBy?: Partial<Record<GradientEditorField | `stopPosition:${number}` | `stopColor:${number}`, string>> | undefined;
  /** K2e: per-field range and step. */
  limits?: Partial<Record<'angle' | 'stopPosition' | 'startX' | 'startY' | 'endX' | 'endY', GradientEditorLimit>> | undefined;
  /** K2e: false hides the type switch. */
  showTypeSwitch?: boolean | undefined;
  /** K2e: true keeps the specimen behavior (stops are painted sorted); false clamps a stop position between its neighbors. */
  reorderStops?: boolean | undefined;
  onFieldFocus?: ((event: { field: GradientEditorField; index?: number }) => void) | undefined;
  onFieldBlur?: ((event: { field: GradientEditorField; index?: number; dirty: boolean }) => void) | undefined;
  /** K2e: one field commits; return false to reject. */
  onFieldCommit?: ((change: GradientChange) => boolean | void) | undefined;
  /** Colour family of the preview frame. */
  tone?: Tone | undefined;
  /** Emphasis of the preview frame; outline (default) is the 1px swatch edge. */
  variant?: Variant | undefined;
  /** Corner radius of the root; unset = none. */
  radius?: Radius | undefined;
  /** Elevation of the root; unset = none. */
  shadow?: Shadow | undefined;
  /** Gap between the canvas and the stop list: xs 8, sm 12, md 16, lg 20; the controls keep their size. */
  size?: Size | undefined;
}

const wrapAngle = (n: number) => ((Math.round(n) % 360) + 360) % 360;
const isHexColor = (c: string) => /^#[0-9a-fA-F]{3,8}$/.test(c);
const handleKeys: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
const gestureKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];
const types: GradientType[] = ['linear', 'radial', 'angular'];
const radialLike = (t: GradientEditorType) => t === 'radial' || t === 'diamond';
const paintable = (v: GradientEditorValue): GradientValue => ({ ...v, type: v.type === 'diamond' ? 'radial' : v.type });
const hatch = 'repeating-linear-gradient(135deg, var(--cs-color-neutral-selected) 0 6px, transparent 6px 12px)';

const flagged = (flags: boolean | GradientEditorFieldFlags | undefined, field: GradientEditorField) => flags === true || (typeof flags === 'object' && flags[field] === true);
/** Attributes of a control whose field is being written elsewhere. */
const busy = { 'aria-busy': true, 'aria-readonly': true, 'data-reserved': true } as const;

interface StopKeys { stops: GradientStopData[]; ids: number[] }
/**
 * One id per stop, so a row keeps its identity when the list changes around it. A stop added in the list mints an id where it
 * sits, a removed one drops its id, and the rest keep theirs (an edit in place keeps every id). Other changes fall back to
 * position.
 */
function stopIdsFor(prev: StopKeys, stops: GradientStopData[], mint: () => number): number[] {
  const same = (a: GradientStopData, b: GradientStopData) => a.position === b.position && a.color === b.color;
  // The first index where the two lists part (the shorter length when they agree up to it).
  const parts = (longer: GradientStopData[], shorter: GradientStopData[]) => {
    let k = 0;
    while (k < shorter.length && same(longer[k]!, shorter[k]!)) k++;
    return k;
  };
  if (stops.length === prev.stops.length + 1) {
    const k = parts(stops, prev.stops);
    return [...prev.ids.slice(0, k), mint(), ...prev.ids.slice(k)];
  }
  if (stops.length === prev.stops.length - 1) {
    const k = parts(prev.stops, stops);
    return prev.ids.filter((_, j) => j !== k);
  }
  return stops.map((_, j) => prev.ids[j] ?? mint());
}

/**
 * Edits a gradient the way a design tool does: handles and stops on the preview, a strip, type, angle and a stop list.
 * The strip is its part GradientEditor.Strip (also exported as GradientEditorStrip).
 */
export function GradientEditor({
  value, defaultValue = defaultGradient, selected, defaultSelected = 1, disabled = false, commitMode = 'live', mixed, reserved, labels,
  onValueChange, onSelectedChange, onDraftChange, onPreviewChange, invalid, describedBy, limits, showTypeSwitch = true, reorderStops = true, onFieldFocus, onFieldBlur, onFieldCommit,
  tone, variant, radius, shadow, size, className, children, ...props
}: GradientEditorProps) {
  const contract = useFieldContract<GradientChange, GradientEditorField>({ invalid, describedBy, onFieldFocus, onFieldBlur, onFieldCommit });
  const [grad, setGrad] = useControllableState<GradientEditorValue>({ value, defaultValue, onChange: v => onValueChange?.(v) });
  const [sel, setSel] = useControllableState<number>({ value: selected, defaultValue: defaultSelected, onChange: i => onSelectedChange?.(i) });
  const [previewing, setPreviewing] = useState<GradientEditorValue | null>(null);
  const gesture = useRef<GradientEditorValue | null>(null);
  const gestureChange = useRef<{ key: string; change: GradientChange } | null>(null);
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
  // Stop rows are keyed by stop identity, not index. The rows present at first render stay still; a row added later rises,
  // a removed one plays its exit (usePresence) and the rows below it slide up (useFlip).
  const keys = useRef<StopKeys>({ stops: [], ids: [] });
  const minted = useRef(0);
  const ids = stopIdsFor(keys.current, stops, () => ++minted.current);
  useLayoutEffect(() => { keys.current = { stops, ids }; });
  const initial = useRef<Set<number> | null>(null);
  if (initial.current === null) initial.current = new Set(ids);
  const rowsRef = useRef<HTMLDivElement>(null);
  useFlip(rowsRef, '[data-slot="gradient-editor-row"]', 'stopId');
  const { entries: stopRows, exited } = usePresence(stops.map((stop, index) => ({ id: ids[index]!, stop, index })), r => String(r.id));
  const isReserved = (f: GradientEditorField) => flagged(reserved, f);
  const isMixed = (f: GradientEditorField) => flagged(mixed, f);
  const isDisabled = (f: GradientEditorField) => flagged(disabled, f);
  /** The slot wrapper of a field being written elsewhere carries the busy state as well. */
  const wrap = (f: GradientEditorField) => (isReserved(f) ? { 'aria-busy': true as const, 'data-reserved': true as const } : {});
  /** The wrapper of a typed or chosen field: the reserved state plus the field contract attributes. */
  const fwrap = (f: GradientEditorField, key: string = f) => ({ ...wrap(f), ...contract.wrapAttrs(key) });
  const fkey = (name: string, index?: number) => (index === undefined ? name : `${name}:${index}`);
  const neighbors = (i: number) => (reorderStops ? {} : { min: stops[i - 1]?.position ?? 0, max: stops[i + 1]?.position ?? 100 });
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
  const css = isMixed('stops') ? hatch : gradientCss(paintable(shown), box);
  const radial = radialLike(type);
  const startMixed = isMixed('start');
  const endMixed = isMixed('end');
  const angleMixed = isMixed('angle');
  const stopsMixed = isMixed('stops');

  /** A discrete change of one field: onFieldCommit first, the value only when it is accepted. */
  const commit = (next: GradientEditorValue, key: string, change: GradientChange) => { contract.commit(key, change, () => setGrad(next)); };
  /** A gesture step: previewed in release mode, committed at once in live mode. */
  const step = (next: GradientEditorValue, key: string, change: GradientChange) => {
    gestureChange.current = { key, change };
    if (release) { gesture.current = next; setPreviewing(next); onPreviewChange?.(next); } else commit(next, key, change);
  };
  /** The end of a gesture: one commit in release mode. */
  const finish = () => {
    const next = gesture.current;
    const info = gestureChange.current;
    gesture.current = null;
    gestureChange.current = null;
    if (!release || next === null) return;
    setPreviewing(null);
    if (info) commit(next, info.key, info.change); else setGrad(next);
    onPreviewChange?.(null);
  };
  const cancel = () => {
    if (gesture.current === null) return;
    gesture.current = null;
    setPreviewing(null);
    onPreviewChange?.(null);
  };
  /** The preview reported by a NumberField scrub (the field commits itself). */
  const preview = (next: GradientEditorValue | null) => { setPreviewing(next); onPreviewChange?.(next); };

  const setStops = (next: GradientStopData[]) => commit({ ...shown, stops: next }, 'stops', { field: 'stops', value: next });
  const select = (i: number) => { if (i !== sel) setSel(i); };

  const pointAt = (e: PointerEvent<HTMLElement>): GradientPoint => {
    const r = previewRef.current?.getBoundingClientRect();
    if (!r || r.width === 0 || r.height === 0) return { x: 0, y: 0 };
    return { x: clamp(((e.clientX - r.left) / r.width) * 100, 0, 100), y: clamp(((e.clientY - r.top) / r.height) * 100, 0, 100) };
  };
  const handleField = (which: 'start' | 'end'): GradientEditorField => which;
  const moveHandle = (which: 'start' | 'end', p: GradientPoint) => step({ ...shown, [which]: p }, which, { field: which, value: p });
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
    const moved = { x: clamp(p.x + d[0] * m, 0, 100), y: clamp(p.y + d[1] * m, 0, 100) };
    commit({ ...shown, [which]: moved }, which, { field: which, value: moved });
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
    const raw = positionOnAxis({ x: e.clientX - r.left, y: e.clientY - r.top }, start, end, box);
    const bounds = neighbors(i);
    const position = clamp(raw, bounds.min ?? 0, bounds.max ?? 100);
    if (position !== stops[i]?.position) step({ ...shown, stops: stops.map((s, k) => (k === i ? { ...s, position } : s)) }, fkey('stopPosition', i), { field: 'stopPosition', index: i, value: position });
  };
  const dotUp = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    finish();
  };
  const dotCancel = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    cancel();
  };

  const rotated = (deg: number): GradientEditorValue => ({ ...shown, ...rotateAxis(start, end, deg, box) });
  const addStop = () => {
    if (inert('stops')) return;
    const next = [...stops, { position: 75, color: newStopColor }];
    commit({ ...shown, stops: next }, 'stops', { field: 'stops', value: next });
    setSel(stops.length);
  };
  const removeStop = (i: number) => {
    if (inert('stops') || stops.length <= 2) return;
    const next = stops.filter((_, k) => k !== i);
    commit({ ...shown, stops: next }, 'stops', { field: 'stops', value: next });
    setSel(0);
  };
  const patchStop = (i: number, patch: Partial<GradientStopData>) => {
    const next = stops.map((s, k) => (k === i ? { ...s, ...patch } : s));
    if (patch.position !== undefined) commit({ ...shown, stops: next }, fkey('stopPosition', i), { field: 'stopPosition', index: i, value: patch.position });
    else if (patch.color !== undefined) commit({ ...shown, stops: next }, fkey('stopColor', i), { field: 'stopColor', index: i, value: patch.color });
    else setStops(next);
  };
  const pointWith = (key: 'start' | 'end', axis: 'x' | 'y', v: number): GradientEditorValue => ({ ...shown, [key]: { ...(key === 'start' ? start : end), [axis]: clamp(v, 0, 100) } });

  /** The props every numeric field shares: value model, mixed, reserved and the draft report. */
  const numeric = (name: GradientEditorField, draft: GradientEditorDraft['field'], index?: number) => ({
    mixed: isMixed(name), mixedLabel: labels.mixed, disabled: isDisabled(name), reserved: isReserved(name), commitMode,
    ...(draft === 'stopPosition' && index !== undefined ? neighbors(index) : {}),
    ...(draft in { angle: 1, stopPosition: 1, startX: 1, startY: 1, endX: 1, endY: 1 } ? limits?.[draft as 'angle'] : {}),
    ...contract.inputProps(fkey(name, index), isReserved(name) || isDisabled(name)),
    onDraftChange: (d: NumberFieldDraft) => { contract.draft(fkey(name, index), d); onDraftChange?.({ ...d, field: draft, ...(index === undefined ? {} : { index }) }); },
  });

  // Strip: a press on the bar adds a stop, a handle drag moves one. GradientEditor.Strip has no release callback, so the editor sees the pointer up on its root.
  const stripBlock = (e: SyntheticEvent) => {
    stripDown.current = true;
    const onStop = (e.target as HTMLElement).closest('[data-slot="gradient-editor-strip-stop"]') !== null;
    if (isReserved('stopPosition') || (!onStop && inert('stops'))) e.stopPropagation();
  };
  const stripUp = () => { stripDown.current = false; finish(); };
  const stripStops = (next: GradientStopData[]) => {
    if (next.length !== stops.length) { if (!inert('stops')) setStops(next); return; }
    if (inert('stopPosition')) return;
    if (stripDown.current) step({ ...shown, stops: next }, 'stops', { field: 'stops', value: next }); else setStops(next);
  };

  const vars = (p: GradientPoint) => ({ '--hx': `${p.x}%`, '--hy': `${p.y}%` }) as CSSProperties;
  // A stop at 0 % or 100 % sits exactly under the start or end handle. The handle then shrinks to a mark inside the
  // stop diamond (its hit area stays 16px), so the two shapes no longer overlap into a broken outline.
  const startOnStop = !stopsMixed && stops.some(s => s.position <= 0);
  const endOnStop = !stopsMixed && stops.some(s => s.position >= 100);
  const a = { x: (start.x / 100) * box.w, y: (start.y / 100) * box.h };
  const b = { x: (end.x / 100) * box.w, y: (end.y / 100) * box.h };

  return (
    <div data-slot="gradient-editor" data-disabled={disabled === true || undefined} className={cn(gradientEditorVariants({ radius, shadow, size }), className)} {...props}>
      <div data-slot="gradient-editor-canvas" className={gradientCanvasVariants()}>
        <div ref={previewRef} data-slot="gradient-editor-preview" data-type={type} data-mixed={stopsMixed || undefined} className={cn(gradientPreviewVariants({ tone, variant }))} style={{ '--gradient': css } as CSSProperties}>
          <svg data-slot="gradient-editor-guide" aria-hidden className={gradientGuideVariants()}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            {radial ? <circle cx={a.x} cy={a.y} r={length} /> : null}
          </svg>
          {stopsMixed ? null : stops.map((s, i) => (
            <span
              key={ids[i]} data-slot="gradient-editor-dot" data-selected={sel === i || undefined} data-disabled={isDisabled('stopPosition') || undefined} {...wrap('stopPosition')}
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
            data-on-stop={startOnStop || undefined} className={gradientHandleVariants({ end: false, mixed: startMixed })} style={vars(start)}
            {...(isReserved('start') ? busy : {})}
          />
          <button
            type="button" role="slider" data-slot="gradient-editor-handle-end" data-disabled={isDisabled('end') || undefined} data-mixed={endMixed || undefined}
            aria-label={labels.handleEnd} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(end.x)}
            aria-valuetext={endMixed ? labels.mixed : labels.handleValueText(Math.round(end.x), Math.round(end.y))}
            onPointerDown={handleDown('end')} onPointerMove={handleMove('end')} onPointerUp={handleUp} onPointerCancel={handleCancel} onKeyDown={handleKey('end')}
            data-on-stop={endOnStop || undefined} className={gradientHandleVariants({ end: true, mixed: endMixed })} style={vars(end)}
            {...(isReserved('end') ? busy : {})}
          />
          <span
            data-slot="gradient-editor-readout" aria-hidden className={gradientReadoutVariants()}
            style={{ '--rx': `${(start.x + end.x) / 2}%`, '--ry': `${(start.y + end.y) / 2}%` } as CSSProperties}
          >
            {angleMixed ? labels.mixed : radial ? labels.radiusReadout(Math.round(length)) : `${angleInt}°`}
          </span>
        </div>
        <GradientEditorStrip
          data-mixed={stopsMixed || undefined} className={gradientStripSlotVariants()} {...wrap('stopPosition')}
          onPointerDownCapture={stripBlock} onPointerUp={stripUp} onPointerCancel={stripUp}
          onKeyDownCapture={e => { if (isReserved('stopPosition') && gestureKeys.includes(e.key)) e.stopPropagation(); }}
          stopLabel={labels.stop} stops={stopsMixed ? [] : stops} selected={sel} disabled={isDisabled('stopPosition')}
          onStopsChange={stripStops} onSelectedChange={select}
        />
        <div data-slot="gradient-editor-controls" className={gradientControlsVariants()}>
          {showTypeSwitch ? (
            <div data-slot="gradient-editor-type" className="inline-flex" {...fwrap('type')}>
              <SegmentedControl
                aria-label={labels.typesGroup} size="xs" value={isMixed('type') ? '' : type} disabled={isDisabled('type')}
                onValueChange={t => { if (!isReserved('type')) commit({ ...shown, type: t as GradientEditorType }, 'type', { field: 'type', value: t as GradientEditorType }); }}
                onFocus={() => { if (!inert('type')) contract.focus('type'); }}
                onBlur={() => { if (!inert('type')) contract.blur('type'); }}
                {...(isReserved('type') ? busy : {})}
              >
                {types.map(t => <SegmentedControlItem key={t} value={t}>{labels.types[t]}</SegmentedControlItem>)}
                {labels.types.diamond !== undefined && type === 'diamond' ? <SegmentedControlItem value="diamond">{labels.types.diamond}</SegmentedControlItem> : null}
              </SegmentedControl>
            </div>
          ) : <span />}
          <div data-slot="gradient-editor-angle" className="flex items-center gap-1">
            <div data-slot="gradient-editor-dial" className="inline-flex" data-mixed={angleMixed || undefined} {...wrap('angle')} {...block('angle')}>
              <AngleDial
                label={labels.dial} valueText={angleMixed ? () => labels.mixed : labels.dialValueText} value={angleInt} disabled={isDisabled('angle')}
                onValueChange={deg => step(rotated(deg), 'angle', { field: 'angle', value: wrapAngle(deg) })}
                onValueCommit={() => finish()}
              />
            </div>
            <div data-slot="gradient-editor-angle-field" className="w-gradient-angle-w" {...fwrap('angle')}>
              <NumberField
                aria-label={labels.angle} unit="°" value={angleInt}
                onValueChange={v => commit(rotated(wrapAngle(v)), 'angle', { field: 'angle', value: wrapAngle(v) })}
                onPreviewChange={n => preview(n === null ? null : rotated(wrapAngle(n)))}
                {...numeric('angle', 'angle')}
              />
            </div>
            <div data-slot="gradient-editor-rotate" className="inline-flex" {...wrap('angle')}>
              <IconButton
                label={labels.rotate} size="xs" disabled={isDisabled('angle')}
                onClick={() => { if (!isReserved('angle')) commit(rotated(angleInt + 90), 'angle', { field: 'angle', value: wrapAngle(angleInt + 90) }); }} {...(isReserved('angle') ? busy : {})}
              >
                <RotateCw />
              </IconButton>
            </div>
            <div data-slot="gradient-editor-flip" className="inline-flex" {...wrap('start')}>
              <IconButton
                label={labels.flip} size="xs" disabled={isDisabled('start') || isDisabled('end')}
                onClick={() => { if (!isReserved('start') && !isReserved('end')) commit({ ...shown, start: end, end: start }, 'start', { field: 'start', value: end }); }} {...(isReserved('start') || isReserved('end') ? busy : {})}
              >
                <FlipHorizontal2 />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <div data-slot="gradient-editor-stops" className={gradientStopsVariants()}>
        <div data-slot="gradient-editor-stops-head" className="flex items-center justify-between gap-2 pb-1">
          <span data-slot="gradient-editor-stops-title" className={gradientSectionTitleVariants()}>{labels.stops}</span>
          <div data-slot="gradient-editor-add" className="inline-flex" {...wrap('stops')}>
            <IconButton label={labels.add} size="xs" disabled={isDisabled('stops')} onClick={addStop} {...(isReserved('stops') ? busy : {})}><Plus /></IconButton>
          </div>
        </div>
        <div ref={rowsRef} data-slot="gradient-editor-rows" className="grid gap-1" {...wrap('stops')}>
          {stopsMixed ? (
            <div data-slot="gradient-editor-row" data-mixed className={gradientRowVariants()}>
              <span data-slot="gradient-editor-row-mixed" className="col-span-3 flex items-center gap-1.5 px-1.5 text-footnote italic text-text-secondary">
                <ColorWell size="sm" mixed aria-hidden />
                {labels.mixed}
              </span>
            </div>
          ) : stopRows.map(({ key, present, item: { id, stop: s, index: i } }) => (
            <div
              key={key} data-slot="gradient-editor-row" data-stop-id={key} data-state={present ? undefined : 'closed'}
              data-selected={(present && sel === i) || undefined} inert={!present || undefined} aria-hidden={!present || undefined}
              onClick={() => select(i)} onAnimationEnd={e => { if (!present && e.target === e.currentTarget) exited(key); }}
              className={gradientRowVariants({ enter: initial.current?.has(id) !== true, leaving: !present })}
            >
              <div data-slot="gradient-editor-row-position" className="w-16" {...fwrap('stopPosition', fkey('stopPosition', i))}>
                <NumberField
                  aria-label={labels.position} containerClassName="rounded-sm" unit="%" min={0} max={100} value={s.position}
                  onValueChange={position => patchStop(i, { position })}
                  onPreviewChange={n => preview(n === null ? null : { ...shown, stops: stops.map((t, k) => (k === i ? { ...t, position: n } : t)) })}
                  {...numeric('stopPosition', 'stopPosition', i)}
                  onFocus={() => { select(i); if (!inert('stopPosition')) contract.focus(fkey('stopPosition', i)); }}
                />
              </div>
              <div data-slot="gradient-editor-row-well" className="inline-flex" {...wrap('stopColor')}>
                <ColorWell size="sm" appearance="checker" color={s.color} mixed={isMixed('stopColor')} aria-hidden />
              </div>
              <div data-slot="gradient-editor-row-hex" className="min-w-0" {...fwrap('stopColor', fkey('stopColor', i))}>
                <HexInput
                  aria-label={labels.color} disabled={isDisabled('stopColor')} reserved={isReserved('stopColor')} commitMode={commitMode}
                  mixed={isMixed('stopColor')} mixedLabel={labels.mixed} invalid={contract.isInvalid(fkey('stopColor', i))} aria-describedby={contract.describedBy(fkey('stopColor', i))}
                  data-field="stopColor" data-dirty={contract.isDirty(fkey('stopColor', i)) || undefined}
                  onFocus={() => { select(i); if (!inert('stopColor')) contract.focus(fkey('stopColor', i)); }}
                  onBlur={() => { if (!inert('stopColor')) contract.blur(fkey('stopColor', i)); }}
                  value={isHexColor(s.color) ? s.color.slice(1).toUpperCase() : undefined} token={isHexColor(s.color) ? undefined : s.color}
                  onValueChange={hex => patchStop(i, { color: `#${hex}` })}
                  onDraftChange={d => { contract.draft(fkey('stopColor', i), d); onDraftChange?.({ field: 'stopColor', index: i, text: d.text, value: d.value, error: d.error, dirty: d.dirty }); }}
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
            <ChevronRight data-slot="gradient-editor-summary-chevron" aria-hidden className="size-icon-sm shrink-0 stroke-[1.75] transition-[rotate] duration-base ease-out group-open:rotate-90" />
            {labels.details}
          </summary>
          <div data-slot="gradient-editor-details-body" className="mt-1.5 grid grid-cols-2 gap-1.5">
            <div data-slot="gradient-editor-coord" {...fwrap('startX')}>
              <NumberField
                label={labels.startXShort} unit="%" aria-label={labels.startX} min={0} max={100} value={Math.round(start.x)}
                onValueChange={v => commit(pointWith('start', 'x', v), 'startX', { field: 'startX', value: v })} onPreviewChange={n => preview(n === null ? null : pointWith('start', 'x', n))}
                {...numeric('startX', 'startX')}
              />
            </div>
            <div data-slot="gradient-editor-coord" {...fwrap('startY')}>
              <NumberField
                label={labels.startYShort} unit="%" aria-label={labels.startY} min={0} max={100} value={Math.round(start.y)}
                onValueChange={v => commit(pointWith('start', 'y', v), 'startY', { field: 'startY', value: v })} onPreviewChange={n => preview(n === null ? null : pointWith('start', 'y', n))}
                {...numeric('startY', 'startY')}
              />
            </div>
            <div data-slot="gradient-editor-coord" {...fwrap('endX')}>
              <NumberField
                label={labels.endXShort} unit="%" aria-label={labels.endX} min={0} max={100} value={Math.round(end.x)}
                onValueChange={v => commit(pointWith('end', 'x', v), 'endX', { field: 'endX', value: v })} onPreviewChange={n => preview(n === null ? null : pointWith('end', 'x', n))}
                {...numeric('endX', 'endX')}
              />
            </div>
            <div data-slot="gradient-editor-coord" {...fwrap('endY')}>
              <NumberField
                label={labels.endYShort} unit="%" aria-label={labels.endY} min={0} max={100} value={Math.round(end.y)}
                onValueChange={v => commit(pointWith('end', 'y', v), 'endY', { field: 'endY', value: v })} onPreviewChange={n => preview(n === null ? null : pointWith('end', 'y', n))}
                {...numeric('endY', 'endY')}
              />
            </div>
          </div>
        </details>
        {children}
      </div>
    </div>
  );
}

GradientEditor.Strip = GradientEditorStrip;
