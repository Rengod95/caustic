'use client';
import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { Button } from '../button/button.tsx';
import { SectionHeader } from '../section-header/section-header.tsx';
import { formLayoutSectionVariants, formLayoutVariants } from './form-layout.variants.ts';

/** The form's tone and variant, read by every section. */
const SectionLook = createContext<{ tone?: Tone | undefined; variant?: Variant | undefined }>({});

export interface FormLayoutProps extends Omit<ComponentProps<'form'>, 'title'> {
  /** Page header title. The header renders when title is set. */
  title?: ReactNode;
  /** Page header description. */
  description?: ReactNode;
  children?: ReactNode;
  /** Colour family of the section separation (hairline, panel or titles). */
  tone?: Tone | undefined;
  /** How sections are separated: ghost (default) space only, outline hairlines, soft and solid panels. */
  variant?: Variant | undefined;
  /** Corner radius of the form; unset = none. */
  radius?: Radius | undefined;
  /** Elevation of the form; unset = none. */
  shadow?: Shadow | undefined;
  /** Gap between the header, the sections and the footer: xs 12, sm 16, md 20, lg 24. */
  size?: Size | undefined;
}

/** Settings-form layout: optional page header, titled sections and a save footer. Pure layout. */
export function FormLayout({ title, description, tone, variant, radius, shadow, size, className, children, ...props }: FormLayoutProps) {
  return (
    <SectionLook.Provider value={{ tone, variant }}>
      <form data-slot="form-layout" className={cn(formLayoutVariants({ radius, shadow, size }), className)} {...props}>
        {title != null && (
          <div data-slot="form-layout-header">
            <SectionHeader divided size="lg" title={title} description={description} />
          </div>
        )}
        {children}
      </form>
    </SectionLook.Provider>
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
  const look = useContext(SectionLook);
  return (
    <div
      data-slot="form-layout-section"
      className={cn(formLayoutSectionVariants(look), className)}
      {...props}
    >
      <div data-slot="form-layout-section-heading" className="flex w-form-heading-w max-w-full items-start">
        <SectionHeader headingLevel={3} title={<span id={titleId}>{title}</span>} description={description} />
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
