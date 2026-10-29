// Token index used by the checks: names, scales and allowlists from @caustic/tokens/dist.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tokensDist } from './paths.ts';

export interface TokenIndex {
  colors: Set<string>;          // semantic color names: "ink.solid"
  radius: Record<string, number>;
  control: Record<string, number>;
  field: Record<string, number>;
  icon: Record<string, number>;
  inset: Record<string, [number, number]>;
  type: Record<string, [string, number, number, number, number, string?]>;
  elevation: string[];
  studio: Record<string, number>;
  allow: {
    spacingSteps: number[]; durations: number[]; durationNames: string[]; zIndex: number[]; opacity: number[]; fontWeights: string[];
    arbitraryPx: string[]; semanticColors: string[]; textRoles: string[]; radii: string[];
  };
  raw: any;
}

let cache: TokenIndex | null = null;
export async function tokenIndex(): Promise<TokenIndex> {
  if (cache) return cache;
  const raw = (await import(pathToFileURL(join(tokensDist, 'tokens.mjs')).href)).default;
  const allow = JSON.parse(readFileSync(join(tokensDist, 'allowlist.json'), 'utf8'));
  cache = {
    colors: new Set(Object.keys(raw.themes.light)),
    radius: { ...raw.radius, window: raw.studio['window-radius'], panel: raw.studio['panel-radius'], toolbar: raw.studio['toolbar-radius'], 'toolbar-item': raw.studio['toolbar-item-radius'], toast: raw.studio['toast-radius'] },
    control: raw.size.control, field: raw.size.field, icon: raw.size.icon,
    inset: raw.inset, type: raw.type, elevation: Object.keys(raw.elevation.light), studio: raw.studio, allow, raw,
  };
  return cache;
}

/** Resolves a dimension token key (control-md, field-lg, icon-sm, hit) to px. */
export function dimPx(t: TokenIndex, key: string | number): number | null {
  if (typeof key === 'number') return key;
  if (/^\d+(\.\d+)?$/.test(key)) return Number(key);
  const [ns, ...rest] = key.split('-'); const k = rest.join('-');
  if (key.startsWith('control-compact-')) return t.raw.size['control-compact']?.[key.slice(16)] ?? null;
  if (key.startsWith('field-compact-')) return t.raw.size['field-compact']?.[key.slice(14)] ?? null;
  if (ns === 'control') return t.control[k] ?? null;
  if (ns === 'field') return t.field[k] ?? null;
  if (ns === 'icon') return t.icon[k] ?? null;
  if (key === 'hit') return t.raw.size['hit-min'];
  if (ns === 'size') return t.raw.size.component[k] ?? null;
  if (ns === 'inset') { const [kind, axis] = [rest.slice(0, -1).join('-'), rest.at(-1)]; const v = t.inset[kind]; return v ? (axis === 'x' ? v[1] : v[0]) : null; }
  return null;
}
