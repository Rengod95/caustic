// Gateway self-test: proves the gate rejects known-bad implementations.
// Each mutation edits the Button source (or spec) temporarily, runs the gate, and asserts that
// a blocking finding of the expected check appears. Files are always restored.
// Usage: pnpm gate:selftest
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { root } from './paths.ts';

const comp = join(root, 'packages/react/src/components/button');
const V = join(comp, 'button.variants.ts'), C = join(comp, 'button.tsx'), I = join(comp, 'index.ts'), S = join(root, 'packages/spec/src/specs/button.spec.ts');

interface Mutation { name: string; file: string; from: string; to: string; expect: string[]; skip?: string }
const mutations: Mutation[] = [
  { name: 'literal color', file: V, from: 'bg-ink-solid text-ink-on', to: 'bg-[#111318] text-ink-on', expect: ['G2:arbitrary-value', 'G3:tokens'], skip: 'G4' },
  { name: 'non-token color', file: V, from: 'bg-danger-soft text-danger-text', to: 'bg-red-500 text-danger-text', expect: ['G2:non-token-class'], skip: 'G4' },
  { name: 'wrong hover token', file: V, from: 'hover:bg-ink-hover', to: 'hover:bg-ink-solid', expect: ['G3:tokens'], skip: 'G4' },
  { name: 'off-scale padding', file: V, from: 'h-control-md gap-1.5 px-3', to: 'h-control-md gap-1.5 px-9', expect: ['G2:space-scale', 'G3:tokens'] }, // 36px: between scale steps 8 and 10
  { name: 'wrong radius', file: V, from: 'h-control-md gap-1.5 px-3 text-ui-strong rounded-md', to: 'h-control-md gap-1.5 px-3 text-ui-strong rounded-xl', expect: ['G3:tokens'], skip: 'G4' },
  { name: 'missing variant value', file: V, from: "        ghost: 'bg-transparent", to: "        quiet: 'bg-transparent", expect: ['G2:variants'], skip: 'G4' },
  { name: 'spectrum outside agent', file: V, from: "ink: 'frost bg-ink-solid", to: "ink: 'agent-rim frost bg-ink-solid", expect: ['G5:P2 spectrum'], skip: 'G4' },
  { name: 'gradient on a button', file: V, from: "secondary: 'frost bg-control-raised", to: "secondary: 'bg-linear-to-b frost bg-control-raised", expect: ['G5:P3 flat'], skip: 'G4' },
  { name: 'dark: variant', file: V, from: 'hover:bg-control-raised-hover', to: 'hover:bg-control-raised-hover dark:bg-ink-solid', expect: ['G2:no-dark-variant'], skip: 'G4' },
  { name: 'spacing calc loophole', file: V, from: 'h-control-md gap-1.5 px-3', to: 'h-control-md gap-1.5 px-[calc(var(--spacing)*7)]', expect: ['G2:space-scale'], skip: 'G3,G4,G5' },
  { name: 'misspelt token variable', file: V, from: 'bg-danger-soft text-danger-text', to: 'bg-[var(--cs-color-danger-sofft)] text-danger-text', expect: ['G2:unknown-var'], skip: 'G3,G4,G5' },
  { name: 'missing data-slot', file: C, from: 'data-slot="button"\n', to: '\n', expect: ['G2:data-slot', 'G3:anatomy'], skip: 'G4' },
  { name: 'loading does not block click', file: C, from: 'onClick={inert ? undefined : onClick}', to: 'onClick={disabled ? undefined : onClick}', expect: ['G3:behavior'], skip: 'G4' },
  { name: 'component not exported', file: I, from: 'export { Button, type ButtonProps }', to: 'export { type ButtonProps }', expect: ['G6:export'], skip: 'G3,G4,G5' },
  { name: 'spec edited without approval', file: S, from: "purpose: 'Runs one action.", to: "purpose: 'Runs an action.", expect: ['G1:approval'], skip: 'G3,G4,G5' },
];

const reports = mkdtempSync(join(tmpdir(), 'caustic-selftest-'));
let failed = 0;
for (const m of mutations) {
  const original = readFileSync(m.file, 'utf8');
  if (!original.includes(m.from)) { console.log(`?? ${m.name}: mutation anchor not found`); failed++; continue; }
  writeFileSync(m.file, original.replace(m.from, m.to));
  try {
    try {
      execFileSync(process.execPath, ['--import', 'tsx', join(root, 'packages/gateway/src/cli.ts'), 'button', ...(m.skip ? [`--skip=${m.skip}`] : [])], { env: { ...process.env, CAUSTIC_SELFTEST: '1', CAUSTIC_REPORTS_DIR: reports }, stdio: 'pipe', timeout: 600000 });
    } catch { /* non-zero exit is the expected outcome */ }
    const report = JSON.parse(readFileSync(join(reports, 'button', 'report.json'), 'utf8'));
    const got = new Set<string>(report.findings.filter((f: any) => f.blocking).map((f: any) => `${f.gate}:${f.check}`));
    const missing = m.expect.filter(e => !got.has(e));
    if (missing.length) { failed++; console.log(`MISS ${m.name}: gate did not report ${missing.join(', ')} (got ${[...got].join(', ') || 'nothing'})`); }
    else console.log(`CATCH ${m.name}: ${m.expect.join(', ')}`);
  } finally { writeFileSync(m.file, original); }
}
console.log(`\n${mutations.length - failed}/${mutations.length} mutations caught`);
process.exit(failed ? 1 : 0);
