'use client';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { NumberField } from '../number-field/number-field.tsx';
import { PaintWell } from '../paint-well/paint-well.tsx';
import { effectEditorCardVariants, effectEditorFieldsVariants, effectEditorStageVariants, effectEditorVariants } from './effect-editor.variants.ts';

export interface ShadowValue {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: { hex: string; alpha: number };
}

export interface EffectEditorProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Controlled shadow. */
  value?: ShadowValue;
  /** Uncontrolled initial shadow (the specimen). */
  defaultValue?: ShadowValue;
  /** Shows the preview stage above the fields. */
  preview?: boolean;
  /** Disables every control. */
  disabled?: boolean;
  onValueChange?: (value: ShadowValue) => void;
}

const DEFAULT_SHADOW: ShadowValue = { x: 0, y: 12, blur: 24, spread: -6, color: { hex: '1F2128', alpha: 20 } };
const validHex = (v: string) => /^[0-9a-fA-F]+$/.test(v) && [3, 4, 6, 8].includes(v.length);

/** Edits one shadow effect: a live stage, four numeric fields and the shadow color with its opacity. */
export function EffectEditor({ value, defaultValue = DEFAULT_SHADOW, preview = false, disabled = false, onValueChange, className, ...props }: EffectEditorProps) {
  const [shadow, setShadow] = useControllableState<ShadowValue>({ value, defaultValue, onChange: onValueChange });
  const patch = (p: Partial<ShadowValue>) => setShadow({ ...shadow, ...p });
  const hex = validHex(shadow.color.hex) ? `#${shadow.color.hex}` : 'currentColor';
  const fx = `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px color-mix(in oklab, ${hex} ${shadow.color.alpha}%, transparent)`;
  return (
    <div data-slot="effect-editor" className={cn(effectEditorVariants(), className)} {...props}>
      {preview ? (
        <div data-slot="effect-editor-stage" aria-hidden className={effectEditorStageVariants()}>
          <div data-slot="effect-editor-card" className={effectEditorCardVariants()} style={{ ['--fx' as string]: fx } as CSSProperties} />
        </div>
      ) : null}
      <div data-slot="effect-editor-fields" className={effectEditorFieldsVariants()}>
        <span data-slot="effect-editor-x" className="contents">
          <NumberField label="X" aria-label="Shadow X" locked={disabled} value={shadow.x} onValueChange={x => patch({ x })} />
        </span>
        <span data-slot="effect-editor-y" className="contents">
          <NumberField label="Y" aria-label="Shadow Y" locked={disabled} value={shadow.y} onValueChange={y => patch({ y })} />
        </span>
        <span data-slot="effect-editor-blur" className="contents">
          <NumberField label="Blur" aria-label="Blur" min={0} locked={disabled} value={shadow.blur} onValueChange={blur => patch({ blur })} />
        </span>
        <span data-slot="effect-editor-spread" className="contents">
          <NumberField label="Spread" aria-label="Spread" locked={disabled} value={shadow.spread} onValueChange={spread => patch({ spread })} />
        </span>
      </div>
      <div data-slot="effect-editor-color" role="group" aria-label="Shadow color">
        <PaintWell disabled={disabled} value={shadow.color} onValueChange={color => patch({ color })} />
      </div>
    </div>
  );
}
