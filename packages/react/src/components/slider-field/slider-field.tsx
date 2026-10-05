'use client';
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { NumberField, type NumberFieldDraft } from '../number-field/number-field.tsx';
import { Slider, type SliderProps } from '../slider/slider.tsx';

export interface SliderFieldProps extends Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue'>, Pick<SliderProps, 'appearance' | 'size' | 'gradient' | 'thumbColor'> {
  /** Row label; also names the slider and the field unless aria-label is given (for abbreviations). */
  label?: ReactNode;
  value?: number | undefined;
  defaultValue?: number | undefined;
  /** The commit. */
  onValueChange?: ((value: number) => void) | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  /** Unit suffix in the field (%, °, px). */
  unit?: ReactNode;
  /** The field shows value / fieldScale (100 shows 17 as 0.17). */
  fieldScale?: number | undefined;
  disabled?: boolean | undefined;
  /** Accessible name of the slider and the field when label is not a string. */
  ariaLabel?: string | undefined;
  /** A write is in flight or another window holds the field. */
  reserved?: boolean | undefined;
  /** The selection has several values: the slider rests at min with aria-valuetext mixedLabel and the field is mixed. */
  mixed?: boolean | undefined;
  /** Placeholder and aria-valuetext while mixed. Required whenever mixed can be true; no built-in default. */
  mixedLabel?: string | undefined;
  /** live (default): every slider move is a commit. release: a drag previews and commits once on release. */
  commitMode?: 'live' | 'release' | undefined;
  /** The field text changed; value is in slider units. */
  onDraftChange?: ((draft: NumberFieldDraft) => void) | undefined;
  /** release mode: the slider is being dragged (slider units); null when it ends. */
  onPreviewChange?: ((value: number | null) => void) | undefined;
}

const round = (v: number) => Math.round(v * 1e6) / 1e6;

/** Inspector row: label, slider and a precise number field kept in sync. */
export function SliderField({ label, value, defaultValue = 0, onValueChange, min = 0, max = 100, step = 1, unit, fieldScale = 1, appearance, size, gradient, thumbColor, disabled = false, reserved = false, mixed = false, mixedLabel, commitMode = 'live', onDraftChange, onPreviewChange, className, ariaLabel: ariaLabelProp, 'aria-label': ariaLabel, ...props }: SliderFieldProps) {
  const [current, setCurrent] = useControllableState<number>({ value, defaultValue, onChange: onValueChange });
  const release = commitMode === 'release';
  const [preview, setPreview] = useState<number | null>(null);
  const sliderBox = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const thumb = sliderBox.current?.querySelector('[role="slider"]');
    if (!thumb) return;
    if (mixed && mixedLabel) thumb.setAttribute('aria-valuetext', mixedLabel); else thumb.removeAttribute('aria-valuetext');
  }, [mixed, mixedLabel]);
  const inert = disabled || reserved;
  const name = ariaLabelProp ?? ariaLabel ?? (typeof label === 'string' ? label : undefined);
  return (
    <div data-slot="slider-field" className={cn('flex items-center gap-2.5', className)} {...props}>
      {label != null && <span data-slot="slider-field-label" className="w-slider-label-w shrink-0 text-hint text-text-secondary">{label}</span>}
      <div ref={sliderBox} data-slot="slider-field-slider" data-mixed={mixed || undefined} aria-busy={reserved || undefined} className="flex min-w-0 flex-1">
        <Slider
          aria-label={name} value={mixed ? min : preview ?? current} min={min} max={max} step={step} appearance={appearance} size={size} gradient={gradient} thumbColor={thumbColor} disabled={disabled}
          aria-disabled={reserved || undefined} data-reserved={reserved || undefined}
          onValueChange={v => { if (inert) return; if (release) { setPreview(v); onPreviewChange?.(v); } else setCurrent(v); }}
          onValueCommit={v => { if (inert || !release) return; setPreview(null); setCurrent(v); onPreviewChange?.(null); }}
        />
      </div>
      <div data-slot="slider-field-field" className="w-18 shrink-0">
        <NumberField
          aria-label={name} unit={unit} disabled={disabled} reserved={reserved} locked={false} mixed={mixed} mixedLabel={mixedLabel} commitMode={commitMode}
          value={round(current / fieldScale)} onValueChange={v => setCurrent(Math.min(max, Math.max(min, round(v * fieldScale))))}
          onDraftChange={d => onDraftChange?.({ ...d, value: d.value === null ? null : round(d.value * fieldScale) })}
          min={min / fieldScale} max={max / fieldScale} step={step / fieldScale}
        />
      </div>
    </div>
  );
}
