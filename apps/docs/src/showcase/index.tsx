import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import { Bot, LayoutDashboard, PenTool, Settings2, SwatchBook } from 'lucide-react';
import { Boundary } from '../ui.tsx';
import { ShowcaseBar } from './palette-state.tsx';

export interface ShowcaseEntry { slug: string; title: string; icon: ReactNode; Component: ComponentType }

// One lazy chunk per page so the docs shell stays light.
export const showcasePages: ShowcaseEntry[] = [
  { slug: 'palettes', title: 'Palette proposals', icon: <SwatchBook />, Component: lazy(() => import('./palettes-page.tsx')) },
  { slug: 'samples/editor', title: 'Sample: design editor', icon: <PenTool />, Component: lazy(() => import('./samples/editor.tsx')) },
  { slug: 'samples/agent', title: 'Sample: agent session', icon: <Bot />, Component: lazy(() => import('./samples/agent.tsx')) },
  { slug: 'samples/dashboard', title: 'Sample: analytics', icon: <LayoutDashboard />, Component: lazy(() => import('./samples/dashboard.tsx')) },
  { slug: 'samples/settings', title: 'Sample: team & billing', icon: <Settings2 />, Component: lazy(() => import('./samples/settings.tsx')) },
];

export const showcaseTitle = (slug: string) => `${showcasePages.find(p => p.slug === slug)?.title ?? slug} · Caustic showcase`;

export function ShowcasePage({ slug }: { slug: string }) {
  const entry = showcasePages.find(p => p.slug === slug);
  if (!entry) return <p className="p-6 text-text-secondary">Unknown showcase page.</p>;
  const { Component } = entry;
  return (
    <div className="min-w-0" data-showcase={slug}>
      <ShowcaseBar />
      <Boundary label={entry.title}>
        <Suspense fallback={<p className="p-6 text-text-tertiary">Loading…</p>}><Component /></Suspense>
      </Boundary>
    </div>
  );
}
