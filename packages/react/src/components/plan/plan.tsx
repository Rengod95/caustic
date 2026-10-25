'use client';
import { Check, CircleAlert } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { planFailedIndicatorClass, planFailedStepClass, planIndicatorVariants, planLabelVariants, planOrbVariants, planStepVariants, planVariants } from './plan.variants.ts';

export interface PlanStep {
  id: string;
  label: ReactNode;
  status: 'done' | 'now' | 'todo' | 'failed';
  /** End note, e.g. "Card form". */
  detail?: ReactNode;
}

export interface PlanProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Plan name. */
  title: ReactNode;
  /** Steps in order. */
  steps: PlanStep[];
  /** Text of the count, e.g. (d, t) => `${d} of ${t}`. */
  countLabel: (done: number, total: number) => string;
  /** Hidden status word before each step. */
  statusLabels: Record<'done' | 'now' | 'todo', string> & { failed?: string };
}

/** A failed step keeps the upcoming look; the danger mark and tint come on top. */
const lookOf = (status: PlanStep['status']): Exclude<PlanStep['status'], 'failed'> => (status === 'failed' ? 'todo' : status);

/** The live checklist of what the agent will do. Not interactive. */
export function Plan({ title, steps, countLabel, statusLabels, className, ...props }: PlanProps) {
  const titleId = useId();
  const done = steps.filter(s => s.status === 'done').length;
  return (
    <div role="group" aria-labelledby={titleId} data-slot="plan" className={cn(planVariants(), className)} {...props}>
      <div data-slot="plan-header" className="flex items-center justify-between px-1.5 pb-1.5 pt-1 text-ui-sm font-semibold text-text-primary">
        <span id={titleId} data-slot="plan-title">{title}</span>
        <span data-slot="plan-count" className="font-normal tabular-nums text-text-tertiary">{countLabel(done, steps.length)}</span>
      </div>
      <ol data-slot="plan-steps" aria-live="polite" className="m-0 grid list-none gap-px p-0">
        {steps.map(step => {
          const failed = step.status === 'failed';
          const look = lookOf(step.status);
          return (
          <li key={step.id} data-slot="plan-step" data-status={step.status} aria-current={step.status === 'now' ? 'step' : undefined} className={cn(planStepVariants({ status: look }), failed && planFailedStepClass)}>
            <span data-slot="plan-indicator" aria-hidden className={cn(planIndicatorVariants({ status: look }), failed && planFailedIndicatorClass)}>
              {step.status === 'done' && <Check />}
              {step.status === 'now' && <span data-slot="plan-orb" className={planOrbVariants({ status: look })} />}
              {failed && <CircleAlert />}
              {step.status === 'todo' && <span className="size-icon-sm rounded-full border border-dashed border-border-strong" />}
            </span>
            <span className="sr-only">{statusLabels[step.status] ?? 'Failed'}: </span>
            <span data-slot="plan-label" className={planLabelVariants({ status: look })}>{step.label}</span>
            {step.detail != null && <span data-slot="plan-detail" className="ml-auto text-ui-xs font-normal text-text-tertiary">{step.detail}</span>}
          </li>
          );
        })}
      </ol>
    </div>
  );
}
