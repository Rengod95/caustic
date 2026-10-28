'use client';
import * as T from '@radix-ui/react-tabs';
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Radius, Shadow, Size, Tone } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { tabsCountVariants, tabsIndicatorVariants, tabsListVariants, tabsTriggerVariants, tabsVariants, type TabsVariant } from './tabs.variants.ts';

interface Ctx { disabled: boolean; tone?: Tone | undefined; variant?: TabsVariant | undefined; radius?: Radius | undefined; shadow?: Shadow | undefined; size?: Size | undefined }
const TabsCtx = createContext<Ctx>({ disabled: false });

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
    <TabsCtx.Provider value={{ disabled, tone, variant, radius, shadow, size }}>
      <T.Root data-slot="tabs" data-variant={variant ?? 'underline'} value={current} onValueChange={setCurrent} className={cn(tabsVariants({ tone }), className)} {...props} />
    </TabsCtx.Provider>
  );
}

export function TabsList({ className, ...props }: ComponentProps<typeof T.List>) {
  const ctx = useContext(TabsCtx);
  return <T.List data-slot="tabs-list" className={cn(tabsListVariants({ variant: ctx.variant, shadow: ctx.shadow }), className)} {...props} />;
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
  return <T.Content data-slot="tabs-panel" className={cn('outline-none focus-visible:shadow-focus', className)} {...props} />;
}
