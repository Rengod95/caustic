import { useEffect, useState } from 'react';

// Hash router: #/ (home), #/foundation/<slug>, #/c/<component-id>.
export type Route = { page: 'home' } | { page: 'foundation'; slug: string } | { page: 'component'; id: string };

export function parseRoute(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts[0] === 'foundation' && parts[1]) return { page: 'foundation', slug: parts[1] };
  if (parts[0] === 'c' && parts[1]) return { page: 'component', id: parts[1] };
  return { page: 'home' };
}

export const hrefFor = {
  home: '#/',
  foundation: (slug: string) => `#/foundation/${slug}`,
  component: (id: string) => `#/c/${id}`,
};

export function useRoute(): Route {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => { setHash(window.location.hash); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return parseRoute(hash);
}
