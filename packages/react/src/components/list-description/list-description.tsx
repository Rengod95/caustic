'use client';
import { Copy } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import {
  listDescriptionAction, listDescriptionRow, listDescriptionTerm, listDescriptionValue, listDescriptionValueText, listDescriptionVariants,
} from './list-description.variants.ts';

export interface ListDescriptionRowProps extends Omit<ComponentProps<'div'>, 'children' | 'onCopy'> {
  /** The label. */
  term: ReactNode;
  /** The value content. */
  children: ReactNode;
  /** Set the value in the mono voice (ids, hashes, paths). */
  mono?: boolean;
  /** Text to copy; adds the action column with a copy IconButton xs (aria-label "Copy <term>"). */
  copyValue?: string;
  /** The copy button was activated; the argument is copyValue. The value is also written to the clipboard when available. */
  onCopy?: (value: string) => void;
}

export interface ListDescriptionProps extends ComponentProps<'dl'> {
  /** Accessible name of the list when it needs one. */
  'aria-label'?: string;
}

/**
 * Label and value pairs on the grouped surface. Compose with ListDescriptionRow.
 */
export function ListDescription({ className, children, ...props }: ListDescriptionProps) {
  return (
    <dl data-slot="list-description" className={cn(listDescriptionVariants(), className)} {...props}>
      {children}
    </dl>
  );
}

/** One term/value group; the third column holds the copy button when copyValue is set. */
export function ListDescriptionRow({ term, mono = false, copyValue, onCopy, className, children, ...props }: ListDescriptionRowProps) {
  const copy = () => {
    if (copyValue == null) return;
    onCopy?.(copyValue);
    try { void globalThis.navigator?.clipboard?.writeText(copyValue)?.catch(() => {}); } catch { /* clipboard unavailable */ }
  };
  return (
    <div data-slot="list-description-row" className={cn(listDescriptionRow(), className)} {...props}>
      <dt data-slot="list-description-term" className={listDescriptionTerm()}>{term}</dt>
      <dd data-slot="list-description-value" data-mono={mono || undefined} className={listDescriptionValue({ mono })}>
        <span className={listDescriptionValueText()}>{children}</span>
        {copyValue != null && (
          <div data-slot="list-description-action" role="none" className={listDescriptionAction()}>
            <IconButton size="xs" label={typeof term === 'string' ? `Copy ${term}` : 'Copy'} onClick={copy}><Copy /></IconButton>
          </div>
        )}
      </dd>
    </div>
  );
}
