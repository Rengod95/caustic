// Which specs a change can affect, from git: the branch since it left `base` plus uncommitted and untracked files.
// A component folder, spec or baseline folder names its id; every spec that composes a changed id (composition.uses,
// transitively) is affected too. Shared code (tokens, lib, hooks, styles, the spec schema, the gateway, dependencies)
// can reach any component, so it returns 'all'. Docs, scripts and generated indexes do not change gate results.
import { execFileSync } from 'node:child_process';
import { readSpec, specIds } from '@caustic/spec/node';
import { root } from './paths.ts';

const OWN = [
  /^packages\/react\/src\/components\/([^/]+)\//,
  /^packages\/spec\/src\/specs\/([^/]+)\.spec\.ts$/,
  /^baselines\/([^/]+)\//,
];
const IGNORED = [
  /^apps\//, /^scripts\//, /^[^/]+\.md$/, /^justfile$/, /^lefthook\.yml$/, /^\.[^/]+$/,
  /^packages\/react\/src\/(index|fixtures)\.ts$/, /^packages\/spec\/src\/specs\/index\.ts$/,
  /^packages\/spec\/(locks|gated)\.json$/, /^packages\/gateway\/reports\//,
];

const git = (...args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);

export const affectedIds = (base = 'main') => idsForFiles([
  ...git('diff', '--name-only', git('merge-base', 'HEAD', base)[0] ?? base),
  ...git('ls-files', '--others', '--exclude-standard'),
]);

export async function idsForFiles(files: string[]): Promise<string[] | 'all'> {
  const ids = new Set(specIds());
  const changed = new Set<string>();
  for (const f of files) {
    const own = OWN.map(r => f.match(r)?.[1]).find(Boolean);
    if (own) { if (ids.has(own)) changed.add(own); continue; }
    if (!IGNORED.some(r => r.test(f))) return 'all';
  }
  const usedBy = new Map<string, string[]>();
  for (const id of ids) {
    for (const dep of ((await readSpec(id)) as { composition?: { uses?: string[] } } | null)?.composition?.uses ?? []) {
      usedBy.set(dep, [...(usedBy.get(dep) ?? []), id]);
    }
  }
  const queue = [...changed];
  for (const id of queue) for (const user of usedBy.get(id) ?? []) if (!changed.has(user)) { changed.add(user); queue.push(user); }
  return [...changed].sort();
}
