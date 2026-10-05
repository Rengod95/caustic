'use client';
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowDownToLine, ArrowUpToLine, Baseline, FoldVertical, Info, SlidersHorizontal, Space, Type,
} from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Button } from '../button/button.tsx';
import { InspectorSelect } from '../inspector-select/inspector-select.tsx';
import { NumberField, type NumberFieldDraft } from '../number-field/number-field.tsx';
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

export type TextPropertiesField = 'weight' | 'size' | 'lineHeight' | 'letterSpacing' | 'align' | 'valign' | 'resize' | 'case';
export type TextPropertiesFieldFlags = Partial<Record<TextPropertiesField, boolean>>;
export type TextPropertiesDraftField = 'size' | 'lineHeight' | 'letterSpacing';
export interface TextPropertiesDraft extends NumberFieldDraft { field: TextPropertiesDraftField }
export interface TextPropertiesLabels {
  /** aria-label of the weight select. */
  weight: string;
  size: string;
  lineHeight: string;
  letterSpacing: string;
  align: Record<TextAlign, string>;
  alignGroup: string;
  valign: Record<TextVAlign, string>;
  valignGroup: string;
  resize: Record<TextResize, string>;
  resizeGroup: string;
  /** aria-label of each case item. */
  case: Record<TextCase, string>;
  /** Visible sample of each case item. */
  caseSamples: Record<TextCase, string>;
  caseGroup: string;
  details: string;
  notice: (styleRuns: number) => string;
  mixed: string;
}

export interface TextPropertiesProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  value?: TextPropertiesValue | undefined;
  defaultValue?: TextPropertiesValue | undefined;
  /** Number of style runs in the layer; the notice is shown when it is greater than 1. */
  styleRuns?: number | undefined;
  /** true disables every control; a record disables the named fields (the Details button follows true only). */
  disabled?: boolean | Partial<Record<'weight' | 'size' | 'lineHeight' | 'letterSpacing' | 'align' | 'valign' | 'resize' | 'case', boolean>> | undefined;
  /** live (default): the behavior before K2d. release: the NumberField value model and one commit per gesture. */
  commitMode?: 'live' | 'release' | undefined;
  /** Fields whose selection values differ; each shows labels.mixed instead of a value. */
  mixed?: Partial<Record<'weight' | 'size' | 'lineHeight' | 'letterSpacing' | 'align' | 'valign' | 'resize' | 'case', boolean>> | undefined;
  /** Fields being written or held by another window. */
  reserved?: Partial<Record<'weight' | 'size' | 'lineHeight' | 'letterSpacing' | 'align' | 'valign' | 'resize' | 'case', boolean>> | undefined;
  /** Every text and accessible name; no English default. */
  labels: TextPropertiesLabels;
  onValueChange?: ((value: TextPropertiesValue) => void) | undefined;
  /** The weight select was pressed (not raised while weight is reserved). */
  onWeightClick?: (() => void) | undefined;
  onDetailsClick?: (() => void) | undefined;
  /** A numeric field text changed. */
  onDraftChange?: ((draft: TextPropertiesDraft) => void) | undefined;
  /** release mode: a scrub is in progress with the value being previewed; null when it ends or is cancelled. */
  onPreviewChange?: ((value: TextPropertiesValue | null) => void) | undefined;
}

const DEFAULT_TEXT: TextPropertiesValue = { weight: 'Semibold', size: 28, lineHeight: 120, letterSpacing: -2, align: 'left', valign: 'middle', resize: 'fixed', case: 'none' };
const ALIGNS = ['left', 'center', 'right', 'justify'] as const;
const VALIGNS = ['top', 'middle', 'bottom'] as const;
const RESIZES = ['fixed', 'auto-h', 'auto-w', 'truncate'] as const;
const CASES = ['none', 'upper', 'lower', 'title'] as const;
const alignIcons = { left: <AlignLeft />, center: <AlignCenter />, right: <AlignRight />, justify: <AlignJustify /> } as const;
const valignIcons = { top: <ArrowUpToLine />, middle: <FoldVertical />, bottom: <ArrowDownToLine /> } as const;

const flagged = (flags: boolean | TextPropertiesFieldFlags | undefined, field: TextPropertiesField) => flags === true || (typeof flags === 'object' && flags[field] === true);
/** Attributes of a control whose field is being written elsewhere. */
const busy = { 'aria-busy': true, 'aria-readonly': true, 'data-reserved': true } as const;

/** The text section of the inspector: weight, size, spacing, alignment, resize, case and Details. */
export function TextProperties({
  value, defaultValue = DEFAULT_TEXT, styleRuns = 1, disabled = false, commitMode = 'live', mixed, reserved, labels,
  onValueChange, onWeightClick, onDetailsClick, onDraftChange, onPreviewChange, className, ...props
}: TextPropertiesProps) {
  const [v, setV] = useControllableState<TextPropertiesValue>({ value, defaultValue, onChange: onValueChange });
  const [previewing, setPreviewing] = useState<TextPropertiesValue | null>(null);
  const shown = previewing ?? v;
  const patch = (p: Partial<TextPropertiesValue>) => setV({ ...v, ...p });
  const isReserved = (f: TextPropertiesField) => flagged(reserved, f);
  const isMixed = (f: TextPropertiesField) => flagged(mixed, f);
  const isDisabled = (f: TextPropertiesField) => flagged(disabled, f);
  /** The slot wrapper of a field being written elsewhere carries the busy state as well. */
  const wrap = (f: TextPropertiesField) => (isReserved(f) ? { 'aria-busy': true as const, 'data-reserved': true as const } : {});
  const guard = (f: TextPropertiesField, set: (next: string) => void) => (next: string) => { if (!isReserved(f)) set(next); };
  /** The props every numeric field shares: value model, mixed, reserved and the draft report. */
  const field = (name: TextPropertiesDraftField) => ({
    value: shown[name],
    mixed: isMixed(name),
    mixedLabel: labels.mixed,
    disabled: isDisabled(name),
    reserved: isReserved(name),
    commitMode,
    onValueChange: (n: number) => patch({ [name]: n }),
    onDraftChange: (d: NumberFieldDraft) => onDraftChange?.({ ...d, field: name }),
    onPreviewChange: (n: number | null) => { const next = n === null ? null : { ...v, [name]: n }; setPreviewing(next); onPreviewChange?.(next); },
  });
  const weightMixed = isMixed('weight');

  return (
    <div data-slot="text-properties" className={cn(textPropertiesVariants(), className)} {...props}>
      <div data-slot="text-properties-type-row" className={textPropertiesTwoColumnVariants()}>
        <InspectorSelect
          data-slot="text-properties-weight" aria-label={labels.weight} disabled={isDisabled('weight')} data-mixed={weightMixed || undefined}
          onClick={() => { if (!isReserved('weight')) onWeightClick?.(); }}
          {...(isReserved('weight') ? busy : {})}
        >
          {weightMixed ? labels.mixed : v.weight}
        </InspectorSelect>
        <span data-slot="text-properties-size" className="contents" {...wrap('size')}>
          <NumberField label={<Type />} aria-label={labels.size} min={1} {...field('size')} />
        </span>
      </div>
      <div data-slot="text-properties-spacing-row" className={textPropertiesTwoColumnVariants()}>
        <span data-slot="text-properties-line-height" className="contents" {...wrap('lineHeight')}>
          <NumberField label={<Baseline />} unit="%" aria-label={labels.lineHeight} {...field('lineHeight')} />
        </span>
        <span data-slot="text-properties-letter-spacing" className="contents" {...wrap('letterSpacing')}>
          <NumberField label={<Space />} unit="%" aria-label={labels.letterSpacing} {...field('letterSpacing')} />
        </span>
      </div>
      <div data-slot="text-properties-align-row" className={textPropertiesRowVariants()}>
        <SegmentedControl
          data-slot="text-properties-align" size="xs" content="icon" aria-label={labels.alignGroup} disabled={isDisabled('align')}
          value={isMixed('align') ? '' : v.align} onValueChange={guard('align', align => patch({ align: align as TextAlign }))}
          {...(isReserved('align') ? busy : {})}
        >
          {ALIGNS.map(a => <SegmentedControlItem key={a} value={a} aria-label={labels.align[a]}>{alignIcons[a]}</SegmentedControlItem>)}
        </SegmentedControl>
        <SegmentedControl
          data-slot="text-properties-valign" size="xs" content="icon" aria-label={labels.valignGroup} disabled={isDisabled('valign')}
          value={isMixed('valign') ? '' : v.valign} onValueChange={guard('valign', valign => patch({ valign: valign as TextVAlign }))}
          {...(isReserved('valign') ? busy : {})}
        >
          {VALIGNS.map(a => <SegmentedControlItem key={a} value={a} aria-label={labels.valign[a]}>{valignIcons[a]}</SegmentedControlItem>)}
        </SegmentedControl>
      </div>
      <div className={textPropertiesRowVariants()}>
        <SegmentedControl
          data-slot="text-properties-resize" size="xs" aria-label={labels.resizeGroup} disabled={isDisabled('resize')}
          value={isMixed('resize') ? '' : v.resize} onValueChange={guard('resize', resize => patch({ resize: resize as TextResize }))}
          {...(isReserved('resize') ? busy : {})}
        >
          {RESIZES.map(r => <SegmentedControlItem key={r} value={r}>{labels.resize[r]}</SegmentedControlItem>)}
        </SegmentedControl>
      </div>
      <div data-slot="text-properties-case-row" className={textPropertiesRowVariants()}>
        <SegmentedControl
          data-slot="text-properties-case" size="xs" aria-label={labels.caseGroup} disabled={isDisabled('case')}
          value={isMixed('case') ? '' : v.case} onValueChange={guard('case', c => patch({ case: c as TextCase }))}
          {...(isReserved('case') ? busy : {})}
        >
          {CASES.map(c => <SegmentedControlItem key={c} value={c} aria-label={labels.case[c]}>{labels.caseSamples[c]}</SegmentedControlItem>)}
        </SegmentedControl>
        <Button data-slot="text-properties-details" tone="ghost" size="xs" aria-haspopup="dialog" disabled={disabled === true} iconStart={<SlidersHorizontal aria-hidden />} onClick={() => onDetailsClick?.()}>{labels.details}</Button>
      </div>
      {styleRuns > 1 ? (
        <div data-slot="text-properties-notice" role="note" className={textPropertiesNoticeVariants()}>
          <span data-slot="text-properties-notice-icon" aria-hidden className={textPropertiesNoticeIconVariants()}><Info /></span>
          <span data-slot="text-properties-notice-text" className="leading-4">{labels.notice(styleRuns)}</span>
        </div>
      ) : null}
    </div>
  );
}
