'use client';
import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Radius, Size, Tone } from '../../lib/common-props.ts';
import {
  inspectorPanelFrameVariants, inspectorPanelVariants, inspectorSectionActionsVariants, inspectorSectionHeaderToneVariants, inspectorSectionHeaderVariants, inspectorSectionTitleVariants,
  inspectorSectionVariants,
} from './inspector-panel.variants.ts';

const TitleId = createContext<string | undefined>(undefined);
/** The panel's tone and size, read by its sections and headers. */
const PanelContext = createContext<{ tone: Tone | undefined; size: Size | undefined }>({ tone: undefined, size: undefined });

export interface InspectorPanelProps extends ComponentProps<'div'>, Omit<CommonProps, 'radius'> {
  /** Corner radius (radius token); "panel" (the default) is the studio panel radius. */
  radius?: Radius | 'panel';
  children: ReactNode;
}

/** Opaque frame of an inspector: a stack of InspectorSections. A landmark region once it is named (aria-label or aria-labelledby). */
export function InspectorPanel({ tone, variant, radius, shadow, size, className, children, ...props }: InspectorPanelProps) {
  const named = props['aria-label'] != null || props['aria-labelledby'] != null;
  return (
    <PanelContext.Provider value={{ tone, size }}>
      <div
        data-slot="inspector-panel" role={named ? 'region' : undefined}
        className={cn(inspectorPanelVariants({ tone, variant }), inspectorPanelFrameVariants({ radius, shadow }), className)} {...props}
      >
        {children}
      </div>
    </PanelContext.Provider>
  );
}

export interface InspectorSectionProps extends ComponentProps<'section'> {
  children?: ReactNode;
}

/** A padded block of controls with a hairline under it (none on the last section). */
export function InspectorSection({ className, children, ...props }: InspectorSectionProps) {
  const titleId = useId();
  const { size } = useContext(PanelContext);
  return (
    <TitleId.Provider value={titleId}>
      <section data-slot="inspector-panel-section" aria-labelledby={titleId} className={cn(inspectorSectionVariants({ size }), className)} {...props}>
        {children}
      </section>
    </TitleId.Provider>
  );
}

export interface InspectorSectionHeaderProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Section name. */
  title: ReactNode;
  /** Trailing xs IconButtons or a ButtonGroup. */
  actions?: ReactNode;
}

/** Title left, actions right. */
export function InspectorSectionHeader({ title, actions, className, ...props }: InspectorSectionHeaderProps) {
  const titleId = useContext(TitleId);
  const { tone, size } = useContext(PanelContext);
  return (
    <div data-slot="inspector-panel-header" className={cn(inspectorSectionHeaderVariants({ size }), inspectorSectionHeaderToneVariants({ tone }), className)} {...props}>
      <span data-slot="inspector-panel-title" id={titleId} className={inspectorSectionTitleVariants({ tone })}>{title}</span>
      {actions != null && <span data-slot="inspector-panel-actions" className={inspectorSectionActionsVariants()}>{actions}</span>}
    </div>
  );
}
