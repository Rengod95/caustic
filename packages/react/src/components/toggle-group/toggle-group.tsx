'use client';
import * as G from '@radix-ui/react-toggle-group';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { toggleGroupItem, toggleGroupVariants, type ToggleGroupVariantProps } from './toggle-group.variants.ts';

type Common = Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'dir'> & ToggleGroupVariantProps;

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

/** A row of icon toggles in an inset track. Compose with ToggleGroupItem. */
export function ToggleGroup({ type = 'multiple', value, defaultValue, onValueChange, appearance, orientation = 'horizontal', disabled, className, children, ...props }: ToggleGroupProps) {
  const [current, setCurrent] = useControllableState<string | string[]>({
    value, defaultValue: defaultValue ?? (type === 'single' ? '' : []), onChange: onValueChange,
  });
  const root = cn(toggleGroupVariants({ appearance, orientation }), className);
  const common = { 'data-appearance': appearance ?? 'filled', orientation, disabled, className: root, ...props };
  if (type === 'single') {
    // Radix lets the on item turn off (value ''); a single group keeps one item on.
    return <G.Root data-slot="toggle-group" role="group" type="single" value={current as string} onValueChange={(v: string) => { if (v !== '') setCurrent(v); }} {...common}>{children}</G.Root>;
  }
  return <G.Root data-slot="toggle-group" role="group" type="multiple" value={current as string[]} onValueChange={(v: string[]) => setCurrent(v)} {...common}>{children}</G.Root>;
}

export interface ToggleGroupItemProps extends ComponentProps<typeof G.Item> {
  /** lucide icon, 14px. */
  icon?: ReactNode;
}

export function ToggleGroupItem({ icon, className, children, ...props }: ToggleGroupItemProps) {
  return (
    <G.Item data-slot="toggle-group-item" className={cn(toggleGroupItem(), className)} {...props}>
      {icon != null && <span data-slot="toggle-group-icon" className="inline-grid size-icon-sm place-items-center [&_svg]:size-icon-sm [&_svg]:stroke-[1.75]">{icon}</span>}
      {children}
    </G.Item>
  );
}
