'use client';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { iconButtonIconVariants, iconButtonVariants, type IconButtonVariantProps } from './icon-button.variants.ts';

export interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children'>, IconButtonVariantProps {
  /** Accessible name; rendered as aria-label. */
  label: string;
  /** Controlled on state. Makes the button a toggle (aria-pressed, data-state). */
  pressed?: boolean;
  /** Uncontrolled initial on state. Also makes the button a toggle. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  /** The icon. */
  children: ReactNode;
}

/** Square, frameless icon action. Pair with Tooltip for the name and shortcut. */
export function IconButton({
  label, tone, shape, size, pressed, defaultPressed, onPressedChange, disabled = false, className, children, onClick, ...props
}: IconButtonProps) {
  const toggle = pressed !== undefined || defaultPressed !== undefined;
  const [on, setOn] = useControllableState({ value: pressed, defaultValue: defaultPressed ?? false, onChange: onPressedChange });
  return (
    <button
      type="button"
      data-slot="icon-button"
      data-tone={tone ?? 'ghost'}
      data-size={size ?? 'md'}
      data-state={toggle ? (on ? 'on' : 'off') : undefined}
      aria-label={label}
      aria-pressed={toggle ? on : undefined}
      disabled={disabled}
      className={cn(iconButtonVariants({ tone, shape, size }), className)}
      onClick={(e: MouseEvent<HTMLButtonElement>) => { onClick?.(e); if (toggle) setOn(!on); }}
      {...props}
    >
      <span data-slot="icon-button-icon" aria-hidden className={iconButtonIconVariants({ size, tone })}>{children}</span>
    </button>
  );
}
