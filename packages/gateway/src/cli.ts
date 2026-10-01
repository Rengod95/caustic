// caustic gate — runs G0–G6 for components and writes a report + rewrite request per component.
// Usage:
//   pnpm gate button            one component
//   pnpm gate button switch     several
//   pnpm gate --all             every spec
//   flags: --skip=G4,G5   --only=G2   --json
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { rawSpecs } from '@caustic/spec';
import { Collector, writeReport, type Gate } from './report.ts';
import { g0 } from './checks/g0-foundation.ts';
import { g1 } from './checks/g1-spec.ts';
import { g2 } from './checks/g2-static.ts';
import { g3 } from './checks/g3-render.ts';
import { g4 } from './checks/g4-visual.ts';
import { g5Runtime, g5Static } from './checks/g5-policy.ts';
import { g6 } from './checks/g6-package.ts';
import { startRuntime, type Runtime } from './runtime.ts';
import { specHash } from '../../spec/src/approve.ts';
import { reactSrc, root, selftest } from './paths.ts';
import type { Fixture } from '../../react/src/lib/fixture.ts';

const args = process.argv.slice(2);
const flag = (name: string) => args.find(a => a.startsWith(`--${name}=`))?.split('=')[1]?.split(',').map(s => s.toUpperCase()) ?? null;
const json = args.includes('--json');
const all = args.includes('--all');
const ids = all ? Object.keys(rawSpecs) : args.filter(a => !a.startsWith('--'));
const only = flag('only'), skip = flag('skip') ?? [];
const runs = (g: Gate) => (!only || only.includes(g)) && !skip.includes(g);

if (!ids.length) { console.error('usage: pnpm gate <id…> | --all  [--only=G2,G3] [--skip=G4] [--json]'); process.exit(2); }

const gatedPath = join(root, 'packages/spec/gated.json');
type Gated = Record<string, { specHash: string; at: string }>;
const readGated = (): Gated => existsSync(gatedPath) ? JSON.parse(readFileSync(gatedPath, 'utf8')) : {};
/** Only this run's results; merged into the file at the end so parallel gate runs do not overwrite each other. */
const changes: Record<string, Gated[string] | null> = {};

const summary: { id: string; passed: boolean; blocking: number; warnings: number; attempts: number }[] = [];
const g0c = new Collector('foundation');
if (runs('G0')) await g0(g0c);
if (g0c.blocking.length) {
  writeReport('_foundation', g0c, '{}', ['G0']);
  console.error('G0 failed: the foundation is broken. See packages/gateway/reports/_foundation/REWRITE_REQUEST.md');
  process.exit(1);
}

let rt: Runtime | null = null;
const needRuntime = ['G3', 'G4', 'G5'].some(g => runs(g as Gate));
try {
  for (const id of ids) {
    const c = new Collector(id);
    c.findings.push(...g0c.findings);
    const input = rawSpecs[id];
    const gatesRun: Gate[] = (['G0', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'] as Gate[]).filter(runs);
    if (!input) { c.fail({ gate: 'G1', check: 'spec', message: `No spec "${id}" in packages/spec/src/specs/index.ts.` }); summary.push({ id, passed: false, blocking: 1, warnings: 0, attempts: writeReport(id, c, '{}', gatesRun).attempts }); continue; }
    // Import only this component's fixture: other components may be mid-edit by parallel authors.
    const fixturePath = join(reactSrc, 'components', id, `${id}.fixture.tsx`);
    const fixture: Fixture | undefined = existsSync(fixturePath)
      ? await import(pathToFileURL(fixturePath).href).then(m => m.default, (e: any) => { c.fail({ gate: 'G1', check: 'fixture', message: `Fixture failed to load: ${String(e.message).split('\n')[0]}` }); return undefined; })
      : undefined;
    const spec = runs('G1') ? await g1(c, input, fixture) : null;
    if (spec) {
      if (runs('G2')) await g2(c, spec).catch(e => c.fail({ gate: 'G2', check: 'crash', message: String(e.stack ?? e).slice(0, 800) }));
      if (runs('G5')) await g5Static(c, spec).catch(e => c.fail({ gate: 'G5', check: 'crash', message: String(e.stack ?? e).slice(0, 800) }));
      if (runs('G6')) await g6(c, spec).catch(e => c.fail({ gate: 'G6', check: 'crash', message: String(e.stack ?? e).slice(0, 800) }));
      const staticBlocking = c.blocking.some(f => f.gate === 'G2' && ['files', 'export'].includes(f.check));
      if (needRuntime && fixture && !staticBlocking) {
        rt ??= await startRuntime();
        if (runs('G3')) await g3(c, spec, rt).catch(e => c.fail({ gate: 'G3', check: 'crash', message: String(e.stack ?? e).slice(0, 800) }));
        if (runs('G4')) await g4(c, spec, rt).catch(e => c.fail({ gate: 'G4', check: 'crash', message: String(e.stack ?? e).slice(0, 800) }));
        if (runs('G5')) await g5Runtime(c, spec, rt).catch(e => c.fail({ gate: 'G5', check: 'crash', message: String(e.stack ?? e).slice(0, 800) }));
      }
    }
    const { passed, attempts } = writeReport(id, c, JSON.stringify(input, null, 2), gatesRun);
    const fullRun = gatesRun.length === 7;
    if (passed && fullRun) changes[id] = { specHash: specHash(input), at: new Date().toISOString() };
    else if (!passed) changes[id] = null;
    summary.push({ id, passed, blocking: c.blocking.length, warnings: c.findings.length - c.blocking.length, attempts });
  }
} finally {
  if (rt) await rt.close();
}
if (!selftest && Object.keys(changes).length) {
  const gated = readGated();
  for (const [id, v] of Object.entries(changes)) if (v) gated[id] = v; else delete gated[id];
  writeFileSync(gatedPath, JSON.stringify(Object.fromEntries(Object.entries(gated).sort()), null, 2) + '\n');
}

if (json) console.log(JSON.stringify(summary, null, 2));
else {
  for (const s of summary) console.log(`${s.passed ? 'PASS' : 'FAIL'}  ${s.id.padEnd(22)} blocking ${String(s.blocking).padStart(3)}  warnings ${String(s.warnings).padStart(3)}  attempt ${s.attempts}${s.passed ? '' : `  → packages/gateway/reports/${s.id}/REWRITE_REQUEST.md`}`);
  const p = summary.filter(s => s.passed).length;
  console.log(`\n${p}/${summary.length} passed`);
}
process.exit(summary.every(s => s.passed) ? 0 : 1);
