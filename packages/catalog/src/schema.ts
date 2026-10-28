// Catalog entry: the routing data an agent needs that the code cannot say. Everything derivable (props, variants,
// slots, parts, examples, a11y) is generated from the spec and the source by build.ts and never written here.
// Wording: entries describe fit, not prohibition. `consider` points to a sibling that may fit a nearby need better;
// it never says "do not use", so applied design can still stretch a component past its first role.
import { z } from 'zod';
import { placementIds, roleIds } from './roles.ts';

const sentence = z.string().min(8).max(160);

export const CatalogEntry = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  intent: sentence.describe('one consumer-facing sentence: what it is for'),
  roles: z.array(z.enum(roleIds)).min(1).max(2).describe('primary roles, strongest first'),
  alsoFits: z.array(z.enum(roleIds)).max(4).default([]).describe('roles it can also serve in applied design'),
  placement: z.array(z.enum(placementIds)).min(1).max(5).describe('where it usually sits'),
  keywords: z.array(z.string().min(2).max(30)).max(10).default([]).describe('search words people use for it that are not in its name or intent'),
  pairs: z.array(z.string()).max(6).default([]).describe('component ids it is commonly placed with'),
  consider: z.array(z.object({ id: z.string(), when: sentence })).max(4).default([]).describe('a sibling that may fit better, and when'),
  guidance: z.array(sentence).max(3).default([]).describe('consumer notes the props do not show'),
  detail: z.string().max(1500).optional().describe('optional markdown shown only at --depth full'),
});
export type CatalogEntry = z.infer<typeof CatalogEntry>;
export const defineEntry = (entry: z.input<typeof CatalogEntry>) => entry;

export const Recipe = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  title: z.string(),
  intent: sentence,
  regions: z.array(z.object({
    placement: z.enum(placementIds),
    purpose: sentence,
    roles: z.array(z.enum(roleIds)).min(1).describe('roles this region is built from'),
    suggested: z.array(z.string()).default([]).describe('component ids that usually fill it'),
  })).min(1),
  notes: z.array(sentence).max(5).default([]),
  reference: z.string().optional().describe('a source file that implements the recipe'),
});
export type Recipe = z.infer<typeof Recipe>;
export const defineRecipe = (recipe: z.input<typeof Recipe>) => recipe;

// ---- Generated catalog (dist/catalog.json). The CLI and the skill read only this file. ----

/** `values`: the string literals the type accepts (deprecated aliases included); `deprecated`: the spec says so;
 *  `deprecatedValues`: values the code accepts that the spec no longer lists. */
export type CatalogProp = { type: string; default?: unknown; required: boolean; description: string; values?: string[]; deprecated?: boolean; deprecatedValues?: string[] };
/** `el`: the slot's element ('any' when the part renders what it is given; '' for an export that matches no slot). */
export type CatalogPart = { name: string; slot: string; el: string; parent?: string; required: boolean; description: string };
export type CatalogComponent = CatalogEntry & {
  name: string;
  category: string;
  status: string;
  import: string;
  exports: string[];
  /** The root slot's element. */
  el: string;
  /** The documented props of the component (from the spec). */
  props: Record<string, CatalogProp>;
  /** Every prop each component export accepts, read from its Props type (HTML and React props left out), keyed by
   *  export name. Description, default and deprecation come from the spec where it documents the prop. */
  exportProps: Record<string, Record<string, CatalogProp>>;
  variants: Record<string, { values: string[]; default: string; description?: string }>;
  sizes?: { values: string[]; default: string };
  parts: CatalogPart[];
  events: Record<string, { payload: string; when: string }>;
  keyboard: Record<string, string>;
  a11y: { labelRequired: boolean; notes: string[] };
  flags: { agent: boolean; floating: boolean; field: boolean };
  uses: string[];
  usedBy: string[];
  examples: { id: string; title: string; code?: string }[];
};
export type Catalog = {
  version: string;
  generatedFrom: string;
  roles: Record<string, { description: string; components: string[] }>;
  placements: Record<string, { description: string; components: string[] }>;
  components: Record<string, CatalogComponent>;
  recipes: Record<string, Omit<Recipe, 'reference'>>;
  tokens: Record<string, string[]>;
};
