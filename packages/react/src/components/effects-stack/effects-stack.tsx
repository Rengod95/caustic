'use client';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { StackRow } from '../stack-row/stack-row.tsx';

export interface EffectItem {
  id: string;
  icon: ReactNode;
  label: ReactNode;
  meta?: ReactNode;
  hidden?: boolean;
}

export interface EffectsStackProps extends Omit<ComponentProps<'div'>, 'children' | 'onSelect'> {
  /** The effects, top first. */
  items: EffectItem[];
  /** Disables the actions. */
  disabled?: boolean;
  onItemChange?: (change: { id: string; hidden: boolean }) => void;
  onRemove?: (id: string) => void;
  onSelect?: (id: string) => void;
}

/** The list of effects on a layer: one StackRow per effect, actions always visible. */
export function EffectsStack({ items, disabled = false, onItemChange, onRemove, onSelect, className, ...props }: EffectsStackProps) {
  return (
    <div data-slot="effects-stack" role="list" aria-label="Effects" className={cn('flex flex-col gap-3.5', className)} {...props}>
      {items.map(item => (
        <StackRow
          key={item.id} data-slot="effects-stack-row" role="listitem"
          lead="icon" actions="always" leading={item.icon} title={item.label} meta={item.meta}
          hidden={item.hidden} disabled={disabled} actionLabel={typeof item.label === 'string' ? item.label.toLowerCase() : undefined}
          onHiddenChange={hidden => onItemChange?.({ id: item.id, hidden })}
          onRemove={() => onRemove?.(item.id)}
          onClick={(e: MouseEvent<HTMLDivElement>) => { if (!(e.target as HTMLElement).closest('button')) onSelect?.(item.id); }}
        />
      ))}
    </div>
  );
}
