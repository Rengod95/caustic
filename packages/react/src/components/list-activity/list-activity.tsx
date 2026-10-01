'use client';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import {
  listActivityBody, listActivityIcon, listActivityItem, listActivityMarker, listActivityQuote,
  listActivityStrong, listActivityTime, listActivityVariants,
} from './list-activity.variants.ts';

export interface ListActivityProps extends ComponentProps<'ol'> {
  'aria-label'?: string;
}

/** An activity feed: who did what and when, newest first, joined by a thin vertical line. Compose with ListActivityItem. */
export function ListActivity({ 'aria-label': ariaLabel = 'Activity', className, children, ...props }: ListActivityProps) {
  return (
    <ol data-slot="list-activity" aria-label={ariaLabel} className={cn(listActivityVariants(), className)} {...props}>
      {children}
    </ol>
  );
}

export interface ListActivityItemProps extends Omit<ComponentProps<'li'>, 'children'> {
  /** Avatar md for the marker (person or agent). */
  avatar?: ReactNode;
  /** Glyph for the icon disc; use instead of avatar for system events. */
  icon?: ReactNode;
  /** Quoted comment under the sentence. */
  quote?: ReactNode;
  /** Relative time text. */
  time: ReactNode;
  /** ISO 8601 value for the time element. */
  dateTime?: string;
  /** The sentence; wrap the actor and the object in ListActivityStrong. */
  children: ReactNode;
}

export function ListActivityItem({ avatar, icon, quote, time, dateTime, children, className, ...props }: ListActivityItemProps) {
  return (
    <li data-slot="list-activity-item" className={cn(listActivityItem(), className)} {...props}>
      <span data-slot="list-activity-marker" className={listActivityMarker()}>
        {avatar != null ? avatar : (
          <span data-slot="list-activity-icon" aria-hidden="true" className={listActivityIcon()}>{icon}</span>
        )}
      </span>
      <div data-slot="list-activity-body" className={listActivityBody()}>
        {children}
        {quote != null && <div data-slot="list-activity-quote" className={listActivityQuote()}>{quote}</div>}
        <time data-slot="list-activity-time" dateTime={dateTime} className={listActivityTime()}>{time}</time>
      </div>
    </li>
  );
}

/** The actor or the object inside the sentence. */
export function ListActivityStrong({ className, ...props }: ComponentProps<'strong'>) {
  return <strong data-slot="list-activity-strong" className={cn(listActivityStrong(), className)} {...props} />;
}
