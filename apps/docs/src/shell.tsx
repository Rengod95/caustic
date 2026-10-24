import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { House, Menu, Palette, Search, X } from 'lucide-react';
import { IconButton, Input, ListNavigation, ListNavigationGroup, ListNavigationItem } from '@caustic/react';
import { componentGroups, foundationPages, specs, componentIds } from './data.ts';
import { hrefFor, type Route } from './router.ts';
import { Controls } from './settings.tsx';

const isCurrent = (route: Route, key: string) =>
  (route.page === 'home' && key === 'home') ||
  (route.page === 'foundation' && key === `f:${route.slug}`) ||
  (route.page === 'component' && key === `c:${route.id}`);

function Nav({ route, query }: { route: Route; query: string }) {
  const q = query.trim().toLowerCase();
  const groups = useMemo(() => componentGroups
    .map(g => ({ ...g, items: q ? g.items.filter(s => s.name.toLowerCase().includes(q) || s.id.includes(q)) : g.items }))
    .filter(g => g.items.length > 0), [q]);
  const showFoundation = !q || 'foundation color typography space radius elevation motion'.includes(q);
  return (
    <ListNavigation aria-label="Documentation">
      {!q ? (
        <ListNavigationGroup>
          <ListNavigationItem icon={<House />} href={hrefFor.home} current={isCurrent(route, 'home')}>Introduction</ListNavigationItem>
        </ListNavigationGroup>
      ) : null}
      {showFoundation ? (
        <ListNavigationGroup heading="Foundation">
          {foundationPages.map(p => (
            <ListNavigationItem key={p.slug} icon={<Palette />} href={hrefFor.foundation(p.slug)} current={isCurrent(route, `f:${p.slug}`)}>{p.title}</ListNavigationItem>
          ))}
        </ListNavigationGroup>
      ) : null}
      {groups.map(g => (
        <ListNavigationGroup key={g.title} heading={g.title}>
          {g.items.map(s => (
            <ListNavigationItem key={s.id} href={hrefFor.component(s.id)} current={isCurrent(route, `c:${s.id}`)}>{s.name}</ListNavigationItem>
          ))}
        </ListNavigationGroup>
      ))}
      {q && groups.length === 0 && !showFoundation ? <p className="m-0 px-2 font-ui text-ui text-text-tertiary">No component matches “{query}”.</p> : null}
    </ListNavigation>
  );
}

export function Shell({ route, children }: { route: Route; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(() => { setOpen(false); }, [route]);
  useEffect(() => {
    if (!open) return;
    const on = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [open]);

  return (
    <div className="min-h-screen bg-bg-app font-ui text-text-primary">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border-subtle bg-material-regular px-3 min-[900px]:px-5">
        <div className="min-[900px]:hidden">
          <IconButton label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="docs-nav" onClick={() => setOpen(o => !o)}>{open ? <X /> : <Menu />}</IconButton>
        </div>
        <a href={hrefFor.home} className="flex items-center gap-2 text-title-3 text-text-primary no-underline">
          <span aria-hidden className="size-4 rounded-full bg-accent-solid shadow-[inset_0_0_0_3px_var(--cs-color-surface-base)]" />
          Caustic
          <span className="font-ui text-ui-sm text-text-tertiary max-[520px]:hidden">docs · {componentIds.length} components</span>
        </a>
        <div className="ml-auto max-[1099px]:hidden"><Controls /></div>
      </header>

      {open ? <div aria-hidden className="fixed inset-0 z-30 bg-bg-scrim min-[900px]:hidden" onClick={() => setOpen(false)} /> : null}

      <div className="grid min-[900px]:grid-cols-[17rem_minmax(0,1fr)]">
        <aside
          id="docs-nav"
          aria-label="Navigation"
          className={[
            'z-40 grid content-start gap-4 overflow-y-auto p-3 scrollbar-none',
            'min-[900px]:sticky min-[900px]:top-14 min-[900px]:h-[calc(100vh-3.5rem)] min-[900px]:border-r min-[900px]:border-border-subtle',
            'max-[899px]:fixed max-[899px]:inset-y-0 max-[899px]:left-0 max-[899px]:top-14 max-[899px]:w-[min(20rem,calc(100%-2.5rem))] max-[899px]:bg-material-thick max-[899px]:shadow-5 max-[899px]:transition-transform max-[899px]:duration-300 max-[899px]:ease-spring',
            open ? '' : 'max-[899px]:-translate-x-[110%] max-[899px]:invisible',
          ].join(' ')}
        >
          <Input aria-label="Search components" placeholder="Search components" prefix={<Search />} value={query} onValueChange={setQuery} />
          <div className="min-[1100px]:hidden"><Controls stacked /></div>
          <Nav route={route} query={query} />
          <p className="m-0 px-2 font-ui text-footnote text-text-tertiary">{Object.keys(specs).length} components · spec-first, gated</p>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
