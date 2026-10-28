// `caustic check` rules against the fixtures: one bad file per rule plus a clean file that must stay silent.
//   pnpm -s test:check     (tsx --test packages/cli/tests/check/check.test.ts)
// Uses the generated packages/catalog/dist/catalog.json (run `pnpm catalog` first).
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { check, rules, run, type Finding } from '../../src/check/index.ts';
import { globToRegExp } from '../../src/check/index.ts';
import { testCatalog } from './cli.ts';

const here = dirname(fileURLToPath(import.meta.url));
const fixtures = join(here, 'fixtures');
const catalog = testCatalog();

async function findings(file: string, extra: { rules?: string[]; advisory?: boolean } = {}): Promise<Finding[]> {
  const r = await run([join(fixtures, file)], { cwd: fixtures, advisory: true, ...extra }, catalog);
  return r.findings;
}
const pick = (fs: Finding[], rule: string) => fs.filter(f => f.rule === rule).map(f => `${f.line}:${f.snippet}`);

describe('caustic check', () => {
  it('reports nothing on a clean file', async () => {
    const fs = await findings('clean.tsx');
    assert.deepEqual(fs.map(f => `${f.rule} ${f.line} ${f.snippet}`), []);
  });

  it('token-unknown-class: utilities the theme does not produce, not plain class names', async () => {
    const fs = await findings('token-unknown-class.tsx');
    assert.deepEqual(pick(fs, 'token-unknown-class'), [
      '5:bg-red-500', '5:text-primary', '6:text-sm', '6:leading-tight', '7:md:p-4', '8:bg-surfase-base',
    ]);
    const tp = fs.find(f => f.snippet === 'text-primary')!;
    assert.match(tp.fix, /text-text-primary/);
    assert.match(fs.find(f => f.snippet === 'bg-surfase-base')!.fix, /bg-surface-base/);
    assert.match(fs.find(f => f.snippet === 'md:p-4')!.message, /"md:" variant/);
    assert.equal(tp.docs, 'skills/caustic/reference/check.md#token-unknown-class');
  });

  it('token-literal: colours are errors; lengths are warnings except on type, radius and shadow', async () => {
    const fs = await findings('token-literal.tsx');
    assert.deepEqual(fs.filter(f => f.rule === 'token-literal').map(f => `${f.line}:${f.severity}:${f.snippet}`), [
      '5:error:bg-[#ff0000]', '5:warning:w-[37px]', '5:error:shadow-[0_1px_2px_rgba(0,0,0,0.2)]',
      "6:error:color: 'red'", '6:warning:width: 12', "6:warning:padding: '1rem 0'",
      '8:error:bg-[linear-gradient(to_right,white,var(--cs-color-accent-solid))]',
      '9:error:text-[16px]', '9:error:rounded-[28px]', '9:warning:max-w-[42rem]', '9:error:fontSize: 13',
    ]);
  });

  it('token-dark-variant', async () => {
    const fs = await findings('token-dark-variant.tsx');
    assert.deepEqual(pick(fs, 'token-dark-variant'), ['4:dark:bg-surface-raised', '4:hover:dark:text-text-primary']);
    assert.equal(fs.length, 2);
  });

  it('component-unknown: named imports the catalog does not export', async () => {
    const fs = await findings('component-unknown.tsx');
    assert.deepEqual(pick(fs, 'component-unknown'), ['1:Buton', '1:FancyCard']);
    assert.match(fs[0]!.fix, /Button/);
  });

  it('prop-unknown: through aliases and Compound.Part, HTML and pass-through attributes allowed', async () => {
    const fs = await findings('prop-unknown.tsx');
    assert.deepEqual(pick(fs, 'prop-unknown'), ['5:colour="red"', '6:bogus="1"', '8:tonne="accent"']);
    assert.match(fs.find(f => f.snippet.startsWith('tonne'))!.fix, /Did you mean tone/);
  });

  it('prop-invalid-value: string literals (and both branches of a conditional) outside the values', async () => {
    const fs = await findings('prop-invalid-value.tsx');
    assert.deepEqual(fs.filter(f => f.rule === 'prop-invalid-value').map(f => f.message.split(' is ')[0]), ['size="huge"', 'variant="solidd"', 'variant="loud"']);
    assert.match(fs.find(f => f.message.startsWith('variant="solidd"'))!.fix, /variant="solid"/);
  });

  it('prop-deprecated: advisory, with the current name from the catalog', async () => {
    const fs = await findings('prop-deprecated.tsx');
    assert.deepEqual(fs.map(f => `${f.rule}:${f.severity}:${f.line}`), ['prop-deprecated:advisory:4']);
    assert.match(fs[0]!.fix, /^Use variant/);
    assert.deepEqual(await findings('prop-deprecated.tsx', { advisory: false }), []);
  });

  it('prop-missing-label: warning, labelled through props, text, <Field> and <label>', async () => {
    const fs = await findings('prop-missing-label.tsx');
    assert.deepEqual(pick(fs, 'prop-missing-label'), ['11:<IconButton>', '12:<Switch />']);
    assert.ok(fs.every(f => f.severity === 'warning'));
  });

  it('compose-outside-parent: error in a complete tree, advisory when the parent may be elsewhere', async () => {
    const fs = await findings('compose-outside-parent.tsx');
    assert.deepEqual(fs.filter(f => f.rule === 'compose-outside-parent').map(f => `${f.line}:${f.severity}`), ['10:error', '15:error', '22:advisory']);
    const hidden = await findings('compose-outside-parent.tsx', { advisory: false });
    assert.equal(hidden.length, 2);
  });

  it('compose-reinvented: raw controls in a file that uses Caustic, with real components to use', async () => {
    const fs = await findings('compose-reinvented.tsx');
    assert.deepEqual(fs.map(f => f.line), [6, 7, 8, 10, 11]);
    assert.ok(fs.every(f => f.rule === 'compose-reinvented' && f.severity === 'warning'));
    assert.match(fs[0]!.fix, /Button .*caustic show button/);
    assert.match(fs[4]!.fix, /Tabs/);
    assert.deepEqual(await findings('no-caustic.tsx'), []);
  });

  it('suppression needs a reason and the matching rule', async () => {
    const r = await run([join(fixtures, 'suppression.tsx')], { cwd: fixtures }, catalog);
    assert.deepEqual(r.findings.map(f => `${f.line}:${f.snippet}`), ['9:w-[391px]', '11:w-[392px]']);
    assert.match(r.findings[0]!.message, /no reason/);
    assert.equal(r.summary.suppressed, 1);
  });

  it('--rules runs a subset; an unknown rule is an input error', async () => {
    const fs = await findings('token-literal.tsx', { rules: ['token-dark-variant'] });
    assert.equal(fs.length, 0);
    await assert.rejects(run([join(fixtures, 'clean.tsx')], { cwd: fixtures, rules: ['nope'] }, catalog), /unknown rule nope/);
  });

  it('.caustic/config.json ignoreRules and ignoreFiles', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'caustic-check-'));
    try {
      mkdirSync(join(dir, '.caustic'));
      mkdirSync(join(dir, 'src/legacy'), { recursive: true });
      writeFileSync(join(dir, 'src/a.tsx'), `export const A = () => <div className="dark:bg-surface-base w-[37px]" />;\n`);
      writeFileSync(join(dir, 'src/legacy/b.tsx'), `export const B = () => <div className="w-[37px]" />;\n`);
      writeFileSync(join(dir, '.caustic/config.json'), JSON.stringify({ ignoreRules: ['token-dark-variant'], ignoreFiles: ['src/legacy/**'] }));
      const r = await run(['src'], { cwd: dir }, catalog);
      assert.deepEqual(r.findings.map(f => `${f.file}:${f.rule}`), ['src/a.tsx:token-literal']);
      writeFileSync(join(dir, '.caustic/config.json'), '{ nope');
      await assert.rejects(run(['src'], { cwd: dir }, catalog), /not valid JSON/);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it('every rule has its section in skills/caustic/reference/check.md', () => {
    const doc = readFileSync(join(here, '../../../../skills/caustic/reference/check.md'), 'utf8');
    const marked = [...doc.matchAll(/<!-- rule:([a-z-]+) -->/g)].map(m => m[1]);
    assert.deepEqual([...marked].sort(), rules.map(r => r.id).sort());
    for (const r of rules) assert.ok(doc.includes(`<a id="${r.id}"></a>`), r.id);
  });

  it('globs', () => {
    assert.ok(globToRegExp('src/legacy/**').test('src/legacy/x/y.tsx'));
    assert.ok(globToRegExp('*.stories.tsx').test('src/a/b.stories.tsx'));
    assert.ok(!globToRegExp('src/*.tsx').test('src/a/b.tsx'));
  });

  it('exit codes and output streams', async () => {
    const cli = join(here, 'cli.ts');
    const exec = (...args: string[]) => spawnSync(process.execPath, ['--import', 'tsx', cli, ...args], { cwd: fixtures, encoding: 'utf8' });
    const bad = exec('token-literal.tsx');
    assert.equal(bad.status, 1);
    assert.equal(bad.stdout, '');
    assert.match(bad.stderr, /^token-literal\.tsx\n {2}line 5: \[token-literal\] bg-\[#ff0000\]\n/);
    assert.match(bad.stderr, /→ /);
    assert.match(bad.stderr, /\d+ errors, \d+ warnings in 1 file\n$/);
    const warnOnly = exec('compose-reinvented.tsx');
    assert.equal(warnOnly.status, 0);
    const json = exec('--json', 'token-dark-variant.tsx');
    const parsed = JSON.parse(json.stdout);
    assert.deepEqual(Object.keys(parsed.findings[0]).sort(), ['column', 'docs', 'file', 'fix', 'line', 'message', 'rule', 'severity', 'snippet']);
    assert.equal(parsed.summary.errors, 2);
    const gh = exec('--github', 'token-dark-variant.tsx');
    assert.match(gh.stdout, /^::error file=token-dark-variant\.tsx,line=4,col=\d+::\[token-dark-variant\] /m);
    assert.equal(exec('missing.tsx').status, 2);
    const list = exec('--list-rules', '--json');
    assert.equal(list.status, 0);
    assert.equal(JSON.parse(list.stdout).rules.length, 10);
  });

  it('check() returns the exit code', async () => {
    const write = process.stderr.write;
    process.stderr.write = () => true;
    try {
      assert.equal(await check([join(fixtures, 'clean.tsx')], { cwd: fixtures }, catalog), 0);
      assert.equal(await check([join(fixtures, 'token-literal.tsx')], { cwd: fixtures }, catalog), 1);
      assert.equal(await check([], { cwd: fixtures }, catalog), 2);
    } finally { process.stderr.write = write; }
  });
});
