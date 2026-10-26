import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'contrast-chip',
  name: 'ContrastChip',
  category: 'primitive',
  status: 'ready',
  purpose: 'States the WCAG result of one color pair in a chip: the level it reaches ("AA") and the measured ratio ("5.1 : 1"). Green when it passes, yellow when it passes for large text only (AA large), red when it fails.',
  description: 'Read-only, compact (24px). Used next to a token or a color field in binding UIs. For the large ratio readout with all levels and a fix suggestion use ContrastInsight.',
  role: null,
  slots: [
    { name: 'root', el: 'span', description: 'The chip: inline flex, 24px, 4px start / 8px end padding, 6px gap, md radius, soft tint with matching text.' },
    { name: 'level', el: 'span', parent: 'root', description: 'The WCAG level badge ("AA"): the tone\'s soft fill and text colour with a 1px tone border (6) edge, xs radius, 4px inline padding, 16px tall.' },
    { name: 'label', el: 'span', parent: 'root', description: 'The ratio ("5.1 : 1") and, on failure or a large-only pass, the verdict ("2.9 : 1 · fails", "3.4 : 1 · large text"). The text, not the color, carries the result.' },
  ],
  variants: {
    result: { values: ['pass', 'large', 'fail'], default: 'pass', description: 'large = meets the level for large text only (warning tint); fail = danger tint and a danger level badge.' },
  },
  props: {
    result: { type: "'pass' | 'large' | 'fail'", default: 'pass', description: 'Whether the pair meets the level, meets it for large text only, or fails.' },
    level: { type: 'string', default: 'AA', description: 'The level badge text.' },
    children: { type: 'ReactNode', required: true, description: 'Ratio text; add the verdict for a failing pair ("2.9 : 1 · fails").' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'success.soft', fg: 'success.text', radius: 'md', height: 'control-xs', gap: 6, padStart: 4, padEnd: 8, text: 'hint', weight: 500 }, note: 'Specimen radius is 7px (between sm 6 and md 8); md is used.' },
    { slot: 'root', when: { result: 'large' }, expect: { bg: 'warning.soft', fg: 'warning.text' } },
    { slot: 'root', when: { result: 'fail' }, expect: { bg: 'danger.soft', fg: 'danger.text' } },
    { slot: 'level', expect: { bg: 'success.soft', fg: 'success.text', edge: 'success.border', radius: 'xs', height: 'icon-md', padX: 4, text: 'micro' }, note: 'Same fill as ContrastInsight\'s level badge (soft 3, text 11); the border 6 edge separates it from the soft 3 chip.' },
    { slot: 'level', when: { result: 'large' }, expect: { bg: 'warning.soft', fg: 'warning.text', edge: 'warning.border' } },
    { slot: 'level', when: { result: 'fail' }, expect: { bg: 'danger.soft', fg: 'danger.text', edge: 'danger.border' } },
  ],
  behavior: { pointer: ['read-only'] },
  a11y: {
    notes: [
      'The result is in the text: "5.1 : 1" for a pass, "3.4 : 1 · large text" for a large-only pass and "2.9 : 1 · fails" for a failure; the tint is redundant.',
      'Soft fill with matching text keeps 4.5:1 in both themes; the level badge pairs soft 3 with text 11 (4.5:1 or more).',
    ],
  },
  policies: ['P6'],
  composition: {},
  examples: [],
  usage: [
    'Fixture render(props): result pass, level "AA", children "5.1 : 1". The fail variant renders "2.9 : 1 · fails", the large variant "3.4 : 1 · large text".',
    'No example of its own: both chips sit in the token binding doc frame (token-binding#token-binding) together with a color field that has no Caustic component yet, so that section is not reproducible.',
  ],
});
