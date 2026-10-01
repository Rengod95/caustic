// Spec registry. Add one import per component spec.
import type { SpecInput } from '../schema.ts';
import button from './button.spec.ts';

export const registry: Record<string, SpecInput> = {
  button,
};
