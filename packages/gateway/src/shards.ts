// Shard assignment for gate:all: longest-processing-time-first over per-spec cost, not round-robin by count.
// Cost is the spec's last recorded full-run seconds (packages/gateway/timings.json, written by cli.ts on every full run).
// A spec with no record costs the median of the recorded ones; with no record at all the cost is an estimate: the byte size
// of the spec file plus its fixture (more variants and states mean more G3 to G5 renders).
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { reactSrc, root, specsDir } from './paths.ts';

export const timingsPath = join(root, 'packages/gateway/timings.json');
export type Timings = Record<string, number>;

export const readTimings = (): Timings => {
  if (!existsSync(timingsPath)) return {};
  try { return JSON.parse(readFileSync(timingsPath, 'utf8')); } catch { return {}; }
};

const sizeOf = (p: string) => (existsSync(p) ? statSync(p).size : 0);
export const estimate = (id: string) => sizeOf(join(specsDir, `${id}.spec.ts`)) + sizeOf(join(reactSrc, 'components', id, `${id}.fixture.tsx`));

const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)]! : 0; };

/** Cost per id, in one unit: recorded seconds when any exist (unrecorded ids get the median), else estimated bytes. */
export function costs(ids: string[], timings: Timings, est: (id: string) => number = estimate): Record<string, number> {
  const known = ids.map(id => timings[id]).filter((t): t is number => typeof t === 'number' && t > 0);
  const fallback = median(known);
  return Object.fromEntries(ids.map(id => [id, known.length ? (timings[id] && timings[id] > 0 ? timings[id] : fallback) : est(id)]));
}

/** Longest first onto the least loaded shard; each shard keeps its longest-first order. Empty shards are dropped. */
export function balance(ids: string[], shards: number, cost: Record<string, number>): string[][] {
  const groups: { load: number; ids: string[] }[] = Array.from({ length: Math.max(1, shards) }, () => ({ load: 0, ids: [] }));
  for (const id of [...ids].sort((a, b) => cost[b]! - cost[a]! || a.localeCompare(b))) {
    const g = groups.reduce((m, x) => (x.load < m.load ? x : m));
    g.ids.push(id);
    g.load += cost[id]!;
  }
  return groups.filter(g => g.ids.length).map(g => g.ids);
}
