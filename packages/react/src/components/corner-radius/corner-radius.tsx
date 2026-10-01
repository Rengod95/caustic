'use client';
import { Scan, Spline } from 'lucide-react';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { IconToggle } from '../icon-toggle/icon-toggle.tsx';
import { NumberField } from '../number-field/number-field.tsx';
import { cornerRadiusCorners, cornerRadiusFields, cornerRadiusGlyph, cornerRadiusShape, cornerRadiusStage, cornerRadiusVariants } from './corner-radius.variants.ts';

export interface CornerValues { tl: number; tr: number; bl: number; br: number }
export interface CornerRadiusValue { radius: number; smoothing: number; corners: CornerValues }

const DEFAULT_VALUE: CornerRadiusValue = { radius: 16, smoothing: 60, corners: { tl: 16, tr: 16, bl: 4, br: 16 } };

export interface CornerRadiusProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'> {
  /** Controlled value. radius is the all-corners value; corners holds the four individual values. */
  value?: CornerRadiusValue;
  /** Uncontrolled initial value: the specimen state. */
  defaultValue?: CornerRadiusValue;
  onValueChange?: (value: CornerRadiusValue) => void;
  /** Controlled independent-corners state. */
  independent?: boolean;
  /** Uncontrolled initial independent-corners state. */
  defaultIndependent?: boolean;
  onIndependentChange?: (independent: boolean) => void;
  /** Shows the preview stage above the fields. */
  preview?: boolean;
  disabled?: boolean;
}

const CORNERS: { key: keyof CornerValues; label: string }[] = [
  { key: 'tl', label: 'Top left' }, { key: 'tr', label: 'Top right' }, { key: 'bl', label: 'Bottom left' }, { key: 'br', label: 'Bottom right' },
];

/** Corner radius of a shape: one value, smoothing and four independent corners. */
export function CornerRadius({
  value, defaultValue = DEFAULT_VALUE, onValueChange, independent, defaultIndependent = false, onIndependentChange, preview = false, disabled = false, className, ...props
}: CornerRadiusProps) {
  const [v, setV] = useControllableState<CornerRadiusValue>({ value, defaultValue, onChange: onValueChange });
  const [ind, setInd] = useControllableState<boolean>({ value: independent, defaultValue: defaultIndependent, onChange: onIndependentChange });
  const { tl, tr, bl, br } = v.corners;
  const radius = ind ? `${tl}px ${tr}px ${br}px ${bl}px` : `${v.radius}px`;
  return (
    <div data-slot="corner-radius" aria-disabled={disabled || undefined} className={cn(cornerRadiusVariants(), className)} {...props}>
      {preview && (
        <div data-slot="corner-radius-stage" className={cornerRadiusStage()}>
          <div data-slot="corner-radius-shape" aria-hidden className={cornerRadiusShape()} style={{ '--r': radius } as CSSProperties} />
        </div>
      )}
      <div data-slot="corner-radius-fields" className={cornerRadiusFields()}>
        <div data-slot="corner-radius-radius" className="min-w-0">
          <NumberField
            aria-label="Corner radius"
            label={<span data-slot="corner-radius-glyph" aria-hidden className={cornerRadiusGlyph()} />}
            min={0}
            value={v.radius}
            disabled={disabled}
            onValueChange={radius => setV({ ...v, radius, corners: { tl: radius, tr: radius, bl: radius, br: radius } })}
          />
        </div>
        <div data-slot="corner-radius-smoothing" className="min-w-0">
          <NumberField
            aria-label="Corner smoothing"
            label={<Spline />}
            unit="%"
            min={0}
            max={100}
            value={v.smoothing}
            disabled={disabled}
            onValueChange={smoothing => setV({ ...v, smoothing })}
          />
        </div>
        <IconToggle data-slot="corner-radius-independent" aria-label="Independent corners" pressed={ind} onPressedChange={setInd} disabled={disabled}><Scan /></IconToggle>
      </div>
      {ind && (
        <div data-slot="corner-radius-corners" className={cornerRadiusCorners()}>
          {CORNERS.map(c => (
            <div key={c.key} data-slot="corner-radius-corner" className="min-w-0">
              <NumberField
                aria-label={c.label}
                label={<span aria-hidden className={cornerRadiusGlyph({ corner: c.key })} />}
                min={0}
                value={v.corners[c.key]}
                disabled={disabled}
                onValueChange={n => setV({ ...v, corners: { ...v.corners, [c.key]: n } })}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
