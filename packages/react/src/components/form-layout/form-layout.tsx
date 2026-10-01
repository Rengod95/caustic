'use client';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Button } from '../button/button.tsx';
import { SectionHeader } from '../section-header/section-header.tsx';

export interface FormLayoutProps extends Omit<ComponentProps<'form'>, 'title'> {
  /** Page header title. The header renders when title is set. */
  title?: ReactNode;
  /** Page header description. */
  description?: ReactNode;
  children?: ReactNode;
}

/** Settings-form layout: optional page header, titled sections and a save footer. Pure layout. */
export function FormLayout({ title, description, className, children, ...props }: FormLayoutProps) {
  return (
    <form data-slot="form-layout" className={cn('grid w-full gap-5', className)} {...props}>
      {title != null && (
        <div data-slot="form-layout-header">
          <SectionHeader divided title={title} description={description} />
        </div>
      )}
      {children}
    </form>
  );
}

export interface FormLayoutSectionProps extends Omit<ComponentProps<'div'>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

/** Heading on the left, fields on the right; stacks on narrow containers. */
export function FormLayoutSection({ title, description, className, children, ...props }: FormLayoutSectionProps) {
  const titleId = useId();
  return (
    <div
      data-slot="form-layout-section"
      className={cn('flex flex-wrap gap-x-6 gap-y-3 border-t border-border-subtle pt-5 first:border-t-0 first:pt-0', className)}
      {...props}
    >
      <div data-slot="form-layout-section-heading" className="flex w-form-heading-w max-w-full">
        <SectionHeader size="sm" headingLevel={3} title={<span id={titleId}>{title}</span>} description={description} />
      </div>
      <div data-slot="form-layout-section-body" role="group" aria-labelledby={titleId} className="grid min-w-form-body-min max-w-full flex-1 gap-3">
        {children}
      </div>
    </div>
  );
}

export interface FormLayoutFooterProps extends ComponentProps<'div'> {
  discardLabel?: ReactNode;
  saveLabel?: ReactNode;
  onDiscard?: () => void;
}

/** Right-aligned action row. Without children it renders Discard (button) and Save changes (submit). */
export function FormLayoutFooter({ discardLabel = 'Discard', saveLabel = 'Save changes', onDiscard, className, children, ...props }: FormLayoutFooterProps) {
  return (
    <div data-slot="form-layout-footer" className={cn('flex justify-end gap-2 pt-1', className)} {...props}>
      {children ?? (
        <>
          <Button type="button" tone="secondary" onClick={onDiscard}>{discardLabel}</Button>
          <Button type="submit">{saveLabel}</Button>
        </>
      )}
    </div>
  );
}

FormLayout.Section = FormLayoutSection;
FormLayout.Footer = FormLayoutFooter;
