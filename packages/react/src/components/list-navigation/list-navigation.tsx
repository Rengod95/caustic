'use client';
import { Check, ChevronRight, Plus } from 'lucide-react';
import { cloneElement, createContext, isValidElement, useContext, useId, type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import type { CommonProps, Size, Tone, Variant } from '../../lib/common-props.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import {
  listNavigationCheck, listNavigationChevron, listNavigationCount, listNavigationDot, listNavigationGroup, listNavigationHeading,
  listNavigationHeadingAction, listNavigationIcon, listNavigationFrameVariants, listNavigationLabel, listNavigationLeading, listNavigationLink,
  listNavigationMeta, listNavigationOrb, listNavigationStatus, listNavigationSub, listNavigationSubLink, listNavigationVariants,
} from './list-navigation.variants.ts';

/** What a column holds: sidebar navigation (default), a project's canvas pages, or agent sessions. */
export type ListNavigationKind = 'navigation' | 'pages' | 'sessions';

/** Agent session status shown in the leading column (was session-list). */
export type ListNavigationStatus = 'running' | 'review' | 'failed' | 'done';

/** The landmark's kind, tone, variant and size, read by its parts. */
const NavContext = createContext<{
  kind?: ListNavigationKind | undefined; tone?: Tone | undefined; variant?: Variant | undefined; size?: Size | undefined;
}>({});

/** Nesting depth of the list an entry sits in: 1 = a top-level item, 2 = a sub-item, 3 = a sub-item of a sub-item (the last level). */
const DepthContext = createContext(1);
/** Deepest level that renders: an entry at this depth ignores its `sub`. */
const MAX_DEPTH = 3;

export interface ListNavigationGroupProps extends Omit<ComponentProps<'ul'>, 'children'> {
  /** Section heading text; labels the group. */
  heading?: ReactNode;
  /** One IconButton xs at the end of the heading. */
  headingAction?: ReactNode;
  /** Shortcut for the common add action: renders an IconButton xs with a plus glyph and this aria-label as the heading action. */
  addLabel?: string;
  /** The add button (addLabel) is activated. */
  onAdd?: (event: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
}

export interface ListNavigationItemProps extends Omit<ComponentProps<'a'>, 'children' | 'ref' | 'onClick' | 'onSelect' | 'href'> {
  /** Item text. */
  children?: ReactNode;
  /** Leading glyph (sized to the icon column). */
  icon?: ReactNode;
  /** Any leading node (an avatar, a custom mark), unsized; used when there is no icon or status. */
  leading?: ReactNode;
  /** Agent session status: the mark in the leading column (running = spectrum orb, review / failed = dot, done = check) and a visually hidden status word. */
  status?: ListNavigationStatus;
  /** Trailing text before the count (session time, status word). */
  meta?: ReactNode;
  /** Count at the end. */
  count?: ReactNode;
  /** Renders the count as an accent pill. */
  hot?: boolean;
  /** Marks the current page: aria-current="page" and the raised surface. */
  current?: boolean;
  /** Link target; without it the item renders a button. */
  href?: string;
  /** Nested ListNavigationSubItem entries; makes the item a disclosure button. */
  sub?: ReactNode;
  /** Controlled disclosure (items with `sub`). */
  expanded?: boolean;
  /** Uncontrolled initial disclosure. */
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Render the link as the child element (a router link). */
  asChild?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** The item is activated (pointer, Enter or Space); for rows that switch a view in place rather than follow a link. */
  onSelect?: (event: MouseEvent<HTMLElement>) => void;
}

export interface ListNavigationSubItemProps extends Omit<ComponentProps<'a'>, 'ref' | 'onClick' | 'href'> {
  current?: boolean;
  href?: string;
  asChild?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Nested ListNavigationSubItem entries (third level); makes the entry a disclosure button. Ignored on the third level. */
  sub?: ReactNode;
  /** Controlled disclosure (entries with `sub`). */
  expanded?: boolean;
  /** Uncontrolled initial disclosure. */
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

/** asChild: merge the link props onto the child element; the child's own props win except className and handlers, which combine. */
function mergeChild(own: Record<string, unknown>, child: Record<string, unknown>): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...own, ...child };
  merged.className = cn(own.className as string | undefined, child.className as string | undefined);
  const a = own.onClick as ((e: MouseEvent<HTMLElement>) => void) | undefined;
  const b = child.onClick as ((e: MouseEvent<HTMLElement>) => void) | undefined;
  merged.onClick = (e: MouseEvent<HTMLElement>) => { b?.(e); a?.(e); };
  return merged;
}

export interface ListNavigationProps extends ComponentProps<'nav'>, CommonProps {
  /** Accessible name of the landmark. */
  'aria-label': string;
  /** What the column holds; sets the row metrics: navigation 34px rows (default), pages 30px page rows, sessions 32px session rows. */
  kind?: ListNavigationKind;
  /** Root element: a nav landmark (default), or a div with role group for a column that is not site navigation (a session list). */
  as?: 'nav' | 'div';
}

const STATUS_WORD: Record<ListNavigationStatus, string> = { running: 'Running', review: 'Needs review', failed: 'Failed', done: 'Done' };

/**
 * Sidebar navigation landmark. Compose with ListNavigationGroup and ListNavigationItem.
 */
export function ListNavigation({ kind = 'navigation', as = 'nav', tone, variant, radius, shadow, size, className, ...props }: ListNavigationProps) {
  const classes = cn(listNavigationVariants({ kind, size }), listNavigationFrameVariants({ radius, shadow }), className);
  return (
    <NavContext.Provider value={{ kind, tone, variant, size }}>
      {as === 'div'
        ? <div data-slot="list-navigation" data-kind={kind} role="group" className={classes} {...(props as ComponentProps<'div'>)} />
        : <nav data-slot="list-navigation" data-kind={kind} className={classes} {...props} />}
    </NavContext.Provider>
  );
}

/** A run of items, with an optional heading that labels it. */
export function ListNavigationGroup({ heading, headingAction, addLabel, onAdd, className, children, ...props }: ListNavigationGroupProps) {
  const headingId = useId();
  const { kind } = useContext(NavContext);
  const action = headingAction ?? (addLabel != null
    ? <IconButton data-slot="list-navigation-add" size="xs" label={addLabel} onClick={onAdd}><Plus /></IconButton>
    : null);
  return (
    <>
      {heading != null && (
        <div data-slot="list-navigation-heading" id={headingId} className={listNavigationHeading({ kind })}>
          {heading}
          {action != null && <div data-slot="list-navigation-heading-action" className={listNavigationHeadingAction({ kind })}>{action}</div>}
        </div>
      )}
      <ul data-slot="list-navigation-group" role="list" aria-labelledby={heading != null ? headingId : undefined} className={cn(listNavigationGroup({ kind }), className)} {...props}>
        {children}
      </ul>
    </>
  );
}

export function ListNavigationItem({
  icon, leading, status, meta, count, hot = false, current = false, href, sub, expanded, defaultExpanded = false, onExpandedChange, asChild = false,
  onClick, onSelect, className, children, ...props
}: ListNavigationItemProps) {
  const subId = useId();
  const { kind, tone, variant, size } = useContext(NavContext);
  const disclosure = sub != null;
  const [open, setOpen] = useControllableState({ value: expanded, defaultValue: defaultExpanded, onChange: onExpandedChange });
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    onClick?.(e);
    onSelect?.(e);
    if (disclosure && !e.defaultPrevented) setOpen(!open);
  };
  const common = {
    'aria-current': current ? ('page' as const) : undefined,
    'aria-expanded': disclosure ? open : undefined,
    'aria-controls': disclosure && open ? subId : undefined,
    'data-status': status,
    className: cn(listNavigationLink({ kind, size }), className),
    onClick: handleClick,
    ...props,
  };
  let lead: ReactNode = null;
  if (status != null) {
    lead = (
      <span data-slot="list-navigation-status" aria-hidden="true" className={listNavigationStatus({ status })}>
        {status === 'running' && <span data-slot="list-navigation-orb" className={listNavigationOrb({ status })} />}
        {(status === 'review' || status === 'failed') && <span data-slot="list-navigation-dot" className={listNavigationDot()} />}
        {status === 'done' && <Check data-slot="list-navigation-check" className={listNavigationCheck()} />}
      </span>
    );
  } else if (icon != null) lead = <span data-slot="list-navigation-icon" aria-hidden="true" className={listNavigationIcon({ kind, size })}>{icon}</span>;
  else if (leading != null) lead = <span data-slot="list-navigation-leading" className={listNavigationLeading()}>{leading}</span>;
  const inner = (
    <>
      {lead}
      <span data-slot="list-navigation-label" className={listNavigationLabel({ status })}>
        {status != null && <span className="sr-only">{STATUS_WORD[status]}: </span>}{children}
      </span>
      {meta != null && <span data-slot="list-navigation-meta" className={listNavigationMeta()}>{meta}</span>}
      {count != null && <span data-slot="list-navigation-count" data-hot={hot || undefined} className={listNavigationCount({ hot, kind, tone, variant })}>{count}</span>}
      {disclosure && <ChevronRight data-slot="list-navigation-chevron" data-expanded={open} aria-hidden="true" className={listNavigationChevron()} />}
    </>
  );
  let link: ReactNode;
  if (asChild && isValidElement<Record<string, unknown>>(children)) link = cloneElement(children, mergeChild({ ...common, 'data-slot': 'list-navigation-link' }, children.props));
  else if (href != null) link = <a data-slot="list-navigation-link" href={href} {...common}>{inner}</a>;
  else link = <button type="button" data-slot="list-navigation-link" {...(common as ComponentProps<'button'>)}>{inner}</button>;
  return (
    <li data-slot="list-navigation-item" className="grid gap-0.5">
      {link}
      {disclosure && open && (
        <DepthContext.Provider value={2}>
          <ul data-slot="list-navigation-sub" data-depth={2} id={subId} role="list" className={listNavigationSub({ depth: 2 })}>{sub}</ul>
        </DepthContext.Provider>
      )}
    </li>
  );
}

/**
 * One nested entry of an expanded ListNavigationItem (level 2), or of an expanded sub-item (level 3). A level-2 entry with
 * `sub` is a disclosure for its own children; nesting stops at level 3.
 */
export function ListNavigationSubItem({
  current = false, href, asChild = false, onClick, sub, expanded, defaultExpanded = false, onExpandedChange, className, children, ...props
}: ListNavigationSubItemProps) {
  const { size } = useContext(NavContext);
  const depth = useContext(DepthContext);
  const subId = useId();
  const disclosure = sub != null && depth < MAX_DEPTH;
  const [open, setOpen] = useControllableState({ value: expanded, defaultValue: defaultExpanded, onChange: onExpandedChange });
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    onClick?.(e);
    if (disclosure && !e.defaultPrevented) setOpen(!open);
  };
  const common = {
    'aria-current': current ? ('page' as const) : undefined,
    'aria-expanded': disclosure ? open : undefined,
    'aria-controls': disclosure && open ? subId : undefined,
    'data-depth': depth,
    className: cn(listNavigationSubLink({ size, depth: depth >= MAX_DEPTH ? 3 : 2 }), className),
    onClick: handleClick,
    ...props,
  };
  const inner = (
    <>
      <span data-slot="list-navigation-sub-label" className={listNavigationLabel()}>{children}</span>
      {disclosure && <ChevronRight data-slot="list-navigation-chevron" data-expanded={open} aria-hidden="true" className={listNavigationChevron()} />}
    </>
  );
  let link: ReactNode;
  if (asChild && isValidElement<Record<string, unknown>>(children)) link = cloneElement(children, mergeChild({ ...common, 'data-slot': 'list-navigation-sub-link' }, children.props));
  else if (href != null) link = <a data-slot="list-navigation-sub-link" href={href} {...common}>{inner}</a>;
  else link = <button type="button" data-slot="list-navigation-sub-link" {...(common as ComponentProps<'button'>)}>{inner}</button>;
  return (
    <li data-slot="list-navigation-sub-item" className="grid gap-0.5">
      {link}
      {disclosure && open && (
        <DepthContext.Provider value={depth + 1}>
          <ul data-slot="list-navigation-sub" data-depth={depth + 1} id={subId} role="list" className={listNavigationSub({ depth: 3 })}>{sub}</ul>
        </DepthContext.Provider>
      )}
    </li>
  );
}
