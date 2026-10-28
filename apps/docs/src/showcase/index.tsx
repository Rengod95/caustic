import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import { Bot, LayoutDashboard, ListChecks, PenTool, Settings2, SlidersHorizontal } from 'lucide-react';
import { Boundary } from '../ui.tsx';

export interface ShowcaseEntry { slug: string; title: string; icon: ReactNode; Component: ComponentType }

// One lazy chunk per page so the docs shell stays light.
export const showcasePages: ShowcaseEntry[] = [
  { slug: 'samples/editor', title: 'Sample: design editor', icon: <PenTool />, Component: lazy(() => import('./samples/editor.tsx')) },
  { slug: 'samples/agent', title: 'Sample: agent session', icon: <Bot />, Component: lazy(() => import('./samples/agent.tsx')) },
  { slug: 'samples/dashboard', title: 'Sample: analytics', icon: <LayoutDashboard />, Component: lazy(() => import('./samples/dashboard.tsx')) },
  { slug: 'samples/settings', title: 'Sample: team & billing', icon: <Settings2 />, Component: lazy(() => import('./samples/settings.tsx')) },
];

/** Internal tools: not showcase pages. */
export const labPages: ShowcaseEntry[] = [
  { slug: 'lab/builder', title: 'Palette builder', icon: <SlidersHorizontal />, Component: lazy(() => import('./builder/builder-page.tsx')) },
  { slug: 'lab/decisions', title: 'Colour decisions (temporary)', icon: <ListChecks />, Component: lazy(() => import('./decisions/decisions-page.tsx')) },
];

const entryFor = (slug: string) => showcasePages.find(p => p.slug === slug) ?? labPages.find(p => p.slug === slug);

export const showcaseTitle = (slug: string) => `${entryFor(slug)?.title ?? slug} · Caustic ${slug.startsWith('lab/') ? 'lab' : 'showcase'}`;

export function ShowcasePage({ slug }: { slug: string }) {
  const entry = entryFor(slug);
  if (!entry) return <p className="p-6 text-text-secondary">Unknown showcase page.</p>;
  const { Component } = entry;
  return (
    <div className="min-w-0" data-showcase={slug}>
      <Boundary label={entry.title}>
        <Suspense fallback={<p className="p-6 text-text-tertiary">Loading…</p>}><Component /></Suspense>
      </Boundary>
    </div>
  );
}
