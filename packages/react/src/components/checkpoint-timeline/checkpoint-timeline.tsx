'use client';
import { useId, useRef, useState, type ComponentProps, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Button } from '../button/button.tsx';
import {
  checkpointTimelineBody, checkpointTimelineConfirm, checkpointTimelineConnector, checkpointTimelineDetail, checkpointTimelineDot, checkpointTimelineItem, checkpointTimelineNode,
  checkpointTimelineTime, checkpointTimelineTitle, checkpointTimelineVariants,
} from './checkpoint-timeline.variants.ts';

export interface CheckpointTimelineItemProps extends Omit<ComponentProps<'li'>, 'title'> {
  /** Who made the checkpoint; agent = rotating spectrum dot. */
  author?: 'human' | 'agent';
  /** The checkpoint being previewed: accent ring and dot, Restore instead of the time, aria-current. */
  selected?: boolean;
  /** Title. */
  title: ReactNode;
  /** One-line summary. */
  detail?: ReactNode;
  /** Relative time; omit on the selected item. */
  time?: ReactNode;
  /** ISO value for the time element. */
  dateTime?: string;
  /** The agent is working on this checkpoint right now: the only state where the spectrum dot rotates. Finished checkpoints are static. */
  running?: boolean;
  /** Label of the action. */
  restoreLabel?: string;
  /** Opt-in confirm step: what will be undone, and that it can be undone again. Without it, the first press restores (the caller confirms). */
  confirmMessage?: ReactNode;
  /** Open the confirm step on first render (docs and tests). */
  defaultConfirming?: boolean;
  /** Label of the cancel button in the confirm step. */
  cancelLabel?: string;
  /** Restore is confirmed (or activated, without confirmMessage). */
  onRestore?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface CheckpointTimelineProps extends ComponentProps<'ol'> {
  /** Accessible name of the list. */
  'aria-label': string;
}

/** The project history, newest first. Compose with CheckpointTimelineItem; item props belong to the item. */
export function CheckpointTimeline({ className, ...props }: CheckpointTimelineProps) {
  return <ol data-slot="checkpoint-timeline" className={cn(checkpointTimelineVariants(), className)} {...props} />;
}

export function CheckpointTimelineItem({
  author = 'human', selected = false, running = false, title, detail, time, dateTime, restoreLabel = 'Restore', cancelLabel = 'Cancel', defaultConfirming = false,
  confirmMessage, onRestore, className, ...props
}: CheckpointTimelineItemProps) {
  const dotAuthor = selected ? 'human' : author;
  const [confirming, setConfirming] = useState(defaultConfirming);
  const confirmId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const close = () => { setConfirming(false); trigger.current?.focus(); };
  const onTrigger = (e: MouseEvent<HTMLButtonElement>) => {
    if (confirmMessage == null) { onRestore?.(e); return; }
    setConfirming(true);
    // The safe choice takes focus; Restore is one deliberate Tab away.
    queueMicrotask(() => cancel.current?.focus());
  };
  const onConfirmKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); }
  };
  const label = typeof title === 'string' ? `${restoreLabel} ${title}` : undefined;
  return (
    <li data-slot="checkpoint-timeline-item" data-author={author} aria-current={selected ? 'true' : undefined} className={cn(checkpointTimelineItem(), className)} {...props}>
      <span data-slot="checkpoint-timeline-connector" aria-hidden="true" className={checkpointTimelineConnector()} />
      <span data-slot="checkpoint-timeline-node" aria-hidden="true" className={checkpointTimelineNode({ selected })}>
        <span data-slot="checkpoint-timeline-dot" className={checkpointTimelineDot({ author: dotAuthor, selected, running })} />
      </span>
      <div data-slot="checkpoint-timeline-body" className={checkpointTimelineBody()}>
        <b data-slot="checkpoint-timeline-title" className={checkpointTimelineTitle()}>{title}</b>
        {detail != null && <span data-slot="checkpoint-timeline-detail" className={checkpointTimelineDetail()}>{detail}</span>}
      </div>
      {selected ? (
        <Button
          ref={trigger} data-slot="checkpoint-timeline-action" tone="ghost" size="xs" onClick={onTrigger}
          aria-label={label} aria-expanded={confirmMessage == null ? undefined : confirming} aria-controls={confirming ? confirmId : undefined}
        >{restoreLabel}</Button>
      ) : time != null && (
        <time data-slot="checkpoint-timeline-time" dateTime={dateTime} className={checkpointTimelineTime()}>{time}</time>
      )}
      {selected && confirming && confirmMessage != null && (
        <div id={confirmId} role="group" aria-label={label} data-slot="checkpoint-timeline-confirm" className={checkpointTimelineConfirm()} onKeyDown={onConfirmKeyDown}>
          <p data-slot="checkpoint-timeline-confirm-message" className="m-0 text-ui-sm font-normal text-text-secondary">{confirmMessage}</p>
          <div data-slot="checkpoint-timeline-confirm-actions" className="flex flex-wrap justify-end gap-1.5">
            <Button ref={cancel} data-slot="checkpoint-timeline-cancel" tone="ghost" size="xs" onClick={close}>{cancelLabel}</Button>
            <Button data-slot="checkpoint-timeline-confirm-action" tone="destructive" size="xs" onClick={e => { setConfirming(false); onRestore?.(e); }}>{restoreLabel}</Button>
          </div>
        </div>
      )}
    </li>
  );
}
