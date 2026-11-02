'use client';
import { useId, useRef, type ReactNode } from 'react';
import { useFlip } from '../../hooks/use-flip.ts';
import { cn } from '../../lib/cn.ts';
import { Stepper, StepperCount, StepperHeader, StepperTitle, type StepperProps, type StepperStatus, type StepperStep } from '../stepper/stepper.tsx';

export interface PlanStep extends StepperStep {
  id: string;
  status: StepperStatus;
}

export interface PlanProps extends Omit<StepperProps, 'variant' | 'orientation' | 'value' | 'steps' | 'title' | 'countLabel' | 'statusLabels' | 'onStepClick' | 'children'> {
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
  /** Makes each row pressable (e.g. jump to the turn that made the step); called with the step and its 0-based index. A step with clickable: false stays plain. */
  onRowPress?: (step: PlanStep, index: number) => void;
}

/** The live checklist of what the agent will do: `<Stepper variant="checklist" tone="agent">` with the plan header. Rows are read-only unless onRowPress is set; bare drops the card for use inside a well. */
export function Plan({ title, steps, countLabel, statusLabels, tone = 'agent', variant: _variant, onRowPress, className, ...props }: PlanProps) {
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  // A step that is added or removed slides the steps around it. Needs Stepper to mark each step with data-step-id.
  useFlip(rootRef, '[data-slot="stepper-item"][data-step-id]', 'stepId');
  const done = steps.filter(s => s.status === 'done').length;
  return (
    <Stepper ref={rootRef} data-slot="plan" variant="checklist" tone={tone} aria-labelledby={titleId} steps={steps} onStepClick={onRowPress ? i => onRowPress(steps[i]!, i) : undefined} statusLabels={{ failed: 'Failed', ...statusLabels }} className={cn('animate-rise', className)} {...props}>
      <StepperHeader data-slot="plan-header">
        <StepperTitle data-slot="plan-title" id={titleId}>{title}</StepperTitle>
        <StepperCount data-slot="plan-count">{countLabel(done, steps.length)}</StepperCount>
      </StepperHeader>
    </Stepper>
  );
}
