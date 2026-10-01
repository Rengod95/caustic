'use client';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Button } from '../button/button.tsx';
import {
  checkpointTimelineBody, checkpointTimelineConnector, checkpointTimelineDetail, checkpointTimelineDot, checkpointTimelineItem, checkpointTimelineNode,
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
  /** Label of the action. */
  restoreLabel?: string;
  /** Restore is activated. */
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
  author = 'human', selected = false, title, detail, time, dateTime, restoreLabel = 'Restore', onRestore, className, ...props
}: CheckpointTimelineItemProps) {
  const dotAuthor = selected ? 'human' : author;
  return (
    <li data-slot="checkpoint-timeline-item" data-author={author} aria-current={selected ? 'true' : undefined} className={cn(checkpointTimelineItem(), className)} {...props}>
      <span data-slot="checkpoint-timeline-connector" aria-hidden="true" className={checkpointTimelineConnector()} />
      <span data-slot="checkpoint-timeline-node" aria-hidden="true" className={checkpointTimelineNode({ selected })}>
        <span data-slot="checkpoint-timeline-dot" className={checkpointTimelineDot({ author: dotAuthor, selected })} />
      </span>
      <div data-slot="checkpoint-timeline-body" className={checkpointTimelineBody()}>
        <b data-slot="checkpoint-timeline-title" className={checkpointTimelineTitle()}>{title}</b>
        {detail != null && <span data-slot="checkpoint-timeline-detail" className={checkpointTimelineDetail()}>{detail}</span>}
      </div>
      {selected ? (
        <Button
          data-slot="checkpoint-timeline-action" tone="ghost" size="xs" onClick={onRestore}
          aria-label={typeof title === 'string' ? `${restoreLabel} ${title}` : undefined}
        >{restoreLabel}</Button>
      ) : time != null && (
        <time data-slot="checkpoint-timeline-time" dateTime={dateTime} className={checkpointTimelineTime()}>{time}</time>
      )}
    </li>
  );
}
