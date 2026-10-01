// Shared runtime: Vite harness server, Playwright browser, case generation and the in-page measurer.
import { chromium, type Browser, type Page, type CDPSession } from 'playwright';
import { createServer, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { rmSync } from 'node:fs';
import type { ComponentSpec, StyleExpect } from '@caustic/spec';
import { root } from './paths.ts';
import { dimPx, type TokenIndex } from './tokens.ts';

export interface Runtime { server: ViteDevServer; url: string; browser: Browser; close(): Promise<void> }

export async function startRuntime(): Promise<Runtime> {
  const server = await createServer({
    configFile: false, root: join(root, 'packages/gateway/harness'), logLevel: 'error',
    // Per-process dependency cache: parallel gate runs must not race on one optimizer cache.
    cacheDir: join(tmpdir(), `caustic-vite-${process.pid}`),
    plugins: [react(), tailwindcss()], // No HMR or watching: other agents edit files while a gate runs; a run must see one stable snapshot.
    server: { port: 0, strictPort: false, hmr: false, watch: null, fs: { allow: [root] } },
    optimizeDeps: { include: ['react', 'react-dom/client', 'zod', 'class-variance-authority', 'tailwind-merge', 'lucide-react', '@radix-ui/react-slot', '@radix-ui/react-dialog',
      '@radix-ui/react-accordion', '@radix-ui/react-dropdown-menu', '@radix-ui/react-hover-card', '@radix-ui/react-popover', '@radix-ui/react-radio-group',
      '@radix-ui/react-select', '@radix-ui/react-slider', '@radix-ui/react-alert-dialog', '@radix-ui/react-tabs', '@radix-ui/react-toggle-group', '@radix-ui/react-tooltip'] },
  });
  await server.listen();
  const url = server.resolvedUrls!.local[0]!.replace(/\/$/, '');
  const browser = await chromium.launch({ channel: 'chrome' });
  return { server, url, browser, async close() { await browser.close(); await server.close(); rmSync(server.config.cacheDir, { recursive: true, force: true }); } };
}

export interface CaseDef { key: string; props: Record<string, unknown> }

/** Default props for a spec: every variant axis and the size at their defaults. */
export function defaults(spec: ComponentSpec): Record<string, unknown> {
  const d: Record<string, unknown> = {};
  for (const [axis, v] of Object.entries(spec.variants)) d[axis] = v.default;
  if (spec.sizes) d.size = spec.sizes.default;
  return d;
}

export function caseFor(spec: ComponentSpec, when: Record<string, unknown> = {}): CaseDef {
  const props = { ...defaults(spec) };
  for (const [k, v] of Object.entries(when)) if (k !== 'state') props[k] = v;
  const state = when.state as string | undefined;
  if (state && state !== 'rest') Object.assign(props, spec.states[state as keyof typeof spec.states]?.props ?? {});
  const key = JSON.stringify(Object.keys(props).sort().map(k => [k, props[k]]));
  return { key, props };
}

export async function openPage(rt: Runtime, q: Record<string, string>, cases?: CaseDef[], opts: { reducedMotion?: boolean; width?: number } = {}): Promise<Page> {
  const page = await rt.browser.newPage({ viewport: { width: opts.width ?? 1440, height: 1000 }, reducedMotion: opts.reducedMotion ? 'reduce' : 'no-preference' });
  // tsx/esbuild wraps functions passed to page.evaluate with __name(); define it in the page.
  await page.addInitScript({ content: 'globalThis.__name = (f) => f;' });
  if (cases) await page.addInitScript(c => { (window as any).__CASES__ = c; }, cases);
  await page.goto(`${rt.url}/?${new URLSearchParams(q)}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => (window as any).__READY__ === true || !!(window as any).__ERROR__, null, { timeout: 30000 });
  const err = await page.evaluate(() => (window as any).__ERROR__ || document.querySelector('[data-error]')?.textContent || null);
  if (err) throw new Error(`Harness error: ${err}`);
  await page.addScriptTag({ content: MEASURER });
  return page;
}

/** Force CSS pseudo-classes on an element through DevTools (deterministic :hover, :focus-visible…). */
export async function forcePseudo(page: Page, selector: string, pseudo: string[]): Promise<() => Promise<void>> {
  const cdp: CDPSession = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root: doc } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: doc.nodeId, selector });
  if (!nodeId) { await cdp.detach(); throw new Error(`no node for ${selector}`); }
  await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: pseudo });
  return async () => { await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] }).catch(() => {}); await cdp.detach().catch(() => {}); };
}

/** Token numbers the page cannot read from CSS variables alone (type roles, sizes). */
export function expectPayload(t: TokenIndex, e: StyleExpect) {
  const out: Record<string, unknown> = { ...e };
  for (const key of ['height', 'minHeight', 'width'] as const) if (e[key] !== undefined) out[key] = dimPx(t, e[key]!);
  for (const key of ['padX', 'padY'] as const) if (e[key] !== undefined) out[key] = typeof e[key] === 'number' ? e[key] : dimPx(t, e[key] as string);
  if (e.text) { const r = t.type[e.text]!; out.text = { name: e.text + (e.weight ? ` @${e.weight}` : ''), size: r[1], lh: r[2], weight: e.weight ?? r[3], tracking: r[4] }; }
  if (e.radius) out.radiusVar = ['window', 'panel', 'toolbar', 'toolbar-item', 'toast'].includes(e.radius) ? `--cs-studio-${e.radius}-radius`.replace('-toolbar-item-radius', '-toolbar-item-radius') : `--cs-radius-${e.radius}`;
  return out;
}

// Runs inside the page. Compares an element's computed style with token values resolved
// through probe elements, so both sides go through the same CSS engine and formatting.
const MEASURER = `
window.__gate = {
  probe() { let p = document.getElementById('__probe'); if (!p) { p = document.createElement('div'); p.id = '__probe'; p.style.cssText = 'position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden'; document.body.appendChild(p); } return p; },
  color(name, prop) { if (name === 'transparent') return 'rgba(0, 0, 0, 0)'; const p = this.probe(); p.style.backgroundColor = 'var(--cs-color-' + name.replace('.', '-') + ')'; return getComputedStyle(p).backgroundColor; },
  resolve(prop, value) { const p = this.probe(); p.style.cssText += ';' + prop + ':' + value; const v = getComputedStyle(p).getPropertyValue(prop); p.removeAttribute('style'); p.style.cssText = 'position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden'; return v; },
  measure(el, e) {
    const cs = getComputedStyle(el); const bad = [];
    const px = v => parseFloat(v);
    const near = (a, b, tol = 0.6) => Math.abs(a - b) <= tol;
    const push = (key, expected, actual) => bad.push({ key, expected: String(expected), actual: String(actual) });
    if (e.bg !== undefined) { const x = this.color(e.bg); if (cs.backgroundColor !== x) push('bg ' + e.bg, x, cs.backgroundColor); }
    if (e.fg !== undefined) { const x = this.color(e.fg); if (cs.color !== x) push('fg ' + e.fg, x, cs.color); }
    if (e.border !== undefined) { const x = this.color(e.border); if (cs.borderTopColor !== x) push('border ' + e.border, x, cs.borderTopColor); }
    if (e.edge !== undefined) { const x = this.color(e.edge) + ' 0px 0px 0px '; if (!cs.boxShadow.includes(x)) push('edge ' + e.edge, x, cs.boxShadow); }
    if (e.shadow !== undefined) { const x = this.resolve('box-shadow', 'var(--cs-elevation-' + e.shadow + ')'); if (!cs.boxShadow.includes(x)) push('shadow elevation-' + e.shadow, x, cs.boxShadow); }
    if (e.ring !== undefined) {
      const focus = this.resolve('box-shadow', 'var(--cs-focus)'), field = this.resolve('box-shadow', 'var(--cs-focus-field)');
      if (e.ring === 'focus' && !cs.boxShadow.includes(focus)) push('ring focus', focus, cs.boxShadow);
      if (e.ring === 'focus-field' && !cs.boxShadow.includes(field)) push('ring focus-field', field, cs.boxShadow);
      if (e.ring === 'focus-field' && cs.boxShadow.includes(focus)) push('ring focus-field (no outer ring)', 'no var(--cs-focus)', cs.boxShadow);
      if (e.ring === 'none' && (cs.boxShadow.includes(this.color('focus.ring')) || (cs.outlineStyle !== 'none' && px(cs.outlineWidth) > 0))) push('ring none', 'no focus ring or outline', cs.boxShadow + ' / outline ' + cs.outline);
    }
    if (e.radius !== undefined) { const x = this.resolve('border-top-left-radius', 'var(' + e.radiusVar + ')'); if (cs.borderTopLeftRadius !== x) push('radius ' + e.radius, x, cs.borderTopLeftRadius); }
    const r = el.getBoundingClientRect();
    if (e.height != null && !near(r.height, e.height)) push('height', e.height + 'px', r.height + 'px');
    if (e.minHeight != null && r.height + 0.6 < e.minHeight) push('minHeight', '>= ' + e.minHeight + 'px', r.height + 'px');
    if (e.width != null && !near(r.width, e.width)) push('width', e.width + 'px', r.width + 'px');
    if (e.padX != null && (!near(px(cs.paddingLeft), e.padX) || !near(px(cs.paddingRight), e.padX))) push('padX', e.padX + 'px', cs.paddingLeft + ' / ' + cs.paddingRight);
    if (e.padY != null && (!near(px(cs.paddingTop), e.padY) || !near(px(cs.paddingBottom), e.padY))) push('padY', e.padY + 'px', cs.paddingTop + ' / ' + cs.paddingBottom);
    if (e.gap != null && !near(px(cs.columnGap) || px(cs.rowGap) || 0, e.gap)) push('gap', e.gap + 'px', cs.columnGap);
    if (e.weight && !e.text && Number(cs.fontWeight) !== e.weight) push('weight', e.weight, cs.fontWeight);
    if (e.text) {
      const t = e.text;
      if (!near(px(cs.fontSize), t.size, 0.05)) push('text ' + t.name + ' size', t.size + 'px', cs.fontSize);
      if (!near(px(cs.lineHeight), t.lh, 0.05)) push('text ' + t.name + ' line-height', t.lh + 'px', cs.lineHeight);
      if (Number(cs.fontWeight) !== t.weight) push('text ' + t.name + ' weight', t.weight, cs.fontWeight);
      const ls = cs.letterSpacing === 'normal' ? 0 : px(cs.letterSpacing);
      if (!near(ls, t.tracking * t.size, 0.06)) push('text ' + t.name + ' tracking', (t.tracking * t.size).toFixed(3) + 'px', cs.letterSpacing);
    }
    if (e.font !== undefined) { const x = this.resolve('font-family', 'var(--cs-font-' + e.font + ')'); if (cs.fontFamily !== x) push('font ' + e.font, x, cs.fontFamily); }
    if (e.material !== undefined) {
      const bg = this.color('material.' + e.material); if (cs.backgroundColor !== bg) push('material ' + e.material + ' fill', bg, cs.backgroundColor);
      const blurName = { ultrathin: 'ultrathin', thin: 'thin', regular: 'regular', thick: 'thick' }[e.material];
      const bf = this.resolve('backdrop-filter', 'blur(var(--cs-blur-' + blurName + ')) saturate(1.8)'); if (cs.backdropFilter !== bf) push('material ' + e.material + ' blur', bf, cs.backdropFilter);
    }
    if (e.frost) { const bf = this.resolve('backdrop-filter', 'blur(var(--cs-blur-control)) saturate(1.6)'); if (cs.backdropFilter !== bf) push('frost', bf, cs.backdropFilter); }
    if (e.opacity != null && !near(Number(cs.opacity), e.opacity, 0.005)) push('opacity', e.opacity, cs.opacity);
    if (e.agentRim) { const a = getComputedStyle(el, '::after').backgroundImage; if (!a.includes('conic-gradient')) push('agentRim', 'spectrum conic on ::after', a); }
    if (e.outline === 'none' && cs.outlineStyle !== 'none' && px(cs.outlineWidth) > 0) push('outline', 'none', cs.outline);
    if (e.cursor !== undefined && cs.cursor !== e.cursor) push('cursor', e.cursor, cs.cursor);
    return bad;
  },
};
`;

export const slotSelector = (spec: ComponentSpec, slot: string) => `[data-slot="${slot === 'root' ? spec.id : `${spec.id}-${slot}`}"]`;
export const caseSelector = (key: string) => `[data-case=${JSON.stringify(key)}]`;
