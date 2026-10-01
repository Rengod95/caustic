'use client';
import { GripVertical } from 'lucide-react';
import {
  Children, createContext, isValidElement, useContext, useId, useLayoutEffect, useRef, useState,
  type ComponentProps, type KeyboardEvent, type PointerEvent, type ReactElement, type ReactNode,
} from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import {
  listDescriptionVariants, listEndVariants, listHeadingVariants, listItemsVariants, listTextVariants, listTitleVariants, listVariants,
} from '../list/list.variants.ts';
import { listReorderHandleVariants, listReorderIndexVariants, listReorderRowVariants } from './list-reorder.variants.ts';

export interface ListReorderEvent { id: string; from: number; to: number; order: string[] }

type Drop = { id: string; edge: 'above' | 'below' };

interface Ctx {
  shown: string[];
  numbered: boolean;
  picked: string | null;
  dragId: string | null;
  drop: Drop | null;
  instructionId: string;
  startPointer: (e: PointerEvent<HTMLElement>, id: string, disabled: boolean) => void;
  movePointer: (e: PointerEvent<HTMLElement>) => void;
  endPointer: (e: PointerEvent<HTMLElement>) => void;
  cancelPointer: (e: PointerEvent<HTMLElement>) => void;
  handleKey: (e: KeyboardEvent<HTMLButtonElement>, id: string) => void;
  handleClick: (id: string) => void;
  handleBlur: (id: string, el: HTMLElement) => void;
}
const ReorderContext = createContext<Ctx | null>(null);

export interface ListReorderItemProps extends Omit<ComponentProps<'li'>, 'title'> {
  /** Stable identity of the item (key, order array and announcements); rendered as data-item-id. */
  itemId: string;
  /** Item label; also used in the handle name and announcements. */
  title: ReactNode;
  /** One line under the title. */
  description?: ReactNode;
  /** Trailing content. */
  end?: ReactNode;
  /** The item cannot be moved; other items skip over it. */
  disabled?: boolean;
  /** State hook for fixtures and tests: renders the dragged look on this item. Normally set internally. */
  dragging?: boolean;
}

export interface ListReorderProps extends Omit<ComponentProps<'div'>, 'title' | 'defaultValue'> {
  /** Controlled order: the item ids from first to last. */
  order?: string[];
  /** Uncontrolled initial order. Defaults to the order of the children. */
  defaultOrder?: string[];
  /** Reports a drop at a new position; not called for a drop in place or a cancel. */
  onReorder?: (event: ListReorderEvent) => void;
  /** Caption inside the surface; also the accessible name. */
  heading?: ReactNode;
  /** Accessible name when there is no heading. */
  'aria-label'?: string;
  /** Show the position badge. */
  numbered?: boolean;
}

const text = (title: ReactNode, id: string) => (typeof title === 'string' ? title : id);

/**
 * A grouped list whose items can be reordered by pointer drag or from a keyboard handle.
 */
export function ListReorder({
  order, defaultOrder, onReorder, heading, 'aria-label': ariaLabel, numbered = false,
  className, children, ...props
}: ListReorderProps) {
  const headingId = useId();
  const instructionId = useId();
  const root = useRef<HTMLDivElement>(null);

  const nodes = Children.toArray(children)
    .filter((c): c is ReactElement<ListReorderItemProps> => isValidElement(c));
  const ids = nodes.map(n => n.props.itemId);
  const [stored, setOrder] = useControllableState<string[]>({ value: order, defaultValue: defaultOrder ?? ids });
  const resolve = (o: string[]) => [...o.filter(id => ids.includes(id)), ...ids.filter(id => !o.includes(id))];

  // Keyboard pick up works on a live preview; pointer drag only shows a line and commits on release.
  const [preview, setPreview] = useState<string[] | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const pickedRef = useRef<{ id: string; from: number; original: string[] } | null>(null);
  const [drag, setDrag] = useState<{ id: string; drop: Drop | null } | null>(null);
  const [message, setMessage] = useState('');
  const shown = preview ?? resolve(stored);
  const byId = new Map(nodes.map(n => [n.props.itemId, n.props]));
  const label = (id: string) => text(byId.get(id)?.title, id);
  const isDisabled = (id: string) => !!byId.get(id)?.disabled;
  const pos = (list: string[], id: string) => `position ${list.indexOf(id) + 1} of ${list.length}`;

  const commit = (id: string, from: number, next: string[]) => {
    const to = next.indexOf(id);
    setOrder(next);
    if (to !== from) onReorder?.({ id, from, to, order: next });
    setMessage(`Dropped at ${pos(next, id)}`);
  };

  // ── keyboard
  const cancelPick = () => {
    const p = pickedRef.current; if (!p) return;
    pickedRef.current = null; setPicked(null); setPreview(null);
    setMessage(`Cancelled, back at ${pos(p.original, p.id)}`);
  };
  const dropPick = () => {
    const p = pickedRef.current; if (!p) return;
    const next = preview ?? p.original;
    pickedRef.current = null; setPicked(null); setPreview(null);
    commit(p.id, p.from, next);
  };
  const moveTo = (id: string, target: number) => {
    const list = preview ?? shown;
    const at = list.indexOf(id);
    if (target === at) return;
    const without = list.filter(x => x !== id);
    const next = [...without.slice(0, target), id, ...without.slice(target)];
    setPreview(next);
    setMessage(`Moved to ${pos(next, id)}`);
  };
  const step = (id: string, dir: 1 | -1) => {
    const list = preview ?? shown;
    let t = list.indexOf(id) + dir;
    while (t >= 0 && t < list.length && isDisabled(list[t]!)) t += dir;
    if (t < 0 || t >= list.length) return;
    moveTo(id, t);
  };
  const edge = (id: string, dir: 1 | -1) => {
    const list = preview ?? shown;
    const free = list.map((x, i) => (x === id || !isDisabled(x) ? i : -1)).filter(i => i >= 0);
    moveTo(id, dir === 1 ? free[free.length - 1]! : free[0]!);
  };
  const handleKey = (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (pickedRef.current?.id === id) {
      if (e.key === 'ArrowUp') { e.preventDefault(); step(id, -1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); step(id, 1); }
      else if (e.key === 'Home') { e.preventDefault(); edge(id, -1); }
      else if (e.key === 'End') { e.preventDefault(); edge(id, 1); }
      else if (e.key === 'Escape') { e.preventDefault(); cancelPick(); }
      return;
    }
    if (pickedRef.current) return;
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const handles = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-slot="list-reorder-handle"]') ?? []);
    const at = handles.indexOf(e.currentTarget);
    handles[at + (e.key === 'ArrowDown' ? 1 : -1)]?.focus();
  };
  const handleClick = (id: string) => {
    if (pickedRef.current?.id === id) { dropPick(); return; }
    if (pickedRef.current || isDisabled(id)) return;
    const original = resolve(stored);
    pickedRef.current = { id, from: original.indexOf(id), original };
    setPicked(id); setPreview(original);
    setMessage(`Picked up ${label(id)}, ${pos(original, id)}`);
  };
  // Losing focus while picked up cancels. The check is deferred because moving a row can blur it for a moment.
  const handleBlur = (id: string, el: HTMLElement) => {
    window.setTimeout(() => { if (pickedRef.current?.id === id && document.activeElement !== el) cancelPick(); }, 0);
  };
  useLayoutEffect(() => {
    if (!picked) return;
    const row = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-item-id]') ?? []).find(r => r.dataset.itemId === picked);
    row?.querySelector<HTMLElement>('[data-slot="list-reorder-handle"]')?.focus();
  }, [preview, picked]);

  // ── pointer
  const pointer = useRef<{ id: string; pid: number; x: number; y: number; active: boolean; drop: Drop | null } | null>(null);
  const startPointer = (e: PointerEvent<HTMLElement>, id: string, off: boolean) => {
    if (e.button !== 0 || off || pickedRef.current) return;
    const t = e.target as HTMLElement;
    const onHandle = !!t.closest('[data-slot="list-reorder-handle"]');
    if (!onHandle && (e.pointerType === 'touch' || t.closest('button, a, input, select, textarea, [role="switch"]'))) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointer.current = { id, pid: e.pointerId, x: e.clientX, y: e.clientY, active: false, drop: null };
  };
  const scrollParent = (el: HTMLElement | null) => {
    for (let n = el?.parentElement; n; n = n.parentElement) { const o = getComputedStyle(n).overflowY; if (o === 'auto' || o === 'scroll') return n; }
    return null;
  };
  const movePointer = (e: PointerEvent<HTMLElement>) => {
    const p = pointer.current; if (!p || p.pid !== e.pointerId) return;
    if (!p.active) {
      if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < 4) return;
      p.active = true;
    }
    const box = root.current!.getBoundingClientRect();
    let drop: Drop | null = null;
    if (e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom) {
      const rows = Array.from(root.current!.querySelectorAll<HTMLElement>('[data-slot="list-reorder-row"]'));
      const hit = rows.find(r => { const b = r.getBoundingClientRect(); return e.clientY >= b.top && e.clientY <= b.bottom; });
      if (hit && hit.dataset.itemId !== p.id) {
        const b = hit.getBoundingClientRect();
        drop = { id: hit.dataset.itemId!, edge: e.clientY < b.top + b.height / 2 ? 'above' : 'below' };
      }
    }
    p.drop = drop;
    setDrag({ id: p.id, drop });
    const sp = scrollParent(root.current);
    if (sp) {
      const r = sp.getBoundingClientRect();
      if (e.clientY < r.top + 32) sp.scrollTop -= 8; else if (e.clientY > r.bottom - 32) sp.scrollTop += 8;
    }
  };
  const endPointer = (e: PointerEvent<HTMLElement>) => {
    const p = pointer.current; if (!p || p.pid !== e.pointerId) return;
    pointer.current = null; setDrag(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (!p.active || !p.drop) return;
    const list = resolve(stored);
    const from = list.indexOf(p.id);
    const without = list.filter(x => x !== p.id);
    const at = without.indexOf(p.drop.id) + (p.drop.edge === 'below' ? 1 : 0);
    commit(p.id, from, [...without.slice(0, at), p.id, ...without.slice(at)]);
  };
  const cancelPointer = (e: PointerEvent<HTMLElement>) => {
    if (pointer.current?.pid !== e.pointerId) return;
    pointer.current = null; setDrag(null);
  };

  const ctx: Ctx = {
    shown, numbered, picked, dragId: drag?.id ?? null, drop: drag?.drop ?? null, instructionId,
    startPointer, movePointer, endPointer, cancelPointer, handleKey, handleClick, handleBlur,
  };
  const sorted = [...nodes].sort((a, b) => shown.indexOf(a.props.itemId) - shown.indexOf(b.props.itemId));

  return (
    <ReorderContext.Provider value={ctx}>
      <div ref={root} data-slot="list-reorder" className={cn(listVariants(), className)} {...props}>
        {heading != null && <div data-slot="list-reorder-heading" id={headingId} className={listHeadingVariants()}>{heading}</div>}
        <ul data-slot="list-reorder-items" role="list" aria-labelledby={heading != null ? headingId : undefined} aria-label={heading != null ? undefined : ariaLabel} className={listItemsVariants()}>
          {sorted}
        </ul>
        <span id={instructionId} hidden>Press Space to pick up, arrow keys to move, Space to drop, Escape to cancel.</span>
        <div data-slot="list-reorder-status" role="status" aria-live="polite" className="sr-only">{message}</div>
      </div>
    </ReorderContext.Provider>
  );
}

/** One reorderable item: grip handle, optional position badge, title and description, trailing content. */
export function ListReorderItem({ itemId, title, description, end, disabled = false, dragging = false, className, ...props }: ListReorderItemProps) {
  const ctx = useContext(ReorderContext)!;
  const position = ctx.shown.indexOf(itemId);
  const isPicked = ctx.picked === itemId;
  const active = dragging || isPicked || ctx.dragId === itemId;
  const drop = ctx.drop?.id === itemId ? ctx.drop.edge : undefined;
  return (
    <li
      data-slot="list-reorder-row" data-item-id={itemId} data-dragging={active || undefined} data-drop={drop}
      className={cn(listReorderRowVariants({ numbered: ctx.numbered }), className)}
      onPointerDown={e => ctx.startPointer(e, itemId, disabled)} onPointerMove={ctx.movePointer} onPointerUp={ctx.endPointer} onPointerCancel={ctx.cancelPointer}
      {...props}
    >
      <button
        type="button" data-slot="list-reorder-handle" disabled={disabled}
        aria-label={`Reorder ${text(title, itemId)}`} aria-pressed={isPicked} aria-describedby={ctx.instructionId}
        className={listReorderHandleVariants()}
        onKeyDown={e => ctx.handleKey(e, itemId)} onClick={() => ctx.handleClick(itemId)} onBlur={e => ctx.handleBlur(itemId, e.currentTarget)}
      >
        <GripVertical className="size-icon-md" aria-hidden />
      </button>
      {ctx.numbered && <span data-slot="list-reorder-index" aria-hidden className={listReorderIndexVariants()}>{position + 1}</span>}
      <div data-slot="list-reorder-text" className={listTextVariants()}>
        <span data-slot="list-reorder-title" className={listTitleVariants()}>{title}</span>
        {description != null && <span data-slot="list-reorder-description" className={cn(listDescriptionVariants(), 'group-data-[dragging]:text-text-primary')}>{description}</span>}
      </div>
      {end != null && <div data-slot="list-reorder-end" className={listEndVariants()}>{end}</div>}
    </li>
  );
}
