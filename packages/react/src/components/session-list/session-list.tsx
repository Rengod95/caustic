'use client';
import { Check } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import {
  sessionListButton, sessionListCheck, sessionListDot, sessionListItem, sessionListMeta, sessionListOrb,
  sessionListStatus, sessionListTitle, sessionListVariants,
} from './session-list.variants.ts';

export type SessionStatus = 'running' | 'review' | 'failed' | 'done';

export interface SessionListItemProps extends Omit<ComponentProps<'button'>, 'title'> {
  /** Session status. */
  status?: SessionStatus;
  /** The open session: pressed fill, medium weight, aria-current. */
  current?: boolean;
  /** Title. */
  title: ReactNode;
  /** Time or status word. */
  meta?: ReactNode;
}

export interface SessionListProps extends Omit<ComponentProps<'ul'>, 'children' | 'title'>, Partial<Pick<SessionListItemProps, 'status' | 'current' | 'title' | 'meta'>> {
  /** Accessible name of the list. */
  'aria-label': string;
  children?: ReactNode;
}

const STATUS_WORD: Record<SessionStatus, string> = { running: 'Running', review: 'Needs review', failed: 'Failed', done: 'Done' };

/**
 * A compact list of agent sessions. Compose with SessionListItem.
 * Item props (status, current, title, meta) belong to SessionListItem and are not applied here.
 */
export function SessionList({ status: _s, current: _c, title: _t, meta: _m, className, ...props }: SessionListProps) {
  return <ul data-slot="session-list" role="list" className={cn(sessionListVariants(), className)} {...props} />;
}

/** One session row. The orb shows only for the running status (the agent is working). */
export function SessionListItem({ status = 'done', current = false, title, meta, className, ...props }: SessionListItemProps) {
  return (
    <li data-slot="session-list-item" className={sessionListItem()}>
      <button
        type="button" data-slot="session-list-button" data-status={status}
        aria-current={current ? 'true' : undefined}
        className={cn(sessionListButton(), className)} {...props}
      >
        <span data-slot="session-list-status" aria-hidden="true" className={sessionListStatus({ status })}>
          {status === 'running' && <span className={sessionListOrb({ status })} />}
          {(status === 'review' || status === 'failed') && <span className={sessionListDot()} />}
          {status === 'done' && <Check className={sessionListCheck()} />}
        </span>
        <span data-slot="session-list-title" className={sessionListTitle()}>
          <span className="sr-only">{STATUS_WORD[status]}: </span>{title}
        </span>
        {meta != null && <span data-slot="session-list-meta" className={sessionListMeta()}>{meta}</span>}
      </button>
    </li>
  );
}
