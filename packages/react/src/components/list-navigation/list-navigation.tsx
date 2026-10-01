'use client';
import { ChevronRight } from 'lucide-react';
import { cloneElement, isValidElement, useId, type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import {
  listNavigationChevron, listNavigationCount, listNavigationGroup, listNavigationHeading, listNavigationIcon,
  listNavigationLabel, listNavigationLink, listNavigationSub, listNavigationSubLink, listNavigationVariants,
} from './list-navigation.variants.ts';

export interface ListNavigationGroupProps extends Omit<ComponentProps<'ul'>, 'children'> {
  /** Section heading text; labels the group. */
  heading?: ReactNode;
  /** One IconButton xs at the end of the heading. */
  headingAction?: ReactNode;
  children?: ReactNode;
}

export interface ListNavigationItemProps extends Omit<ComponentProps<'a'>, 'children' | 'ref' | 'onClick' | 'href'> {
  /** Item text. */
  children?: ReactNode;
  /** Leading glyph. */
  icon?: ReactNode;
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
}

export interface ListNavigationSubItemProps extends Omit<ComponentProps<'a'>, 'ref' | 'onClick' | 'href'> {
  current?: boolean;
  href?: string;
  asChild?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
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

export interface ListNavigationProps extends ComponentProps<'nav'> {
  /** Accessible name of the landmark. */
  'aria-label': string;
}

/**
 * Sidebar navigation landmark. Compose with ListNavigationGroup and ListNavigationItem.
 */
export function ListNavigation({ className, ...props }: ListNavigationProps) {
  return <nav data-slot="list-navigation" className={cn(listNavigationVariants(), className)} {...props} />;
}

/** A run of items, with an optional heading that labels it. */
export function ListNavigationGroup({ heading, headingAction, className, children, ...props }: ListNavigationGroupProps) {
  const headingId = useId();
  return (
    <>
      {heading != null && (
        <div data-slot="list-navigation-heading" id={headingId} className={listNavigationHeading()}>
          {heading}
          {headingAction != null && <div data-slot="list-navigation-heading-action" className="flex items-center">{headingAction}</div>}
        </div>
      )}
      <ul data-slot="list-navigation-group" role="list" aria-labelledby={heading != null ? headingId : undefined} className={cn(listNavigationGroup(), className)} {...props}>
        {children}
      </ul>
    </>
  );
}

export function ListNavigationItem({
  icon, count, hot = false, current = false, href, sub, expanded, defaultExpanded = false, onExpandedChange, asChild = false,
  onClick, className, children, ...props
}: ListNavigationItemProps) {
  const subId = useId();
  const disclosure = sub != null;
  const [open, setOpen] = useControllableState({ value: expanded, defaultValue: defaultExpanded, onChange: onExpandedChange });
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    onClick?.(e);
    if (disclosure && !e.defaultPrevented) setOpen(!open);
  };
  const common = {
    'aria-current': current ? ('page' as const) : undefined,
    'aria-expanded': disclosure ? open : undefined,
    'aria-controls': disclosure && open ? subId : undefined,
    className: cn(listNavigationLink(), className),
    onClick: handleClick,
    ...props,
  };
  const inner = (
    <>
      {icon != null && <span data-slot="list-navigation-icon" aria-hidden="true" className={listNavigationIcon()}>{icon}</span>}
      <span data-slot="list-navigation-label" className={listNavigationLabel()}>{children}</span>
      {count != null && <span data-slot="list-navigation-count" data-hot={hot || undefined} className={listNavigationCount({ hot })}>{count}</span>}
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
      {disclosure && open && <ul data-slot="list-navigation-sub" id={subId} role="list" className={listNavigationSub()}>{sub}</ul>}
    </li>
  );
}

/** One nested entry of an expanded ListNavigationItem. */
export function ListNavigationSubItem({ current = false, href, asChild = false, onClick, className, children, ...props }: ListNavigationSubItemProps) {
  const common = {
    'aria-current': current ? ('page' as const) : undefined,
    className: cn(listNavigationSubLink(), className),
    onClick,
    ...props,
  };
  let link: ReactNode;
  if (asChild && isValidElement<Record<string, unknown>>(children)) link = cloneElement(children, mergeChild({ ...common, 'data-slot': 'list-navigation-sub-link' }, children.props));
  else if (href != null) link = <a data-slot="list-navigation-sub-link" href={href} {...common}>{children}</a>;
  else link = <button type="button" data-slot="list-navigation-sub-link" {...(common as ComponentProps<'button'>)}>{children}</button>;
  return <li data-slot="list-navigation-sub-item">{link}</li>;
}
