'use client';
import { useRef, useState, type ClipboardEvent, type ComponentProps, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFlip } from '../../hooks/use-flip.ts';
import { usePresence } from '../../hooks/use-presence.ts';
import { Chip } from '../chip/chip.tsx';
import { useFieldContext } from '../field/field-context.ts';
import { tagInputVariants } from './tag-input.variants.ts';

export interface TagInputProps extends Omit<ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange' | 'size' | 'type'>, CommonProps {
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

// A stable key per tag: the tag and its occurrence among equal tags (JSON, so it is also a clean data attribute). Removing one
// tag then leaves the other chips mounted, so an entering tag's animation is not replayed on them.
const keyOf = (list: string[], i: number) => JSON.stringify([list[i], list.slice(0, i).filter(t => t === list[i]).length]);

/** Enters a list of short strings as removable tags (Chips). */
export function TagInput({ value, defaultValue, delimiters = DEFAULT_DELIMITERS, allowDuplicates = false, invalid, disabled, tone, variant, radius, shadow, size, id, onValueChange, onKeyDown, className, containerClassName, ...props }: TagInputProps) {
  const field = useFieldContext();
  const control = useRef<HTMLInputElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [tags, setTags] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange: onValueChange });
  const [draft, setDraft] = useState('');
  const [note, setNote] = useState('');
  // Tags there at the first paint do not rise (a list that loads with tags stays still); a tag added later does.
  const [mounted] = useState(() => new Set(tags.map((_, i) => keyOf(tags, i))));
  // A removed tag stays drawn, leaving, until its exit has played; the tags after it then slide over the gap (useFlip).
  const { entries, exited } = usePresence(tags.map((tag, i) => ({ key: keyOf(tags, i), tag, index: i })), t => t.key);
  useFlip(root, ':scope > [data-flip-id]', 'flipId');
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
      ref={root}
      data-slot="tag-input"
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
      data-size={size ?? 'md'}
      className={cn(tagInputVariants({ tone, variant, size, radius, shadow }), containerClassName)}
      onMouseDown={e => { if (e.target !== control.current && !(e.target as HTMLElement).closest('button')) { e.preventDefault(); control.current?.focus(); } }}
    >
      {/* Tags take radius sm, one step under the token chip, so they sit concentric in the radius xl field (P5). */}
      {entries.map(({ key, item, present }) => (
        <Chip
          key={key} data-flip-id={key} data-state={present ? undefined : 'closed'} shape="rounded" appearance="surface"
          className={cn('rounded-sm', present ? (!mounted.has(key) && 'animate-rise') : 'pointer-events-none animate-exit')}
          inert={!present || isDisabled || undefined} aria-hidden={!present || undefined}
          onAnimationEnd={e => { if (e.target === e.currentTarget) exited(key); }}
          onRemove={() => { remove(item.index); control.current?.focus(); }}
        >
          {item.tag}
        </Chip>
      ))}
      <input
        ref={control}
        data-slot="tag-input-control"
        data-flip-id="control"
        id={id ?? field?.id}
        aria-invalid={isInvalid || undefined}
        aria-describedby={field?.describedBy}
        aria-required={field?.required || undefined}
        disabled={isDisabled}
        value={draft}
        className={cn('h-chip-h min-w-tag-input-min flex-1 border-0 bg-transparent px-1 text-text-primary outline-none placeholder:text-text-placeholder disabled:text-disabled-text disabled:placeholder:text-disabled-text', className)}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={keyDown}
        onPaste={paste}
        {...props}
      />
      <span aria-live="polite" className="sr-only">{note}</span>
    </div>
  );
}
