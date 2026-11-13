'use client';
import { Check, CircleAlert, Minus, X } from '../../icons/index.ts';
import { useEffect, useId, useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Variant } from '../../lib/common-props.ts';
import {
  stepperChecklistCoreClass, stepperChecklistIndicator, stepperChecklistItem, stepperChecklistLabel, stepperChecklistMark, stepperChecklistShape,
  stepperCompactHideClass, stepperConnector, stepperConnectorFill, stepperCoreBusyClass, stepperCoreClass, stepperCountClass, stepperFlowClass, stepperGrooveClass,
  stepperHeadClass, stepperProgressClipClass, stepperDescription, stepperDetailClass, stepperHeaderClass, stepperIndicator, stepperItem, stepperRippleClass, stepperTextClass,
  stepperBareClass, stepperLabel, stepperPressIndicatorClass, stepperPressRowClass, stepperProgressClass, stepperProgressFillClass, stepperSteps, stepperTodoRingClass, stepperVariants,
} from './stepper.variants.ts';

/** Status of one step. Unset falls back to the value index (before value done, at value now, after it todo). */
export type StepperStatus = 'done' | 'now' | 'todo' | 'failed' | 'skipped';

export interface StepperStep {
  /** Stable key; the index is used when absent. */
  id?: string;
  label: ReactNode;
  /** Text under the label (progress look). */
  description?: ReactNode;
  status?: StepperStatus;
  /** End note at the row end, e.g. "Card form" (checklist). */
  detail?: ReactNode;
  /** With onStepClick: false leaves this step unpressable (e.g. a step not reached yet). Default true. */
  clickable?: boolean;
  /** The current step is working (a check running): its lens core breathes, a ring spreads out of it and light runs along the line into it. */
  busy?: boolean;
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
  /** Makes steps pressable (reopen a finished step): called with the 0-based index and the step. Steps become buttons; set a step's clickable to false to leave it out. */
  onStepClick?: (index: number, step: StepperStep) => void;
  /** Checklist only: no card of its own (no fill, hairline, corner, inset or progress band), for use inside a well or panel that already draws one. */
  bare?: boolean;
  /** A custom header built from StepperHeader, StepperTitle and StepperCount (replaces the one title renders). */
  children?: ReactNode;
}

type Internal = 'done' | 'current' | 'upcoming' | 'failed' | 'skipped';
const fromStatus: Record<StepperStatus, Internal> = { done: 'done', now: 'current', todo: 'upcoming', failed: 'failed', skipped: 'skipped' };
const toStatus: Record<Internal, StepperStatus> = { done: 'done', current: 'now', upcoming: 'todo', failed: 'failed', skipped: 'skipped' };
const fallbackWord: Partial<Record<Internal, string>> = { done: 'completed', failed: 'failed', skipped: 'skipped' };

/**
 * Narrow row (horizontal progress), two levels: 1 = only the current step keeps its label beside the lens, 2 = lenses only.
 * Hidden labels stay for screen readers. The width each level needed is kept, so the labels return once it fits again.
 */
function useCompact(enabled: boolean) {
  const ref = useRef<HTMLOListElement>(null);
  const [level, setLevel] = useState(0);
  const need = useRef<number[]>([]);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!enabled || !el || typeof ResizeObserver === 'undefined') return;
    const fit = () => {
      if (level < 2 && el.scrollWidth > el.clientWidth + 0.5) { need.current[level] = el.scrollWidth; setLevel(level + 1); }
      else if (level > 0 && el.clientWidth >= (need.current[level - 1] ?? Infinity)) setLevel(level - 1);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [enabled, level]);
  return [ref, level] as const;
}

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

/** Progress through a sequence of steps: the numbered progress look, or the checklist of the agent plan. Read-only unless onStepClick is set. */
export function Stepper({ value = 0, steps, orientation, variant, title, countLabel, statusLabels, children, onStepClick, bare = false, tone, radius, shadow, size, className, ...props }: StepperProps) {
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
  const look = checklist ? variant : 'soft';
  const [rowRef, compact] = useCompact(!checklist && o === 'horizontal');
  const compactLevel = compact === 2 ? 'lenses' : compact === 1 ? 'current' : undefined;
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
      className={cn(stepperVariants({ tone, variant: look, size }), checklist && stepperChecklistShape({ radius, shadow }), checklist && bare && stepperBareClass, className)}
      {...props}
    >
      {checklist && !bare && (
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
            const press = onStepClick != null && step.clickable !== false;
            const body = (
              <>
                <span data-slot="stepper-indicator" data-status={s} aria-hidden className={stepperChecklistIndicator({ status: s })}>
                  {s === 'done' && <Check className="animate-pop" />}
                  {s === 'current' && <span data-slot="stepper-orb" className={stepperChecklistMark({ tone })}><span className={cn(stepperChecklistCoreClass, (tone === 'agent' || step.busy) && stepperCoreBusyClass)} /></span>}
                  {s === 'failed' && <CircleAlert />}
                  {s === 'skipped' && <Minus />}
                  {s === 'upcoming' && <span data-slot="stepper-todo-ring" className={stepperTodoRingClass} />}
                </span>
                {word(s) != null && <span className="sr-only">{word(s)}: </span>}
                <span data-slot="stepper-label" className={stepperChecklistLabel({ status: s })}>{step.label}</span>
                {step.detail != null && <span data-slot="stepper-detail" className={stepperDetailClass}>{step.detail}</span>}
              </>
            );
            return (
              <li key={step.id ?? i} data-step-id={step.id} data-slot="stepper-item" data-status={s} data-pressable={press || undefined} aria-current={s === 'current' ? 'step' : undefined} className={cn(stepperChecklistItem({ status: s, size }))}>
                {press ? <button type="button" data-slot="stepper-press" className={stepperPressRowClass} onClick={() => onStepClick(i, step)}>{body}</button> : body}
              </li>
            );
          })}
        </ol>
      ) : (
        <ol ref={rowRef} data-slot="stepper-steps" data-compact={compactLevel} className={list}>
          {steps.map((step, i) => {
            const s = status[i]!;
            const vertical = o === 'vertical';
            const busy = s === 'current' && step.busy === true;
            const press = onStepClick != null && step.clickable !== false;
            const labelId = `${titleId}-step-${i}`;
            const Indicator = press ? 'button' : 'span';
            const hidden = compact === 2 || (compact === 1 && s !== 'current');
            // The line into this step (horizontal) or out of it (vertical) fills once the step before it is done or skipped.
            const before = vertical ? s : status[i - 1];
            const filled = before === 'done' || before === 'skipped';
            const connector = (vertical ? i < steps.length - 1 : i > 0) && (
              <span data-slot="stepper-connector" data-active={filled || undefined} aria-hidden className={stepperConnector({ orientation: o })}>
                <span data-slot="stepper-connector-fill" className={stepperConnectorFill({ orientation: o, active: filled })} />
                {!vertical && busy && <span data-slot="stepper-flow" className={stepperFlowClass} />}
              </span>
            );
            const word_ = word(s) ?? fallbackWord[s];
            const indicator = (
              <Indicator data-slot="stepper-indicator" data-status={s} data-busy={busy || undefined} data-pressable={press || undefined} {...(press ? { type: 'button' as const, 'aria-labelledby': labelId, onClick: () => onStepClick(i, step) } : {})} className={cn(stepperIndicator({ status: s, variant, size, radius, shadow }), press && stepperPressIndicatorClass)}>
                {s === 'done' ? <Check className="animate-pop" emphasis="selected" aria-hidden />
                  : s === 'failed' ? <X aria-hidden />
                  : s === 'skipped' ? <Minus aria-hidden />
                  : s === 'current' ? (<>
                    {busy && <span data-slot="stepper-ripple" aria-hidden className={stepperRippleClass} />}
                    <span aria-hidden className={stepperGrooveClass} />
                    <span data-slot="stepper-core" aria-hidden className={cn(stepperCoreClass, busy && stepperCoreBusyClass)} />
                  </>)
                  : <span aria-hidden>{i + 1}</span>}
                {word_ != null && <span className="sr-only">{word_}</span>}
              </Indicator>
            );
            const text = (
              <span className={cn(stepperTextClass, hidden && stepperCompactHideClass)}>
                <span data-slot="stepper-label" id={press ? labelId : undefined} className={stepperLabel({ orientation: o, status: s, size })}>{step.label}</span>
                {step.description != null && <span data-slot="stepper-description" className={stepperDescription({ orientation: o })}>{step.description}</span>}
              </span>
            );
            return (
              <li key={step.id ?? i} data-slot="stepper-item" data-status={s} aria-current={s === 'current' ? 'step' : undefined} aria-busy={busy || undefined} className={stepperItem({ orientation: o })}>
                {vertical ? <>{connector}{indicator}{text}</> : <>{connector}<span className={stepperHeadClass}>{indicator}{text}</span></>}
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
