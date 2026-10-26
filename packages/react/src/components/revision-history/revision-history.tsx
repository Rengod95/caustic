'use client';
import { Check } from 'lucide-react';
import { createContext, useContext, useId, useRef, type ComponentProps, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Button } from '../button/button.tsx';
import {
  revisionHistoryCheckVariants, revisionHistoryDetailVariants, revisionHistoryFooterVariants, revisionHistoryGlyphVariants, revisionHistoryItemVariants,
  revisionHistoryListVariants, revisionHistoryNodeVariants, revisionHistoryNoteVariants, revisionHistorySpineVariants,
  revisionHistoryTextVariants, revisionHistoryTimeVariants, revisionHistoryTitleVariants, revisionHistoryVariants,
} from './revision-history.variants.ts';

interface Ctx { value: string; select: (id: string) => void }
const HistoryCtx = createContext<Ctx | null>(null);

export interface RevisionHistoryProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Accessible name of the list. */
  'aria-label': string;
  value?: string;
  defaultValue?: string;
  /** A different revision is chosen. */
  onValueChange?: (id: string) => void;
  /** Footer note: why Restore may be unavailable. */
  note?: ReactNode;
  restoreLabel?: string;
  restoreDisabled?: boolean;
  /** Restore is activated. */
  onRestore?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** The revision list of the history panel: a single-choice listbox on a spine with one Restore action for the chosen revision. */
export function RevisionHistory({
  'aria-label': ariaLabel, value, defaultValue = '', onValueChange, note, restoreLabel = 'Restore this version', restoreDisabled = false,
  onRestore, className, children, ...props
}: RevisionHistoryProps) {
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const listRef = useRef<HTMLDivElement>(null);
  const noteId = useId();
  // Selection follows focus: arrows and Home/End choose the revision they move to.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = [...(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])];
    if (!items.length) return;
    const i = items.findIndex(el => el === document.activeElement);
    const next = e.key === 'ArrowDown' ? items[(i + 1) % items.length]
      : e.key === 'ArrowUp' ? items[(i - 1 + items.length) % items.length]
      : e.key === 'Home' ? items[0]
      : e.key === 'End' ? items[items.length - 1]
      : undefined;
    if (!next) return;
    e.preventDefault();
    next.focus();
    if (next.dataset.itemId !== undefined) setCurrent(next.dataset.itemId);
  };
  return (
    <HistoryCtx.Provider value={{ value: current, select: setCurrent }}>
      <div data-slot="revision-history" className={cn(revisionHistoryVariants(), className)} {...props}>
        <div ref={listRef} role="listbox" aria-label={ariaLabel} data-slot="revision-history-list" className={revisionHistoryListVariants()} onKeyDown={onKeyDown}>
          {children}
        </div>
        <div data-slot="revision-history-footer" className={revisionHistoryFooterVariants()}>
          {note != null && <span id={noteId} data-slot="revision-history-note" className={revisionHistoryNoteVariants()}>{note}</span>}
          <Button
            data-slot="revision-history-action" size="xs" disabled={restoreDisabled} onClick={onRestore}
            aria-describedby={note != null ? noteId : undefined} className="ml-auto"
          >{restoreLabel}</Button>
        </div>
      </div>
    </HistoryCtx.Provider>
  );
}

export interface RevisionHistoryItemProps extends Omit<ComponentProps<'div'>, 'title' | 'children'> {
  /** Identity of the revision (value). */
  itemId: string;
  /** Who made the revision; agent = rotating spectrum dot. */
  author?: 'human' | 'agent';
  title: ReactNode;
  /** One-line summary. */
  detail?: ReactNode;
  /** Time label. */
  time: ReactNode;
  /** ISO value for the time element. */
  dateTime?: string;
  /** State hook for fixtures; normally derived from value. */
  selected?: boolean;
}

export function RevisionHistoryItem({ itemId, author = 'human', title, detail, time, dateTime, selected, className, onClick, onKeyDown, ...props }: RevisionHistoryItemProps) {
  const ctx = useContext(HistoryCtx);
  const chosen = selected ?? ctx?.value === itemId;
  const nodeAuthor = chosen ? 'human' : author;
  return (
    <div
      role="option" tabIndex={chosen || !ctx?.value ? 0 : -1} aria-selected={chosen} data-slot="revision-history-item" data-item-id={itemId} data-author={author}
      className={cn(revisionHistoryItemVariants(), className)}
      onClick={e => { onClick?.(e); if (!e.defaultPrevented) ctx?.select(itemId); }}
      onKeyDown={e => { onKeyDown?.(e); if (!e.defaultPrevented && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); ctx?.select(itemId); } }}
      {...props}
    >
      <span data-slot="revision-history-glyph" aria-hidden="true" className={revisionHistoryGlyphVariants()}>
        <span data-slot="revision-history-spine" className={revisionHistorySpineVariants()} />
        <i data-slot="revision-history-node" className={revisionHistoryNodeVariants({ author: nodeAuthor, selected: chosen })} />
      </span>
      <span data-slot="revision-history-text" className={revisionHistoryTextVariants()}>
        <b data-slot="revision-history-title" className={revisionHistoryTitleVariants()}>{title}</b>
        {detail != null && <span data-slot="revision-history-detail" className={revisionHistoryDetailVariants()}>{detail}</span>}
      </span>
      <time data-slot="revision-history-time" dateTime={dateTime} className={revisionHistoryTimeVariants()}>{time}</time>
      <span data-slot="revision-history-check" aria-hidden="true" className={revisionHistoryCheckVariants()}>{chosen && <Check />}</span>
    </div>
  );
}
