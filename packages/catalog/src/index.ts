// @caustic/catalog: the routing catalog for agents. The schema and the role taxonomy are the authoring contract;
// loadCatalog() reads the generated dist/catalog.json (pnpm catalog).
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import type { Catalog } from './schema.ts';

export * from './schema.ts';
export * from './roles.ts';

/** Absolute path of the generated catalog.json, resolved through the package exports so it works from the workspace
 *  sources and from an installed package alike. */
export function catalogPath(): string {
  return createRequire(import.meta.url).resolve('@caustic/catalog/catalog.json');
}

/** The generated catalog. Throws when dist/catalog.json is missing or not valid JSON. */
export function loadCatalog(path: string = catalogPath()): Catalog {
  return JSON.parse(readFileSync(path, 'utf8')) as Catalog;
}
