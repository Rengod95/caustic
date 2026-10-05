'use client';
import { useState, type ComponentProps, type CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { NumberField, type NumberFieldDraft } from '../number-field/number-field.tsx';
import { PaintWell, type PaintWellDraft, type PaintWellLabels } from '../paint-well/paint-well.tsx';
import { effectEditorCardVariants, effectEditorFieldsVariants, effectEditorStageVariants, effectEditorVariants } from './effect-editor.variants.ts';

export interface ShadowValue {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: { hex: string; alpha: number };
}

export type EffectEditorField = 'x' | 'y' | 'blur' | 'spread' | 'color';
export type EffectEditorFlags = Partial<Record<EffectEditorField, boolean>>;

/** Every text and accessible name of the part and of the PaintWell it composes; no built-in English. */
export interface EffectEditorLabels {
  /** aria-labels of the numeric fields ("Shadow X", "Shadow Y", "Blur", "Spread"). */
  x: string;
  y: string;
  blur: string;
  spread: string;
  /** Visible scrub labels ("X", "Y", "Blur", "Spread"). */
  xShort: string;
  yShort: string;
  blurShort: string;
  spreadShort: string;
  /** Names of the shadow color row. */
  color: PaintWellLabels;
  /** Placeholder of a mixed numeric field. */
  mixed: string;
}

/** A numeric field draft, or the draft of the color paint well forwarded with field color. */
export type EffectEditorDraft =
  | (NumberFieldDraft & { field: 'x' | 'y' | 'blur' | 'spread' })
  | { field: 'color'; draft: PaintWellDraft };

export interface EffectEditorProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Controlled shadow. */
  value?: ShadowValue | undefined;
  /** Uncontrolled initial shadow (the specimen). */
  defaultValue?: ShadowValue | undefined;
  /** Shows the preview stage above the fields. */
  preview?: boolean | undefined;
  /** true disables every control; a record disables the named fields. */
  disabled?: boolean | EffectEditorFlags | undefined;
  /** live (default): the behavior before K2d. release: NumberField value model, one commit per gesture. */
  commitMode?: 'live' | 'release' | undefined;
  /** Fields whose selection values differ; each shows labels.mixed instead of a value. */
  mixed?: EffectEditorFlags | undefined;
  /** Fields being written or held elsewhere: read-only, aria-busy, no event. */
  reserved?: EffectEditorFlags | undefined;
  labels: EffectEditorLabels;
  onDraftChange?: ((draft: EffectEditorDraft) => void) | undefined;
  /** release mode: a gesture is in progress with the previewed shadow; null when it ends or is cancelled. */
  onPreviewChange?: ((preview: ShadowValue | null) => void) | undefined;
  onValueChange?: ((value: ShadowValue) => void) | undefined;
}

const DEFAULT_SHADOW: ShadowValue = { x: 0, y: 12, blur: 24, spread: -6, color: { hex: '1F2128', alpha: 20 } };
const validHex = (v: string) => /^[0-9a-fA-F]+$/.test(v) && [3, 4, 6, 8].includes(v.length);
const flagged = (flags: boolean | EffectEditorFlags | undefined, field: EffectEditorField) => flags === true || (typeof flags === 'object' && flags[field] === true);
const busy = (on: boolean) => (on ? { 'aria-busy': true as const, 'data-reserved': true as const } : {});

/** Edits one shadow effect: a live stage, four numeric fields and the shadow color with its opacity. */
export function EffectEditor({
  value, defaultValue = DEFAULT_SHADOW, preview = false, disabled = false, commitMode = 'live', mixed, reserved, labels, onDraftChange, onPreviewChange, onValueChange, className, ...props
}: EffectEditorProps) {
  const [committed, setShadow] = useControllableState<ShadowValue>({ value, defaultValue, onChange: onValueChange });
  const [previewing, setPreviewing] = useState<ShadowValue | null>(null);
  const shadow = previewing ?? committed;
  const patch = (p: Partial<ShadowValue>) => setShadow({ ...committed, ...p });
  const hex = validHex(shadow.color.hex) ? `#${shadow.color.hex}` : 'currentColor';
  const fx = `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px color-mix(in oklab, ${hex} ${shadow.color.alpha}%, transparent)`;
  const preview1 = (next: ShadowValue | null) => { setPreviewing(next); onPreviewChange?.(next); };

  const number = (key: 'x' | 'y' | 'blur' | 'spread', ariaLabel: string, short: string, min?: number) => (
    <NumberField
      label={short} aria-label={ariaLabel} min={min} commitMode={commitMode}
      disabled={flagged(disabled, key)} reserved={flagged(reserved, key)} mixed={flagged(mixed, key)} mixedLabel={labels.mixed}
      value={shadow[key]} onValueChange={n => patch({ [key]: n })}
      onDraftChange={d => onDraftChange?.({ ...d, field: key })}
      onPreviewChange={n => preview1(n === null ? null : { ...committed, [key]: n })}
    />
  );
  const colorOff = flagged(disabled, 'color');
  const colorHeld = flagged(reserved, 'color');
  const colorMixed = flagged(mixed, 'color');
  return (
    <div data-slot="effect-editor" className={cn(effectEditorVariants(), className)} {...props}>
      {preview ? (
        <div data-slot="effect-editor-stage" aria-hidden className={effectEditorStageVariants()}>
          <div data-slot="effect-editor-card" className={effectEditorCardVariants()} style={{ ['--fx' as string]: fx } as CSSProperties} />
        </div>
      ) : null}
      <div data-slot="effect-editor-fields" className={effectEditorFieldsVariants()}>
        <span data-slot="effect-editor-x" className="contents" {...busy(flagged(reserved, 'x'))}>{number('x', labels.x, labels.xShort)}</span>
        <span data-slot="effect-editor-y" className="contents" {...busy(flagged(reserved, 'y'))}>{number('y', labels.y, labels.yShort)}</span>
        <span data-slot="effect-editor-blur" className="contents" {...busy(flagged(reserved, 'blur'))}>{number('blur', labels.blur, labels.blurShort, 0)}</span>
        <span data-slot="effect-editor-spread" className="contents" {...busy(flagged(reserved, 'spread'))}>{number('spread', labels.spread, labels.spreadShort)}</span>
      </div>
      <div data-slot="effect-editor-color" {...busy(colorHeld)}>
        <PaintWell
          labels={labels.color} disabled={colorOff} commitMode={commitMode} mixed={colorMixed}
          reserved={colorHeld ? { hex: true, alpha: true, well: true, detach: true } : undefined}
          value={shadow.color} onValueChange={color => patch({ color })}
          onDraftChange={draft => onDraftChange?.({ field: 'color', draft })}
          onPreviewChange={color => preview1(color === null ? null : { ...committed, color })}
        />
      </div>
    </div>
  );
}
