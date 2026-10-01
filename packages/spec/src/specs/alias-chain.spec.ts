import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'alias-chain',
  name: 'AliasChain',
  category: 'data',
  status: 'ready',
  purpose: 'Shows how a token resolves: the names it passes through, joined by arrows, ending on the primitive it finally reads from. Machine output, so mono.',
  description: 'A single wrapping line: component token, then semantic token, then primitive. The last name is the resolved value and is emphasised. Read-only; for a token you can interact with use TokenChip.',
  role: 'list',
  slots: [
    { name: 'root', el: 'ol', role: 'list', description: 'The chain. Flex, wrapping, 6px gap, centered, mono text, tertiary. Needs an accessible name (aria-label, for example "Alias chain for button/bg").' },
    { name: 'item', el: 'li', parent: 'root', description: 'One name on the way (every name except the last).' },
    { name: 'arrow', el: 'span', parent: 'root', description: 'Arrow-right glyph between two names: 12px, inherits the tertiary color. Decorative (aria-hidden); the list order carries the meaning.' },
    { name: 'resolved', el: 'li', parent: 'root', description: 'The last name, the primitive the chain resolves to: primary text, medium weight. aria-current="true".' },
  ],
  props: {
    items: { type: 'string[]', required: true, description: 'Names from the starting token to the resolved one (at least one).' },
    'aria-label': { type: 'string', required: true, description: 'Accessible name of the chain.' },
  },
  styles: [
    { slot: 'root', expect: { fg: 'text.tertiary', gap: 6, font: 'mono', text: 'mono-md', weight: 400 }, note: 'Specimen text is the mono role at 11.5px regular with line-height normal; mono-md (11.5 / 18) is used with the weight overridden.' },
    { slot: 'arrow', expect: { height: 'icon-xs', width: 'icon-xs' } },
    { slot: 'resolved', expect: { fg: 'text.primary', weight: 500 } },
  ],
  behavior: { pointer: ['read-only'] },
  a11y: {
    labelRequired: true,
    minHit: 24,
    notes: [
      'An ordered list read as "button/bg, accent/solid, lagoon/600"; the arrows are decorative.',
      'The resolved name is marked with aria-current="true" in addition to its stronger color and weight.',
    ],
  },
  policies: ['P4', 'P6'],
  composition: {},
  examples: [],
  usage: [
    'Fixture render(props): aria-label "Alias chain for button/bg" and items ["button/bg", "accent/solid", "lagoon/600"]; the last is the resolved name.',
    'No example of its own: it appears in the token binding doc frame (token-binding#token-binding) together with a color field (28px swatch, mono input, pipette button) that has no Caustic component yet, so that section is not reproducible.',
  ],
});
