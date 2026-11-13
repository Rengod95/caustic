'use client';
import { Check, CircleAlert, Minus, X } from '../../icons/index.ts';
import { useEffect, useId, useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Variant } from '../../lib/common-props.ts';
import {
  stepperBareClass, stepperChecklistIndicator, stepperChecklistItem, stepperChecklistLabel, stepperChecklistLiveClass, stepperChecklistShape,
  stepperCompactHideClass, stepperCountClass, stepperDescription, stepperDetailClass, stepperGroove, stepperHeadClass, stepperHeaderClass, stepperItem,
  stepperLabel, stepperLightVariants, stepperMajor, stepperMark, stepperOrbitBusyClass, stepperOrbitClass, stepperOrbitReverseClass, stepperParticleBusyClass, stepperParticleClass,
  stepperParticlesClass, stepperPressIndicatorClass, stepperPressRowClass, stepperProgressClass, stepperProgressClipClass, stepperProgressFillClass,
  stepperRail, stepperSteps, stepperTextClass, stepperTodoRingClass, stepperVariants,
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
  /**
   * The live mark of the current step (14px box), e.g. the app's own thinking orb. Called with whether the step is
   * moving (busy, or the checklist with tone agent). Unset: the default particles.
   */
  live?: (moving: boolean) => ReactNode;
}

type Internal = 'done' | 'current' | 'upcoming' | 'failed' | 'skipped';
const fromStatus: Record<StepperStatus, Internal> = { done: 'done', now: 'current', todo: 'upcoming', failed: 'failed', skipped: 'skipped' };
const toStatus: Record<Internal, StepperStatus> = { done: 'done', current: 'now', upcoming: 'todo', failed: 'failed', skipped: 'skipped' };
const fallbackWord: Partial<Record<Internal, string>> = { done: 'completed', failed: 'failed', skipped: 'skipped' };

/**
 * Narrow row (horizontal progress), two levels: 1 = only the current step keeps its name (its column takes its own width),
 * 2 = marks and rail only. A level starts when a shown name no longer fits its column; hidden names stay for screen
 * readers. The width the names needed is kept, so they return once the row is wide enough again.
 */
function useCompact(enabled: boolean) {
  const ref = useRef<HTMLOListElement>(null);
  const [level, setLevel] = useState(0);
  const need = useRef<number[]>([]);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!enabled || !el || typeof ResizeObserver === 'undefined') return;
    const fit = () => {
      const names = [...el.querySelectorAll<HTMLElement>('[data-slot="stepper-label"]')].filter(n => n.offsetParent !== null && n.clientWidth > 1);
      const clipped = names.some(n => n.scrollWidth > n.clientWidth + 0.5);
      if (level < 2 && clipped) {
        // Natural width: every head at its own width plus the 8px it keeps clear of the next rail.
        need.current[level] = [...el.querySelectorAll<HTMLElement>('[data-slot="stepper-head"]')].reduce((w, h) => w + h.scrollWidth + 8, 0);
        setLevel(level + 1);
      } else if (level > 0 && el.clientWidth >= (need.current[level - 1] ?? Infinity)) setLevel(level - 1);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [enabled, level]);
  return [ref, level] as const;
}

/** Grooves per step: about one per 7px of the column, 6 to 20. */
function grooveCount(columnWidth: number) {
  return Math.max(6, Math.min(20, Math.round(columnWidth / 7)));
}

/** The default live mark: six particles on two counter-turning orbits, breathing out of phase; still unless moving. */
const PARTICLES: { x: number; y: number; ring: 0 | 1; delay: number }[] = [
  { x: 6, y: 0.5, ring: 0, delay: 0 }, { x: 11.2, y: 9, ring: 0, delay: -0.53 }, { x: 0.8, y: 9, ring: 0, delay: -1.06 },
  { x: 6, y: 3.5, ring: 1, delay: -0.27 }, { x: 8.6, y: 7.5, ring: 1, delay: -0.8 }, { x: 3.4, y: 7.5, ring: 1, delay: -1.33 },
];
function Particles({ moving }: { moving: boolean }) {
  return (
    <span data-slot="stepper-particles" aria-hidden className={stepperParticlesClass}>
      {[0, 1].map(ring => (
        <span key={ring} className={cn(stepperOrbitClass, moving && stepperOrbitBusyClass, ring === 1 && stepperOrbitReverseClass)}>
          {PARTICLES.filter(p => p.ring === ring).map((p, k) => (
            <span key={k} className={cn(stepperParticleClass, moving && stepperParticleBusyClass)} style={{ '--x': `${p.x}px`, '--y': `${p.y}px`, '--delay': `${p.delay}s` } as CSSProperties} />
          ))}
        </span>
      ))}
    </span>
  );
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
export function Stepper({ value = 0, steps, orientation, variant, title, countLabel, statusLabels, children, onStepClick, bare = false, live, tone, radius, shadow, size, className, ...props }: StepperProps) {
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
  const compactLevel = compact === 2 ? 'marks' : compact === 1 ? 'current' : undefined;
  const [columnWidth, setColumnWidth] = useState(0);
  useLayoutEffect(() => {
    const el = rowRef.current;
    if (checklist || o === 'vertical' || !el || typeof ResizeObserver === 'undefined') return;
    // Layout px (clientWidth / clientHeight), so the count does not follow the app zoom.
    const measure = () => setColumnWidth(el.clientWidth / Math.max(1, steps.length));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [checklist, o, steps.length, rowRef]);
  // Vertical: six grooves per step (the steps are short; more would read as a solid bar).
  const grooves = o === 'vertical' ? 6 : grooveCount(columnWidth || 96);
  const liveMark = (moving: boolean) => (live ? live(moving) : <Particles moving={moving} />);
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
                  {s === 'current' && <span data-slot="stepper-live" className={stepperChecklistLiveClass}>{liveMark(tone === 'agent' || step.busy === true)}</span>}
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
        <ol ref={rowRef} data-slot="stepper-steps" data-compact={compactLevel} className={cn(list, stepperLightVariants({ variant }))}>
          {steps.map((step, i) => {
            const s = status[i]!;
            const vertical = o === 'vertical';
            const busy = s === 'current' && step.busy === true;
            const press = onStepClick != null && step.clickable !== false;
            const hidden = compact === 2 || (compact === 1 && s !== 'current');
            const word_ = word(s) ?? fallbackWord[s];
            // Groove k of n sits at t(1.35 − 0.35t), t = k/n: spacing tightens about 2:1 toward the next step (a lens profile).
            // The last vertical step has no next step to run toward: its major groove alone.
            const run = vertical && i === steps.length - 1 ? 0 : s === 'skipped' ? Math.ceil(grooves / 2) : grooves;
            const failAt = Math.max(1, Math.round(run / 3));
            const rail = (
              <span data-slot="stepper-rail" aria-hidden className={stepperRail({ orientation: o })}>
                <span data-slot="stepper-major" className={stepperMajor({ orientation: o, lit: s !== 'upcoming' && s !== 'skipped' })} />
                {Array.from({ length: run }, (_, k) => {
                  const t = (k + 1) / run;
                  const p = t * (1.35 - 0.35 * t);
                  const groove = s === 'done' ? 'lit' : s === 'failed' ? (k < failAt ? 'danger' : 'rest') : s === 'current' ? (busy ? 'glint' : 'dim') : 'rest';
                  const at = vertical ? `calc(var(--stepper-line) + ${p.toFixed(4)} * (100% - var(--stepper-line) - 6px))` : `calc(4px + ${p.toFixed(4)} * (100% - 12px))`;
                  return (
                    <span
                      key={k}
                      data-slot="stepper-groove"
                      className={stepperGroove({ orientation: o, light: groove, skipped: s === 'skipped' })}
                      // The glint runs toward the next step: each groove starts later by its place along the run.
                      style={{ '--at': at, ...(busy ? { '--delay': `${(p * 0.9 - 1.6).toFixed(3)}s` } : {}) } as CSSProperties}
                    />
                  );
                })}
              </span>
            );
            const mark = (
              <span data-slot="stepper-indicator" data-status={s} data-busy={busy || undefined} className={stepperMark({ status: s })}>
                {s === 'done' ? <Check aria-hidden />
                  : s === 'failed' ? <X aria-hidden />
                  : s === 'skipped' ? <Minus aria-hidden />
                  : s === 'current' ? liveMark(busy)
                  : <span aria-hidden>{String(i + 1).padStart(2, '0')}</span>}
                {word_ != null && <span className="sr-only">{word_}</span>}
              </span>
            );
            const text = (
              <span className={cn(stepperTextClass, hidden && stepperCompactHideClass)}>
                <span data-slot="stepper-label" className={stepperLabel({ orientation: o, status: s, size })}>{step.label}</span>
                {step.description != null && <span data-slot="stepper-description" className={stepperDescription({ orientation: o })}>{step.description}</span>}
              </span>
            );
            const Head = press ? 'button' : 'span';
            return (
              <li key={step.id ?? i} data-slot="stepper-item" data-status={s} aria-current={s === 'current' ? 'step' : undefined} aria-busy={busy || undefined} className={stepperItem({ orientation: o })}>
                {rail}
                <Head data-slot="stepper-head" data-pressable={press || undefined} {...(press ? { type: 'button' as const, onClick: () => onStepClick(i, step) } : {})} className={cn(stepperHeadClass, vertical && 'items-start', press && stepperPressIndicatorClass)}>
                  {mark}{text}
                </Head>
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
