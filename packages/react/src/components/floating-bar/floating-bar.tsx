'use client';
import { createContext, useContext, useEffect, useRef, type ComponentProps, type FocusEvent, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { floatingBarGroupVariants, floatingBarIconVariants, floatingBarItemVariants, floatingBarSeparatorVariants, floatingBarShortcutVariants, floatingBarBadgeVariants, floatingBarVariants } from './floating-bar.variants.ts';

const SizeContext = createContext<Size>('lg');
const OrientationContext = createContext<'horizontal' | 'vertical'>('horizontal');

const FOCUSABLE = 'button:not(:disabled)';

export interface FloatingBarProps extends Omit<ComponentProps<'div'>, 'aria-label'> {
  /** Accessible name of the toolbar. */
  label: string;
  /** Item size 34, 30, 28, 24 (lg, md, sm, xs); capsule padding 4, 4, 3, 2. */
  size?: Size | undefined;
  /** Colour family of the capsule material (solid: the tone tint; soft: the soft fill; outline: the edge). */
  tone?: Tone | undefined;
  /** solid (default) = regular glass; soft = soft fill; outline = glass with a 1px edge; ghost = no fill. */
  variant?: Variant | undefined;
  /** Corner radius of the capsule; unset = the toolbar radius. */
  radius?: Radius | 'toolbar' | undefined;
  /** Elevation of the capsule; unset (4) follows the size: 3 at md, 4 otherwise. */
  shadow?: Shadow | undefined;
  /** Layout axis, arrow-key axis and aria-orientation. */
  orientation?: 'horizontal' | 'vertical' | undefined;
  children: ReactNode;
}

/** A capsule toolbar floating on glass over the canvas. Compose with FloatingBarGroup, FloatingBarItem and FloatingBarSeparator. */
export function FloatingBar({ label, size = 'lg', orientation = 'horizontal', tone, variant, radius, shadow, className, children, onKeyDown, onFocus, ...props }: FloatingBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const stop = useRef<HTMLElement | null>(null);

  const sync = () => {
    const items = Array.from(ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (!stop.current || !items.includes(stop.current)) stop.current = items[0] ?? null;
    items.forEach(i => i.setAttribute('tabindex', i === stop.current ? '0' : '-1'));
  };
  useEffect(sync);

  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    onFocus?.(e);
    const t = e.target as HTMLElement;
    if (t.matches(FOCUSABLE)) { stop.current = t; sync(); }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const next = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const prev = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    if (![next, prev, 'Home', 'End'].includes(e.key)) return;
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE));
    const at = items.indexOf(document.activeElement as HTMLElement);
    if (at < 0) return;
    e.preventDefault();
    const to = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (at + (e.key === next ? 1 : -1) + items.length) % items.length;
    items[to]?.focus();
  };

  return (
    <SizeContext.Provider value={size}>
      <OrientationContext.Provider value={orientation}>
      <div
        ref={ref}
        data-slot="floating-bar"
        data-size={size}
        role="toolbar"
        aria-label={label}
        aria-orientation={orientation}
        className={cn(floatingBarVariants({ size, orientation, tone, variant, radius, shadow }), className)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        {...props}
      >
        {children}
      </div>
      </OrientationContext.Provider>
    </SizeContext.Provider>
  );
}

export interface FloatingBarGroupProps extends ComponentProps<'span'> {}

/** A run of items. */
export function FloatingBarGroup({ className, ...props }: FloatingBarGroupProps) {
  const orientation = useContext(OrientationContext);
  return <span data-slot="floating-bar-group" role="group" className={cn(floatingBarGroupVariants({ orientation }), className)} {...props} />;
}

export interface FloatingBarItemProps extends Omit<ComponentProps<'button'>, 'children'> {
  /** lucide icon. */
  icon?: ReactNode | undefined;
  /** One-letter shortcut hint. */
  shortcut?: string | undefined;
  /** The current tool: inverted, ink fill and paper icon (same look as a pressed toggle). */
  active?: boolean | undefined;
  /** A toggle that is on (controlled). */
  pressed?: boolean | undefined;
  defaultPressed?: boolean | undefined;
  onPressedChange?: ((pressed: boolean) => void) | undefined;
  /** The agent tool: spectrum rim. */
  agent?: boolean | undefined;
  /** Small count on the item's top end corner (pending requests). Decorative: put the number in aria-label as well. */
  badge?: ReactNode | undefined;
  disabled?: boolean | undefined;
}

/** One tool or toggle. aria-label is required by the toolbar contract. */
export function FloatingBarItem({
  icon, shortcut, active, pressed, defaultPressed, onPressedChange, agent = false, badge, disabled = false, className, onClick, ...props
}: FloatingBarItemProps) {
  const size = useContext(SizeContext);
  const toggle = pressed !== undefined || defaultPressed !== undefined;
  const [on, setOn] = useControllableState({ value: pressed, defaultValue: defaultPressed ?? false, onChange: onPressedChange });
  const marked = active !== undefined ? active : toggle ? on : undefined;
  return (
    <button
      type="button"
      data-slot="floating-bar-item"
      data-active={active ? true : undefined}
      data-pressed={toggle && on ? true : undefined}
      data-agent={agent ? true : undefined}
      aria-pressed={marked}
      disabled={disabled}
      className={cn(floatingBarItemVariants({ size }), className)}
      onClick={(e: MouseEvent<HTMLButtonElement>) => { onClick?.(e); if (toggle) setOn(!on); }}
      {...props}
    >
      {icon != null && <span data-slot="floating-bar-icon" aria-hidden className={floatingBarIconVariants({ size })}>{icon}</span>}
      {shortcut != null && <span data-slot="floating-bar-shortcut" aria-hidden className={floatingBarShortcutVariants({ disabled })}>{shortcut}</span>}
      {badge != null && <span data-slot="floating-bar-badge" aria-hidden className={floatingBarBadgeVariants()}>{badge}</span>}
    </button>
  );
}

export interface FloatingBarSeparatorProps extends ComponentProps<'span'> {}

/** The hairline divider, perpendicular to the bar. */
export function FloatingBarSeparator({ className, ...props }: FloatingBarSeparatorProps) {
  const orientation = useContext(OrientationContext);
  return <span data-slot="floating-bar-separator" role="separator" aria-orientation={orientation === 'vertical' ? 'horizontal' : 'vertical'} className={cn(floatingBarSeparatorVariants({ orientation }), className)} {...props} />;
}
