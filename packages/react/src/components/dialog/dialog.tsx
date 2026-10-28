'use client';
import * as AD from '@radix-ui/react-alert-dialog';
import * as D from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { createContext, use, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { defined } from '../../lib/defined.ts';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import {
  dialogBodyVariants, dialogDescriptionVariants, dialogFooterVariants, dialogHeaderVariants, dialogTitleVariants, dialogVariants,
} from './dialog.variants.ts';

export type DialogPlacement = 'center' | 'right' | 'bottom';
type Frame = 'compact' | 'sectioned';

interface DialogContextValue {
  placement: DialogPlacement;
  frame: Frame;
  size: Size;
  kind: 'dialog' | 'alert';
  dividers: boolean;
  /** A portal-mode alert is a Radix AlertDialog: its parts must be the AlertDialog parts. */
  alertPortal: boolean;
  icon: ReactNode;
  showClose: boolean;
  closeLabel: string | undefined;
}
const DialogContext = createContext<DialogContextValue>({
  placement: 'center', frame: 'compact', size: 'md', kind: 'dialog', dividers: false, alertPortal: false, icon: null, showClose: false, closeLabel: undefined,
});

export interface DialogProps extends Omit<ComponentProps<typeof D.Content>, 'children' | 'title'> {
  /** Where the surface sits: center (a dialog), right (a side sheet) or bottom (a bottom sheet with the grabber). */
  placement?: DialogPlacement;
  /** dialog = Radix Dialog; alert = role alertdialog (Radix AlertDialog in portal mode: no outside-press dismissal), danger icon tile. */
  kind?: 'dialog' | 'alert';
  /**
   * Centre: the width step (compact xs 280 with the compact inset, sm 320; sectioned xs 320, sm 380; md 480, lg 640).
   * Edge: steps the band padding, the body gap and the title.
   */
  size?: Size | undefined;
  /** Hue of the surface: a hue draws a 1px rim (solid, outline, ghost) or tints the material (soft). */
  tone?: Tone | undefined;
  /** solid (default) = thick material; soft = the tone soft fill; outline = thick material with a 1px rim; ghost = no elevation. */
  variant?: Variant | undefined;
  /** Corner radius; unset (panel) keeps the placement radius. */
  radius?: Radius | 'panel' | undefined;
  /** Elevation; unset = 5 (ghost: none). */
  shadow?: Shadow | undefined;
  /** Hairlines under the header and above the footer of the sectioned frame (off by default). */
  dividers?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Modal dialogs trap focus and hide the page from assistive tech. */
  modal?: boolean;
  /** Element that opens the dialog (rendered with asChild). */
  trigger?: ReactNode;
  /** Header title. Given, the dialog renders the sectioned frame: header band, scrolling body, footer band. */
  title?: ReactNode;
  /** Header supporting text (with title). */
  description?: ReactNode;
  /** Icon in the tile before the title: neutral for kind="dialog", danger soft for kind="alert". */
  icon?: ReactNode;
  /** Footer content (buttons, an optional flex-1 spacer). */
  footer?: ReactNode;
  /** Render in place, open, without portal and overlay (docs, previews, embedded flows). Edge placements sit absolutely in the nearest positioned ancestor. */
  inline?: boolean;
  /** Show the close button (top-right in the compact frame, at the end of the header otherwise). */
  showClose?: boolean;
  /** aria-label of the close button; supply it whenever showClose (no built-in text). */
  closeLabel?: string | undefined;
  /** Body content (with title), or the parts of a custom layout. */
  children?: ReactNode;
}

/**
 * Thick-glass dialog. Without title it is the compact stack you compose with DialogHeader/Title/Description/Footer.
 * With title (and always at an edge) it is sectioned: header band, scrolling DialogBody, footer band.
 */
export function Dialog({
  open, defaultOpen, onOpenChange, modal = true, placement = 'center', kind = 'dialog', trigger, size, tone, variant, radius, shadow,
  dividers = false, title, description, icon, footer, inline = false, showClose = false, closeLabel, className, children,
  onOpenAutoFocus, onFocusOutside, onInteractOutside, onPointerDownOutside, ...props
}: DialogProps) {
  const frame: Frame = placement !== 'center' || title != null ? 'sectioned' : 'compact';
  const alert = kind === 'alert';
  const alertPortal = alert && !inline;
  const edge = placement !== 'center';
  const ctx: DialogContextValue = { placement, frame, size: size ?? 'md', kind, dividers, alertPortal, icon, showClose, closeLabel };
  // An inline dialog is part of the page: it does not steal focus on mount and does not close when focus or pointer
  // moves elsewhere. Escape and close controls still close it.
  const keep = (e: Event) => e.preventDefault();
  const Close = alertPortal ? AD.Cancel : D.Close;

  const surface = {
    'data-placement': placement, 'data-kind': kind, 'data-size': size ?? 'md',
    ...(alert && inline ? { role: 'alertdialog' } : {}),
    ...(title != null && description == null ? { 'aria-describedby': undefined } : {}),
    className: cn(
      // A ghost dialog sits flat: unless a shadow is given, the elevation drops with the variant.
      dialogVariants({ placement, frame, kind, size, tone, variant, radius, shadow: shadow ?? (variant === 'ghost' ? 'none' : undefined) }),
      placement === 'center' && (inline ? 'relative' : 'fixed left-1/2 top-1/2 z-60 w-[calc(100%-var(--cs-space-8))] max-h-[calc(100%-var(--cs-space-8))] -translate-x-1/2 -translate-y-1/2'),
      edge && (inline ? 'absolute' : 'fixed'),
      placement === 'right' && (inline ? 'w-[56%]' : 'w-sheet-md max-w-[calc(100%-var(--cs-space-5))]'),
      className,
    ),
    ...props,
  };
  const content = (
    <DialogContext value={ctx}>
      {placement === 'bottom' && <span data-slot="dialog-grabber" aria-hidden className="mx-auto mt-2 h-1.25 w-grabber-w shrink-0 rounded-xs bg-neutral-track" />}
      {title != null && (
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description != null && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
      )}
      {title != null && children != null ? <DialogBody>{children}</DialogBody> : children}
      {footer != null && <DialogFooter>{footer}</DialogFooter>}
      {frame === 'compact' && showClose && (
        <Close data-slot="dialog-close" {...(closeLabel !== undefined ? { 'aria-label': closeLabel } : {})} className="absolute right-2.5 top-2.5 inline-grid size-control-sm place-items-center rounded-md text-text-secondary outline-none hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus [&_svg]:size-icon-md">
          <X />
        </Close>
      )}
    </DialogContext>
  );

  if (alertPortal) {
    return (
      <AD.Root {...defined({ open, defaultOpen, onOpenChange })}>
        {trigger != null && <AD.Trigger asChild>{trigger}</AD.Trigger>}
        <AD.Portal>
          <AD.Overlay data-slot="dialog-overlay" className="fixed inset-0 z-60 bg-bg-scrim" />
          <AD.Content data-slot="dialog" {...defined({ onOpenAutoFocus })} {...surface}>{content}</AD.Content>
        </AD.Portal>
      </AD.Root>
    );
  }
  const body = (
    <D.Content
      data-slot="dialog"
      {...defined({
        onOpenAutoFocus: onOpenAutoFocus ?? (inline ? keep : undefined),
        onFocusOutside: onFocusOutside ?? (inline ? keep : undefined),
        onInteractOutside: onInteractOutside ?? (inline ? keep : undefined),
        onPointerDownOutside,
      })}
      {...surface}
    >
      {content}
    </D.Content>
  );
  return (
    <D.Root {...defined({ open, defaultOpen: defaultOpen ?? (inline && open === undefined ? true : undefined), onOpenChange })} modal={inline ? false : modal}>
      {trigger != null && <D.Trigger asChild>{trigger}</D.Trigger>}
      {inline ? body : (
        <D.Portal>
          <D.Overlay data-slot="dialog-overlay" className="fixed inset-0 z-60 bg-bg-scrim" />
          {body}
        </D.Portal>
      )}
    </D.Root>
  );
}

/** Closes the dialog. In kind="alert" it is the least destructive action and gets the first focus. */
export function DialogClose(props: ComponentProps<typeof D.Close>) {
  return use(DialogContext).alertPortal ? <AD.Cancel {...props} /> : <D.Close {...props} />;
}

/** The destructive confirm of kind="alert": Button tone="destructive" size="sm". Closes the dialog. */
export function DialogAction({ children, ...props }: Omit<ComponentProps<typeof Button>, 'asChild' | 'tone' | 'size'>) {
  const Close = use(DialogContext).alertPortal ? AD.Action : D.Close;
  return (
    <Close asChild>
      <Button data-slot="dialog-action" tone="destructive" size="sm" {...props}>{children}</Button>
    </Close>
  );
}

/**
 * Title and description. Compact frame: a 4px stack. Sectioned frame: the header band, holding the icon tile, the
 * heading (its children) and the close button.
 */
export function DialogHeader({ className, children, ...props }: ComponentProps<'div'>) {
  const ctx = use(DialogContext);
  if (ctx.frame === 'compact') return <div data-slot="dialog-header" className={cn('grid gap-1', className)} {...props}>{children}</div>;
  const alert = ctx.kind === 'alert';
  return (
    <div data-slot="dialog-header" className={cn(dialogHeaderVariants({ placement: ctx.placement, dividers: ctx.dividers, size: ctx.size }), className)} {...props}>
      {ctx.icon != null && <span data-slot="dialog-icon" aria-hidden className={cn('inline-grid size-control-lg shrink-0 place-items-center rounded-xl [&_svg]:size-icon-lg', alert ? 'bg-danger-soft text-danger-text' : 'bg-neutral-track text-text-secondary')}>{ctx.icon}</span>}
      <div data-slot="dialog-heading" className="grid min-w-0 flex-1 gap-1">{children}</div>
      {ctx.showClose && (
        <DialogClose asChild>
          <IconButton data-slot="dialog-close" label={ctx.closeLabel ?? ''} size={ctx.placement === 'center' || ctx.size === 'lg' ? 'sm' : 'xs'}><X /></IconButton>
        </DialogClose>
      )}
    </div>
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof D.Title>) {
  const ctx = use(DialogContext);
  const Title = ctx.alertPortal ? AD.Title : D.Title;
  return <Title data-slot="dialog-title" className={cn(dialogTitleVariants({ placement: ctx.placement, frame: ctx.frame, size: ctx.size }), className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof D.Description>) {
  const ctx = use(DialogContext);
  const Description = ctx.alertPortal ? AD.Description : D.Description;
  return <Description data-slot="dialog-description" className={cn(dialogDescriptionVariants({ placement: ctx.placement, frame: ctx.frame }), className)} {...props} />;
}

/** Scrolling body between the header and the footer. */
export function DialogBody({ className, ...props }: ComponentProps<'div'>) {
  const ctx = use(DialogContext);
  return <div data-slot="dialog-body" className={cn(dialogBodyVariants({ placement: ctx.placement, frame: ctx.frame, dividers: ctx.dividers, size: ctx.size }), className)} {...props} />;
}

/** Actions, end-aligned with an 8px gap. A flex-1 empty element keeps one secondary action on the start edge. */
export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  const ctx = use(DialogContext);
  return <div data-slot="dialog-footer" className={cn(dialogFooterVariants({ placement: ctx.placement, frame: ctx.frame, dividers: ctx.dividers, size: ctx.size }), className)} {...props} />;
}
