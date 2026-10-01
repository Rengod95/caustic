// Every spec at once (docs, tooling). The gateway reads one spec per run through ./node.ts instead.
import { ComponentSpec, type SpecInput } from './schema.ts';
import { registry } from './specs/index.ts';

/** Parsed (defaults applied) specs keyed by id. Throws on schema errors. */
export function loadSpecs(): Record<string, ComponentSpec> {
  const out: Record<string, ComponentSpec> = {};
  for (const [id, input] of Object.entries(registry)) out[id] = ComponentSpec.parse(input);
  return out;
}

export const rawSpecs: Record<string, SpecInput> = registry;
