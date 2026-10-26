'use client';
import * as S from '@radix-ui/react-slider';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { sliderThumb, sliderTrack, sliderVariants, type SliderVariantProps } from './slider.variants.ts';

export interface SliderProps extends Omit<ComponentProps<typeof S.Root>, 'value' | 'defaultValue' | 'onValueChange' | 'onValueCommit' | 'asChild' | 'orientation' | 'inverted' | 'minStepsBetweenThumbs'>, SliderVariantProps {
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
}

/** Single-thumb horizontal slider: solid fill, color gradient, alpha over a checkerboard, or a ruler. */
export function Slider({ value, defaultValue = 0, onValueChange, onValueCommit, min = 0, max = 100, step = 1, appearance, size, gradient, thumbColor, disabled = false, className, style, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...props }: SliderProps) {
  const [current, setCurrent] = useControllableState<number>({ value, defaultValue, onChange: onValueChange });
  const kind = appearance ?? 'default';
  const vars = { ...style, ...(gradient ? { '--track': gradient } : {}), ...(thumbColor ? { '--swatch': thumbColor } : {}) } as CSSProperties;
  return (
    <S.Root
      data-slot="slider" data-appearance={kind} data-size={size ?? 'md'}
      value={[current]} onValueChange={v => setCurrent(v[0] ?? min)} onValueCommit={v => onValueCommit?.(v[0] ?? min)}
      min={min} max={max} step={step} disabled={disabled}
      className={cn(sliderVariants({ appearance, size }), className)} style={vars}
      {...props}
    >
      <S.Track data-slot="slider-track" className={cn(sliderTrack({ appearance, size }))}>
        {kind === 'default' && <S.Range data-slot="slider-range" className="absolute inset-y-0 bg-accent-solid data-[disabled]:bg-disabled-text" />}
      </S.Track>
      <S.Thumb data-slot="slider-thumb" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} className={cn(sliderThumb({ appearance, size }))}>
        {kind === 'ruler' && <span data-slot="slider-knob" aria-hidden className="absolute -top-0.75 left-1/2 size-2 -translate-x-1/2 rounded-full bg-accent-solid shadow-[0_0_0_2px_var(--cs-color-surface-base)] group-data-[disabled]:bg-disabled-text" />}
      </S.Thumb>
    </S.Root>
  );
}
