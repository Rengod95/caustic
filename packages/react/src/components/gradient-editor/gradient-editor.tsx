'use client';
import { ChevronRight, FlipHorizontal2, Minus, Plus, RotateCw } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
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
import { NumberField } from '../number-field/number-field.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import {
  gradientCanvasVariants, gradientControlsVariants, gradientDotVariants, gradientEditorVariants, gradientGuideVariants, gradientHandleVariants,
  gradientPreviewVariants, gradientReadoutVariants, gradientRowVariants, gradientStopsVariants, gradientSummaryVariants,
} from './gradient-editor.variants.ts';

export type { GradientValue, GradientType, GradientPoint, GradientStopData };

export interface GradientEditorProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Controlled gradient. start and end are percentages of the preview box; stops are position 0-100 and a CSS color. */
  value?: GradientValue;
  defaultValue?: GradientValue;
  /** Controlled index of the selected stop. */
  selected?: number;
  /** Uncontrolled selected stop. */
  defaultSelected?: number;
  disabled?: boolean;
  onValueChange?: (value: GradientValue) => void;
  onSelectedChange?: (index: number) => void;
}

const wrapAngle = (n: number) => ((Math.round(n) % 360) + 360) % 360;
const isHexColor = (c: string) => /^#[0-9a-fA-F]{3,8}$/.test(c);
const handleKeys: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };

/** Edits a gradient the way a design tool does: handles and stops on the preview, a strip, type, angle and a stop list. */
export function GradientEditor({ value, defaultValue = defaultGradient, selected, defaultSelected = 1, disabled = false, onValueChange, onSelectedChange, className, ...props }: GradientEditorProps) {
  const [grad, setGrad] = useControllableState<GradientValue>({ value, defaultValue, onChange: v => onValueChange?.(v) });
  const [sel, setSel] = useControllableState<number>({ value: selected, defaultValue: defaultSelected, onChange: i => onSelectedChange?.(i) });
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

  const { start, end, stops, type } = grad;
  const angle = axisAngle(start, end, box);
  const angleInt = wrapAngle(angle);
  const length = axisLength(start, end, box);
  const css = gradientCss(grad, box);
  const update = (patch: Partial<GradientValue>) => setGrad({ ...grad, ...patch });
  const setStops = (next: GradientStopData[]) => update({ stops: next });
  const select = (i: number) => { if (i !== sel) setSel(i); };

  const pointAt = (e: PointerEvent<HTMLElement>): GradientPoint => {
    const r = previewRef.current?.getBoundingClientRect();
    if (!r || r.width === 0 || r.height === 0) return { x: 0, y: 0 };
    return { x: clamp(((e.clientX - r.left) / r.width) * 100, 0, 100), y: clamp(((e.clientY - r.top) / r.height) * 100, 0, 100) };
  };
  const moveHandle = (which: 'start' | 'end', p: GradientPoint) => update(which === 'start' ? { start: p } : { end: p });
  const handleDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus({ preventScroll: true });
  };
  const handleMove = (which: 'start' | 'end') => (e: PointerEvent<HTMLButtonElement>) => {
    if (disabled || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    let p = pointAt(e);
    if (e.shiftKey) p = snapAxis(p, which === 'start' ? end : start, box);
    moveHandle(which, p);
  };
  const handleUp = (e: PointerEvent<HTMLButtonElement>) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); };
  const handleKey = (which: 'start' | 'end') => (e: KeyboardEvent<HTMLButtonElement>) => {
    const d = handleKeys[e.key];
    if (!d || disabled) return;
    e.preventDefault();
    const m = e.shiftKey ? 10 : 1;
    const p = which === 'start' ? start : end;
    moveHandle(which, { x: clamp(p.x + d[0] * m, 0, 100), y: clamp(p.y + d[1] * m, 0, 100) });
  };
  const dotDown = (i: number) => (e: PointerEvent<HTMLSpanElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    select(i);
  };
  const dotMove = (i: number) => (e: PointerEvent<HTMLSpanElement>) => {
    if (disabled || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const r = previewRef.current?.getBoundingClientRect();
    if (!r) return;
    const position = positionOnAxis({ x: e.clientX - r.left, y: e.clientY - r.top }, start, end, box);
    if (position !== stops[i]?.position) setStops(stops.map((s, k) => (k === i ? { ...s, position } : s)));
  };
  const dotUp = (e: PointerEvent<HTMLSpanElement>) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); };

  const setAngle = (deg: number) => update(rotateAxis(start, end, deg, box));
  const addStop = () => {
    setGrad({ ...grad, stops: [...stops, { position: 75, color: newStopColor }] });
    setSel(stops.length);
  };
  const removeStop = (i: number) => {
    if (stops.length <= 2) return;
    setGrad({ ...grad, stops: stops.filter((_, k) => k !== i) });
    setSel(0);
  };
  const patchStop = (i: number, patch: Partial<GradientStopData>) => setStops(stops.map((s, k) => (k === i ? { ...s, ...patch } : s)));
  const coord = (key: 'start' | 'end', axis: 'x' | 'y') => (v: number) => update({ [key]: { ...(key === 'start' ? start : end), [axis]: clamp(v, 0, 100) } } as Partial<GradientValue>);

  const vars = (p: GradientPoint) => ({ '--hx': `${p.x}%`, '--hy': `${p.y}%` }) as CSSProperties;
  const a = { x: (start.x / 100) * box.w, y: (start.y / 100) * box.h };
  const b = { x: (end.x / 100) * box.w, y: (end.y / 100) * box.h };

  return (
    <div data-slot="gradient-editor" data-disabled={disabled || undefined} className={cn(gradientEditorVariants(), className)} {...props}>
      <div data-slot="gradient-editor-canvas" className={gradientCanvasVariants()}>
        <div ref={previewRef} data-slot="gradient-editor-preview" data-type={type} className={gradientPreviewVariants()} style={{ '--gradient': css } as CSSProperties}>
          <svg data-slot="gradient-editor-guide" aria-hidden className={gradientGuideVariants()}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            {type === 'radial' ? <circle cx={a.x} cy={a.y} r={length} /> : null}
          </svg>
          {stops.map((s, i) => (
            <span
              key={i} data-slot="gradient-editor-dot" data-selected={sel === i || undefined} data-disabled={disabled || undefined}
              onPointerDown={dotDown(i)} onPointerMove={dotMove(i)} onPointerUp={dotUp} onPointerCancel={dotUp}
              className={gradientDotVariants()}
              style={{ '--dx': `${start.x + ((end.x - start.x) * s.position) / 100}%`, '--dy': `${start.y + ((end.y - start.y) * s.position) / 100}%`, '--stop-color': s.color } as CSSProperties}
            />
          ))}
          <button
            type="button" role="slider" data-slot="gradient-editor-handle-start" data-disabled={disabled || undefined}
            aria-label="Gradient start, drag to move" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(start.x)} aria-valuetext={`${Math.round(start.x)} %, ${Math.round(start.y)} %`}
            onPointerDown={handleDown} onPointerMove={handleMove('start')} onPointerUp={handleUp} onPointerCancel={handleUp} onKeyDown={handleKey('start')}
            className={gradientHandleVariants({ end: false })} style={vars(start)}
          />
          <button
            type="button" role="slider" data-slot="gradient-editor-handle-end" data-disabled={disabled || undefined}
            aria-label="Gradient end, drag to set angle and length" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(end.x)} aria-valuetext={`${Math.round(end.x)} %, ${Math.round(end.y)} %`}
            onPointerDown={handleDown} onPointerMove={handleMove('end')} onPointerUp={handleUp} onPointerCancel={handleUp} onKeyDown={handleKey('end')}
            className={gradientHandleVariants({ end: true })} style={vars(end)}
          />
          <span
            data-slot="gradient-editor-readout" aria-hidden className={gradientReadoutVariants()}
            style={{ '--rx': `${(start.x + end.x) / 2}%`, '--ry': `${(start.y + end.y) / 2}%` } as CSSProperties}
          >
            {type === 'radial' ? `r ${Math.round(length)}px` : `${angleInt}°`}
          </span>
        </div>
        <div data-slot="gradient-editor-strip">
          <GradientStrip stops={stops} selected={sel} disabled={disabled} onStopsChange={setStops} onSelectedChange={i => { if (i !== sel) setSel(i); }} />
        </div>
        <div data-slot="gradient-editor-controls" className={gradientControlsVariants()}>
          <div data-slot="gradient-editor-type" className="inline-flex">
            <SegmentedControl aria-label="Gradient type" size="xs" value={type} disabled={disabled} onValueChange={t => update({ type: t as GradientType })}>
              <SegmentedControlItem value="linear">Linear</SegmentedControlItem>
              <SegmentedControlItem value="radial">Radial</SegmentedControlItem>
              <SegmentedControlItem value="angular">Angular</SegmentedControlItem>
            </SegmentedControl>
          </div>
          <div data-slot="gradient-editor-angle" className="flex items-center gap-1">
            <div data-slot="gradient-editor-dial" className="inline-flex">
              <AngleDial value={angleInt} disabled={disabled} onValueChange={setAngle} />
            </div>
            <div data-slot="gradient-editor-angle-field" className="w-gradient-angle-w">
              <NumberField aria-label="Angle" unit="°" value={angleInt} locked={disabled} onValueChange={v => setAngle(wrapAngle(v))} />
            </div>
            <div data-slot="gradient-editor-rotate" className="inline-flex">
              <IconButton label="Rotate 90°" size="xs" disabled={disabled} onClick={() => setAngle(angleInt + 90)}><RotateCw /></IconButton>
            </div>
            <div data-slot="gradient-editor-flip" className="inline-flex">
              <IconButton label="Flip" size="xs" disabled={disabled} onClick={() => update({ start: end, end: start })}><FlipHorizontal2 /></IconButton>
            </div>
          </div>
        </div>
      </div>
      <div data-slot="gradient-editor-stops" className={gradientStopsVariants()}>
        <div data-slot="gradient-editor-stops-head" className="flex items-center justify-between gap-2">
          <span data-slot="gradient-editor-stops-title" className="text-ui-xs font-semibold text-text-tertiary">Stops</span>
          <div data-slot="gradient-editor-add" className="inline-flex">
            <IconButton label="Add stop" size="xs" disabled={disabled} onClick={addStop}><Plus /></IconButton>
          </div>
        </div>
        <div data-slot="gradient-editor-rows" className="grid gap-1">
          {stops.map((s, i) => (
            <div key={i} data-slot="gradient-editor-row" data-selected={sel === i || undefined} onClick={() => select(i)} className={gradientRowVariants()}>
              <div data-slot="gradient-editor-row-position" className="w-16">
                <NumberField aria-label="Position" containerClassName="rounded-sm" unit="%" min={0} max={100} value={s.position} locked={disabled} onFocus={() => select(i)} onValueChange={position => patchStop(i, { position })} />
              </div>
              <div data-slot="gradient-editor-row-well" className="inline-flex">
                <ColorWell size="sm" appearance="checker" color={s.color} aria-hidden />
              </div>
              <div data-slot="gradient-editor-row-hex" className="min-w-0">
                <HexInput
                  aria-label="Color" disabled={disabled} onFocus={() => select(i)}
                  value={isHexColor(s.color) ? s.color.slice(1).toUpperCase() : undefined} token={isHexColor(s.color) ? undefined : s.color}
                  onValueChange={hex => patchStop(i, { color: `#${hex}` })}
                />
              </div>
              <div data-slot="gradient-editor-row-remove" className="inline-flex">
                <IconButton label="Remove stop" size="xs" disabled={disabled || stops.length <= 2} onClick={e => { e.stopPropagation(); removeStop(i); }}><Minus /></IconButton>
              </div>
            </div>
          ))}
        </div>
        <details data-slot="gradient-editor-details" open className="group">
          <summary data-slot="gradient-editor-summary" className={gradientSummaryVariants()}>
            <ChevronRight aria-hidden className="size-icon-sm shrink-0 stroke-[1.75] transition-transform duration-base ease-out group-open:rotate-90" />
            Start &amp; end
          </summary>
          <div data-slot="gradient-editor-details-body" className="mt-1.5 grid grid-cols-2 gap-1.5">
            <div data-slot="gradient-editor-coord"><NumberField label="X1" unit="%" aria-label="Start X" min={0} max={100} value={Math.round(start.x)} locked={disabled} onValueChange={coord('start', 'x')} /></div>
            <div data-slot="gradient-editor-coord"><NumberField label="Y1" unit="%" aria-label="Start Y" min={0} max={100} value={Math.round(start.y)} locked={disabled} onValueChange={coord('start', 'y')} /></div>
            <div data-slot="gradient-editor-coord"><NumberField label="X2" unit="%" aria-label="End X" min={0} max={100} value={Math.round(end.x)} locked={disabled} onValueChange={coord('end', 'x')} /></div>
            <div data-slot="gradient-editor-coord"><NumberField label="Y2" unit="%" aria-label="End Y" min={0} max={100} value={Math.round(end.y)} locked={disabled} onValueChange={coord('end', 'y')} /></div>
          </div>
        </details>
      </div>
    </div>
  );
}
