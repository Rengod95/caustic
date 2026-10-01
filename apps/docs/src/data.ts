/// <reference types="vite/client" />
// Everything the docs read: component specs, fixtures (lazy), gate status and the navigation model.
import { loadSpecs } from '@caustic/spec/all';
import { policies, type ComponentSpec } from '@caustic/spec';
import type { Fixture } from '../../../packages/react/src/lib/fixture.ts';
import gated from '../../../packages/spec/gated.json';
import locks from '../../../packages/spec/locks.json';
import { specimenGroup } from './specimen-groups.ts';

export { policies };
export type Spec = ComponentSpec;

export const specs: Record<string, Spec> = loadSpecs();
export const componentIds = Object.keys(specs).sort();

const gatedMap = gated as Record<string, { specHash: string; at: string }>;
const lockMap = locks as Record<string, string>;
export const isGated = (id: string) => id in gatedMap;
export const lockHash = (id: string) => lockMap[id];
export const gatedCount = componentIds.filter(isGated).length;

const loaders = import.meta.glob<{ default: Fixture }>('../../../packages/react/src/components/*/*.fixture.tsx');
const cache = new Map<string, Promise<Fixture | undefined>>();
export function loadFixture(id: string): Promise<Fixture | undefined> {
  let p = cache.get(id);
  if (!p) {
    const load = loaders[`../../../packages/react/src/components/${id}/${id}.fixture.tsx`];
    p = load ? load().then(m => m.default) : Promise.resolve(undefined);
    cache.set(id, p);
  }
  return p;
}

export const categoryGroup: Record<string, string> = {
  primitive: 'Components', form: 'Forms', overlay: 'Overlays', navigation: 'Navigation', data: 'Data & feedback',
  card: 'Cards', list: 'Lists', agent: 'Agent', canvas: 'Canvas', inspector: 'Inspector', structure: 'Structure & tokens',
};
export const groupOrder = ['Components', 'Cards', 'Lists', 'Forms', 'Overlays', 'Navigation', 'Data & feedback', 'Agent', 'Canvas', 'Inspector', 'Structure & tokens'];

/** Nav group: the specimen page of the first example when it is registered, otherwise the category. */
export function groupOf(spec: Spec): string {
  const slug = spec.examples[0]?.doc.split('#')[0];
  return (slug && specimenGroup[slug]) || categoryGroup[spec.category] || 'Components';
}

export const componentGroups = groupOrder.map(title => ({
  title,
  items: componentIds.filter(id => groupOf(specs[id]!) === title).map(id => specs[id]!),
})).filter(g => g.items.length > 0);

/** Reverse composition: which components render this one. */
export const usedBy: Record<string, string[]> = {};
for (const id of componentIds) for (const u of specs[id]!.composition.uses) (usedBy[u] ??= []).push(id);

export const foundationPages = [
  { slug: 'color', title: 'Color ramps' },
  { slug: 'semantic', title: 'Semantic colors' },
  { slug: 'contrast', title: 'Contrast' },
  { slug: 'typography', title: 'Typography' },
  { slug: 'space', title: 'Space' },
  { slug: 'radius', title: 'Radius' },
  { slug: 'sizes', title: 'Sizes' },
  { slug: 'elevation', title: 'Elevation' },
  { slug: 'materials', title: 'Materials' },
  { slug: 'motion', title: 'Motion' },
] as const;
export type FoundationSlug = (typeof foundationPages)[number]['slug'];
