// G4 · Visual parity: each spec example rendered by React vs the approved specimen baseline.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import type { ComponentSpec } from '@caustic/spec';
import { Collector } from '../report.ts';
import { baselinesDir, reportsDir } from '../paths.ts';
import { openPage, type Runtime } from '../runtime.ts';

export const DEFAULT_MAX_DIFF = 0.02; // 2% of pixels (calibrated on the pilots: subpixel text placement and frozen spectrum phase); size mismatches stay blocking
const THEMES = ['light', 'dark'] as const;

export async function g4(c: Collector, spec: ComponentSpec, rt: Runtime) {
  for (const ex of spec.examples) {
    const metaPath = join(baselinesDir, spec.id, `${ex.id}.json`);
    if (!existsSync(metaPath)) { c.fail({ gate: 'G4', check: 'baseline', where: ex.id, message: `No baseline for example "${ex.id}".`, fix: `Record it from the React render with \`pnpm baseline:react ${spec.id}\` once the owner approves the look.` }); continue; }
    const meta = JSON.parse(readFileSync(metaPath, 'utf8')) as { width: number };
    for (const theme of THEMES) {
      const basePath = join(baselinesDir, spec.id, `${ex.id}-${theme}.png`);
      if (!existsSync(basePath)) { c.fail({ gate: 'G4', check: 'baseline', where: `${ex.id} ${theme}`, message: 'Baseline image missing.' }); continue; }
      const page = await openPage(rt, { c: spec.id, mode: 'example', ex: ex.id, theme, w: String(meta.width) });
      try {
        const shot = await page.locator('.frame').screenshot({ animations: 'disabled' });
        const a = PNG.sync.read(readFileSync(basePath)), b = PNG.sync.read(shot);
        const w = Math.max(a.width, b.width), h = Math.max(a.height, b.height);
        const pad = (img: PNG) => { if (img.width === w && img.height === h) return img; const o = new PNG({ width: w, height: h }); o.data.fill(0); PNG.bitblt(img, o, 0, 0, img.width, img.height, 0, 0); return o; };
        const A = pad(a), B = pad(b), diff = new PNG({ width: w, height: h });
        const n = pixelmatch(A.data, B.data, diff.data, w, h, { threshold: 0.1, includeAA: false });
        const ratio = n / (w * h);
        const max = ex.maxDiff ?? DEFAULT_MAX_DIFF;
        const out = join(reportsDir, spec.id); mkdirSync(out, { recursive: true });
        if (a.height !== b.height || a.width !== b.width) c.fail({ gate: 'G4', check: 'visual-size', where: `${ex.id} · ${theme}`, message: 'Rendered size differs from the specimen.', expected: `${a.width}×${a.height}`, actual: `${b.width}×${b.height}`, fix: 'Check heights, gaps and paddings against the spec sizes.' });
        if (ratio > max) {
          const artifact = join(out, `${ex.id}-${theme}.diff.png`);
          writeFileSync(artifact, PNG.sync.write(diff)); writeFileSync(join(out, `${ex.id}-${theme}.actual.png`), shot);
          c.fail({ gate: 'G4', check: 'visual', where: `${ex.id} · ${theme}`, message: `${(ratio * 100).toFixed(2)}% of pixels differ from the specimen.`, expected: `≤ ${(max * 100).toFixed(2)}%`, actual: `${(ratio * 100).toFixed(2)}%`, artifact, fix: `Compare ${ex.id}-${theme}.actual.png with baselines/${spec.id}/${ex.id}-${theme}.png.` });
        }
      } finally { await page.close(); }
    }
  }
}
