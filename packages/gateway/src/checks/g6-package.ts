// G6 · Packaging: dependency allowlist, public export, fixture registration, SSR render.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { ComponentSpec } from '@caustic/spec';
import { Collector } from '../report.ts';
import { reactSrc, root } from '../paths.ts';
import { pascal } from './g2-static.ts';

const ALLOWED_DEPS = /^(@caustic\/tokens|@radix-ui\/react-[a-z-]+|class-variance-authority|tailwind-merge|@solar-icons\/react|lucide-react)$/;

export async function g6(c: Collector, spec: ComponentSpec) {
  const pkg = JSON.parse(readFileSync(join(root, 'packages/react/package.json'), 'utf8'));
  for (const dep of Object.keys(pkg.dependencies ?? {})) if (!ALLOWED_DEPS.test(dep)) c.fail({ gate: 'G6', check: 'dependencies', message: `Runtime dependency "${dep}" is not on the allowlist.` });
  for (const r of spec.composition.radix) if (!pkg.dependencies?.[r]) c.fail({ gate: 'G6', check: 'dependencies', message: `${r} is used by the spec but not declared in packages/react/package.json.` });

  // The public entry is generated (`pnpm registry`); check what it actually exports at runtime.
  const index = readFileSync(join(reactSrc, 'index.ts'), 'utf8');
  if (!index.includes(`./components/${spec.id}/index.ts`)) c.fail({ gate: 'G6', check: 'export', message: `components/${spec.id}/index.ts is not re-exported from src/index.ts.`, fix: 'Create components/<id>/index.ts with the public exports, then run `pnpm registry`.' });
  else {
    // The entry re-exports this module verbatim (generated); importing only it keeps other authors' half-written components out of this run.
    const pub = await import(pathToFileURL(join(reactSrc, 'components', spec.id, 'index.ts')).href).catch((e: any) => { c.fail({ gate: 'G6', check: 'export', message: `components/${spec.id}/index.ts failed to load: ${String(e.message).split('\n')[0]}` }); return null; });
    if (pub && !['function', 'object'].includes(typeof pub[pascal(spec.id)])) c.fail({ gate: 'G6', check: 'export', message: `${pascal(spec.id)} is not exported from the package entry.`, fix: `Export ${pascal(spec.id)} from components/${spec.id}/index.ts.` });
  }
  const fixtures = readFileSync(join(reactSrc, 'fixtures.ts'), 'utf8');
  if (!fixtures.includes(`components/${spec.id}/${spec.id}.fixture`)) c.fail({ gate: 'G6', check: 'fixture', message: 'Fixture is not registered in src/fixtures.ts.' });

  // Server rendering must not touch window/document at render time.
  try {
    const { renderToString } = await import('react-dom/server');
    const mod = await import(pathToFileURL(join(reactSrc, 'components', spec.id, `${spec.id}.fixture.tsx`)).href);
    const fx = mod.default;
    renderToString(fx.render({}));
    for (const [id, ex] of Object.entries<() => unknown>(fx.examples)) {
      try { renderToString(ex() as any); } catch (e: any) { c.fail({ gate: 'G6', check: 'ssr', where: `example ${id}`, message: `Server render failed: ${String(e.message).split('\n')[0]}` }); }
    }
  } catch (e: any) {
    c.fail({ gate: 'G6', check: 'ssr', message: `Server render failed: ${String(e.message).split('\n')[0]}`, fix: 'Do not read window/document during render; use effects.' });
  }
}
