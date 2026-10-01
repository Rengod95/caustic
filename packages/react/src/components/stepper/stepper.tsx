'use client';
import { Check } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import {
  stepperConnector, stepperDescription, stepperIndicator, stepperItem, stepperLabel, stepperVariants,
  type StepperVariantProps,
} from './stepper.variants.ts';

export interface StepperStep {
  label: string;
  description?: string;
}

export interface StepperProps extends Omit<ComponentProps<'ol'>, 'children'>, StepperVariantProps {
  /** Current step, 1-based. Earlier steps are done, later ones upcoming. 0 = none started. */
  value: number;
  steps: StepperStep[];
}

/** Presentational progress through a fixed sequence of steps. */
export function Stepper({ value, steps, orientation, className, ...props }: StepperProps) {
  const vertical = orientation === 'vertical';
  const o = vertical ? 'vertical' : 'horizontal';
  return (
    <ol data-slot="stepper" data-orientation={o} className={cn(stepperVariants({ orientation: o }), className)} {...props}>
      {steps.map((step, i) => {
        const n = i + 1;
        const status = n < value ? 'done' : n === value ? 'current' : 'upcoming';
        const hasConnector = vertical ? i < steps.length - 1 : i > 0;
        const active = vertical ? status === 'done' : status !== 'upcoming';
        const text = (
          <>
            <b data-slot="stepper-label" className={stepperLabel({ orientation: o, dim: !vertical && status === 'upcoming' })}>{step.label}</b>
            {step.description != null && (vertical
              ? <p data-slot="stepper-description" className={stepperDescription({ orientation: o })}>{step.description}</p>
              : <span data-slot="stepper-description" className={stepperDescription({ orientation: o })}>{step.description}</span>)}
          </>
        );
        return (
          <li key={i} data-slot="stepper-item" data-status={status} aria-current={status === 'current' ? 'step' : undefined} className={stepperItem({ orientation: o })}>
            {hasConnector && <span data-slot="stepper-connector" aria-hidden className={stepperConnector({ orientation: o, active })} />}
            <span data-slot="stepper-indicator" data-status={status} className={stepperIndicator({ status })}>
              {status === 'done' ? (<><Check className="size-3.5" strokeWidth={3} aria-hidden /><span className="sr-only">completed</span></>) : n}
            </span>
            {vertical ? <div>{text}</div> : text}
          </li>
        );
      })}
    </ol>
  );
}
