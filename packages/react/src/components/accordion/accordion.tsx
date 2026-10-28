'use client';
import * as A from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { defined } from '../../lib/defined.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { accordionContentVariants, accordionGlyphVariants, accordionHeaderVariants, accordionItemVariants, accordionTriggerVariants, accordionVariants } from './accordion.variants.ts';

type AccordionVariant = 'flush' | 'separated' | Variant;
interface AccordionLook { variant: AccordionVariant; tone?: Tone | undefined; size?: Size | undefined; radius?: Radius | undefined; shadow?: Shadow | undefined }
const LookCtx = createContext<AccordionLook>({ variant: 'flush' });

export interface AccordionProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'dir' | 'onChange'> {
  /** flush = hairline rows (default); separated = one card per item; solid / soft / outline / ghost = cards in that emphasis. */
  variant?: AccordionVariant;
  /** Colour family: the card fill and text in solid / soft / outline / ghost, the icon and chevron graphic otherwise. */
  tone?: Tone;
  /** Item corner radius (the items are the visible boxes). Unset keeps xl on cards and none on flush rows. */
  radius?: Radius;
  /** Item elevation. Unset keeps none. */
  shadow?: Shadow;
  /** Header row height and type: xs 28 · sm 32 · md 48 (default) · lg 48 with larger type. */
  size?: Size;
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
export function Accordion({ type = 'single', variant, tone, radius, shadow, size, value, defaultValue, onValueChange, collapsible = true, disabled = false, className, children, ...props }: AccordionProps) {
  const v = variant ?? 'flush';
  const root = cn(accordionVariants({ variant: v }), className);
  return (
    <LookCtx.Provider value={{ variant: v, tone, size, radius, shadow }}>
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
    </LookCtx.Provider>
  );
}

export interface AccordionItemProps extends ComponentProps<typeof A.Item> {}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  const { variant, tone, radius, shadow } = useContext(LookCtx);
  return <A.Item data-slot="accordion-item" className={cn(accordionItemVariants({ variant, tone, radius, shadow }), className)} {...props} />;
}

export interface AccordionTriggerProps extends ComponentProps<typeof A.Trigger> {
  /** Leading 14px icon. */
  icon?: ReactNode;
  /** Inline count or Badge after the label. */
  accessory?: ReactNode;
}

export function AccordionTrigger({ icon, accessory, className, children, ...props }: AccordionTriggerProps) {
  const { tone, size, variant } = useContext(LookCtx);
  return (
    <A.Header className={accordionHeaderVariants({ variant })}>
      <A.Trigger
        data-slot="accordion-trigger"
        className={cn(accordionTriggerVariants({ size, variant }), (tone ?? 'neutral') === 'neutral' && variant !== 'solid' && 'hover:[&_[data-slot=accordion-chevron]]:text-text-secondary', className)}
        {...props}
      >
        {icon ? <span data-slot="accordion-icon" aria-hidden className={cn('inline-flex size-icon-sm [&_svg]:size-full', accordionGlyphVariants({ tone }))}>{icon}</span> : null}
        {children}
        {/* A Badge accessory drops its fill and tone with the disabled trigger: filled tones take disabled fill and text, the outline
            tone keeps no fill and takes the disabled border, the agent badge loses its rim and its orb stops in the disabled colour. */}
        {accessory ? (
          <span
            data-slot="accordion-accessory"
            className={cn(
              'ms-1.5 inline-flex',
              'group-disabled:[&_[data-slot=badge]]:bg-disabled-fill group-disabled:[&_[data-slot=badge]]:text-disabled-text',
              'group-disabled:[&_[data-slot=badge][data-variant=outline]]:bg-transparent group-disabled:[&_[data-slot=badge][data-variant=outline]]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
              'group-disabled:[&_[data-slot=badge][data-tone=agent]]:after:hidden',
              'group-disabled:[&_[data-slot=badge-orb]]:[animation:none] group-disabled:[&_[data-slot=badge-orb]]:[background:var(--cs-color-disabled-text)]',
            )}
          >{accessory}</span>
        ) : null}
        <ChevronDown data-slot="accordion-chevron" aria-hidden className={cn('ms-auto size-icon-md transition-transform duration-base ease-out group-data-[state=open]:rotate-180', accordionGlyphVariants({ tone }))} />
      </A.Trigger>
    </A.Header>
  );
}

export interface AccordionContentProps extends ComponentProps<typeof A.Content> {}

/** Stays in the DOM (hidden) while closed so its text remains searchable and measurable. */
export function AccordionContent({ className, ...props }: AccordionContentProps) {
  const { variant } = useContext(LookCtx);
  return <A.Content forceMount data-slot="accordion-content" className={cn(accordionContentVariants({ variant }), className)} {...props} />;
}
