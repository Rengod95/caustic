'use client';
import { Check, CircleAlert } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Variant } from '../../lib/common-props.ts';
import {
  stepperChecklistIndicator, stepperChecklistItem, stepperChecklistLabel, stepperChecklistMark, stepperChecklistShape,
  stepperConnector, stepperCountClass, stepperProgressClipClass, stepperDescription, stepperDetailClass, stepperHeaderClass, stepperIndicator, stepperItem,
  stepperLabel, stepperProgressClass, stepperProgressFillClass, stepperSteps, stepperTodoRingClass, stepperVariants,
} from './stepper.variants.ts';

/** Status of one step. Unset falls back to the value index (before value done, at value now, after it todo). */
export type StepperStatus = 'done' | 'now' | 'todo' | 'failed';

export interface StepperStep {
  /** Stable key; the index is used when absent. */
  id?: string;
  label: ReactNode;
  /** Text under the label (progress look). */
  description?: ReactNode;
  status?: StepperStatus;
  /** End note at the row end, e.g. "Card form" (checklist). */
  detail?: ReactNode;
}

export interface StepperProps extends Omit<ComponentProps<'div'>, 'title' | 'children'>, Omit<CommonProps, 'variant'> {
  /** Current step, 1-based, for steps without a status. Earlier steps are done, later ones upcoming. 0 = none started. */
  value?: number;
  steps: StepperStep[];
  /** Progress look only: row of centred steps or a column with the indicator at the start. Checklist is always a column. */
  orientation?: 'horizontal' | 'vertical';
  /** solid / soft / outline / ghost: the progress look and the emphasis of a done step. checklist: the agent plan card. */
  variant?: Variant | 'checklist';
  /** Heading of the steps; renders StepperHeader with StepperTitle (and StepperCount when countLabel is set). */
  title?: ReactNode;
  /** Text of the count, e.g. (d, t) => `${d} of ${t}`. */
  countLabel?: (done: number, total: number) => string;
  /** Visually hidden status word read with each step. */
  statusLabels?: Partial<Record<StepperStatus, string>>;
  /** A custom header built from StepperHeader, StepperTitle and StepperCount (replaces the one title renders). */
  children?: ReactNode;
}

type Internal = 'done' | 'current' | 'upcoming' | 'failed';
const fromStatus: Record<StepperStatus, Internal> = { done: 'done', now: 'current', todo: 'upcoming', failed: 'failed' };
const toStatus: Record<Internal, StepperStatus> = { done: 'done', current: 'now', upcoming: 'todo', failed: 'failed' };

/** The title row of the steps. */
export function StepperHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="stepper-header" className={cn(stepperHeaderClass, className)} {...props} />;
}

/** The name of the steps; give it an id and point the Stepper's aria-labelledby at it. */
export function StepperTitle(props: ComponentProps<'span'>) {
  return <span data-slot="stepper-title" {...props} />;
}

/** "3 of 6": done steps over all steps. */
export function StepperCount({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="stepper-count" className={cn(stepperCountClass, className)} {...props} />;
}

/** Progress through a sequence of steps: the numbered progress look, or the checklist of the agent plan. Not interactive. */
export function Stepper({ value = 0, steps, orientation, variant, title, countLabel, statusLabels, children, tone, radius, shadow, size, className, ...props }: StepperProps) {
  const titleId = useId();
  const checklist = variant === 'checklist';
  const o = checklist || orientation === 'vertical' ? 'vertical' : 'horizontal';
  const status = steps.map((s, i): Internal => (s.status ? fromStatus[s.status] : i + 1 < value ? 'done' : i + 1 === value ? 'current' : 'upcoming'));
  const done = status.filter(s => s === 'done').length;
  const header = children ?? (title != null && (
    <StepperHeader>
      <StepperTitle id={titleId}>{title}</StepperTitle>
      {countLabel && <StepperCount>{countLabel(done, steps.length)}</StepperCount>}
    </StepperHeader>
  ));
  const word = (s: Internal) => statusLabels?.[toStatus[s]];
  const look = checklist ? variant : 'solid';
  const list = stepperSteps({ layout: checklist ? 'checklist' : o });

  // Checklist: a status region announces the step that changed (the one that became current or failed, else the last
  // changed), instead of a live list that rereads every step. Nothing is announced on mount.
  const seen = useRef<Internal[] | null>(null);
  const [changed, setChanged] = useState<number | null>(null);
  const signature = status.join(' ');
  useEffect(() => {
    const before = seen.current;
    seen.current = status;
    if (!before) return;
    let pick: number | null = null;
    for (let i = 0; i < status.length; i++) {
      if (status[i] === before[i]) continue;
      if (pick === null || status[pick] === 'done' || status[pick] === 'upcoming') pick = i;
    }
    if (pick !== null) setChanged(pick);
    // The signature stands for status.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);
  const announced = changed !== null && changed < steps.length ? changed : null;

  return (
    <div
      data-slot="stepper"
      data-orientation={o}
      data-variant={checklist ? 'checklist' : undefined}
      role={header ? 'group' : undefined}
      aria-labelledby={title != null && children == null ? titleId : undefined}
      className={cn(stepperVariants({ tone, variant: look, size }), checklist && stepperChecklistShape({ radius, shadow }), className)}
      {...props}
    >
      {checklist && (
        <span aria-hidden className={stepperProgressClipClass}>
          <span data-slot="stepper-progress" className={stepperProgressClass}>
            <span data-slot="stepper-progress-fill" className={stepperProgressFillClass} style={{ '--stepper-progress': `${steps.length ? (done / steps.length) * 100 : 0}%` } as CSSProperties} />
          </span>
        </span>
      )}
      {header || null}
      {checklist ? (
        <ol data-slot="stepper-steps" className={list}>
          {steps.map((step, i) => {
            const s = status[i]!;
            return (
              <li key={step.id ?? i} data-step-id={step.id} data-slot="stepper-item" data-status={s} aria-current={s === 'current' ? 'step' : undefined} className={cn(stepperChecklistItem({ status: s, size }))}>
                <span data-slot="stepper-indicator" data-status={s} aria-hidden className={stepperChecklistIndicator({ status: s })}>
                  {s === 'done' && <Check className="animate-pop" />}
                  {s === 'current' && <span data-slot="stepper-orb" className={stepperChecklistMark({ tone })} />}
                  {s === 'failed' && <CircleAlert />}
                  {s === 'upcoming' && <span data-slot="stepper-todo-ring" className={stepperTodoRingClass} />}
                </span>
                {word(s) != null && <span className="sr-only">{word(s)}: </span>}
                <span data-slot="stepper-label" className={stepperChecklistLabel({ status: s })}>{step.label}</span>
                {step.detail != null && <span data-slot="stepper-detail" className={stepperDetailClass}>{step.detail}</span>}
              </li>
            );
          })}
        </ol>
      ) : (
        <ol data-slot="stepper-steps" className={list}>
          {steps.map((step, i) => {
            const s = status[i]!;
            const vertical = o === 'vertical';
            const hasConnector = vertical ? i < steps.length - 1 : i > 0;
            const active = vertical ? s === 'done' : s !== 'upcoming';
            const text = (
              <>
                <b data-slot="stepper-label" className={cn(stepperLabel({ orientation: o, status: s }))}>{step.label}</b>
                {step.description != null && (vertical
                  ? <p data-slot="stepper-description" className={stepperDescription({ orientation: o })}>{step.description}</p>
                  : <span data-slot="stepper-description" className={stepperDescription({ orientation: o })}>{step.description}</span>)}
              </>
            );
            return (
              <li key={step.id ?? i} data-slot="stepper-item" data-status={s} aria-current={s === 'current' ? 'step' : undefined} className={stepperItem({ orientation: o })}>
                {hasConnector && <span data-slot="stepper-connector" aria-hidden className={stepperConnector({ orientation: o, active })} />}
                <span data-slot="stepper-indicator" data-status={s} className={cn(stepperIndicator({ status: s, variant, size, radius, shadow }))}>
                  {s === 'done' ? (<><Check className="size-3.5 animate-pop" strokeWidth={3} aria-hidden /><span className="sr-only">{word(s) ?? 'completed'}</span></>)
                    : s === 'failed' ? (<><CircleAlert className="size-3.5" aria-hidden /><span className="sr-only">{word(s) ?? 'failed'}</span></>)
                    : (<>{i + 1}{word(s) != null && <span className="sr-only"> {word(s)}</span>}</>)}
                </span>
                {vertical ? <div>{text}</div> : text}
              </li>
            );
          })}
        </ol>
      )}
      {checklist && (
        <span data-slot="stepper-status" role="status" className="sr-only">
          {announced !== null && <>{word(status[announced]!) != null && `${word(status[announced]!)}: `}{steps[announced]!.label}</>}
        </span>
      )}
    </div>
  );
}
