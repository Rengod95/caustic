'use client';
import * as T from '@radix-ui/react-tabs';
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Radius, Shadow, Size, Tone } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useIndicator } from '../../hooks/use-indicator.ts';
import { tabsCountVariants, tabsIndicatorVariants, tabsListVariants, tabsThumbVariants, tabsTriggerVariants, tabsVariants, type TabsVariant } from './tabs.variants.ts';

interface Ctx { disabled: boolean; tone?: Tone | undefined; variant?: TabsVariant | undefined; radius?: Radius | undefined; shadow?: Shadow | undefined; size?: Size | undefined; value?: string | undefined }
const TabsCtx = createContext<Ctx>({ disabled: false });

/** The snappy duration in ms (--cs-duration-snappy, read from the stylesheet; 210 when none defines it). */
function snappyMs(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--cs-duration-snappy').trim();
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? (raw.endsWith('ms') ? value : raw.endsWith('s') ? value * 1000 : value) : 210;
}

export interface TabsProps extends Omit<ComponentProps<typeof T.Root>, 'value' | 'defaultValue' | 'onValueChange' | 'dir'>, Omit<CommonProps, 'variant'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Disables every trigger. */
  disabled?: boolean;
  /** underline (default): text tabs on a hairline; solid, soft, outline, ghost: pill tabs. */
  variant?: TabsVariant;
}

/** Underlined text tabs (or pill tabs, see variant). Compose with TabsList, TabsTrigger and TabsContent. */
export function Tabs({ value, defaultValue = '', onValueChange, disabled = false, tone, variant, radius, shadow, size, className, ...props }: TabsProps) {
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });
  return (
    <TabsCtx.Provider value={{ disabled, tone, variant, radius, shadow, size, value: current }}>
      <T.Root data-slot="tabs" data-variant={variant ?? 'underline'} value={current} onValueChange={setCurrent} className={cn(tabsVariants({ tone }), className)} {...props} />
    </TabsCtx.Provider>
  );
}

export function TabsList({ className, children, ...props }: ComponentProps<typeof T.List>) {
  const ctx = useContext(TabsCtx);
  const ref = useRef<HTMLDivElement>(null);
  const variant = ctx.variant ?? 'underline';
  // The selected tab's box. The thumb is drawn in the list under the triggers once measured; null until then.
  const box = useIndicator(ref, '[role="tab"]', '[role="tab"][data-state="active"]', ctx.value);
  // A pointer press flags the next selection as a pointer move, which slides the thumb (data-moving on the list). A keyboard
  // press clears the flag. Ghost tabs have no fill to slide, so they never move.
  const pointer = useRef(false);
  const [moves, setMoves] = useState(0);
  useLayoutEffect(() => {
    if (!pointer.current) return;
    pointer.current = false;
    if (variant !== 'ghost') setMoves(n => n + 1);
  }, [ctx.value, variant]);
  // Each pointer move re-arms the guard: the thumb is done after its translate transition, or after snappy + 50 ms.
  useEffect(() => {
    if (!moves) return;
    const timer = window.setTimeout(() => setMoves(0), snappyMs() + 50);
    return () => window.clearTimeout(timer);
  }, [moves]);
  return (
    <T.List
      ref={ref}
      onPointerDownCapture={() => { pointer.current = true; }} onKeyDownCapture={() => { pointer.current = false; }}
      data-slot="tabs-list" data-moving={moves ? '' : undefined}
      className={cn(tabsListVariants({ variant: ctx.variant, shadow: ctx.shadow }), className)} {...props}
    >
      {box && variant !== 'ghost' && (
        <span
          aria-hidden
          onTransitionEnd={e => { if (e.target === e.currentTarget && e.propertyName === 'translate') setMoves(0); }}
          className={tabsThumbVariants({ look: variant, tone: ctx.tone })}
          style={{ '--thumb-x': `${box.x}px`, '--thumb-y': `${box.y}px`, '--thumb-w': `${box.w}px`, '--thumb-h': `${box.h}px`, '--thumb-r': box.r } as CSSProperties}
        />
      )}
      {children}
    </T.List>
  );
}

export interface TabsTriggerProps extends ComponentProps<typeof T.Trigger> {
  /** Small tabular count after the label, in a neutral.track pill. */
  count?: ReactNode;
}

export function TabsTrigger({ count, disabled, className, children, ...props }: TabsTriggerProps) {
  const ctx = useContext(TabsCtx);
  return (
    <T.Trigger
      data-slot="tabs-trigger" disabled={disabled || ctx.disabled}
      className={cn(tabsTriggerVariants({ variant: ctx.variant, tone: ctx.tone, size: ctx.size, radius: ctx.radius }), className)}
      {...props}
    >
      {children}
      {count != null && <span data-slot="tabs-count" className={tabsCountVariants()}>{count}</span>}
      <span data-slot="tabs-indicator" aria-hidden="true" className={tabsIndicatorVariants({ variant: ctx.variant })} />
    </T.Trigger>
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof T.Content>) {
  return <T.Content data-slot="tabs-panel" className={cn('animate-rise outline-none focus-visible:shadow-focus', className)} {...props} />;
}
