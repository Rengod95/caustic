'use client';
import * as HC from '@radix-ui/react-hover-card';
import * as P from '@radix-ui/react-popover';
import { createContext, useContext, useEffect, useId, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { defined } from '../../lib/defined.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { popoverArrow, popoverVariants, type PopoverVariantProps } from './popover.variants.ts';

type Side = 'top' | 'bottom' | 'left' | 'right';
type Align = 'start' | 'center' | 'end';

export interface PopoverProps extends Omit<ComponentProps<'div'>, 'children'>, PopoverVariantProps {
  /** How it opens: press (Popover) or hover/focus (HoverCard). */
  trigger?: 'click' | 'hover';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The element the panel hangs from (rendered with asChild). */
  anchor?: ReactNode;
  side?: Side;
  align?: Align;
  /** Show the pointer arrow. */
  arrow?: boolean;
  /** Hover only: ms before opening. */
  openDelay?: number;
  /** Hover only: ms before closing. */
  closeDelay?: number;
  /** Render the surface in place, open, directly after the anchor; no portal or positioning. */
  inline?: boolean;
  children?: ReactNode;
}

interface TitleCtx { id: string; register: (on: boolean) => void }
const TitleContext = createContext<TitleCtx | null>(null);

const GAP = 10;

/** Thick-glass panel anchored to an element; opens on press (popover) or hover/focus (hover card). */
export function Popover({ trigger = 'click', size, open, defaultOpen, onOpenChange, anchor, side = 'bottom', align = 'start', arrow = true, openDelay = 320, closeDelay = 120, inline = false, className, children, onKeyDown, ...props }: PopoverProps) {
  const id = useId();
  const [titled, setTitled] = useState(false);
  const ctx: TitleCtx = { id, register: setTitled };
  const [shown, setShown] = useControllableState<boolean>({ value: open, defaultValue: defaultOpen ?? true, onChange: onOpenChange });
  const classes = cn(popoverVariants({ trigger, size }), className);
  const content = (
    <TitleContext.Provider value={ctx}>
      {children}
      {arrow && <span data-slot="popover-arrow" aria-hidden className={popoverArrow()} />}
    </TitleContext.Provider>
  );
  const common = { 'data-size': size ?? 'md', 'data-trigger': trigger, 'aria-labelledby': titled ? id : undefined, className: classes, ...props };

  if (inline) {
    const keys = (e: KeyboardEvent<HTMLDivElement>) => { onKeyDown?.(e); if (e.key === 'Escape') setShown(false); };
    return (
      <>
        {anchor}
        {shown && <div data-slot="popover" role="dialog" tabIndex={-1} data-side={side} data-align={align} data-state="open" {...common} onKeyDown={keys}>{content}</div>}
      </>
    );
  }

  if (trigger === 'hover') {
    return (
      <HC.Root {...defined({ open, defaultOpen, onOpenChange })} openDelay={openDelay} closeDelay={closeDelay}>
        {anchor != null && <HC.Trigger asChild>{anchor}</HC.Trigger>}
        <HC.Portal>
          <HC.Content data-slot="popover" side={side} align={align} sideOffset={GAP} onKeyDown={onKeyDown} {...common}>{content}</HC.Content>
        </HC.Portal>
      </HC.Root>
    );
  }
  return (
    <P.Root {...defined({ open, defaultOpen, onOpenChange })}>
      {anchor != null && <P.Trigger asChild>{anchor}</P.Trigger>}
      <P.Portal>
        <P.Content data-slot="popover" side={side} align={align} sideOffset={GAP} onKeyDown={onKeyDown} {...common}>{content}</P.Content>
      </P.Portal>
    </P.Root>
  );
}

/** Semibold heading; names the panel (aria-labelledby). */
export function PopoverTitle({ className, ...props }: ComponentProps<'b'>) {
  const t = useContext(TitleContext);
  useEffect(() => { t?.register(true); return () => t?.register(false); }, [t?.register]);
  return <b id={t?.id} data-slot="popover-title" className={cn('text-ui font-semibold text-text-primary', className)} {...props} />;
}

/** Secondary supporting text. */
export function PopoverDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p data-slot="popover-description" className={cn('m-0 text-ui-dense text-text-tertiary', className)} {...props} />;
}
