'use client';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { NumberField } from '../number-field/number-field.tsx';
import { Slider, type SliderProps } from '../slider/slider.tsx';

export interface SliderFieldProps extends Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue'>, Pick<SliderProps, 'appearance' | 'size' | 'gradient' | 'thumbColor'> {
  /** Row label; also names the slider and the field unless aria-label is given (for abbreviations). */
  label?: ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Unit suffix in the field (%, °, px). */
  unit?: ReactNode;
  /** The field shows value / fieldScale (100 shows 17 as 0.17). */
  fieldScale?: number;
  disabled?: boolean;
}

const round = (v: number) => Math.round(v * 1e6) / 1e6;

/** Inspector row: label, slider and a precise number field kept in sync. */
export function SliderField({ label, value, defaultValue = 0, onValueChange, min = 0, max = 100, step = 1, unit, fieldScale = 1, appearance, size, gradient, thumbColor, disabled = false, className, 'aria-label': ariaLabel, ...props }: SliderFieldProps) {
  const [current, setCurrent] = useControllableState<number>({ value, defaultValue, onChange: onValueChange });
  const name = ariaLabel ?? (typeof label === 'string' ? label : undefined);
  return (
    <div data-slot="slider-field" className={cn('flex items-center gap-2.5', className)} {...props}>
      {label != null && <span data-slot="slider-field-label" className="w-slider-label-w shrink-0 text-hint text-text-secondary">{label}</span>}
      <div data-slot="slider-field-slider" className="flex min-w-0 flex-1">
        <Slider aria-label={name} value={current} onValueChange={setCurrent} min={min} max={max} step={step} appearance={appearance} size={size} gradient={gradient} thumbColor={thumbColor} disabled={disabled} />
      </div>
      <div data-slot="slider-field-field" className="w-18 shrink-0">
        <NumberField
          aria-label={name} unit={unit} disabled={disabled} locked={false}
          value={round(current / fieldScale)} onValueChange={v => setCurrent(Math.min(max, Math.max(min, round(v * fieldScale))))}
          min={min / fieldScale} max={max / fieldScale} step={step / fieldScale}
        />
      </div>
    </div>
  );
}
