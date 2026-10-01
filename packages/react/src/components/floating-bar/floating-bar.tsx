'use client';
import { createContext, useContext, useEffect, useRef, type ComponentProps, type FocusEvent, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { floatingBarIconVariants, floatingBarItemVariants, floatingBarVariants } from './floating-bar.variants.ts';

type Size = 'lg' | 'md' | 'sm';
const SizeContext = createContext<Size>('lg');

const FOCUSABLE = 'button:not(:disabled)';

export interface FloatingBarProps extends Omit<ComponentProps<'div'>, 'aria-label'> {
  /** Accessible name of the toolbar. */
  label: string;
  /** Item size 34, 30, 28; capsule padding 4, 4, 3. */
  size?: Size;
  /** Arrow-key axis. */
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
}

/** A capsule toolbar floating on glass over the canvas. Compose with FloatingBarGroup, FloatingBarItem and FloatingBarSeparator. */
export function FloatingBar({ label, size = 'lg', orientation = 'horizontal', className, children, onKeyDown, onFocus, ...props }: FloatingBarProps) {
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
      <div
        ref={ref}
        data-slot="floating-bar"
        data-size={size}
        role="toolbar"
        aria-label={label}
        aria-orientation={orientation}
        className={cn(floatingBarVariants({ size }), className)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        {...props}
      >
        {children}
      </div>
    </SizeContext.Provider>
  );
}

export interface FloatingBarGroupProps extends ComponentProps<'span'> {}

/** A run of items. */
export function FloatingBarGroup({ className, ...props }: FloatingBarGroupProps) {
  return <span data-slot="floating-bar-group" role="group" className={cn('inline-flex items-center gap-0.5', className)} {...props} />;
}

export interface FloatingBarItemProps extends Omit<ComponentProps<'button'>, 'children'> {
  /** lucide icon. */
  icon?: ReactNode;
  /** One-letter shortcut hint. */
  shortcut?: string;
  /** The current tool: ink fill. */
  active?: boolean;
  /** A toggle that is on (controlled). */
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** The agent tool: spectrum rim. */
  agent?: boolean;
  disabled?: boolean;
}

/** One tool or toggle. aria-label is required by the toolbar contract. */
export function FloatingBarItem({
  icon, shortcut, active, pressed, defaultPressed, onPressedChange, agent = false, disabled = false, className, onClick, ...props
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
      {shortcut != null && <span data-slot="floating-bar-shortcut" aria-hidden className="pointer-events-none absolute right-0.75 bottom-0.5 font-mono text-mono-micro text-text-disabled">{shortcut}</span>}
    </button>
  );
}

export interface FloatingBarSeparatorProps extends ComponentProps<'span'> {}

/** The 1px vertical divider. */
export function FloatingBarSeparator({ className, ...props }: FloatingBarSeparatorProps) {
  return <span data-slot="floating-bar-separator" role="separator" aria-orientation="vertical" className={cn('mx-1 h-control-2xs w-px shrink-0 bg-border-default', className)} {...props} />;
}
