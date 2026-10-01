// Component specification schema — the contract every coded component must satisfy.
// A spec is data only (no React). The gateway reads it to generate render cases,
// style assertions, behaviour scenarios and the rewrite request.
import { z } from 'zod';

export const policyIds = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9'] as const;
export const categories = ['primitive', 'form', 'overlay', 'navigation', 'data', 'card', 'list', 'agent', 'canvas', 'inspector', 'structure'] as const;
export const states = ['rest', 'hover', 'active', 'focus-visible', 'focus-within', 'disabled', 'invalid', 'checked', 'unchecked', 'indeterminate', 'open', 'closed', 'loading', 'selected', 'pressed', 'readonly', 'dragging'] as const;

/** A state is applied either with a CSS pseudo-class (forced through DevTools) or with props. */
const StateDef = z.object({
  pseudo: z.array(z.enum(['hover', 'active', 'focus', 'focus-visible', 'focus-within'])).optional(),
  target: z.string().optional().describe('slot the pseudo-class is forced on; defaults to root'),
  props: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Expected computed styles of one slot, written as token names.
 * Colors are semantic color tokens ("ink.solid"); dimensions are token keys.
 */
export const StyleExpect = z.object({
  bg: z.string().optional().describe('background-color = color token'),
  fg: z.string().optional().describe('color = color token'),
  border: z.string().optional().describe('border-color = color token'),
  edge: z.string().optional().describe('box-shadow contains a 1px ring of this color token'),
  ring: z.enum(['focus', 'focus-field', 'none']).optional().describe('focus treatment present in box-shadow'),
  shadow: z.string().optional().describe('box-shadow contains elevation-N'),
  radius: z.string().optional().describe('border-radius = radius token key (md, xl, panel, toolbar, full…)'),
  height: z.union([z.string(), z.number()]).optional().describe('height = size token (control-md, field-md, icon-md) or px number'),
  minHeight: z.union([z.string(), z.number()]).optional(),
  width: z.union([z.string(), z.number()]).optional(),
  padX: z.union([z.string(), z.number()]).optional().describe('padding-inline: px number or inset token'),
  padY: z.union([z.string(), z.number()]).optional(),
  gap: z.number().optional(),
  text: z.string().optional().describe('type role: font-size, line-height, weight, tracking'),
  font: z.enum(['ui', 'voice', 'mono']).optional(),
  material: z.enum(['ultrathin', 'thin', 'regular', 'thick']).optional().describe('glass material: background + backdrop blur'),
  frost: z.boolean().optional().describe('light control frost (blur-control) behind the fill'),
  opacity: z.number().optional(),
  agentRim: z.boolean().optional().describe('spectrum rim on ::after'),
  outline: z.literal('none').optional(),
  cursor: z.string().optional(),
});
export type StyleExpect = z.infer<typeof StyleExpect>;

const StyleRule = z.object({
  slot: z.string(),
  when: z.record(z.string(), z.union([z.string(), z.boolean(), z.number()])).optional().describe('variant axis / size / state / prop values; omitted keys use defaults'),
  expect: StyleExpect,
  note: z.string().optional(),
});

const Slot = z.object({
  name: z.string().describe('"root" or a part name; data-slot = id for root, id-name otherwise'),
  el: z.string().describe('HTML tag or "any"'),
  parent: z.string().optional(),
  required: z.boolean().default(true),
  role: z.string().optional(),
  description: z.string(),
});

const Prop = z.object({
  type: z.string().describe('TypeScript type as written in the props interface'),
  default: z.unknown().optional(),
  required: z.boolean().default(false),
  description: z.string(),
});

const EventDef = z.object({
  payload: z.string().describe('TypeScript type of the first argument'),
  when: z.string(),
});

const Step = z.object({
  do: z.enum(['click', 'press', 'type', 'focus', 'hover', 'drag', 'blur']),
  slot: z.string().optional(),
  key: z.string().optional(),
  text: z.string().optional(),
  by: z.object({ x: z.number(), y: z.number() }).optional(),
});
const Expectation = z.object({
  event: z.string().optional(),
  args: z.array(z.unknown()).optional(),
  calls: z.number().optional(),
  slot: z.string().optional(),
  attr: z.record(z.string(), z.union([z.string(), z.null()])).optional(),
  focused: z.string().optional().describe('slot that must have focus'),
  visible: z.string().optional(),
  hidden: z.string().optional(),
});
const Scenario = z.object({
  name: z.string(),
  props: z.record(z.string(), z.unknown()).optional(),
  steps: z.array(Step),
  expect: z.array(Expectation),
});

export const ComponentSpec = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  name: z.string(),
  category: z.enum(categories),
  status: z.enum(['draft', 'ready', 'gated', 'stable']),
  purpose: z.string(),
  description: z.string().optional(),
  role: z.string().nullable().describe('ARIA role of the root, or null for presentational'),
  slots: z.array(Slot).min(1),
  variants: z.record(z.string(), z.object({ values: z.array(z.string()).min(1), default: z.string(), description: z.string().optional() })).default({}),
  sizes: z.object({ values: z.array(z.string()).min(1), default: z.string() }).optional(),
  states: z.partialRecord(z.enum(states), StateDef).default({}),
  props: z.record(z.string(), Prop).default({}),
  events: z.record(z.string(), EventDef).default({}),
  styles: z.array(StyleRule).default([]),
  behavior: z.object({
    keyboard: z.record(z.string(), z.string()).default({}),
    pointer: z.array(z.string()).default([]),
    scenarios: z.array(Scenario).default([]),
  }).default({ keyboard: {}, pointer: [], scenarios: [] }),
  a11y: z.object({
    labelRequired: z.boolean().default(false),
    minHit: z.number().default(24),
    attrs: z.record(z.string(), z.array(z.string())).default({}).describe('slot -> required aria-* attributes'),
    notes: z.array(z.string()).default([]),
  }).default({ labelRequired: false, minHit: 24, attrs: {}, notes: [] }),
  policies: z.array(z.enum(policyIds)).default([]),
  flags: z.object({
    floating: z.boolean().default(false).describe('may use glass materials (P1)'),
    agent: z.union([z.boolean(), z.record(z.string(), z.array(z.string()))]).default(false).describe('may use the spectrum (P2); true or { axis: [values] }'),
    field: z.boolean().default(false).describe('field focus policy applies (P9)'),
    motionLoop: z.boolean().default(false).describe('may run infinite animations (agent only, P8)'),
  }).default({ floating: false, agent: false, field: false, motionLoop: false }),
  composition: z.object({
    uses: z.array(z.string()).default([]).describe('other Caustic components rendered inside'),
    radix: z.array(z.string()).default([]).describe('@radix-ui packages this component may import'),
  }).default({ uses: [], radix: [] }),
  examples: z.array(z.object({
    id: z.string(),
    title: z.string(),
    doc: z.string().describe('specimen page and example heading: "button#button-variants"'),
    maxDiff: z.number().optional().describe('allowed pixel difference ratio for this example (default from gateway config)'),
  })).default([]),
  usage: z.array(z.string()).default([]),
});
export type ComponentSpec = z.infer<typeof ComponentSpec>;
export type SpecInput = z.input<typeof ComponentSpec>;

export const defineSpec = (spec: SpecInput): SpecInput => spec;
export const slotAttr = (spec: Pick<ComponentSpec, 'id'>, slot: string) => (slot === 'root' ? spec.id : `${spec.id}-${slot}`);
