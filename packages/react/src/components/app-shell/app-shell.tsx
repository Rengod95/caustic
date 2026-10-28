'use client';
import { Children, createContext, isValidElement, useContext, useEffect, useId, useRef, useState, type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Size } from '../../lib/common-props.ts';
import {
  appShellBodyVariants, appShellEndVariants, appShellOverlayVariants, appShellSkipVariants, appShellStageVariants,
  appShellStartVariants, appShellTitlebarVariants, appShellVariants,
} from './app-shell.variants.ts';

type Layout = 'wide' | 'medium' | 'compact';

/** Container widths (px) at and below which the layout steps down: the medium and compact breakpoint tokens. */
const MEDIUM_MAX = 1100;
const COMPACT_MAX = 720;

const measureLayout = (width: number): Layout => (width <= COMPACT_MAX ? 'compact' : width <= MEDIUM_MAX ? 'medium' : 'wide');

interface ShellContext { layout: Layout; stageId: string; size?: Size | undefined }
const ShellContext = createContext<ShellContext>({ layout: 'wide', stageId: '' });

/** Common props: variant / tone the window ground, radius / shadow the window box, size the inset, gaps and titlebar. */
export interface AppShellProps extends Omit<ComponentProps<'div'>, 'children'>, CommonProps {
  /** Pin the layout. When omitted the shell measures its own width: medium at 1100 and below, compact at 720 and below. */
  layout?: Layout;
  /** Text of the skip link to the stage. When omitted no link is rendered. Supplied by the app so it can be translated. */
  skipLabel?: string;
  /** Titlebar and body parts in order. */
  children?: ReactNode;
}

/** The studio window frame: titlebar, start region, stage and end region. Slots only, no business logic. */
export function AppShell({ layout, skipLabel, tone, variant, radius, shadow, size, className, children, ...props }: AppShellProps) {
  const stageId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<Layout>('wide');
  const current = layout ?? measured;

  useEffect(() => {
    const el = ref.current;
    if (layout || !el) return;
    const update = () => setMeasured(measureLayout(el.offsetWidth));
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [layout]);

  const skip = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById(stageId)?.focus();
  };

  // The titlebar sits above the body row; everything else (start, stage, end) goes in the body.
  const parts = Children.toArray(children);
  const titlebar = parts.filter(c => isValidElement(c) && c.type === AppShellTitlebar);
  const body = parts.filter(c => !titlebar.includes(c));

  return (
    <ShellContext.Provider value={{ layout: current, stageId, size }}>
      <div ref={ref} data-slot="app-shell" data-layout={current} className={cn(appShellVariants({ tone, variant, radius, shadow, size }), className)} {...props}>
        {skipLabel !== undefined && <a data-slot="app-shell-skip" href={`#${stageId}`} className={appShellSkipVariants()} onClick={skip}>{skipLabel}</a>}
        {titlebar}
        <div data-slot="app-shell-body" className={appShellBodyVariants({ size })}>{body}</div>
      </div>
    </ShellContext.Provider>
  );
}

export interface AppShellTitlebarProps extends ComponentProps<'header'> {}

/** Banner band on top: toolbars, project name, undo / redo, status. */
export function AppShellTitlebar({ className, ...props }: AppShellTitlebarProps) {
  const { size } = useContext(ShellContext);
  return <header data-slot="app-shell-titlebar" className={cn(appShellTitlebarVariants({ size }), className)} {...props} />;
}

export interface AppShellStartProps extends ComponentProps<'div'> {}

/** Region wrapper for the start side. Compact: the open panel covers the stage as a full-width sheet. */
export function AppShellStart({ className, ...props }: AppShellStartProps) {
  const { layout } = useContext(ShellContext);
  return <div data-slot="app-shell-start" className={cn(appShellStartVariants({ layout }), className)} {...props} />;
}

export interface AppShellStageProps extends ComponentProps<'main'> {
  /** aria-label of the main landmark, supplied by the app so it can be translated. */
  stageLabel?: string;
}

/** The work surface (canvas, foundation board): the main landmark. Focusable by the skip link. */
export function AppShellStage({ stageLabel, className, ...props }: AppShellStageProps) {
  const { stageId } = useContext(ShellContext);
  return <main id={stageId} data-slot="app-shell-stage" tabIndex={-1} aria-label={stageLabel} className={cn(appShellStageVariants(), className)} {...props} />;
}

export interface AppShellOverlayProps extends ComponentProps<'div'> {}

/** Floating layer over the stage: pointer events pass through except on its direct children. */
export function AppShellOverlay({ className, ...props }: AppShellOverlayProps) {
  return <div data-slot="app-shell-overlay" className={cn(appShellOverlayVariants(), className)} {...props} />;
}

export interface AppShellEndProps extends ComponentProps<'div'> {}

/** Region wrapper for the end side. Medium and compact: the panel overlays the stage as a sheet. */
export function AppShellEnd({ className, ...props }: AppShellEndProps) {
  const { layout } = useContext(ShellContext);
  return <div data-slot="app-shell-end" className={cn(appShellEndVariants({ layout }), className)} {...props} />;
}
