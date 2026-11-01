'use client';
import { createContext, useContext, useLayoutEffect, useRef, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { radioGroupVariants, radioIndicatorVariants, radioItemVariants, radioLabelVariants, radioNameVariants } from './radio-group.variants.ts';

/** stop: value of the one item in the Tab order (the checked enabled item, else the first enabled one); undefined before layout. */
interface Ctx extends CommonProps { value: string; select: (v: string) => void; disabled: boolean; stop: string | null | undefined }
const RadioCtx = createContext<Ctx | null>(null);

/** The five common props apply to every item: tone / variant colour the checked circle, radius / shadow / size shape it. */
export interface RadioGroupProps extends Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue'>, CommonProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export function RadioGroup({ value, defaultValue = '', onValueChange, disabled = false, orientation = 'vertical', tone, variant, radius, shadow, size, className, children, ...props }: RadioGroupProps) {
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const ref = useRef<HTMLDivElement>(null);
  // One Tab stop (WAI-ARIA radio group, owner 2026-10-28 proposal C): the checked enabled item, or the first enabled item
  // while nothing is checked. Read from the DOM after every render so it follows items being added, removed or disabled.
  const [stop, setStop] = useState<string | null | undefined>(undefined);
  useLayoutEffect(() => {
    const items = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? [])];
    const next = (items.find(el => el.dataset.value === current) ?? items[0])?.dataset.value ?? null;
    if (next !== stop) setStop(next);
  });
  // Arrow keys move selection between items (roving tabindex).
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = orientation === 'horizontal' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
    const alt = orientation === 'horizontal' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
    const dir = [keys[0], alt[0]].includes(e.key) ? -1 : [keys[1], alt[1]].includes(e.key) ? 1 : 0;
    if (!dir) return;
    e.preventDefault();
    const items = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? [])];
    const i = items.findIndex(el => el === document.activeElement);
    const next = items[(i + dir + items.length) % items.length];
    next?.focus(); if (next?.dataset.value) setCurrent(next.dataset.value);
  };
  return (
    <RadioCtx.Provider value={{ value: current, select: setCurrent, disabled, stop, tone, variant, radius, shadow, size }}>
      <div ref={ref} role="radiogroup" data-slot="radio-group" aria-orientation={orientation} aria-disabled={disabled || undefined} onKeyDown={onKeyDown}
        className={cn(radioGroupVariants({ orientation, size }), className)} {...props}>
        {children}
      </div>
    </RadioCtx.Provider>
  );
}

export interface RadioGroupItemProps extends Omit<ComponentProps<'button'>, 'value' | 'children'> {
  value: string;
  children?: ReactNode;
  /** Quiet second line under the label; the circle aligns to the first line and the label wraps over several lines. */
  description?: ReactNode;
}

export function RadioGroupItem({ value, disabled, className, children, description, ...props }: RadioGroupItemProps) {
  const ctx = useContext(RadioCtx);
  const checked = ctx?.value === value;
  const off = disabled || ctx?.disabled;
  // Before the group has measured (server render, first pass) fall back to the checked item, else every enabled item.
  const tabStop = ctx?.stop !== undefined ? ctx.stop === value && !off : checked || (!ctx?.value && !off);
  const radio = (
    <button
      type="button" role="radio" data-slot="radio-group-item" data-value={value} data-state={checked ? 'checked' : 'unchecked'}
      aria-checked={checked} tabIndex={tabStop ? 0 : -1} disabled={off}
      onClick={() => ctx?.select(value)}
      className={cn(radioItemVariants({ tone: ctx?.tone, variant: ctx?.variant, size: ctx?.size, radius: ctx?.radius ?? null, shadow: ctx?.shadow ?? null }), className)}
      {...props}
    >
      {checked && <span data-slot="radio-group-indicator" aria-hidden className={radioIndicatorVariants({ size: ctx?.size })} />}
    </button>
  );
  if (!children) return radio;
  if (description == null) return <label data-slot="radio-group-label" className={radioLabelVariants({ size: ctx?.size })}>{radio}{children}</label>;
  return (
    <label data-slot="radio-group-label" data-checked={checked || undefined} className={radioLabelVariants({ size: ctx?.size, multiline: true })}>
      {radio}
      <span data-slot="radio-group-text" className="grid min-w-0 gap-0.5">
        <span data-slot="radio-group-name" className={radioNameVariants({ checked })}>{children}</span>
        <span data-slot="radio-group-description" className="text-hint text-text-tertiary has-disabled:text-disabled-text">{description}</span>
      </span>
    </label>
  );
}
