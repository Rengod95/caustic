'use client';
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowDownToLine, ArrowUpToLine, Baseline, FoldVertical, Info, SlidersHorizontal, Space, Type,
} from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Button } from '../button/button.tsx';
import { InspectorSelect } from '../inspector-select/inspector-select.tsx';
import { NumberField } from '../number-field/number-field.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import {
  textPropertiesNoticeIconVariants, textPropertiesNoticeVariants, textPropertiesRowVariants, textPropertiesTwoColumnVariants, textPropertiesVariants,
} from './text-properties.variants.ts';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TextVAlign = 'top' | 'middle' | 'bottom';
export type TextResize = 'fixed' | 'auto-h' | 'auto-w' | 'truncate';
export type TextCase = 'none' | 'upper' | 'lower' | 'title';
export interface TextPropertiesValue {
  weight: string;
  size: number;
  /** Percent. */
  lineHeight: number;
  /** Percent. */
  letterSpacing: number;
  align: TextAlign;
  valign: TextVAlign;
  resize: TextResize;
  case: TextCase;
}

export interface TextPropertiesProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  value?: TextPropertiesValue;
  defaultValue?: TextPropertiesValue;
  /** Number of style runs in the layer; the notice is shown when it is greater than 1. */
  styleRuns?: number;
  disabled?: boolean;
  onValueChange?: (value: TextPropertiesValue) => void;
  onWeightClick?: () => void;
  onDetailsClick?: () => void;
}

const DEFAULT_TEXT: TextPropertiesValue = { weight: 'Semibold', size: 28, lineHeight: 120, letterSpacing: -2, align: 'left', valign: 'middle', resize: 'fixed', case: 'none' };

/** The text section of the inspector: weight, size, spacing, alignment, resize, case and Details. */
export function TextProperties({ value, defaultValue = DEFAULT_TEXT, styleRuns = 1, disabled = false, onValueChange, onWeightClick, onDetailsClick, className, ...props }: TextPropertiesProps) {
  const [v, setV] = useControllableState<TextPropertiesValue>({ value, defaultValue, onChange: onValueChange });
  const patch = (p: Partial<TextPropertiesValue>) => setV({ ...v, ...p });
  return (
    <div data-slot="text-properties" className={cn(textPropertiesVariants(), className)} {...props}>
      <div data-slot="text-properties-type-row" className={textPropertiesTwoColumnVariants()}>
        <InspectorSelect data-slot="text-properties-weight" aria-label="Font weight" disabled={disabled} onClick={() => onWeightClick?.()}>{v.weight}</InspectorSelect>
        <span data-slot="text-properties-size" className="contents">
          <NumberField label={<Type />} aria-label="Size" min={1} locked={disabled} value={v.size} onValueChange={size => patch({ size })} />
        </span>
      </div>
      <div data-slot="text-properties-spacing-row" className={textPropertiesTwoColumnVariants()}>
        <span data-slot="text-properties-line-height" className="contents">
          <NumberField label={<Baseline />} unit="%" aria-label="Line height" locked={disabled} value={v.lineHeight} onValueChange={lineHeight => patch({ lineHeight })} />
        </span>
        <span data-slot="text-properties-letter-spacing" className="contents">
          <NumberField label={<Space />} unit="%" aria-label="Letter spacing" locked={disabled} value={v.letterSpacing} onValueChange={letterSpacing => patch({ letterSpacing })} />
        </span>
      </div>
      <div data-slot="text-properties-align-row" className={textPropertiesRowVariants()}>
        <SegmentedControl
          data-slot="text-properties-align" size="xs" content="icon" aria-label="Text alignment" disabled={disabled}
          value={v.align} onValueChange={align => patch({ align: align as TextAlign })}
        >
          <SegmentedControlItem value="left" aria-label="Align left"><AlignLeft /></SegmentedControlItem>
          <SegmentedControlItem value="center" aria-label="Align center"><AlignCenter /></SegmentedControlItem>
          <SegmentedControlItem value="right" aria-label="Align right"><AlignRight /></SegmentedControlItem>
          <SegmentedControlItem value="justify" aria-label="Justify"><AlignJustify /></SegmentedControlItem>
        </SegmentedControl>
        <SegmentedControl
          data-slot="text-properties-valign" size="xs" content="icon" aria-label="Vertical alignment" disabled={disabled}
          value={v.valign} onValueChange={valign => patch({ valign: valign as TextVAlign })}
        >
          <SegmentedControlItem value="top" aria-label="Top"><ArrowUpToLine /></SegmentedControlItem>
          <SegmentedControlItem value="middle" aria-label="Middle"><FoldVertical /></SegmentedControlItem>
          <SegmentedControlItem value="bottom" aria-label="Bottom"><ArrowDownToLine /></SegmentedControlItem>
        </SegmentedControl>
      </div>
      <div className={textPropertiesRowVariants()}>
        <SegmentedControl
          data-slot="text-properties-resize" size="xs" aria-label="Text resizing" disabled={disabled}
          value={v.resize} onValueChange={resize => patch({ resize: resize as TextResize })}
        >
          <SegmentedControlItem value="fixed">Fixed</SegmentedControlItem>
          <SegmentedControlItem value="auto-h">Auto H</SegmentedControlItem>
          <SegmentedControlItem value="auto-w">Auto W</SegmentedControlItem>
          <SegmentedControlItem value="truncate">Truncate</SegmentedControlItem>
        </SegmentedControl>
      </div>
      <div data-slot="text-properties-case-row" className={textPropertiesRowVariants()}>
        <SegmentedControl
          data-slot="text-properties-case" size="xs" aria-label="Letter case" disabled={disabled}
          value={v.case} onValueChange={c => patch({ case: c as TextCase })}
        >
          <SegmentedControlItem value="none" aria-label="As typed">Aa</SegmentedControlItem>
          <SegmentedControlItem value="upper" aria-label="Uppercase">AA</SegmentedControlItem>
          <SegmentedControlItem value="lower" aria-label="Lowercase">aa</SegmentedControlItem>
          <SegmentedControlItem value="title" aria-label="Title case">Ab</SegmentedControlItem>
        </SegmentedControl>
        <Button data-slot="text-properties-details" tone="ghost" size="xs" aria-haspopup="dialog" disabled={disabled} iconStart={<SlidersHorizontal aria-hidden />} onClick={() => onDetailsClick?.()}>Details</Button>
      </div>
      {styleRuns > 1 ? (
        <div data-slot="text-properties-notice" role="note" className={textPropertiesNoticeVariants()}>
          <span data-slot="text-properties-notice-icon" aria-hidden className={textPropertiesNoticeIconVariants()}><Info /></span>
          <span data-slot="text-properties-notice-text" className="leading-4">This text has {styleRuns} style runs. Changes apply to the whole layer.</span>
        </div>
      ) : null}
    </div>
  );
}
