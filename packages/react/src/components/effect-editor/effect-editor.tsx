'use client';
import { useState, type ComponentProps, type CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFieldContract } from '../../hooks/use-field-contract.ts';
import { NumberField, type NumberFieldDraft } from '../number-field/number-field.tsx';
import { PaintWell, type PaintWellDraft, type PaintWellLabels } from '../paint-well/paint-well.tsx';
import { Select, SelectOption } from '../select/select.tsx';
import { Switch } from '../switch/switch.tsx';
import {
  effectEditorBackdropHalfVariants, effectEditorBackdropVariants, effectEditorBehindVariants, effectEditorCardVariants, effectEditorFieldsVariants, effectEditorStageVariants, effectEditorVariants,
} from './effect-editor.variants.ts';

export type EffectType = 'drop-shadow' | 'inner-shadow' | 'layer-blur' | 'background-blur' | 'foreground-blur';
export interface ShadowValue {
  /** K2e: defaults to drop-shadow. */
  type?: EffectType | undefined;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: { hex: string; alpha: number };
  /** K2e: showShadowBehindNode of a drop shadow. */
  behindNode?: boolean | undefined;
}

export type EffectEditorField = 'type' | 'x' | 'y' | 'blur' | 'spread' | 'color' | 'behindNode';
export type EffectEditorFlags = Partial<Record<EffectEditorField, boolean>>;
export type EffectEditorChange =
  | { field: 'x' | 'y' | 'blur' | 'spread'; value: number }
  | { field: 'type'; value: EffectType }
  | { field: 'behindNode'; value: boolean }
  | { field: 'color'; value: { hex: string; alpha: number } };
export interface EffectEditorLimit { min?: number | undefined; max?: number | undefined; step?: number | undefined }

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
  /** K2e: aria-label of the type select. */
  type?: string | undefined;
  /** K2e: text of the type options; foreground-blur is needed only for legacy data. */
  types?: (Record<'drop-shadow' | 'inner-shadow' | 'layer-blur' | 'background-blur', string> & { 'foreground-blur'?: string | undefined }) | undefined;
  /** K2e: text and name of the behind-layer switch. */
  behindNode?: string | undefined;
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
  /** Controlled effect. */
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
  /** release mode: a gesture is in progress with the previewed effect; null when it ends or is cancelled. */
  onPreviewChange?: ((preview: ShadowValue | null) => void) | undefined;
  onValueChange?: ((value: ShadowValue) => void) | undefined;
  /** K2e: the effect types the type select offers. */
  types?: ('drop-shadow' | 'inner-shadow' | 'layer-blur' | 'background-blur')[] | undefined;
  /** K2e: fields the owner marks invalid. */
  invalid?: EffectEditorFlags | undefined;
  /** K2e: id of the owner error text per field. */
  describedBy?: Partial<Record<EffectEditorField, string>> | undefined;
  /** K2e: per-field range and step. */
  limits?: Partial<Record<'x' | 'y' | 'blur' | 'spread', EffectEditorLimit>> | undefined;
  onFieldFocus?: ((event: { field: EffectEditorField }) => void) | undefined;
  onFieldBlur?: ((event: { field: EffectEditorField; dirty: boolean }) => void) | undefined;
  /** K2e: one field commits; return false to reject. */
  onFieldCommit?: ((change: EffectEditorChange) => boolean | void) | undefined;
  /** Colour family of the preview stage. */
  tone?: Tone | undefined;
  /** Emphasis of the preview stage; soft (default) is the bg.inset well. */
  variant?: Variant | undefined;
  /** Corner radius of the root; unset = none. */
  radius?: Radius | undefined;
  /** Elevation of the root; unset = none. */
  shadow?: Shadow | undefined;
  /** Stack gap step (xs 8, sm 12, md 14, lg 16); the fields keep their control size. */
  size?: Size | undefined;
}

const DEFAULT_SHADOW: ShadowValue = { x: 0, y: 12, blur: 24, spread: -6, color: { hex: '1F2128', alpha: 20 } };
const ALL_TYPES = ['drop-shadow', 'inner-shadow', 'layer-blur', 'background-blur'] as const;
const validHex = (v: string) => /^[0-9a-fA-F]+$/.test(v) && [3, 4, 6, 8].includes(v.length);
const flagged = (flags: boolean | EffectEditorFlags | undefined, field: EffectEditorField) => flags === true || (typeof flags === 'object' && flags[field] === true);
const busy = (on: boolean) => (on ? { 'aria-busy': true as const, 'data-reserved': true as const } : {});

/** Edits one effect: a live stage, the numeric fields of its type and the shadow color with its opacity. */
export function EffectEditor({
  value, defaultValue = DEFAULT_SHADOW, preview = false, disabled = false, commitMode = 'live', mixed, reserved, labels, onDraftChange, onPreviewChange, onValueChange,
  types, invalid, describedBy, limits, onFieldFocus, onFieldBlur, onFieldCommit,
  tone, variant, radius, shadow: elevation, size, className, children, ...props
}: EffectEditorProps) {
  const contract = useFieldContract<EffectEditorChange, EffectEditorField>({ invalid, describedBy, onFieldFocus, onFieldBlur, onFieldCommit });
  const [committed, setShadow] = useControllableState<ShadowValue>({ value, defaultValue, onChange: onValueChange });
  const [previewing, setPreviewing] = useState<ShadowValue | null>(null);
  const shadow = previewing ?? committed;
  const type: EffectType = shadow.type ?? 'drop-shadow';
  const isShadow = type === 'drop-shadow' || type === 'inner-shadow';
  const patch = (p: Partial<ShadowValue>) => setShadow({ ...committed, ...p });
  const hex = validHex(shadow.color.hex) ? `#${shadow.color.hex}` : 'currentColor';
  const color = `color-mix(in oklab, ${hex} ${shadow.color.alpha}%, transparent)`;
  const fx = type === 'drop-shadow'
    ? `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${color}`
    : type === 'inner-shadow'
      ? `inset ${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${color}`
      : '0 0 0 0 transparent';
  const kind = type === 'background-blur' ? 'backdrop' : isShadow ? 'shadow' : 'layer';
  const preview1 = (next: ShadowValue | null) => { setPreviewing(next); onPreviewChange?.(next); };
  const showType = types !== undefined || shadow.type !== undefined;
  const typeOptions: EffectType[] = [...(types ?? ALL_TYPES)];
  if (!typeOptions.includes(type)) typeOptions.push(type);

  const number = (key: 'x' | 'y' | 'blur' | 'spread', ariaLabel: string, short: string, min?: number) => (
    <NumberField
      label={short} aria-label={ariaLabel} min={min} commitMode={commitMode}
      disabled={flagged(disabled, key)} reserved={flagged(reserved, key)} mixed={flagged(mixed, key)} mixedLabel={labels.mixed}
      {...limits?.[key]}
      {...contract.inputProps(key, flagged(reserved, key) || flagged(disabled, key))}
      value={shadow[key]} onValueChange={n => { contract.commit(key, { field: key, value: n }, () => patch({ [key]: n })); }}
      onDraftChange={d => { contract.draft(key, d); onDraftChange?.({ ...d, field: key }); }}
      onPreviewChange={n => preview1(n === null ? null : { ...committed, [key]: n })}
    />
  );
  const colorOff = flagged(disabled, 'color');
  const colorHeld = flagged(reserved, 'color');
  const colorMixed = flagged(mixed, 'color');
  const typeHeld = flagged(reserved, 'type');
  const behindHeld = flagged(reserved, 'behindNode');
  const field = (key: 'x' | 'y' | 'blur' | 'spread') => ({ ...busy(flagged(reserved, key)), ...contract.wrapAttrs(key) });
  return (
    <div data-slot="effect-editor" className={cn(effectEditorVariants({ radius, shadow: elevation, size }), className)} {...props}>
      {showType && labels.types !== undefined ? (
        <Select
          data-slot="effect-editor-type" aria-label={labels.type} value={flagged(mixed, 'type') ? '' : type} placeholder={labels.mixed} disabled={flagged(disabled, 'type')}
          onValueChange={next => { if (!typeHeld) contract.commit('type', { field: 'type', value: next as EffectType }, () => patch({ type: next as EffectType })); }}
          {...contract.attrs('type')}
          onFocus={() => { if (!typeHeld && !flagged(disabled, 'type')) contract.focus('type'); }}
          onBlur={() => { if (!typeHeld && !flagged(disabled, 'type')) contract.blur('type'); }}
          {...(typeHeld ? { 'aria-busy': true as const, 'aria-readonly': true as const, 'data-reserved': true as const } : {})}
        >
          {typeOptions.map(option => <SelectOption key={option} value={option}>{labels.types?.[option] ?? option}</SelectOption>)}
        </Select>
      ) : null}
      {preview ? (
        <div data-slot="effect-editor-stage" aria-hidden className={cn(effectEditorStageVariants({ clip: kind !== 'shadow', tone, variant }))}>
          {kind === 'backdrop' ? <><span data-slot="effect-editor-backdrop" className={effectEditorBackdropVariants()} /><span data-slot="effect-editor-backdrop-half" className={effectEditorBackdropHalfVariants()} /></> : null}
          <div data-slot="effect-editor-card" className={effectEditorCardVariants({ kind })} style={{ ['--fx' as string]: fx, ['--blur' as string]: `${shadow.blur}px` } as CSSProperties} />
        </div>
      ) : null}
      <div data-slot="effect-editor-fields" className={effectEditorFieldsVariants()}>
        {isShadow ? <span data-slot="effect-editor-x" className="min-w-0" {...field('x')}>{number('x', labels.x, labels.xShort)}</span> : null}
        {isShadow ? <span data-slot="effect-editor-y" className="min-w-0" {...field('y')}>{number('y', labels.y, labels.yShort)}</span> : null}
        <span data-slot="effect-editor-blur" className="min-w-0" {...field('blur')}>{number('blur', labels.blur, labels.blurShort, 0)}</span>
        {isShadow ? <span data-slot="effect-editor-spread" className="min-w-0" {...field('spread')}>{number('spread', labels.spread, labels.spreadShort)}</span> : null}
      </div>
      {isShadow ? (
        <div data-slot="effect-editor-color" {...busy(colorHeld)} data-field="color" data-invalid={contract.isInvalid('color') || undefined}>
          <PaintWell
            labels={labels.color} disabled={colorOff} commitMode={commitMode} mixed={colorMixed}
            reserved={colorHeld ? { hex: true, alpha: true, well: true, detach: true } : undefined}
            invalid={contract.isInvalid('color') ? { hex: true } : undefined}
            value={shadow.color} onValueChange={next => { contract.commit('color', { field: 'color', value: next }, () => patch({ color: next })); }}
            onFieldFocus={() => contract.focus('color')} onFieldBlur={() => contract.blur('color')}
            onDraftChange={draft => { contract.draft('color', draft); onDraftChange?.({ field: 'color', draft }); }}
            onPreviewChange={next => preview1(next === null ? null : { ...committed, color: next })}
          />
        </div>
      ) : null}
      {type === 'drop-shadow' && shadow.behindNode !== undefined && labels.behindNode !== undefined ? (
        <div data-slot="effect-editor-behind" className={effectEditorBehindVariants()} {...busy(behindHeld)}>
          <span data-slot="effect-editor-behind-label">{labels.behindNode}</span>
          <Switch
            size="sm" aria-label={labels.behindNode} checked={flagged(mixed, 'behindNode') ? false : shadow.behindNode} disabled={flagged(disabled, 'behindNode')}
            onCheckedChange={on => { if (!behindHeld) contract.commit('behindNode', { field: 'behindNode', value: on }, () => patch({ behindNode: on })); }}
            {...contract.attrs('behindNode')}
            onFocus={() => { if (!behindHeld && !flagged(disabled, 'behindNode')) contract.focus('behindNode'); }}
            onBlur={() => { if (!behindHeld && !flagged(disabled, 'behindNode')) contract.blur('behindNode'); }}
            {...(flagged(mixed, 'behindNode') ? { role: 'button' as const, 'aria-pressed': 'mixed' as const, 'aria-checked': undefined } : {})}
          />
        </div>
      ) : null}
      {children}
    </div>
  );
}
