'use client';
import { Plus } from 'lucide-react';
import { useId, type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import {
  appendListActionVariants, appendListAddVariants, appendListDescriptionVariants, appendListEndVariants, appendListHeadingVariants, appendListIconVariants,
  appendListListVariants, appendListRowVariants, appendListTextVariants, appendListTitleVariants, appendListVariants,
} from './append-list.variants.ts';

export interface AppendListRowProps extends Omit<ComponentProps<'li'>, 'title'> {
  /** Leading glyph. */
  icon?: ReactNode;
  /** Name of the item. */
  title: ReactNode;
  /** Muted detail after the name; keep the leading middle dot in the string. */
  description?: ReactNode;
  /** Trailing Badge (square) or count. */
  end?: ReactNode;
}

export interface AppendListProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Title of the collection; also the accessible name of the list. */
  heading: ReactNode;
  /** Header action, normally an IconButton xs with an aria-label. */
  action?: ReactNode;
  /** Label of the add row ("Add axis"). */
  addLabel: ReactNode;
  /** The add row was activated. */
  onAdd?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** AppendListRow items. */
  children?: ReactNode;
}

/** A titled, opaque list of the items of one collection that ends with an add row. Rows are read-only summaries. */
export function AppendList({ heading, action, addLabel, onAdd, className, children, ...props }: AppendListProps) {
  const titleId = useId();
  return (
    <div data-slot="append-list" className={cn(appendListVariants(), className)} {...props}>
      <div data-slot="append-list-heading" className={appendListHeadingVariants()}>
        <span data-slot="append-list-title" id={titleId} className={appendListTitleVariants()}>{heading}</span>
        {action != null && <div data-slot="append-list-action" className={appendListActionVariants()}>{action}</div>}
      </div>
      <ul data-slot="append-list-list" role="list" aria-labelledby={titleId} className={appendListListVariants()}>{children}</ul>
      <button type="button" data-slot="append-list-add" className={appendListAddVariants()} onClick={onAdd}>
        <Plus aria-hidden />
        {addLabel}
      </button>
    </div>
  );
}

/** One read-only summary row: glyph, name with a muted detail, trailing badge or count. */
export function AppendListRow({ icon, title, description, end, className, ...props }: AppendListRowProps) {
  return (
    <li data-slot="append-list-row" className={cn(appendListRowVariants(), className)} {...props}>
      {icon != null ? <span data-slot="append-list-icon" aria-hidden className={appendListIconVariants()}>{icon}</span> : <span aria-hidden />}
      <span data-slot="append-list-text" className={appendListTextVariants()}>
        {title}
        {description != null && <>{' '}<span data-slot="append-list-description" className={appendListDescriptionVariants()}>{description}</span></>}
      </span>
      {end != null && <span data-slot="append-list-end" className={appendListEndVariants()}>{end}</span>}
    </li>
  );
}
