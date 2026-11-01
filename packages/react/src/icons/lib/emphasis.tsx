'use client';
import { createContext, useContext, type ReactNode } from 'react';
import type { IconEmphasis } from './types.ts';

const EmphasisContext = createContext<IconEmphasis | undefined>(undefined);

export interface IconEmphasisProviderProps {
  /** Emphasis for every icon inside that does not set its own. undefined passes the outer value through. */
  value: IconEmphasis | undefined;
  children?: ReactNode;
}

/** Sets the emphasis of the icons inside, so a container (a pressed toolbar item, the current nav row) can fill its glyph. */
export function IconEmphasisProvider({ value, children }: IconEmphasisProviderProps) {
  const outer = useContext(EmphasisContext);
  return <EmphasisContext.Provider value={value ?? outer}>{children}</EmphasisContext.Provider>;
}

/** The emphasis an icon draws with: its own prop, else the nearest provider, else 'default'. */
export function useIconEmphasis(own: IconEmphasis | undefined): IconEmphasis {
  const ctx = useContext(EmphasisContext);
  return own ?? ctx ?? 'default';
}
