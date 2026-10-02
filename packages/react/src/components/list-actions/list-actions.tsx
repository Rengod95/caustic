'use client';
import { createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { listDescriptionVariants, listEndVariants, listLeadWrapVariants, listTextVariants, listTitleVariants } from '../list/list.variants.ts';
import {
  listActionsActionIconVariants, listActionsActionLabelVariants, listActionsActionVariants, listActionsRowVariants, listActionsToolsVariants,
  listActionsTrayVariants, listActionsVariants, type ListActionsTone,
} from './list-actions.variants.ts';

interface Ctx { close: () => void; onAction?: ((e: { id: string }) => void) | undefined }
const ActionsContext = createContext<Ctx>({ close: () => {} });

/** Only one row is open at a time: a row that opens tells the others to close. */
const OPEN_EVENT = 'caustic:list-actions-open';

export interface ListActionsActionProps extends Omit<ComponentProps<'button'>, 'children' | 'onSelect'> {
  /** Fill of the tray action. */
  tone?: ListActionsTone;
  /** Glyph. */
  icon?: ReactNode;
  /** Visible label and accessible name. */
  label: string;
  /** Id reported by onAction. Defaults to the lowercase label. */
  actionId?: string;
  /** Called with the action id when the action is activated. */
  onSelect?: (id: string) => void;
}

/** One tray action: icon over a one-word label. The row closes after it runs. */
export function ListActionsAction({ tone, icon, label, actionId, onSelect, className, onClick, ...props }: ListActionsActionProps) {
  const ctx = useContext(ActionsContext);
  const id = actionId ?? label.toLowerCase();
  return (
    <button
      type="button" data-slot="list-actions-action" data-tone={tone ?? 'neutral'}
      className={cn(listActionsActionVariants({ tone }), className)}
      onClick={e => { onClick?.(e); if (e.defaultPrevented) return; onSelect?.(id); ctx.onAction?.({ id }); ctx.close(); }}
      {...props}
    >
      {icon != null && <span data-slot="list-actions-action-icon" aria-hidden className={listActionsActionIconVariants()}>{icon}</span>}
      <span data-slot="list-actions-action-label" className={listActionsActionLabelVariants()}>{label}</span>
    </button>
  );
}

export interface ListActionsProps extends Omit<ComponentProps<'div'>, 'title' | 'children'> {
  /** hover = icon buttons on row hover or focus (desktop); swipe = labelled tray under a row that slides (touch). */
  reveal?: 'hover' | 'swipe';
  /** Swipe mode. Controlled open state of the row. */
  open?: boolean;
  /** Swipe mode. Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Swipe mode: the row opens or closes by swipe, tap, Escape, outside press or focus entering the tray. */
  onOpenChange?: (open: boolean) => void;
  /** A tray action is activated; the row closes afterwards. */
  onAction?: (event: { id: string }) => void;
  /** Swipe mode: ListActionsAction elements for the tray. Hover mode: the IconButton xs group rendered in tools. */
  actions?: ReactNode;
  /** Row content, as for a List row. */
  title?: ReactNode;
  description?: ReactNode;
  /** Leading element (an Avatar). */
  leading?: ReactNode;
  /** Trailing content (a timestamp). */
  end?: ReactNode;
  /** Fully custom row content in place of the row props. */
  children?: ReactNode;
}

/**
 * One row of a List that carries actions: a swipe tray (touch) or hover tools (desktop). Renders a listitem, so put it inside a List.
 */
export function ListActions({
  reveal = 'hover', open, defaultOpen = false, onOpenChange, onAction, actions,
  title, description, leading, end, className, children, onKeyDown, ...props
}: ListActionsProps) {
  const swipe = reveal === 'swipe';
  const uid = useId();
  const [isOpen, setOpen] = useControllableState<boolean>({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const root = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const tray = useRef<HTMLDivElement>(null);
  const [trayWidth, setTrayWidth] = useState(0);
  const [dragX, setDragX] = useState<number | null>(null);
  const gesture = useRef<{ pid: number; x: number; y: number; active: boolean; dx: number } | null>(null);

  useLayoutEffect(() => {
    if (swipe && tray.current) setTrayWidth(tray.current.offsetWidth);
  }, [swipe, actions]);

  // One open row per list, and a press outside closes this one.
  useEffect(() => {
    if (!swipe || !isOpen) return;
    const closeOther = (e: Event) => { if ((e as CustomEvent).detail !== uid) setOpen(false); };
    const outside = (e: globalThis.PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener(OPEN_EVENT, closeOther);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener(OPEN_EVENT, closeOther); document.removeEventListener('pointerdown', outside); };
  }, [swipe, isOpen, uid, setOpen]);
  const openRow = () => { setOpen(true); document.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: uid })); };

  const down = (e: PointerEvent<HTMLElement>) => {
    if (!swipe || e.button !== 0 || (e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
    gesture.current = { pid: e.pointerId, x: e.clientX, y: e.clientY, active: false, dx: 0 };
  };
  const move = (e: PointerEvent<HTMLElement>) => {
    const g = gesture.current; if (!g || g.pid !== e.pointerId) return;
    const dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (!g.active) {
      if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return;
      g.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    g.dx = dx;
    const base = isOpen ? -trayWidth : 0;
    setDragX(Math.min(0, Math.max(-trayWidth, base + dx)));
  };
  const up = (e: PointerEvent<HTMLElement>) => {
    const g = gesture.current; if (!g || g.pid !== e.pointerId) return;
    gesture.current = null; setDragX(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (!g.active) { if (isOpen) setOpen(false); return; }
    if (g.dx <= -30 && !isOpen) openRow();
    else if (g.dx >= 30 && isOpen) setOpen(false);
  };
  const cancel = (e: PointerEvent<HTMLElement>) => { if (gesture.current?.pid === e.pointerId) { gesture.current = null; setDragX(null); } };

  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || !swipe || e.key !== 'Escape' || !isOpen) return;
    e.preventDefault(); setOpen(false); rowRef.current?.focus();
  };

  const x = dragX ?? (isOpen ? -trayWidth : 0);
  const rowStyle = swipe ? ({ '--row-x': `${x}px` } as CSSProperties) : undefined;
  const content = children ?? (
    <>
      {leading != null && <div data-slot="list-lead" className={listLeadWrapVariants()}>{leading}</div>}
      <div data-slot="list-text" className={listTextVariants()}>
        {title != null && <span data-slot="list-title" className={listTitleVariants()}>{title}</span>}
        {description != null && <span data-slot="list-description" className={listDescriptionVariants()}>{description}</span>}
      </div>
      {end != null && <div data-slot="list-end" className={listEndVariants()}>{end}</div>}
    </>
  );

  return (
    <ActionsContext.Provider value={{ close: () => setOpen(false), onAction }}>
      <div
        ref={root} role="listitem" data-slot="list-actions" data-reveal={reveal} data-lead={leading != null ? 'avatar' : 'none'}
        className={cn(listActionsVariants({ reveal, lead: leading != null ? 'avatar' : 'none' }), className)}
        onKeyDown={key} {...props}
      >
        {swipe && (
          <div
            ref={tray} data-slot="list-actions-tray" className={listActionsTrayVariants()}
            onFocus={() => { if (!isOpen) openRow(); }}
          >
            {actions}
          </div>
        )}
        <div
          ref={rowRef} data-slot="list-actions-row" data-state={swipe ? (isOpen ? 'open' : 'closed') : undefined} data-dragging={dragX != null || undefined}
          tabIndex={swipe ? -1 : undefined} style={rowStyle}
          className={listActionsRowVariants({ reveal })}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel}
        >
          {content}
          {!swipe && actions != null && (
            <div data-slot="list-actions-tools" role="group" aria-label="Row actions" className={listActionsToolsVariants()}>{actions}</div>
          )}
        </div>
      </div>
    </ActionsContext.Provider>
  );
}
