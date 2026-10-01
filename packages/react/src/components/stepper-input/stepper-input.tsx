'use client';
import { Minus, Plus } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentProps, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFieldContext } from '../field/field-context.ts';

export interface StepperInputProps extends Omit<ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange' | 'size' | 'min' | 'max' | 'step' | 'type'> {
  value?: number | null;
  defaultValue?: number | null;
  /** Step for the buttons and the arrow keys. */
  step?: number;
  min?: number;
  max?: number;
  invalid?: boolean;
  /** Called when a button, arrow key or committed edit changes the value. */
  onValueChange?: (value: number) => void;
  /** Class names for the outer container. */
  containerClassName?: string;
}

const clamp = (v: number, min = -Infinity, max = Infinity) => Math.min(max, Math.max(min, v));
const round = (v: number) => Math.round(v * 1000) / 1000;
const show = (v: number | null) => (v === null ? '' : String(v));
const button = 'grid h-full w-10 shrink-0 place-items-center text-text-secondary transition-[background-color,color] duration-120 ease-out hover:bg-fill-hover hover:text-text-primary disabled:pointer-events-none disabled:text-text-disabled [&_svg]:size-icon-sm [&_svg]:stroke-[1.75]';

/** Form quantity input: − and + around a centred number. Arrow keys step, Enter commits a typed value. */
export function StepperInput({ value, defaultValue = null, step = 1, min, max, invalid, disabled, id, onValueChange, onKeyDown, onBlur, className, containerClassName, ...props }: StepperInputProps) {
  const field = useFieldContext();
  const [current, setCurrent] = useControllableState<number | null>({ value, defaultValue, onChange: v => { if (v !== null) onValueChange?.(v); } });
  const [draft, setDraft] = useState(show(current));
  const editing = useRef(false);
  useEffect(() => { if (!editing.current) setDraft(show(current)); }, [current]);
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isDisabled = disabled ?? field?.disabled ?? false;
  const stepBy = (dir: 1 | -1) => { editing.current = false; setCurrent(clamp(round((current ?? min ?? 0) + dir * step), min, max)); };
  const commit = (raw: string) => {
    editing.current = false;
    const n = Number(raw);
    if (raw.trim() !== '' && Number.isFinite(n)) { const next = clamp(n, min, max); setCurrent(next); setDraft(String(next)); } else setDraft(show(current));
  };
  const keyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); stepBy(e.key === 'ArrowUp' ? 1 : -1); }
    if (e.key === 'Enter') { e.preventDefault(); commit(draft); }
  };
  return (
    <div
      role="group"
      data-slot="stepper-input"
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
      className={cn(
        'frost inline-flex h-field-md items-stretch overflow-hidden rounded-xl bg-surface-translucent text-ui transition-[box-shadow] duration-120 ease-out',
        'shadow-[inset_0_0_0_1px_var(--cs-color-border-default),var(--cs-elevation-1)]',
        'focus-within:shadow-[var(--cs-focus-field),var(--cs-elevation-1)]',
        'data-[invalid]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-solid)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-solid)]',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-42',
        containerClassName,
      )}
    >
      <button type="button" tabIndex={-1} data-slot="stepper-input-decrement" aria-label="Decrease" disabled={isDisabled || (min !== undefined && current !== null && current <= min)} className={button} onClick={() => stepBy(-1)}><Minus /></button>
      <input
        data-slot="stepper-input-control"
        role="spinbutton"
        inputMode="numeric"
        id={id ?? field?.id}
        aria-valuenow={current ?? undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-invalid={isInvalid || undefined}
        aria-describedby={field?.describedBy}
        aria-required={field?.required || undefined}
        disabled={isDisabled}
        className={cn('h-full w-16 min-w-0 border-0 border-x border-border-subtle bg-transparent text-center tabular-nums text-text-primary outline-none', className)}
        {...props}
        value={draft}
        onChange={e => { editing.current = true; setDraft(e.target.value); }}
        onKeyDown={keyDown}
        onBlur={e => { onBlur?.(e); if (editing.current) commit(draft); }}
      />
      <button type="button" tabIndex={-1} data-slot="stepper-input-increment" aria-label="Increase" disabled={isDisabled || (max !== undefined && current !== null && current >= max)} className={button} onClick={() => stepBy(1)}><Plus /></button>
    </div>
  );
}
