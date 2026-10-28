'use client';
import * as G from '@radix-ui/react-toggle-group';
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Size, Tone } from '../../lib/common-props.ts';
import { defined } from '../../lib/defined.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Tooltip } from '../tooltip/tooltip.tsx';
import { toggleGroupItem, toggleGroupVariants } from './toggle-group.variants.ts';

const ItemCtx = createContext<{ tone?: Tone | undefined; size?: Size | undefined; current?: string | string[] | undefined }>({});

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
  const look = variant ?? (appearance === 'outline' ? 'outline' : 'soft');
  const root = cn(toggleGroupVariants({ variant: look, orientation, radius, shadow }), className);
  const common = { 'data-variant': look, orientation, ...defined({ disabled }), className: root, ...props };
  const items = <ItemCtx.Provider value={{ tone, size, current }}>{children}</ItemCtx.Provider>;
  if (type === 'single') {
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
