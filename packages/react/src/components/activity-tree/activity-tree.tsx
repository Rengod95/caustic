'use client';
import { CircleAlert, CircleCheck, CircleHelp, CornerDownRight } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { activityCallGlyphVariants, activityCallVariants, activityOrbVariants, activityStepGlyphVariants, activityStepVariants, activityUnassignedVariants, activityTreeVariants, activityWorkerOrbVariants } from './activity-tree.variants.ts';

export interface ActivityNode {
  id: string;
  kind: 'step' | 'call';
  /** Step text, or call "name · argument". */
  label: ReactNode;
  /** End text: duration, "step 3", a count or "running". */
  meta?: ReactNode;
  /** Steps only. */
  status?: 'done' | 'active' | 'failed';
  /** Calls only: the call is in flight. Its meta stays static; only the active step's orb moves. */
  running?: boolean;
  /** Calls only: the call failed; danger glyph and meta. */
  failed?: boolean;
  /** Calls only: the call matches no step; render under the dashed divider. */
  unassigned?: boolean;
}

export interface ActivityTreeProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** In order; calls follow the step they belong to, unassigned calls come last. */
  nodes: ActivityNode[];
  /** Shows the worker line. */
  worker?: { name: ReactNode; meta?: ReactNode };
  /** Hidden status word before a failed step or call. */
  failedLabel?: string;
  'aria-label'?: string;
}

const metaClass = 'text-ui-xs tabular-nums text-text-tertiary';

/** The plan as a tree with tool calls attached to the step that made them. Read-only. */
export function ActivityTree({ nodes, worker, failedLabel = 'Failed', className, 'aria-label': ariaLabel = 'Agent activity', ...props }: ActivityTreeProps) {
  const busy = nodes.some(n => n.kind === 'step' && n.status === 'active');
  return (
    <div data-slot="activity-tree" aria-label={ariaLabel} aria-busy={busy || undefined} className={cn(activityTreeVariants(), className)} {...props}>
      <ul data-slot="activity-tree-list" role="list" className="m-0 grid list-none gap-0 p-0">
        {nodes.map(n => {
          if (n.kind === 'step') {
            const active = n.status === 'active';
            const failed = n.status === 'failed';
            return (
              <li key={n.id} data-slot="activity-tree-step" data-status={n.status ?? 'done'} className={activityStepVariants()}>
                {active
                  ? <span data-slot="activity-tree-orb" aria-hidden className={activityOrbVariants()} />
                  : <span data-slot="activity-tree-step-glyph" aria-hidden className={activityStepGlyphVariants({ failed })}>{failed ? <CircleAlert /> : <CircleCheck />}</span>}
                <span data-slot="activity-tree-label" className={failed ? 'text-danger-text' : 'text-text-primary'}>{failed && <span className="sr-only">{failedLabel}: </span>}{n.label}</span>
                {n.meta != null && <span data-slot="activity-tree-meta" className={cn(metaClass, failed && 'text-danger-text')}>{n.meta}</span>}
              </li>
            );
          }
          const glyph = <span data-slot="activity-tree-call-glyph" aria-hidden className={activityCallGlyphVariants({ failed: n.failed })}>{n.failed ? <CircleAlert /> : n.unassigned ? <CircleHelp /> : <CornerDownRight />}</span>;
          const name = <span data-slot="activity-tree-name" className="font-mono text-mono-md font-normal text-text-secondary"><span className="sr-only">{n.failed ? `Tool call ${failedLabel.toLowerCase()}` : 'Tool call'}: </span>{n.label}</span>;
          const meta = n.meta != null && <span data-slot="activity-tree-meta" className={cn(metaClass, n.failed && 'text-danger-text')}>{n.meta}</span>;
          return n.unassigned ? (
            <li key={n.id} data-slot="activity-tree-unassigned" className={activityUnassignedVariants()}>{glyph}{name}{meta}</li>
          ) : (
            <li key={n.id} data-slot="activity-tree-call" data-depth={1} className={activityCallVariants()}>{glyph}{name}{meta}</li>
          );
        })}
      </ul>
      {worker && (
        <div data-slot="activity-tree-worker" className="flex items-center gap-2 rounded-lg bg-bg-inset px-2.5 py-2 text-ui-sm font-normal text-text-primary">
          <span data-slot="activity-tree-worker-orb" aria-hidden className={activityWorkerOrbVariants()} />
          <b data-slot="activity-tree-worker-name" className="font-medium">{worker.name}</b>
          {worker.meta != null && <span data-slot="activity-tree-worker-meta" className={cn('ml-auto', metaClass)}>{worker.meta}</span>}
        </div>
      )}
    </div>
  );
}
