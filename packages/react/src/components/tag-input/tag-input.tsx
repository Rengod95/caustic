'use client';
import { useRef, useState, type ClipboardEvent, type ComponentProps, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Chip } from '../chip/chip.tsx';
import { useFieldContext } from '../field/field-context.ts';

export interface TagInputProps extends Omit<ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange' | 'size' | 'type'> {
  /** Controlled tags. */
  value?: string[];
  /** Uncontrolled initial tags. */
  defaultValue?: string[];
  /** Keys that commit the typed text as a tag: one key or a list. */
  delimiters?: Delimiter | readonly Delimiter[];
  /** When false, adding an existing tag is ignored. */
  allowDuplicates?: boolean;
  invalid?: boolean;
  /** Called with the whole list when a tag is added or removed. */
  onValueChange?: (value: string[]) => void;
  /** Class names for the outer container. */
  containerClassName?: string;
}

type Delimiter = 'Enter' | ',';
const DEFAULT_DELIMITERS: readonly Delimiter[] = ['Enter', ','];

/** Enters a list of short strings as removable tags (Chips). */
export function TagInput({ value, defaultValue, delimiters = DEFAULT_DELIMITERS, allowDuplicates = false, invalid, disabled, id, onValueChange, onKeyDown, className, containerClassName, ...props }: TagInputProps) {
  const field = useFieldContext();
  const control = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange: onValueChange });
  const [draft, setDraft] = useState('');
  const [note, setNote] = useState('');
  const keys: readonly string[] = typeof delimiters === 'string' ? [delimiters] : delimiters;
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isDisabled = disabled ?? field?.disabled ?? false;

  const add = (items: string[]) => {
    const next = [...tags]; const added: string[] = [];
    for (const raw of items) {
      const tag = raw.trim();
      if (!tag || (!allowDuplicates && next.includes(tag))) continue;
      next.push(tag); added.push(tag);
    }
    if (added.length) { setTags(next); setNote(`${added.join(', ')} added`); }
  };
  const remove = (index: number) => { setNote(`${tags[index]} removed`); setTags(tags.filter((_, i) => i !== index)); };
  const keyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (keys.includes(e.key) && !e.nativeEvent.isComposing) {
      if (e.key === ',' || draft.trim()) e.preventDefault();
      add([draft]); setDraft('');
    } else if (e.key === 'Backspace' && draft === '' && tags.length) { e.preventDefault(); remove(tags.length - 1); }
  };
  const paste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (!/[,\n]/.test(text)) return;
    e.preventDefault();
    add(text.split(/[,\n]/));
  };
  return (
    <div
      data-slot="tag-input"
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
      className={cn(
        'frost flex min-h-field-md min-w-0 cursor-text flex-wrap items-center gap-1.5 rounded-xl bg-surface-translucent px-2 py-1.5 text-ui transition-[box-shadow] duration-120 ease-out',
        'shadow-[inset_0_0_0_1px_var(--cs-color-border-default),var(--cs-elevation-1)]',
        'focus-within:shadow-[var(--cs-focus-field),var(--cs-elevation-1)]',
        'data-[invalid]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-solid)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-solid)]',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-42',
        containerClassName,
      )}
      onMouseDown={e => { if (e.target !== control.current && !(e.target as HTMLElement).closest('button')) { e.preventDefault(); control.current?.focus(); } }}
    >
      {tags.map((tag, i) => (
        <Chip key={`${tag}-${i}`} shape="rounded" appearance="surface" className="rounded-sm" inert={isDisabled || undefined} onRemove={() => { remove(i); control.current?.focus(); }}>{tag}</Chip>
      ))}
      <input
        ref={control}
        data-slot="tag-input-control"
        id={id ?? field?.id}
        aria-invalid={isInvalid || undefined}
        aria-describedby={field?.describedBy}
        aria-required={field?.required || undefined}
        disabled={isDisabled}
        value={draft}
        className={cn('h-chip-h min-w-tag-input-min flex-1 border-0 bg-transparent px-1 text-text-primary outline-none placeholder:text-text-placeholder', className)}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={keyDown}
        onPaste={paste}
        {...props}
      />
      <span aria-live="polite" className="sr-only">{note}</span>
    </div>
  );
}
