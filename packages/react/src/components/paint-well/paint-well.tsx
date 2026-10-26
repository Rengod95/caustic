'use client';
import { Unlink } from 'lucide-react';
import { useId, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import type * as React from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFieldContract } from '../../hooks/use-field-contract.ts';
import { ColorWell } from '../color-well/color-well.tsx';
import { HexInput } from '../hex-input/hex-input.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { NumberField } from '../number-field/number-field.tsx';

export interface PaintValue { hex: string; alpha: number }

/** Every accessible name and the mixed text of the row; no built-in English. */
export interface PaintWellLabels {
  /** aria-label of the well ("Fill color"). */
  well: string;
  /** aria-label of the hex field ("Fill hex"). */
  hex: string;
  /** aria-label of the alpha field ("Fill opacity"). */
  alpha: string;
  /** Name of the Detach button. */
  detach: string;
  /** Placeholder of the hex and alpha fields while mixed. */
  mixed: string;
}

export type PaintWellField = 'hex' | 'alpha' | 'well' | 'detach';
export type PaintWellChange = { field: 'hex'; value: string } | { field: 'alpha'; value: number };
export interface PaintWellLimit { min?: number | undefined; max?: number | undefined; step?: number | undefined }

/** What the owner is told about the text of the hex or alpha field. */
export interface PaintWellDraft {
  field: 'hex' | 'alpha';
  text: string;
  /** Uppercase digits for hex, the number for alpha, or null when the text is not usable. */
  value: string | number | null;
  error: 'empty' | 'syntax' | 'range' | null;
  dirty: boolean;
}

export interface PaintWellProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Controlled paint: hex digits without # and alpha 0-100. */
  value?: PaintValue | undefined;
  /** Uncontrolled initial paint. */
  defaultValue?: PaintValue | undefined;
  /** Token path the paint is bound to; shows the bound chip and Detach. */
  token?: string | undefined;
  /** CSS color of the bound token, painted in the well while bound. */
  tokenColor?: string | undefined;
  /** Every accessible name and the mixed text. */
  labels: PaintWellLabels;
  /** Differing paints in the selection: true marks the well, hex and alpha; a record marks only the named parts. */
  mixed?: boolean | Partial<Record<'hex' | 'alpha' | 'well', boolean>> | undefined;
  /** true marks the hex field (the typed hex is not 3, 4, 6 or 8 digits); K2e: a record marks the named field only. */
  invalid?: boolean | Partial<Record<'hex' | 'alpha', boolean>> | undefined;
  /** K2e: id of the owner error text per field. */
  describedBy?: Partial<Record<'hex' | 'alpha', string>> | undefined;
  /** K2e: which element receives the props a Popover (Radix Slot) merges onto this part. */
  anchor?: 'row' | 'well' | undefined;
  /** K2e: false hides Detach on a bound row. */
  detachable?: boolean | undefined;
  /** K2e: text of the bound chip (a string); default the token path. */
  tokenLabel?: ReactNode;
  /** K2e: range and step of the alpha field. */
  limits?: { alpha?: PaintWellLimit | undefined } | undefined;
  onFieldFocus?: ((event: { field: PaintWellField }) => void) | undefined;
  onFieldBlur?: ((event: { field: PaintWellField; dirty: boolean }) => void) | undefined;
  /** K2e: one field commits; return false to reject. */
  onFieldCommit?: ((change: PaintWellChange) => boolean | void) | undefined;
  /** Error text for an invalid row. */
  message?: ReactNode;
  /** true disables the row; a record disables the named parts. */
  disabled?: boolean | Partial<Record<PaintWellField, boolean>> | undefined;
  /** live (default): the behavior before K2d. release: NumberField value model, one commit per gesture, invalid hex draft kept. */
  commitMode?: 'live' | 'release' | undefined;
  /** Fields that are being written or held by another window: read-only, aria-busy, no event. */
  reserved?: Partial<Record<PaintWellField, boolean>> | undefined;
  /** Message shown under the row while the hex draft is invalid in commitMode release. */
  invalidMessage?: ReactNode;
  onDraftChange?: ((draft: PaintWellDraft) => void) | undefined;
  onPreviewChange?: ((preview: PaintValue | null) => void) | undefined;
  onValueChange?: ((value: PaintValue) => void) | undefined;
  onWellClick?: (() => void) | undefined;
  onDetach?: (() => void) | undefined;
}

const fallback: PaintValue = { hex: 'E2763F', alpha: 100 };
const validHex = (v: string) => /^[0-9a-fA-F]+$/.test(v) && [3, 4, 6, 8].includes(v.length);

/** One solid paint in a row: color well, hex digits and alpha. Bound to a token it shows the token and Detach instead. */
export function PaintWell({
  value, defaultValue = fallback, token, tokenColor, labels, mixed = false, invalid: invalidProp = false, describedBy, anchor = 'row', detachable = true, tokenLabel, limits, message, disabled = false, commitMode = 'live', reserved,
  invalidMessage, onDraftChange, onPreviewChange, onValueChange, onWellClick, onDetach, onFieldFocus, onFieldBlur, onFieldCommit, className, ...allProps
}: PaintWellProps) {
  const invalid = invalidProp === true || (typeof invalidProp === 'object' && invalidProp.hex === true);
  const contract = useFieldContract<PaintWellChange, PaintWellField>({ invalid: typeof invalidProp === 'object' ? invalidProp : undefined, describedBy, onFieldFocus, onFieldBlur, onFieldCommit });
  // As a Popover anchor the Radix trigger props belong to the well button, not to the row.
  const { ref: anchorRef, onClick: anchorClick, onKeyDown: anchorKeyDown, onPointerDown: anchorPointerDown, id: anchorId, 'aria-expanded': anchorExpanded, 'aria-haspopup': anchorHaspopup, 'aria-controls': anchorControls, 'data-state': anchorState, ...rest } = allProps as typeof allProps & { ref?: React.Ref<HTMLButtonElement>; 'data-state'?: string };
  const props = anchor === 'well' ? rest : allProps;
  const wellProps = anchor === 'well' ? { ref: anchorRef, id: anchorId, onKeyDown: anchorKeyDown, onPointerDown: anchorPointerDown, 'aria-expanded': anchorExpanded, 'aria-haspopup': anchorHaspopup, 'aria-controls': anchorControls, 'data-state': anchorState } : {};
  const [paint, setPaint] = useControllableState<PaintValue>({ value, defaultValue, onChange: v => onValueChange?.(v) });
  const messageId = useId();
  const lastValid = useRef(fallback.hex);
  const [hexInvalid, setHexInvalid] = useState(false);
  if (validHex(paint.hex)) lastValid.current = paint.hex;
  const bound = token != null;
  const isMixed = (k: 'hex' | 'alpha' | 'well') => (typeof mixed === 'object' ? mixed[k] === true : mixed);
  const isDisabled = (k: PaintWellField) => (typeof disabled === 'object' ? disabled[k] === true : disabled);
  const isReserved = (k: PaintWellField) => reserved?.[k] === true;
  const wellMixed = isMixed('well');
  const solid = `#${lastValid.current}`;
  const translucent = !bound && !wellMixed && paint.alpha < 100;
  const wellColor = bound ? tokenColor : translucent ? `color-mix(in oklab, ${solid} ${paint.alpha}%, transparent)` : solid;
  const hexBad = invalid || contract.isInvalid('hex');
  const draftInvalid = commitMode === 'release' && hexInvalid && invalidMessage != null && invalidMessage !== false;
  const ownerInvalid = hexBad && message != null && message !== false;
  const shownMessage = ownerInvalid ? message : draftInvalid ? invalidMessage : null;
  const hasMessage = shownMessage != null;
  const wellInert = isDisabled('well') || isReserved('well');
  return (
    <div
      data-slot="paint-well" data-bound={bound || undefined} data-mixed={isMixed('hex') || isMixed('alpha') || wellMixed || undefined}
      data-invalid={hexBad || contract.isInvalid('alpha') || (commitMode === 'release' && hexInvalid) || undefined} className={cn('flex min-w-0 flex-col gap-2', className)} {...props}
    >
      <div data-slot="paint-well-row" className="grid h-control-md grid-cols-[auto_1fr_var(--cs-size-field-alpha-w)] items-center gap-1.5">
        <div
          data-slot="paint-well-well" aria-busy={isReserved('well') || undefined} data-disabled={isDisabled('well') || undefined} data-reserved={isReserved('well') || undefined}
          {...contract.wrapAttrs('well')}
          className="flex data-[disabled]:pointer-events-none"
        >
          <ColorWell
            aria-label={labels.well}
            aria-disabled={isDisabled('well') || undefined} aria-busy={isReserved('well') || undefined}
            appearance={bound || wellMixed ? 'flat' : 'checker'}
            color={wellMixed ? undefined : wellColor}
            solidColor={translucent ? solid : undefined}
            split={translucent}
            mixed={wellMixed}
            {...wellProps}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => { if (!wellInert) { anchorClick?.(e as unknown as React.MouseEvent<HTMLDivElement>); onWellClick?.(); } }}
          />
        </div>
        <div data-slot="paint-well-hex" aria-busy={isReserved('hex') || undefined} data-reserved={isReserved('hex') || undefined} {...contract.wrapAttrs('hex')} className="min-w-0">
          <HexInput
            aria-label={labels.hex} value={paint.hex} token={bound ? (typeof tokenLabel === 'string' ? tokenLabel : token) : undefined} mixed={isMixed('hex')} mixedLabel={labels.mixed} invalid={hexBad}
            disabled={isDisabled('hex')} reserved={isReserved('hex')} commitMode={commitMode}
            aria-describedby={hasMessage ? messageId : contract.describedBy('hex')}
            data-field="hex" data-dirty={contract.isDirty('hex') || undefined}
            onFocus={() => { if (!isReserved('hex') && !isDisabled('hex')) contract.focus('hex'); }}
            onBlur={() => { if (!isReserved('hex') && !isDisabled('hex')) contract.blur('hex'); }}
            onDraftChange={d => {
              contract.draft('hex', d);
              setHexInvalid(d.error !== null);
              onDraftChange?.({ field: 'hex', text: d.text, value: d.value, error: d.error, dirty: d.dirty });
            }}
            onValueChange={hex => { contract.commit('hex', { field: 'hex', value: hex }, () => setPaint({ ...paint, hex })); }}
          />
        </div>
        {bound ? (detachable ? (
          <div data-slot="paint-well-detach" aria-busy={isReserved('detach') || undefined} data-reserved={isReserved('detach') || undefined} className="inline-flex justify-self-start">
            <IconButton
              label={labels.detach} size="xs" disabled={isDisabled('detach')}
              aria-busy={isReserved('detach') || undefined} data-reserved={isReserved('detach') || undefined}
              onClick={() => { if (!isReserved('detach')) onDetach?.(); }}
            >
              <Unlink />
            </IconButton>
          </div>
        ) : <span aria-hidden />) : (
          <div data-slot="paint-well-alpha" aria-busy={isReserved('alpha') || undefined} data-reserved={isReserved('alpha') || undefined} {...contract.wrapAttrs('alpha')} className="w-field-alpha-w">
            <NumberField
              aria-label={labels.alpha} unit="%" min={0} max={100} mixed={isMixed('alpha')} mixedLabel={labels.mixed}
              disabled={isDisabled('alpha')} reserved={isReserved('alpha')} commitMode={commitMode}
              {...limits?.alpha}
              {...contract.inputProps('alpha', isReserved('alpha') || isDisabled('alpha'))}
              aria-describedby={contract.describedBy('alpha')}
              invalid={contract.isInvalid('alpha') || (typeof invalidProp === 'object' && invalidProp.alpha === true)}
              value={paint.alpha} onValueChange={alpha => { contract.commit('alpha', { field: 'alpha', value: alpha }, () => setPaint({ ...paint, alpha })); }}
              onDraftChange={d => { contract.draft('alpha', d); onDraftChange?.({ field: 'alpha', text: d.text, value: d.value, error: d.error, dirty: d.dirty }); }}
              onPreviewChange={v => onPreviewChange?.(v === null ? null : { hex: paint.hex, alpha: v })}
            />
          </div>
        )}
      </div>
      {hasMessage ? <span data-slot="paint-well-message" id={messageId} className="text-hint text-danger-text">{shownMessage}</span> : null}
    </div>
  );
}
