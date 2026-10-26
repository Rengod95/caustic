'use client';
import * as D from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { defined } from '../../lib/defined.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { sheetVariants, type SheetVariantProps } from './sheet.variants.ts';

export interface SheetProps extends Omit<ComponentProps<'div'>, 'title' | 'children'>, SheetVariantProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the sheet (rendered with asChild). */
  trigger?: ReactNode;
  title: ReactNode;
  /** Hairlines under the header and above the footer. When false the header has no border and the body no top padding. */
  dividers?: boolean;
  /** Close IconButton at the end of the header. */
  showClose?: boolean;
  /** Footer content, usually buttons. */
  footer?: ReactNode;
  /** Body content. */
  children?: ReactNode;
  /** Render the surface open, in place, without portal, overlay or animation, absolutely positioned in the nearest positioned ancestor. */
  inline?: boolean;
}

/** Closes the sheet. Use inside the footer. */
export function SheetClose(props: ComponentProps<typeof D.Close>) { return <D.Close {...props} />; }

/** Edge-attached thick-glass panel: header, scrolling body and optional footer. */
export function Sheet({ open, defaultOpen, onOpenChange, trigger, side, title, dividers = true, showClose = true, footer, children, inline = false, className, ...props }: SheetProps) {
  const bottom = side === 'bottom';
  // An inline sheet is part of the page: no portal, no focus steal, no outside dismissal.
  const keep = (e: Event) => e.preventDefault();
  const surface = (
    <D.Content
      data-slot="sheet" data-side={side ?? 'right'}
      aria-describedby={undefined}
      {...(inline ? { onOpenAutoFocus: keep, onFocusOutside: keep, onInteractOutside: keep } : {})}
      className={cn(
        sheetVariants({ side }),
        inline ? 'absolute' : 'fixed',
        !bottom && (inline ? 'w-[56%]' : 'w-sheet-md max-w-[calc(100%-var(--cs-space-5))]'),
        className,
      )}
      {...props}
    >
      {bottom && <span data-slot="sheet-grabber" aria-hidden className="mx-auto mt-2 h-1.25 w-grabber-w shrink-0 rounded-xs bg-neutral-track" />}
      <div data-slot="sheet-header" className={cn('flex shrink-0 items-center gap-2.5 border-b px-4 py-3.5', dividers ? 'border-border-subtle' : 'border-transparent')}>
        <D.Title data-slot="sheet-title" className="flex-1 text-title-3 text-text-primary">{title}</D.Title>
        {showClose && <D.Close asChild><IconButton data-slot="sheet-close" label="Close" size="xs"><X /></IconButton></D.Close>}
      </div>
      <div data-slot="sheet-body" className={cn('grid flex-1 content-start gap-3.5 overflow-y-auto px-4 pb-4', dividers ? 'pt-4' : 'pt-0')}>{children}</div>
      {footer != null && <div data-slot="sheet-footer" className={cn('flex shrink-0 items-center justify-end gap-2 border-t px-4 py-3', dividers ? 'border-border-subtle' : 'border-transparent')}>{footer}</div>}
    </D.Content>
  );
  return (
    <D.Root {...defined({ open, defaultOpen: defaultOpen ?? (inline && open === undefined ? true : undefined), onOpenChange })} modal={inline ? false : true}>
      {trigger != null && <D.Trigger asChild>{trigger}</D.Trigger>}
      {inline ? surface : (
        <D.Portal>
          <D.Overlay data-slot="sheet-overlay" className="fixed inset-0 z-60 bg-bg-scrim" />
          {surface}
        </D.Portal>
      )}
    </D.Root>
  );
}
