'use client';
import { Check } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { planIndicatorVariants, planLabelVariants, planOrbVariants, planStepVariants, planVariants } from './plan.variants.ts';

export interface PlanStep {
  id: string;
  label: ReactNode;
  status: 'done' | 'now' | 'todo';
  /** End note, e.g. "Card form". */
  detail?: ReactNode;
}

export interface PlanProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Plan name. */
  title: ReactNode;
  /** Steps in order. */
  steps: PlanStep[];
}

const statusWord = { done: 'Done', now: 'In progress', todo: 'To do' } as const;

/** The live checklist of what the agent will do. Not interactive. */
export function Plan({ title, steps, className, ...props }: PlanProps) {
  const titleId = useId();
  const done = steps.filter(s => s.status === 'done').length;
  return (
    <div role="group" aria-labelledby={titleId} data-slot="plan" className={cn(planVariants(), className)} {...props}>
      <div data-slot="plan-header" className="flex items-center justify-between px-1.5 pb-1.5 pt-1 text-ui-sm font-semibold text-text-primary">
        <span id={titleId} data-slot="plan-title">{title}</span>
        <span data-slot="plan-count" className="font-normal tabular-nums text-text-tertiary">{done} of {steps.length}</span>
      </div>
      <ol data-slot="plan-steps" aria-live="polite" className="m-0 grid list-none gap-px p-0">
        {steps.map(step => (
          <li key={step.id} data-slot="plan-step" data-status={step.status} aria-current={step.status === 'now' ? 'step' : undefined} className={planStepVariants({ status: step.status })}>
            <span data-slot="plan-indicator" aria-hidden className={planIndicatorVariants({ status: step.status })}>
              {step.status === 'done' && <Check />}
              {step.status === 'now' && <span data-slot="plan-orb" className={planOrbVariants({ status: step.status })} />}
              {step.status === 'todo' && <span className="size-icon-sm rounded-full border-[1.5px] border-dashed border-border-strong" />}
            </span>
            <span className="sr-only">{statusWord[step.status]}: </span>
            <span data-slot="plan-label" className={planLabelVariants({ status: step.status })}>{step.label}</span>
            {step.detail != null && <span data-slot="plan-detail" className="ml-auto text-ui-xs font-normal text-text-tertiary">{step.detail}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
