'use client';
import { ChevronRight } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { thinkingLabelVariants, thinkingSummaryVariants, thinkingVariants, type ThinkingVariantProps } from './thinking.variants.ts';

export interface ThinkingProps extends Omit<ComponentProps<'div'>, 'children'>, ThinkingVariantProps, CommonProps {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial state. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Summary text. */
  label?: ReactNode;
  /** The thought text. */
  children?: ReactNode;
}

/** The agent reasoning as a collapsible italic aside. The label shimmers while the agent is still thinking. */
export function Thinking({ open, defaultOpen = false, onOpenChange, status, label = 'Thinking', tone, variant, radius, shadow, size, className, children, ...props }: ThinkingProps) {
  const [isOpen, setOpen] = useControllableState({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const bodyId = useId();
  return (
    <div data-slot="thinking" data-state={isOpen ? 'open' : 'closed'} data-status={status ?? 'thinking'} className={cn('rounded-xl', thinkingVariants({ tone, variant, radius, shadow }), className)} {...props}>
      <button
        type="button"
        data-slot="thinking-summary"
        aria-expanded={isOpen}
        aria-controls={isOpen ? bodyId : undefined}
        onClick={() => setOpen(!isOpen)}
        className={thinkingSummaryVariants({ size })}
      >
        <ChevronRight data-slot="thinking-chevron" aria-hidden className={cn('size-icon-sm shrink-0 transition-transform duration-base ease-out', isOpen && 'rotate-90')} />
        <span data-slot="thinking-label" className={thinkingLabelVariants({ status })}>{label}</span>
      </button>
      {isOpen && children != null && (
        <div id={bodyId} data-slot="thinking-body" className="ml-1.5 mt-1 border-l border-(color:--tone-rule) py-0.5 pl-3.5 pr-0 font-voice text-thought italic tracking-[var(--cs-text-voice-tracking)] text-text-secondary">{children}</div>
      )}
    </div>
  );
}
