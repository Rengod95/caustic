// Captures visual baselines from the approved HTML specimens (../caustic-preview/docs).
// The specimen pages are served locally with the monorepo's current token CSS swapped in,
// so a token change is reflected in both the baseline and the React render.
// Usage: pnpm baseline [id…]          (no ids = every spec with examples)
import { createServer, type Server } from 'node:http';
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';
import { ComponentSpec } from '@caustic/spec';
import { readSpec, specIds } from '@caustic/spec/node';
import { baselinesDir, specimenRoot, tokensDist } from './paths.ts';

const TYPES: Record<string, string> = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };

export function serveSpecimens(): Promise<{ server: Server; url: string }> {
  return new Promise(resolve => {
    const server = createServer((req, res) => {
      const path = decodeURIComponent((req.url ?? '/').split('?')[0]!);
      let file = path === '/dist/caustic.css' ? join(tokensDist, 'caustic.css') : normalize(join(specimenRoot, path));
      if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
      if (!existsSync(file)) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
      createReadStream(file).pipe(res);
    }).listen(0, '127.0.0.1', () => {
      const a = server.address(); resolve({ server, url: `http://127.0.0.1:${typeof a === 'object' && a ? a.port : 0}` });
    });
  });
}

export const CAPTURE_CSS = `
.ambient { display: none !important; }
.example { background: var(--cs-color-bg-app) !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; box-shadow: none !important; }
.doc-preview { background: var(--cs-color-bg-app) !important; background-image: none !important; }
.doc-preview > .ex-meta { display: none !important; }
*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
`;

async function main() {
  const ids = process.argv.slice(2);
  // Parse only the requested specs so one invalid draft does not block other baselines.
  const targets: ComponentSpec[] = [];
  for (const id of ids.length ? ids : specIds()) { const input = await readSpec(id); if (input) targets.push(ComponentSpec.parse(input)); }
  targets.splice(0, targets.length, ...targets.filter(s => s.examples.length));
  const { server, url } = await serveSpecimens();
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    for (const spec of targets) {
      const dir = join(baselinesDir, spec.id); mkdirSync(dir, { recursive: true });
      for (const ex of spec.examples) {
        const [pageName, heading] = ex.doc.split('#');
        let width = 0;
        for (const theme of ['light', 'dark']) {
          const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
          await page.addInitScript(t => { try { localStorage.setItem('caustic-theme', t); } catch {} }, theme);
          await page.goto(`${url}/docs/${pageName}.html`, { waitUntil: 'networkidle' });
          await page.evaluate(() => document.fonts.ready);
          await page.addStyleTag({ content: CAPTURE_CSS });
          await page.waitForTimeout(150);
          const handle = await page.evaluateHandle(h => {
            const head = document.getElementById(h!); const ex = head?.nextElementSibling;
            return ex?.querySelector('.doc-preview') ?? null;
          }, heading);
          const el = handle.asElement();
          if (!el) { console.error(`✗ ${spec.id}/${ex.id}: #${heading} preview not found`); await page.close(); continue; }
          width = Math.round((await el.boundingBox())!.width);
          writeFileSync(join(dir, `${ex.id}-${theme}.png`), await el.screenshot({ animations: 'disabled' }));
          await page.close();
        }
        writeFileSync(join(dir, `${ex.id}.json`), JSON.stringify({ doc: ex.doc, width, source: 'specimen', capturedAt: new Date().toISOString() }, null, 2));
        console.log(`✓ ${spec.id}/${ex.id} (${width}px)`);
      }
    }
  } finally { await browser.close(); server.close(); }
}

if (process.argv[1]?.endsWith('baseline.ts')) main().catch(e => { console.error(e); process.exit(1); });
