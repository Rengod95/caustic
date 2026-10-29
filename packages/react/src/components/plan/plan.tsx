'use client';
import { useId, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Stepper, StepperCount, StepperHeader, StepperTitle, type StepperProps, type StepperStatus, type StepperStep } from '../stepper/stepper.tsx';

export interface PlanStep extends StepperStep {
  id: string;
  status: StepperStatus;
}

export interface PlanProps extends Omit<StepperProps, 'variant' | 'orientation' | 'value' | 'steps' | 'title' | 'countLabel' | 'statusLabels' | 'children'> {
  /** Always the checklist: Plan is the agent preset of Stepper. */
  variant?: 'checklist';
  /** Plan name. */
  title: ReactNode;
  /** Steps in order. */
  steps: PlanStep[];
  /** Text of the count, e.g. (d, t) => `${d} of ${t}`. */
  countLabel: (done: number, total: number) => string;
  /** Hidden status word before each step. */
  statusLabels: Record<'done' | 'now' | 'todo', string> & { failed?: string };
}

/** The live checklist of what the agent will do: `<Stepper variant="checklist" tone="agent">` with the plan header. Not interactive. */
export function Plan({ title, steps, countLabel, statusLabels, tone = 'agent', variant: _variant, className, ...props }: PlanProps) {
  const titleId = useId();
  const done = steps.filter(s => s.status === 'done').length;
  return (
    <Stepper data-slot="plan" variant="checklist" tone={tone} aria-labelledby={titleId} steps={steps} statusLabels={{ failed: 'Failed', ...statusLabels }} className={cn('animate-rise', className)} {...props}>
      <StepperHeader data-slot="plan-header">
        <StepperTitle data-slot="plan-title" id={titleId}>{title}</StepperTitle>
        <StepperCount data-slot="plan-count">{countLabel(done, steps.length)}</StepperCount>
      </StepperHeader>
    </Stepper>
  );
}
