'use client';
import { ChevronRight, Ellipsis } from 'lucide-react';
import { Children, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { IconButton, type IconButtonProps } from '../icon-button/icon-button.tsx';
import { breadcrumbCurrent, breadcrumbIcon, breadcrumbItem, breadcrumbSeparator, breadcrumbVariants } from './breadcrumb.variants.ts';

export interface BreadcrumbProps extends Omit<ComponentProps<'nav'>, 'aria-label'> {
  /** Landmark label; supplied by the consumer (no built-in text). */
  'aria-label': string;
  /** The trail: BreadcrumbItem, BreadcrumbEllipsis and one BreadcrumbCurrent. */
  children?: ReactNode;
}

/** Where the current page sits in a hierarchy. Separators are inserted between entries. */
export function Breadcrumb({ 'aria-label': ariaLabel, className, children, ...props }: BreadcrumbProps) {
  const entries = Children.toArray(children);
  return (
    <nav data-slot="breadcrumb" aria-label={ariaLabel} className={cn(breadcrumbVariants(), className)} {...props}>
      <ol data-slot="breadcrumb-list" className="contents">
        {entries.map((entry, i) => (
          <li key={i} className="contents">
            {i > 0 && (
              <span data-slot="breadcrumb-separator" aria-hidden="true" className={breadcrumbSeparator()}><ChevronRight /></span>
            )}
            {entry}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface BreadcrumbItemProps extends ComponentProps<'a'> {
  /** Optional leading lucide icon (14px). */
  icon?: ReactNode;
}

/** An ancestor link in tertiary text. */
export function BreadcrumbItem({ icon, className, children, ...props }: BreadcrumbItemProps) {
  return (
    <a data-slot="breadcrumb-item" className={cn(breadcrumbItem(), className)} {...props}>
      {icon != null && <span data-slot="breadcrumb-icon" aria-hidden="true" className={breadcrumbIcon()}>{icon}</span>}
      {children}
    </a>
  );
}

export interface BreadcrumbEllipsisProps extends Omit<IconButtonProps, 'children' | 'size' | 'tone' | 'shape'> {
  /** Accessible name that says how many entries are hidden, for example "Show 3 more". */
  label: string;
}

/** Collapsed middle path. Revealing the hidden entries is the consumer's job. */
export function BreadcrumbEllipsis({ label, ...props }: BreadcrumbEllipsisProps) {
  return <IconButton data-slot="breadcrumb-ellipsis" size="xs" label={label} {...props}><Ellipsis /></IconButton>;
}

export type BreadcrumbCurrentProps = ComponentProps<'span'>;

/** The current page: primary text, not a link. */
export function BreadcrumbCurrent({ className, ...props }: BreadcrumbCurrentProps) {
  return <span data-slot="breadcrumb-current" aria-current="page" className={cn(breadcrumbCurrent(), className)} {...props} />;
}
