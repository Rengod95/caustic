import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'status-dot',
  name: 'StatusDot',
  category: 'primitive',
  status: 'ready',
  purpose: 'A small status dot followed by its words: a state in a table cell, a map cell or a runtime row. The tone is on the dot only; the label is quiet secondary text. Lighter than a Badge, which draws a whole pill.',
  role: null,
  slots: [
    { name: 'root', el: 'span', description: 'Inline flex row, items centred, 6px gap, nowrap. Carries data-tone.' },
    { name: 'dot', el: 'span', parent: 'root', description: 'A 6px circle (aria-hidden) in the tone graphic colour; it never carries the meaning alone.' },
    { name: 'label', el: 'span', parent: 'root', description: 'The state in words: ui-dense, text.secondary in every tone.' },
  ],
  variants: {
    tone: { values: ['neutral', 'success', 'warning', 'danger', 'info'], default: 'neutral', description: 'Colour of the dot only: neutral.graphic, success.graphic, warning.graphic, danger.graphic or info.graphic. The label stays text.secondary.' },
  },
  states: {},
  props: {
    tone: { type: "'neutral' | 'success' | 'warning' | 'danger' | 'info'", default: 'neutral', description: 'Colour of the dot.' },
    label: { type: 'ReactNode', required: true, description: 'The state in words, e.g. "On" or "On · 2 failures".' },
  },
  styles: [
    { slot: 'root', expect: { gap: 6 } },
    { slot: 'dot', expect: { bg: 'neutral.graphic', radius: 'full', height: 6, width: 6 } },
    { slot: 'dot', when: { tone: 'success' }, expect: { bg: 'success.graphic' } },
    { slot: 'dot', when: { tone: 'warning' }, expect: { bg: 'warning.graphic' } },
    { slot: 'dot', when: { tone: 'danger' }, expect: { bg: 'danger.graphic' } },
    { slot: 'dot', when: { tone: 'info' }, expect: { bg: 'info.graphic' } },
    { slot: 'label', expect: { fg: 'text.secondary', text: 'ui-dense' } },
    { slot: 'label', when: { tone: 'danger' }, expect: { fg: 'text.secondary' }, note: 'The tone never reaches the text.' },
  ],
  behavior: {
    scenarios: [
      { name: 'tone is reflected', props: { tone: 'warning' }, steps: [], expect: [{ slot: 'root', attr: { 'data-tone': 'warning' } }] },
    ],
  },
  a11y: { labelRequired: false, notes: ['The state is the label text; the dot is decorative (aria-hidden) so colour alone never carries it.'] },
  policies: ['P6'],
  flags: {},
  examples: [],
  usage: [
    'Use StatusDot for a state beside other cells (a table status column, a map cell); use Badge when the state is the focus of its row.',
    'Put the whole state in the label ("On · 2 failures"); the tone only repeats it.',
  ],
});
