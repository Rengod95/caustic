// Node-side spec access, one file at a time: a half-written or renamed draft never blocks
// a gate run for another component.
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { SpecInput } from './schema.ts';

export const specsDir = join(dirname(fileURLToPath(import.meta.url)), 'specs');

export const specIds = (): string[] =>
  readdirSync(specsDir).filter(f => f.endsWith('.spec.ts')).map(f => f.slice(0, -'.spec.ts'.length)).sort();

/** The raw spec module's default export, or undefined if there is no such spec. Throws if the file does not load. */
export async function readSpec(id: string): Promise<SpecInput | undefined> {
  const file = join(specsDir, `${id}.spec.ts`);
  if (!existsSync(file)) return undefined;
  return (await import(pathToFileURL(file).href)).default as SpecInput;
}
