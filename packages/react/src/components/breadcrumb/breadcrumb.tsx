'use client';
import { ChevronRight, Ellipsis } from 'lucide-react';
import { Children, createContext, isValidElement, useContext, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { IconButton, type IconButtonProps } from '../icon-button/icon-button.tsx';
import { breadcrumbCurrent, breadcrumbIcon, breadcrumbItem, breadcrumbSeparator, breadcrumbVariants } from './breadcrumb.variants.ts';

const TrailCtx = createContext<CommonProps>({});

/** Common props: variant / tone / shadow style the current page (tone also the separators), radius the item corners, size type and padding. */
export interface BreadcrumbProps extends Omit<ComponentProps<'nav'>, 'aria-label'>, CommonProps {
  /** Landmark label; supplied by the consumer (no built-in text). */
  'aria-label': string;
  /** The trail: BreadcrumbItem, BreadcrumbEllipsis and one BreadcrumbCurrent. */
  children?: ReactNode;
}

/** Where the current page sits in a hierarchy. Separators are inserted between entries. */
export function Breadcrumb({ 'aria-label': ariaLabel, tone, variant, radius, shadow, size, className, children, ...props }: BreadcrumbProps) {
  const entries = Children.toArray(children);
  return (
    <TrailCtx.Provider value={{ tone, variant, radius, shadow, size }}>
      <nav data-slot="breadcrumb" aria-label={ariaLabel} className={cn(breadcrumbVariants({ size }), className)} {...props}>
        <ol data-slot="breadcrumb-list" className="contents">
          {entries.map((entry, i) => (
            // The ancestor right before the current page is the likeliest way back: it reads one step stronger (data-parent).
            <li key={i} className="group/crumb contents" data-parent={isValidElement(entries[i + 1]) && (entries[i + 1] as { type?: unknown }).type === BreadcrumbCurrent ? true : undefined}>
              {i > 0 && (
                <span data-slot="breadcrumb-separator" aria-hidden="true" className={breadcrumbSeparator({ tone })}><ChevronRight /></span>
              )}
              {entry}
            </li>
          ))}
        </ol>
      </nav>
    </TrailCtx.Provider>
  );
}

export interface BreadcrumbItemProps extends ComponentProps<'a'> {
  /** Optional leading lucide icon (14px). */
  icon?: ReactNode;
}

/** An ancestor link in tertiary text; the parent of the current page in secondary text. */
export function BreadcrumbItem({ icon, className, children, ...props }: BreadcrumbItemProps) {
  const { size, radius } = useContext(TrailCtx);
  return (
    <a data-slot="breadcrumb-item" className={cn(breadcrumbItem({ size, radius }), className)} {...props}>
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
  const { tone, variant, radius, shadow, size } = useContext(TrailCtx);
  return <span data-slot="breadcrumb-current" aria-current="page" className={cn(breadcrumbCurrent({ tone, variant, radius, shadow, size }), className)} {...props} />;
}
