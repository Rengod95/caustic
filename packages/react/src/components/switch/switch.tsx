'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { switchThumb, switchVariants } from './switch.variants.ts';

export interface SwitchProps extends Omit<ComponentProps<'button'>, 'onChange' | 'value' | 'defaultValue'>, CommonProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/** iOS 26 proportions: 64 × 28 track and a 40 × 24 capsule thumb that widens while pressed. */
export function Switch({ checked, defaultChecked = false, onCheckedChange, tone, variant, radius, shadow, size, disabled, className, onClick, ...props }: SwitchProps) {
  const [on, setOn] = useControllableState({ value: checked, defaultValue: defaultChecked, onChange: onCheckedChange });
  const state = on ? 'checked' : 'unchecked';
  return (
    <button
      type="button" role="switch" data-slot="switch" data-state={state} data-size={size ?? 'md'} aria-checked={on} disabled={disabled}
      className={cn(switchVariants({ tone, variant, size, radius, shadow }), className)}
      onClick={e => { onClick?.(e); if (!e.defaultPrevented) setOn(!on); }}
      {...props}
    >
      <span data-slot="switch-thumb" data-state={state} className={switchThumb({ variant, size })} />
    </button>
  );
}
