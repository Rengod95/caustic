'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { switchThumb, switchVariants, type SwitchVariantProps } from './switch.variants.ts';

export interface SwitchProps extends Omit<ComponentProps<'button'>, 'onChange' | 'value' | 'defaultValue'>, SwitchVariantProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/** iOS proportions: 46 × 28 track, 24 thumb that stretches while pressed. */
export function Switch({ checked, defaultChecked = false, onCheckedChange, size, disabled, className, onClick, ...props }: SwitchProps) {
  const [on, setOn] = useControllableState({ value: checked, defaultValue: defaultChecked, onChange: onCheckedChange });
  const state = on ? 'checked' : 'unchecked';
  return (
    <button
      type="button" role="switch" data-slot="switch" data-state={state} data-size={size ?? 'md'} aria-checked={on} disabled={disabled}
      className={cn(switchVariants({ size }), className)}
      onClick={e => { onClick?.(e); if (!e.defaultPrevented) setOn(!on); }}
      {...props}
    >
      <span data-slot="switch-thumb" data-state={state} className={switchThumb({ size })} />
    </button>
  );
}
