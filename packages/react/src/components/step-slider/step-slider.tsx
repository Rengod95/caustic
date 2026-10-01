'use client';
import { ChevronDown } from 'lucide-react';
import { useRef, type ComponentProps, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { stepSliderVariants, stepVariants, type StepSliderVariantProps } from './step-slider.variants.ts';

export interface StepSliderProps extends Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue' | 'onClick'>, StepSliderVariantProps {
  /** Index of the current level (controlled). */
  value?: number;
  /** Initial level index (uncontrolled). Omit for no level chosen yet. */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Level names; also give the level count for track and bars. */
  labels?: string[];
  /** Level count when labels are not given (segmented, dots). */
  steps?: number;
  /** Track caption in the header. */
  label?: ReactNode;
  /** Captions under the track ends. */
  endLabels?: [ReactNode, ReactNode];
  disabled?: boolean;
  /** Bars only: the button is activated; the caller opens its menu. */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Discrete level chooser in four forms: labelled track, segmented bar, dots and a compact bars button. */
export function StepSlider({ value, defaultValue = -1, onValueChange, appearance, labels, steps, label, endLabels, disabled = false, onClick, className, style, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...props }: StepSliderProps) {
  const kind = appearance ?? 'track';
  const n = Math.max(1, labels?.length ?? steps ?? 4);
  const [raw, setRaw] = useControllableState<number>({ value, defaultValue, onChange: onValueChange });
  const cur = clamp(raw, -1, n - 1);
  const choose = (i: number) => { if (!disabled) setRaw(clamp(i, 0, n - 1)); };
  const name = (i: number) => labels?.[i] ?? String(i + 1);
  const trackRef = useRef<HTMLDivElement>(null);
  const root = cn(stepSliderVariants({ appearance }), className);
  const accessibleName = ariaLabel ?? (typeof label === 'string' ? label : undefined);

  if (kind === 'bars') {
    const filled = Math.ceil(((cur + 1) * 3) / n);
    return (
      <button
        type="button" data-slot="step-slider" data-appearance="bars" aria-haspopup="menu" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} disabled={disabled}
        className={root} onClick={onClick} style={style}
        {...(props as ComponentProps<'button'>)}
      >
        <span data-slot="step-slider-glyph" aria-hidden className="inline-flex h-3 items-end gap-0.5">
          {[0, 1, 2].map(j => (
            <i key={j} data-slot="step-slider-bar" data-state={j < filled ? 'on' : 'off'}
              className={cn('block w-0.75 rounded-xs bg-fill-selected data-[state=on]:bg-text-primary', j === 0 ? 'h-1.25' : j === 1 ? 'h-2' : 'h-3')} />
          ))}
        </span>
        <span data-slot="step-slider-text">{cur >= 0 ? name(cur) : ''}</span>
        <ChevronDown data-slot="step-slider-chevron" aria-hidden className="size-icon-sm" />
      </button>
    );
  }

  if (kind === 'segmented' || kind === 'dots') {
    const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
      const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const next = clamp((cur < 0 ? (d > 0 ? -1 : n) : cur) + d, 0, n - 1);
      choose(next);
      e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
    };
    return (
      <div
        role="radiogroup" data-slot="step-slider" data-appearance={kind} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-disabled={disabled || undefined}
        className={root} style={{ ...style, '--n': n } as CSSProperties} onKeyDown={onKey}
        {...props}
      >
        {Array.from({ length: n }, (_, j) => (
          <button
            key={j} type="button" role="radio" data-slot="step-slider-step" aria-label={name(j)} aria-checked={j === cur} disabled={disabled}
            data-state={j === cur ? 'checked' : 'unchecked'} data-filled={kind === 'segmented' && j <= cur ? '' : undefined}
            tabIndex={j === cur || (cur < 0 && j === 0) ? 0 : -1}
            className={stepVariants({ appearance })} onClick={() => choose(j)}
          />
        ))}
      </div>
    );
  }

  const fromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const r = trackRef.current!.getBoundingClientRect();
    choose(Math.round(clamp((e.clientX - r.left) / r.width, 0, 1) * (n - 1)));
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const next = { ArrowRight: cur + 1, ArrowUp: cur + 1, PageUp: cur + 1, ArrowLeft: cur - 1, ArrowDown: cur - 1, PageDown: cur - 1, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault(); choose(next);
  };
  const fill = cur <= 0 ? 0 : (cur / Math.max(1, n - 1)) * 100;
  return (
    <div data-slot="step-slider" data-appearance="track" className={root} style={style} {...props}>
      <div data-slot="step-slider-header" className="flex items-center justify-between">
        {label != null && <span data-slot="step-slider-label" className="text-ui-sm font-normal text-text-tertiary">{label}</span>}
        <b data-slot="step-slider-value" className="ml-auto text-ui-sm font-semibold text-text-primary">{cur >= 0 ? name(cur) : ''}</b>
      </div>
      <div
        ref={trackRef} role="slider" data-slot="step-slider-track" tabIndex={disabled ? undefined : 0}
        aria-label={accessibleName} aria-labelledby={ariaLabelledBy} aria-valuemin={0} aria-valuemax={n - 1} aria-valuenow={Math.max(cur, 0)} aria-valuetext={cur >= 0 ? name(cur) : undefined} aria-disabled={disabled || undefined}
        className="relative grid h-5 cursor-pointer touch-none items-center rounded-xs outline-none focus-visible:shadow-focus aria-disabled:cursor-not-allowed"
        onKeyDown={onKey}
        onPointerDown={e => { if (disabled) return; e.currentTarget.setPointerCapture(e.pointerId); fromPointer(e); }}
        onPointerMove={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e); }}
      >
        <div data-slot="step-slider-rail" className="relative h-1 rounded-xs bg-fill-selected">
          <i data-slot="step-slider-fill" className="absolute inset-y-0 left-0 w-(--fill) rounded-[inherit] bg-text-primary transition-[width] duration-320 ease-spring" style={{ '--fill': `${fill}%` } as CSSProperties} />
        </div>
        <div data-slot="step-slider-marks" className="pointer-events-none absolute inset-0 flex items-center justify-between">
          {Array.from({ length: n }, (_, j) => (
            <span
              key={j} data-slot="step-slider-mark" data-state={j === cur ? 'current' : j < cur ? 'on' : 'off'}
              className={cn(
                'size-2 rounded-full bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-border-control)]',
                'data-[state=on]:bg-text-primary data-[state=on]:shadow-none data-[state=current]:size-4 data-[state=current]:bg-control-thumb data-[state=current]:shadow-thumb-sm',
              )}
            />
          ))}
        </div>
      </div>
      {endLabels && (
        <div data-slot="step-slider-ends" className="flex justify-between text-ui-xs text-text-tertiary">
          <span data-slot="step-slider-end">{endLabels[0]}</span><span data-slot="step-slider-end">{endLabels[1]}</span>
        </div>
      )}
    </div>
  );
}
