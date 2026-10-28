'use client';
import { Check } from 'lucide-react';
import { createContext, useContext, useId, useRef, useState, type ComponentProps, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Size, Tone, Variant } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Button } from '../button/button.tsx';
import {
  timelineBodyVariants, timelineCheckVariants, timelineConfirmVariants, timelineDetailVariants, timelineDotVariants, timelineFooterVariants,
  timelineIconVariants, timelineItemVariants, timelineListVariants, timelineMarkerBodyVariants, timelineMarkerItemVariants, timelineMarkerSpineVariants,
  timelineMarkerTimeVariants, timelineMarkerVariants, timelineNodeVariants, timelineNoteVariants, timelineQuoteVariants, timelineRowDetailVariants,
  timelineRowDotVariants, timelineRowListVariants, timelineRowNodeVariants, timelineRowSpineVariants, timelineRowTimeVariants, timelineRowTitleVariants,
  timelineRowVariants, timelineSpineVariants, timelineStrongVariants, timelineTimeVariants, timelineTitleVariants, timelineVariants,
} from './timeline.variants.ts';

type Restore = 'none' | 'item' | 'footer';

interface Ctx {
  tone?: Tone | undefined;
  variant?: Variant | undefined;
  size?: Size | undefined;
  single: boolean;
  restore: Restore;
  value: string;
  select: (id: string) => void;
  restoreLabel: string;
  cancelLabel: string;
  restoreDisabled: boolean;
  onRestore?: ((event: MouseEvent<HTMLButtonElement>) => void) | undefined;
}
const TimelineContext = createContext<Ctx>({ single: false, restore: 'none', value: '', select: () => {}, restoreLabel: 'Restore', cancelLabel: 'Cancel', restoreDisabled: false });

export interface TimelineProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'>, CommonProps {
  /** Accessible name of the list. */
  'aria-label': string;
  /** none = a read-only list (default); single = the entries are a single-choice listbox (selection follows focus). */
  selectionMode?: 'none' | 'single';
  /** Controlled id (TimelineItem itemId) of the chosen entry. */
  value?: string;
  defaultValue?: string;
  /** A different entry is chosen (selectionMode="single"). */
  onValueChange?: (id: string) => void;
  /** none (default); item = Restore on the selected entry, with an opt-in confirm step; footer = one Restore under the list for the chosen entry. */
  restore?: Restore;
  /** Label of Restore; default "Restore" (item) or "Restore this version" (footer). */
  restoreLabel?: string;
  /** Label of the cancel button of the item confirm step. */
  cancelLabel?: string;
  /** Disables the footer Restore (the note says why). */
  restoreDisabled?: boolean;
  /** Footer note: why Restore may be unavailable. Shows the footer even without restore="footer". */
  note?: ReactNode;
  /** Restore is activated (footer), or confirmed (item; activated when the item has no confirmMessage). */
  onRestore?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** A history timeline, newest first: checkpoints, revisions or an activity feed on one spine. Compose with TimelineItem; item props belong to the item. */
export function Timeline({
  'aria-label': ariaLabel, selectionMode = 'none', value, defaultValue = '', onValueChange, restore = 'none', restoreLabel, cancelLabel = 'Cancel',
  restoreDisabled = false, note, onRestore, tone, variant, radius, shadow, size, className, children, ...props
}: TimelineProps) {
  const single = selectionMode === 'single';
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const listRef = useRef<HTMLOListElement>(null);
  const noteId = useId();
  const label = restoreLabel ?? (restore === 'footer' ? 'Restore this version' : 'Restore');
  // Selection follows focus: arrows and Home/End choose the entry they move to.
  const onKeyDown = (e: KeyboardEvent<HTMLOListElement>) => {
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
    <TimelineContext.Provider value={{ tone, variant, size, single, restore, value: current, select: setCurrent, restoreLabel: label, cancelLabel, restoreDisabled, onRestore }}>
      <div data-slot="timeline" data-selection-mode={selectionMode} className={cn(timelineVariants({ radius, shadow }), className)} {...props}>
        <ol
          ref={listRef} role={single ? 'listbox' : undefined} aria-label={ariaLabel} data-slot="timeline-list"
          className={cn(timelineListVariants(), single && timelineRowListVariants())} onKeyDown={single ? onKeyDown : undefined}
        >
          {children}
        </ol>
        {(restore === 'footer' || note != null) && (
          <div data-slot="timeline-footer" className={cn(timelineFooterVariants())}>
            {note != null && <span id={noteId} data-slot="timeline-note" className={cn(timelineNoteVariants())}>{note}</span>}
            {restore === 'footer' && (
              <Button
                data-slot="timeline-footer-action" size={size === 'lg' ? 'sm' : 'xs'} disabled={restoreDisabled} onClick={onRestore}
                aria-describedby={note != null ? noteId : undefined} className="ml-auto"
              >{label}</Button>
            )}
          </div>
        )}
      </div>
    </TimelineContext.Provider>
  );
}

export interface TimelineItemProps extends Omit<ComponentProps<'li'>, 'title'> {
  /** Identity of the entry: the value in selectionMode="single"; rendered as data-item-id. */
  itemId?: string;
  /** Who made the entry: agent = the spectrum node; system = a published or imported event (neutral node, like human). */
  author?: 'human' | 'agent' | 'system';
  /** An Avatar (person or agent) in the marker column; the entry then reads as a feed sentence. */
  marker?: ReactNode;
  /** Glyph for an icon disc in the marker column (system events); use instead of marker. */
  icon?: ReactNode;
  /** Colour family of this entry's mark (icon disc, selected node, row); defaults to the timeline tone. */
  tone?: Tone;
  /** Emphasis of this entry's mark; defaults to the timeline variant. */
  variant?: Variant;
  /** Title ("Caustic · spacing and radius"). */
  title?: ReactNode;
  /** One-line summary. */
  detail?: ReactNode;
  /** Quoted comment under the sentence. */
  quote?: ReactNode;
  /** Time label; omit on the selected entry of restore="item". */
  time?: ReactNode;
  /** ISO value for the time element. */
  dateTime?: string;
  /** The agent is working on this entry right now: the only state where the spectrum node rotates. */
  running?: boolean;
  /** The entry being previewed (aria-current; in selectionMode="single" normally derived from value). */
  selected?: boolean;
  /** Opt-in confirm step of the item Restore: what will be undone, and that it can be undone again. */
  confirmMessage?: ReactNode;
  /** Open the confirm step on first render (docs and tests). */
  defaultConfirming?: boolean;
  /** The sentence of a feed entry; wrap the actor and the object in TimelineStrong. */
  children?: ReactNode;
}

export function TimelineItem(props: TimelineItemProps) {
  const ctx = useContext(TimelineContext);
  if (ctx.single) return <RowItem {...props} />;
  if (props.marker != null || props.icon != null) return <MarkerItem {...props} />;
  return <NodeItem {...props} />;
}

/** Node layout (was CheckpointTimeline): node dot, title and detail, trailing time or the item Restore. */
function NodeItem({
  itemId, author = 'human', marker: _marker, icon: _icon, tone: itemTone, variant: itemVariant, title, detail, quote, time, dateTime, running = false,
  selected: selectedProp, confirmMessage, defaultConfirming = false, children, className, ...props
}: TimelineItemProps) {
  const ctx = useContext(TimelineContext);
  const tone = itemTone ?? ctx.tone, variant = itemVariant ?? ctx.variant, size = ctx.size;
  const selected = selectedProp ?? (itemId != null && ctx.value === itemId);
  const dotAuthor = selected ? 'human' : author;
  const [confirming, setConfirming] = useState(defaultConfirming);
  const confirmId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const showAction = selected && ctx.restore === 'item';
  const close = () => { setConfirming(false); trigger.current?.focus(); };
  const onTrigger = (e: MouseEvent<HTMLButtonElement>) => {
    if (confirmMessage == null) { ctx.onRestore?.(e); return; }
    setConfirming(true);
    // The safe choice takes focus; Restore is one deliberate Tab away.
    queueMicrotask(() => cancel.current?.focus());
  };
  const onConfirmKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); }
  };
  const label = typeof title === 'string' ? `${ctx.restoreLabel} ${title}` : undefined;
  return (
    <li data-slot="timeline-item" data-layout="node" data-author={author} data-item-id={itemId} aria-current={selected ? 'true' : undefined} className={cn(timelineItemVariants({ size }), className)} {...props}>
      <span data-slot="timeline-spine" aria-hidden="true" className={cn(timelineSpineVariants({ size }))} />
      <span data-slot="timeline-node" aria-hidden="true" className={cn(timelineNodeVariants({ selected, tone, variant, size }))}>
        <span data-slot="timeline-dot" className={cn(timelineDotVariants({ author: dotAuthor, selected, running, tone, variant, size }))} />
      </span>
      <div data-slot="timeline-body" className={cn(timelineBodyVariants())}>
        {title != null && <b data-slot="timeline-title" className={cn(timelineTitleVariants({ size }))}>{title}</b>}
        {detail != null && <span data-slot="timeline-detail" className={cn(timelineDetailVariants({ size }))}>{detail}</span>}
        {children}
        {quote != null && <div data-slot="timeline-quote" className={cn(timelineQuoteVariants())}>{quote}</div>}
      </div>
      {showAction ? (
        <Button
          ref={trigger} data-slot="timeline-action" tone="ghost" size="xs" onClick={onTrigger}
          aria-label={label} aria-expanded={confirmMessage == null ? undefined : confirming} aria-controls={confirming ? confirmId : undefined}
        >{ctx.restoreLabel}</Button>
      ) : time != null && (
        <time data-slot="timeline-time" dateTime={dateTime} className={cn(timelineTimeVariants({ size }))}>{time}</time>
      )}
      {showAction && confirming && confirmMessage != null && (
        <div id={confirmId} role="group" aria-label={label} data-slot="timeline-confirm" className={cn(timelineConfirmVariants())} onKeyDown={onConfirmKeyDown}>
          <p data-slot="timeline-confirm-message" className="m-0 text-ui-sm font-normal text-text-secondary">{confirmMessage}</p>
          <div data-slot="timeline-confirm-actions" className="flex flex-wrap justify-end gap-1.5">
            <Button ref={cancel} data-slot="timeline-cancel" tone="ghost" size="xs" onClick={close}>{ctx.cancelLabel}</Button>
            <Button data-slot="timeline-confirm-action" tone="destructive" size="xs" onClick={e => { setConfirming(false); ctx.onRestore?.(e); }}>{ctx.restoreLabel}</Button>
          </div>
        </div>
      )}
    </li>
  );
}

/** Row layout (was RevisionHistory): an option of the single-choice listbox; the chosen entry inverts and shows the check. */
function RowItem({
  itemId = '', author = 'human', marker: _marker, icon: _icon, tone: itemTone, variant: itemVariant, title, detail, quote, time, dateTime, running = false,
  selected: selectedProp, confirmMessage: _confirm, defaultConfirming: _open, children, className, onClick, onKeyDown, ...props
}: TimelineItemProps) {
  const ctx = useContext(TimelineContext);
  const tone = itemTone ?? ctx.tone, variant = itemVariant ?? ctx.variant, size = ctx.size;
  const chosen = selectedProp ?? ctx.value === itemId;
  const dotAuthor = chosen ? 'human' : author;
  return (
    <li
      role="option" tabIndex={chosen || !ctx.value ? 0 : -1} aria-selected={chosen} data-slot="timeline-item" data-layout="row" data-item-id={itemId} data-author={author}
      className={cn(timelineRowVariants({ tone, variant, size }), className)}
      onClick={e => { onClick?.(e); if (!e.defaultPrevented) ctx.select(itemId); }}
      onKeyDown={e => { onKeyDown?.(e); if (!e.defaultPrevented && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); ctx.select(itemId); } }}
      {...props}
    >
      <span data-slot="timeline-spine" aria-hidden="true" className={cn(timelineRowSpineVariants())} />
      <span data-slot="timeline-node" aria-hidden="true" className={cn(timelineRowNodeVariants())}>
        <span data-slot="timeline-dot" className={cn(timelineRowDotVariants({ author: dotAuthor, selected: chosen, running, tone }))} />
      </span>
      <div data-slot="timeline-body" className="grid min-w-0">
        {title != null && <b data-slot="timeline-title" className={cn(timelineRowTitleVariants({ size }))}>{title}</b>}
        {detail != null && <span data-slot="timeline-detail" className={cn(timelineRowDetailVariants())}>{detail}</span>}
        {children}
        {quote != null && <div data-slot="timeline-quote" className={cn(timelineQuoteVariants())}>{quote}</div>}
      </div>
      {time != null ? <time data-slot="timeline-time" dateTime={dateTime} className={cn(timelineRowTimeVariants())}>{time}</time> : <span />}
      <span data-slot="timeline-check" aria-hidden="true" className={cn(timelineCheckVariants())}>{chosen && <Check />}</span>
    </li>
  );
}

/** Marker layout (was ListActivity): an Avatar or an icon disc, the sentence, an optional quote and the time under it. */
function MarkerItem({
  itemId, author = 'human', marker, icon, tone: itemTone, variant: itemVariant, title, detail, quote, time, dateTime, running: _running,
  selected: selectedProp, confirmMessage: _confirm, defaultConfirming: _open, children, className, ...props
}: TimelineItemProps) {
  const ctx = useContext(TimelineContext);
  const tone = itemTone ?? ctx.tone, variant = itemVariant ?? ctx.variant, size = ctx.size;
  const selected = selectedProp ?? (itemId != null && ctx.value === itemId);
  return (
    <li data-slot="timeline-item" data-layout="marker" data-author={author} data-item-id={itemId} aria-current={selected ? 'true' : undefined} className={cn(timelineMarkerItemVariants({ size }), className)} {...props}>
      <span data-slot="timeline-spine" aria-hidden="true" className={cn(timelineMarkerSpineVariants({ size }))} />
      <span data-slot="timeline-marker" className={cn(timelineMarkerVariants({ size }))}>
        {marker != null ? marker : (
          <span data-slot="timeline-icon" aria-hidden="true" className={cn(timelineIconVariants({ tone, variant, size }))}>{icon}</span>
        )}
      </span>
      <div data-slot="timeline-body" className={cn(timelineMarkerBodyVariants({ size }))}>
        {title != null && <b data-slot="timeline-title" className={cn(timelineTitleVariants({ size }))}>{title}</b>}
        {detail != null && <span data-slot="timeline-detail" className={cn(timelineDetailVariants({ size }))}>{detail}</span>}
        {children}
        {quote != null && <div data-slot="timeline-quote" className={cn(timelineQuoteVariants())}>{quote}</div>}
        {time != null && <time data-slot="timeline-time" dateTime={dateTime} className={cn(timelineMarkerTimeVariants())}>{time}</time>}
      </div>
    </li>
  );
}

/** The actor or the object inside a feed sentence. */
export function TimelineStrong({ className, ...props }: ComponentProps<'strong'>) {
  return <strong data-slot="timeline-strong" className={cn(timelineStrongVariants(), className)} {...props} />;
}
