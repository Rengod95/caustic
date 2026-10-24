import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Select, SelectOption, SegmentedControl, SegmentedControlItem } from '@caustic/react';
import { useSettings, type Theme } from '../settings.tsx';
import { paletteById, paletteVars, palettes, type Palette } from './palettes.ts';

const KEY = 'caustic-showcase-palette';
interface Ctx { palette: Palette; setPalette: (id: string) => void }
const PaletteContext = createContext<Ctx | null>(null);

function initialId(): string {
  try {
    const q = new URLSearchParams(window.location.search).get('palette');
    if (q && palettes.some(p => p.id === q)) return q;
    const raw = window.localStorage.getItem(KEY);
    if (raw && palettes.some(p => p.id === raw)) return raw;
  } catch { /* storage unavailable */ }
  return 'current';
}

/** Applies the active palette as semantic-variable overrides on <html> (portals and the docs shell included). */
export function PaletteProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState(initialId);
  const { theme } = useSettings();
  const palette = paletteById(id);
  useEffect(() => {
    const root = document.documentElement;
    const vars = paletteVars(palette, theme);
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
    root.dataset.palette = palette.id;
    try { window.localStorage.setItem(KEY, palette.id); } catch { /* ignore */ }
    return () => { for (const k of Object.keys(vars)) root.style.removeProperty(k); };
  }, [palette, theme]);
  const value = useMemo<Ctx>(() => ({ palette, setPalette: setId }), [palette]);
  return <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>;
}

export function usePalette(): Ctx {
  const c = useContext(PaletteContext);
  if (!c) throw new Error('PaletteProvider missing');
  return c;
}

/** The shipped semantic values (no overrides), read from CSS so the "Current" baseline is exact. */
export function readBaseline(keys: string[]): Record<string, string> {
  const root = document.documentElement;
  const saved = keys.map(k => root.style.getPropertyValue(k));
  keys.forEach(k => root.style.removeProperty(k));
  const cs = getComputedStyle(root);
  const out: Record<string, string> = {};
  keys.forEach(k => { const v = cs.getPropertyValue(k).trim(); if (v) out[k] = v; });
  keys.forEach((k, i) => { if (saved[i]) root.style.setProperty(k, saved[i]!); });
  return out;
}

/** Compact palette picker for the docs header / drawer. */
export function PaletteSelect() {
  const { palette, setPalette } = usePalette();
  return (
    <div className="w-44">
      <Select aria-label="Palette" value={palette.id} onValueChange={setPalette}>
        {palettes.map(p => <SelectOption key={p.id} value={p.id}>{p.name}</SelectOption>)}
      </Select>
    </div>
  );
}

/** Sticky switcher on showcase pages: every palette as a chip plus the light/dark theme. */
export function ShowcaseBar() {
  const { palette, setPalette } = usePalette();
  const { theme, set } = useSettings();
  return (
    <div data-showcase-bar className="sticky top-14 z-20 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border-subtle bg-surface-base px-3 py-2 min-[900px]:px-5">
      <span className="text-caption uppercase text-text-tertiary">Palette</span>
      <div className="flex min-w-0 flex-wrap items-center gap-1.5" role="group" aria-label="Palette">
        {palettes.map(p => {
          const on = p.id === palette.id;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={on}
              onClick={() => setPalette(p.id)}
              className={[
                'inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 font-ui text-ui-sm outline-none focus-visible:shadow-focus',
                on ? 'border-text-primary bg-text-primary text-text-inverse' : 'border-border-strong bg-surface-base text-text-secondary hover:bg-fill-hover',
              ].join(' ')}
            >
              <span aria-hidden className="flex">
                {[p.accent, p.success, p.warning, p.danger].map((s, i) => (
                  <i key={i} className="-ml-1 size-2.5 rounded-full first:ml-0 ring-1 ring-surface-base" style={{ background: `oklch(${s[theme][0]} ${s[theme][1]} ${s[theme][2]})` }} />
                ))}
              </span>
              {p.name}
            </button>
          );
        })}
      </div>
      <div className="ml-auto">
        <SegmentedControl size="xs" aria-label="Theme" value={theme} onValueChange={v => set({ theme: v as Theme })}>
          <SegmentedControlItem value="light">Light</SegmentedControlItem>
          <SegmentedControlItem value="dark">Dark</SegmentedControlItem>
        </SegmentedControl>
      </div>
    </div>
  );
}
