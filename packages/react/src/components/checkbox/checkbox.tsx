'use client';
import { Check } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';

export type CheckedState = boolean | 'indeterminate';

export interface CheckboxProps extends Omit<ComponentProps<'button'>, 'onChange' | 'value' | 'defaultValue' | 'checked' | 'defaultChecked'> {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
}

export function Checkbox({ checked, defaultChecked = false, onCheckedChange, disabled, className, onClick, ...props }: CheckboxProps) {
  const [state, setState] = useControllableState<CheckedState>({ value: checked, defaultValue: defaultChecked, onChange: onCheckedChange });
  const on = state === true, mixed = state === 'indeterminate';
  return (
    <button
      type="button"
      role="checkbox"
      data-slot="checkbox"
      data-state={mixed ? 'indeterminate' : on ? 'checked' : 'unchecked'}
      aria-checked={mixed ? 'mixed' : on}
      disabled={disabled}
      className={cn(
        'inline-grid size-check shrink-0 place-items-center rounded-sm bg-surface-base text-accent-on transition-[background-color] duration-120 ease-out',
        'shadow-[inset_0_0_0_1px_var(--cs-color-border-control)] outline-none focus-visible:shadow-focus',
        'data-[state=checked]:bg-accent-solid data-[state=checked]:shadow-none data-[state=indeterminate]:bg-accent-solid data-[state=indeterminate]:shadow-none',
        'disabled:pointer-events-none disabled:opacity-42',
        className,
      )}
      onClick={e => { onClick?.(e); if (!e.defaultPrevented) setState(mixed ? true : !on); }}
      {...props}
    >
      <span data-slot="checkbox-indicator" className="col-start-1 row-start-1 inline-grid place-items-center">
        {on && <Check className="size-icon-sm stroke-3" aria-hidden />}
        {mixed && <span className="h-0.5 w-2 rounded-xs bg-accent-on" />}
      </span>
    </button>
  );
}
