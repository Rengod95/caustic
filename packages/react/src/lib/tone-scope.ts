import { createContext, useContext } from 'react';
import type { Tone, Variant } from './common-props.ts';

/**
 * The tone a coloured container (Alert) hands to the controls inside it. A Button or IconButton without its own tone
 * takes the container's tone so an action in a danger strip is a danger button, never a grey neutral one.
 * Floating layers (Popover, Menu, Dialog) reset it to null: what opens from the strip is not part of the strip.
 */
export interface ToneScope {
  tone: Tone;
  /** The container's emphasis. On a solid container the controls take the raised neutral button instead. */
  variant: Variant;
}

export const ToneScopeContext = createContext<ToneScope | null>(null);

/** The scope a control sits in, or null outside any coloured container. */
export function useToneScope(): ToneScope | null {
  return useContext(ToneScopeContext);
}

/**
 * Resolves the tone and variant of a control in a scope. An explicit tone wins (the scope only fills a missing one).
 * In a solid container every control is the neutral outline button; otherwise the scope tone with the given variant,
 * or `fallback` when the control has none.
 */
export function scopedTone(scope: ToneScope | null, tone: Tone | undefined, variant: Variant | undefined, fallback: Variant): { tone: Tone | undefined; variant: Variant | undefined } {
  if (scope === null || tone !== undefined) return { tone, variant };
  if (scope.variant === 'solid') return { tone: 'neutral', variant: 'outline' };
  return { tone: scope.tone, variant: variant ?? fallback };
}
