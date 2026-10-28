// `caustic check <files…>`: static analysis of consumer code against the Caustic tokens and the component catalog.
// Writes its own output (human on stderr, --json on stdout, --github annotations on stdout) and returns the exit code:
// 0 no errors, 1 errors found, 2 the input, the config or the theme could not be read.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import type { Catalog } from '@caustic/catalog';
import { analyzeFile, indexCatalog, type RawFinding } from './analyze.ts';
import { docsFor, ruleById, ruleIds, rules, type RuleId, type Severity } from './rules.ts';
import { findStyles, loadTheme, type Theme } from './theme.ts';

export type CheckOptions = { rules?: string[]; json?: boolean; github?: boolean; advisory?: boolean; listRules?: boolean; cwd: string };

export type Finding = { rule: RuleId; severity: Severity; file: string; line: number; column: number; snippet: string; message: string; fix: string; docs: string };
export type CheckSummary = { files: number; errors: number; warnings: number; advisory: number; suppressed: number };

export { rules } from './rules.ts';

const EXTENSIONS = /\.(tsx|jsx|ts|js|mjs|cjs|mts|cts)$/;
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.git', '.next', 'out', 'coverage', '.turbo', '.vercel']);

export class InputError extends Error {}

export async function check(files: string[], opts: CheckOptions, catalog: Catalog): Promise<number> {
  if (opts.listRules) return listRules(opts.json);
  try {
    const result = await run(files, opts, catalog);
    emit(result.findings, result.summary, opts);
    return result.summary.errors > 0 ? 1 : 0;
  } catch (e) {
    if (e instanceof InputError) { console.error(`caustic check: ${e.message}`); return 2; }
    throw e;
  }
}

/** The analysis without output, for tests and other callers. Throws InputError for exit-2 conditions. */
export async function run(files: string[], opts: CheckOptions, catalog: Catalog): Promise<{ findings: Finding[]; summary: CheckSummary }> {
  if (!catalog || typeof catalog.components !== 'object' || !Object.keys(catalog.components).length) throw new InputError('the catalog has no components (run `pnpm catalog`).');
  const selected = selectRules(opts.rules);
  const config = readConfig(opts.cwd);
  for (const r of config.ignoreRules) selected.delete(r as RuleId);
  if (!files.length) throw new InputError('no files given. Usage: caustic check <files or directories…>');

  const paths = collect(files, opts.cwd).filter(f => !config.ignore(relPath(opts.cwd, f)));
  let theme: Theme | undefined;
  if (selected.has('token-unknown-class')) {
    const styles = findStyles(opts.cwd);
    if (!styles) throw new InputError('cannot find @caustic/react/styles.css to compile classes against (install @caustic/react, or pass --rules without token-unknown-class).');
    try { theme = await loadTheme(styles); } catch (e) { throw new InputError(`cannot compile the Caustic theme from ${styles}: ${(e as Error).message}`); }
  }

  const idx = indexCatalog(catalog);
  const findings: Finding[] = [];
  let suppressed = 0;
  for (const file of paths) {
    let text: string;
    try { text = readFileSync(file, 'utf8'); } catch (e) { throw new InputError(`cannot read ${file}: ${(e as Error).message}`); }
    const rel = relPath(opts.cwd, file);
    const lines = text.split('\n');
    for (const f of analyzeFile(file, text, idx, theme, selected)) {
      const s = suppression(lines, f);
      if (s === 'ok') { suppressed++; continue; }
      const extra = s === 'no-reason' ? ' (the caustic-disable-next-line above has no reason, so it does not apply: add ": why")' : '';
      findings.push({ ...f, message: f.message + extra, file: rel, docs: docsFor(f.rule) });
    }
  }
  findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.column - b.column);
  const count = (s: Severity) => findings.filter(f => f.severity === s).length;
  const summary: CheckSummary = { files: paths.length, errors: count('error'), warnings: count('warning'), advisory: count('advisory'), suppressed };
  return { findings: opts.advisory ? findings : findings.filter(f => f.severity !== 'advisory'), summary };
}

function selectRules(list: string[] | undefined): Set<RuleId> {
  const ids = (list ?? []).flatMap(r => r.split(',')).map(r => r.trim()).filter(Boolean);
  if (!ids.length) return new Set(ruleIds);
  const unknown = ids.filter(r => !ruleById.has(r as RuleId));
  if (unknown.length) throw new InputError(`unknown rule ${unknown.join(', ')}. Run \`caustic check --list-rules\`.`);
  return new Set(ids as RuleId[]);
}

const relPath = (cwd: string, f: string) => relative(cwd, f).replace(/\\/g, '/') || f;

function collect(inputs: string[], cwd: string): string[] {
  const out = new Set<string>();
  const walk = (dir: string) => {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
      if (ent.isDirectory()) { if (!SKIP_DIRS.has(ent.name) && !ent.name.startsWith('.')) walk(join(dir, ent.name)); }
      else if (EXTENSIONS.test(ent.name) && !/\.d\.[mc]?ts$/.test(ent.name)) out.add(join(dir, ent.name));
    }
  };
  for (const input of inputs) {
    const p = resolve(cwd, input);
    if (!existsSync(p)) throw new InputError(`${input} does not exist.`);
    if (statSync(p).isDirectory()) walk(p);
    else out.add(p);
  }
  return [...out].sort();
}

// ---- .caustic/config.json ----

function readConfig(cwd: string): { ignoreRules: string[]; ignore: (rel: string) => boolean } {
  const file = join(cwd, '.caustic', 'config.json');
  if (!existsSync(file)) return { ignoreRules: [], ignore: () => false };
  let cfg: { ignoreRules?: unknown; ignoreFiles?: unknown };
  try { cfg = JSON.parse(readFileSync(file, 'utf8')); } catch (e) { throw new InputError(`.caustic/config.json is not valid JSON: ${(e as Error).message}`); }
  const strings = (v: unknown, key: string): string[] => {
    if (v === undefined) return [];
    if (!Array.isArray(v) || v.some(x => typeof x !== 'string')) throw new InputError(`.caustic/config.json: ${key} must be an array of strings.`);
    return v as string[];
  };
  const ignoreRules = strings(cfg.ignoreRules, 'ignoreRules');
  const unknown = ignoreRules.filter(r => !ruleById.has(r as RuleId));
  if (unknown.length) throw new InputError(`.caustic/config.json: unknown rule ${unknown.join(', ')}.`);
  const globs = strings(cfg.ignoreFiles, 'ignoreFiles').map(globToRegExp);
  return { ignoreRules, ignore: rel => globs.some(g => g.test(rel)) };
}

/** Minimal glob: ** any path, * any name part, ? one character; a pattern without a slash matches a name anywhere. */
export function globToRegExp(glob: string): RegExp {
  let g = glob.replace(/^\.\//, '');
  if (!g.includes('/')) g = '**/' + g;
  let re = '';
  for (let i = 0; i < g.length; i++) {
    const c = g[i]!;
    if (c === '*' && g[i + 1] === '*') {
      const slash = g[i + 2] === '/';
      re += slash ? '(?:.*/)?' : '.*';
      i += slash ? 2 : 1;
    } else if (c === '*') re += '[^/]*';
    else if (c === '?') re += '[^/]';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}(?:/.*)?$`);
}

// ---- suppression: // caustic-disable-next-line rule-a, rule-b: reason ----

const DISABLE = /caustic-disable-next-line\s+([a-z0-9-]+(?:\s*,\s*[a-z0-9-]+)*)\s*(?::\s*(.*?))?\s*(?:\*\/\s*\}?)?\s*$/;

function suppression(lines: string[], f: RawFinding): 'ok' | 'no-reason' | 'none' {
  // The comment sits on the line above the finding; other comment lines in between are skipped.
  for (let i = f.line - 2; i >= 0 && i >= f.line - 4; i--) {
    const line = lines[i]!;
    const m = line.match(DISABLE);
    if (m) {
      const listed = m[1]!.split(',').map(s => s.trim());
      if (!listed.includes(f.rule)) continue;
      return m[2] && m[2].trim() ? 'ok' : 'no-reason';
    }
    if (line.trim() && !/^\s*(\/\/|\{?\s*\/\*|\*)/.test(line)) break;
  }
  return 'none';
}

// ---- output ----

function emit(findings: Finding[], summary: CheckSummary, opts: CheckOptions) {
  if (opts.json) {
    process.stdout.write(JSON.stringify({ findings, summary }, null, 2) + '\n');
    return;
  }
  if (opts.github) {
    const level = { error: 'error', warning: 'warning', advisory: 'notice' } as const;
    const esc = (s: string) => s.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
    for (const f of findings) process.stdout.write(`::${level[f.severity]} file=${f.file},line=${f.line},col=${f.column}::${esc(`[${f.rule}] ${f.message} ${f.fix}`)}\n`);
  }
  const out: string[] = [];
  let file = '';
  for (const f of findings) {
    if (f.file !== file) { if (file) out.push(''); out.push(f.file); file = f.file; }
    const tag = f.severity === 'error' ? '' : ` (${f.severity})`;
    out.push(`  line ${f.line}: [${f.rule}]${tag} ${f.snippet}`);
    out.push(`    ${f.message}`);
    out.push(`    → ${f.fix}`);
  }
  if (findings.length) out.push('');
  const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
  const adv = opts.advisory ? `, ${summary.advisory} advisory` : summary.advisory ? `, ${summary.advisory} advisory hidden (--advisory)` : '';
  const sup = summary.suppressed ? `, ${summary.suppressed} suppressed` : '';
  out.push(`${plural(summary.errors, 'error')}, ${plural(summary.warnings, 'warning')}${adv}${sup} in ${plural(summary.files, 'file')}`);
  process.stderr.write(out.join('\n') + '\n');
}

function listRules(json: boolean | undefined): number {
  if (json) {
    process.stdout.write(JSON.stringify({ rules: rules.map(r => ({ ...r, docs: docsFor(r.id) })) }, null, 2) + '\n');
    return 0;
  }
  const w = Math.max(...rules.map(r => r.id.length));
  process.stdout.write(rules.map(r => `${r.id.padEnd(w)}  ${r.severity.padEnd(8)}  ${r.description}`).join('\n') + '\n');
  return 0;
}
