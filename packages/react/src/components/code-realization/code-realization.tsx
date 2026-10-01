'use client';
import { Check, ChevronDown, FileCode, FileWarning, Package } from 'lucide-react';
import { Fragment, type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Badge } from '../badge/badge.tsx';
import { Button } from '../button/button.tsx';
import {
  codeRealizationAddedVariants, codeRealizationFileIconVariants, codeRealizationFileNameVariants, codeRealizationFilesVariants,
  codeRealizationFileVariants, codeRealizationFooterVariants, codeRealizationOrbVariants, codeRealizationPhaseIconVariants,
  codeRealizationPhasesVariants, codeRealizationPhaseVariants, codeRealizationRemovedVariants, codeRealizationSeparatorVariants,
  codeRealizationStatsVariants, codeRealizationTargetChevronVariants, codeRealizationTargetVariants, codeRealizationVariants,
} from './code-realization.variants.ts';

type PhaseState = 'done' | 'now' | 'todo';
type Tone = 'default' | 'warning';

export interface CodeRealizationPhaseEntry {
  id: string;
  label: string;
  /** Explicit state; by default derived from `current`. */
  phase?: PhaseState;
}

export interface CodeRealizationProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** The phase strip, in order. */
  phases: CodeRealizationPhaseEntry[];
  /** Id of the current phase; earlier phases are done, later ones todo. */
  current?: string;
  /** Accessible name of the phase list. */
  phasesLabel?: string;
  /** Accessible name of the file list. */
  filesLabel?: string;
  /** File rows: CodeRealizationFile elements. */
  children?: ReactNode;
  /** Chosen realization target ("web-react"). */
  target?: string;
  downloadLabel?: ReactNode;
  /** Download is activated. */
  onDownload?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** The target chooser is activated, to open the consumer's listbox. */
  onTargetClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const WORD: Record<PhaseState, string> = { done: ', done', now: ', current', todo: '' };

/** Turns the design into code in steps: phases, the files to write, a target and the download. */
export function CodeRealization({
  phases, current, phasesLabel = 'Progress', filesLabel = 'Files', children, target = 'web-react', downloadLabel = 'Download zip',
  onDownload, onTargetClick, className, ...props
}: CodeRealizationProps) {
  const at = phases.findIndex(p => p.id === current);
  const stateOf = (p: CodeRealizationPhaseEntry, i: number): PhaseState => {
    if (p.phase) return p.phase;
    if (at < 0) return 'todo';
    return i < at ? 'done' : i === at ? 'now' : 'todo';
  };
  return (
    <div data-slot="code-realization" className={cn(codeRealizationVariants(), className)} {...props}>
      <ol aria-label={phasesLabel} data-slot="code-realization-phases" className={codeRealizationPhasesVariants()}>
        {phases.map((p, i) => {
          const phase = stateOf(p, i);
          return (
            <Fragment key={p.id}>
              {i > 0 && <span role="presentation" aria-hidden="true" data-slot="code-realization-separator" className={codeRealizationSeparatorVariants()} />}
              <CodeRealizationPhase phase={phase}>{p.label}</CodeRealizationPhase>
            </Fragment>
          );
        })}
      </ol>
      <ul aria-label={filesLabel} data-slot="code-realization-files" className={codeRealizationFilesVariants()}>{children}</ul>
      <div data-slot="code-realization-footer" className={codeRealizationFooterVariants()}>
        <button
          type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls={undefined} aria-label={`Realization target: ${target}`}
          data-slot="code-realization-target" className={codeRealizationTargetVariants()} onClick={onTargetClick}
        >
          <span>{target}</span>
          <ChevronDown aria-hidden="true" className={codeRealizationTargetChevronVariants()} />
        </button>
        <Button data-slot="code-realization-download" size="sm" iconStart={<Package />} onClick={onDownload}>{downloadLabel}</Button>
      </div>
    </div>
  );
}

export interface CodeRealizationPhaseProps extends Omit<ComponentProps<'li'>, 'children'> {
  /** done = success tint with a check; now = raised pill with the agent orb; todo = quiet. */
  phase?: PhaseState;
  children: ReactNode;
}

/** One phase pill of the strip. */
export function CodeRealizationPhase({ phase = 'todo', children, className, ...props }: CodeRealizationPhaseProps) {
  return (
    <li data-slot="code-realization-phase" data-phase={phase} aria-current={phase === 'now' ? 'step' : undefined} className={cn(codeRealizationPhaseVariants({ phase }), className)} {...props}>
      {phase === 'done' && <Check aria-hidden="true" data-slot="code-realization-phase-icon" className={codeRealizationPhaseIconVariants()} />}
      {phase === 'now' && <span data-slot="code-realization-orb" aria-hidden="true" className={codeRealizationOrbVariants({ phase })} />}
      {children}
      {WORD[phase] && <span className="sr-only">{WORD[phase]}</span>}
    </li>
  );
}

export interface CodeRealizationFileProps extends Omit<ComponentProps<'li'>, 'children'> {
  /** warning = the row reports what could not be realized. */
  tone?: Tone;
  /** File name. */
  name: string;
  /** Added line count. */
  added?: number;
  /** Removed line count. */
  removed?: number;
  /** Trailing badge text on a warning row ("2 limits"). */
  note?: ReactNode;
}

export function CodeRealizationFile({ tone = 'default', name, added, removed, note, className, ...props }: CodeRealizationFileProps) {
  const Icon = tone === 'warning' ? FileWarning : FileCode;
  return (
    <li data-slot="code-realization-file" data-tone={tone} className={cn(codeRealizationFileVariants(), className)} {...props}>
      <Icon aria-hidden="true" data-slot="code-realization-file-icon" className={codeRealizationFileIconVariants({ tone })} />
      <span data-slot="code-realization-file-name" className={codeRealizationFileNameVariants()}>{name}</span>
      {(added != null || removed != null) && (
        <span data-slot="code-realization-stats" className={codeRealizationStatsVariants()}>
          {added != null && <span data-slot="code-realization-added" className={codeRealizationAddedVariants()}>+{added}<span className="sr-only"> added</span></span>}
          {removed != null && <span data-slot="code-realization-removed" className={codeRealizationRemovedVariants()}>−{removed}<span className="sr-only"> removed</span></span>}
        </span>
      )}
      {note != null && <Badge data-slot="code-realization-badge" tone="warning">{note}</Badge>}
    </li>
  );
}
