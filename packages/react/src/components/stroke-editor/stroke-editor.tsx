'use client';
import { ArrowRight, CircleDot, Menu, Minus, SlidersHorizontal } from 'lucide-react';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { NumberField } from '../number-field/number-field.tsx';
import { PaintWell } from '../paint-well/paint-well.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { Switch } from '../switch/switch.tsx';
import {
  strokeEditorBoxVariants, strokeEditorDashRowVariants, strokeEditorIndependentVariants, strokeEditorPreviewLineVariants, strokeEditorPreviewVariants,
  strokeEditorSideVariants, strokeEditorSidesVariants, strokeEditorVariants, strokeEditorWeightRowVariants,
} from './stroke-editor.variants.ts';

export type StrokePosition = 'inside' | 'center' | 'outside';
export type StrokeCap = 'butt' | 'round' | 'arrow';
export interface StrokeSides { top: number; right: number; bottom: number; left: number }
export interface StrokeValue {
  color: { hex: string; alpha: number };
  weight: number;
  position: StrokePosition;
  dash: number;
  gap: number;
  cap: StrokeCap;
  independent: boolean;
  sides: StrokeSides;
}

export interface StrokeEditorProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  value?: StrokeValue;
  defaultValue?: StrokeValue;
  disabled?: boolean;
  onValueChange?: (value: StrokeValue) => void;
  onDetailsClick?: () => void;
}

const DEFAULT_STROKE: StrokeValue = {
  color: { hex: '2B1D14', alpha: 100 }, weight: 1.5, position: 'center', dash: 8, gap: 4, cap: 'round', independent: true,
  sides: { top: 2, right: 1, bottom: 4, left: 2 },
};

/** Edits a stroke: paint, weight, position, dash, cap and independent side widths. */
export function StrokeEditor({ value, defaultValue = DEFAULT_STROKE, disabled = false, onValueChange, onDetailsClick, className, ...props }: StrokeEditorProps) {
  const [stroke, setStroke] = useControllableState<StrokeValue>({ value, defaultValue, onChange: onValueChange });
  const patch = (p: Partial<StrokeValue>) => setStroke({ ...stroke, ...p });
  const side = (k: keyof StrokeSides, v: number) => patch({ sides: { ...stroke.sides, [k]: v } });
  const toggleIndependent = (on: boolean) => patch(on ? { independent: true, sides: { top: stroke.weight, right: stroke.weight, bottom: stroke.weight, left: stroke.weight } } : { independent: false });

  const previewVars = { ['--dash' as string]: `${stroke.dash}px`, ['--period' as string]: `${stroke.dash + stroke.gap}px` } as CSSProperties;
  const boxVars = {
    ['--l' as string]: `${stroke.sides.left}px`, ['--t' as string]: `${stroke.sides.top}px`,
    ['--rn' as string]: `${-stroke.sides.right}px`, ['--bn' as string]: `${-stroke.sides.bottom}px`,
  } as CSSProperties;

  return (
    <div data-slot="stroke-editor" className={cn(strokeEditorVariants(), className)} {...props}>
      <div data-slot="stroke-editor-paint" role="group" aria-label="Stroke color">
        <PaintWell disabled={disabled} value={stroke.color} onValueChange={color => patch({ color })} />
      </div>
      <div data-slot="stroke-editor-weight-row" className={strokeEditorWeightRowVariants()}>
        <span data-slot="stroke-editor-weight" className="contents">
          <NumberField label={<Menu />} unit="px" aria-label="Weight" step={0.5} min={0} locked={disabled} value={stroke.weight} onValueChange={weight => patch({ weight })} />
        </span>
        <SegmentedControl
          data-slot="stroke-editor-position" size="xs" aria-label="Stroke position" className="flex" disabled={disabled}
          value={stroke.position} onValueChange={v => patch({ position: v as StrokePosition })}
        >
          <SegmentedControlItem value="inside">In</SegmentedControlItem>
          <SegmentedControlItem value="center">Center</SegmentedControlItem>
          <SegmentedControlItem value="outside">Out</SegmentedControlItem>
        </SegmentedControl>
        <IconButton data-slot="stroke-editor-details" size="xs" label="Stroke details" disabled={disabled} onClick={() => onDetailsClick?.()}><SlidersHorizontal /></IconButton>
      </div>
      <div data-slot="stroke-editor-dash-row" className={strokeEditorDashRowVariants()}>
        <span data-slot="stroke-editor-dash" className="contents">
          <NumberField label="Dash" aria-label="Dash" min={0} locked={disabled} value={stroke.dash} onValueChange={dash => patch({ dash })} />
        </span>
        <span data-slot="stroke-editor-gap" className="contents">
          <NumberField label="Gap" aria-label="Gap" min={0} locked={disabled} value={stroke.gap} onValueChange={gap => patch({ gap })} />
        </span>
        <SegmentedControl
          data-slot="stroke-editor-caps" size="xs" content="icon" aria-label="Line cap" className="justify-self-end" disabled={disabled}
          value={stroke.cap} onValueChange={v => patch({ cap: v as StrokeCap })}
        >
          <SegmentedControlItem value="butt" aria-label="Butt cap"><Minus /></SegmentedControlItem>
          <SegmentedControlItem value="round" aria-label="Round cap"><CircleDot /></SegmentedControlItem>
          <SegmentedControlItem value="arrow" aria-label="Arrow cap"><ArrowRight /></SegmentedControlItem>
        </SegmentedControl>
      </div>
      <div data-slot="stroke-editor-preview" aria-hidden className={strokeEditorPreviewVariants()}>
        <span data-slot="stroke-editor-preview-line" className={strokeEditorPreviewLineVariants()} style={previewVars} />
      </div>
      <div data-slot="stroke-editor-independent" className={strokeEditorIndependentVariants()}>
        <span>Independent stroke widths</span>
        <Switch size="sm" aria-label="Independent widths" disabled={disabled} checked={stroke.independent} onCheckedChange={toggleIndependent} />
      </div>
      {stroke.independent ? (
        <div data-slot="stroke-editor-sides" className={strokeEditorSidesVariants()}>
          <span data-slot="stroke-editor-side" className={strokeEditorSideVariants({ side: 't' })}>
            <NumberField label="T" aria-label="Top" min={0} locked={disabled} containerClassName="w-full" value={stroke.sides.top} onValueChange={v => side('top', v)} />
          </span>
          <span data-slot="stroke-editor-side" className={strokeEditorSideVariants({ side: 'l' })}>
            <NumberField label="L" aria-label="Left" min={0} locked={disabled} containerClassName="w-full" value={stroke.sides.left} onValueChange={v => side('left', v)} />
          </span>
          <span data-slot="stroke-editor-box" aria-hidden className={strokeEditorBoxVariants()} style={boxVars} />
          <span data-slot="stroke-editor-side" className={strokeEditorSideVariants({ side: 'r' })}>
            <NumberField label="R" aria-label="Right" min={0} locked={disabled} containerClassName="w-full" value={stroke.sides.right} onValueChange={v => side('right', v)} />
          </span>
          <span data-slot="stroke-editor-side" className={strokeEditorSideVariants({ side: 'b' })}>
            <NumberField label="B" aria-label="Bottom" min={0} locked={disabled} containerClassName="w-full" value={stroke.sides.bottom} onValueChange={v => side('bottom', v)} />
          </span>
        </div>
      ) : null}
    </div>
  );
}
