'use client';
import { createContext, useContext, useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';

interface Ctx { value: string; select: (v: string) => void; disabled: boolean }
const RadioCtx = createContext<Ctx | null>(null);

export interface RadioGroupProps extends Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export function RadioGroup({ value, defaultValue = '', onValueChange, disabled = false, orientation = 'vertical', className, children, ...props }: RadioGroupProps) {
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const ref = useRef<HTMLDivElement>(null);
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
    <RadioCtx.Provider value={{ value: current, select: setCurrent, disabled }}>
      <div ref={ref} role="radiogroup" data-slot="radio-group" aria-orientation={orientation} onKeyDown={onKeyDown}
        className={cn('flex', orientation === 'horizontal' ? 'flex-row flex-wrap items-center gap-3' : 'flex-col gap-2', className)} {...props}>
        {children}
      </div>
    </RadioCtx.Provider>
  );
}

export interface RadioGroupItemProps extends Omit<ComponentProps<'button'>, 'value' | 'children'> {
  value: string;
  children?: ReactNode;
}

export function RadioGroupItem({ value, disabled, className, children, ...props }: RadioGroupItemProps) {
  const ctx = useContext(RadioCtx);
  const checked = ctx?.value === value;
  const off = disabled || ctx?.disabled;
  const radio = (
    <button
      type="button" role="radio" data-slot="radio-group-item" data-value={value} data-state={checked ? 'checked' : 'unchecked'}
      aria-checked={checked} tabIndex={checked || (!ctx?.value && !off) ? 0 : -1} disabled={off}
      onClick={() => ctx?.select(value)}
      className={cn(
        'inline-grid size-check shrink-0 place-items-center rounded-full bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-control)]',
        'outline-none focus-visible:shadow-focus data-[state=checked]:bg-accent-solid data-[state=checked]:shadow-none disabled:opacity-42',
        className,
      )}
      {...props}
    >
      {checked && <span data-slot="radio-group-indicator" className="size-radio-dot rounded-full bg-accent-on" />}
    </button>
  );
  if (!children) return radio;
  return <label data-slot="radio-group-label" className="inline-flex items-center gap-2.5 text-ui text-text-primary">{radio}{children}</label>;
}
