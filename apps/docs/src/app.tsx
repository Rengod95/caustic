import { useEffect } from 'react';
import { SettingsProvider } from './settings.tsx';
import { useRoute } from './router.ts';
import { Shell } from './shell.tsx';
import { Home } from './pages/home.tsx';
import { AgentsPage } from './pages/agents.tsx';
import { FoundationPage } from './pages/foundation.tsx';
import { ComponentPage } from './pages/component.tsx';
import { specs } from './data.ts';
import { ShowcasePage, showcaseTitle } from './showcase/index.tsx';

export function App() {
  const route = useRoute();
  useEffect(() => {
    document.title = route.page === 'showcase' ? showcaseTitle(route.slug) : route.page === 'component' ? `${specs[route.id]?.name ?? route.id} · Caustic docs` : route.page === 'foundation' ? `${route.slug} · Caustic docs` : route.page === 'agents' ? 'For agents · Caustic docs' : 'Caustic docs';
  }, [route]);
  return (
    <SettingsProvider>
      <Shell route={route}>
        {route.page === 'showcase' ? <ShowcasePage slug={route.slug} /> : route.page === 'home' ? <Home /> : route.page === 'agents' ? <AgentsPage /> : route.page === 'foundation' ? <FoundationPage slug={route.slug} /> : <ComponentPage key={route.id} id={route.id} />}
      </Shell>
    </SettingsProvider>
  );
}
