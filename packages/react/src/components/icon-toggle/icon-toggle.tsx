'use client';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { iconToggleVariants } from './icon-toggle.variants.ts';

export interface IconToggleProps extends Omit<ComponentProps<'button'>, 'children'> {
  /** Controlled on state. */
  pressed?: boolean;
  /** Uncontrolled initial state. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  /** The icon. */
  children: ReactNode;
}

/** A quiet icon button that stays on, marked with the accent soft fill. */
export function IconToggle({ pressed, defaultPressed = false, onPressedChange, disabled = false, className, children, onClick, ...props }: IconToggleProps) {
  const [on, setOn] = useControllableState({ value: pressed, defaultValue: defaultPressed, onChange: onPressedChange });
  return (
    <button
      type="button"
      data-slot="icon-toggle"
      data-state={on ? 'on' : 'off'}
      aria-pressed={on}
      disabled={disabled}
      className={cn(iconToggleVariants(), className)}
      onClick={(e: MouseEvent<HTMLButtonElement>) => { onClick?.(e); setOn(!on); }}
      {...props}
    >
      <span data-slot="icon-toggle-icon" aria-hidden className="inline-grid size-icon-sm place-items-center [&_svg]:size-full [&_svg]:stroke-[1.75]">{children}</span>
    </button>
  );
}
