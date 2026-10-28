// Screenshots of the docs app with one browser for the whole list.
// Run it only under the machine's browser slot, so one Chromium runs at a time and stays inside the memory cap:
//   scripts/guard.sh browser -- node scripts/shoot.mjs shots.json
// shots.json: [{ "url": "http://127.0.0.1:5183/#/c/menu", "out": "/abs/menu-dark.png",
//                "theme": "dark", "width": 1440, "height": 900, "fullPage": true,
//                "storage": { "key": "value" }, "waitFor": "css selector", "delayMs": 300 }]
// theme sets prefers-color-scheme; storage is written to localStorage before the page loads.
// Prints one line per shot and the console errors of each page; exit 1 if any shot failed.
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { chromium } from 'playwright';

if (process.env.WS_GUARD_ACTIVE !== 'browser') {
  console.error('shoot.mjs: run it as scripts/guard.sh browser -- node scripts/shoot.mjs <shots.json>');
  process.exit(64);
}
const file = process.argv[2];
if (!file) {
  console.error('usage: scripts/guard.sh browser -- node scripts/shoot.mjs <shots.json>');
  process.exit(64);
}
const shots = JSON.parse(readFileSync(file, 'utf8'));

const browser = await chromium.launch();
let failed = 0;
try {
  for (const s of shots) {
    // a context per shot: its own color scheme and storage; closed before the next, so only one page is open
    const context = await browser.newContext({
      viewport: { width: s.width ?? 1440, height: s.height ?? 900 },
      colorScheme: s.theme === 'dark' ? 'dark' : 'light',
    });
    if (s.storage) {
      await context.addInitScript(entries => {
        for (const [k, v] of Object.entries(entries)) localStorage.setItem(k, v);
      }, s.storage);
    }
    const page = await context.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(String(e)));
    try {
      await page.goto(s.url, { waitUntil: 'networkidle', timeout: 30_000 });
      if (s.waitFor) await page.waitForSelector(s.waitFor, { timeout: 10_000 });
      await page.waitForTimeout(s.delayMs ?? 300);
      mkdirSync(dirname(s.out), { recursive: true });
      await page.screenshot({ path: s.out, fullPage: s.fullPage ?? true });
      console.log(`ok   ${s.out}`);
    } catch (e) {
      failed++;
      console.log(`FAIL ${s.out}: ${e.message.split('\n')[0]}`);
    }
    for (const e of errors) console.log(`     console: ${e.slice(0, 200)}`);
    await context.close();
  }
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
