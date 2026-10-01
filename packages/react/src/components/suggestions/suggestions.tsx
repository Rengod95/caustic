'use client';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { suggestionsVariants, suggestionVariants } from './suggestions.variants.ts';

export interface SuggestionsProps extends ComponentProps<'div'> {
  /** Accessible name of the group. */
  'aria-label'?: string;
  /** Suggestion items. */
  children: ReactNode;
}

/** A responsive row of quick prompts under the composer. */
export function Suggestions({ 'aria-label': ariaLabel = 'Suggestions', className, ...props }: SuggestionsProps) {
  return <div data-slot="suggestions" role="group" aria-label={ariaLabel} className={cn(suggestionsVariants(), className)} {...props} />;
}

export interface SuggestionsItemProps extends Omit<ComponentProps<'button'>, 'children'> {
  /** Leading icon. */
  icon?: ReactNode;
  /** Context hint on its own line. */
  hint?: ReactNode;
  /** The action. */
  children: ReactNode;
}

/** One suggestion card: pressing it runs the prompt. */
export function SuggestionsItem({ icon, hint, className, children, ...props }: SuggestionsItemProps) {
  return (
    <button type="button" data-slot="suggestions-item" className={cn(suggestionVariants(), className)} {...props}>
      {icon != null && <span data-slot="suggestions-icon" aria-hidden className="-mb-px inline-grid size-icon-md place-items-center text-accent-text [&_svg]:size-full">{icon}</span>}
      <span data-slot="suggestions-title">{children}</span>
      {hint != null && <span data-slot="suggestions-hint" className="text-hint text-text-tertiary">{hint}</span>}
    </button>
  );
}
