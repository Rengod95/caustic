'use client';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Tone } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { iconButtonFrameVariants, iconButtonIconVariants, iconButtonToggleVariants, iconButtonVariants } from './icon-button.variants.ts';

export interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children'>, Omit<CommonProps, 'tone'> {
  /** Accessible name; rendered as aria-label. */
  label: string;
  /**
   * Colour family of the emphasis (common prop).
   * The values "ghost" and "ink" are deprecated: use variant="ghost" and variant="solid" (neutral solid is the ink action).
   */
  tone?: Tone | 'ghost' | 'ink';
  /** @deprecated use radius="full" (circle) or leave radius unset (rounded). */
  shape?: 'rounded' | 'circle';
  /** Controlled on state. Makes the button a toggle (aria-pressed, data-state). */
  pressed?: boolean;
  /** Uncontrolled initial on state. Also makes the button a toggle. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  /** The icon. */
  children: ReactNode;
}

/**
 * Square, frameless icon action. Pair with Tooltip for the name and shortcut. With pressed / defaultPressed it is a toggle
 * (aria-pressed): a ghost toggle rests on the neutral well and inverts when on (the former IconToggle). A toggle defaults to
 * sm (28px, 16px icon, md radius; owner 2026-10-28, icon-toggle proposal 2); a plain IconButton keeps md. Dense inspector
 * rows pass size="xs".
 */
export function IconButton({
  label, tone: toneProp, variant: variantProp, radius: radiusProp, shadow, shape, size, pressed, defaultPressed, onPressedChange, disabled = false, className, children, onClick, ...props
}: IconButtonProps) {
  const toggle = pressed !== undefined || defaultPressed !== undefined;
  const [on, setOn] = useControllableState({ value: pressed, defaultValue: defaultPressed ?? false, onChange: onPressedChange });
  // Deprecated aliases: tone ghost / ink → variant ghost / solid; shape circle → radius full.
  const legacy = toneProp === 'ghost' || toneProp === 'ink' ? toneProp : undefined;
  const tone = legacy ? undefined : (toneProp as Tone | undefined);
  const variant = variantProp ?? (legacy === 'ink' ? 'solid' : legacy);
  const radius = radiusProp ?? (shape === 'circle' ? 'full' : undefined);
  const sized = size ?? (toggle ? 'sm' : undefined);
  return (
    <button
      type="button"
      data-slot="icon-button"
      data-tone={tone ?? 'neutral'}
      data-variant={variant ?? 'ghost'}
      data-size={sized ?? 'md'}
      data-state={toggle ? (on ? 'on' : 'off') : undefined}
      aria-label={label}
      aria-pressed={toggle ? on : undefined}
      disabled={disabled}
      className={cn(iconButtonVariants({ tone, variant, size: sized }), toggle && iconButtonToggleVariants({ variant }), iconButtonFrameVariants({ radius, shadow }), className)}
      onClick={(e: MouseEvent<HTMLButtonElement>) => { onClick?.(e); if (toggle) setOn(!on); }}
      {...props}
    >
      <span data-slot="icon-button-icon" aria-hidden className={iconButtonIconVariants({ size: sized, variant })}>{children}</span>
    </button>
  );
}
