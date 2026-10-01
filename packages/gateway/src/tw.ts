// Tailwind 4 compiler bound to the Caustic theme. Used by G2 to prove that every class
// a component uses resolves to a token-backed utility.
import { compile } from '@tailwindcss/node';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root } from './paths.ts';

let compiler: Awaited<ReturnType<typeof compile>> | null = null;

export async function twCompiler() {
  if (compiler) return compiler;
  const base = join(root, 'packages/react/src');
  const css = readFileSync(join(base, 'styles.css'), 'utf8').replace(/@source[^;]*;/g, '');
  compiler = await compile(css, { base, onDependency() {} });
  return compiler;
}

const escapeClass = (c: string) => c.replace(/[^a-zA-Z0-9_-]/g, m => '\\' + m);

/** Returns the classes that produce no CSS (not backed by the Caustic theme). */
export async function unknownClasses(candidates: string[]): Promise<string[]> {
  const c = await twCompiler();
  const unknown: string[] = [];
  for (const cand of new Set(candidates)) {
    // Marker classes emit no CSS of their own: group, peer and their named forms (group/card).
    if (/^(group|peer)(\/[a-z0-9-]+)?$/.test(cand)) continue;
    const out = c.build([cand]);
    const bare = cand.split(':').pop()!.replace(/^!/, '');
    if (!out.includes('.' + escapeClass(cand)) && !out.includes(escapeClass(bare))) unknown.push(cand);
  }
  return unknown;
}

/** CSS generated for one class, for rule checks (e.g. literal values inside arbitrary utilities). */
export async function cssFor(candidate: string): Promise<string> {
  const c = await twCompiler();
  return c.build([candidate]);
}
