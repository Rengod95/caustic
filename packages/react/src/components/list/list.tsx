'use client';
import { ChevronRight } from 'lucide-react';
import { cloneElement, createContext, isValidElement, useContext, useId, type ComponentProps, type MouseEventHandler, type ReactElement, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import {
  listChevronVariants, listDescriptionVariants, listDurationVariants, listEndVariants, listGroupFooterVariants, listGroupHeadingVariants,
  listGroupVariants, listHeadingEndVariants, listHeadingVariants, listItemsVariants, listLeadVariants, listLeadWrapVariants, listOrbVariants,
  listRowVariants, listTextVariants, listThumbVariants, listTileVariants, listTitleVariants, listTriggerVariants, listValueVariants, listVariants,
  type ListTint, type ListVariantProps,
} from './list.variants.ts';

type ListSize = NonNullable<ListVariantProps['size']>;
const SizeContext = createContext<ListSize>('md');

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

export interface ListProps extends ComponentProps<'div'> {
  /** Row minimum height 48 · 52 · 64. A row may override it. */
  size?: ListSize;
  /** Caption inside the surface above the rows; also the accessible name. */
  heading?: ReactNode;
  /** Count or meta at the end of the heading. */
  headingEnd?: ReactNode;
  /** Accessible name when there is no heading. */
  'aria-label'?: string;
}

/**
 * The grouped list surface: translucent rows with a hairline edge that read like an inset-grouped list.
 */
export function List({
  size = 'md', heading, headingEnd, 'aria-label': ariaLabel, className, children, ...props
}: ListProps) {
  const headingId = useId();
  return (
    <SizeContext.Provider value={size}>
      <div data-slot="list" data-size={size} className={cn(listVariants(), className)} {...props}>
        {heading != null && (
          <div data-slot="list-heading" id={headingId} className={listHeadingVariants()}>
            {heading}
            {headingEnd != null && <span data-slot="list-heading-end" className={listHeadingEndVariants()}>{headingEnd}</span>}
          </div>
        )}
        <ul data-slot="list-items" role="list" aria-labelledby={heading != null ? headingId : undefined} aria-label={heading != null ? undefined : ariaLabel} className={listItemsVariants()}>
          {children}
        </ul>
      </div>
    </SizeContext.Provider>
  );
}

export interface ListRowProps extends Omit<ComponentProps<'li'>, 'title' | 'onClick' | 'value'>, ListVariantProps {
  title: ReactNode;
  /** One line under the title. */
  description?: ReactNode;
  /** Glyph for the icon tile. */
  icon?: ReactNode;
  /** Identity color of the icon tile. */
  tint?: ListTint;
  /** Custom leading element (Avatar); use instead of icon. */
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
}

/** One row: leading, title and description, value, trailing content and chevron. Interactive when it has onClick, href or asChild. */
export function ListRow({
  size, tone, status, title, description, icon, tint, leading, thumb, duration, value, end, navigates = false, href, asChild = false,
  onClick, className, children, ...props
}: ListRowProps) {
  const listSize = useContext(SizeContext);
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  const kind = thumb != null ? 'thumb' : leading != null ? 'avatar' : icon != null ? 'tile' : 'none';
  const interactive = asChild || href != null || onClick != null;
  const triggerProps = {
    'aria-labelledby': titleId,
    'aria-describedby': description != null ? descId : undefined,
    className: listTriggerVariants(),
    onClick,
  };
  let trigger: ReactNode = null;
  if (interactive) {
    if (asChild && isValidElement(children)) {
      trigger = cloneElement(children as ReactElement<Record<string, unknown>>, { 'data-slot': 'list-trigger', ...triggerProps });
    } else if (href != null) {
      trigger = <a data-slot="list-trigger" href={href} {...triggerProps} />;
    } else {
      trigger = <button data-slot="list-trigger" type="button" {...triggerProps} />;
    }
  }
  return (
    <li
      data-slot="list-row" data-size={size ?? listSize} data-tone={tone ?? 'default'} data-status={status ?? 'idle'} data-lead={kind}
      className={cn(listRowVariants({ size: size ?? listSize, tone, status }), listLeadVariants({ lead: kind }), className)}
      {...props}
    >
      {trigger}
      {kind !== 'none' && (
        <div data-slot="list-lead" className={listLeadWrapVariants()}>
          {kind === 'thumb' ? (
            <div data-slot="list-thumb" className={listThumbVariants()}>
              {thumb}
              {duration != null && <span data-slot="list-duration" className={listDurationVariants()}>{duration}</span>}
            </div>
          ) : kind === 'avatar' ? leading : (
            <div data-slot="list-tile" aria-hidden className={listTileVariants({ tint })}>{icon}</div>
          )}
        </div>
      )}
      <div data-slot="list-text" className={listTextVariants()}>
        <span data-slot="list-title" id={titleId} className={listTitleVariants({ tone })}>{title}</span>
        {description != null && <span data-slot="list-description" id={descId} className={listDescriptionVariants()}>{description}</span>}
      </div>
      {value != null && <span data-slot="list-value" className={listValueVariants()}>{value}</span>}
      {(end != null || status === 'working') && (
        <div data-slot="list-end" className={listEndVariants()}>
          {end}
          {status === 'working' && <span data-slot="list-orb" aria-hidden className={listOrbVariants({ status })} />}
        </div>
      )}
      {navigates && <ChevronRight data-slot="list-chevron" aria-hidden className={listChevronVariants()} />}
    </li>
  );
}
