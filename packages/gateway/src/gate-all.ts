// Runs the full gate over every spec in parallel shards (each shard is one `pnpm gate` process
// with its own browser and Vite server; gate runs are parallel-safe).
// Usage: pnpm gate:all [--shards=4] [--skip=G4] [--no-specimens] …   (extra flags are passed through)
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { specIds } from '@caustic/spec/node';
import { root } from './paths.ts';

const args = process.argv.slice(2);
const shards = Number(args.find(a => a.startsWith('--shards='))?.split('=')[1] ?? 4);
const pass = args.filter(a => !a.startsWith('--shards='));
const ids = specIds();
if (pass.includes('--no-specimens')) console.log('NOTE: specimen links not checked (--no-specimens, as in CI). The full gate, with ../caustic-preview, runs locally: just gate-all');
const groups = Array.from({ length: shards }, (_, i) => ids.filter((_, j) => j % shards === i)).filter(g => g.length);

type Row = { id: string; passed: boolean; blocking: number; warnings: number; attempts: number };
const run = (group: string[]) => new Promise<Row[]>(resolve => {
  const child = spawn(process.execPath, [join(root, 'node_modules/tsx/dist/cli.mjs'), join(root, 'packages/gateway/src/cli.ts'), ...group, ...pass, '--json'], { cwd: root });
  let out = '';
  child.stdout.on('data', d => { out += d; });
  child.stderr.on('data', d => process.stderr.write(d));
  child.on('close', () => {
    const start = out.indexOf('[');
    try { resolve(JSON.parse(out.slice(start))); }
    catch { resolve(group.map(id => ({ id, passed: false, blocking: -1, warnings: 0, attempts: 0 }))); }
  });
});

const started = Date.now();
const rows = (await Promise.all(groups.map(run))).flat().sort((a, b) => a.id.localeCompare(b.id));
const failed = rows.filter(r => !r.passed);
for (const r of failed) console.log(`FAIL  ${r.id.padEnd(22)} blocking ${r.blocking < 0 ? 'crash' : r.blocking}  → packages/gateway/reports/${r.id}/REWRITE_REQUEST.md`);
console.log(`\n${rows.length - failed.length}/${rows.length} passed in ${Math.round((Date.now() - started) / 1000)}s over ${groups.length} shards`);
process.exit(failed.length ? 1 : 0);
