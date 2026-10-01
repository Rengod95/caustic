// Gate harness: renders a component's cases, one example, or one scenario instance.
// Driven by Playwright through the URL and window.__CASES__.
import './harness.css';
import { createRoot } from 'react-dom/client';
import { Fragment, type ReactNode } from 'react';
import { fixtures } from '@caustic/react/fixtures';
import { rawSpecs, ComponentSpec } from '@caustic/spec';

declare global {
  interface Window { __CASES__?: { key: string; props: Record<string, unknown> }[]; __EVENTS__: { name: string; args: unknown[] }[]; __READY__?: boolean; __ERROR__?: string }
}

const q = new URLSearchParams(location.search);
const theme = q.get('theme'); if (theme) document.documentElement.dataset.theme = theme;
if (q.get('density') === 'compact') document.documentElement.dataset.density = 'compact';
if (q.get('freeze') !== '0') document.body.classList.add('freeze');
window.__EVENTS__ = [];

const serialize = (v: unknown): unknown => {
  if (v === null || ['string', 'number', 'boolean', 'undefined'].includes(typeof v)) return v;
  if (Array.isArray(v)) return v.map(serialize);
  if (typeof v === 'object' && v && 'nativeEvent' in v) return { type: (v as unknown as { type: string }).type };
  if (v instanceof Event) return { type: v.type };
  try { return JSON.parse(JSON.stringify(v)); } catch { return String(v); }
};

function App(): ReactNode {
  const id = q.get('c') ?? '';
  const fx = fixtures[id];
  const raw = rawSpecs[id];
  if (!fx || !raw) return <pre data-error>{`No fixture or spec for "${id}"`}</pre>;
  const spec = ComponentSpec.parse(raw);
  const recorders = Object.fromEntries(Object.keys(spec.events).map(name => [name, (...args: unknown[]) => { window.__EVENTS__.push({ name, args: args.map(serialize) }); }]));
  const mode = q.get('mode') ?? 'cases';
  const frame = fx.frame ?? ((n: ReactNode) => n);
  if (mode === 'example') {
    const ex = q.get('ex') ?? '';
    const render = fx.examples[ex];
    return <div className="frame" data-example={ex} style={{ ['--frame-w' as string]: `${q.get('w') ?? 800}px` }}>{render ? render() : <pre data-error>{`No example "${ex}"`}</pre>}</div>;
  }
  const cases = window.__CASES__ ?? [{ key: 'default', props: {} }];
  return (
    <div className="cases">
      {cases.map(c => <div className="case" data-case={c.key} key={c.key}><Fragment>{frame(fx.render({ ...recorders, ...c.props }))}</Fragment></div>)}
    </div>
  );
}

try {
  createRoot(document.getElementById('root')!).render(<App />);
} catch (e) { window.__ERROR__ = String(e); }
addEventListener('error', e => { window.__ERROR__ = String(e.message); });
document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => { window.__READY__ = true; })));
