'use client';
import { Children, cloneElement, createContext, isValidElement, useContext, useRef, type ComponentProps, type CSSProperties, type ReactNode } from 'react';
import { useFlip } from '../../hooks/use-flip.ts';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Tone, Radius, Shadow, Size } from '../../lib/common-props.ts';
import { suggestionsVariants, suggestionVariants } from './suggestions.variants.ts';

/** Card look: the common variants plus the own glass (the default). */
export type SuggestionsVariant = 'glass' | 'solid' | 'soft' | 'outline' | 'ghost';

interface Look { tone?: Tone | undefined; variant?: SuggestionsVariant | undefined; radius?: Radius | undefined; shadow?: Shadow | undefined; size?: Size | undefined }
const LookCtx = createContext<Look>({});

export interface SuggestionsProps extends ComponentProps<'div'>, Omit<CommonProps, 'variant'> {
  /** Accessible name of the group. */
  'aria-label'?: string;
  /** Card look: glass (default) or one of the common variants. */
  variant?: SuggestionsVariant;
  /** Suggestion items. */
  children: ReactNode;
}

/** A responsive row of quick prompts under the composer. */
export function Suggestions({ 'aria-label': ariaLabel = 'Suggestions', tone, variant, radius, shadow, size, className, children, ...props }: SuggestionsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // A card that is added or removed slides the cards around it. Each card is identified by its React key.
  useFlip(rootRef, '[data-suggestion-key]', 'suggestionKey');
  // The cards rise in as one group: each gets its position as --cs-stagger-index (an index the consumer set wins).
  const cards = Children.toArray(children).map((child, i) =>
    isValidElement<{ style?: CSSProperties; 'data-suggestion-key'?: string }>(child)
      ? cloneElement(child, { 'data-suggestion-key': child.key ?? undefined, style: { '--cs-stagger-index': i, ...child.props.style } as CSSProperties })
      : child,
  );
  return (
    <LookCtx.Provider value={{ tone, variant, radius, shadow, size }}>
      <div ref={rootRef} data-slot="suggestions" role="group" aria-label={ariaLabel} className={cn(suggestionsVariants(), className)} {...props}>{cards}</div>
    </LookCtx.Provider>
  );
}

export interface SuggestionsItemProps extends Omit<ComponentProps<'button'>, 'children'>, Omit<CommonProps, 'variant'> {
  /** Leading icon. */
  icon?: ReactNode;
  /** Context hint on its own line, cut to one line with an ellipsis. */
  hint?: ReactNode;
  /** Overrides the group look for this card. */
  variant?: SuggestionsVariant;
  /** The action. */
  children: ReactNode;
}

/** One suggestion card: pressing it runs the prompt. */
export function SuggestionsItem({ icon, hint, tone, variant, radius, shadow, size, className, children, ...props }: SuggestionsItemProps) {
  const look = useContext(LookCtx);
  return (
    <button
      type="button" data-slot="suggestions-item"
      className={cn(suggestionVariants({ tone: tone ?? look.tone, variant: variant ?? look.variant, radius: radius ?? look.radius, shadow: shadow ?? look.shadow, size: size ?? look.size }), className)}
      {...props}
    >
      {icon != null && <span data-slot="suggestions-icon" aria-hidden className="-mb-px inline-grid size-icon-md place-items-center text-text-secondary [&_svg]:size-full">{icon}</span>}
      <span data-slot="suggestions-title">{children}</span>
      {hint != null && <span data-slot="suggestions-hint" className="min-w-0 truncate text-hint text-text-tertiary">{hint}</span>}
    </button>
  );
}
