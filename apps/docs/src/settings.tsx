import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SegmentedControl, SegmentedControlItem, Slider, Switch } from '@caustic/react';

// Global display controls: theme, accent hue and density. They write to <html> so every
// component (and the foundation pages) reacts through tokens, never through props.
export type Theme = 'light' | 'dark';
export interface Settings { theme: Theme; hue: number; compact: boolean }
interface Ctx extends Settings { set: (patch: Partial<Settings>) => void }

const KEY = 'caustic-docs-settings';
const DEFAULT_HUE = 205;

function initial(): Settings {
  const base: Settings = {
    theme: window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    hue: DEFAULT_HUE,
    compact: false,
  };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return { ...base, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch { /* storage unavailable: defaults */ }
  return base;
}

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Settings>(initial);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = s.theme;
    root.style.setProperty('--cs-accent-hue', String(s.hue));
    if (s.compact) root.dataset.density = 'compact'; else delete root.dataset.density;
    try { window.localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
  }, [s]);
  const value = useMemo<Ctx>(() => ({ ...s, set: patch => setS(prev => ({ ...prev, ...patch })) }), [s]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): Ctx {
  const c = useContext(SettingsContext);
  if (!c) throw new Error('SettingsProvider missing');
  return c;
}

/** Theme, accent hue and density in one row (or stacked in the mobile drawer). */
export function Controls({ stacked = false }: { stacked?: boolean }) {
  const { theme, hue, compact, set } = useSettings();
  const row = stacked ? 'grid gap-1.5' : 'flex items-center gap-2';
  const label = 'text-caption uppercase text-text-tertiary';
  return (
    <div className={stacked ? 'grid gap-3' : 'flex items-center gap-4'}>
      <div className={row}>
        <span className={label}>Theme</span>
        <SegmentedControl size="xs" aria-label="Theme" value={theme} onValueChange={v => set({ theme: v as Theme })}>
          <SegmentedControlItem value="light">Light</SegmentedControlItem>
          <SegmentedControlItem value="dark">Dark</SegmentedControlItem>
        </SegmentedControl>
      </div>
      <div className={row}>
        <span className={label}>Accent {hue}</span>
        <div className="w-28"><Slider aria-label="Accent hue" size="sm" min={0} max={360} value={hue} onValueChange={v => set({ hue: v })} /></div>
      </div>
      <div className={row}>
        <span className={label}>Compact</span>
        <Switch size="sm" aria-label="Compact density" checked={compact} onCheckedChange={v => set({ compact: v })} />
      </div>
    </div>
  );
}
