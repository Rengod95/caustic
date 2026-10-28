// Which specs a change can affect, from git: the branch since it left `base` plus uncommitted and untracked files.
// A component folder, spec or baseline folder names its id; every spec that uses a changed id (composition.uses or an
// import from its folder, fixtures included; transitively) is affected too. The generated registries (index, fixtures,
// locks, gated) name ids on their changed lines. Shared code (tokens, lib, hooks, styles, the spec schema, the gateway,
// dependencies) can reach any component, so it returns 'all', and so does a base git cannot resolve or a HEAD that is
// the base itself (main in CI: nothing to compare against). Docs, scripts, the agent catalog, the CLI and the skill do not
// change gate results.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readSpec, specIds } from '@caustic/spec/node';
import { root } from './paths.ts';

const COMPONENTS = 'packages/react/src/components';
const OWN = [
  /^packages\/react\/src\/components\/([^/]+)\//,
  /^packages\/spec\/src\/specs\/([^/]+)\.spec\.ts$/,
  /^baselines\/([^/]+)\//,
];
const REGISTRIES = [
  /^packages\/react\/src\/(index|fixtures)\.ts$/, /^packages\/spec\/src\/specs\/index\.ts$/, /^packages\/spec\/(locks|gated)\.json$/,
];
const IGNORED = [/^apps\//, /^scripts\//, /^[^/]+\.md$/, /^justfile$/, /^lefthook\.yml$/, /^\.[^/]+$/, /^packages\/gateway\/reports\//, /^packages\/(catalog|cli)\//, /^skills\//];

const git = (...args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\n').filter(Boolean);
const tryGit = (...args: string[]) => { try { return git(...args); } catch { return null; } };

export async function affectedIds(base = 'main'): Promise<string[] | 'all'> {
  const from = tryGit('merge-base', 'HEAD', base)?.[0];
  if (!from || from === git('rev-parse', 'HEAD')[0]) return 'all';
  const files = [...git('diff', '--name-only', from), ...git('ls-files', '--others', '--exclude-standard')];
  // Ids on the changed lines of a registry: kebab ids in paths, JSON keys and spec imports.
  const registryIds = (file: string) => git('diff', '-U0', from, '--', file)
    .filter(l => /^[+-][^+-]/.test(l))
    .flatMap(l => [...l.matchAll(/components\/([a-z0-9-]+)\/|"([a-z0-9-]+)"\s*:|specs\/([a-z0-9-]+)\.spec/g)].map(m => m[1] ?? m[2] ?? m[3] ?? ''));
  return idsForFiles(files, registryIds);
}

export async function idsForFiles(files: string[], registryIds: (file: string) => string[] = () => []): Promise<string[] | 'all'> {
  const ids = new Set(specIds());
  const changed = new Set<string>();
  for (const f of files) {
    const own = OWN.map(r => f.match(r)?.[1]).find(Boolean);
    if (own) { if (ids.has(own)) changed.add(own); continue; }
    if (REGISTRIES.some(r => r.test(f))) { for (const id of registryIds(f)) if (ids.has(id)) changed.add(id); continue; }
    if (!IGNORED.some(r => r.test(f))) return 'all';
  }
  const usedBy = new Map<string, Set<string>>();
  const use = (user: string, dep: string) => { if (dep !== user) usedBy.set(dep, (usedBy.get(dep) ?? new Set()).add(user)); };
  for (const id of ids) {
    for (const dep of ((await readSpec(id)) as { composition?: { uses?: string[] } } | null)?.composition?.uses ?? []) use(id, dep);
    let names: string[] = [];
    try { names = readdirSync(join(root, COMPONENTS, id)); } catch { continue; }
    for (const name of names.filter(n => /\.tsx?$/.test(n))) {
      for (const m of readFileSync(join(root, COMPONENTS, id, name), 'utf8').matchAll(/from '\.\.\/([a-z0-9-]+)\//g)) use(id, m[1] ?? '');
    }
  }
  const queue = [...changed];
  for (const id of queue) for (const user of usedBy.get(id) ?? []) if (!changed.has(user)) { changed.add(user); queue.push(user); }
  return [...changed].sort();
}
