import { useEffect } from 'react';
import { SettingsProvider } from './settings.tsx';
import { useRoute } from './router.ts';
import { Shell } from './shell.tsx';
import { Home } from './pages/home.tsx';
import { FoundationPage } from './pages/foundation.tsx';
import { ComponentPage } from './pages/component.tsx';
import { specs } from './data.ts';

export function App() {
  const route = useRoute();
  useEffect(() => {
    document.title = route.page === 'component' ? `${specs[route.id]?.name ?? route.id} · Caustic docs` : route.page === 'foundation' ? `${route.slug} · Caustic docs` : 'Caustic docs';
  }, [route]);
  return (
    <SettingsProvider>
      <Shell route={route}>
        {route.page === 'home' ? <Home /> : route.page === 'foundation' ? <FoundationPage slug={route.slug} /> : <ComponentPage key={route.id} id={route.id} />}
      </Shell>
    </SettingsProvider>
  );
}
