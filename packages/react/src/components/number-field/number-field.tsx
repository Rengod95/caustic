'use client';
import { Link2, Minus, Plus } from '../../icons/index.ts';
import { useRef, useState, type ComponentProps, type FocusEvent, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useScrub } from '../../hooks/use-scrub.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { useFieldContext } from '../field/field-context.ts';
import { useCommittedValue, type CommittedValueDraft } from './use-committed-value.ts';
import {
  numberFieldControlVariants, numberFieldHexControlVariants, numberFieldHexFrameVariants, numberFieldHexIconVariants, numberFieldHexTokenVariants,
  numberFieldHexVariants, numberFieldStepButtonVariants, numberFieldStepperControlVariants, numberFieldStepperVariants, numberFieldUnitVariants,
  numberFieldVariants,
} from './number-field.variants.ts';

/** What the owner is told about the text of the field (K2d inspector value model). error range is release mode only. */
export type NumberFieldDraft = CommittedValueDraft<number>;
/** The hex draft: value is the normalized uppercase digits; there is no range error. */
export interface NumberFieldHexDraft extends Omit<CommittedValueDraft<string>, 'error'> { error: 'empty' | 'syntax' | null }

/** scrub: the inspector field (drag the label). stepper: the form quantity field (− value +). */
export type NumberFieldAppearance = 'scrub' | 'stepper';
/** number: a finite number. hex: 3, 4, 6 or 8 hex digits without #, uppercase mono, with the bound token chip. */
export type NumberFieldFormat = 'number' | 'hex';

/** Attributes for the root element (data-*, focus and blur, a ref); a preset passes the rest of its own props here. */
export type NumberFieldContainerProps = HTMLAttributes<HTMLElement> & { [key: `data-${string}`]: string | number | boolean | undefined };

export interface NumberFieldProps extends Omit<ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange' | 'prefix' | 'size' | 'disabled'>, CommonProps {
  /** scrub (default): the inspector field. stepper: − and + buttons around a centred value (the form quantity field). */
  appearance?: NumberFieldAppearance | undefined;
  /** number (default) or hex (a string value; HexInput is the preset). */
  format?: NumberFieldFormat | undefined;
  value?: number | null | undefined;
  defaultValue?: number | null | undefined;
  /** The commit: a step, a scrub (live: every step, release: once on release) or a committed edit. */
  onValueChange?: ((value: number) => void) | undefined;
  /** Text to value, replacing the format's parser; return null for unreadable text. */
  parse?: ((text: string) => number | null) | undefined;
  /** Value to text, replacing the format's formatter. */
  formatValue?: ((value: number) => string) | undefined;
  /** Optional scrub handle: a short label ("X", "W") or an icon. Scrub appearance only; a stepper or hex field is named by Field or aria-label. */
  label?: ReactNode;
  /** Unit shown after the value (px, %, °). Scrub appearance only. */
  unit?: ReactNode;
  /** Trailing control, e.g. a clear button. Scrub appearance only. */
  trailing?: ReactNode;
  /** hex only: the token path the paint is bound to; replaces the input by the bound chip. */
  token?: string | undefined;
  step?: number | undefined;
  min?: number | undefined;
  max?: number | undefined;
  /** live (default): the behavior before K2d. release: typed text is a draft that is reported and never clamped or dropped; a scrub commits once on release. */
  commitMode?: 'live' | 'release' | undefined;
  /** Multi-selection with differing values: shows `mixedLabel`. */
  mixed?: boolean | undefined;
  /** Text shown while mixed. Required whenever mixed can be true; there is no built-in default. */
  mixedLabel?: string | undefined;
  /** Edited elsewhere (another window holds the reservation). */
  locked?: boolean | undefined;
  /** A write is in flight or another window holds the field: read-only, focusable, aria-busy. */
  reserved?: boolean | undefined;
  disabled?: boolean | undefined;
  invalid?: boolean | undefined;
  /** The text of the field changed (typing, paste, Escape) or a commit cleared it. */
  onDraftChange?: ((draft: NumberFieldDraft) => void) | undefined;
  /** release mode: a scrub is moving the value (not a commit); null when it ends or is cancelled. */
  onPreviewChange?: ((value: number | null) => void) | undefined;
  /** K2e: a pointer press on the scrub label starts (before any movement). */
  onScrubStart?: (() => void) | undefined;
  /** Class names for the outer container. */
  containerClassName?: string | undefined;
  /** Attributes for the outer container. */
  containerProps?: NumberFieldContainerProps | undefined;
  /** Root slot name of a preset built on NumberField (HexInput passes "hex-input"); the parts keep their number-field names. */
  'data-slot'?: string | undefined;
}

/** format="hex": the value is a string of hex digits. */
export interface NumberFieldHexProps extends Omit<NumberFieldProps, 'format' | 'value' | 'defaultValue' | 'onValueChange' | 'onDraftChange' | 'parse' | 'formatValue'> {
  format: 'hex';
  /** Hex digits without #, uppercase ("E2763F"). */
  value?: string | null | undefined;
  defaultValue?: string | null | undefined;
  /** Committed with Enter or blur when the value is 3, 4, 6 or 8 hex digits (uppercase). */
  onValueChange?: ((value: string) => void) | undefined;
  onDraftChange?: ((draft: NumberFieldHexDraft) => void) | undefined;
  parse?: ((text: string) => string | null) | undefined;
  formatValue?: ((value: string) => string) | undefined;
}

const clamp = (v: number, min = -Infinity, max = Infinity) => Math.min(max, Math.max(min, v));
const parseNumber = (text: string) => { const n = Number(text); return Number.isFinite(n) ? n : null; };
const parseHex = (text: string) => (/^[0-9a-fA-F]+$/.test(text) && [3, 4, 6, 8].includes(text.length) ? text.toUpperCase() : null);
const sanitizeHex = (text: string) => text.replace(/^#/, '').replace(/[^0-9a-fA-F]/g, '').slice(0, 8);

/** Value field: the inspector scrub field (default), the form stepper (appearance="stepper") or hex digits (format="hex", see HexInput). */
export function NumberField(props: NumberFieldProps): ReactNode;
export function NumberField(props: NumberFieldHexProps): ReactNode;
export function NumberField({
  appearance = 'scrub', format = 'number', value, defaultValue = null, onValueChange, parse, formatValue, label, unit, trailing, token, step = 1, min, max, commitMode = 'live',
  mixed = false, mixedLabel, locked = false, reserved = false, disabled, invalid, onDraftChange, onPreviewChange, onScrubStart, tone, variant, radius, shadow, size, id,
  className, containerClassName, containerProps, 'data-slot': rootSlot, onKeyDown, onBlur, ...props
}: NumberFieldProps | NumberFieldHexProps): ReactNode {
  const hex = format === 'hex';
  const stepper = !hex && appearance === 'stepper';
  // The Field context (label, hint and error wiring) is read by the form stepper only; the inspector path is unchanged.
  const fieldContext = useFieldContext();
  const field = stepper ? fieldContext : null;
  const isDisabled = disabled ?? field?.disabled ?? false;
  const cv = useCommittedValue<number | string>({
    value, defaultValue,
    onValueChange: onValueChange as ((v: number | string) => void) | undefined,
    onDraftChange: onDraftChange as ((d: CommittedValueDraft<number | string>) => void) | undefined,
    parse: (parse ?? (hex ? parseHex : parseNumber)) as (text: string) => number | string | null,
    format: (formatValue ?? String) as (v: number | string) => string,
    sanitize: hex ? sanitizeHex : undefined,
    check: hex ? undefined : v => !((min !== undefined && (v as number) < min) || (max !== undefined && (v as number) > max)),
    normalize: hex ? undefined : v => clamp(v as number, min, max),
    commitMode, mixed, reserved, disabled: isDisabled, invalid: invalid ?? field?.invalid ?? false,
  });
  const current = typeof cv.current === 'number' ? cv.current : null;
  const [preview, setPreview] = useState<number | null>(null);
  const latest = useRef<number | null>(null);

  const { scrubbing, handlers } = useScrub(() => current ?? 0, v => {
    const n = clamp(v, min, max);
    if (cv.release) { latest.current = n; setPreview(n); onPreviewChange?.(n); } else cv.setCurrent(n);
  }, step, {
    onEnd: moved => {
      if (!cv.release) return;
      const n = latest.current; latest.current = null;
      setPreview(null);
      if (moved && n !== null) { cv.setCurrent(n); cv.setDraft(String(n)); }
      onPreviewChange?.(null);
    },
    onCancel: () => { latest.current = null; setPreview(null); if (cv.release) onPreviewChange?.(null); },
  });
  /** A discrete step (arrow key or stepper button); the stepper starts an empty field from min. */
  const stepBy = (by: number) => cv.commitValue(clamp(Math.round(((current ?? (stepper ? min ?? 0 : 0)) + by) * 1000) / 1000, min, max));
  const keyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (cv.inert) return;
    if (!hex && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); stepBy((e.key === 'ArrowUp' ? 1 : -1) * step * (e.shiftKey ? 10 : e.altKey ? 0.1 : 1)); }
    cv.keyDown(e);
  };
  // The value model's props for the input, the same in every appearance and format.
  const control = {
    id: stepper ? id ?? field?.id : id,
    'aria-invalid': cv.invalid ? ('true' as const) : ('false' as const),
    readOnly: reserved, 'aria-readonly': reserved || undefined,
    placeholder: mixed ? mixedLabel : undefined,
    value: preview !== null ? String(preview) : cv.text,
    onChange: (e: { target: { value: string } }) => cv.change(e.target.value),
    onKeyDown: keyDown,
    onBlur: (e: FocusEvent<HTMLInputElement>) => { onBlur?.(e); cv.blur(); },
  };
  const bound = hex && token != null;
  const Root = hex ? 'label' : 'div';
  const rootClass = hex
    ? cn(numberFieldHexVariants({ tone, variant, size }), numberFieldHexFrameVariants({ radius, shadow }), containerClassName)
    : stepper
      ? cn(numberFieldStepperVariants({ tone, variant: variant ?? 'outline', size, radius, shadow }), containerClassName)
      : cn(numberFieldVariants({ tone, variant, radius, shadow, size }), containerClassName);
  const button = numberFieldStepButtonVariants({ size });

  return (
    <Root
      data-slot="number-field" {...(rootSlot ? { 'data-slot': rootSlot } : null)}
      role={stepper ? 'group' : undefined} data-appearance={stepper ? 'stepper' : undefined} data-format={hex ? 'hex' : undefined} data-size={stepper ? size ?? 'md' : undefined}
      aria-busy={reserved || undefined} aria-disabled={(!stepper && isDisabled) || undefined}
      data-invalid={cv.invalid || undefined} data-locked={locked || undefined} data-mixed={mixed || undefined} data-scrubbing={scrubbing || undefined}
      data-reserved={reserved || undefined} data-disabled={isDisabled || undefined} data-dirty={cv.dirty || undefined} data-bound={bound || undefined}
      className={rootClass}
      {...containerProps}
    >
      {hex ? (bound ? (
        <>
          <span data-slot="number-field-icon" aria-hidden className={numberFieldHexIconVariants()}><Link2 /></span>
          <span data-slot="number-field-token" className={numberFieldHexTokenVariants()}>{token}</span>
        </>
      ) : (
        <input
          data-slot="number-field-control" type="text" spellCheck={false} autoComplete="off" disabled={isDisabled}
          className={cn(numberFieldHexControlVariants({ size }), className)}
          {...props} {...control}
        />
      )) : stepper ? (
        <>
          <button type="button" tabIndex={-1} data-slot="number-field-decrement" aria-label="Decrease" disabled={isDisabled || (min !== undefined && current !== null && current <= min)} className={button} onClick={() => stepBy(-step)}><Minus aria-hidden /></button>
          <input
            data-slot="number-field-control" role="spinbutton" inputMode="numeric"
            aria-valuenow={current ?? undefined} aria-valuemin={min} aria-valuemax={max}
            aria-describedby={field?.describedBy} aria-required={field?.required || undefined} disabled={isDisabled}
            className={cn(numberFieldStepperControlVariants({ size }), className)}
            {...props} {...control}
          />
          <button type="button" tabIndex={-1} data-slot="number-field-increment" aria-label="Increase" disabled={isDisabled || (max !== undefined && current !== null && current >= max)} className={button} onClick={() => stepBy(step)}><Plus aria-hidden /></button>
        </>
      ) : (
        <>
          {label != null && (
            <span data-slot="number-field-label" aria-hidden {...(locked || cv.inert ? {} : { ...handlers, onPointerDown: (e: PointerEvent<HTMLElement>) => { onScrubStart?.(); handlers.onPointerDown(e); } })}
              className={cn(
                'grid h-full min-w-6 shrink-0 cursor-ew-resize select-none place-items-center pl-1.5 pr-0.5 text-label text-text-tertiary transition-control hover:text-text-primary [&_svg]:size-icon-sm in-data-[scrubbing]:text-text-primary in-data-[disabled]:text-disabled-text',
                // The drag cue: a 2px dotted border.control underline under a live label on hover (not while locked, reserved or disabled).
                !(locked || cv.inert) && 'decoration-border-control decoration-dotted decoration-2 underline-offset-3 hover:underline in-data-[scrubbing]:underline',
              )}>
              {label}
            </span>
          )}
          <input
            data-slot="number-field-control" inputMode="decimal" disabled={locked || isDisabled}
            {...control}
            className={cn(numberFieldControlVariants({ size }), className)}
            {...props}
          />
          {unit != null && <span data-slot="number-field-unit" className={numberFieldUnitVariants({ size })}>{unit}</span>}
          {trailing != null && <span data-slot="number-field-trailing" className="mr-0.5 inline-grid size-control-xs shrink-0 place-items-center rounded-sm text-text-tertiary in-data-[disabled]:text-disabled-text [&_svg]:size-icon-sm">{trailing}</span>}
          {locked && <span data-slot="number-field-lock" aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] outline-1 -outline-offset-1 outline-dashed outline-border-control" />}
        </>
      )}
    </Root>
  );
}
