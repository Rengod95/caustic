// The Caustic theme as a Tailwind 4 design system: proves a class against the shipped stylesheet (@caustic/react
// styles.css with its @source lines removed, as the gateway's tw.ts does) and suggests the nearest token utilities.
import { __unstable__loadDesignSystem } from '@tailwindcss/node';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { closest, distance } from './text.ts';
import { PALETTE, splitVariants, utilityRoot } from './classes.ts';

const TONE_OF_HUE: Record<string, string> = {
  red: 'danger', rose: 'danger', orange: 'warning', amber: 'warning', yellow: 'warning', lime: 'success', green: 'success',
  emerald: 'success', teal: 'success', cyan: 'info', sky: 'info', blue: 'accent', indigo: 'accent', violet: 'agent',
  purple: 'agent', fuchsia: 'agent', pink: 'danger', slate: 'neutral', gray: 'neutral', zinc: 'neutral', neutral: 'neutral',
  stone: 'neutral', black: 'neutral', white: 'surface',
};

type DesignSystem = Awaited<ReturnType<typeof __unstable__loadDesignSystem>>;

export type Theme = {
  /** null when the class compiles; otherwise why not ('utility' or 'variant'). */
  verdict(cls: string): null | { kind: 'utility' | 'variant'; variant?: string };
  /** Theme key remainders by namespace (color → text-primary, surface-base …; spacing → control-md …), for the
   *  "looks like a utility" heuristic. */
  vocabulary: Map<string, Set<string>>;
  suggest(cls: string): string[];
};

/** styles.css of @caustic/react, resolved from the consumer first, then from this workspace. */
export function findStyles(cwd: string): string | undefined {
  try {
    const req = createRequire(join(cwd, 'package.json'));
    const p = req.resolve('@caustic/react/styles.css');
    if (existsSync(p)) return p;
  } catch { /* not installed in the consumer */ }
  const here = dirname(fileURLToPath(import.meta.url));
  const local = join(here, '../../../react/src/styles.css');
  return existsSync(local) ? local : undefined;
}

const cache = new Map<string, Promise<Theme>>();

export function loadTheme(stylesPath: string): Promise<Theme> {
  let t = cache.get(stylesPath);
  if (!t) { t = build(stylesPath); cache.set(stylesPath, t); }
  return t;
}

async function build(stylesPath: string): Promise<Theme> {
  const css = readFileSync(stylesPath, 'utf8').replace(/@source[^;]*;/g, '');
  const ds: DesignSystem = await __unstable__loadDesignSystem(css, { base: dirname(stylesPath) });
  const compiles = (c: string) => ds.candidatesToCss([c])[0] != null;

  const vocabulary = new Map<string, Set<string>>();
  const ns = /^--(color|spacing|radius|text|font-weight|font|shadow|inset-shadow|drop-shadow|ease|animate|leading|tracking|container|breakpoint|blur|perspective|aspect)-/;
  for (const key of (ds.theme as unknown as { values: Map<string, unknown> }).values.keys()) {
    const m = key.match(ns);
    if (!m) continue;
    const set = vocabulary.get(m[1]!) ?? new Set<string>();
    set.add(key.slice(m[0].length).replace(/--.*$/, ''));
    vocabulary.set(m[1]!, set);
  }

  let classList: string[] | undefined;
  const variantNames = () => ds.getVariants().map(v => v.name);

  return {
    vocabulary,
    verdict(cls) {
      if (compiles(cls)) return null;
      const { variants, utility } = splitVariants(cls);
      if (variants.length && compiles(utility)) {
        const bad = variants.find(v => !compiles(`${v}:${utility}`));
        return { kind: 'variant', ...(bad ? { variant: bad } : {}) };
      }
      return { kind: 'utility' };
    },
    suggest(cls) {
      const { variants, utility, important } = splitVariants(cls);
      const prefix = variants.length ? variants.join(':') + ':' : '';
      if (variants.length && compiles(utility)) {
        const bad = (variants.find(v => !compiles(`${v}:${utility}`)) ?? variants[0]!).replace(/-\[.*$/, '');
        if (bad.length < 3) return [];
        return closest(bad, variantNames().filter(v => v.length >= 3), 3).filter(v => distance(v, bad) <= 2).map(v => `${v}:`);
      }
      classList ??= ds.getClassList().map(([name]) => name).filter(n => !n.startsWith('-'));
      const bare = utility.replace(/^-/, '');
      const r = utilityRoot(bare);
      const root = r?.root ?? bare.split('-')[0]!;
      const pool = classList.filter(n => n.startsWith(root + '-') && utilityRoot(n)?.root === root);
      let value = r?.value ?? bare.slice(root.length + 1);
      // A Tailwind palette colour maps to the semantic family it usually means (red-500 → danger).
      const hue = value.match(PALETTE)?.[1];
      if (hue) value = TONE_OF_HUE[hue] ?? value;
      // Prefer utilities that keep the value's words (text-primary → text-text-primary), then the nearest by name.
      const words = value.split('-').filter(w => w && !/^\d/.test(w));
      const keep = words.length ? pool.filter(n => { const segs = n.slice(root.length + 1).split('-'); return words.every(w => segs.includes(w)); }) : [];
      const ranked = [...keep.sort((a, b) => a.length - b.length || a.localeCompare(b)).slice(0, 3), ...(hue ? [] : closest(bare, pool, 3))];
      return [...new Set(ranked)].slice(0, 3).map(n => prefix + (important ? '!' : '') + n);
    },
  };
}
