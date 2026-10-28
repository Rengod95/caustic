'use client';
import { Check } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { checkboxMarkVariants, checkboxShapeVariants, checkboxVariants } from './checkbox.variants.ts';

export type CheckedState = boolean | 'indeterminate';

export interface CheckboxProps extends Omit<ComponentProps<'button'>, 'onChange' | 'value' | 'defaultValue' | 'checked' | 'defaultChecked'>, CommonProps {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
  /** Danger border-strong edge (shown together with the focus ring); sets aria-invalid. */
  invalid?: boolean;
}

export function Checkbox({
  checked, defaultChecked = false, onCheckedChange, invalid = false, tone, variant, radius, shadow, size, disabled, className, onClick, ...props
}: CheckboxProps) {
  const [state, setState] = useControllableState<CheckedState>({ value: checked, defaultValue: defaultChecked, onChange: onCheckedChange });
  const on = state === true, mixed = state === 'indeterminate';
  return (
    <button
      type="button"
      role="checkbox"
      data-slot="checkbox"
      data-state={mixed ? 'indeterminate' : on ? 'checked' : 'unchecked'}
      aria-checked={mixed ? 'mixed' : on}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      className={cn(checkboxVariants({ tone, variant, size }), checkboxShapeVariants({ radius, shadow }), className)}
      onClick={e => { onClick?.(e); if (!e.defaultPrevented) setState(mixed ? true : !on); }}
      {...props}
    >
      <span data-slot="checkbox-indicator" aria-hidden className="col-start-1 row-start-1 inline-grid place-items-center">
        {on && <Check className={cn(checkboxMarkVariants({ size }))} />}
        {mixed && <span className="h-0.5 w-2 rounded-xs bg-current" />}
      </span>
    </button>
  );
}
