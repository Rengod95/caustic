'use client';
import { ArrowRight, CircleDot, Menu, Minus, SlidersHorizontal } from 'lucide-react';
import { useState, type ComponentProps, type CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { NumberField, type NumberFieldDraft } from '../number-field/number-field.tsx';
import { PaintWell, type PaintWellDraft, type PaintWellLabels } from '../paint-well/paint-well.tsx';
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

export type StrokeEditorField = 'color' | 'weight' | 'position' | 'dash' | 'gap' | 'cap' | 'independent' | 'top' | 'right' | 'bottom' | 'left';
export type StrokeEditorFlags = Partial<Record<StrokeEditorField, boolean>>;

/** Every text and accessible name of the part and of the PaintWell it composes; no built-in English. */
export interface StrokeEditorLabels {
  /** Names of the stroke color row. */
  color: PaintWellLabels;
  /** aria-label of the weight field. */
  weight: string;
  /** aria-label of the position control. */
  positionGroup: string;
  /** Text of the position items. */
  position: Record<StrokePosition, string>;
  /** Name of the details button. */
  details: string;
  /** Visible and accessible name of the dash and gap fields. */
  dash: string;
  gap: string;
  /** aria-label of the cap control. */
  capsGroup: string;
  /** aria-labels of the cap items. */
  caps: Record<StrokeCap, string>;
  /** Visible text of the independent widths row. */
  independent: string;
  /** aria-label of the independent widths switch. */
  independentSwitch: string;
  /** Names the group of side fields. */
  sidesGroup: string;
  /** aria-labels of the side fields. */
  sides: Record<keyof StrokeSides, string>;
  /** Visible letters of the side fields. */
  sidesShort: Record<keyof StrokeSides, string>;
  /** Placeholder of a mixed numeric field. */
  mixed: string;
}

/** A numeric field draft, or the draft of the color paint well forwarded with field color. */
export type StrokeEditorDraft =
  | (NumberFieldDraft & { field: 'weight' | 'dash' | 'gap' | keyof StrokeSides })
  | { field: 'color'; draft: PaintWellDraft };

export interface StrokeEditorProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  value?: StrokeValue | undefined;
  defaultValue?: StrokeValue | undefined;
  /** true disables every control; a record disables the named fields. */
  disabled?: boolean | StrokeEditorFlags | undefined;
  /** live (default): the behavior before K2d. release: NumberField value model, one commit per gesture. */
  commitMode?: 'live' | 'release' | undefined;
  /** Fields whose selection values differ; each shows labels.mixed instead of a value. */
  mixed?: StrokeEditorFlags | undefined;
  /** Fields being written or held elsewhere: read-only, aria-busy, no event. */
  reserved?: StrokeEditorFlags | undefined;
  labels: StrokeEditorLabels;
  onDraftChange?: ((draft: StrokeEditorDraft) => void) | undefined;
  /** release mode: a gesture is in progress with the previewed stroke; null when it ends or is cancelled. */
  onPreviewChange?: ((preview: StrokeValue | null) => void) | undefined;
  onValueChange?: ((value: StrokeValue) => void) | undefined;
  onDetailsClick?: (() => void) | undefined;
}

const DEFAULT_STROKE: StrokeValue = {
  color: { hex: '2B1D14', alpha: 100 }, weight: 1.5, position: 'center', dash: 8, gap: 4, cap: 'round', independent: true,
  sides: { top: 2, right: 1, bottom: 4, left: 2 },
};

const flagged = (flags: boolean | StrokeEditorFlags | undefined, field: StrokeEditorField) => flags === true || (typeof flags === 'object' && flags[field] === true);
const busy = (on: boolean) => (on ? { 'aria-busy': true as const, 'data-reserved': true as const } : {});

/** Edits a stroke: paint, weight, position, dash, cap and independent side widths. */
export function StrokeEditor({
  value, defaultValue = DEFAULT_STROKE, disabled = false, commitMode = 'live', mixed, reserved, labels, onDraftChange, onPreviewChange, onValueChange, onDetailsClick, className, ...props
}: StrokeEditorProps) {
  const [committed, setStroke] = useControllableState<StrokeValue>({ value, defaultValue, onChange: onValueChange });
  const [previewing, setPreviewing] = useState<StrokeValue | null>(null);
  const stroke = previewing ?? committed;
  const patch = (p: Partial<StrokeValue>) => setStroke({ ...committed, ...p });
  const side = (k: keyof StrokeSides, v: number) => patch({ sides: { ...committed.sides, [k]: v } });
  const toggleIndependent = (on: boolean) => patch(on ? { independent: true, sides: { top: committed.weight, right: committed.weight, bottom: committed.weight, left: committed.weight } } : { independent: false });
  const preview1 = (next: StrokeValue | null) => { setPreviewing(next); onPreviewChange?.(next); };

  const isOff = (k: StrokeEditorField) => flagged(disabled, k);
  const isHeld = (k: StrokeEditorField) => flagged(reserved, k);
  const isMixed = (k: StrokeEditorField) => flagged(mixed, k);
  const guard = <T,>(k: StrokeEditorField, set: (v: T) => void) => (v: T) => { if (!isHeld(k)) set(v); };
  /** Shared NumberField props of a field named `k`. */
  const field = (k: StrokeEditorField) => ({
    commitMode, disabled: isOff(k), reserved: isHeld(k), mixed: isMixed(k), mixedLabel: labels.mixed,
  });
  const draft = (k: 'weight' | 'dash' | 'gap' | keyof StrokeSides) => (d: NumberFieldDraft) => onDraftChange?.({ ...d, field: k });

  const previewVars = { ['--dash' as string]: `${stroke.dash}px`, ['--period' as string]: `${stroke.dash + stroke.gap}px` } as CSSProperties;
  const boxVars = {
    ['--l' as string]: `${stroke.sides.left}px`, ['--t' as string]: `${stroke.sides.top}px`,
    ['--rn' as string]: `${-stroke.sides.right}px`, ['--bn' as string]: `${-stroke.sides.bottom}px`,
  } as CSSProperties;

  const sideField = (k: keyof StrokeSides, letter: 't' | 'l' | 'r' | 'b') => (
    <span data-slot="stroke-editor-side" className={strokeEditorSideVariants({ side: letter })} {...busy(isHeld(k))}>
      <NumberField
        label={labels.sidesShort[k]} aria-label={labels.sides[k]} min={0} containerClassName="w-full" {...field(k)}
        value={stroke.sides[k]} onValueChange={v => side(k, v)} onDraftChange={draft(k)}
        onPreviewChange={n => preview1(n === null ? null : { ...committed, sides: { ...committed.sides, [k]: n } })}
      />
    </span>
  );

  const colorHeld = isHeld('color');
  return (
    <div data-slot="stroke-editor" className={cn(strokeEditorVariants(), className)} {...props}>
      <div data-slot="stroke-editor-paint" {...busy(colorHeld)}>
        <PaintWell
          labels={labels.color} disabled={isOff('color')} commitMode={commitMode} mixed={isMixed('color')}
          reserved={colorHeld ? { hex: true, alpha: true, well: true, detach: true } : undefined}
          value={stroke.color} onValueChange={color => patch({ color })}
          onDraftChange={d => onDraftChange?.({ field: 'color', draft: d })}
          onPreviewChange={color => preview1(color === null ? null : { ...committed, color })}
        />
      </div>
      <div data-slot="stroke-editor-weight-row" className={strokeEditorWeightRowVariants()}>
        <span data-slot="stroke-editor-weight" className="contents" {...busy(isHeld('weight'))}>
          <NumberField
            label={<Menu />} unit="px" aria-label={labels.weight} step={0.5} min={0} {...field('weight')}
            value={stroke.weight} onValueChange={weight => patch({ weight })} onDraftChange={draft('weight')}
            onPreviewChange={n => preview1(n === null ? null : { ...committed, weight: n })}
          />
        </span>
        <SegmentedControl
          data-slot="stroke-editor-position" size="xs" aria-label={labels.positionGroup} className="flex" disabled={isOff('position')}
          data-mixed={isMixed('position') || undefined} {...busy(isHeld('position'))} aria-readonly={isHeld('position') || undefined}
          value={isMixed('position') ? '' : stroke.position} onValueChange={guard<string>('position', v => patch({ position: v as StrokePosition }))}
        >
          <SegmentedControlItem value="inside">{labels.position.inside}</SegmentedControlItem>
          <SegmentedControlItem value="center">{labels.position.center}</SegmentedControlItem>
          <SegmentedControlItem value="outside">{labels.position.outside}</SegmentedControlItem>
        </SegmentedControl>
        <IconButton data-slot="stroke-editor-details" size="xs" label={labels.details} disabled={disabled === true} onClick={() => onDetailsClick?.()}><SlidersHorizontal /></IconButton>
      </div>
      <div data-slot="stroke-editor-dash-row" className={strokeEditorDashRowVariants()}>
        <span data-slot="stroke-editor-dash" className="contents" {...busy(isHeld('dash'))}>
          <NumberField
            label={labels.dash} aria-label={labels.dash} min={0} {...field('dash')}
            value={stroke.dash} onValueChange={dash => patch({ dash })} onDraftChange={draft('dash')}
            onPreviewChange={n => preview1(n === null ? null : { ...committed, dash: n })}
          />
        </span>
        <span data-slot="stroke-editor-gap" className="contents" {...busy(isHeld('gap'))}>
          <NumberField
            label={labels.gap} aria-label={labels.gap} min={0} {...field('gap')}
            value={stroke.gap} onValueChange={gap => patch({ gap })} onDraftChange={draft('gap')}
            onPreviewChange={n => preview1(n === null ? null : { ...committed, gap: n })}
          />
        </span>
        <SegmentedControl
          data-slot="stroke-editor-caps" size="xs" content="icon" aria-label={labels.capsGroup} className="justify-self-end" disabled={isOff('cap')}
          data-mixed={isMixed('cap') || undefined} {...busy(isHeld('cap'))} aria-readonly={isHeld('cap') || undefined}
          value={isMixed('cap') ? '' : stroke.cap} onValueChange={guard<string>('cap', v => patch({ cap: v as StrokeCap }))}
        >
          <SegmentedControlItem value="butt" aria-label={labels.caps.butt}><Minus /></SegmentedControlItem>
          <SegmentedControlItem value="round" aria-label={labels.caps.round}><CircleDot /></SegmentedControlItem>
          <SegmentedControlItem value="arrow" aria-label={labels.caps.arrow}><ArrowRight /></SegmentedControlItem>
        </SegmentedControl>
      </div>
      <div data-slot="stroke-editor-preview" aria-hidden className={strokeEditorPreviewVariants()}>
        <span data-slot="stroke-editor-preview-line" className={strokeEditorPreviewLineVariants()} style={previewVars} />
      </div>
      <div data-slot="stroke-editor-independent" className={strokeEditorIndependentVariants()}>
        <span>{labels.independent}</span>
        <Switch
          size="sm" aria-label={labels.independentSwitch} disabled={isOff('independent')} checked={stroke.independent}
          data-mixed={isMixed('independent') || undefined} {...(isMixed('independent') ? { 'aria-checked': 'mixed' as const } : {})}
          {...busy(isHeld('independent'))} aria-readonly={isHeld('independent') || undefined}
          onCheckedChange={guard<boolean>('independent', toggleIndependent)}
        />
      </div>
      {stroke.independent ? (
        <div data-slot="stroke-editor-sides" role="group" aria-label={labels.sidesGroup} className={strokeEditorSidesVariants()}>
          {sideField('top', 't')}
          {sideField('left', 'l')}
          <span data-slot="stroke-editor-box" aria-hidden className={strokeEditorBoxVariants()} style={boxVars} />
          {sideField('right', 'r')}
          {sideField('bottom', 'b')}
        </div>
      ) : null}
    </div>
  );
}
