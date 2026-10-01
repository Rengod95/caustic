// @caustic/spec — component contracts. Schema and policies only; spec data loads from
// '@caustic/spec/all' (every spec) or '@caustic/spec/node' (one spec at a time).
import { ComponentSpec, type SpecInput } from './schema.ts';

export * from './schema.ts';
export { policies } from './policies.ts';

export function validateSpec(input: SpecInput) {
  return ComponentSpec.safeParse(input);
}
