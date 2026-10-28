'use client';
import * as T from '@radix-ui/react-tooltip';
import type { ComponentProps, ReactElement, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { defined } from '../../lib/defined.ts';
import { Kbd } from '../kbd/kbd.tsx';
import { tooltipArrow, tooltipVariants } from './tooltip.variants.ts';

export interface TooltipProps extends Omit<ComponentProps<typeof T.Content>, 'content' | 'children'>, CommonProps {
  /** The text. */
  content: ReactNode;
  /** Chord shown in a Kbd after the text, e.g. ⌘Z. */
  shortcut?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  /** Show the 8px arrow (off by default: the bubble sits close to its trigger instead). */
  arrow?: boolean;
  /** Distance between trigger and bubble in px: 6 without the arrow, 10 with it (includes the 4px arrow). */
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
  content, shortcut, side = 'top', align = 'center', arrow = false, sideOffset = arrow ? 10 : 6, delayDuration = 400,
  open, defaultOpen = false, onOpenChange, inline = false, tone, variant, radius, shadow, size, className, children, ...props
}: TooltipProps) {
  const bubble = (
    <T.Content
      data-slot="tooltip"
      side={side}
      align={align}
      sideOffset={sideOffset}
      className={cn(tooltipVariants({ tone, variant, size, radius, shadow }), className)}
      {...props}
    >
      {content}
      {/* The chord steps down to the micro role so the name leads (owner 2026-10-28). */}
      {shortcut ? <Kbd data-slot="tooltip-shortcut" className="bg-ink-kbd text-micro text-ink-on-muted shadow-none">{shortcut}</Kbd> : null}
      {arrow ? <T.Arrow asChild width={8} height={8}><span data-slot="tooltip-arrow" className={tooltipArrow()} /></T.Arrow> : null}
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
