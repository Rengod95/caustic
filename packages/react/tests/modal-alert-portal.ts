// Render test: a portal-mode Modal kind="alert" (Radix AlertDialog) must render its title, description and close
// control without "DialogTitle must be used within Dialog". Slot scenarios cannot reach portal content, so this
// runs in the gateway harness directly:  pnpm exec tsx packages/react/tests/modal-alert-portal.ts
import { startRuntime, openPage, caseFor } from '../../gateway/src/runtime.ts';
import modalSpec from '../../spec/src/specs/modal.spec.ts';
import { ComponentSpec } from '@caustic/spec';

const spec = ComponentSpec.parse(modalSpec);
const rt = await startRuntime();
let failed = false;
try {
  for (const kind of ['alert', 'dialog'] as const) {
    const c = caseFor(spec, { kind, inline: false, defaultOpen: true, showClose: true, closeLabel: 'Close', title: 'Delete theme', description: 'This removes 14 tokens.' });
    const errors: string[] = [];
    const page = await openPage(rt, { c: spec.id, mode: 'cases', theme: 'light', freeze: '1' }, [c]).catch(e => { errors.push(String(e)); return null; });
    if (page) {
      page.on('pageerror', e => errors.push(e.message));
      const found = await page.evaluate(() => ({
        title: document.querySelector('[data-slot="modal-title"]')?.textContent ?? null,
        description: document.querySelector('[data-slot="modal-description"]')?.textContent ?? null,
        close: document.querySelector('[data-slot="modal-close"]')?.getAttribute('aria-label') ?? null,
        role: document.querySelector('[data-slot="modal"]')?.getAttribute('role') ?? null,
      }));
      const ok = errors.length === 0 && found.title === 'Delete theme' && found.description === 'This removes 14 tokens.' && found.close === 'Close' && found.role === (kind === 'alert' ? 'alertdialog' : 'dialog');
      console.log(ok ? 'PASS' : 'FAIL', kind, JSON.stringify(found), errors.join(' | '));
      if (!ok) failed = true;
      await page.close();
    } else { console.log('FAIL', kind, errors.join(' | ')); failed = true; }
  }
} finally { await rt.close(); }
process.exit(failed ? 1 : 0);
