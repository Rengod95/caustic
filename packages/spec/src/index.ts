// @caustic/spec — component contracts.
import { ComponentSpec, type SpecInput } from './schema.ts';
import { registry } from './specs/index.ts';

export * from './schema.ts';
export { policies } from './policies.ts';

/** Parsed (defaults applied) specs keyed by id. Throws on schema errors; use validateSpec for reporting. */
export function loadSpecs(): Record<string, ComponentSpec> {
  const out: Record<string, ComponentSpec> = {};
  for (const [id, input] of Object.entries(registry)) out[id] = ComponentSpec.parse(input);
  return out;
}

export function validateSpec(input: SpecInput) {
  return ComponentSpec.safeParse(input);
}

export const rawSpecs: Record<string, SpecInput> = registry;
