'use client';
import { CircleAlert, CircleCheck, CircleHelp, createLucideIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { activityCallGlyphVariants, activityCallVariants, activityLabelVariants, activityOrbVariants, activityStepGlyphVariants, activityStepVariants, activityTreeVariants, activityWorkerOrbVariants } from './activity-tree.variants.ts';

/** lucide corner-down-right with a tighter elbow (1.5 instead of 4), so the call arrow reads less curved (owner 2026-10-27). */
const CallArrow = createLucideIcon('CallArrow', [
  ['polyline', { points: '15 10 20 15 15 20', key: 'head' }],
  ['path', { d: 'M4 4v9.5a1.5 1.5 0 0 0 1.5 1.5H20', key: 'stem' }],
]);

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
  /** Calls only: the call matches no step; it stays in run order with the other calls, marked by the help glyph. */
  unassigned?: boolean;
}

export interface ActivityTreeProps extends Omit<ComponentProps<'div'>, 'children'>, CommonProps {
  /** In run order; calls follow the step they belong to, an unassigned call sits where it ran. */
  nodes: ActivityNode[];
  /** Shows the worker line. */
  worker?: { name: ReactNode; meta?: ReactNode };
  /** Hidden status word before a failed step or call. */
  failedLabel?: string;
  'aria-label'?: string;
  // Common props (lib/common-props.ts): variant boxes the tree (ghost = bare, default), tone colours the box and the
  // call glyphs, radius and shadow shape the box, size steps the rows (md = 28px ui-dense).
}

const metaClass = 'text-ui-xs tabular-nums text-text-tertiary';

/** The plan as a tree with tool calls attached to the step that made them. Read-only. */
export function ActivityTree({ nodes, worker, failedLabel = 'Failed', tone, variant, radius, shadow, size, className, 'aria-label': ariaLabel = 'Agent activity', ...props }: ActivityTreeProps) {
  const busy = nodes.some(n => n.kind === 'step' && n.status === 'active');
  return (
    <div data-slot="activity-tree" aria-label={ariaLabel} aria-busy={busy || undefined} className={cn(activityTreeVariants({ variant, tone, radius, shadow }), className)} {...props}>
      <ul data-slot="activity-tree-list" role="list" className="m-0 grid list-none gap-0 p-0">
        {nodes.map(n => {
          if (n.kind === 'step') {
            const status = n.status ?? 'done';
            const active = status === 'active';
            const failed = status === 'failed';
            return (
              <li key={n.id} data-slot="activity-tree-step" data-status={status} className={activityStepVariants({ size })}>
                {active
                  ? <span data-slot="activity-tree-orb" aria-hidden className={activityOrbVariants()} />
                  : <span data-slot="activity-tree-step-glyph" aria-hidden className={activityStepGlyphVariants({ failed })}>{failed ? <CircleAlert /> : <CircleCheck />}</span>}
                <span data-slot="activity-tree-label" className={activityLabelVariants({ status })}>{failed && <span className="sr-only">{failedLabel}: </span>}{n.label}</span>
                {n.meta != null && <span data-slot="activity-tree-meta" className={cn(metaClass, failed && 'text-danger-text')}>{n.meta}</span>}
              </li>
            );
          }
          const glyph = <span data-slot="activity-tree-call-glyph" aria-hidden className={cn(activityCallGlyphVariants({ tone, failed: n.failed }))}>{n.failed ? <CircleAlert /> : n.unassigned ? <CircleHelp /> : <CallArrow />}</span>;
          const name = <span data-slot="activity-tree-name" className="font-mono text-mono-dense text-text-secondary"><span className="sr-only">{n.failed ? `Tool call ${failedLabel.toLowerCase()}` : 'Tool call'}: </span>{n.label}</span>;
          const meta = n.meta != null && <span data-slot="activity-tree-meta" className={cn(metaClass, n.failed && 'text-danger-text')}>{n.meta}</span>;
          // An unassigned call is the same row as any call, in run order (owner 2026-10-27); only its slot and glyph differ.
          return n.unassigned
            ? <li key={n.id} data-slot="activity-tree-unassigned" data-depth={1} className={activityCallVariants({ size })}>{glyph}{name}{meta}</li>
            : <li key={n.id} data-slot="activity-tree-call" data-depth={1} className={activityCallVariants({ size })}>{glyph}{name}{meta}</li>;
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
