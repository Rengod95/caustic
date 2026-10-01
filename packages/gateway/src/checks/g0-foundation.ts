// G0 · Foundation integrity. Runs once per gate invocation; a failure stops every other gate.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Collector } from '../report.ts';
import { root, tokensDist } from '../paths.ts';
import { tokenIndex } from '../tokens.ts';

export async function g0(c: Collector) {
  // 1. Contrast gate and build integrity: rebuilding must succeed and leave dist unchanged.
  const before = readFileSync(join(tokensDist, 'caustic.css'), 'utf8') + readFileSync(join(tokensDist, 'theme.css'), 'utf8');
  try {
    execFileSync(process.execPath, [join(root, 'packages/tokens/src/build.mjs')], { stdio: 'pipe' });
  } catch (e: any) {
    c.fail({ gate: 'G0', check: 'contrast', message: 'Token build failed (contrast rule or token error).', actual: String(e.stdout || e.message).slice(0, 2000), fix: 'Fix foundation/tokens; components cannot be gated on a broken foundation.' });
    return;
  }
  const after = readFileSync(join(tokensDist, 'caustic.css'), 'utf8') + readFileSync(join(tokensDist, 'theme.css'), 'utf8');
  if (before !== after) c.warn({ gate: 'G0', check: 'dist-stale', message: 'dist/ was out of date and has been rebuilt from tokens.mjs. Commit the rebuilt files.' });

  const t = await tokenIndex();
  // 2. Naming: every semantic color is group.role in kebab-case and maps into theme.css.
  const theme = readFileSync(join(tokensDist, 'theme.css'), 'utf8');
  for (const name of t.colors) {
    if (!/^[a-z]+\.[a-z0-9-]+$/.test(name)) c.fail({ gate: 'G0', check: 'token-naming', message: `Semantic color "${name}" is not group.role kebab-case.` });
    if (!theme.includes(`--color-${name.replace('.', '-')}:`)) c.fail({ gate: 'G0', check: 'theme-coverage', message: `theme.css does not expose ${name}.` });
  }
  // 3. Semantic layer references primitives only.
  for (const theme of Object.keys(t.raw.themes)) for (const [name, spec] of Object.entries<string>(t.raw.themes[theme])) {
    if (!/^(neutral|accent|mint|amber|coral|iris)\.\d+(\/[\d.]+)?$|^(white|black)\/[\d.]+$/.test(spec)) c.fail({ gate: 'G0', check: 'semantic-refs', message: `${theme}.${name} = "${spec}" does not reference a primitive.` });
  }
  // 4. Concentric studio chain: window − inset = panel; panel − 6 = composer (2xl); 2xl − 6 = lg.
  const s = t.studio, r = t.radius as Record<string, number>;
  const chain: [string, number, number][] = [['window − inset = panel', s['window-radius']! - s['window-inset']!, s['panel-radius']!], ['panel − 6 = radius-2xl', s['panel-radius']! - 6, r['2xl']!], ['radius-2xl − 6 = radius-lg', r['2xl']! - 6, r['lg']!], ['toolbar − 4 = toolbar-item', s['toolbar-radius']! - 4, s['toolbar-item-radius']!]];
  for (const [label, got, want] of chain) if (got !== want) c.fail({ gate: 'G0', check: 'concentric-chain', message: `Concentric rule broken: ${label}.`, expected: String(want), actual: String(got) });
  // 5. FOUNDATION.md metrics stay in sync with tokens.
  const doc = readFileSync(join(root, 'FOUNDATION.md'), 'utf8');
  const fields = Object.values(t.field).join(' · ');
  if (!doc.includes(Object.values(t.field).join(' · ')) && !doc.includes(`${t.field.sm} · ${t.field.md} · ${t.field.lg}`)) c.warn({ gate: 'G0', check: 'doc-sync', message: `FOUNDATION.md does not list field heights ${fields}.` });
}
