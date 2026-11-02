'use client';
import { useEffect, type ComponentProps, type ReactNode } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { cn } from '../../lib/cn.ts';
import { Combobox, type ComboboxGroupData } from '../combobox/combobox.tsx';
import { Dialog, DialogTitle } from '../dialog/dialog.tsx';
import { Kbd } from '../kbd/kbd.tsx';

/** One command. shortcut is shown as a Kbd at the end of the row; it does not bind the key. */
export interface CommandPaletteItem {
  value: string;
  label: string;
  /** One-line summary after the label; searched with the label. */
  description?: ReactNode;
  /** A 16px icon before the label. */
  icon?: ReactNode;
  /** The chord to display, e.g. "⌘⇧N". */
  shortcut?: string;
  disabled?: boolean;
}

/** A heading with its commands. */
export interface CommandPaletteGroup { label: ReactNode; items: CommandPaletteItem[] }

export interface CommandPaletteProps extends Omit<ComponentProps<'div'>, 'children' | 'onSelect' | 'title'> {
  /** Commands under headings. */
  groups: CommandPaletteGroup[];
  /** Accessible name of the dialog, the search field and the list. Supplied by the app so it can be translated. */
  label: string;
  /** Global key chord that toggles the palette, e.g. "mod+k" (mod = Command on Mac, Control elsewhere). Unset binds nothing. */
  shortcut?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Called with the value of the chosen command; the palette then closes. */
  onSelect?: (value: string) => void;
  /** Hint in the empty search field. */
  placeholder?: string;
  /** Shown when nothing matches. */
  emptyMessage?: ReactNode;
  /** Polite announcement of the result count. */
  resultsLabel?: (count: number) => string;
  /** Element that opens the palette (rendered with asChild). */
  trigger?: ReactNode;
  /** Render in place, open, without portal and overlay (docs, previews). */
  inline?: boolean;
}

/** True when the key event is the chord, e.g. "mod+shift+k". */
export function matchesShortcut(e: Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey'>, chord: string) {
  const parts = chord.toLowerCase().split('+').map(p => p.trim());
  const key = parts[parts.length - 1];
  const mods = parts.slice(0, -1);
  return e.key.toLowerCase() === key
    && (e.metaKey || e.ctrlKey) === mods.includes('mod')
    && e.shiftKey === mods.includes('shift')
    && e.altKey === mods.includes('alt');
}

/** A command palette: a Dialog holding an inline Combobox. A global chord opens it; Enter runs the highlighted command. */
export function CommandPalette({
  groups, label, shortcut, open, defaultOpen, onOpenChange, onSelect, placeholder, emptyMessage, resultsLabel, trigger, inline = false, className, ...props
}: CommandPaletteProps) {
  const [isOpen, setOpen] = useControllableState<boolean>({ value: open, defaultValue: defaultOpen ?? inline, onChange: onOpenChange });

  useEffect(() => {
    if (shortcut === undefined) return;
    const onKey = (e: KeyboardEvent) => {
      if (!matchesShortcut(e, shortcut)) return;
      e.preventDefault();
      setOpen(!isOpen);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shortcut, isOpen, setOpen]);

  const comboGroups: ComboboxGroupData[] = groups.map(g => ({
    label: g.label,
    options: g.items.map(i => ({
      value: i.value, label: i.label, ...(i.description != null ? { description: i.description } : {}),
      ...(i.icon != null ? { leading: i.icon } : {}),
      ...(i.shortcut !== undefined ? { meta: <Kbd size="xs">{i.shortcut}</Kbd> } : {}),
      ...(i.disabled ? { disabled: true } : {}),
    })),
  }));

  return (
    <Dialog
      data-slot="command-palette" open={isOpen} onOpenChange={setOpen} inline={inline} trigger={trigger} size="md"
      className={cn('z-(--cs-z-palette)', className)} {...props}
    >
      <DialogTitle data-slot="command-palette-title" className="sr-only">{label}</DialogTitle>
      <Combobox
        mode="inline" inline open aria-label={label} placeholder={placeholder} groups={comboGroups} value="" emptyMessage={emptyMessage}
        resultsLabel={resultsLabel} data-slot="command-palette-search"
        onValueChange={v => { onSelect?.(v); setOpen(false); }} onOpenChange={() => {}}
      />
    </Dialog>
  );
}
