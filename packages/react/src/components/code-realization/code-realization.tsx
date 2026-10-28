'use client';
import { Check, ChevronDown, FileCode, FileWarning, FileX, Package } from 'lucide-react';
import { createContext, Fragment, useContext, type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { radiusClass, shadowClass, type CommonProps, type Tone } from '../../lib/common-props.ts';
import { Badge } from '../badge/badge.tsx';
import { Button } from '../button/button.tsx';
import {
  codeRealizationAddedVariants, codeRealizationFileIconVariants, codeRealizationFileNameVariants, codeRealizationFilesVariants,
  codeRealizationFileVariants, codeRealizationFooterVariants, codeRealizationMarkerVariants, codeRealizationOrbVariants, codeRealizationPhaseIconVariants,
  codeRealizationPhasesVariants, codeRealizationPhaseVariants, codeRealizationRemovedVariants, codeRealizationSeparatorVariants,
  codeRealizationStatsVariants, codeRealizationTargetChevronVariants, codeRealizationTargetVariants, codeRealizationVariants,
} from './code-realization.variants.ts';

type PhaseState = 'done' | 'now' | 'todo';
/** File row tone; `default` is the deprecated name of neutral. */
type FileTone = Tone | 'default';
const Ctx = createContext<CommonProps>({});

export interface CodeRealizationPhaseEntry {
  id: string;
  label: string;
  /** Explicit state; by default derived from `current`. */
  phase?: PhaseState;
}

/**
 * Common props (lib/common-props.ts) style the phase strip and the rows: variant = emphasis of the done and todo step
 * markers (default soft), tone = text of the current step (default neutral), size = step and file row height (default md),
 * radius = corners of the current step plate (default md), shadow = its elevation (default 1).
 */
export interface CodeRealizationProps extends Omit<ComponentProps<'div'>, 'children'>, CommonProps {
  /** The phase strip, in order. */
  phases: CodeRealizationPhaseEntry[];
  /** Id of the current phase; earlier phases are done, later ones todo. */
  current?: string;
  /** Accessible name of the phase list. */
  phasesLabel: string;
  /** Accessible name of the file list. */
  filesLabel: string;
  /** Hidden state words after a done and a current phase. */
  phaseStatusLabels: { done: string; now: string };
  /** File rows: CodeRealizationFile elements. */
  children?: ReactNode;
  /** Chosen realization target value ("web-react"). */
  target?: string | undefined;
  /** The target is fixed: static text, no chooser. */
  targetReadOnly?: boolean | undefined;
  /** Accessible name of the target control from the value. */
  targetLabel: (target: string) => string;
  downloadLabel: ReactNode;
  /** Disables the download button. */
  downloadDisabled?: boolean | undefined;
  /** Download is activated. */
  onDownload?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** The target chooser is activated, to open the consumer's listbox. */
  onTargetClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** Turns the design into code in steps: phases, the files to write, a target and the download. */
export function CodeRealization({
  phases, current, phasesLabel, filesLabel, phaseStatusLabels, children, target = '', targetReadOnly = false, targetLabel, downloadLabel, downloadDisabled = false,
  onDownload, onTargetClick, tone, variant, radius, shadow, size, className, ...props
}: CodeRealizationProps) {
  const at = phases.findIndex(p => p.id === current);
  const stateOf = (p: CodeRealizationPhaseEntry, i: number): PhaseState => {
    if (p.phase) return p.phase;
    if (at < 0) return 'todo';
    return i < at ? 'done' : i === at ? 'now' : 'todo';
  };
  return (
    <Ctx.Provider value={{ tone, variant, radius, shadow, size }}>
    <div data-slot="code-realization" className={cn(codeRealizationVariants(), className)} {...props}>
      <ol aria-label={phasesLabel} data-slot="code-realization-phases" className={codeRealizationPhasesVariants()}>
        {phases.map((p, i) => {
          const phase = stateOf(p, i);
          return (
            <Fragment key={p.id}>
              {/* An <li> (role presentation): an <ol> only takes list items. */}
              {i > 0 && (
                <li
                  role="presentation" aria-hidden="true" data-slot="code-realization-separator" data-reached={phase !== 'todo' || undefined}
                  className={codeRealizationSeparatorVariants({ reached: phase !== 'todo' })}
                />
              )}
              <CodeRealizationPhase phase={phase} statusLabel={phase === 'todo' ? undefined : phaseStatusLabels[phase]}>{p.label}</CodeRealizationPhase>
            </Fragment>
          );
        })}
      </ol>
      <ul aria-label={filesLabel} data-slot="code-realization-files" className={codeRealizationFilesVariants()}>{children}</ul>
      <div data-slot="code-realization-footer" className={codeRealizationFooterVariants()}>
        {targetReadOnly ? (
          <span data-slot="code-realization-target" className={codeRealizationTargetVariants({ interactive: false })}>
            <span aria-hidden="true">{target}</span>
            <span className="sr-only">{targetLabel(target)}</span>
          </span>
        ) : (
          <button
            type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-label={targetLabel(target)}
            data-slot="code-realization-target" className={codeRealizationTargetVariants()} onClick={onTargetClick}
          >
            <span>{target}</span>
            <ChevronDown aria-hidden="true" className={codeRealizationTargetChevronVariants()} />
          </button>
        )}
        <Button data-slot="code-realization-download" size="sm" iconStart={<Package />} disabled={downloadDisabled} onClick={onDownload}>{downloadLabel}</Button>
      </div>
    </div>
    </Ctx.Provider>
  );
}

export interface CodeRealizationPhaseProps extends Omit<ComponentProps<'li'>, 'children'> {
  /** done = success check marker; now = the agent orb on a raised plate; todo = a hollow marker. */
  phase?: PhaseState;
  /** Hidden state word after the text, e.g. ", done". */
  statusLabel?: string | undefined;
  children: ReactNode;
}

/** One step of the strip: marker (or orb) and label. */
export function CodeRealizationPhase({ phase = 'todo', statusLabel, children, className, ...props }: CodeRealizationPhaseProps) {
  const { tone, variant, radius, shadow, size } = useContext(Ctx);
  const cls = cn(
    codeRealizationPhaseVariants({ phase, variant, tone, size }),
    phase === 'now' && radius && radius !== 'md' && radiusClass[radius], phase === 'now' && shadow && shadow !== '1' && shadowClass[shadow], className,
  );
  return (
    <li data-slot="code-realization-phase" data-phase={phase} aria-current={phase === 'now' ? 'step' : undefined} className={cls} {...props}>
      {phase !== 'now' && (
        <span data-slot="code-realization-marker" data-phase={phase} aria-hidden="true" className={codeRealizationMarkerVariants({ phase, variant })}>
          {phase === 'done' && <Check data-slot="code-realization-phase-icon" className={codeRealizationPhaseIconVariants()} />}
        </span>
      )}
      {phase === 'now' && <span data-slot="code-realization-orb" aria-hidden="true" className={codeRealizationOrbVariants({ phase })} />}
      {children}
      {statusLabel ? <span className="sr-only">{statusLabel}</span> : null}
    </li>
  );
}

export interface CodeRealizationFileProps extends Omit<ComponentProps<'li'>, 'children'> {
  /** warning = the row reports what could not be realized; danger = the file could not be written; any tone colours the
   * glyph. `default` is the deprecated name of neutral. */
  tone?: FileTone;
  /** File name. */
  name: string;
  /** Added line count. */
  added?: number;
  /** Removed line count. */
  removed?: number;
  /** Trailing badge text on a warning row ("2 limits"). */
  note?: ReactNode;
  /** Hidden word after the added count, e.g. " added". */
  addedLabel?: string | undefined;
  /** Hidden word after the removed count, e.g. " removed". */
  removedLabel?: string | undefined;
}

export function CodeRealizationFile({ tone: toneProp = 'neutral', name, added, removed, note, addedLabel, removedLabel, className, ...props }: CodeRealizationFileProps) {
  const { size } = useContext(Ctx);
  const tone: Tone = toneProp === 'default' ? 'neutral' : toneProp;
  const Icon = tone === 'warning' ? FileWarning : tone === 'danger' ? FileX : FileCode;
  // A note on a neutral row is a warning (the row reports a limit); a hued row keeps its tone.
  const badgeTone = tone === 'neutral' ? 'warning' : tone;
  return (
    <li data-slot="code-realization-file" data-tone={tone} className={cn(codeRealizationFileVariants({ fileSize: size, fileTone: tone }), className)} {...props}>
      <Icon aria-hidden="true" data-slot="code-realization-file-icon" className={codeRealizationFileIconVariants({ fileTone: tone })} />
      <span data-slot="code-realization-file-name" className={codeRealizationFileNameVariants()}>{name}</span>
      {(added != null || removed != null) && (
        <span data-slot="code-realization-stats" className={codeRealizationStatsVariants()}>
          {added != null && <span data-slot="code-realization-added" className={codeRealizationAddedVariants()}>+{added}<span className="sr-only">{addedLabel}</span></span>}
          {removed != null && <span data-slot="code-realization-removed" className={codeRealizationRemovedVariants()}>−{removed}<span className="sr-only">{removedLabel}</span></span>}
        </span>
      )}
      {note != null && <Badge data-slot="code-realization-badge" tone={badgeTone}>{note}</Badge>}
    </li>
  );
}
