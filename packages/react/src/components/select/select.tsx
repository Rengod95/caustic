'use client';
import * as RS from '@radix-ui/react-select';
import { Children, createContext, isValidElement, useContext, useId, useRef, useState, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { defined } from '../../lib/defined.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useRovingItems } from '../../hooks/use-roving-items.ts';
import { menuHeadingVariants, menuItemVariants, menuSeparatorVariants, menuSurfaceVariants } from '../menu/menu.variants.ts';
import { PickerTrigger } from '../picker-trigger/picker-trigger.tsx';
import { selectOptionVariants } from './select.variants.ts';

interface SelectContextValue { inline: boolean; value: string; choose: (value: string) => void }
const SelectContext = createContext<SelectContextValue>({ inline: false, value: '', choose: () => {} });
const GroupContext = createContext<string | undefined>(undefined);

export interface SelectOptionProps extends Omit<ComponentProps<'div'>, 'children' | 'onSelect'> {
  value: string;
  /** Marks the option as chosen regardless of the Select value (fixtures use it on the first option). */
  selected?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

export interface SelectProps extends Omit<ComponentProps<'button'>, 'value' | 'defaultValue' | 'onChange' | 'placeholder' | 'name' | 'children'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Shown in the trigger while there is no value (e.g. Select a country). */
  placeholder?: ReactNode;
  disabled?: boolean;
  /** Danger trigger edge. */
  invalid?: boolean;
  /** Form field name for the hidden native select. */
  name?: string;
  /** Render the listbox in place, directly after the trigger, without portal or positioning. */
  inline?: boolean;
  /** SelectOption prop used by fixtures; ignored on Select itself. */
  selected?: boolean;
  /** Class names for the listbox surface (props and className otherwise go to the trigger). */
  listboxClassName?: string;
  children?: ReactNode;
}

const OPTIONS = '[role="option"]:not([aria-disabled="true"])';

/** Text of the option whose value is `value`, found in the static children tree (inline mode only). */
function labelOf(children: ReactNode, value: string): ReactNode {
  let found: ReactNode = null;
  const walk = (nodes: ReactNode) => Children.forEach(nodes, node => {
    if (found != null || !isValidElement(node)) return;
    const el = node as ReactElement<{ value?: string; children?: ReactNode }>;
    if (typeof el.props.value === 'string' && el.props.value === value) found = el.props.children;
    else walk(el.props.children);
  });
  walk(children);
  return found;
}

/** Chooses one value from a short list. The listbox is the Menu surface with role="option" items. */
export function Select({ value, defaultValue, onValueChange, open, defaultOpen, onOpenChange, placeholder, disabled, invalid, name, inline = false, selected: _selected, listboxClassName, className, children, ...props }: SelectProps) {
  const [val, setVal] = useControllableState<string>({ value, defaultValue: defaultValue ?? '', onChange: onValueChange });
  const [isOpen, setOpen] = useControllableState<boolean>({ value: open, defaultValue: defaultOpen ?? false, onChange: onOpenChange });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const onKeyDown = useRovingItems({ selector: OPTIONS, onEscape: () => { setOpen(false); triggerRef.current?.focus(); }, onTab: () => setOpen(false) });

  if (!inline) {
    return (
      <SelectContext.Provider value={{ inline: false, value: val, choose: () => {} }}>
        <RS.Root {...defined({ value, defaultValue, onValueChange, open, defaultOpen, onOpenChange, disabled, name })}>
          <RS.Trigger asChild>
            <PickerTrigger
              data-slot="select-trigger" indicator="select" invalid={invalid} disabled={disabled}
              className={cn('[&[data-placeholder]_[data-slot=picker-trigger-value]]:text-text-placeholder', className)}
              {...props}
            >
              <RS.Value placeholder={placeholder} />
            </PickerTrigger>
          </RS.Trigger>
          <RS.Portal>
            <RS.Content data-slot="select" position="popper" sideOffset={6} className={cn(menuSurfaceVariants(), 'z-60 min-w-[var(--radix-select-trigger-width)] max-h-(--radix-select-content-available-height) overflow-y-auto', listboxClassName)}>
              <RS.Viewport>{children}</RS.Viewport>
            </RS.Content>
          </RS.Portal>
        </RS.Root>
      </SelectContext.Provider>
    );
  }

  const label = val ? labelOf(children, val) : null;
  const choose = (next: string) => { setVal(next); setOpen(false); triggerRef.current?.focus(); };
  return (
    <SelectContext.Provider value={{ inline: true, value: val, choose }}>
      <PickerTrigger
        ref={triggerRef} data-slot="select-trigger" role="combobox" indicator="select" open={isOpen} invalid={invalid} disabled={disabled}
        aria-haspopup="listbox" aria-controls={isOpen ? listId : undefined} placeholder={placeholder}
        onClick={() => setOpen(!isOpen)}
        className={className}
        {...props}
      >
        {label}
      </PickerTrigger>
      {isOpen && (
        <div
          id={listId} role="listbox" tabIndex={-1} data-slot="select" data-state="open" data-inline=""
          aria-label={typeof props['aria-label'] === 'string' ? props['aria-label'] : undefined}
          className={cn(menuSurfaceVariants(), listboxClassName)}
          onKeyDown={onKeyDown}
        >
          {children}
        </div>
      )}
    </SelectContext.Provider>
  );
}

/** One choice (menu item anatomy, role option). */
export function SelectOption({ value, selected, disabled = false, className, children, onFocus, onBlur, onPointerMove, onClick, onKeyDown, ...props }: SelectOptionProps) {
  const ctx = useContext(SelectContext);
  const [highlighted, setHighlighted] = useState(false);
  const chosen = selected ?? (ctx.value !== '' && ctx.value === value);
  const classes = cn(selectOptionVariants(), menuItemVariants(), className);
  if (!ctx.inline) {
    return (
      <RS.Item data-slot="select-option" value={value} disabled={disabled} onClick={onClick} onKeyDown={onKeyDown} onFocus={onFocus} onBlur={onBlur} onPointerMove={onPointerMove} data-selected={chosen ? '' : undefined} className={cn(classes, 'group')} {...props}>
        <RS.ItemText>{children}</RS.ItemText>
      </RS.Item>
    );
  }
  const choose = () => { if (!disabled) ctx.choose(value); };
  return (
    <div
      role="option" tabIndex={-1} aria-selected={chosen} aria-disabled={disabled || undefined}
      data-slot="select-option" data-selected={chosen ? '' : undefined} data-disabled={disabled ? '' : undefined}
      data-highlighted={highlighted ? '' : undefined}
      className={cn(classes, 'group')}
      onFocus={e => { setHighlighted(true); onFocus?.(e); }}
      onBlur={e => { setHighlighted(false); onBlur?.(e); }}
      onPointerMove={e => { if (!disabled && document.activeElement !== e.currentTarget) e.currentTarget.focus(); onPointerMove?.(e); }}
      onClick={e => { onClick?.(e); if (!e.defaultPrevented) choose(); }}
      onKeyDown={e => { onKeyDown?.(e); if (!e.defaultPrevented && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); choose(); } }}
      {...props}
    >
      <span className="min-w-0 truncate">{children}</span>
    </div>
  );
}

export function SelectGroup({ children, ...props }: ComponentProps<'div'>) {
  const id = useId();
  const ctx = useContext(SelectContext);
  return (
    <GroupContext.Provider value={id}>
      {ctx.inline
        ? <div role="group" aria-labelledby={id} data-slot="select-group" {...props}>{children}</div>
        : <RS.Group data-slot="select-group" aria-labelledby={id} {...props}>{children}</RS.Group>}
    </GroupContext.Provider>
  );
}

export function SelectHeading({ className, id, ...props }: ComponentProps<'div'>) {
  const group = useContext(GroupContext);
  return <div data-slot="select-heading" id={id ?? group} className={cn(menuHeadingVariants(), className)} {...props} />;
}

export function SelectSeparator({ className, ...props }: ComponentProps<'div'>) {
  return <div aria-hidden="true" data-slot="select-separator" className={cn(menuSeparatorVariants(), className)} {...props} />;
}
