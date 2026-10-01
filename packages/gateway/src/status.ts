// Where every component stands: approved spec, gated against the current spec, or neither.
// Usage: pnpm gate:status
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readSpec, specIds } from '@caustic/spec/node';
import { specHash } from '../../spec/src/approve.ts';
import { root } from './paths.ts';

const read = (p: string) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {});
const locks: Record<string, string> = read(join(root, 'packages/spec/locks.json'));
const gated: Record<string, { specHash: string }> = read(join(root, 'packages/spec/gated.json'));

const rows = { gated: [] as string[], stale: [] as string[], pending: [] as string[], unapproved: [] as string[], broken: [] as string[] };
for (const id of specIds()) {
  const input = await readSpec(id).catch(() => undefined);
  if (!input) { rows.broken.push(id); continue; }
  const h = specHash(input);
  if (locks[id] !== h) rows.unapproved.push(id);
  else if (gated[id]?.specHash === h) rows.gated.push(id);
  else if (gated[id]) rows.stale.push(id);
  else rows.pending.push(id);
}
console.log(`gated      ${rows.gated.length}`);
console.log(`stale      ${rows.stale.length}  (gated against an older spec: re-run the gate)  ${rows.stale.join(' ')}`);
console.log(`pending    ${rows.pending.length}  (approved, not gated yet)  ${rows.pending.join(' ')}`);
console.log(`unapproved ${rows.unapproved.length}  ${rows.unapproved.join(' ')}`);
if (rows.broken.length) console.log(`broken     ${rows.broken.length}  (spec file fails to load)  ${rows.broken.join(' ')}`);
