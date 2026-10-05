'use client';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { StackRow } from '../stack-row/stack-row.tsx';

export interface EffectItem {
  id: string;
  icon: ReactNode;
  label: ReactNode;
  /** Plain text passed to the labels functions when label is not a string. */
  name?: string | undefined;
  meta?: ReactNode;
  hidden?: boolean;
}

/** Every accessible name; no built-in English. */
export interface EffectsStackLabels {
  /** Names the list ("Effects"). */
  list: string;
  hide: (name: string) => string;
  show: (name: string) => string;
  remove: (name: string) => string;
  moveUp: (name: string) => string;
  moveDown: (name: string) => string;
}

export interface EffectsStackProps extends Omit<ComponentProps<'div'>, 'children' | 'onSelect'> {
  /** The effects, top first. */
  items: EffectItem[];
  /** true disables the actions of every row; a record keyed by effect id disables that row. */
  disabled?: boolean | Record<string, boolean> | undefined;
  /** true reserves every row; a record keyed by effect id reserves that row (actions inert, selecting still works). */
  reserved?: boolean | Record<string, boolean> | undefined;
  /** Every accessible name. */
  labels: EffectsStackLabels;
  /** Shows the move up and move down actions of each row. */
  onMove?: ((change: { id: string; direction: 'up' | 'down' }) => void) | undefined;
  onItemChange?: (change: { id: string; hidden: boolean }) => void;
  onRemove?: (id: string) => void;
  onSelect?: (id: string) => void;
}

const flag = (v: boolean | Record<string, boolean> | undefined, id: string) => (typeof v === 'object' ? v[id] === true : v === true);

/** The list of effects on a layer: one StackRow per effect, actions always visible. */
export function EffectsStack({ items, disabled = false, reserved, labels, onMove, onItemChange, onRemove, onSelect, className, ...props }: EffectsStackProps) {
  return (
    <div data-slot="effects-stack" role="list" aria-label={labels.list} className={cn('flex flex-col gap-3.5', className)} {...props}>
      {items.map((item, index) => {
        const name = item.name ?? (typeof item.label === 'string' ? item.label : '');
        return (
          <StackRow
            key={item.id} data-slot="effects-stack-row" role="listitem"
            lead="icon" actions="always" leading={item.icon} title={item.label} meta={item.meta}
            hidden={item.hidden} disabled={flag(disabled, item.id)} reserved={flag(reserved, item.id)}
            hideLabel={labels.hide(name)} showLabel={labels.show(name)} removeLabel={labels.remove(name)}
            {...(onMove ? {
              moveUpLabel: labels.moveUp(name), moveDownLabel: labels.moveDown(name),
              onMoveUp: () => onMove({ id: item.id, direction: 'up' }), onMoveDown: () => onMove({ id: item.id, direction: 'down' }),
              moveUpDisabled: index === 0, moveDownDisabled: index === items.length - 1,
            } : {})}
            onHiddenChange={hidden => onItemChange?.({ id: item.id, hidden })}
            onRemove={() => onRemove?.(item.id)}
            onClick={(e: MouseEvent<HTMLDivElement>) => { if (!(e.target as HTMLElement).closest('button')) onSelect?.(item.id); }}
          />
        );
      })}
    </div>
  );
}
