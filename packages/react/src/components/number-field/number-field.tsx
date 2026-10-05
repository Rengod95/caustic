'use client';
import { useEffect, useRef, useState, type ComponentProps, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useScrub } from '../../hooks/use-scrub.ts';

/** What the owner is told about the text of the field (K2d inspector value model). */
export interface NumberFieldDraft {
  text: string;
  /** The parsed number, or null when the text is not a usable number. */
  value: number | null;
  /** empty: blank text on a field that is not mixed; syntax: not a finite number; range: outside min and max (release mode only). */
  error: 'empty' | 'syntax' | 'range' | null;
  /** True while the text differs from the committed value. */
  dirty: boolean;
}

export interface NumberFieldProps extends Omit<ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange' | 'prefix' | 'size' | 'disabled'> {
  value?: number | null | undefined;
  defaultValue?: number | null | undefined;
  /** The commit: a step, a scrub (live: every step, release: once on release) or a committed edit. */
  onValueChange?: ((value: number) => void) | undefined;
  /** Scrub handle: a short label ("X", "W") or an icon. */
  label?: ReactNode;
  /** Unit shown after the value (px, %, °). */
  unit?: ReactNode;
  /** Trailing control, e.g. a clear button. */
  trailing?: ReactNode;
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
}

const clamp = (v: number, min = -Infinity, max = Infinity) => Math.min(max, Math.max(min, v));
const show = (v: number | null) => (v === null ? '' : String(v));

/** Inspector number field: drag the label to scrub, arrows step, Enter commits, Escape reverts. */
export function NumberField({
  value, defaultValue = null, onValueChange, label, unit, trailing, step = 1, min, max, commitMode = 'live', mixed = false, mixedLabel, locked = false, reserved = false, disabled = false, invalid = false,
  onDraftChange, onPreviewChange, onScrubStart, className, containerClassName, onKeyDown, onBlur, ...props
}: NumberFieldProps) {
  const release = commitMode === 'release';
  const [current, setCurrent] = useControllableState<number | null>({ value, defaultValue, onChange: v => { if (v !== null) onValueChange?.(v); } });
  const [draft, setDraft] = useState(show(current));
  const [draftError, setDraftError] = useState<NumberFieldDraft['error']>(null);
  const [preview, setPreview] = useState<number | null>(null);
  const editing = useRef(false);
  const latest = useRef<number | null>(null);
  const committedText = mixed ? '' : show(current);
  useEffect(() => { if (!editing.current) { setDraft(show(current)); setDraftError(null); } }, [current]);

  /** Reads text the way the commit does. A blank draft on a mixed field keeps the mixed value and is not an error. */
  const read = (raw: string): { value: number | null; error: NumberFieldDraft['error'] } => {
    if (raw.trim() === '') return { value: null, error: mixed ? null : 'empty' };
    const n = Number(raw);
    if (!Number.isFinite(n)) return { value: null, error: 'syntax' };
    if (release && ((min !== undefined && n < min) || (max !== undefined && n > max))) return { value: n, error: 'range' };
    return { value: n, error: null };
  };
  const dirtyText = (text: string) => text !== committedText && !(mixed && text.trim() === '');
  const clear = () => { editing.current = false; setDraftError(null); onDraftChange?.({ text: committedText, value: mixed ? null : current, error: null, dirty: false }); };
  const inert = disabled || reserved;

  const commit = (raw: string) => {
    const { value: parsed, error } = read(raw);
    if (release) {
      if (parsed !== null && error === null) { setCurrent(parsed); setDraft(String(parsed)); clear(); }
      else if (mixed && raw.trim() === '') { setDraft(''); clear(); }
      else setDraftError(error); // the draft stays
      return;
    }
    if (parsed !== null) { const n = clamp(parsed, min, max); setCurrent(n); setDraft(String(n)); } else setDraft(show(current));
    clear();
  };
  const { scrubbing, handlers } = useScrub(() => current ?? 0, v => {
    const n = clamp(v, min, max);
    if (release) { latest.current = n; setPreview(n); onPreviewChange?.(n); } else setCurrent(n);
  }, step, {
    onEnd: moved => {
      if (!release) return;
      const n = latest.current; latest.current = null;
      setPreview(null);
      if (moved && n !== null) { setCurrent(n); setDraft(String(n)); }
      onPreviewChange?.(null);
    },
    onCancel: () => { latest.current = null; setPreview(null); if (release) onPreviewChange?.(null); },
  });
  const keyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (inert) return;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); const d = (e.key === 'ArrowUp' ? 1 : -1) * step * (e.shiftKey ? 10 : e.altKey ? 0.1 : 1); const n = clamp(Math.round(((current ?? 0) + d) * 1000) / 1000, min, max); setCurrent(n); setDraft(String(n)); clear(); }
    if (e.key === 'Enter') commit(draft);
    if (e.key === 'Escape') { setDraft(show(current)); clear(); }
  };
  const invalidNow = invalid || draftError !== null;
  const shown = preview !== null ? String(preview) : mixed && !editing.current ? '' : draft;
  return (
    <div
      data-slot="number-field" aria-busy={reserved || undefined} aria-disabled={disabled || undefined}
      data-invalid={invalidNow || undefined} data-locked={locked || undefined} data-mixed={mixed || undefined} data-scrubbing={scrubbing || undefined}
      data-reserved={reserved || undefined} data-disabled={disabled || undefined} data-dirty={(editing.current && dirtyText(draft)) || undefined}
      className={cn(
        'relative flex h-control-md min-w-0 items-center rounded-lg bg-fill-hover transition-[background-color,box-shadow] duration-120 ease-out hover:bg-fill-pressed',
        'focus-within:bg-surface-base focus-within:shadow-focus-field',
        'data-[invalid]:bg-danger-soft data-[invalid]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-solid)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-solid)]',
        'data-[locked]:pointer-events-none data-[locked]:bg-bg-inset data-[reserved]:bg-bg-inset data-[scrubbing]:bg-accent-soft data-[disabled]:pointer-events-none data-[disabled]:opacity-42',
        containerClassName,
      )}
    >
      {label != null && (
        <span data-slot="number-field-label" aria-hidden {...(locked || inert ? {} : { ...handlers, onPointerDown: (e: PointerEvent<HTMLElement>) => { onScrubStart?.(); handlers.onPointerDown(e); } })}
          className="grid h-full min-w-6 shrink-0 cursor-ew-resize select-none place-items-center pl-1.5 pr-0.5 text-label text-text-tertiary hover:text-text-primary [&_svg]:size-icon-sm in-data-[scrubbing]:text-accent-text">
          {label}
        </span>
      )}
      <input
        data-slot="number-field-control" inputMode="decimal" aria-invalid={invalidNow ? 'true' : 'false'} disabled={locked || disabled}
        readOnly={reserved} aria-readonly={reserved || undefined}
        placeholder={mixed ? mixedLabel : undefined}
        value={shown}
        onChange={e => {
          if (inert) return;
          editing.current = true; const text = e.target.value; setDraft(text);
          const { value: parsed, error } = read(text);
          setDraftError(release ? error : null);
          onDraftChange?.({ text, value: parsed, error, dirty: dirtyText(text) });
        }}
        onKeyDown={keyDown}
        onBlur={e => { onBlur?.(e); if (editing.current && !inert) { if (release && draftError !== null) return; commit(draft); } }}
        className={cn('h-full w-full min-w-0 flex-1 border-0 bg-transparent px-1 text-footnote tabular-nums text-text-primary outline-none placeholder:italic placeholder:text-text-secondary disabled:text-text-disabled', className)}
        {...props}
      />
      {unit != null && <span data-slot="number-field-unit" className="shrink-0 pr-2 text-hint text-text-tertiary">{unit}</span>}
      {trailing != null && <span data-slot="number-field-trailing" className="mr-0.5 inline-grid size-control-xs shrink-0 place-items-center rounded-sm text-text-tertiary [&_svg]:size-icon-sm">{trailing}</span>}
      {locked && <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] outline-1 -outline-offset-1 outline-dashed outline-border-control" />}
    </div>
  );
}
