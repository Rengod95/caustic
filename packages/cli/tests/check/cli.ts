// Runs `check` with the generated catalog (packages/catalog/dist/catalog.json), for the tests and manual scans.
//   tsx packages/cli/tests/check/cli.ts [--json] [--advisory] [--rules a,b] <files…>
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { check } from '../../src/check/index.ts';

const here = dirname(fileURLToPath(import.meta.url));
export function testCatalog() {
  const dist = join(here, '../../../catalog/dist/catalog.json');
  if (!existsSync(dist)) throw new Error(`${dist} is missing: run \`pnpm catalog\` first.`);
  return JSON.parse(readFileSync(dist, 'utf8'));
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const flag = (f: string) => { const i = args.indexOf(f); if (i >= 0) { args.splice(i, 1); return true; } return false; };
  const value = (f: string) => { const i = args.indexOf(f); if (i >= 0) { const v = args[i + 1]; args.splice(i, 2); return v; } return undefined; };
  const opts = { json: flag('--json'), github: flag('--github'), advisory: flag('--advisory'), listRules: flag('--list-rules'), rules: value('--rules')?.split(','), cwd: process.cwd() };
  process.exitCode = await check(args, opts, testCatalog());
}
