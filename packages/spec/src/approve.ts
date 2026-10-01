// Records a human approval of a spec. The gateway refuses specs whose content changed
// since approval, so a spec can never be edited to make an implementation pass.
// Usage: pnpm spec:approve <id> [<id>...]   (agents must not run this)
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSpec } from './node.ts';

const lockPath = join(dirname(fileURLToPath(import.meta.url)), '../locks.json');
export const specHash = (spec: unknown) => createHash('sha256').update(JSON.stringify(spec)).digest('hex').slice(0, 16);
export const readLocks = (): Record<string, string> => (existsSync(lockPath) ? JSON.parse(readFileSync(lockPath, 'utf8')) : {});

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const ids = process.argv.slice(2);
  if (!ids.length) { console.error('usage: pnpm spec:approve <id>…'); process.exit(1); }
  const locks = readLocks();
  for (const id of ids) {
    const s = await readSpec(id);
    if (!s) { console.error(`unknown spec: ${id}`); process.exit(1); }
    locks[id] = specHash(s);
    console.log(`approved ${id} @ ${locks[id]}`);
  }
  writeFileSync(lockPath, JSON.stringify(Object.fromEntries(Object.entries(locks).sort()), null, 2) + '\n');
}
