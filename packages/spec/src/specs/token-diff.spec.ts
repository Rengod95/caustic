import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'token-diff',
  name: 'TokenDiff',
  category: 'data',
  status: 'ready',
  purpose: 'A compact before / after list of token changes: the token name, the old value struck through in red, an arrow and the new value in green. Machine output, so mono.',
  description: 'One row per changed token in a four-column grid (name takes the free width, then old value, arrow, new value). Used in agent proposals and review dialogs. For line-level code changes use CodeDiff.',
  role: 'list',
  slots: [
    { name: 'root', el: 'div', role: 'list', description: 'Grid with four columns (1fr auto auto auto), 4px row gap and 8px column gap, items centered, mono 12px.' },
    { name: 'row', el: 'div', parent: 'root', role: 'listitem', description: 'One change. display: contents so its four cells join the root grid. aria-label "radius.card changed from 12 to 20".' },
    { name: 'key', el: 'span', parent: 'row', description: 'Token name, secondary, truncates with an ellipsis.' },
    { name: 'from', el: 'del', parent: 'row', description: 'Old value: danger text, struck through (line in 50% of the text color), diff-remove fill, 4px inline padding, xs radius.' },
    { name: 'arrow', el: 'span', parent: 'row', description: 'A right arrow glyph, disabled-text color, aria-hidden.' },
    { name: 'to', el: 'ins', parent: 'row', description: 'New value: success text, no underline, diff-add fill, 4px inline padding, xs radius.' },
  ],
  props: {
    rows: { type: 'TokenDiffRow[]', required: true, description: '{ name: string; from: string; to: string }[].' },
  },
  styles: [
    { slot: 'root', expect: { gap: 4, font: 'mono', text: 'mono-relaxed' }, note: 'Row gap 4, column gap 8.' },
    { slot: 'key', expect: { fg: 'text.secondary' } },
    { slot: 'from', expect: { fg: 'diff.remove-text', bg: 'diff.remove-bg', padX: 4, radius: 'xs' } },
    { slot: 'arrow', expect: { fg: 'text.tertiary' } },
    { slot: 'to', expect: { fg: 'diff.add-text', bg: 'diff.add-bg', padX: 4, radius: 'xs' } },
  ],
  behavior: { pointer: ['read-only'] },
  a11y: {
    notes: [
      'The change is stated in the row aria-label ("changed from 12 to 20"); del and ins carry the removed / added semantics, so the colors are not the only signal.',
      'text.tertiary is used for the decorative arrow (not the disabled colour: nothing here is disabled).',
    ],
  },
  policies: ['P4', 'P6'],
  composition: {},
  examples: [],
  usage: [
    'Fixture requirements for render(props): the default render has the three specimen rows: radius.card 12 to 20, space.card.pad 24 to 32, radius.control 8 to 10.',
    'No example of its own: it appears inside the review dialog (modal#review-request).',
  ],
});
