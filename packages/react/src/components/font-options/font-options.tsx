'use client';
import { Check, Plus } from '../../icons/index.ts';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Chip } from '../chip/chip.tsx';
import { NumberField } from '../number-field/number-field.tsx';
import { Slider } from '../slider/slider.tsx';
import {
  fontOptionsAxesVariants, fontOptionsAxisTagVariants, fontOptionsAxisVariants, fontOptionsFeatureCheckVariants, fontOptionsFeatureCodeVariants, fontOptionsFeatureVariants,
  fontOptionsFeaturesVariants, fontOptionsSampleVariants, fontOptionsStageVariants, fontOptionsVariants,
} from './font-options.variants.ts';

export interface FontAxis { tag: string; label: string; min: number; max: number }
export interface FontFeature { tag: string; label: string }
export interface FontOptionsValue { axes: Record<string, number>; features: string[] }

export interface FontOptionsProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Sample text. */
  sample?: ReactNode;
  /** font-family of the sample (data), e.g. "Newsreader, serif". */
  cssFamily?: string;
  axes: FontAxis[];
  features: FontFeature[];
  value?: FontOptionsValue;
  defaultValue?: FontOptionsValue;
  /** Shorthand for the initial enabled feature tags. */
  defaultFeatures?: string[];
  disabled?: boolean;
  onValueChange?: (value: FontOptionsValue) => void;
  onAddFeature?: () => void;
  /** Colour family of the sample stage. */
  tone?: Tone | undefined;
  /** Emphasis of the sample stage; soft (default) is the bg.inset well. */
  variant?: Variant | undefined;
  /** Corner radius of the root; unset = none. */
  radius?: Radius | undefined;
  /** Elevation of the root; unset = none. */
  shadow?: Shadow | undefined;
  /** Stack gap step (xs 8, sm 12, md 14, lg 16); the rows and toggles keep their size. */
  size?: Size | undefined;
}

const DEFAULT_VALUE: FontOptionsValue = { axes: { wght: 600, opsz: 36 }, features: [] };

/** Variable axes and OpenType features of a font, with a live sample set in the current face. */
export function FontOptions({
  sample = 'Quiet glass, 0.5 fl oz', cssFamily, axes, features, value, defaultValue, defaultFeatures, disabled = false, onValueChange, onAddFeature,
  tone, variant, radius, shadow, size, className, ...props
}: FontOptionsProps) {
  const initial: FontOptionsValue = { ...(defaultValue ?? DEFAULT_VALUE), ...(defaultFeatures ? { features: defaultFeatures } : {}) };
  const [current, setCurrent] = useControllableState<FontOptionsValue>({ value, defaultValue: initial, onChange: onValueChange });
  const axisValue = (a: FontAxis) => current.axes[a.tag] ?? a.min;
  const setAxis = (tag: string, v: number) => setCurrent({ ...current, axes: { ...current.axes, [tag]: v } });
  const toggle = (tag: string) => setCurrent({ ...current, features: current.features.includes(tag) ? current.features.filter(t => t !== tag) : [...current.features, tag] });

  const vars = {
    ['--face' as string]: cssFamily ?? 'inherit',
    ['--fvs' as string]: axes.map(a => `"${a.tag}" ${axisValue(a)}`).join(', ') || 'normal',
    ['--ffs' as string]: current.features.map(t => `"${t}" 1`).join(', ') || 'normal',
  } as CSSProperties;

  return (
    <div data-slot="font-options" className={cn(fontOptionsVariants({ radius, shadow, size }), className)} {...props}>
      <div data-slot="font-options-stage" className={cn(fontOptionsStageVariants({ tone, variant }))}>
        <div data-slot="font-options-sample" aria-hidden className={fontOptionsSampleVariants()} style={vars}>{sample}</div>
      </div>
      <div data-slot="font-options-axes" className={fontOptionsAxesVariants()}>
        {axes.map(a => (
          <div key={a.tag} data-slot="font-options-axis" className={fontOptionsAxisVariants()}>
            <span data-slot="font-options-axis-tag" className={fontOptionsAxisTagVariants()}>{a.tag}</span>
            <Slider
              data-slot="font-options-axis-slider" appearance="ruler" aria-label={`${a.label} axis`}
              min={a.min} max={a.max} step={1} value={axisValue(a)} disabled={disabled} onValueChange={v => setAxis(a.tag, v)}
            />
            <span data-slot="font-options-axis-field" className="flex w-axis-field-w">
              <NumberField aria-label={`${a.label} axis`} min={a.min} max={a.max} step={1} value={axisValue(a)} disabled={disabled} containerClassName="w-full" onValueChange={v => setAxis(a.tag, v)} />
            </span>
          </div>
        ))}
      </div>
      <div data-slot="font-options-features" className={fontOptionsFeaturesVariants()}>
        {features.map(f => (
          <button
            key={f.tag} type="button" data-slot="font-options-feature" aria-pressed={current.features.includes(f.tag)} disabled={disabled}
            className={fontOptionsFeatureVariants()} onClick={() => toggle(f.tag)}
          >
            {current.features.includes(f.tag) && <Check aria-hidden data-slot="font-options-feature-check" className={fontOptionsFeatureCheckVariants()} />}
            {f.label}
            <span data-slot="font-options-feature-code" className={fontOptionsFeatureCodeVariants()}>{f.tag}</span>
          </button>
        ))}
        <Chip data-slot="font-options-add" shape="rounded" appearance="dashed" icon={<Plus />} disabled={disabled} onClick={() => onAddFeature?.()}>Tag</Chip>
      </div>
    </div>
  );
}
