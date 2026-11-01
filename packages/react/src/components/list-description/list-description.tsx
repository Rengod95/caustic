'use client';
import { Copy } from '../../icons/index.ts';
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Size } from '../../lib/common-props.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import {
  listDescriptionAction, listDescriptionFrameVariants, listDescriptionRow, listDescriptionTerm, listDescriptionValue, listDescriptionValueText, listDescriptionVariants,
} from './list-description.variants.ts';

/** The list size, read by its rows. */
const SizeContext = createContext<Size | undefined>(undefined);

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

export interface ListDescriptionProps extends ComponentProps<'dl'>, CommonProps {
  /** Accessible name of the list when it needs one. */
  'aria-label'?: string;
}

/**
 * Label and value pairs on the grouped surface. Compose with ListDescriptionRow.
 */
export function ListDescription({ tone, variant, radius, shadow, size, className, children, ...props }: ListDescriptionProps) {
  return (
    <SizeContext.Provider value={size}>
      <dl data-slot="list-description" className={cn(listDescriptionVariants({ tone, variant }), listDescriptionFrameVariants({ radius, shadow }), className)} {...props}>
        {children}
      </dl>
    </SizeContext.Provider>
  );
}

/** One term/value group; the third column holds the copy button when copyValue is set. */
export function ListDescriptionRow({ term, mono = false, copyValue, onCopy, className, children, ...props }: ListDescriptionRowProps) {
  const size = useContext(SizeContext);
  const copy = () => {
    if (copyValue == null) return;
    onCopy?.(copyValue);
    try { void globalThis.navigator?.clipboard?.writeText(copyValue)?.catch(() => {}); } catch { /* clipboard unavailable */ }
  };
  return (
    <div data-slot="list-description-row" className={cn(listDescriptionRow({ size }), className)} {...props}>
      <dt data-slot="list-description-term" className={listDescriptionTerm()}>{term}</dt>
      <dd data-slot="list-description-value" data-mono={mono || undefined} className={listDescriptionValue({ mono })}>
        <span data-slot="list-description-value-text" className={listDescriptionValueText()}>{children}</span>
        {copyValue != null && (
          <div data-slot="list-description-action" role="none" className={listDescriptionAction()}>
            <IconButton size="xs" label={typeof term === 'string' ? `Copy ${term}` : 'Copy'} onClick={copy}><Copy /></IconButton>
          </div>
        )}
      </dd>
    </div>
  );
}
