'use client';
import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { inspectorPanelVariants, inspectorSectionHeaderVariants, inspectorSectionVariants } from './inspector-panel.variants.ts';

const TitleId = createContext<string | undefined>(undefined);

export interface InspectorPanelProps extends ComponentProps<'div'> {
  children: ReactNode;
}

/** Opaque frame of an inspector: a stack of InspectorSections. */
export function InspectorPanel({ className, children, ...props }: InspectorPanelProps) {
  return (
    <div data-slot="inspector-panel" role="region" className={cn(inspectorPanelVariants(), className)} {...props}>
      {children}
    </div>
  );
}

export interface InspectorSectionProps extends ComponentProps<'section'> {
  children?: ReactNode;
}

/** A padded block of controls with a hairline under it (none on the last section). */
export function InspectorSection({ className, children, ...props }: InspectorSectionProps) {
  const titleId = useId();
  return (
    <TitleId.Provider value={titleId}>
      <section data-slot="inspector-panel-section" aria-labelledby={titleId} className={cn(inspectorSectionVariants(), className)} {...props}>
        {children}
      </section>
    </TitleId.Provider>
  );
}

export interface InspectorSectionHeaderProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Section name. */
  title: ReactNode;
  /** Trailing xs IconButtons or an AlignBar. */
  actions?: ReactNode;
}

/** Title left, actions right. */
export function InspectorSectionHeader({ title, actions, className, ...props }: InspectorSectionHeaderProps) {
  const titleId = useContext(TitleId);
  return (
    <div data-slot="inspector-panel-header" className={cn(inspectorSectionHeaderVariants(), className)} {...props}>
      <span data-slot="inspector-panel-title" id={titleId} className="text-hint font-semibold text-text-secondary">{title}</span>
      {actions != null && <span data-slot="inspector-panel-actions" className="flex items-center gap-0.5">{actions}</span>}
    </div>
  );
}
