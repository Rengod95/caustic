'use client';
import * as T from '@radix-ui/react-tooltip';
import type { ComponentProps, ReactElement, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { defined } from '../../lib/defined.ts';
import { Kbd } from '../kbd/kbd.tsx';
import { tooltipArrow, tooltipVariants } from './tooltip.variants.ts';

export interface TooltipProps extends Omit<ComponentProps<typeof T.Content>, 'content' | 'children'> {
  /** The text. */
  content: ReactNode;
  /** Chord shown in a Kbd after the text, e.g. ⌘Z. */
  shortcut?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  /** Distance between trigger and bubble in px (includes the 4px arrow). */
  sideOffset?: number;
  /** Hover delay in ms before opening. */
  delayDuration?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Render the bubble in place without a portal (docs, previews). */
  inline?: boolean;
  /** The trigger element. */
  children: ReactElement;
}

/** Ink bubble that names an icon-only control. Wraps its trigger; never interactive. */
export function Tooltip({
  content, shortcut, side = 'top', align = 'center', sideOffset = 10, delayDuration = 400,
  open, defaultOpen = false, onOpenChange, inline = false, className, children, ...props
}: TooltipProps) {
  const bubble = (
    <T.Content
      data-slot="tooltip"
      side={side}
      align={align}
      sideOffset={sideOffset}
      className={cn(tooltipVariants(), className)}
      {...props}
    >
      {content}
      {shortcut ? <Kbd data-slot="tooltip-shortcut" className="bg-ink-kbd text-ink-on-muted shadow-none">{shortcut}</Kbd> : null}
      <T.Arrow asChild width={8} height={8}><span data-slot="tooltip-arrow" className={tooltipArrow()} /></T.Arrow>
    </T.Content>
  );
  return (
    <T.Provider delayDuration={delayDuration}>
      <T.Root {...defined({ open, defaultOpen, onOpenChange })} delayDuration={delayDuration}>
        <T.Trigger asChild data-slot="tooltip-trigger">{children}</T.Trigger>
        {inline ? bubble : <T.Portal>{bubble}</T.Portal>}
      </T.Root>
    </T.Provider>
  );
}
