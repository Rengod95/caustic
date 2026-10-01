// Gateway findings, the JSON report and the rewrite request an author (human or agent) works from.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { reportsDir, root } from './paths.ts';

export type Gate = 'G0' | 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6';
export interface Finding {
  gate: Gate;
  check: string;
  blocking: boolean;
  message: string;
  expected?: string;
  actual?: string;
  where?: string;          // file:line, slot, case or example
  fix?: string;            // one-line direction
  artifact?: string;       // path to a diff image or log
}

export class Collector {
  findings: Finding[] = [];
  constructor(public id: string) {}
  fail(f: Omit<Finding, 'blocking'> & { blocking?: boolean }) { this.findings.push({ blocking: true, ...f }); }
  warn(f: Omit<Finding, 'blocking'>) { this.findings.push({ ...f, blocking: false }); }
  get blocking() { return this.findings.filter(f => f.blocking); }
}

const MAX_ATTEMPTS = 5;

export function writeReport(id: string, c: Collector, specExcerpt: string, gatesRun: Gate[]) {
  const dir = join(reportsDir, id);
  mkdirSync(dir, { recursive: true });
  const attemptsPath = join(dir, 'attempts.json');
  // The budget belongs to a spec version: a re-approved (changed) spec starts a fresh count.
  const specKey = createHash('sha256').update(specExcerpt).digest('hex').slice(0, 16);
  const stored = existsSync(attemptsPath) ? JSON.parse(readFileSync(attemptsPath, 'utf8')) : null;
  const prev = stored && stored.specKey === specKey ? stored : { attempts: 0 };
  const passed = c.blocking.length === 0;
  const attempts = passed ? prev.attempts : prev.attempts + 1;
  writeFileSync(attemptsPath, JSON.stringify({ attempts, specKey, lastRun: new Date().toISOString(), passed }, null, 2));
  writeFileSync(join(dir, 'report.json'), JSON.stringify({ id, passed, attempts, gatesRun, findings: c.findings }, null, 2));

  const byGate = (g: Gate) => c.findings.filter(f => f.gate === g);
  const counts = gatesRun.map(g => `${g}: ${byGate(g).filter(f => f.blocking).length}`).join(', ');
  const lines: string[] = [];
  lines.push(`# REWRITE REQUEST · ${id} · attempt ${attempts}/${MAX_ATTEMPTS}`);
  lines.push('');
  if (passed) {
    lines.push('Status: PASSED. Nothing to rewrite.');
  } else {
    lines.push(`Status: FAILED (${counts})`);
    if (attempts >= MAX_ATTEMPTS) lines.push('', `> Attempt limit reached. Stop rewriting and hand this to a person: the implementation may be fighting a spec that is wrong.`);
    lines.push('', 'Rules: fix the implementation only. Do not edit the spec, the tokens or the gateway. Re-run `pnpm gate ' + id + '` after each change.');
  }
  for (const g of gatesRun) {
    const fs = byGate(g);
    if (!fs.length) continue;
    lines.push('', `## ${g}`);
    for (const f of fs) {
      lines.push('', `### ${f.check}${f.where ? ` · ${f.where}` : ''}   [${f.blocking ? 'blocking' : 'warning'}]`);
      lines.push(`- ${f.message}`);
      if (f.expected !== undefined) lines.push(`- expected: \`${f.expected}\``);
      if (f.actual !== undefined) lines.push(`- actual: \`${f.actual}\``);
      if (f.fix) lines.push(`- fix: ${f.fix}`);
      if (f.artifact) lines.push(`- artifact: ${relative(root, f.artifact).replace(/\\/g, '/')}`);
    }
  }
  lines.push('', '## Spec excerpt (do not change)', '', '```json', specExcerpt, '```', '');
  writeFileSync(join(dir, 'REWRITE_REQUEST.md'), lines.join('\n'));
  return { passed, attempts, dir };
}
