// Gateway self-test: proves the gate rejects known-bad implementations.
// Each mutation edits the Button source (or spec) temporarily, runs the gate, and asserts that
// a blocking finding of the expected check appears. Files are always restored.
// Colour language rules CL1–CL7 are pure functions; each has a passing and a failing synthetic snippet,
// checked first and without a browser.
// Usage: pnpm gate:selftest            colour rule cases, then the Button mutations (these render: G3–G5 start a browser)
//        pnpm gate:selftest --rules    colour rule cases only (no browser, no gate run)
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { root } from './paths.ts';
import { checkComponent, slotContrast, type ColorConfig, type RuleId, type Source } from './checks/color-language.ts';

// ── Colour language rule cases ──
const cfg: ColorConfig = { migrated: [], slotOnlyBlocking: [], contrastBlocking: false, literalColorAllow: { colourMath: ['color-picker'], contentFixtures: ['theme-gallery'] }, designOverContrast: {}, designAllow: {} };
const known = new Set(['danger-soft', 'danger-solid', 'danger-text', 'danger-on', 'ink-solid', 'ink-hover', 'ink-on', 'fill-hover', 'fill-pressed', 'fill-selected', 'accent-soft', 'accent-fill', 'surface-base', 'text-primary', 'text-disabled', 'focus-ring', 'border-default']);
const v = (body: string): Source[] => [{ rel: 'x/x.variants.ts', text: `import { cva } from 'class-variance-authority';\n${body}\n`, fixture: false }];
const fx = (body: string): Source[] => [{ rel: 'x/x.fixture.tsx', text: body, fixture: true }];
interface RuleCase { rule: RuleId; name: string; id?: string; src?: Source[]; css?: string; hit: boolean }
const css = (text: string, on: string, soft: string, graphic: string) => `:root {\n  --cs-color-surface-base: oklch(1 0 0);\n  --cs-danger-text: ${text};\n  --cs-danger-soft: oklch(0.935 0.034 25);\n  --cs-danger-soft-hover: ${soft};\n  --cs-danger-solid: oklch(0.54 0.13 25);\n  --cs-danger-on: ${on};\n  --cs-danger-graphic: ${graphic};\n}\n`;
const ruleCases: RuleCase[] = [
  { rule: 'CL1', hit: false, name: 'slot tokens only', src: v("export const x = cva('bg-danger-soft text-danger-text hover:bg-danger-soft-hover shadow-[inset_0_0_0_1px_var(--cs-danger-border)]');") },
  { rule: 'CL1', hit: true, name: 'legacy alias fill-pressed', src: v("export const x = cva('bg-transparent hover:bg-fill-pressed');") },
  { rule: 'CL1', hit: true, name: 'ramp step read directly', src: v("export const x = cva('shadow-[inset_0_0_0_1px_var(--cs-danger-light-7)]');") },
  { rule: 'CL2', hit: false, name: 'disabled as colour', src: v("export const x = cva('disabled:bg-disabled-fill disabled:text-disabled-text data-[disabled]:pointer-events-none');") },
  { rule: 'CL2', hit: true, name: 'disabled:opacity-42', src: v("export const x = cva('disabled:pointer-events-none disabled:opacity-42');") },
  { rule: 'CL2', hit: true, name: 'cn(disabled && opacity)', src: [{ rel: 'x/x.tsx', text: "import { cn } from '../../lib/cn.ts';\nexport const X = ({ disabled }: { disabled?: boolean }) => <div className={cn('flex', disabled && 'opacity-42')} />;\n", fixture: false }] },
  { rule: 'CL3', hit: false, name: 'soft hover stays soft', src: v("export const x = cva('', { variants: { tone: { danger: 'bg-danger-soft hover:bg-danger-soft-hover active:bg-danger-soft-pressed', ghost: 'bg-transparent hover:bg-neutral-hover' } } });") },
  { rule: 'CL3', hit: true, name: 'danger soft -> solid on hover', src: v("export const x = cva('', { variants: { tone: { danger: 'bg-danger-soft text-danger-text hover:bg-danger-solid hover:text-danger-on' } } });") },
  { rule: 'CL3', hit: true, name: 'pressed chip turns ink', src: v("export const x = cva('aria-pressed:bg-ink-solid', { variants: { tone: { danger: 'bg-danger-soft text-danger-text' } } });") },
  { rule: 'CL4', hit: false, name: 'selection edge + focus on focus only', src: v("export const x = cva('aria-checked:shadow-[inset_0_0_0_1px_var(--cs-selection-edge)] focus-visible:shadow-focus aria-checked:focus-visible:shadow-focus');") },
  { rule: 'CL4', hit: true, name: 'selected drawn with focus-field', src: v("export const x = cva('data-[state=checked]:bg-accent-soft data-[state=checked]:shadow-[var(--cs-focus-field)]');") },
  { rule: 'CL5', hit: false, name: 'invalid edge + focus ring together', src: v("export const x = cva('focus-within:shadow-[var(--cs-focus-field)] data-[invalid]:shadow-[inset_0_0_0_1px_var(--cs-danger-border-strong)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1px_var(--cs-danger-border-strong),var(--cs-focus)]');") },
  { rule: 'CL5', hit: true, name: 'invalid erases focus', src: v("export const x = cva('focus-within:shadow-[var(--cs-focus-field)] data-[invalid]:shadow-[inset_0_0_0_1px_var(--cs-danger-border-strong)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1px_var(--cs-danger-border-strong)]');") },
  { rule: 'CL5', hit: true, name: 'invalid and focus fight over box-shadow', src: v("export const x = cva('focus-visible:shadow-[var(--cs-focus-field)] data-[invalid]:shadow-[inset_0_0_0_1px_var(--cs-danger-border-strong)]');") },
  { rule: 'CL5', hit: true, name: 'invalid edge is not danger border-strong', src: v("export const x = cva('data-[invalid]:border-danger-solid');") },
  { rule: 'CL6', hit: false, name: 'colour math on the allowlist', id: 'color-picker', src: [{ rel: 'x/x.tsx', text: 'export const ramp = (h: number) => `hsl(${h} 100% 50%)`;\n', fixture: false }] },
  { rule: 'CL6', hit: false, name: 'content fixture on the allowlist', id: 'theme-gallery', src: fx("export const themes = ['#f7f8fa', '#0e7f93'];\n") },
  { rule: 'CL6', hit: true, name: 'template literal colour in code', src: [{ rel: 'x/x.tsx', text: 'export const tint = (l: number) => `oklch(${l} 0 0)`;\n', fixture: false }] },
  { rule: 'CL6', hit: true, name: 'literal stage colour in a fixture', src: fx('export default <div className="bg-[oklch(0.2_0.01_260/0.1)] p-4" />;\n') },
  { rule: 'CL7', hit: false, name: 'slot pairs meet their floors', css: css('oklch(0.45 0.13 25)', 'oklch(0.995 0 0)', 'oklch(0.905 0.051 25)', 'oklch(0.618 0.13 25)') },
  { rule: 'CL7', hit: true, name: 'text on soft-hover below 4.5', css: css('oklch(0.62 0.13 25)', 'oklch(0.995 0 0)', 'oklch(0.905 0.051 25)', 'oklch(0.618 0.13 25)') },
];
let ruleFailed = 0;
for (const k of ruleCases) {
  const hits = k.css !== undefined ? slotContrast(k.css).hits.filter(h => h.expected !== undefined) : checkComponent(k.id ?? 'x', k.src ?? [], cfg, known);
  const mine = hits.filter(h => h.rule === k.rule);
  const ok = k.hit ? mine.length > 0 : mine.length === 0;
  if (!ok) ruleFailed++;
  console.log(`${ok ? (k.hit ? 'CATCH' : 'PASS ') : 'MISS '} ${k.rule} ${k.name}${ok ? '' : `: expected ${k.hit ? 'a hit' : 'no hit'}, got ${mine.map(h => `${h.where} ${h.message}`).join(' | ') || 'nothing'}`}`);
}
console.log(`\n${ruleCases.length - ruleFailed}/${ruleCases.length} colour rule cases correct\n`);
if (process.argv.includes('--rules')) process.exit(ruleFailed ? 1 : 0);

const comp = join(root, 'packages/react/src/components/button');
const V = join(comp, 'button.variants.ts'), C = join(comp, 'button.tsx'), I = join(comp, 'index.ts'), S = join(root, 'packages/spec/src/specs/button.spec.ts');

interface Mutation { name: string; file: string; from: string; to: string; expect: string[]; skip?: string }
const mutations: Mutation[] = [
  { name: 'literal color', file: V, from: 'bg-ink-solid text-ink-on', to: 'bg-[#111318] text-ink-on', expect: ['G2:arbitrary-value', 'G3:tokens'], skip: 'G4' },
  { name: 'non-token color', file: V, from: 'bg-danger-soft text-danger-text', to: 'bg-red-500 text-danger-text', expect: ['G2:non-token-class'], skip: 'G4' },
  { name: 'wrong hover token', file: V, from: 'hover:bg-ink-solid-hover', to: 'hover:bg-ink-solid', expect: ['G3:tokens'], skip: 'G4' },
  { name: 'off-scale padding', file: V, from: 'h-control-md gap-1.5 px-3', to: 'h-control-md gap-1.5 px-9', expect: ['G2:space-scale', 'G3:tokens'] }, // 36px: between scale steps 8 and 10
  { name: 'wrong radius', file: V, from: 'h-control-md gap-1.5 px-3 text-ui-strong rounded-md', to: 'h-control-md gap-1.5 px-3 text-ui-strong rounded-xl', expect: ['G3:tokens'], skip: 'G4' },
  { name: 'missing variant value', file: V, from: "        ghost: 'bg-transparent", to: "        quiet: 'bg-transparent", expect: ['G2:variants'], skip: 'G4' },
  { name: 'spectrum outside agent', file: V, from: "ink: 'bg-ink-solid", to: "ink: 'agent-rim bg-ink-solid", expect: ['G5:P2 spectrum'], skip: 'G4' },
  { name: 'gradient on a button', file: V, from: "secondary: 'bg-control-raised", to: "secondary: 'bg-linear-to-b bg-control-raised", expect: ['G5:P3 flat'], skip: 'G4' },
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
  // A killed run (memory cap, Ctrl-C) must not leave the mutation in the component.
  const restore = () => { writeFileSync(m.file, original); process.exit(130); };
  process.once('SIGTERM', restore); process.once('SIGINT', restore);
  try {
    try {
      execFileSync(process.execPath, ['--import', 'tsx', join(root, 'packages/gateway/src/cli.ts'), 'button', ...(m.skip ? [`--skip=${m.skip}`] : [])], { env: { ...process.env, CAUSTIC_SELFTEST: '1', CAUSTIC_REPORTS_DIR: reports }, stdio: 'pipe', timeout: 600000 });
    } catch { /* non-zero exit is the expected outcome */ }
    const report = JSON.parse(readFileSync(join(reports, 'button', 'report.json'), 'utf8'));
    const got = new Set<string>(report.findings.filter((f: any) => f.blocking).map((f: any) => `${f.gate}:${f.check}`));
    const missing = m.expect.filter(e => !got.has(e));
    if (missing.length) { failed++; console.log(`MISS ${m.name}: gate did not report ${missing.join(', ')} (got ${[...got].join(', ') || 'nothing'})`); }
    else console.log(`CATCH ${m.name}: ${m.expect.join(', ')}`);
  } finally { writeFileSync(m.file, original); process.off('SIGTERM', restore); process.off('SIGINT', restore); }
}
console.log(`\n${mutations.length - failed}/${mutations.length} mutations caught`);
process.exit(failed || ruleFailed ? 1 : 0);
