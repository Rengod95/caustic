import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state.ts';

/** empty: blank text on a field that is not mixed; syntax: the text does not parse; range: parsed but rejected by `check` (release only). */
export type CommittedValueError = 'empty' | 'syntax' | 'range';

/** What the owner is told about the text of the field (K2d inspector value model). */
export interface CommittedValueDraft<T> {
  text: string;
  /** The parsed value, or null when the text is not a usable value. */
  value: T | null;
  error: CommittedValueError | null;
  /** True while the text differs from the committed value. */
  dirty: boolean;
}

export interface CommittedValueOptions<T> {
  value?: T | null | undefined;
  defaultValue?: T | null | undefined;
  /** The commit. */
  onValueChange?: ((value: T) => void) | undefined;
  /** Text to value; null when the text does not parse (a syntax error). Blank text never reaches it. */
  parse: (text: string) => T | null;
  /** Value to text. */
  format: (value: T) => string;
  /** Filters typed text before it becomes the draft (hex drops # and non-hex characters). */
  sanitize?: ((text: string) => string) | undefined;
  /** release only: false marks a parsed value as a range error; the draft stays. */
  check?: ((value: T) => boolean) | undefined;
  /** live only: maps a parsed value before it commits (NumberField clamps to min and max). */
  normalize?: ((value: T) => T) | undefined;
  /** live (default): an unusable draft is reverted on commit. release: it stays, is marked invalid and reported. */
  commitMode?: 'live' | 'release' | undefined;
  mixed?: boolean | undefined;
  reserved?: boolean | undefined;
  disabled?: boolean | undefined;
  invalid?: boolean | undefined;
  onDraftChange?: ((draft: CommittedValueDraft<T>) => void) | undefined;
}

/**
 * Headless draft / commit model shared by the value fields (NumberField and its presets; Slider's field may adopt it).
 * The text is a draft while it is edited. Enter or blur commits it; Escape reverts it. In live mode an unusable draft
 * is reverted silently; in release mode it stays, marks the field invalid and is reported through onDraftChange.
 * A blank draft on a mixed field keeps the mixed value. While reserved or disabled the field raises no event.
 */
export function useCommittedValue<T>(options: CommittedValueOptions<T>) {
  const { parse, format, sanitize, check, normalize, commitMode = 'live', mixed = false, reserved = false, disabled = false, invalid = false, onDraftChange } = options;
  const release = commitMode === 'release';
  const [current, setCurrent] = useControllableState<T | null>({
    value: options.value, defaultValue: options.defaultValue ?? null, onChange: v => { if (v !== null) options.onValueChange?.(v); },
  });
  const show = (v: T | null) => (v === null ? '' : format(v));
  const [draft, setDraft] = useState(() => show(current));
  const [error, setError] = useState<CommittedValueError | null>(null);
  const editing = useRef(false);
  const committedText = mixed ? '' : show(current);
  useEffect(() => { if (!editing.current) { setDraft(show(current)); setError(null); } }, [current]);

  /** Reads text the way the commit does. A blank draft on a mixed field keeps the mixed value and is not an error. */
  const read = (raw: string): { value: T | null; error: CommittedValueError | null } => {
    if (raw.trim() === '') return { value: null, error: mixed ? null : 'empty' };
    const v = parse(raw);
    if (v === null) return { value: null, error: 'syntax' };
    if (release && check && !check(v)) return { value: v, error: 'range' };
    return { value: v, error: null };
  };
  const dirtyText = (text: string) => text !== committedText && !(mixed && text.trim() === '');
  const inert = disabled || reserved;

  /** Ends the edit and reports the clean state. */
  const clear = () => { editing.current = false; setError(null); onDraftChange?.({ text: committedText, value: mixed ? null : current, error: null, dirty: false }); };
  /** A discrete commit (a step, a button): sets the value and its text and ends the edit. */
  const commitValue = (v: T) => { setCurrent(v); setDraft(format(v)); clear(); };
  const commit = (raw: string = draft) => {
    const { value: parsed, error: err } = read(raw);
    if (release) {
      if (parsed !== null && err === null) { setCurrent(parsed); setDraft(format(parsed)); clear(); }
      else if (mixed && raw.trim() === '') { setDraft(''); clear(); }
      else setError(err); // the draft stays
      return;
    }
    if (parsed !== null) { const v = normalize ? normalize(parsed) : parsed; setCurrent(v); setDraft(format(v)); } else setDraft(show(current));
    clear();
  };
  const revert = () => { setDraft(show(current)); clear(); };
  const change = (raw: string) => {
    if (inert) return;
    editing.current = true;
    const text = sanitize ? sanitize(raw) : raw;
    setDraft(text);
    const r = read(text);
    setError(release ? r.error : null);
    onDraftChange?.({ text, value: r.value, error: r.error, dirty: dirtyText(text) });
  };
  /** Enter commits, Escape reverts; nothing while reserved or disabled. */
  const keyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (inert) return;
    if (e.key === 'Enter') commit(draft);
    if (e.key === 'Escape') revert();
  };
  /** Blur commits an edit, except a release draft that is already invalid (it stays). */
  const blur = () => { if (editing.current && !inert) { if (release && error !== null) return; commit(draft); } };

  return {
    current, setCurrent, draft, setDraft, error, release, inert,
    /** True while the text is an invalid draft or `invalid` is set. */
    invalid: invalid || error !== null,
    /** True while an edit differs from the committed value (data-dirty). */
    dirty: editing.current && dirtyText(draft),
    /** The text to show: blank while mixed and not edited (the placeholder shows the mixed label). */
    text: mixed && !editing.current ? '' : draft,
    read, commit, commitValue, revert, change, keyDown, blur, clear,
  };
}
