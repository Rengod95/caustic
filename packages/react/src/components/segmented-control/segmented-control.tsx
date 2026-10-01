'use client';
import * as R from '@radix-ui/react-radio-group';
import { createContext, useContext, useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { segmentedControlVariants, segmentedItemVariants } from './segmented-control.variants.ts';

type Appearance = 'raised' | 'outline' | 'subtle';
type Shape = 'rounded' | 'pill';
type Size = 'xs' | 'md';
type Content = 'label' | 'icon';
type Orientation = 'horizontal' | 'vertical';

interface Ctx { appearance: Appearance; shape: Shape; size: Size; content: Content; orientation: Orientation }
const SegCtx = createContext<Ctx>({ appearance: 'raised', shape: 'rounded', size: 'md', content: 'label', orientation: 'horizontal' });

export interface SegmentedControlProps extends Omit<ComponentProps<typeof R.Root>, 'value' | 'defaultValue' | 'onValueChange' | 'orientation' | 'dir'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: Size;
  appearance?: Appearance;
  shape?: Shape;
  content?: Content;
  orientation?: Orientation;
  disabled?: boolean;
}

/** A radio group drawn as a segmented track. Compose with SegmentedControlItem. */
export function SegmentedControl({
  value, defaultValue = '', onValueChange, onKeyDown, size = 'md', appearance = 'raised', shape = 'rounded', content = 'label',
  orientation = 'horizontal', disabled = false, className, ...props
}: SegmentedControlProps) {
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const ref = useRef<HTMLDivElement>(null);
  // Arrow keys and Home/End select synchronously, so the selection never lags behind roving focus.
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (disabled) return;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step && e.key !== 'Home' && e.key !== 'End') return;
    const items = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? [])];
    if (!items.length) return;
    const i = items.findIndex(el => el === document.activeElement);
    const next = e.key === 'Home' ? items[0] : e.key === 'End' ? items[items.length - 1] : items[(i + (step ?? 0) + items.length) % items.length];
    e.preventDefault();
    next?.focus();
    if (next?.dataset.value !== undefined) setCurrent(next.dataset.value);
  };
  return (
    <SegCtx.Provider value={{ appearance, shape, size, content, orientation }}>
      <R.Root
        ref={ref} onKeyDown={handleKeyDown}
        data-slot="segmented-control" data-size={size} data-appearance={appearance} data-shape={shape} data-content={content}
        value={current} onValueChange={setCurrent} orientation={orientation} disabled={disabled}
        className={cn(segmentedControlVariants({ appearance, shape, size, orientation }), className)}
        {...props}
      />
    </SegCtx.Provider>
  );
}

export interface SegmentedControlItemProps extends Omit<ComponentProps<typeof R.Item>, 'children'> {
  /** Leading lucide icon. */
  icon?: ReactNode;
  /** Trailing count, pushed to the end of a vertical item. */
  count?: ReactNode;
  children?: ReactNode;
}

export function SegmentedControlItem({ icon, count, className, children, ...props }: SegmentedControlItemProps) {
  const ctx = useContext(SegCtx);
  return (
    <R.Item data-slot="segmented-control-item" data-value={props.value} className={cn(segmentedItemVariants(ctx), className)} {...props}>
      {icon != null && <span data-slot="segmented-control-icon" className={cn('inline-grid place-items-center', ctx.orientation === 'vertical' ? 'size-icon-sm' : 'size-icon-md')}>{icon}</span>}
      {children}
      {count != null && <span data-slot="segmented-control-count" className="ml-auto text-hint font-normal text-text-tertiary">{count}</span>}
    </R.Item>
  );
}
