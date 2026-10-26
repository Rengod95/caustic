'use client';
import { File, Plus } from 'lucide-react';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { IconButton } from '../icon-button/icon-button.tsx';

export interface PageListProps extends Omit<ComponentProps<'nav'>, 'aria-label'> {
  /** aria-label of the landmark and the title text. */
  label: string;
  /** aria-label of the add button. */
  addLabel: string;
  /** The add button is activated. */
  onAdd?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** PageListRow elements. */
  children: ReactNode;
}

/** The pages of a project: a heading with an add button, then one row per page. */
export function PageList({ label, addLabel, onAdd, className, children, ...props }: PageListProps) {
  return (
    <nav data-slot="page-list" aria-label={label} className={cn('grid gap-px', className)} {...props}>
      <div data-slot="page-list-header" className="flex items-center justify-between gap-2">
        <span data-slot="page-list-title" className="text-micro font-semibold text-text-tertiary">{label}</span>
        <IconButton data-slot="page-list-add" label={addLabel} size="xs" onClick={onAdd}><Plus /></IconButton>
      </div>
      {children}
    </nav>
  );
}

export interface PageListRowProps extends ComponentProps<'button'> {
  /** Marks the current page: aria-current="page", the segment thumb (control-raised fill + control edge, §4 B2/B3, as list-navigation), 500 weight. */
  current?: boolean;
  /** Trailing frame count. */
  count?: ReactNode;
  /** A row is activated by pointer, Enter or Space. */
  onSelect?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export function PageListRow({ current = false, count, onSelect, onClick, className, children, ...props }: PageListRowProps) {
  return (
    <button
      type="button"
      data-slot="page-list-row"
      data-state={current ? 'selected' : undefined}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'flex h-menu-item w-full items-center gap-2 rounded-md px-2 text-left font-ui text-ui-dense text-text-primary',
        'transition-[background-color,box-shadow] duration-120 ease-out outline-none',
        'hover:bg-neutral-hover focus-visible:shadow-focus aria-[current=page]:bg-control-raised aria-[current=page]:font-medium',
        'aria-[current=page]:shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)] aria-[current=page]:hover:bg-control-raised-hover aria-[current=page]:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-control-edge),var(--cs-focus)]',
        className,
      )}
      onClick={e => { onClick?.(e); onSelect?.(e); }}
      {...props}
    >
      <File data-slot="page-list-icon" aria-hidden className="size-icon-sm shrink-0 text-text-tertiary" />
      <span data-slot="page-list-label" className="min-w-0 truncate">{children}</span>
      {count != null && <span data-slot="page-list-count" className="ml-auto shrink-0 text-ui-xs font-normal text-text-tertiary">{count}</span>}
    </button>
  );
}
