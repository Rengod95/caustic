'use client';
import * as AD from '@radix-ui/react-alert-dialog';
import * as D from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { createContext, use, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { defined } from '../../lib/defined.ts';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { modalOverlayClass, modalVariants, type ModalVariantProps } from './modal.variants.ts';

export interface ModalProps extends Omit<ComponentProps<'div'>, 'title' | 'children'>, ModalVariantProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** dialog = Radix Dialog; alert = Radix AlertDialog (does not close on an outside press). */
  kind?: 'dialog' | 'alert';
  /** Element that opens the modal (rendered with asChild). */
  trigger?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Icon shown in the danger-tinted tile before the title. */
  icon?: ReactNode;
  /** Close IconButton at the end of the header. */
  showClose?: boolean;
  /** aria-label of the close button; required with showClose. */
  closeLabel?: string | undefined;
  /** Footer content (buttons, optional flex-1 spacer). */
  footer?: ReactNode;
  /** Body content. */
  children?: ReactNode;
  /** Render the surface in place, open, without portal, overlay or animation (docs, specimens). */
  inline?: boolean;
}

// Inside a portal-mode alert the buttons must be AlertDialog parts (they register the cancel
// element that receives the first focus); everywhere else they are plain Dialog parts.
const AlertPortal = createContext(false);

/** Closes the modal. In kind="alert" it is the least destructive action and gets the first focus. */
export function ModalClose(props: ComponentProps<typeof D.Close>) {
  return use(AlertPortal) ? <AD.Cancel {...props} /> : <D.Close {...props} />;
}

/** The destructive confirm of kind="alert": Button tone="destructive" size="sm". Closes the modal. */
export function ModalAction({ children, ...props }: Omit<ComponentProps<typeof Button>, 'asChild' | 'tone' | 'size'>) {
  const Close = use(AlertPortal) ? AD.Action : D.Close;
  return (
    <Close asChild>
      <Button data-slot="modal-action" tone="destructive" size="sm" {...props}>{children}</Button>
    </Close>
  );
}

/** Sectioned thick-glass modal: header, scrolling body and footer. kind="alert" is the destructive confirm. */
export function Modal({ open, defaultOpen, onOpenChange, kind = 'dialog', trigger, size, title, description, icon, showClose = false, closeLabel, footer, children, inline = false, className, ...props }: ModalProps) {
  const alert = kind === 'alert';
  // An inline modal is part of the page: no portal, no focus steal, no outside dismissal. Escape
  // and close controls still close it. An inline alert uses Dialog parts with the alertdialog role
  // because AlertDialog is always modal and would block the page around it.
  const keep = (e: Event) => e.preventDefault();
  // A portal alert is a Radix AlertDialog: its parts need the AlertDialog context, the Dialog parts throw there.
  const parts = alert && !inline ? { Title: AD.Title, Description: AD.Description, Close: AD.Cancel } : { Title: D.Title, Description: D.Description, Close: D.Close };
  const surface = {
    'data-size': size ?? 'md', 'data-kind': kind,
    ...(description == null ? { 'aria-describedby': undefined } : {}),
    className: cn(modalVariants({ size, kind }), children != null ? 'grid-rows-[auto_minmax(0,1fr)_auto]' : 'grid-rows-[auto_auto]', inline ? 'relative' : 'max-h-full', className),
    ...props,
  };
  const content = (
    <>
      <div data-slot="modal-header" className="flex items-start gap-3 px-4.5 pt-4.5">
        {icon != null && <span data-slot="modal-icon" aria-hidden className="inline-grid size-control-lg shrink-0 place-items-center rounded-xl bg-danger-soft text-danger-text [&_svg]:size-icon-lg">{icon}</span>}
        <div data-slot="modal-heading" className="grid flex-1 gap-1">
          <parts.Title data-slot="modal-title" className="text-title-2 text-text-primary">{title}</parts.Title>
          {description != null && <parts.Description data-slot="modal-description" className="text-ui-relaxed text-text-secondary">{description}</parts.Description>}
        </div>
        {showClose && <parts.Close asChild><IconButton data-slot="modal-close" label={closeLabel ?? ''} size="sm"><X /></IconButton></parts.Close>}
      </div>
      {children != null && <div data-slot="modal-body" className="grid gap-3.5 overflow-y-auto px-4.5 py-4">{children}</div>}
      <div data-slot="modal-footer" className="flex items-center justify-end gap-2 px-4.5 pb-4 pt-3">{footer}</div>
    </>
  );

  if (inline) {
    return (
      <D.Root {...defined({ open, defaultOpen: defaultOpen ?? (open === undefined ? true : undefined), onOpenChange })} modal={false}>
        {trigger != null && <D.Trigger asChild>{trigger}</D.Trigger>}
        <D.Content {...(alert ? { role: 'alertdialog' } : {})} onOpenAutoFocus={keep} onFocusOutside={keep} onInteractOutside={keep} data-slot="modal" {...surface}>{content}</D.Content>
      </D.Root>
    );
  }
  const overlay = modalOverlayClass;
  if (alert) {
    return (
      <AlertPortal value>
        <AD.Root {...defined({ open, defaultOpen, onOpenChange })}>
          {trigger != null && <AD.Trigger asChild>{trigger}</AD.Trigger>}
          <AD.Portal>
            <AD.Overlay data-slot="modal-overlay" className={overlay}>
              <AD.Content data-slot="modal" {...surface}>{content}</AD.Content>
            </AD.Overlay>
          </AD.Portal>
        </AD.Root>
      </AlertPortal>
    );
  }
  return (
    <D.Root {...defined({ open, defaultOpen, onOpenChange })}>
      {trigger != null && <D.Trigger asChild>{trigger}</D.Trigger>}
      <D.Portal>
        <D.Overlay data-slot="modal-overlay" className={overlay}>
          <D.Content data-slot="modal" {...surface}>{content}</D.Content>
        </D.Overlay>
      </D.Portal>
    </D.Root>
  );
}
