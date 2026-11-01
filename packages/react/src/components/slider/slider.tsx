'use client';
import * as S from '@radix-ui/react-slider';
import { ChevronDown } from '../../icons/index.ts';
import { useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import type { CommonProps, Variant } from '../../lib/common-props.ts';
import { NumberField, type NumberFieldDraft, type NumberFieldProps } from '../number-field/number-field.tsx';
import {
  sliderBarsVariants, sliderBarVariants, sliderChevronVariants, sliderControlVariants, sliderDotsVariants, sliderEndsVariants, sliderFieldVariants,
  sliderGlyphVariants, sliderHeaderLabelVariants, sliderKnob, sliderLabelVariants, sliderLevelsRange, sliderLevelsVariants, sliderMarkVariants,
  sliderRange, sliderRowVariants, sliderStepVariants, sliderTextVariants, sliderThumb, sliderToneVars, sliderTrack, sliderValueVariants, sliderVariants,
} from './slider.variants.ts';

type Track = 'gradient' | 'alpha' | 'ruler';
type Form = 'dots' | 'bars';
/** The emphasis variants, the slider's own tracks and the two compact discrete forms. */
export type SliderVariant = Variant | Track | Form;

/** NumberField props the row passes through to its field; the value, bounds and value model come from the Slider. */
export type SliderFieldOptions = Omit<NumberFieldProps,
  'value' | 'defaultValue' | 'onValueChange' | 'min' | 'max' | 'step' | 'unit' | 'mixed' | 'mixedLabel' | 'reserved' | 'locked' | 'commitMode' | 'onDraftChange' | 'onPreviewChange' | 'disabled'>;

export interface SliderProps extends Omit<ComponentProps<typeof S.Root>, 'value' | 'defaultValue' | 'onValueChange' | 'onValueCommit' | 'asChild' | 'orientation' | 'inverted' | 'minStepsBetweenThumbs' | 'onClick'>, Omit<CommonProps, 'variant'> {
  /** Track: solid (default), soft, outline, ghost, the own tracks gradient, alpha and ruler, or the discrete forms dots and bars. */
  variant?: SliderVariant;
  /** @deprecated use variant (default = solid; the other names are the same). */
  appearance?: 'default' | Track | Form;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** CSS gradient painted on the track for the gradient and alpha appearances. */
  gradient?: string | undefined;
  /** CSS color shown inside the thumb for gradient and alpha: the color at the current value. */
  thumbColor?: string | undefined;
  disabled?: boolean;
  /** Row label in the left column (with levels: the caption in the header). A string label also names the slider and the field. */
  label?: ReactNode;
  /** Adds a NumberField after the slider, synced to the value; an object passes NumberField props through. */
  field?: boolean | SliderFieldOptions | undefined;
  /** Unit suffix in the field (%, °, px). */
  unit?: ReactNode;
  /** The field shows value / fieldScale (100 shows 17 as 0.17). */
  fieldScale?: number | undefined;
  /** A write is in flight or another window holds the value: the slider is inert and the field reserved. */
  reserved?: boolean | undefined;
  /** The selection has several values: the thumb rests at min with aria-valuetext mixedLabel and the field is mixed. */
  mixed?: boolean | undefined;
  /** Placeholder and aria-valuetext while mixed. Required whenever mixed can be true; no built-in default. */
  mixedLabel?: string | undefined;
  /** live (default): every move is a commit. release: a drag previews and commits once on release. */
  commitMode?: 'live' | 'release' | undefined;
  /** The field text changed; value is in slider units. */
  onDraftChange?: ((draft: NumberFieldDraft) => void) | undefined;
  /** release mode: the slider is being dragged (slider units); null when it ends. */
  onPreviewChange?: ((value: number | null) => void) | undefined;
  /** Discrete levels: the value is the level index; the track draws one mark per level and the header names the current one. */
  levels?: string[] | undefined;
  /** Captions under the ends of the levels track. */
  endLabels?: [ReactNode, ReactNode] | undefined;
  /** Bars: the button is activated; the caller opens its menu. */
  onClick?: ((e: MouseEvent<HTMLElement>) => void) | undefined;
}

const round = (v: number) => Math.round(v * 1e6) / 1e6;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const FILL: readonly SliderVariant[] = ['solid', 'soft', 'outline', 'ghost'];

/**
 * Single-thumb horizontal slider: solid fill, color gradient, alpha over a checkerboard, or a ruler. With label and field
 * it is the inspector row (label, slider, synced NumberField). With levels it chooses one of a few named levels on a
 * marked track; dots and bars are the compact discrete forms.
 */
export function Slider({
  value, defaultValue, onValueChange, onValueCommit, min = 0, max = 100, step = 1, variant: variantProp, appearance, tone, radius, shadow, size,
  gradient, thumbColor, disabled = false, label, field, unit, fieldScale = 1, reserved = false, mixed = false, mixedLabel, commitMode = 'live',
  onDraftChange, onPreviewChange, levels, endLabels, onClick, className, style, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...props
}: SliderProps) {
  const [current, setCurrent] = useControllableState<number>({ value, defaultValue: defaultValue ?? (levels ? 0 : min), onChange: onValueChange });
  const [preview, setPreview] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const variant: SliderVariant = variantProp ?? (appearance === undefined || appearance === 'default' ? 'solid' : appearance);
  const fill = FILL.includes(variant);
  const vars = { ...style, ...(gradient ? { '--track': gradient } : {}), ...(thumbColor ? { '--swatch': thumbColor } : {}) } as CSSProperties;
  const name = ariaLabel ?? (typeof label === 'string' ? label : undefined);
  const inert = disabled || reserved;

  // ── Discrete: levels track, dots, bars ──────────────────────────────────────────────────────────────────────────
  if (levels !== undefined || variant === 'dots' || variant === 'bars') {
    const n = Math.max(1, levels?.length ?? Math.floor((max - min) / step) + 1);
    const toValue = (i: number) => (levels ? i : round(min + i * step));
    const cur = clamp(Math.round(levels ? current : (current - min) / step), 0, n - 1);
    const levelName = (i: number) => levels?.[i] ?? String(toValue(i));
    const choose = (i: number) => { if (inert) return; const v = toValue(clamp(i, 0, n - 1)); setCurrent(v); onValueCommit?.(v); };
    const toneVars = sliderToneVars({ tone });

    if (variant === 'bars') {
      const lit = Math.ceil(((cur + 1) * 3) / n);
      return (
        <button
          type="button" data-slot="slider" data-variant="bars" aria-haspopup="menu" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} disabled={disabled}
          className={cn(toneVars, sliderBarsVariants({ radius, shadow }), className)} onClick={onClick} style={style}
          {...(props as ComponentProps<'button'>)}
        >
          <span data-slot="slider-glyph" aria-hidden className={sliderGlyphVariants()}>
            {([0, 1, 2] as const).map(j => <i key={j} data-slot="slider-bar" data-state={j < lit ? 'on' : 'off'} className={sliderBarVariants({ level: j })} />)}
          </span>
          <span data-slot="slider-text" className={sliderTextVariants()}>{levelName(cur)}</span>
          <ChevronDown data-slot="slider-chevron" aria-hidden className={sliderChevronVariants()} />
        </button>
      );
    }

    if (variant === 'dots') {
      const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
        const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        const next = clamp(cur + d, 0, n - 1);
        choose(next);
        e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
      };
      return (
        <div
          role="radiogroup" data-slot="slider" data-variant="dots" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-disabled={disabled || undefined}
          className={cn(toneVars, sliderDotsVariants(), className)} style={style} onKeyDown={onKey} onClick={onClick}
          {...(props as ComponentProps<'div'>)}
        >
          {Array.from({ length: n }, (_, j) => (
            <button
              key={j} type="button" role="radio" data-slot="slider-step" aria-label={levelName(j)} aria-checked={j === cur} disabled={disabled}
              data-state={j === cur ? 'checked' : 'unchecked'} tabIndex={j === cur ? 0 : -1}
              className={sliderStepVariants({ size })} onClick={() => choose(j)}
            />
          ))}
        </div>
      );
    }

    // Levels track. Custom pointer logic rather than Radix: Radix keeps its thumb inside the track, so the current mark
    // could not sit on the first and last marks.
    const bar: SliderVariant = fill ? variant : 'solid';
    const fromPointer = (e: PointerEvent<HTMLDivElement>) => {
      const r = stripRef.current!.getBoundingClientRect();
      choose(Math.round(clamp((e.clientX - r.left) / r.width, 0, 1) * (n - 1)));
    };
    const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
      const next = { ArrowRight: cur + 1, ArrowUp: cur + 1, PageUp: cur + 1, ArrowLeft: cur - 1, ArrowDown: cur - 1, PageDown: cur - 1, Home: 0, End: n - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault(); choose(next);
    };
    const amount = cur <= 0 ? 0 : (cur / Math.max(1, n - 1)) * 100;
    const off = disabled ? '' : undefined;
    return (
      <div data-slot="slider" data-variant={bar} data-levels="" className={cn(toneVars, sliderLevelsVariants(), className)} style={style} onClick={onClick} {...(props as ComponentProps<'div'>)}>
        <div data-slot="slider-header" className="flex items-center justify-between">
          {label != null && <span data-slot="slider-label" className={sliderHeaderLabelVariants()}>{label}</span>}
          <b data-slot="slider-value" className={sliderValueVariants()}>{levelName(cur)}</b>
        </div>
        <div
          ref={stripRef} role="slider" data-slot="slider-control" tabIndex={disabled ? undefined : 0}
          aria-label={name} aria-labelledby={ariaLabelledBy} aria-valuemin={0} aria-valuemax={n - 1} aria-valuenow={cur} aria-valuetext={levelName(cur)}
          aria-disabled={disabled || undefined} aria-busy={reserved || undefined}
          className={sliderControlVariants({ size })}
          onKeyDown={onKey}
          onPointerDown={e => { if (inert) return; e.currentTarget.setPointerCapture(e.pointerId); fromPointer(e); }}
          onPointerMove={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e); }}
        >
          <div data-slot="slider-track" data-disabled={off} className={sliderTrack({ variant: bar, tone, size, radius: radius ?? null, shadow: shadow ?? null })}>
            <i data-slot="slider-range" data-disabled={off} className={cn(sliderRange({ tone }), sliderLevelsRange())} style={{ '--fill': `${amount}%` } as CSSProperties} />
          </div>
          <div data-slot="slider-marks" className="pointer-events-none absolute inset-0 flex items-center justify-between">
            {Array.from({ length: n }, (_, j) => (
              <span key={j} data-slot="slider-mark" data-state={j === cur ? 'current' : j < cur ? 'on' : 'off'} className={sliderMarkVariants()} />
            ))}
          </div>
        </div>
        {endLabels && (
          <div data-slot="slider-ends" className={sliderEndsVariants()}>
            <span data-slot="slider-end">{endLabels[0]}</span><span data-slot="slider-end">{endLabels[1]}</span>
          </div>
        )}
      </div>
    );
  }

  // ── Continuous: the bare slider, or the row with label and field ─────────────────────────────────────────────────
  const release = commitMode === 'release';
  const row = label != null || !!field;
  const control = (
    <S.Root
      data-slot={row ? 'slider-control' : 'slider'} data-appearance={fill ? 'default' : variant} data-variant={variant} data-size={size ?? 'md'}
      data-mixed={mixed || undefined} data-reserved={reserved || undefined} aria-disabled={reserved || undefined}
      value={[mixed ? min : preview ?? current]} min={min} max={max} step={step} disabled={disabled}
      onValueChange={([v = min]) => { if (inert) return; if (release) { setPreview(v); onPreviewChange?.(v); } else setCurrent(v); }}
      onValueCommit={([v = min]) => {
        if (inert) return;
        if (release) { setPreview(null); setCurrent(v); onPreviewChange?.(null); }
        onValueCommit?.(v);
      }}
      className={cn(sliderVariants({ variant, size }), !row && className)} style={row ? undefined : vars}
      {...(row ? {} : { ...props, onClick })}
    >
      <S.Track data-slot="slider-track" className={cn(sliderTrack({ variant, tone, size, radius: radius ?? null, shadow: shadow ?? null }))}>
        {fill && <S.Range data-slot="slider-range" className={sliderRange({ tone })} />}
      </S.Track>
      <S.Thumb
        data-slot="slider-thumb" aria-label={name} aria-labelledby={ariaLabelledBy} aria-valuetext={mixed && mixedLabel ? mixedLabel : undefined}
        className={cn(sliderThumb({ variant, tone, size }))}
      >
        {variant === 'ruler' && <span data-slot="slider-knob" aria-hidden className={sliderKnob({ tone })} />}
      </S.Thumb>
    </S.Root>
  );
  if (!row) return control;

  const fieldProps = typeof field === 'object' ? field : {};
  return (
    <div
      data-slot="slider" data-variant={variant} data-size={size ?? 'md'} aria-busy={reserved || undefined}
      className={cn(sliderRowVariants({ size }), className)} style={vars} onClick={onClick} {...(props as ComponentProps<'div'>)}
    >
      {label != null && <span data-slot="slider-label" className={sliderLabelVariants({ size })}>{label}</span>}
      {control}
      {field && (
        <div data-slot="slider-field" className={sliderFieldVariants()}>
          <NumberField
            aria-label={name} {...fieldProps} unit={unit} disabled={disabled} reserved={reserved} locked={false} mixed={mixed} mixedLabel={mixedLabel} commitMode={commitMode}
            value={round(current / fieldScale)} onValueChange={v => setCurrent(clamp(round(v * fieldScale), min, max))}
            onDraftChange={d => onDraftChange?.({ ...d, value: d.value === null ? null : round(d.value * fieldScale) })}
            min={min / fieldScale} max={max / fieldScale} step={step / fieldScale}
          />
        </div>
      )}
    </div>
  );
}
