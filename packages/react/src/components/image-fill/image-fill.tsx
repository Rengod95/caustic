'use client';
import { Crop, Upload } from 'lucide-react';
import { useRef, type ComponentProps, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Button } from '../button/button.tsx';
import { Popover, PopoverTitle, type PopoverProps } from '../popover/popover.tsx';
import { Slider } from '../slider/slider.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import type { CommonProps } from '../../lib/common-props.ts';
import {
  imageFillControlsVariants, imageFillCropCanvasVariants, imageFillCropEditVariants, imageFillCropFootVariants, imageFillCropFrameVariants, imageFillCropHandleVariants,
  imageFillCropImageVariants, imageFillCropRectVariants, imageFillFileVariants, imageFillFrameVariants, imageFillImageVariants, imageFillStageBoxVariants,
  imageFillStageVariants, imageFillVariants,
} from './image-fill.variants.ts';

export type ImageFillMode = 'fill' | 'fit' | 'crop' | 'tile';

/** The crop: the kept rectangle as fractions (0–1) of the image box, and the image zoom (1 = cover, up to 4). */
export interface ImageFillCrop { x: number; y: number; w: number; h: number; zoom: number }

/** Texts of the crop editor. Unset keys keep the English default. */
export interface ImageFillCropLabels {
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

const CROP_LABELS: ImageFillCropLabels = {
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
  /** The crop (controlled): kept rectangle as 0–1 fractions of the image box and zoom (1–4). Edited in the crop popover. */
  crop?: ImageFillCrop;
  /** Uncontrolled initial crop. */
  defaultCrop?: ImageFillCrop;
  onCropChange?: (crop: ImageFillCrop) => void;
  /** Texts of the edit button and the crop popover. */
  cropLabels?: Partial<ImageFillCropLabels>;
  /** The crop popover: open / defaultOpen / onOpenChange, and inline (render it in place under the stage, for docs and tests). */
  cropPopover?: Pick<PopoverProps, 'open' | 'defaultOpen' | 'onOpenChange' | 'inline'>;
}

const MODES: { value: ImageFillMode; label: string }[] = [
  { value: 'fill', label: 'Fill' },
  { value: 'fit', label: 'Fit' },
  { value: 'crop', label: 'Crop' },
  { value: 'tile', label: 'Tile' },
];

/** An image paint: a preview of how the image sits in its shape, the fit mode, Replace and the file facts. */
export function ImageFill({
  tone, variant, radius, shadow, size, mode, defaultMode = 'fill', src, fileName, fileMeta, disabled = false, onModeChange, onReplace,
  crop, defaultCrop = DEFAULT_CROP, onCropChange, cropLabels, cropPopover, className, ...props
}: ImageFillProps) {
  const [current, setCurrent] = useControllableState<ImageFillMode>({ value: mode, defaultValue: defaultMode, onChange: onModeChange });
  const [cropValue, setCrop] = useControllableState<ImageFillCrop>({ value: crop, defaultValue: defaultCrop, onChange: onCropChange });
  const [open, setOpen] = useControllableState<boolean>({ value: cropPopover?.open, defaultValue: cropPopover?.defaultOpen ?? false, onChange: cropPopover?.onOpenChange });
  const labels = { ...CROP_LABELS, ...cropLabels };
  const vars = { ['--img' as string]: src } as CSSProperties;
  const cropping = current === 'crop';
  return (
    <div data-slot="image-fill" data-mode={current} className={cn(imageFillVariants(), className)} {...props}>
      <div data-slot="image-fill-stage-box" className={imageFillStageBoxVariants()}>
        <div data-slot="image-fill-stage" aria-hidden data-mode={current} className={cn(imageFillStageVariants({ tone, variant, size }), imageFillFrameVariants({ radius, shadow }))}>
          <span data-slot="image-fill-image" className={imageFillImageVariants({ mode: current })} style={vars} />
          <span data-slot="image-fill-crop-frame" className={imageFillCropFrameVariants({ mode: current })} />
        </div>
        {cropping && (
          <Popover
            open={open && !disabled} onOpenChange={setOpen} inline={cropPopover?.inline ?? false} side="left" align="start" size="lg" arrow={false}
            data-slot="image-fill-crop-popover"
            anchor={(
              <Button data-slot="image-fill-crop-edit" tone="neutral" variant="outline" size="xs" disabled={disabled} iconStart={<Crop aria-hidden />} className={imageFillCropEditVariants()}
                // Inline has no Radix trigger, so the button toggles it itself.
                onClick={cropPopover?.inline ? () => setOpen(!open) : undefined}
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
          data-slot="image-fill-mode" size={size === 'lg' ? 'sm' : 'xs'} aria-label="Image fill mode" value={current} disabled={disabled}
          onValueChange={v => setCurrent(v as ImageFillMode)}
        >
          {MODES.map(m => <SegmentedControlItem key={m.value} value={m.value}>{m.label}</SegmentedControlItem>)}
        </SegmentedControl>
        <Button data-slot="image-fill-replace" tone="secondary" size={size === 'lg' ? 'sm' : 'xs'} disabled={disabled} iconStart={<Upload aria-hidden />} onClick={() => onReplace?.()}>Replace</Button>
      </div>
      <div data-slot="image-fill-file" className={imageFillFileVariants()}>
        <span data-slot="image-fill-file-name" className="min-w-0 truncate font-mono text-mono text-text-tertiary">{fileName}</span>
        <span data-slot="image-fill-file-meta" className="flex-none whitespace-nowrap text-ui-sm font-normal text-text-tertiary">{fileMeta}</span>
      </div>
    </div>
  );
}

interface CropEditorProps { value: ImageFillCrop; onChange: (crop: ImageFillCrop) => void; src: string | undefined; labels: ImageFillCropLabels }

/** The 4:3 crop canvas (the image at its zoom, the frame dimming the rest) and the zoom slider. */
function CropEditor({ value, onChange, src, labels }: CropEditorProps) {
  const canvas = useRef<HTMLDivElement>(null);
  const drag = useRef<{ handle: Handle | 'move'; px: number; py: number; start: ImageFillCrop } | null>(null);
  const latest = useRef(value); latest.current = value;
  const set = (next: ImageFillCrop) => { latest.current = next; onChange(next); };
  const down = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const handle = (e.currentTarget.dataset.handle as Handle | undefined) ?? 'move';
    drag.current = { handle, px: e.clientX, py: e.clientY, start: latest.current };
    canvas.current?.querySelector<HTMLElement>('[role="slider"]')?.focus({ preventScroll: true });
  };
  const move = (e: PointerEvent<HTMLSpanElement>) => {
    const d = drag.current;
    const box = canvas.current?.getBoundingClientRect();
    if (!d || !box || box.width === 0 || box.height === 0) return;
    const dx = (e.clientX - d.px) / box.width;
    const dy = (e.clientY - d.py) / box.height;
    const s = d.start;
    if (d.handle === 'move') { set({ ...s, x: r3(clamp(s.x + dx, 0, 1 - s.w)), y: r3(clamp(s.y + dy, 0, 1 - s.h)) }); return; }
    let { x, y, w, h } = s;
    if (d.handle.includes('w')) { const nx = clamp(s.x + dx, 0, s.x + s.w - MIN); w = s.x + s.w - nx; x = nx; }
    else w = clamp(s.w + dx, MIN, 1 - s.x);
    if (d.handle.includes('n')) { const ny = clamp(s.y + dy, 0, s.y + s.h - MIN); h = s.y + s.h - ny; y = ny; }
    else h = clamp(s.h + dy, MIN, 1 - s.y);
    set({ ...s, x: r3(x), y: r3(y), w: r3(w), h: r3(h) });
  };
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
    const s = latest.current;
    set(e.altKey
      ? { ...s, w: r3(clamp(s.w + dx, MIN, 1 - s.x)), h: r3(clamp(s.h + dy, MIN, 1 - s.y)) }
      : { ...s, x: r3(clamp(s.x + dx, 0, 1 - s.w)), y: r3(clamp(s.y + dy, 0, 1 - s.h)) });
  };
  const pct = (v: number) => Math.round(v * 100);
  const vars = {
    '--img': src,
    '--zoom': String(value.zoom),
    '--crop-l': `${value.x * 100}%`,
    '--crop-t': `${value.y * 100}%`,
    '--crop-r': `${(1 - value.x - value.w) * 100}%`,
    '--crop-b': `${(1 - value.y - value.h) * 100}%`,
  } as CSSProperties;
  return (
    <>
      <div ref={canvas} data-slot="image-fill-crop-canvas" className={imageFillCropCanvasVariants()} style={vars}>
        <span data-slot="image-fill-crop-image" aria-hidden className={imageFillCropImageVariants()} />
        <span
          data-slot="image-fill-crop-rect" role="slider" tabIndex={0} aria-label={labels.frame}
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct(value.x)} aria-valuetext={labels.frameValueText(pct(value.x), pct(value.y), pct(value.w), pct(value.h))}
          className={imageFillCropRectVariants()} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={keyDown}
        >
          {HANDLES.map(h => (
            <span key={h} data-slot="image-fill-crop-handle" data-handle={h} aria-hidden className={imageFillCropHandleVariants({ handle: h })} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
          ))}
        </span>
      </div>
      <Slider
        data-slot="image-fill-crop-zoom" label={labels.zoom} field unit="%" min={100} max={400} step={1}
        value={Math.round(value.zoom * 100)} onValueChange={v => set({ ...latest.current, zoom: v / 100 })}
      />
    </>
  );
}
