'use client';
import { Check, ChevronRight, GripVertical, Plus } from '../../icons/index.ts';
import {
  Children, cloneElement, createContext, isValidElement, useContext, useId, useRef, useState,
  type AnimationEvent, type ComponentProps, type CSSProperties, type KeyboardEvent, type MouseEvent, type MouseEventHandler, type PointerEvent,
  type ReactElement, type ReactNode, type Ref,
} from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Size, Tone, Variant } from '../../lib/common-props.ts';
import { useFlip } from '../../hooks/use-flip.ts';
import { usePresence } from '../../hooks/use-presence.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import {
  listActionIconVariants, listActionLabelVariants, listActionVariants, listAddVariants, listBehaviourVariants, listBodyVariants, listChevronVariants,
  listDescriptionVariants, listDotVariants, listDurationVariants, listEndVariants, listGlyphVariants, listGroupFooterVariants, listGroupHeadingVariants,
  listGroupVariants, listHandleVariants, listHeadingEndVariants, listHeadingTitleVariants, listHeadingVariants, listIndexVariants, listIndicatorVariants,
  listInlineDescriptionVariants, listInlineEndVariants, listInlineTextVariants, listItemsVariants, listLeadVariants, listLeadWrapVariants,
  listOpaqueRowVariants, listOpaqueVariants, listOrbVariants, listRowBoxVariants, listRowVariants, listTextVariants, listThumbVariants, listTickVariants,
  listTileVariants, listTitleVariants, listToolsVariants, listTrayVariants, listTriggerVariants, listValueVariants, listVariants,
  type ListTint,
} from './list.variants.ts';
import { useListReorder, type ListReorder, type ListReorderAnnouncement, type ListReorderEvent } from './use-list-reorder.ts';
import { useListSelection, type ListSelection, type ListSelectionIndicator, type ListSelectionMode } from './use-list-selection.ts';
import { useRowActions, type ListRowAction, type ListRowActionsMode, type RowActions } from './use-row-actions.ts';

type Surface = 'grouped' | 'opaque';
/** The common variants plus the List surfaces: grouped (default, translucent) and opaque (the inspector collection). */
export type ListVariant = Variant | 'grouped' | 'opaque';

interface ListCtx {
  size: Size;
  surface: Surface;
  tone: Tone | undefined;
  rowActions: ListRowActionsMode;
  disabled: boolean;
  /** The first enabled choice: the tab stop of a single selection with nothing chosen. */
  firstValue: string | undefined;
}
const ListContext = createContext<ListCtx>({ size: 'md', surface: 'grouped', tone: undefined, rowActions: 'none', disabled: false, firstValue: undefined });
const SelectionContext = createContext<ListSelection | null>(null);
const ReorderContext = createContext<ListReorder | null>(null);
/** True for a row added after its list mounted: it rises in. The rows of the first paint do not. */
const EnterContext = createContext(false);

const nodeKey = (n: ReactNode) => (isValidElement(n) ? String(n.key) : String(n));
const isRow = (n: ReactNode): n is ReactElement<ListRowProps> => isValidElement(n) && n.type === ListRow;

interface RowCtx { itemValue: string | undefined; disabled: boolean; lifted: boolean; actions: RowActions | null }
const RowContext = createContext<RowCtx | null>(null);

const setRef = <T,>(ref: Ref<T> | undefined, el: T | null) => {
  if (typeof ref === 'function') ref(el);
  else if (ref) (ref as { current: T | null }).current = el;
};

// ── Group

export interface ListGroupProps extends ComponentProps<'div'> {}

/** Outer wrapper: an outside heading above, one or more lists, a note below. */
export function ListGroup({ className, ...props }: ListGroupProps) {
  return <div data-slot="list-group" className={cn(listGroupVariants(), className)} {...props} />;
}

export function ListGroupHeading({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="list-group-heading" className={cn(listGroupHeadingVariants(), className)} {...props} />;
}

export function ListGroupFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="list-group-footer" className={cn(listGroupFooterVariants(), className)} {...props} />;
}

// ── List

interface ListBaseProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'>, Omit<CommonProps, 'size' | 'variant'> {
  /** Row minimum height 40 · 48 · 52 · 64 (xs · sm · md · lg). A row may override it. Opaque: the row type and padding. */
  size?: Size;
  /** grouped (default) = the translucent inset-grouped surface (solid is the same); opaque = the inspector collection. */
  variant?: ListVariant;
  /** Caption inside the surface above the rows; also the accessible name. */
  heading?: ReactNode;
  /** Count, meta or one IconButton xs at the end of the heading. */
  headingEnd?: ReactNode;
  /** Puts the heading on a bg.inset band. Default false. */
  headingBand?: boolean;
  /** Accessible name when there is no heading. */
  'aria-label'?: string;
  /** Disables every row (choices, handles, triggers). */
  disabled?: boolean;
  /** The rows are choices: single (radio group) or multiple (checkbox group). Default none. */
  selectionMode?: ListSelectionMode;
  /** Single mode only: check = the tick at the end of the checked row (default); radio = a leading radio circle. */
  indicator?: ListSelectionIndicator;
  /** Controlled selection: a string (or null) in single mode, string[] in multiple mode. */
  value?: string | null | string[];
  /** Uncontrolled initial selection. */
  defaultValue?: string | null | string[];
  /** Single mode reports the chosen value; multiple mode reports the full new array in row order. */
  onValueChange?: (value: string | string[]) => void;
  /** A selection from useListSelection (its rootProps), instead of the selection props. */
  selection?: ListSelection;
  /** Controlled order: the row itemValues from first to last. */
  order?: string[];
  /** Uncontrolled initial order. Defaults to the order of the children. */
  defaultOrder?: string[];
  /** Reports a drop at a new position; not called for a drop in place or a cancel. */
  onReorder?: (event: ListReorderEvent) => void;
  /** Show the position badge on reorderable rows. */
  numbered?: boolean;
  /** A reorder from useListReorder (its rootProps), instead of the reorder props. */
  reorder?: ListReorder;
}

interface ListStatic {
  reorderable?: false;
  /** none (default); hover = icon buttons on row hover or focus; swipe = a labelled tray under a row that slides. */
  rowActions?: ListRowActionsMode;
  handleLabel?: (title: string) => string;
  instructions?: string;
  announce?: (event: ListReorderAnnouncement) => string;
}

interface ListReorderable {
  /** Rows can be reordered by pointer drag or from the keyboard handle. Rows need itemValue. */
  reorderable: true;
  /** A dragged row cannot also swipe: reorderable lists take none or hover actions only. */
  rowActions?: Exclude<ListRowActionsMode, 'swipe'>;
  /** aria-label of each drag handle from the row title, e.g. t => `Reorder ${t}`. */
  handleLabel: (title: string) => string;
  /** Hidden instruction the handles are described by. */
  instructions: string;
  /** Builds the live-region text from an event. */
  announce: (event: ListReorderAnnouncement) => string;
}

export type ListProps = ListBaseProps & (ListStatic | ListReorderable);

const rowText = (title: ReactNode) => (typeof title === 'string' ? title : undefined);

/**
 * The list surface: rows on a translucent (grouped) or opaque surface with a hairline edge. Behaviour props make the rows
 * choices (selectionMode), reorderable (reorderable) or give them actions (rowActions); each behaviour is a headless hook
 * (useListSelection, useListReorder, useRowActions) that a custom list or row can use directly.
 */
export function List(props: ListProps) {
  const {
    size = 'md', tone, variant, radius, shadow, heading, headingEnd, headingBand = false, 'aria-label': ariaLabel, disabled = false,
    selectionMode = 'none', indicator = 'check', value, defaultValue, onValueChange, selection: selectionProp,
    reorderable = false, order, defaultOrder, onReorder, numbered = false, reorder: reorderProp, rowActions = 'none',
    handleLabel, instructions, announce, className, children, onKeyDown, ref, ...rest
  } = props;
  const headingId = useId();
  const surface: Surface = variant === 'opaque' ? 'opaque' : 'grouped';

  const rootRef = useRef<HTMLDivElement | null>(null);
  const nodes = Children.toArray(children);
  // Rows that were there at the first paint do not rise; rows added after it do (EnterContext).
  const [mounted] = useState(() => new Set(nodes.map(nodeKey)));
  // A removed row stays drawn, leaving, until its exit has played (usePresence). A list with an external reorder cannot keep a
  // leaving row in that order, so it goes at once.
  const { entries, exited } = usePresence(nodes, nodeKey);
  const live = entries.filter(e => e.present || (isRow(e.item) && reorderProp == null));
  const rowValue = (n: ReactNode) => (isRow(n) ? n.props.itemValue : undefined);
  const rows = live.filter(e => rowValue(e.item) != null);
  const items = rows.map(e => {
    const r = (e.item as ReactElement<ListRowProps>).props;
    return { id: r.itemValue!, title: rowText(r.title), disabled: !!r.disabled || !e.present, exiting: !e.present };
  });
  // A controlled order does not list a leaving row: it goes back among the others, where the children still have it.
  const controlled = order && [...order];
  if (controlled) live.forEach((e, i) => {
    const id = rowValue(e.item);
    if (!e.present && id != null && !controlled.includes(id)) controlled.splice(Math.min(i, controlled.length), 0, id);
  });

  const ownSelection = useListSelection({ mode: selectionMode, indicator, value, defaultValue, onValueChange, disabled });
  const selection = selectionProp ?? (selectionMode !== 'none' ? ownSelection : null);
  const ownReorder = useListReorder({
    items, order: controlled, defaultOrder, onReorder, numbered, enabled: reorderable,
    handleLabel: handleLabel ?? (t => t), instructions: instructions ?? '', announce: announce ?? (() => ''),
  });
  const reorder = reorderProp ?? (reorderable ? ownReorder : null);
  const actionsMode: ListRowActionsMode = reorder && rowActions === 'swipe' ? 'hover' : rowActions;
  // Layout motion (useFlip): rows glide when rows are inserted, removed or reordered. A pointer drag, a keyboard pick-up and its
  // drop or cancel keep it off, so they stay instant. The pointer release is not off: its glide is the one useFlip plays.
  useFlip(
    rootRef, ':scope > [data-slot="list-items"] > [data-flip-id]', 'flipId',
    reorder == null || (!reorder.drag && reorder.picked == null && !reorder.keyboardCommit),
  );

  const setRoot = (el: HTMLDivElement | null) => {
    rootRef.current = el;
    if (selection) selection.rootRef.current = el;
    if (reorder) reorder.rootRef.current = el;
    setRef(ref, el);
  };

  // A reorderable list draws its rows in the current order; other children (ListAddRow) keep their place after them.
  let shown = live;
  if (reorder) {
    shown = [...rows].sort((a, b) => reorder.shown.indexOf(rowValue(a.item)!) - reorder.shown.indexOf(rowValue(b.item)!));
    shown.push(...live.filter(e => !rows.includes(e)));
  }
  const firstValue = items.find(i => !i.disabled)?.id;

  // Rows get data-flip-id (their React key: the identity the DOM keeps) and, while they leave, the closed state.
  const drawEntry = (e: (typeof entries)[number]) => {
    const { key, item, present } = e;
    if (!isValidElement(item) || item.type !== ListRow) return item;
    const leaving = present ? {} : {
      'data-state': 'closed', 'aria-hidden': true, inert: true,
      onAnimationEnd: (ev: AnimationEvent<HTMLElement>) => { if (ev.target === ev.currentTarget) exited(key); },
    };
    return (
      <EnterContext.Provider key={key} value={!mounted.has(key)}>
        {cloneElement(item as ReactElement<Record<string, unknown>>, { 'data-flip-id': key, ...leaving })}
      </EnterContext.Provider>
    );
  };
  const marks = tone ?? 'accent';
  const surfaceVariant = variant ?? 'grouped';

  return (
    <ListContext.Provider value={{ size, surface, tone, rowActions: actionsMode, disabled, firstValue }}>
      <SelectionContext.Provider value={selection}>
        <ReorderContext.Provider value={reorder}>
          <div
            ref={setRoot} data-slot="list" data-size={size} data-variant={surfaceVariant}
            data-selection={selection?.mode} data-indicator={selection?.mode === 'single' ? selection.indicator : undefined}
            data-pointer-drag={reorder?.drag ? '' : undefined} data-settling={reorder?.settling ? '' : undefined}
            role={selection ? (selection.mode === 'single' ? 'radiogroup' : 'group') : undefined}
            aria-labelledby={selection && heading != null ? headingId : undefined} aria-label={selection && heading == null ? ariaLabel : undefined}
            className={cn(
              listVariants({ tone, variant: surfaceVariant, radius, shadow }), surface === 'opaque' && listOpaqueVariants({ size }),
              listBehaviourVariants({ marks, grip: marks }), className,
            )}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => { onKeyDown?.(e); selection?.onKeyDown(e); }}
            {...rest}
          >
            {heading != null && (
              <div data-slot="list-heading" data-band={headingBand || undefined} className={cn(listHeadingVariants({ surface, size, band: headingBand }))}>
                <span data-slot="list-heading-title" id={headingId} className={listHeadingTitleVariants()}>{heading}</span>
                {headingEnd != null && <span data-slot="list-heading-end" className={listHeadingEndVariants({ surface })}>{headingEnd}</span>}
              </div>
            )}
            <ul
              data-slot="list-items" role="list" aria-labelledby={heading != null ? headingId : undefined} aria-label={heading != null ? undefined : ariaLabel}
              className={listItemsVariants()}
            >
              {shown.map(drawEntry)}
            </ul>
            {reorder && <span id={reorder.instructionId} hidden>{reorder.instructions}</span>}
            {reorder && <div data-slot="list-status" role="status" aria-live="polite" className="sr-only">{reorder.message}</div>}
          </div>
        </ReorderContext.Provider>
      </SelectionContext.Provider>
    </ListContext.Provider>
  );
}

// ── Row

export interface ListRowProps extends Omit<ComponentProps<'li'>, 'title' | 'onClick' | 'value'> {
  /** Row minimum height 40 · 48 · 52 · 64; defaults to the list size. */
  size?: Size;
  /** Colour family of the title (danger = a destructive row). 'default' is the deprecated alias of neutral. */
  tone?: Tone | 'default' | null | undefined;
  /** working = the agent is working on this row (the orb). */
  status?: 'idle' | 'working';
  title: ReactNode;
  /** One line under the title (opaque: the muted detail after it). */
  description?: ReactNode;
  /** Glyph for the icon tile (opaque: the 14px leading glyph). */
  icon?: ReactNode;
  /** Identity color of the icon tile. */
  tint?: ListTint;
  /** Custom leading element (Avatar, ListRowIndicator); use instead of icon. */
  leading?: ReactNode;
  /** Media for the thumbnail; makes the leading element a thumb. */
  thumb?: ReactNode;
  /** Text of the thumbnail corner badge. */
  duration?: ReactNode;
  /** Setting value at the end of the row. */
  value?: ReactNode;
  /** Trailing content: time, Badge, Button, IconButton, Switch. */
  end?: ReactNode;
  /** Shows the chevron; the row should be interactive. */
  navigates?: boolean;
  /** Makes the trigger a link. */
  href?: string;
  /** Render the trigger as the child element (a router link) instead of a button. */
  asChild?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  /** The row's identity in a selection (its value) and in a reorder (its id). */
  itemValue?: string;
  /** The row cannot be chosen or moved; other rows skip over it. */
  disabled?: boolean;
  /** State hook for fixtures and tests: renders the lifted (dragged) look. Normally set internally. */
  dragging?: boolean;
  /** Row actions (List rowActions hover or swipe): tray buttons or hover icon buttons. */
  actions?: ListRowAction[];
  /** An action is activated (a swipe row closes afterwards). */
  onAction?: (event: { id: string }) => void;
  /** Swipe actions: controlled open state. */
  open?: boolean;
  /** Swipe actions: uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Swipe actions: the row opens or closes by swipe, tap, Escape, outside press or focus entering the tray. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * One row: leading, title and description, value, trailing content and chevron. Interactive when it has onClick, href or
 * asChild; a choice in a selection list; draggable in a reorderable list; with actions in a rowActions list.
 */
export function ListRow({
  size, tone: toneProp, status, title, description, icon, tint, leading, thumb, duration, value, end, navigates = false, href, asChild = false,
  onClick, itemValue, disabled: disabledProp = false, dragging = false, actions, onAction, open, defaultOpen, onOpenChange,
  className, children, style, onKeyDown, ref, ...props
}: ListRowProps) {
  const list = useContext(ListContext);
  const selection = useContext(SelectionContext);
  const reorder = useContext(ReorderContext);
  const enter = useContext(EnterContext);
  const rowSize = size ?? list.size;
  const tone = toneProp === 'default' ? 'neutral' : toneProp;
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;

  const off = disabledProp || list.disabled;
  const choice = selection && selection.mode !== 'none' && itemValue != null ? selection : null;
  const moving = reorder && reorder.enabled && itemValue != null ? reorder : null;
  const actionsMode: ListRowActionsMode = actions?.length ? list.rowActions : 'none';
  const ra = useRowActions({ mode: actionsMode === 'none' ? 'hover' : actionsMode, actions, onAction, open, defaultOpen, onOpenChange });
  const swipe = actionsMode === 'swipe';

  const checked = !!choice && choice.isSelected(itemValue!);
  const held = !!moving && moving.drag?.id === itemValue;
  const lifted = dragging || (!!moving && (moving.picked === itemValue || held));
  const ownIndicator = isValidElement(leading) && leading.type === ListRowIndicator;
  const leadMark = !!choice && (choice.mode === 'multiple' || choice.indicator === 'radio') && !ownIndicator;
  const endTick = !!choice && choice.mode === 'single' && choice.indicator === 'check' && !ownIndicator;

  const kind = thumb != null ? 'thumb' : ownIndicator ? 'check' : leading != null ? 'avatar' : icon != null ? 'tile'
    : leadMark ? 'check' : moving ? (moving.numbered ? 'grip-index' : 'grip') : 'none';
  const interactive = asChild || href != null || onClick != null;
  const triggerProps = {
    'aria-labelledby': titleId,
    'aria-describedby': description != null ? descId : undefined,
    className: listTriggerVariants(),
    onClick,
  };
  let trigger: ReactNode = null;
  if (choice) {
    const tabbable = choice.mode === 'multiple' || checked || (choice.selected.length === 0 && itemValue === list.firstValue);
    trigger = (
      <button
        data-slot="list-trigger" type="button" role={choice.mode === 'multiple' ? 'checkbox' : 'radio'} aria-checked={checked}
        tabIndex={tabbable ? 0 : -1} disabled={off || choice.disabled} {...triggerProps}
        onClick={(e: MouseEvent<HTMLButtonElement>) => { onClick?.(e); if (!e.defaultPrevented) choice.select(itemValue!); }}
      />
    );
  } else if (interactive) {
    if (asChild && isValidElement(children)) {
      trigger = cloneElement(children as ReactElement<Record<string, unknown>>, { 'data-slot': 'list-trigger', ...triggerProps });
    } else if (href != null) {
      trigger = <a data-slot="list-trigger" href={href} {...triggerProps} />;
    } else {
      trigger = <button data-slot="list-trigger" type="button" disabled={off} {...triggerProps} />;
    }
  }
  const rowDisabled = off || (choice?.disabled ?? false) || (moving?.isDisabled(itemValue!) ?? false);
  const rowCtx: RowCtx = { itemValue, disabled: rowDisabled, lifted, actions: actionsMode === 'none' ? null : ra };
  const setRow = (el: HTMLLIElement | null) => { ra.rowProps.ref.current = el; setRef(ref, el); };
  const keyDown = (e: KeyboardEvent<HTMLLIElement>) => { onKeyDown?.(e); ra.rowProps.onKeyDown(e); };
  const common = {
    'data-size': rowSize, 'data-tone': tone ?? 'neutral', 'data-status': status ?? 'idle',
    'data-item-value': itemValue,
  };

  // Opaque: the compact collection row (the former AppendList row).
  if (list.surface === 'opaque') {
    return (
      <li data-slot="list-row" {...common} data-lead="none" ref={setRow} className={cn(listOpaqueRowVariants({ size: rowSize, enter }), className)} style={style} onKeyDown={keyDown} {...props}>
        {trigger}
        {icon != null ? <span data-slot="list-glyph" aria-hidden className={listGlyphVariants({ tone: list.tone })}>{icon}</span> : (leading ?? <span aria-hidden />)}
        <span data-slot="list-text" className={listInlineTextVariants()}>
          <span data-slot="list-title" id={titleId}>{title}</span>
          {description != null && <>{' '}<span data-slot="list-row-description" id={descId} className={listInlineDescriptionVariants()}>{description}</span></>}
        </span>
        {end != null && <span data-slot="list-end" className={listInlineEndVariants()}>{end}</span>}
      </li>
    );
  }

  const y = moving ? moving.offset(itemValue!) : 0;
  const rowStyle = y !== 0 ? ({ ...style, '--li-y': `${y}px` } as CSSProperties) : style;
  const leadWrap = kind === 'thumb' || kind === 'avatar' || kind === 'tile' || (kind === 'check' && ownIndicator);
  const content = (
    <>
      {trigger}
      {moving && <ListRowHandle />}
      {moving?.numbered && <span data-slot="list-index" aria-hidden className={listIndexVariants()}>{moving.shown.indexOf(itemValue!) + 1}</span>}
      {leadMark && <ListRowIndicator />}
      {leadWrap && (
        <div data-slot="list-lead" className={listLeadWrapVariants()}>
          {kind === 'thumb' ? (
            <div data-slot="list-thumb" className={listThumbVariants()}>
              {thumb}
              {duration != null && <span data-slot="list-duration" className={listDurationVariants()}>{duration}</span>}
            </div>
          ) : kind === 'tile' ? (
            <div data-slot="list-tile" aria-hidden className={listTileVariants({ tint })}>{icon}</div>
          ) : leading}
        </div>
      )}
      <div data-slot="list-text" className={listTextVariants()}>
        <span data-slot="list-title" id={titleId} className={listTitleVariants({ tone: !!choice && rowDisabled ? null : tone, off: !!choice && rowDisabled })}>{title}</span>
        {description != null && <span data-slot="list-row-description" id={descId} className={listDescriptionVariants({ off: !!choice && rowDisabled })}>{description}</span>}
      </div>
      {value != null && <span data-slot="list-value" className={listValueVariants()}>{value}</span>}
      {(end != null || status === 'working') && (
        <div data-slot="list-end" className={listEndVariants()}>
          {end}
          {status === 'working' && <span data-slot="list-orb" aria-hidden className={listOrbVariants({ status })} />}
        </div>
      )}
      {actionsMode === 'hover' && (
        <div data-slot="list-tools" role="group" aria-label="Row actions" className={listToolsVariants()}>
          {actions!.map(a => <IconButton key={a.id} size="xs" label={a.label} onClick={() => ra.run(a.id)}>{a.icon}</IconButton>)}
        </div>
      )}
      {endTick && <ListRowIndicator />}
      {navigates && <ChevronRight data-slot="list-chevron" aria-hidden className={listChevronVariants()} />}
    </>
  );
  const drag = moving ? {
    onPointerDown: (e: PointerEvent<HTMLLIElement>) => moving.startPointer(e, itemValue!),
    onPointerMove: moving.movePointer, onPointerUp: moving.endPointer, onPointerCancel: moving.cancelPointer,
  } : {};

  return (
    <RowContext.Provider value={rowCtx}>
      <li
        data-slot="list-row" {...common} data-lead={kind} data-state={choice ? (checked ? 'checked' : 'unchecked') : undefined}
        data-disabled={(choice || moving) && rowDisabled ? '' : undefined} data-actions={actionsMode === 'none' ? undefined : actionsMode}
        data-dragging={lifted || undefined} data-follow={held || undefined}
        ref={setRow} style={rowStyle} onKeyDown={keyDown}
        className={cn(
          listRowVariants({ size: rowSize, tone, status, reorder: !!moving, actions: actionsMode, enter }), !swipe && listRowBoxVariants({ size: rowSize }),
          listLeadVariants({ lead: kind }), className,
        )}
        {...props}
        {...drag}
      >
        {swipe ? (
          <>
            <ListRowTray />
            <div data-slot="list-body" {...ra.bodyProps} className={cn(listRowBoxVariants({ size: rowSize }), listBodyVariants())}>
              {content}
            </div>
          </>
        ) : content}
      </li>
    </RowContext.Provider>
  );
}

// ── Parts

export interface ListRowIndicatorProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** The choice this mark shows; defaults to the enclosing ListRow's itemValue. */
  itemValue?: string;
}

/**
 * The selection mark of a row, from the List selection: the 18px box (multiple), the radio circle (single, indicator radio)
 * or the end tick (single, indicator check). Decorative; the row trigger carries aria-checked.
 */
export function ListRowIndicator({ itemValue, className, ...props }: ListRowIndicatorProps) {
  const row = useContext(RowContext);
  const selection = useContext(SelectionContext);
  const v = itemValue ?? row?.itemValue;
  if (!selection || selection.mode === 'none' || v == null) return null;
  const state = selection.isSelected(v) ? 'checked' : 'unchecked';
  const off = (row?.disabled ?? false) || selection.disabled ? '' : undefined;
  if (selection.mode === 'single' && selection.indicator === 'check') {
    return <Check data-slot="list-tick" data-state={state} data-disabled={off} aria-hidden className={cn(listTickVariants(), className)} />;
  }
  const shape = selection.mode === 'multiple' ? 'box' : 'radio';
  return (
    <span
      data-slot="list-indicator" data-shape={shape} data-state={state} data-disabled={off} aria-hidden
      className={cn(listIndicatorVariants({ shape }), className)} {...props}
    >
      {shape === 'box' ? <Check /> : <span data-slot="list-dot" data-state={state} className={listDotVariants()} />}
    </span>
  );
}

export interface ListRowHandleProps extends Omit<ComponentProps<'button'>, 'children'> {
  /** The row this grip moves; defaults to the enclosing ListRow's itemValue. */
  itemValue?: string;
}

/**
 * The grip of a reorderable row, from the List reorder: the keyboard and assistive entry point (Space picks up and drops,
 * arrows move, Escape cancels), aria-pressed while picked up, described by the hidden instruction.
 */
export function ListRowHandle({ itemValue, className, ...props }: ListRowHandleProps) {
  const row = useContext(RowContext);
  const reorder = useContext(ReorderContext);
  const id = itemValue ?? row?.itemValue;
  if (!reorder || id == null) return null;
  const picked = reorder.picked === id;
  const lifted = row?.lifted ?? (picked || reorder.drag?.id === id);
  return (
    <button
      type="button" data-slot="list-handle" data-dragging={lifted || undefined} disabled={row?.disabled ?? reorder.isDisabled(id)}
      aria-label={reorder.handleLabel(id)} aria-pressed={picked} aria-describedby={reorder.instructionId}
      className={cn(listHandleVariants(), className)}
      onKeyDown={e => reorder.handleKey(e, id)} onClick={() => reorder.handleClick(id)} onBlur={e => reorder.handleBlur(id, e.currentTarget)}
      {...props}
    >
      <GripVertical aria-hidden />
    </button>
  );
}

export interface ListRowTrayProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** The actions; defaults to the enclosing ListRow's actions. */
  actions?: ListRowAction[];
  /** The row actions state from useRowActions (its trayProps), for a custom row. */
  controller?: RowActions;
}

/** The swipe tray under a row: one 72px button per action (icon over a one-word label). Focusing one opens the row. */
export function ListRowTray({ actions: actionsProp, controller, className, ...props }: ListRowTrayProps) {
  const row = useContext(RowContext);
  const ra = controller ?? row?.actions ?? null;
  const actions = actionsProp ?? ra?.actions ?? [];
  return (
    <div ref={ra?.trayRef} data-slot="list-tray" className={cn(listTrayVariants(), className)} onFocus={ra?.onTrayFocus} {...props}>
      {actions.map(a => (
        <button
          key={a.id} type="button" data-slot="list-action" data-tone={a.tone ?? 'neutral'}
          className={listActionVariants({ intent: a.tone, emphasis: a.variant })} onClick={() => ra?.run(a.id)}
        >
          {a.icon != null && <span data-slot="list-action-icon" aria-hidden className={listActionIconVariants()}>{a.icon}</span>}
          <span data-slot="list-action-label" className={listActionLabelVariants()}>{a.label}</span>
        </button>
      ))}
    </div>
  );
}

export interface ListAddRowProps extends Omit<ComponentProps<'button'>, 'onClick'> {
  /** The add row was activated. */
  onAdd?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** The last row of a collection: a dashed top edge, a plus glyph and the label in accent.text (the list's one action). */
export function ListAddRow({ onAdd, className, children, ...props }: ListAddRowProps) {
  const list = useContext(ListContext);
  return (
    <li data-slot="list-add-row" data-flip-id="add">
      <button type="button" data-slot="list-add" className={cn(listAddVariants({ surface: list.surface, size: list.size }), className)} onClick={onAdd} {...props}>
        <Plus aria-hidden />
        {children}
      </button>
    </li>
  );
}

export type { ListReorder, ListReorderAnnouncement, ListReorderEvent, ListRowAction, ListRowActionsMode, ListSelection, ListSelectionIndicator, ListSelectionMode, RowActions };
