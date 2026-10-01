'use client';
import { useEffect, useRef, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useScrub } from '../../hooks/use-scrub.ts';

export interface NumberFieldProps extends Omit<ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange' | 'prefix' | 'size'> {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number) => void;
  /** Scrub handle: a short label ("X", "W") or an icon. */
  label?: ReactNode;
  /** Unit shown after the value (px, %, °). */
  unit?: ReactNode;
  /** Trailing control, e.g. a clear button. */
  trailing?: ReactNode;
  step?: number;
  min?: number;
  max?: number;
  /** Multi-selection with differing values: shows "Mixed". */
  mixed?: boolean;
  /** Edited elsewhere (another window holds the reservation). */
  locked?: boolean;
  invalid?: boolean;
  /** Class names for the outer container. */
  containerClassName?: string;
}

const clamp = (v: number, min = -Infinity, max = Infinity) => Math.min(max, Math.max(min, v));

/** Inspector number field: drag the label to scrub, arrows step, Enter commits, Escape reverts. */
export function NumberField({ value, defaultValue = null, onValueChange, label, unit, trailing, step = 1, min, max, mixed = false, locked = false, invalid = false, className, containerClassName, onKeyDown, onBlur, ...props }: NumberFieldProps) {
  const [current, setCurrent] = useControllableState<number | null>({ value, defaultValue, onChange: v => { if (v !== null) onValueChange?.(v); } });
  const [draft, setDraft] = useState(current === null ? '' : String(current));
  const editing = useRef(false);
  useEffect(() => { if (!editing.current) setDraft(current === null ? '' : String(current)); }, [current]);
  const commit = (raw: string) => { const n = Number(raw); if (raw.trim() !== '' && Number.isFinite(n)) setCurrent(clamp(n, min, max)); else setDraft(current === null ? '' : String(current)); };
  const { scrubbing, handlers } = useScrub(() => current ?? 0, v => setCurrent(clamp(v, min, max)), step);
  const keyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); const d = (e.key === 'ArrowUp' ? 1 : -1) * step * (e.shiftKey ? 10 : e.altKey ? 0.1 : 1); setCurrent(clamp(Math.round(((current ?? 0) + d) * 1000) / 1000, min, max)); editing.current = false; }
    if (e.key === 'Enter') { commit(draft); editing.current = false; }
    if (e.key === 'Escape') { editing.current = false; setDraft(current === null ? '' : String(current)); }
  };
  return (
    <div
      data-slot="number-field"
      data-invalid={invalid || undefined} data-locked={locked || undefined} data-mixed={mixed || undefined} data-scrubbing={scrubbing || undefined}
      className={cn(
        'relative flex h-control-md min-w-0 items-center rounded-lg bg-fill-hover transition-[background-color,box-shadow] duration-120 ease-out hover:bg-fill-pressed',
        'focus-within:bg-surface-base focus-within:shadow-focus-field',
        'data-[invalid]:bg-danger-soft data-[invalid]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-solid)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-solid)]',
        'data-[locked]:pointer-events-none data-[locked]:bg-bg-inset data-[scrubbing]:bg-accent-soft',
        containerClassName,
      )}
    >
      {label != null && (
        <span data-slot="number-field-label" aria-hidden {...(locked ? {} : handlers)}
          className="grid h-full min-w-6 shrink-0 cursor-ew-resize select-none place-items-center pl-1.5 pr-0.5 text-label text-text-tertiary hover:text-text-primary [&_svg]:size-icon-sm in-data-[scrubbing]:text-accent-text">
          {label}
        </span>
      )}
      <input
        data-slot="number-field-control" inputMode="decimal" aria-invalid={invalid || undefined} disabled={locked}
        placeholder={mixed ? 'Mixed' : undefined}
        value={mixed ? '' : draft}
        onChange={e => { editing.current = true; setDraft(e.target.value); }}
        onKeyDown={keyDown}
        onBlur={e => { onBlur?.(e); if (editing.current) commit(draft); editing.current = false; }}
        className={cn('h-full w-full min-w-0 flex-1 border-0 bg-transparent px-1 text-footnote tabular-nums text-text-primary outline-none placeholder:italic placeholder:text-text-secondary disabled:text-text-disabled', className)}
        {...props}
      />
      {unit != null && <span data-slot="number-field-unit" className="shrink-0 pr-2 text-hint text-text-tertiary">{unit}</span>}
      {trailing != null && <span data-slot="number-field-trailing" className="mr-0.5 inline-grid size-control-xs shrink-0 place-items-center rounded-sm text-text-tertiary [&_svg]:size-icon-sm">{trailing}</span>}
      {locked && <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] outline-1 -outline-offset-1 outline-dashed outline-border-control" />}
    </div>
  );
}
