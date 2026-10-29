'use client';
import { ArrowRight, ArrowRightToLine, Circle, CircleDot, CornerUpRight, Menu, Minus, Octagon, SlidersHorizontal, Square } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFieldContract } from '../../hooks/use-field-contract.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { Input } from '../input/input.tsx';
import { NumberField, type NumberFieldDraft } from '../number-field/number-field.tsx';
import { PaintWell, type PaintWellDraft, type PaintWellLabels } from '../paint-well/paint-well.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { Switch } from '../switch/switch.tsx';
import {
  strokeEditorBoxVariants, strokeEditorDashRowVariants, strokeEditorEndsRowVariants, strokeEditorExtraRowVariants, strokeEditorFieldsVariants, strokeEditorIndependentVariants,
  strokeEditorLineVariants, strokeEditorPreviewLineVariants, strokeEditorPreviewVariants, strokeEditorSideVariants, strokeEditorSidesVariants,
  strokeEditorVariants, strokeEditorWeightRowVariants, strokeEditorWidthsVariants,
} from './stroke-editor.variants.ts';

export type StrokePosition = 'inside' | 'center' | 'outside';
export type StrokeCap = 'butt' | 'round' | 'square' | 'arrow' | 'arrow-filled';
export type StrokeJoin = 'miter' | 'round' | 'bevel';
export interface StrokeSides { top: number; right: number; bottom: number; left: number }
export interface StrokeValue {
  color: { hex: string; alpha: number };
  weight: number;
  position: StrokePosition;
  dash: number;
  gap: number;
  /** K2e: the dash lengths (empty = solid). When defined it replaces dash and gap and drives the preview. */
  dashPattern?: number[] | undefined;
  cap: StrokeCap;
  join?: StrokeJoin | undefined;
  miterLimit?: number | undefined;
  /** K2e: opacity of the stroke layer, 0 to 100, separate from the color alpha. */
  opacity?: number | undefined;
  independent: boolean;
  sides: StrokeSides;
}

export type StrokeEditorField = 'color' | 'weight' | 'position' | 'dash' | 'gap' | 'dashPattern' | 'cap' | 'join' | 'miterLimit' | 'opacity' | 'independent' | 'top' | 'right' | 'bottom' | 'left';
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
  caps: Record<'butt' | 'round' | 'arrow', string>;
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
  /** K2e: label and aria-label of the opacity field. */
  opacity?: string | undefined;
  joinGroup?: string | undefined;
  join?: Record<StrokeJoin, string> | undefined;
  dashPattern?: string | undefined;
  dashPatternPlaceholder?: string | undefined;
  miterLimit?: string | undefined;
  /** K2e: aria-labels of the extra cap items; an item is rendered when its label exists. */
  capExtra?: { square?: string | undefined; 'arrow-filled'?: string | undefined } | undefined;
  /** Placeholder of a mixed numeric field. */
  mixed: string;
}
export type StrokeChange =
  | { field: 'weight' | 'dash' | 'gap' | 'miterLimit' | 'opacity' | 'top' | 'right' | 'bottom' | 'left'; value: number }
  | { field: 'position' | 'cap' | 'join'; value: string }
  | { field: 'independent'; value: boolean }
  | { field: 'dashPattern'; value: number[] }
  | { field: 'color'; value: { hex: string; alpha: number } };
export interface StrokeEditorLimit { min?: number | undefined; max?: number | undefined; step?: number | undefined }

/** A numeric field draft, or the draft of the color paint well forwarded with field color. */
export type StrokeEditorDraft =
  | (NumberFieldDraft & { field: 'weight' | 'dash' | 'gap' | 'miterLimit' | 'opacity' | keyof StrokeSides })
  | { field: 'dashPattern'; text: string; value: number[] | null; error: 'empty' | 'syntax' | 'range' | null; dirty: boolean }
  | { field: 'color'; draft: PaintWellDraft };

export interface StrokeEditorProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'>, CommonProps {
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
  /** K2e: fields the owner marks invalid. */
  invalid?: StrokeEditorFlags | undefined;
  /** K2e: id of the owner error text per field. */
  describedBy?: Partial<Record<StrokeEditorField, string>> | undefined;
  /** K2e: per-field range and step. */
  limits?: Partial<Record<'weight' | 'dash' | 'gap' | 'miterLimit' | 'opacity' | keyof StrokeSides, StrokeEditorLimit>> | undefined;
  onFieldFocus?: ((event: { field: StrokeEditorField }) => void) | undefined;
  onFieldBlur?: ((event: { field: StrokeEditorField; dirty: boolean }) => void) | undefined;
  /** K2e: one field commits; return false to reject. */
  onFieldCommit?: ((change: StrokeChange) => boolean | void) | undefined;
}

const DEFAULT_STROKE: StrokeValue = {
  color: { hex: '2B1D14', alpha: 100 }, weight: 1.5, position: 'center', dash: 8, gap: 4, cap: 'round', independent: true,
  sides: { top: 2, right: 1, bottom: 4, left: 2 },
};

const flagged = (flags: boolean | StrokeEditorFlags | undefined, field: StrokeEditorField) => flags === true || (typeof flags === 'object' && flags[field] === true);
const busy = (on: boolean) => (on ? { 'aria-busy': true as const, 'data-reserved': true as const } : {});

/** The independent sides grid, mounted while the switch is on. It takes the enter decision once, at mount: a group that appears after
 *  the first paint rises, one present at the first paint does not. */
function SidesGroup({ enter, ...props }: ComponentProps<'div'> & { enter: boolean }) {
  const [rise] = useState(enter);
  return <div {...props} className={strokeEditorSidesVariants({ enter: rise })} />;
}

/** Edits a stroke: paint, weight, position, dash, cap and independent side widths. */
export function StrokeEditor({
  value, defaultValue = DEFAULT_STROKE, disabled = false, commitMode = 'live', mixed, reserved, labels, onDraftChange, onPreviewChange, onValueChange, onDetailsClick,
  invalid, describedBy, limits, onFieldFocus, onFieldBlur, onFieldCommit, tone, variant, radius, shadow, size, className, children, ...props
}: StrokeEditorProps) {
  const contract = useFieldContract<StrokeChange, StrokeEditorField>({ invalid, describedBy, onFieldFocus, onFieldBlur, onFieldCommit });
  const [patternText, setPatternText] = useState<string | null>(null);
  const [patternError, setPatternError] = useState<'empty' | 'syntax' | 'range' | null>(null);
  const typedPattern = useRef('');
  // False until the first commit: the sides group that mounts later is an appearance, not part of the first paint.
  const settled = useRef(false);
  useLayoutEffect(() => { settled.current = true; });
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
  /** A discrete field: reserved ones ignore the choice, the others commit through onFieldCommit first. */
  const choose = <T extends string | boolean,>(k: 'position' | 'cap' | 'join' | 'independent', set: (v: T) => void) => (v: T) => { if (!isHeld(k)) contract.commit(k, { field: k, value: v } as StrokeChange, () => set(v)); };
  const disc = (k: StrokeEditorField) => ({ ...contract.attrs(k), onFocus: () => { if (!isHeld(k) && !isOff(k)) contract.focus(k); }, onBlur: () => { if (!isHeld(k) && !isOff(k)) contract.blur(k); } });
  const wrapField = (k: StrokeEditorField) => ({ ...busy(isHeld(k)), ...contract.wrapAttrs(k) });
  /** Shared NumberField props of a field named `k`. */
  const field = (k: StrokeEditorField) => ({
    commitMode, disabled: isOff(k), reserved: isHeld(k), mixed: isMixed(k), mixedLabel: labels.mixed,
    ...limits?.[k as 'weight'],
    ...contract.inputProps(k, isHeld(k) || isOff(k)),
  });
  type NumericKey = 'weight' | 'dash' | 'gap' | 'miterLimit' | 'opacity' | keyof StrokeSides;
  const draft = (k: NumericKey) => (d: NumberFieldDraft) => { contract.draft(k, d); onDraftChange?.({ ...d, field: k }); };
  /** The commit of one numeric field: onFieldCommit first, the value only when accepted. */
  const num = (k: NumericKey, apply: (v: number) => void) => (v: number) => { contract.commit(k, { field: k, value: v }, () => apply(v)); };

  const pattern = stroke.dashPattern;
  const patternSource = pattern?.join(', ') ?? '';
  const readPattern = (text: string): { value: number[] | null; error: 'empty' | 'syntax' | 'range' | null } => {
    if (text.trim() === '') return { value: null, error: 'empty' };
    const parts = text.split(/[\s,]+/u).filter(Boolean).map(Number);
    if (parts.some(n => !Number.isFinite(n))) return { value: null, error: 'syntax' };
    if (parts.some(n => n < 0) || !parts.some(n => n > 0)) return { value: parts, error: 'range' };
    return { value: parts, error: null };
  };
  const commitPattern = () => {
    if (patternText === null) return;
    const { value: parsed, error } = readPattern(patternText);
    if (error !== null || parsed === null) { setPatternError(error); return; }
    setPatternError(null);
    if (parsed.join(', ') !== patternSource) contract.commit('dashPattern', { field: 'dashPattern', value: parsed }, () => patch({ dashPattern: parsed }));
    setPatternText(null);
    onDraftChange?.({ field: 'dashPattern', text: parsed.join(', '), value: parsed, error: null, dirty: false });
  };
  const showMiter = stroke.miterLimit !== undefined && (stroke.join === undefined || stroke.join === 'miter');
  const hasExtra = stroke.opacity !== undefined || showMiter;

  const lineDash = pattern ? (pattern[0] ?? 0) : stroke.dash;
  const linePeriod = pattern ? (pattern[0] ?? 0) + (pattern[1] ?? pattern[0] ?? 0) : stroke.dash + stroke.gap;
  const previewVars = { ['--dash' as string]: `${lineDash}px`, ['--period' as string]: `${linePeriod}px` } as CSSProperties;
  const boxVars = {
    ['--l' as string]: `${stroke.sides.left}px`, ['--t' as string]: `${stroke.sides.top}px`,
    ['--rn' as string]: `${-stroke.sides.right}px`, ['--bn' as string]: `${-stroke.sides.bottom}px`,
  } as CSSProperties;

  const sideField = (k: keyof StrokeSides, letter: 't' | 'l' | 'r' | 'b') => (
    <span data-slot="stroke-editor-side" className={strokeEditorSideVariants({ side: letter })} {...wrapField(k)}>
      <NumberField
        label={labels.sidesShort[k]} aria-label={labels.sides[k]} min={0} containerClassName="w-full" {...field(k)}
        value={stroke.sides[k]} onValueChange={num(k, v => side(k, v))} onDraftChange={draft(k)}
        onPreviewChange={n => preview1(n === null ? null : { ...committed, sides: { ...committed.sides, [k]: n } })}
      />
    </span>
  );

  const colorHeld = isHeld('color');
  return (
    <div data-slot="stroke-editor" className={cn(strokeEditorVariants({ tone, variant, size, radius, shadow }), className)} {...props}>
      <div data-slot="stroke-editor-fields" className={strokeEditorFieldsVariants()}>
        <div data-slot="stroke-editor-paint" {...busy(colorHeld)} data-field="color" data-invalid={contract.isInvalid('color') || undefined}>
          <PaintWell
            labels={labels.color} disabled={isOff('color')} commitMode={commitMode} mixed={isMixed('color')}
            reserved={colorHeld ? { hex: true, alpha: true, well: true, detach: true } : undefined}
            value={stroke.color} onValueChange={color => { contract.commit('color', { field: 'color', value: color }, () => patch({ color })); }}
            invalid={contract.isInvalid('color') ? { hex: true } : undefined}
            onFieldFocus={() => contract.focus('color')} onFieldBlur={() => contract.blur('color')}
            onDraftChange={d => { contract.draft('color', d); onDraftChange?.({ field: 'color', draft: d }); }}
            onPreviewChange={color => preview1(color === null ? null : { ...committed, color })}
          />
        </div>
        <div data-slot="stroke-editor-line" className={strokeEditorLineVariants()}>
          <div data-slot="stroke-editor-weight-row" className={strokeEditorWeightRowVariants()}>
            <span data-slot="stroke-editor-weight" className="min-w-0" {...wrapField('weight')}>
              <NumberField
                label={<Menu />} unit="px" aria-label={labels.weight} step={0.5} min={0} {...field('weight')}
                value={stroke.weight} onValueChange={num('weight', weight => patch({ weight }))} onDraftChange={draft('weight')}
                onPreviewChange={n => preview1(n === null ? null : { ...committed, weight: n })}
              />
            </span>
            <SegmentedControl
              data-slot="stroke-editor-position" size="xs" aria-label={labels.positionGroup} className="flex" disabled={isOff('position')}
              data-mixed={isMixed('position') || undefined} {...busy(isHeld('position'))} aria-readonly={isHeld('position') || undefined}
              value={isMixed('position') ? '' : stroke.position} onValueChange={choose<string>('position', v => patch({ position: v as StrokePosition }))}
              {...disc('position')}
            >
              <SegmentedControlItem value="inside">{labels.position.inside}</SegmentedControlItem>
              <SegmentedControlItem value="center">{labels.position.center}</SegmentedControlItem>
              <SegmentedControlItem value="outside">{labels.position.outside}</SegmentedControlItem>
            </SegmentedControl>
            <IconButton data-slot="stroke-editor-details" size="xs" className="justify-self-end" label={labels.details} disabled={disabled === true} onClick={() => onDetailsClick?.()}><SlidersHorizontal /></IconButton>
          </div>
          <div data-slot="stroke-editor-dash-row" className={strokeEditorDashRowVariants()}>
            {pattern === undefined && (
              <>
                <span data-slot="stroke-editor-dash" className="min-w-0" {...wrapField('dash')}>
                  <NumberField
                    label={labels.dash} aria-label={labels.dash} min={0} {...field('dash')}
                    value={stroke.dash} onValueChange={num('dash', dash => patch({ dash }))} onDraftChange={draft('dash')}
                    onPreviewChange={n => preview1(n === null ? null : { ...committed, dash: n })}
                  />
                </span>
                <span data-slot="stroke-editor-gap" className="min-w-0" {...wrapField('gap')}>
                  <NumberField
                    label={labels.gap} aria-label={labels.gap} min={0} {...field('gap')}
                    value={stroke.gap} onValueChange={num('gap', gap => patch({ gap }))} onDraftChange={draft('gap')}
                    onPreviewChange={n => preview1(n === null ? null : { ...committed, gap: n })}
                  />
                </span>
              </>
            )}
            {pattern !== undefined && (
              <span data-slot="stroke-editor-dash-pattern" className="col-span-2 min-w-0" {...wrapField('dashPattern')}>
                <Input
                  variant="sunken" size="xs" aria-label={labels.dashPattern} placeholder={labels.dashPatternPlaceholder} spellCheck={false} autoComplete="off"
                  invalid={contract.isInvalid('dashPattern') || patternError !== null} disabled={isOff('dashPattern')} readOnly={isHeld('dashPattern')}
                  aria-describedby={contract.describedBy('dashPattern')} data-field="dashPattern" data-dirty={(patternText !== null) || undefined}
                  value={patternText ?? patternSource}
                  onFocus={() => { if (!isHeld('dashPattern') && !isOff('dashPattern')) contract.focus('dashPattern'); }}
                  onBlur={() => { commitPattern(); if (!isHeld('dashPattern') && !isOff('dashPattern')) queueMicrotask(() => onFieldBlur?.({ field: 'dashPattern', dirty: typedPattern.current !== '' && patternError !== null })); }}
                  onValueChange={text => {
                    if (isHeld('dashPattern')) return;
                    typedPattern.current = text;
                    setPatternText(text);
                    const { value: parsed, error } = readPattern(text);
                    setPatternError(error);
                    contract.draft('dashPattern', { dirty: text !== patternSource });
                    onDraftChange?.({ field: 'dashPattern', text, value: parsed, error, dirty: text !== patternSource });
                  }}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === 'Enter') commitPattern();
                    if (e.key === 'Escape') { setPatternText(null); setPatternError(null); onDraftChange?.({ field: 'dashPattern', text: patternSource, value: pattern ?? null, error: null, dirty: false }); }
                  }}
                />
              </span>
            )}
          </div>
          <div data-slot="stroke-editor-ends-row" className={strokeEditorEndsRowVariants()}>
            <SegmentedControl
              data-slot="stroke-editor-caps" size="xs" content="icon" aria-label={labels.capsGroup} disabled={isOff('cap')}
              data-mixed={isMixed('cap') || undefined} {...busy(isHeld('cap'))} aria-readonly={isHeld('cap') || undefined}
              value={isMixed('cap') ? '' : stroke.cap} onValueChange={choose<string>('cap', v => patch({ cap: v as StrokeCap }))}
              {...disc('cap')}
            >
              <SegmentedControlItem value="butt" aria-label={labels.caps.butt}><Minus /></SegmentedControlItem>
              <SegmentedControlItem value="round" aria-label={labels.caps.round}><CircleDot /></SegmentedControlItem>
              {labels.capExtra?.square !== undefined && <SegmentedControlItem value="square" aria-label={labels.capExtra.square}><Square /></SegmentedControlItem>}
              <SegmentedControlItem value="arrow" aria-label={labels.caps.arrow}><ArrowRight /></SegmentedControlItem>
              {labels.capExtra?.['arrow-filled'] !== undefined && <SegmentedControlItem value="arrow-filled" aria-label={labels.capExtra['arrow-filled']}><ArrowRightToLine /></SegmentedControlItem>}
            </SegmentedControl>
            {stroke.join !== undefined && labels.join !== undefined && (
              <SegmentedControl
                data-slot="stroke-editor-join" size="xs" content="icon" aria-label={labels.joinGroup} disabled={isOff('join')}
                data-mixed={isMixed('join') || undefined} {...busy(isHeld('join'))} aria-readonly={isHeld('join') || undefined}
                value={isMixed('join') ? '' : stroke.join} onValueChange={choose<string>('join', v => patch({ join: v as StrokeJoin }))}
                {...disc('join')}
              >
                <SegmentedControlItem value="miter" aria-label={labels.join.miter}><CornerUpRight /></SegmentedControlItem>
                <SegmentedControlItem value="round" aria-label={labels.join.round}><Circle /></SegmentedControlItem>
                <SegmentedControlItem value="bevel" aria-label={labels.join.bevel}><Octagon /></SegmentedControlItem>
              </SegmentedControl>
            )}
          </div>
          {hasExtra && (
            <div data-slot="stroke-editor-extra-row" className={strokeEditorExtraRowVariants()}>
              {stroke.opacity !== undefined && (
                <span data-slot="stroke-editor-opacity" className="min-w-0" {...wrapField('opacity')}>
                  <NumberField
                    label={labels.opacity} aria-label={labels.opacity} unit="%" min={0} max={100} {...field('opacity')}
                    value={stroke.opacity} onValueChange={num('opacity', opacity => patch({ opacity }))} onDraftChange={draft('opacity')}
                    onPreviewChange={n => preview1(n === null ? null : { ...committed, opacity: n })}
                  />
                </span>
              )}
              {showMiter && (
                <span data-slot="stroke-editor-miter-limit" className="min-w-0" {...wrapField('miterLimit')}>
                  <NumberField
                    label={labels.miterLimit} aria-label={labels.miterLimit} min={1} {...field('miterLimit')}
                    value={stroke.miterLimit} onValueChange={num('miterLimit', miterLimit => patch({ miterLimit }))} onDraftChange={draft('miterLimit')}
                    onPreviewChange={n => preview1(n === null ? null : { ...committed, miterLimit: n })}
                  />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div data-slot="stroke-editor-preview" aria-hidden className={strokeEditorPreviewVariants()}>
        <span data-slot="stroke-editor-preview-line" className={strokeEditorPreviewLineVariants()} style={previewVars} />
      </div>
      <div data-slot="stroke-editor-widths" className={strokeEditorWidthsVariants()}>
        <div data-slot="stroke-editor-independent" className={strokeEditorIndependentVariants()}>
          <span>{labels.independent}</span>
          <Switch
            size="sm" aria-label={labels.independentSwitch} disabled={isOff('independent')} checked={stroke.independent}
            data-mixed={isMixed('independent') || undefined} {...(isMixed('independent') ? { 'aria-checked': 'mixed' as const } : {})}
            {...busy(isHeld('independent'))} aria-readonly={isHeld('independent') || undefined}
            onCheckedChange={choose<boolean>('independent', toggleIndependent)}
            {...disc('independent')}
          />
        </div>
        {stroke.independent ? (
          <SidesGroup data-slot="stroke-editor-sides" role="group" aria-label={labels.sidesGroup} enter={settled.current}>
            {sideField('top', 't')}
            {sideField('left', 'l')}
            <span data-slot="stroke-editor-box" aria-hidden className={strokeEditorBoxVariants()} style={boxVars} />
            {sideField('right', 'r')}
            {sideField('bottom', 'b')}
          </SidesGroup>
        ) : null}
      </div>
      {children}
    </div>
  );
}
