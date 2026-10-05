'use client';
import { Link2 } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentProps, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { hexInputVariants } from './hex-input.variants.ts';

export interface HexInputProps extends Omit<ComponentProps<'label'>, 'defaultValue' | 'onChange'> {
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

const validHex = (v: string) => /^[0-9a-fA-F]+$/.test(v) && [3, 4, 6, 8].includes(v.length);
const clean = (v: string) => v.replace(/^#/, '').replace(/[^0-9a-fA-F]/g, '').slice(0, 8);

/** Hex digits editor in an uppercase mono field; also shows the bound, mixed and invalid paint states. */
export function HexInput({ value, defaultValue = '', onValueChange, token, mixed = false, mixedLabel, invalid = false, disabled = false, commitMode = 'live', reserved = false, onDraftChange, className, 'aria-label': ariaLabel, 'aria-describedby': describedBy, ...props }: HexInputProps) {
  const [current, setCurrent] = useControllableState<string>({ value, defaultValue, onChange: v => onValueChange?.(v) });
  const [draft, setDraft] = useState(current);
  const editing = useRef(false);
  useEffect(() => { if (!editing.current) setDraft(current); }, [current]);
  const [draftError, setDraftError] = useState<HexInputDraft['error']>(null);
  const release = commitMode === 'release';
  const committedText = mixed ? '' : current;
  const dirtyText = (text: string) => text !== committedText && !(mixed && text === '');
  const read = (text: string): { value: string | null; error: HexInputDraft['error'] } =>
    text === '' ? { value: null, error: mixed ? null : 'empty' } : validHex(text) ? { value: text.toUpperCase(), error: null } : { value: null, error: 'syntax' };
  const clear = () => { editing.current = false; setDraftError(null); onDraftChange?.({ text: committedText, value: mixed ? null : current, error: null, dirty: false }); };
  const commit = () => {
    const { value: parsed, error } = read(draft);
    if (parsed !== null) { setCurrent(parsed); setDraft(parsed); clear(); return; }
    if (release && !(mixed && draft === '')) { setDraftError(error); return; } // the invalid draft stays
    setDraft(mixed ? '' : current);
    clear();
  };
  const keyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (reserved) return;
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') { setDraft(current); clear(); }
  };
  const invalidNow = invalid || draftError !== null;
  const bound = token != null;
  return (
    <label data-slot="hex-input" aria-busy={reserved || undefined} data-reserved={reserved || undefined} data-dirty={(editing.current && dirtyText(draft)) || undefined} data-bound={bound || undefined} data-invalid={invalidNow || undefined} data-mixed={mixed || undefined} data-disabled={disabled || undefined} className={cn(hexInputVariants(), className)} {...props}>
      {bound ? (
        <>
          <span data-slot="hex-input-icon" aria-hidden className="inline-grid size-icon-sm shrink-0 place-items-center text-accent-text [&_svg]:size-full [&_svg]:stroke-[1.75]"><Link2 /></span>
          <span data-slot="hex-input-token" className="min-w-0 truncate text-accent-text">{token}</span>
        </>
      ) : (
        <input
          data-slot="hex-input-control" type="text" spellCheck={false} autoComplete="off" disabled={disabled}
          aria-label={ariaLabel} aria-describedby={describedBy} aria-invalid={invalidNow ? 'true' : 'false'} readOnly={reserved} aria-readonly={reserved || undefined}
          placeholder={mixed ? mixedLabel : undefined}
          value={mixed && !editing.current ? '' : draft}
          onChange={e => {
            if (reserved) return;
            editing.current = true; const text = clean(e.target.value); setDraft(text);
            const { value: parsed, error } = read(text);
            setDraftError(release ? error : null);
            onDraftChange?.({ text, value: parsed, error, dirty: dirtyText(text) });
          }}
          onKeyDown={keyDown}
          onBlur={() => { if (editing.current && !reserved) { if (release && draftError !== null) return; commit(); } }}
          className="h-full w-full min-w-0 flex-1 border-0 bg-transparent font-mono text-mono-md font-normal text-text-primary uppercase outline-none placeholder:text-text-secondary disabled:text-text-disabled"
        />
      )}
    </label>
  );
}
