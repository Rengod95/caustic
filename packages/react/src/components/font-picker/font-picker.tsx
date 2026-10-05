'use client';
import * as P from '@radix-ui/react-popover';
import { Check, ChevronDown, Search, TriangleAlert } from 'lucide-react';
import { useId, useRef, type ComponentProps, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Badge } from '../badge/badge.tsx';
import { Input } from '../input/input.tsx';
import {
  fontPickerEmptyVariants, fontPickerListVariants, fontPickerOptionNameVariants, fontPickerOptionVariants, fontPickerSampleVariants, fontPickerTriggerVariants,
  fontPickerVariants,
} from './font-picker.variants.ts';

export interface FontOption {
  family: string;
  /** Shown name when it differs from family. */
  label?: string;
  meta: ReactNode;
  /** font-family used to preview the name (including the fallback for a missing family). */
  cssFamily: string;
  project?: boolean;
  missing?: boolean;
  italic?: boolean;
}

export interface FontPickerProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'children' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  options: FontOption[];
  open?: boolean;
  defaultOpen?: boolean;
  /** Render the list in place, open, in normal flow after the trigger, without portal or positioning. */
  inline?: boolean;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  onSearchChange?: (value: string) => void;
  /** Accessible name of the trigger from the shown name of the current family (undefined when none). */
  triggerLabel: (family: string | undefined) => string;
  /** Sample glyphs shown in the trigger. */
  sampleText: string;
  searchLabel: string;
  searchPlaceholder?: string | undefined;
  /** Accessible name of the listbox. */
  listLabel: string;
  /** aria-label of the floating popover; required when not inline. */
  popupLabel?: string | undefined;
  /** Badge text of a missing family; required when an option is missing. */
  missingLabel?: string | undefined;
  /** Badge text of a project family; required when an option is project. */
  projectLabel?: string | undefined;
  /** Row shown when options is empty. */
  emptyMessage?: ReactNode;
}

const face = (family: string): CSSProperties => ({ ['--face' as string]: family });
const NAV = '[data-slot="font-picker-search"] input, [role="option"]';

/** Chooses a font family while seeing it: every family is previewed in its own face. */
export function FontPicker({
  value, defaultValue, options, open, defaultOpen, inline = false, onValueChange, onOpenChange, onSearchChange, triggerLabel, sampleText, searchLabel, searchPlaceholder, listLabel, popupLabel, missingLabel, projectLabel, emptyMessage, className, onKeyDown, ...props
}: FontPickerProps) {
  const [val, setVal] = useControllableState<string>({ value, defaultValue: defaultValue ?? '', onChange: onValueChange });
  const [isOpen, setOpen] = useControllableState<boolean>({ value: open, defaultValue: defaultOpen ?? false, onChange: onOpenChange });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const current = options.find(o => o.family === val);

  const choose = (family: string) => { setVal(family); setOpen(false); triggerRef.current?.focus(); };
  const listKeys = (e: KeyboardEvent<HTMLElement>) => {
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(NAV));
    const at = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = e.key === 'ArrowDown' ? at + 1 : at - 1;
      items[(next + items.length) % items.length]?.focus();
    }
  };
  const rootKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (inline && isOpen && e.key === 'Escape') { e.preventDefault(); setOpen(false); triggerRef.current?.focus(); }
  };

  const trigger = (
    <button
      ref={triggerRef} type="button" data-slot="font-picker-trigger" role="combobox"
      aria-haspopup="listbox" aria-expanded={isOpen} aria-controls={isOpen ? listId : undefined}
      aria-label={triggerLabel(current ? current.label ?? current.family : undefined)}
      className={fontPickerTriggerVariants()}
      onClick={inline ? () => setOpen(!isOpen) : undefined}
      onKeyDown={e => { if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !isOpen) { e.preventDefault(); setOpen(true); } }}
    >
      <span data-slot="font-picker-sample" aria-hidden data-italic={current?.italic || undefined} className={fontPickerSampleVariants()} style={face(current?.cssFamily ?? '')}>{sampleText}</span>
      <span data-slot="font-picker-name" className="min-w-0 flex-1 truncate text-ui-strong">{current ? current.label ?? current.family : ''}</span>
      <span data-slot="font-picker-chevron" aria-hidden className="inline-flex size-icon-sm shrink-0 text-text-tertiary [&_svg]:size-full [&_svg]:stroke-[1.75]"><ChevronDown /></span>
    </button>
  );

  const body = (
    <>
      <div data-slot="font-picker-search" className="mb-1">
        <Input
          appearance="sunken" aria-label={searchLabel} placeholder={searchPlaceholder} prefix={<Search />}
          onValueChange={onSearchChange}
        />
      </div>
      <div role="listbox" id={listId} aria-label={listLabel} className="grid gap-px">
      {options.length === 0 && emptyMessage != null ? (
        <div role="option" aria-disabled="true" aria-selected="false" data-slot="font-picker-empty" className={fontPickerEmptyVariants()}>{emptyMessage}</div>
      ) : null}
      {options.map(o => {
        const selected = o.family === val;
        return (
          <div
            key={o.family} role="option" tabIndex={-1} aria-selected={selected}
            data-slot="font-picker-option" data-selected={selected ? '' : undefined}
            className={fontPickerOptionVariants()}
            onClick={() => choose(o.family)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(o.family); } }}
            onPointerMove={e => { if (document.activeElement !== e.currentTarget) e.currentTarget.focus({ preventScroll: true }); }}
          >
            <span className="min-w-0">
              <span data-slot="font-picker-option-name" data-italic={o.italic || undefined} className={fontPickerOptionNameVariants()} style={face(o.cssFamily)}>{o.label ?? o.family}</span>
              <span data-slot="font-picker-option-meta" className="block text-ui-xs text-text-tertiary">{o.meta}</span>
            </span>
            {selected ? <span data-slot="font-picker-check" aria-hidden className="inline-flex size-icon-sm text-accent-text [&_svg]:size-full [&_svg]:stroke-[1.75]"><Check /></span> : null}
            {!selected && o.missing ? <Badge data-slot="font-picker-badge" tone="warning" icon={<TriangleAlert />}>{missingLabel}</Badge> : null}
            {!selected && !o.missing && o.project ? <Badge data-slot="font-picker-badge" shape="square">{projectLabel}</Badge> : null}
          </div>
        );
      })}
      </div>
    </>
  );

  if (inline) {
    return (
      <div data-slot="font-picker" data-state={isOpen ? 'open' : 'closed'} className={cn(fontPickerVariants({ inline }), className)} onKeyDown={rootKeys} {...props}>
        {trigger}
        {isOpen ? (
          <div data-slot="font-picker-list" data-state="open" className={fontPickerListVariants()} onKeyDown={listKeys}>
            {body}
          </div>
        ) : null}
      </div>
    );
  }
  return (
    <div data-slot="font-picker" data-state={isOpen ? 'open' : 'closed'} className={cn(fontPickerVariants({ inline }), className)} {...props}>
      <P.Root open={isOpen} onOpenChange={setOpen}>
        <P.Trigger asChild>{trigger}</P.Trigger>
        <P.Portal>
          <P.Content
            data-slot="font-picker-list" aria-label={popupLabel} side="bottom" align="start" sideOffset={6}
            className={fontPickerListVariants()} onKeyDown={listKeys}
          >
            {body}
          </P.Content>
        </P.Portal>
      </P.Root>
    </div>
  );
}
