'use client';
import * as R from '@radix-ui/react-radio-group';
import { createContext, useContext, useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import type { CommonProps, Radius, Size, Tone, Variant } from '../../lib/common-props.ts';
import { segmentedControlVariants, segmentedItemVariants } from './segmented-control.variants.ts';

type Appearance = 'raised' | 'outline' | 'subtle';
type Shape = 'rounded' | 'pill';
type Content = 'label' | 'icon';
type Orientation = 'horizontal' | 'vertical';

/** The deprecated appearance names, mapped onto variant. */
const APPEARANCE_VARIANT: Record<Appearance, Variant> = { raised: 'solid', outline: 'outline', subtle: 'ghost' };

interface Ctx { variant: Variant; tone: Tone; radius: Radius | undefined; size: Size; content: Content; orientation: Orientation }
const SegCtx = createContext<Ctx>({ variant: 'solid', tone: 'neutral', radius: undefined, size: 'md', content: 'label', orientation: 'horizontal' });

export interface SegmentedControlProps extends Omit<ComponentProps<typeof R.Root>, 'value' | 'defaultValue' | 'onValueChange' | 'orientation' | 'dir'>, CommonProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** @deprecated use variant (raised = solid, outline = outline, subtle = ghost). */
  appearance?: Appearance;
  /** @deprecated use radius (pill = radius full). */
  shape?: Shape;
  content?: Content;
  orientation?: Orientation;
  disabled?: boolean;
}

/** A radio group drawn as a segmented track. Compose with SegmentedControlItem. */
export function SegmentedControl({
  value, defaultValue = '', onValueChange, onKeyDown, size = 'md', variant: variantProp, tone = 'neutral', radius: radiusProp, shadow,
  appearance, shape, content = 'label', orientation = 'horizontal', disabled = false, className, ...props
}: SegmentedControlProps) {
  const variant = variantProp ?? (appearance ? APPEARANCE_VARIANT[appearance] : 'solid');
  const radius = radiusProp ?? (shape === 'pill' ? 'full' : undefined);
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
    <SegCtx.Provider value={{ variant, tone, radius, size, content, orientation }}>
      <R.Root
        ref={ref} onKeyDown={handleKeyDown}
        data-slot="segmented-control" data-size={size} data-variant={variant} data-tone={tone} data-content={content}
        value={current} onValueChange={setCurrent} orientation={orientation} disabled={disabled}
        className={cn(segmentedControlVariants({ variant, tone, size, orientation, radius: radius ?? null, shadow: shadow ?? null }), className)}
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
    <R.Item data-slot="segmented-control-item" data-value={props.value} className={cn(segmentedItemVariants({ ...ctx, radius: ctx.radius ?? null }), className)} {...props}>
      {icon != null && <span data-slot="segmented-control-icon" aria-hidden className={cn('inline-grid place-items-center', ctx.orientation === 'vertical' ? 'size-icon-sm' : 'size-icon-md')}>{icon}</span>}
      {children}
      {count != null && <span data-slot="segmented-control-count" className="ml-auto text-hint font-normal text-text-tertiary">{count}</span>}
    </R.Item>
  );
}
