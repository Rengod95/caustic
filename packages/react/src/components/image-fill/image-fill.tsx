'use client';
import { Crop, Upload } from '../../icons/index.ts';
import { useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Button } from '../button/button.tsx';
import { Popover, PopoverTitle, type PopoverProps } from '../popover/popover.tsx';
import { Slider } from '../slider/slider.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import type { CommonProps } from '../../lib/common-props.ts';
import { defined } from '../../lib/defined.ts';
import {
  imageFillControlsVariants, imageFillCropCanvasVariants, imageFillCropEditVariants, imageFillCropFootVariants, imageFillCropFrameVariants, imageFillCropHandleVariants,
  imageFillCropImageVariants, imageFillCropRectVariants, imageFillFileVariants, imageFillFrameVariants, imageFillImageVariants, imageFillStageBoxVariants,
  imageFillStageVariants, imageFillVariants,
} from './image-fill.variants.ts';

export type ImageFillMode = 'fill' | 'fit' | 'crop' | 'tile';

/**
 * The crop. x, y, w, h: the kept rectangle as fractions (0–1) of the image box, the image as it covers the 4:3 crop
 * canvas at zoom 1 (for a 4:3 image or a CSS gradient, the whole source). They do not depend on zoom: cropping the
 * image box by them gives the kept region. zoom (1–4) is the magnification of the editor view, kept so it reopens alike.
 */
export interface ImageFillCrop { x: number; y: number; w: number; h: number; zoom: number }

/** Texts of the component. Unset (or undefined) keys keep the English default. */
export interface ImageFillLabels {
  /** aria-label of the mode control. */
  modeGroup: string;
  fill: string;
  fit: string;
  crop: string;
  tile: string;
  replace: string;
  /** The edit-crop button over the stage. */
  edit: string;
  /** The popover title (names the dialog). */
  title: string;
  /** aria-label of the crop frame (a 2D slider). */
  frame: string;
  /** aria-valuetext of the crop frame, from the percentages. */
  frameValueText: (x: number, y: number, w: number, h: number) => string;
  zoom: string;
  reset: string;
  done: string;
}

const LABELS: ImageFillLabels = {
  modeGroup: 'Image fill mode', fill: 'Fill', fit: 'Fit', crop: 'Crop', tile: 'Tile', replace: 'Replace',
  edit: 'Edit crop', title: 'Crop', frame: 'Crop area', zoom: 'Zoom', reset: 'Reset', done: 'Done',
  frameValueText: (x, y, w, h) => `Left ${x} %, top ${y} %, width ${w} %, height ${h} %`,
};
/** Reset: the whole image, no zoom. */
const FULL: ImageFillCrop = { x: 0, y: 0, w: 1, h: 1, zoom: 1 };
const DEFAULT_CROP: ImageFillCrop = { x: 0.1, y: 0.1, w: 0.8, h: 0.8, zoom: 1 };
const MIN = 0.1;
const HANDLES = ['nw', 'ne', 'sw', 'se'] as const;
type Handle = (typeof HANDLES)[number];
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const r3 = (v: number) => Math.round(v * 1000) / 1000;
type Rect = Pick<ImageFillCrop, 'x' | 'y' | 'w' | 'h'>;
/** Image box → crop canvas at a zoom (the image scales from the canvas centre), and back. */
const toView = (c: Rect, z: number): Rect => ({ x: 0.5 + (c.x - 0.5) * z, y: 0.5 + (c.y - 0.5) * z, w: c.w * z, h: c.h * z });
const fromView = (v: Rect, z: number): Rect => ({ x: r3(0.5 + (v.x - 0.5) / z), y: r3(0.5 + (v.y - 0.5) / z), w: r3(v.w / z), h: r3(v.h / z) });
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export interface ImageFillProps extends Omit<ComponentProps<'div'>, 'children'>, CommonProps {
  /** Fit mode (controlled). */
  mode?: ImageFillMode;
  /** Uncontrolled initial mode. */
  defaultMode?: ImageFillMode;
  /** The image as a CSS image value (url(...) or gradients). */
  src?: string;
  fileName?: ReactNode;
  fileMeta?: ReactNode;
  disabled?: boolean;
  onModeChange?: (mode: ImageFillMode) => void;
  onReplace?: () => void;
  /** The crop (controlled): kept rectangle as 0–1 fractions of the image box (zoom-independent) and the editor zoom (1–4). Edited in the crop popover. */
  crop?: ImageFillCrop;
  /** Uncontrolled initial crop. */
  defaultCrop?: ImageFillCrop;
  onCropChange?: (crop: ImageFillCrop) => void;
  /** Texts of the mode control, Replace, the edit button and the crop popover. */
  labels?: Partial<ImageFillLabels>;
  /** The crop popover: open / defaultOpen / onOpenChange, and inline (render it in place under the stage, for docs and tests). */
  cropPopover?: Pick<PopoverProps, 'open' | 'defaultOpen' | 'onOpenChange' | 'inline'>;
}

const MODES: ImageFillMode[] = ['fill', 'fit', 'crop', 'tile'];
/** Before the stage is measured (and on the server), crop mode shows the image at this fixed inset. */
const STAGE_FALLBACK = { t: '-20%', r: '-10%', b: '-10%', l: '-30%' };

/** An image paint: a preview of how the image sits in its shape, the fit mode, Replace and the file facts. */
export function ImageFill({
  tone, variant, radius, shadow, size, mode, defaultMode = 'fill', src, fileName, fileMeta, disabled = false, onModeChange, onReplace,
  crop, defaultCrop = DEFAULT_CROP, onCropChange, labels: labelsProp, cropPopover, className, ...props
}: ImageFillProps) {
  const [current, setCurrent] = useControllableState<ImageFillMode>({ value: mode, defaultValue: defaultMode, onChange: onModeChange });
  const [cropValue, setCrop] = useControllableState<ImageFillCrop>({ value: crop, defaultValue: defaultCrop, onChange: onCropChange });
  const [open, setOpen] = useControllableState<boolean>({ value: cropPopover?.open, defaultValue: cropPopover?.defaultOpen ?? false, onChange: cropPopover?.onOpenChange });
  const labels: ImageFillLabels = { ...LABELS, ...defined({ ...labelsProp }) };
  const cropping = current === 'crop';
  // Disabled (or out of crop mode) the popover closes rather than waiting to reappear.
  useEffect(() => { if (open && (disabled || !cropping)) setOpen(false); }, [open, disabled, cropping, setOpen]);

  // The stage pictures the crop: the 4:3 image box is placed so the kept rectangle covers the dashed crop frame.
  const stage = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ W: number; H: number; fx: number; fy: number; fw: number; fh: number } | null>(null);
  useIsoLayoutEffect(() => {
    const el = stage.current;
    const frame = el?.querySelector<HTMLElement>('[data-slot="image-fill-crop-frame"]');
    if (!el || !frame) return;
    const measure = () => setBox({ W: el.clientWidth, H: el.clientHeight, fx: frame.offsetLeft, fy: frame.offsetTop, fw: frame.offsetWidth, fh: frame.offsetHeight });
    measure();
    const ro = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    ro?.observe(el);
    return () => ro?.disconnect();
  }, []);
  let place = STAGE_FALLBACK;
  if (box && box.fw > 0 && box.fh > 0 && cropValue.w > 0 && cropValue.h > 0) {
    const bw = Math.max(box.fw / cropValue.w, box.fh / (cropValue.h * 0.75));
    const bh = bw * 0.75;
    const l = box.fx + box.fw / 2 - (cropValue.x + cropValue.w / 2) * bw;
    const t = box.fy + box.fh / 2 - (cropValue.y + cropValue.h / 2) * bh;
    place = { t: `${t}px`, r: `${box.W - l - bw}px`, b: `${box.H - t - bh}px`, l: `${l}px` };
  }
  const vars = { '--img': src, '--stage-t': place.t, '--stage-r': place.r, '--stage-b': place.b, '--stage-l': place.l } as CSSProperties;
  return (
    <div data-slot="image-fill" data-mode={current} className={cn(imageFillVariants(), className)} {...props}>
      <div data-slot="image-fill-stage-box" className={imageFillStageBoxVariants()}>
        <div ref={stage} data-slot="image-fill-stage" aria-hidden data-mode={current} className={cn(imageFillStageVariants({ tone, variant, size }), imageFillFrameVariants({ radius, shadow }))}>
          <span data-slot="image-fill-image" className={imageFillImageVariants({ mode: current })} style={vars} />
          <span data-slot="image-fill-crop-frame" className={imageFillCropFrameVariants({ mode: current })} />
        </div>
        {cropping && (
          <Popover
            open={open && !disabled} onOpenChange={next => { if (!disabled) setOpen(next); }} inline={cropPopover?.inline ?? false} side="left" align="start" size="lg" arrow={false}
            data-slot="image-fill-crop-popover"
            anchor={(
              <Button data-slot="image-fill-crop-edit" tone="neutral" variant="outline" size="xs" disabled={disabled} iconStart={<Crop aria-hidden />} className={imageFillCropEditVariants()}
                // Inline has no Radix trigger, so the button toggles it itself.
                onClick={cropPopover?.inline && !disabled ? () => setOpen(!open) : undefined}
              >
                {labels.edit}
              </Button>
            )}
          >
            <PopoverTitle>{labels.title}</PopoverTitle>
            <CropEditor value={cropValue} onChange={setCrop} src={src} labels={labels} />
            <div data-slot="image-fill-crop-foot" className={imageFillCropFootVariants()}>
              <Button data-slot="image-fill-crop-reset" tone="neutral" variant="ghost" size="sm" onClick={() => setCrop(FULL)}>{labels.reset}</Button>
              <Button data-slot="image-fill-crop-done" tone="neutral" variant="solid" size="sm" onClick={() => setOpen(false)}>{labels.done}</Button>
            </div>
          </Popover>
        )}
      </div>
      <div data-slot="image-fill-controls" className={imageFillControlsVariants()}>
        <SegmentedControl
          data-slot="image-fill-mode" size={size === 'lg' ? 'sm' : 'xs'} aria-label={labels.modeGroup} value={current} disabled={disabled}
          onValueChange={v => setCurrent(v as ImageFillMode)}
        >
          {MODES.map(m => <SegmentedControlItem key={m} value={m}>{labels[m]}</SegmentedControlItem>)}
        </SegmentedControl>
        <Button data-slot="image-fill-replace" tone="secondary" size={size === 'lg' ? 'sm' : 'xs'} disabled={disabled} iconStart={<Upload aria-hidden />} onClick={() => onReplace?.()}>{labels.replace}</Button>
      </div>
      <div data-slot="image-fill-file" className={imageFillFileVariants()}>
        <span data-slot="image-fill-file-name" className="min-w-0 truncate font-mono text-mono text-text-tertiary">{fileName}</span>
        <span data-slot="image-fill-file-meta" className="flex-none whitespace-nowrap text-ui-sm font-normal text-text-tertiary">{fileMeta}</span>
      </div>
    </div>
  );
}

interface CropEditorProps { value: ImageFillCrop; onChange: (crop: ImageFillCrop) => void; src: string | undefined; labels: ImageFillLabels }

/**
 * The 4:3 crop canvas (the image at its zoom, the frame dimming the rest) and the zoom slider. Pointer and keys work on
 * the frame as drawn on the canvas (view space); the value is stored in image-box space (toView / fromView).
 */
function CropEditor({ value, onChange, src, labels }: CropEditorProps) {
  const canvas = useRef<HTMLDivElement>(null);
  const drag = useRef<{ handle: Handle | 'move'; px: number; py: number; start: Rect } | null>(null);
  const latest = useRef(value); latest.current = value;
  const set = (next: ImageFillCrop) => { latest.current = next; onChange(next); };
  /** Stores a frame given on the canvas, at the current zoom. */
  const setView = (v: Rect) => set({ ...latest.current, ...fromView(v, latest.current.zoom) });
  const down = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const handle = (e.currentTarget.dataset.handle as Handle | undefined) ?? 'move';
    drag.current = { handle, px: e.clientX, py: e.clientY, start: toView(latest.current, latest.current.zoom) };
    canvas.current?.querySelector<HTMLElement>('[role="slider"]')?.focus({ preventScroll: true });
  };
  const move = (e: PointerEvent<HTMLSpanElement>) => {
    const d = drag.current;
    const box = canvas.current?.getBoundingClientRect();
    if (!d || !box || box.width === 0 || box.height === 0) return;
    const dx = (e.clientX - d.px) / box.width;
    const dy = (e.clientY - d.py) / box.height;
    const s = d.start;
    if (d.handle === 'move') { setView({ ...s, x: clamp(s.x + dx, 0, 1 - s.w), y: clamp(s.y + dy, 0, 1 - s.h) }); return; }
    let { x, y, w, h } = s;
    if (d.handle.includes('w')) { const nx = clamp(s.x + dx, 0, s.x + s.w - MIN); w = s.x + s.w - nx; x = nx; }
    else w = clamp(s.w + dx, MIN, 1 - s.x);
    if (d.handle.includes('n')) { const ny = clamp(s.y + dy, 0, s.y + s.h - MIN); h = s.y + s.h - ny; y = ny; }
    else h = clamp(s.h + dy, MIN, 1 - s.y);
    setView({ x, y, w, h });
  };
  // Up, cancel and a lost capture (the element left the DOM, the window lost focus) all end the drag.
  const up = (e: PointerEvent<HTMLSpanElement>) => {
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };
  // Arrows move the frame by 1 % (Shift 10 %); with Alt they resize it from the bottom-right corner.
  const keyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    const step = e.shiftKey ? 0.1 : 0.01;
    const dx = e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0;
    const dy = e.key === 'ArrowDown' ? step : e.key === 'ArrowUp' ? -step : 0;
    if (!dx && !dy) return;
    e.preventDefault();
    const s = toView(latest.current, latest.current.zoom);
    setView(e.altKey
      ? { ...s, w: clamp(s.w + dx, MIN, 1 - s.x), h: clamp(s.h + dy, MIN, 1 - s.y) }
      : { ...s, x: clamp(s.x + dx, 0, 1 - s.w), y: clamp(s.y + dy, 0, 1 - s.h) });
  };
  // Zooming keeps the frame where it is on the canvas, so the kept region of the image shrinks or grows.
  const zoomTo = (zoom: number) => {
    const s = latest.current;
    set({ ...fromView(toView(s, s.zoom), zoom), zoom });
  };
  const pct = (v: number) => Math.round(v * 100);
  const view = toView(value, value.zoom);
  const l = clamp(view.x, 0, 1), t = clamp(view.y, 0, 1);
  const vars = {
    '--img': src,
    '--zoom': String(value.zoom),
    '--crop-l': `${l * 100}%`,
    '--crop-t': `${t * 100}%`,
    '--crop-r': `${(1 - clamp(view.x + view.w, l, 1)) * 100}%`,
    '--crop-b': `${(1 - clamp(view.y + view.h, t, 1)) * 100}%`,
  } as CSSProperties;
  // The slider value is the left edge in the image box; it can range over the part of the image the canvas shows.
  const visibleMin = 0.5 - 0.5 / value.zoom;
  return (
    <>
      <div ref={canvas} data-slot="image-fill-crop-canvas" className={imageFillCropCanvasVariants()} style={vars}>
        <span data-slot="image-fill-crop-image" aria-hidden className={imageFillCropImageVariants()} />
        <span
          data-slot="image-fill-crop-rect" role="slider" tabIndex={0} aria-label={labels.frame}
          aria-valuemin={pct(visibleMin)} aria-valuemax={Math.max(pct(visibleMin), pct(1 - visibleMin - value.w))} aria-valuenow={pct(value.x)} aria-valuetext={labels.frameValueText(pct(value.x), pct(value.y), pct(value.w), pct(value.h))}
          className={imageFillCropRectVariants()} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up} onKeyDown={keyDown}
        >
          {HANDLES.map(h => (
            <span key={h} data-slot="image-fill-crop-handle" data-handle={h} aria-hidden className={imageFillCropHandleVariants({ handle: h })} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up} />
          ))}
        </span>
      </div>
      <Slider
        data-slot="image-fill-crop-zoom" label={labels.zoom} field unit="%" min={100} max={400} step={1}
        value={Math.round(value.zoom * 100)} onValueChange={v => zoomTo(v / 100)}
      />
    </>
  );
}
