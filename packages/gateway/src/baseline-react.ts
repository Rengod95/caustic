// Re-records visual baselines from the React implementation instead of the HTML specimens.
// Run it once a component matches its specimen (the full gate passes); from then on the React
// render is the regression reference and the specimen page is history.
// Usage: pnpm baseline:react <id…> | --all
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ComponentSpec } from '@caustic/spec';
import { readSpec, specIds } from '@caustic/spec/node';
import { baselinesDir } from './paths.ts';
import { openPage, startRuntime } from './runtime.ts';

const args = process.argv.slice(2);
const ids = args.includes('--all') ? specIds() : args.filter(a => !a.startsWith('--'));
if (!ids.length) { console.error('usage: pnpm baseline:react <id…> | --all'); process.exit(2); }

const rt = await startRuntime();
let written = 0;
try {
  for (const id of ids) {
    const input = await readSpec(id); if (!input) { console.error(`✗ ${id}: no spec`); continue; }
    const spec = ComponentSpec.parse(input);
    const dir = join(baselinesDir, id); mkdirSync(dir, { recursive: true });
    for (const ex of spec.examples) {
      const metaPath = join(dir, `${ex.id}.json`);
      // Keep the specimen's recorded width so the React capture is framed identically.
      const prev = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, 'utf8')) : {};
      const width: number = prev.width ?? 848;
      for (const theme of ['light', 'dark'] as const) {
        const page = await openPage(rt, { c: id, mode: 'example', ex: ex.id, theme, w: String(width) });
        try { writeFileSync(join(dir, `${ex.id}-${theme}.png`), await page.locator('.frame').screenshot({ animations: 'disabled' })); }
        finally { await page.close(); }
      }
      writeFileSync(metaPath, JSON.stringify({ doc: ex.doc, width, source: 'react', capturedAt: new Date().toISOString() }, null, 2) + '\n');
      written++;
      console.log(`✓ ${id}/${ex.id} (${width}px, react)`);
    }
  }
} finally { await rt.close(); }
console.log(`${written} example baselines recorded from React`);
