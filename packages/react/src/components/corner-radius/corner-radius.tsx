'use client';
import { Scan, Spline } from 'lucide-react';
import { useState, type ComponentProps, type CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { IconToggle } from '../icon-toggle/icon-toggle.tsx';
import { NumberField, type NumberFieldDraft } from '../number-field/number-field.tsx';
import { cornerRadiusCorners, cornerRadiusFields, cornerRadiusGlyph, cornerRadiusShape, cornerRadiusStage, cornerRadiusVariants } from './corner-radius.variants.ts';

export interface CornerValues { tl: number; tr: number; bl: number; br: number }
export interface CornerRadiusValue { radius: number; smoothing: number; corners: CornerValues }
export type CornerRadiusField = 'radius' | 'smoothing' | 'independent' | 'tl' | 'tr' | 'bl' | 'br';
export type CornerRadiusFieldFlags = Partial<Record<CornerRadiusField, boolean>>;
export type CornerRadiusDraftField = 'radius' | 'smoothing' | 'tl' | 'tr' | 'bl' | 'br';
export interface CornerRadiusDraft extends NumberFieldDraft { field: CornerRadiusDraftField }
export interface CornerRadiusLabels {
  radius: string;
  smoothing: string;
  independent: string;
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  mixed: string;
}

const DEFAULT_VALUE: CornerRadiusValue = { radius: 16, smoothing: 60, corners: { tl: 16, tr: 16, bl: 4, br: 16 } };

export interface CornerRadiusProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'> {
  /** Controlled value. radius is the all-corners value; corners holds the four individual values. */
  value?: CornerRadiusValue | undefined;
  /** Uncontrolled initial value: the specimen state. */
  defaultValue?: CornerRadiusValue | undefined;
  onValueChange?: ((value: CornerRadiusValue) => void) | undefined;
  /** Controlled independent-corners state. */
  independent?: boolean | undefined;
  /** Uncontrolled initial independent-corners state. */
  defaultIndependent?: boolean | undefined;
  onIndependentChange?: ((independent: boolean) => void) | undefined;
  /** Shows the preview stage above the fields. */
  preview?: boolean | undefined;
  /** true disables every control; a record disables the named fields. */
  disabled?: boolean | Partial<Record<'radius' | 'smoothing' | 'independent' | 'tl' | 'tr' | 'bl' | 'br', boolean>> | undefined;
  /** live (default): the behavior before K2d. release: the NumberField value model and one commit per gesture. */
  commitMode?: 'live' | 'release' | undefined;
  /** Fields whose selection values differ; each shows labels.mixed instead of a value. */
  mixed?: Partial<Record<'radius' | 'smoothing' | 'independent' | 'tl' | 'tr' | 'bl' | 'br', boolean>> | undefined;
  /** Fields being written or held by another window. */
  reserved?: Partial<Record<'radius' | 'smoothing' | 'independent' | 'tl' | 'tr' | 'bl' | 'br', boolean>> | undefined;
  /** Every accessible name and the mixed text; no English default. */
  labels: CornerRadiusLabels;
  /** A numeric field text changed. */
  onDraftChange?: ((draft: CornerRadiusDraft) => void) | undefined;
  /** release mode: a scrub is in progress with the value being previewed; null when it ends or is cancelled. */
  onPreviewChange?: ((value: CornerRadiusValue | null) => void) | undefined;
}

const flagged = (flags: boolean | CornerRadiusFieldFlags | undefined, field: CornerRadiusField) => flags === true || (typeof flags === 'object' && flags[field] === true);

/** Corner radius of a shape: one value, smoothing and four independent corners. */
export function CornerRadius({
  value, defaultValue = DEFAULT_VALUE, onValueChange, independent, defaultIndependent = false, onIndependentChange, preview = false, disabled = false,
  commitMode = 'live', mixed, reserved, labels, onDraftChange, onPreviewChange, className, ...props
}: CornerRadiusProps) {
  const [v, setV] = useControllableState<CornerRadiusValue>({ value, defaultValue, onChange: onValueChange });
  const [ind, setInd] = useControllableState<boolean>({ value: independent, defaultValue: defaultIndependent, onChange: onIndependentChange });
  const [previewing, setPreviewing] = useState<CornerRadiusValue | null>(null);
  const shown = previewing ?? v;
  const { tl, tr, bl, br } = shown.corners;
  const radius = ind ? `${tl}px ${tr}px ${br}px ${bl}px` : `${shown.radius}px`;
  /** The props every numeric field shares: value model, mixed, reserved and the draft report. */
  const field = (name: CornerRadiusDraftField, build: (n: number) => CornerRadiusValue) => ({
    disabled: flagged(disabled, name),
    reserved: flagged(reserved, name),
    mixed: flagged(mixed, name),
    mixedLabel: labels.mixed,
    commitMode,
    onDraftChange: (d: NumberFieldDraft) => onDraftChange?.({ ...d, field: name }),
    onPreviewChange: (n: number | null) => { const next = n === null ? null : build(n); setPreviewing(next); onPreviewChange?.(next); },
    onValueChange: (n: number) => setV(build(n)),
  });
  /** The slot wrapper of a field being written elsewhere carries the busy state as well. */
  const wrap = (name: CornerRadiusDraftField) => (flagged(reserved, name) ? { 'aria-busy': true as const, 'data-reserved': true as const } : {});
  const corners: { key: keyof CornerValues; label: string }[] = [
    { key: 'tl', label: labels.topLeft }, { key: 'tr', label: labels.topRight }, { key: 'bl', label: labels.bottomLeft }, { key: 'br', label: labels.bottomRight },
  ];
  const indReserved = flagged(reserved, 'independent');
  const indMixed = flagged(mixed, 'independent');
  return (
    <div data-slot="corner-radius" aria-disabled={disabled === true || undefined} className={cn(cornerRadiusVariants(), className)} {...props}>
      {preview && (
        <div data-slot="corner-radius-stage" className={cornerRadiusStage()}>
          <div data-slot="corner-radius-shape" aria-hidden className={cornerRadiusShape()} style={{ '--r': radius } as CSSProperties} />
        </div>
      )}
      <div data-slot="corner-radius-fields" className={cornerRadiusFields()}>
        <div data-slot="corner-radius-radius" className="min-w-0" {...wrap('radius')}>
          <NumberField
            aria-label={labels.radius}
            label={<span data-slot="corner-radius-glyph" aria-hidden className={cornerRadiusGlyph()} />}
            min={0}
            value={v.radius}
            {...field('radius', n => ({ ...v, radius: n, corners: { tl: n, tr: n, bl: n, br: n } }))}
          />
        </div>
        <div data-slot="corner-radius-smoothing" className="min-w-0" {...wrap('smoothing')}>
          <NumberField
            aria-label={labels.smoothing}
            label={<Spline />}
            unit="%"
            min={0}
            max={100}
            value={v.smoothing}
            {...field('smoothing', n => ({ ...v, smoothing: n }))}
          />
        </div>
        <IconToggle
          data-slot="corner-radius-independent"
          aria-label={labels.independent}
          pressed={ind}
          onPressedChange={p => { if (!indReserved) setInd(p); }}
          disabled={flagged(disabled, 'independent')}
          {...(indMixed ? { 'aria-pressed': 'mixed' as const } : {})}
          {...(indReserved ? { 'aria-busy': true, 'aria-readonly': true, 'data-reserved': true } : {})}
        >
          <Scan />
        </IconToggle>
      </div>
      {ind && (
        <div data-slot="corner-radius-corners" className={cornerRadiusCorners()}>
          {corners.map(c => (
            <div key={c.key} data-slot="corner-radius-corner" className="min-w-0" {...wrap(c.key)}>
              <NumberField
                aria-label={c.label}
                label={<span aria-hidden className={cornerRadiusGlyph({ corner: c.key })} />}
                min={0}
                value={v.corners[c.key]}
                {...field(c.key, n => ({ ...v, corners: { ...v.corners, [c.key]: n } }))}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
