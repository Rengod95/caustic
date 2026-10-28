'use client';
import { useEffect, useRef, type ClipboardEvent, type ComponentProps, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFieldContext } from '../field/field-context.ts';
import { otpCellVariants } from './otp-input.variants.ts';

/** tone, variant, radius, shadow and size style every cell (the cells are the field boxes; the root is a bare row). */
export interface OtpInputProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'>, CommonProps {
  /** Number of cells. */
  length?: number;
  /** Controlled code (characters, no separators). */
  value?: string;
  defaultValue?: string;
  /** Insert the dash after this many cells (3 for a 3–3 split). */
  separatorAfter?: number;
  /** numeric accepts digits only; text accepts letters and digits. */
  inputMode?: 'numeric' | 'text';
  invalid?: boolean;
  disabled?: boolean;
  /** Focuses the first empty cell on mount. */
  autoFocus?: boolean;
  /** Called with the whole code whenever it changes. */
  onValueChange?: (value: string) => void;
  /** Called with the whole code when every cell is filled. */
  onComplete?: (value: string) => void;
  /** aria-label of each cell from its 0-based index and the length. Default `Digit ${index + 1}`. */
  cellLabel?: (index: number, length: number) => string;
}

const DIGIT = /^[0-9]$/, ALNUM = /^[0-9A-Za-z]$/;

/** One character per cell. Typing advances, Backspace steps back, pasting fills the cells. */
export function OtpInput({
  length = 6, value, defaultValue = '', separatorAfter, inputMode = 'numeric', invalid, disabled, autoFocus = false, onValueChange, onComplete,
  cellLabel = i => `Digit ${i + 1}`, tone, variant, radius, shadow, size, className, ...props
}: OtpInputProps) {
  const field = useFieldContext();
  const cells = useRef<(HTMLInputElement | null)[]>([]);
  const [code, setCode] = useControllableState<string>({ value, defaultValue, onChange: v => { onValueChange?.(v); if (v.length === length) onComplete?.(v); } });
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isDisabled = disabled ?? field?.disabled ?? false;
  const accepts = (ch: string) => (inputMode === 'numeric' ? DIGIT : ALNUM).test(ch);
  const focusCell = (i: number) => cells.current[Math.max(0, Math.min(length - 1, i))]?.focus();
  useEffect(() => { if (autoFocus) cells.current[Math.min(code.length, length - 1)]?.focus(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Codes are kept compact: a character always lands in the first empty cell at or before the one pressed.
  const write = (i: number, ch: string) => {
    const at = Math.min(i, code.length);
    setCode((code.slice(0, at) + ch + code.slice(at + 1)).slice(0, length));
    focusCell(at + 1);
  };
  const remove = (i: number) => { setCode(code.slice(0, i) + code.slice(i + 1)); };
  const keyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (i < code.length) remove(i);
      else if (i > 0) { remove(i - 1); focusCell(i - 1); }
    } else if (e.key === 'Delete') { e.preventDefault(); if (i < code.length) remove(i); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); focusCell(i - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); focusCell(i + 1); }
    else if (e.key === 'Home') { e.preventDefault(); focusCell(0); }
    else if (e.key === 'End') { e.preventDefault(); focusCell(length - 1); }
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); if (accepts(e.key)) write(i, e.key); }
  };
  const paste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = [...e.clipboardData.getData('text')].filter(accepts).join('');
    if (!text) return;
    const at = Math.min(i, code.length);
    const next = (code.slice(0, at) + text).slice(0, length);
    setCode(next);
    focusCell(Math.min(next.length, length - 1));
  };
  // Fallback for input methods that skip key events (mobile keyboards, autofill): take the last accepted character.
  const change = (i: number, raw: string) => {
    const ch = [...raw].filter(accepts).pop();
    if (ch) write(i, ch);
  };

  const items = [];
  for (let i = 0; i < length; i++) {
    items.push(
      <input
        key={`cell-${i}`}
        ref={node => { cells.current[i] = node; }}
        data-slot="otp-input-cell"
        data-filled={i < code.length || undefined}
        data-current={(i === code.length && !isDisabled) || undefined}
        data-inverted={(i < code.length && !isInvalid && !isDisabled) || undefined}
        data-invalid={isInvalid || undefined}
        aria-label={cellLabel(i, length)}
        aria-invalid={isInvalid || undefined}
        inputMode={inputMode}
        autoComplete={i === 0 ? 'one-time-code' : 'off'}
        maxLength={1}
        disabled={isDisabled}
        value={code[i] ?? ''}
        className={cn(otpCellVariants({ tone, variant, radius, shadow, size }))}
        onChange={e => change(i, e.target.value)}
        onKeyDown={e => keyDown(i, e)}
        onPaste={e => paste(i, e)}
        onFocus={e => e.currentTarget.select()}
      />,
    );
    if (separatorAfter !== undefined && i + 1 === separatorAfter && i + 1 < length) items.push(<span key="separator" data-slot="otp-input-separator" aria-hidden className="h-0.5 w-2.5 shrink-0 rounded-2xs bg-border-strong" />);
  }
  return (
    <div role="group" aria-label="Verification code" aria-describedby={field?.describedBy} data-slot="otp-input" className={cn('flex items-center gap-2', className)} {...props}>
      {items}
    </div>
  );
}
