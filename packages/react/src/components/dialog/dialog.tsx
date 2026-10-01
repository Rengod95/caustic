'use client';
import * as D from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { dialogVariants, type DialogVariantProps } from './dialog.variants.ts';

export interface DialogProps extends Omit<ComponentProps<typeof D.Content>, 'children'>, DialogVariantProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Modal dialogs trap focus and hide the page from assistive tech. */
  modal?: boolean;
  /** Element that opens the dialog (rendered with asChild). */
  trigger?: ReactNode;
  /** Render in place without portal and overlay (docs, previews, embedded flows). */
  inline?: boolean;
  /** Show the top-right close button. */
  showClose?: boolean;
  children?: ReactNode;
}

/** Thick-glass dialog: owns its open state and its surface. Compose with DialogHeader/Title/Description/Footer. */
export function Dialog({ open, defaultOpen, onOpenChange, modal = true, trigger, size, inline = false, showClose = false, className, children, onOpenAutoFocus, onFocusOutside, onInteractOutside, ...props }: DialogProps) {
  // An inline dialog is part of the page: it does not steal focus on mount and does not close
  // when focus or pointer moves elsewhere. Escape and close controls still close it.
  const keep = (e: Event) => e.preventDefault();
  const surface = (
    <D.Content
      onOpenAutoFocus={onOpenAutoFocus ?? (inline ? keep : undefined)}
      onFocusOutside={onFocusOutside ?? (inline ? keep : undefined)}
      onInteractOutside={onInteractOutside ?? (inline ? keep : undefined)}
      data-slot="dialog" data-size={size ?? 'md'}
      className={cn(dialogVariants({ size }), inline ? 'relative' : 'fixed left-1/2 top-1/2 z-60 -translate-x-1/2 -translate-y-1/2', className)}
      {...props}
    >
      {children}
      {showClose && (
        <D.Close data-slot="dialog-close" aria-label="Close" className="absolute right-2.5 top-2.5 inline-grid size-control-sm place-items-center rounded-md text-text-secondary outline-none hover:bg-fill-pressed hover:text-text-primary focus-visible:shadow-focus [&_svg]:size-icon-md">
          <X />
        </D.Close>
      )}
    </D.Content>
  );
  return (
    <D.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={inline ? false : modal}>
      {trigger != null && <D.Trigger asChild>{trigger}</D.Trigger>}
      {inline ? surface : (
        <D.Portal>
          <D.Overlay data-slot="dialog-overlay" className="fixed inset-0 z-60 bg-bg-scrim" />
          {surface}
        </D.Portal>
      )}
    </D.Root>
  );
}

export function DialogClose(props: ComponentProps<typeof D.Close>) { return <D.Close {...props} />; }
export function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="dialog-header" className={cn('grid gap-1', className)} {...props} />;
}
export function DialogTitle({ className, ...props }: ComponentProps<typeof D.Title>) {
  return <D.Title data-slot="dialog-title" className={cn('text-title-3 text-text-primary', className)} {...props} />;
}
export function DialogDescription({ className, ...props }: ComponentProps<typeof D.Description>) {
  return <D.Description data-slot="dialog-description" className={cn('text-ui-dense text-text-secondary', className)} {...props} />;
}
export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="dialog-footer" className={cn('flex flex-wrap items-center justify-end gap-2', className)} {...props} />;
}
