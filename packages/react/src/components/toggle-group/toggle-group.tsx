'use client';
import * as G from '@radix-ui/react-toggle-group';
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Size, Tone } from '../../lib/common-props.ts';
import { defined } from '../../lib/defined.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useIndicator } from '../../hooks/use-indicator.ts';
import { Tooltip } from '../tooltip/tooltip.tsx';
import { toggleGroupItem, toggleGroupThumb, toggleGroupVariants } from './toggle-group.variants.ts';

const ItemCtx = createContext<{ tone?: Tone | undefined; size?: Size | undefined; current?: string | string[] | undefined }>({});

/** The snappy duration in ms (--cs-duration-snappy, read from the stylesheet; 210 when none defines it). */
function snappyMs(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--cs-duration-snappy').trim();
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? (raw.endsWith('ms') ? value : raw.endsWith('s') ? value * 1000 : value) : 210;
}

type Common = Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'dir'> & CommonProps & {
  /** @deprecated use variant: filled = soft, outline = outline. */
  appearance?: 'filled' | 'outline' | undefined;
};

export type ToggleGroupProps = Common & {
  /** single keeps exactly one item on (never deselects); multiple lets any combination be on. */
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
};

/** A row of icon toggles in an inset track. Compose with ToggleGroupItem. It holds state only; a row of plain actions is a ButtonGroup. */
export function ToggleGroup({
  type = 'multiple', value, defaultValue, onValueChange, tone, variant, radius, shadow, size, appearance, orientation = 'horizontal', disabled, className, children, ...props
}: ToggleGroupProps) {
  const [current, setCurrent] = useControllableState<string | string[]>({
    value, defaultValue: defaultValue ?? (type === 'single' ? '' : []), onChange: onValueChange,
  });
  const ref = useRef<HTMLDivElement>(null);
  const single = type === 'single';
  // Single groups only: the on item's box, where the thumb is drawn once measured; null until then.
  const box = useIndicator(ref, '[data-slot="toggle-group-item"]', '[data-slot="toggle-group-item"][data-state="on"]', current);
  // A pointer press flags the next change as a pointer move, which slides the thumb (data-moving on the group). A keyboard
  // press (arrows only move focus here; Space and Enter toggle) clears the flag. Multiple groups have no thumb: no moves.
  const pointer = useRef(false);
  const [moves, setMoves] = useState(0);
  useLayoutEffect(() => {
    if (!pointer.current) return;
    pointer.current = false;
    if (single) setMoves(n => n + 1);
  }, [current, single]);
  // Each pointer move re-arms the guard: the thumb is done after its translate transition, or after snappy + 50 ms.
  useEffect(() => {
    if (!moves) return;
    const timer = window.setTimeout(() => setMoves(0), snappyMs() + 50);
    return () => window.clearTimeout(timer);
  }, [moves]);
  const look = variant ?? (appearance === 'outline' ? 'outline' : 'soft');
  const root = cn(toggleGroupVariants({ variant: look, orientation, radius, shadow }), className);
  const common = {
    'data-variant': look, orientation, ...defined({ disabled }), className: root, ref,
    onPointerDownCapture: () => { pointer.current = true; }, onKeyDownCapture: () => { pointer.current = false; },
    'data-moving': moves ? '' : undefined, ...props,
  };
  const thumb = single && box && (
    <span
      aria-hidden
      onTransitionEnd={e => { if (e.target === e.currentTarget && e.propertyName === 'translate') setMoves(0); }}
      className={toggleGroupThumb()}
      style={{ '--thumb-x': `${box.x}px`, '--thumb-y': `${box.y}px`, '--thumb-w': `${box.w}px`, '--thumb-h': `${box.h}px`, '--thumb-r': box.r } as CSSProperties}
    />
  );
  const items = <ItemCtx.Provider value={{ tone, size, current }}>{thumb}{children}</ItemCtx.Provider>;
  if (single) {
    // Radix lets the on item turn off (value ''); a single group keeps one item on.
    return <G.Root data-slot="toggle-group" role="group" type="single" value={current as string} onValueChange={(v: string) => { if (v !== '') setCurrent(v); }} {...common}>{items}</G.Root>;
  }
  return <G.Root data-slot="toggle-group" role="group" type="multiple" value={current as string[]} onValueChange={(v: string[]) => setCurrent(v)} {...common}>{items}</G.Root>;
}

export interface ToggleGroupItemProps extends ComponentProps<typeof G.Item> {
  /** lucide icon, 14px. */
  icon?: ReactNode;
  /** Name of an icon-only item: rendered as aria-label and shown in a Tooltip on hover and focus. */
  label?: string;
}

export function ToggleGroupItem({ icon, label, value, className, children, ...props }: ToggleGroupItemProps) {
  const look = useContext(ItemCtx);
  const on = Array.isArray(look.current) ? look.current.includes(value) : look.current === value;
  const item = (
    <G.Item
      data-slot="toggle-group-item"
      value={value}
      // Stated here as well as by Radix: a Tooltip trigger would otherwise write its own data-state (closed / open) onto the item.
      data-state={on ? 'on' : 'off'}
      {...(label !== undefined ? { 'aria-label': label } : {})}
      className={cn(toggleGroupItem({ tone: look.tone, size: look.size }), className)}
      {...props}
    >
      {icon != null && <span data-slot="toggle-group-icon" aria-hidden className="inline-grid size-icon-sm place-items-center [&_svg]:size-icon-sm [&_svg]:stroke-[1.75]">{icon}</span>}
      {children}
    </G.Item>
  );
  return label !== undefined ? <Tooltip content={label}>{item}</Tooltip> : item;
}
