'use client';
import { useId, useState, type ComponentProps, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';
import { InspectorSelect } from '../components/inspector-select/inspector-select.tsx';

export interface InspectorChoiceProps<T extends string> {
  /** Accessible name of the listbox and the prefix of the trigger name. */
  label: string;
  options: readonly (readonly [T, string])[];
  value: T;
  onValueChange: (value: T) => void;
  leading?: ReactNode;
  disabled?: boolean;
  /** Extra props for the InspectorSelect trigger (for example a data-slot). */
  selectProps?: Omit<ComponentProps<typeof InspectorSelect>, 'open' | 'onClick' | 'children' | 'leading' | 'disabled'>;
}

/** An InspectorSelect that opens a small in-place listbox of choices. */
export function InspectorChoice<T extends string>({ label, options, value, onValueChange, leading, disabled = false, selectProps }: InspectorChoiceProps<T>) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const text = options.find(([v]) => v === value)?.[1] ?? '';
  const blur = (e: FocusEvent<HTMLDivElement>) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); };
  const key = (e: KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Escape') setOpen(false); };
  return (
    <div className="relative" onBlur={blur} onKeyDown={key}>
      <InspectorSelect aria-label={`${label}, ${text}`} aria-controls={open ? listId : undefined} {...selectProps} leading={leading} open={open} disabled={disabled} onClick={() => setOpen(o => !o)}>
        {text}
      </InspectorSelect>
      {open && (
        <div id={listId} role="listbox" aria-label={label} className="absolute inset-x-0 top-full z-10 mt-1 grid gap-px rounded-lg bg-surface-base p-1 text-ui-sm text-text-primary shadow-2">
          {options.map(([v, name]) => (
            <button
              key={v}
              type="button"
              role="option"
              aria-selected={v === value}
              className="flex h-control-sm cursor-pointer items-center rounded-md bg-transparent px-2 text-left outline-none hover:bg-fill-pressed focus-visible:shadow-focus aria-selected:bg-accent-soft aria-selected:text-accent-text"
              onClick={() => { onValueChange(v); setOpen(false); }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
