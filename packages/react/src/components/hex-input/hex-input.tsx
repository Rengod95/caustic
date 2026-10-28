'use client';
import type { ComponentProps } from 'react';
import type { CommonProps } from '../../lib/common-props.ts';
import { NumberField } from '../number-field/number-field.tsx';

export interface HexInputProps extends Omit<ComponentProps<'label'>, 'defaultValue' | 'onChange'>, CommonProps {
  /** Hex digits without #, uppercase ("E2763F"). */
  value?: string | undefined;
  defaultValue?: string;
  /** Committed with Enter or blur when the value is 3, 4, 6 or 8 hex digits (uppercase). */
  onValueChange?: (value: string) => void;
  /** Token path the paint is bound to; replaces the input by the bound chip. */
  token?: string | undefined;
  /** Differing values in a multi-selection. */
  mixed?: boolean | undefined;
  /** Placeholder while mixed. Required whenever mixed can be true; no built-in default. */
  mixedLabel?: string | undefined;
  invalid?: boolean | undefined;
  disabled?: boolean | undefined;
  /** live (default): an invalid value is reverted on Enter or blur. release: an invalid draft stays, is marked invalid and reported. */
  commitMode?: 'live' | 'release' | undefined;
  /** A write is in flight or another window holds the paint: read-only, focusable, aria-busy. */
  reserved?: boolean | undefined;
  /** The text changed (typing, paste, Escape) or a commit cleared it. */
  onDraftChange?: ((draft: HexInputDraft) => void) | undefined;
  /** Names the input ("Hex", "Stroke color"). */
  'aria-label'?: string;
  /** Ids describing the input, e.g. an error message. */
  'aria-describedby'?: string | undefined;
}

export interface HexInputDraft {
  text: string;
  /** Normalized uppercase digits, or null when the text is not valid. */
  value: string | null;
  /** empty: blank on a field that is not mixed; syntax: not 3, 4, 6 or 8 hex digits. */
  error: 'empty' | 'syntax' | null;
  dirty: boolean;
}

/**
 * Hex digits editor: the named preset of NumberField format="hex" (uppercase mono field, bound token chip, mixed, reserved
 * and invalid states; the draft and commit model is NumberField's useCommittedValue). The root keeps the hex-input slot and
 * takes the remaining label props (data-*, focus and blur); className goes to the root.
 */
export function HexInput({ tone, variant, radius, shadow, size, value, defaultValue = '', onValueChange, token, mixed, mixedLabel, invalid, disabled, commitMode, reserved, onDraftChange, className, 'aria-label': ariaLabel, 'aria-describedby': describedBy, ...props }: HexInputProps) {
  return (
    <NumberField
      data-slot="hex-input" format="hex"
      tone={tone} variant={variant} radius={radius} shadow={shadow} size={size}
      value={value} defaultValue={defaultValue} onValueChange={onValueChange} onDraftChange={onDraftChange}
      token={token} mixed={mixed} mixedLabel={mixedLabel} invalid={invalid} disabled={disabled} commitMode={commitMode} reserved={reserved}
      aria-label={ariaLabel} aria-describedby={describedBy}
      containerClassName={className} containerProps={props}
    />
  );
}
