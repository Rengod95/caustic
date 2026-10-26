'use client';
import * as R from '@radix-ui/react-radio-group';
import { useId, useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { clarificationOptionVariants, clarificationQuestionVariants, clarificationRadioVariants, clarificationVariants } from './clarification.variants.ts';

export interface ClarificationProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'dir'> {
  /** The agent's question. */
  question: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  /** ClarificationOption items. */
  children: ReactNode;
}

/** A question with a short list of mutually exclusive answers. The answer applies on selection. */
export function Clarification({ question, value, defaultValue, onValueChange, disabled = false, className, onKeyDown, children, ...props }: ClarificationProps) {
  const [current, setCurrent] = useControllableState<string>({ value, defaultValue: defaultValue ?? '', onChange: onValueChange });
  const questionId = useId();
  const ref = useRef<HTMLDivElement>(null);
  // Arrow keys select synchronously so the answer never lags behind roving focus.
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step || disabled) return;
    const items = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? [])];
    if (!items.length) return;
    const i = items.findIndex(el => el === document.activeElement);
    const next = items[(i + step + items.length) % items.length];
    e.preventDefault();
    next?.focus();
    if (next?.dataset.value !== undefined) setCurrent(next.dataset.value);
  };
  return (
    <R.Root ref={ref} onKeyDown={handleKeyDown} data-slot="clarification" aria-labelledby={questionId} value={current} onValueChange={setCurrent} disabled={disabled} className={cn(clarificationVariants(), className)} {...(props as ComponentProps<typeof R.Root>)}>
      <span id={questionId} data-slot="clarification-question" className={clarificationQuestionVariants()}>{question}</span>
      {children}
    </R.Root>
  );
}

export interface ClarificationOptionProps extends Omit<ComponentProps<'button'>, 'value' | 'children'> {
  value: string;
  /** Answer text. */
  label: ReactNode;
  /** Example or consequence on its own line. */
  hint?: ReactNode;
}

export function ClarificationOption({ value, label, hint, className, ...props }: ClarificationOptionProps) {
  return (
    <R.Item data-slot="clarification-option" data-value={value} value={value} className={cn(clarificationOptionVariants(), className)} {...(props as Omit<ComponentProps<typeof R.Item>, 'value'>)}>
      <span data-slot="clarification-radio" aria-hidden className={clarificationRadioVariants()}>
        <R.Indicator className="size-radio-dot rounded-full bg-accent-on group-disabled:bg-disabled-text" />
      </span>
      <div data-slot="clarification-label">
        {label}
        {hint != null && <span data-slot="clarification-hint" className="block text-hint font-normal text-text-tertiary group-data-[state=checked]:text-text-secondary group-disabled:text-disabled-text group-data-[state=checked]:group-disabled:text-disabled-text">{hint}</span>}
      </div>
    </R.Item>
  );
}
