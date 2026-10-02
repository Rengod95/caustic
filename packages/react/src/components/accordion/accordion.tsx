'use client';
import * as A from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { defined } from '../../lib/defined.ts';
import { accordionItemVariants, accordionVariants, type AccordionVariantProps } from './accordion.variants.ts';

const VariantCtx = createContext<NonNullable<AccordionVariantProps['variant']>>('flush');

export interface AccordionProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'dir' | 'onChange'>, AccordionVariantProps {
  /** single keeps at most one item open; multiple allows any number. */
  type?: 'single' | 'multiple';
  /** Controlled open item value(s): string for single, string[] for multiple. */
  value?: string | string[];
  /** Uncontrolled initially open item value(s). */
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /** In single mode, lets the open item be closed again. */
  collapsible?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

/** Collapsible sections: flush hairline rows or separated cards. Compose with AccordionItem/Trigger/Content. */
export function Accordion({ type = 'single', variant, value, defaultValue, onValueChange, collapsible = true, disabled = false, className, children, ...props }: AccordionProps) {
  const v = variant ?? 'flush';
  const root = cn(accordionVariants({ variant: v }), className);
  return (
    <VariantCtx.Provider value={v}>
      {type === 'multiple' ? (
        <A.Root
          type="multiple" data-slot="accordion" data-variant={v} className={root} disabled={disabled}
          {...defined({
            value: value === undefined ? undefined : ([] as string[]).concat(value),
            defaultValue: defaultValue === undefined ? undefined : ([] as string[]).concat(defaultValue),
            onValueChange,
          })}
          {...props}
        >{children}</A.Root>
      ) : (
        <A.Root
          type="single" data-slot="accordion" data-variant={v} className={root} disabled={disabled} collapsible={collapsible}
          {...defined({
            value: Array.isArray(value) ? value[0] : value,
            defaultValue: Array.isArray(defaultValue) ? defaultValue[0] : defaultValue,
            onValueChange,
          })}
          {...props}
        >{children}</A.Root>
      )}
    </VariantCtx.Provider>
  );
}

export interface AccordionItemProps extends ComponentProps<typeof A.Item> {}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  const variant = useContext(VariantCtx);
  return <A.Item data-slot="accordion-item" className={cn(accordionItemVariants({ variant }), className)} {...props} />;
}

export interface AccordionTriggerProps extends ComponentProps<typeof A.Trigger> {
  /** Leading 14px icon. */
  icon?: ReactNode;
  /** Inline count or Badge after the label. */
  accessory?: ReactNode;
}

export function AccordionTrigger({ icon, accessory, className, children, ...props }: AccordionTriggerProps) {
  return (
    <A.Header className="m-0">
      <A.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'group flex min-h-control-xl w-full cursor-pointer items-center gap-2.5 px-0.5 py-1 text-left font-ui text-ui-md text-text-primary',
          'outline-none focus-visible:rounded-md focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-42',
          className,
        )}
        {...props}
      >
        {icon ? <span data-slot="accordion-icon" aria-hidden className="inline-flex size-icon-sm shrink-0 text-text-tertiary [&_svg]:size-full">{icon}</span> : null}
        {children}
        {accessory ? <span data-slot="accordion-accessory" className="ml-1.5 inline-flex">{accessory}</span> : null}
        <ChevronDown data-slot="accordion-chevron" aria-hidden className="ml-auto size-icon-md shrink-0 text-text-tertiary transition-transform duration-base ease-out group-data-[state=open]:rotate-180" />
      </A.Trigger>
    </A.Header>
  );
}

export interface AccordionContentProps extends ComponentProps<typeof A.Content> {}

/** Stays in the DOM (hidden) while closed so its text remains searchable and measurable. */
export function AccordionContent({ className, ...props }: AccordionContentProps) {
  return <A.Content forceMount data-slot="accordion-content" className={cn('max-w-[64ch] data-[state=closed]:hidden px-0.5 pb-3.5 text-ui-relaxed text-text-secondary', className)} {...props} />;
}
