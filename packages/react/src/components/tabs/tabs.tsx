'use client';
import * as T from '@radix-ui/react-tabs';
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';

const TabsCtx = createContext<{ disabled: boolean }>({ disabled: false });

export interface TabsProps extends Omit<ComponentProps<typeof T.Root>, 'value' | 'defaultValue' | 'onValueChange' | 'dir'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Disables every trigger. */
  disabled?: boolean;
}

/** Underlined text tabs. Compose with TabsList, TabsTrigger and TabsContent. */
export function Tabs({ value, defaultValue = '', onValueChange, disabled = false, className, ...props }: TabsProps) {
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });
  return (
    <TabsCtx.Provider value={{ disabled }}>
      <T.Root data-slot="tabs" value={current} onValueChange={setCurrent} className={cn('flex flex-col', className)} {...props} />
    </TabsCtx.Provider>
  );
}

export function TabsList({ className, ...props }: ComponentProps<typeof T.List>) {
  return <T.List data-slot="tabs-list" className={cn('flex gap-4.5 border-b border-border-subtle', className)} {...props} />;
}

export interface TabsTriggerProps extends ComponentProps<typeof T.Trigger> {
  /** Small tabular count after the label. */
  count?: ReactNode;
}

export function TabsTrigger({ count, disabled, className, children, ...props }: TabsTriggerProps) {
  const ctx = useContext(TabsCtx);
  return (
    <T.Trigger
      data-slot="tabs-trigger" disabled={disabled || ctx.disabled}
      className={cn(
        'group relative inline-flex h-tab-h items-center gap-1 whitespace-nowrap font-ui text-ui-strong text-text-tertiary',
        'transition-colors duration-base ease-out outline-none hover:text-text-primary focus-visible:shadow-focus',
        // Disabled is colour and the tone drops: the stacked disabled + active rule (0,3,0) beats the active text, and the bar greys out.
        'data-[state=active]:text-text-primary disabled:pointer-events-none disabled:text-disabled-text disabled:data-[state=active]:text-disabled-text',
        className,
      )}
      {...props}
    >
      {children}
      {count != null && <span data-slot="tabs-count" className="text-ui-xs tabular-nums text-text-tertiary group-disabled:text-disabled-text">{count}</span>}
      <span data-slot="tabs-indicator" aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 rounded-xs bg-accent-solid opacity-0 transition-opacity duration-base ease-out group-data-[state=active]:opacity-100 group-disabled:bg-disabled-text" />
    </T.Trigger>
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof T.Content>) {
  return <T.Content data-slot="tabs-panel" className={cn('outline-none focus-visible:shadow-focus', className)} {...props} />;
}
