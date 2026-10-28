'use client';
import * as DM from '@radix-ui/react-dropdown-menu';
import { createContext, useCallback, useContext, useId, useState, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Size, Tone } from '../../lib/common-props.ts';
import { defined } from '../../lib/defined.ts';
import { useRovingItems } from '../../hooks/use-roving-items.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { menuEndVariants, menuHeadingVariants, menuIconVariants, menuItemVariants, menuSeparatorVariants, menuSurfaceVariants } from './menu.variants.ts';

interface MenuContextValue { inline: boolean; close: () => void; size: Size }
const MenuContext = createContext<MenuContextValue>({ inline: false, close: () => {}, size: 'md' });
const GroupContext = createContext<string | undefined>(undefined);

export interface MenuItemProps extends Omit<ComponentProps<'button'>, 'onSelect' | 'color'> {
  /** Marks the chosen item (neutral-selected fill + selection edge; the check goes in the icon slot); sets aria-checked on radio / checkbox roles. */
  selected?: boolean;
  /** Colour family of the label and icon; danger = destructive item. 'default' is the deprecated alias of neutral. */
  tone?: Tone | 'default';
  /** Not activatable; label, icon and end take the disabled-text colour and the tone drops. */
  disabled?: boolean;
  /** Leading icon or swatch. */
  icon?: ReactNode;
  /** Trailing meta text or Kbd chord. */
  end?: ReactNode;
  /** Activated by pointer, Enter or Space. Call preventDefault() to keep the menu open. */
  onSelect?: (event: Event) => void;
}

export interface MenuProps extends Omit<ComponentProps<'div'>, 'onSelect' | 'dir'>, CommonProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the menu (rendered with asChild). A field-looking trigger is a PickerTrigger. */
  trigger?: ReactNode;
  side?: 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  /** Render the surface in place, open, without portal, positioning or outside-press dismissal. */
  inline?: boolean;
}

const ITEMS = '[role^="menuitem"]:not([aria-disabled="true"])';

/** Thick-glass menu. tone, variant, radius and shadow style the surface; size sets the item height of every MenuItem. */
export function Menu({ open, defaultOpen, onOpenChange, trigger, side = 'bottom', align = 'start', inline = false, tone, variant, radius, shadow, size = 'md', className, children, ...props }: MenuProps) {
  const [isOpen, setOpen] = useControllableState<boolean>({ value: inline ? open : undefined, defaultValue: defaultOpen ?? true, onChange: onOpenChange });
  const close = useCallback(() => setOpen(false), [setOpen]);
  const onKeyDown = useRovingItems({ selector: ITEMS, onEscape: close, onTab: close, onKeyDown: props.onKeyDown });
  // A ghost menu sits flat: unless a shadow is given, the elevation drops with the variant.
  const surface = menuSurfaceVariants({ tone, variant, radius, shadow: shadow ?? (variant === 'ghost' ? 'none' : undefined) });

  if (!inline) {
    return (
      <MenuContext.Provider value={{ inline: false, close: () => {}, size }}>
        <DM.Root {...defined({ open, defaultOpen, onOpenChange })}>
          {trigger != null && <DM.Trigger asChild>{trigger}</DM.Trigger>}
          <DM.Portal>
            <DM.Content data-slot="menu" side={side} align={align} sideOffset={6} className={cn(surface, 'z-60', className)} {...props}>{children}</DM.Content>
          </DM.Portal>
        </DM.Root>
      </MenuContext.Provider>
    );
  }

  if (!isOpen) return null;
  return (
    <MenuContext.Provider value={{ inline: true, close, size }}>
      <div
        role="menu" aria-orientation="vertical" tabIndex={-1} data-slot="menu" data-state="open" data-inline=""
        className={cn(surface, className)}
        {...props}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    </MenuContext.Provider>
  );
}

/** One action or choice. Compose inside Menu. */
export function MenuItem({ selected = false, tone: toneProp = 'neutral', disabled = false, icon, end, onSelect, onClick, role = 'menuitem', className, children, ...props }: MenuItemProps) {
  const ctx = useContext(MenuContext);
  const tone = toneProp === 'default' ? 'neutral' : toneProp;
  const [highlighted, setHighlighted] = useState(false);
  const checkable = role === 'menuitemradio' || role === 'menuitemcheckbox';
  const shared = {
    'data-tone': tone,
    'data-selected': selected ? '' : undefined,
    'aria-checked': checkable ? selected : undefined,
    className: cn('group', menuItemVariants({ tone, size: ctx.size }), className),
  };
  const body = (
    <>
      {icon != null && <span data-slot="menu-icon" aria-hidden="true" className={menuIconVariants({ tone })}>{icon}</span>}
      <span data-slot="menu-label" className="min-w-0 truncate">{children}</span>
      {end != null && <span data-slot="menu-end" className={menuEndVariants()}>{end}</span>}
    </>
  );

  if (!ctx.inline) {
    return (
      <DM.Item asChild {...defined({ disabled, onSelect })}>
        <button type="button" role={role} data-slot="menu-item" onClick={onClick} {...shared} {...props}>{body}</button>
      </DM.Item>
    );
  }
  return (
    <button
      type="button" role={role} data-slot="menu-item" tabIndex={-1} aria-disabled={disabled || undefined}
      data-disabled={disabled ? '' : undefined}
      data-highlighted={highlighted ? '' : undefined}
      onFocus={e => { setHighlighted(true); props.onFocus?.(e); }}
      onBlur={e => { setHighlighted(false); props.onBlur?.(e); }}
      onPointerMove={e => { if (!disabled && document.activeElement !== e.currentTarget) e.currentTarget.focus(); props.onPointerMove?.(e); }}
      onClick={e => {
        onClick?.(e);
        if (disabled || e.defaultPrevented) return;
        const ev = e.nativeEvent;
        onSelect?.(ev);
        if (!ev.defaultPrevented) ctx.close();
      }}
      {...shared}
      {...props}
    >
      {body}
    </button>
  );
}

/** Group heading label (non-interactive). Use inside MenuGroup so the group is labelled by it. */
export function MenuHeading({ className, id, ...props }: ComponentProps<'div'>) {
  const group = useContext(GroupContext);
  return <div data-slot="menu-heading" id={id ?? group} className={cn(menuHeadingVariants({ caps: true }), className)} {...props} />;
}

export function MenuGroup({ children, ...props }: ComponentProps<'div'>) {
  const id = useId();
  return <GroupContext.Provider value={id}><div role="group" aria-labelledby={id} {...props}>{children}</div></GroupContext.Provider>;
}

export function MenuSeparator({ className, ...props }: ComponentProps<'div'>) {
  return <div role="separator" aria-orientation="horizontal" data-slot="menu-separator" className={cn(menuSeparatorVariants(), className)} {...props} />;
}
