import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'progress',
  name: 'Progress',
  category: 'data',
  status: 'ready',
  purpose: 'Shows how far a task has gone. Indeterminate when the amount is unknown; agent tone for agent work.',
  role: 'progressbar',
  slots: [
    { name: 'root', el: 'div', role: 'progressbar', description: 'Track.' },
    { name: 'indicator', el: 'span', parent: 'root', description: 'Filled part.' },
  ],
  variants: { tone: { values: ['default', 'info', 'success', 'warning', 'danger', 'agent'], default: 'default', description: 'default = accent solid; info / success / warning / danger = the status solid 9 (informational, finished, at risk, failed); agent = the spectrum.' } },
  states: { indeterminate: { props: { indeterminate: true } } },
  props: {
    value: { type: 'number', description: '0–100.' },
    indeterminate: { type: 'boolean', description: 'Unknown amount. Never simulate a number.' },
    tone: { type: "'default' | 'info' | 'success' | 'warning' | 'danger' | 'agent'", default: 'default', description: 'Status tones fill with the status solid; agent tone uses the spectrum.' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'neutral.track', radius: 'sm', height: 'size-progress-h' } },
    { slot: 'indicator', expect: { bg: 'accent.solid' } },
    { slot: 'indicator', when: { tone: 'info' }, expect: { bg: 'info.solid' } },
    { slot: 'indicator', when: { tone: 'success' }, expect: { bg: 'success.solid' } },
    { slot: 'indicator', when: { tone: 'warning' }, expect: { bg: 'warning.solid' } },
    { slot: 'indicator', when: { tone: 'danger' }, expect: { bg: 'danger.solid' } },
  ],
  behavior: {
    scenarios: [
      { name: 'reports value', props: { value: 40 }, steps: [], expect: [{ attr: { 'aria-valuenow': '40' } }] },
      { name: 'indeterminate has no value', props: { indeterminate: true }, steps: [], expect: [{ attr: { 'aria-valuenow': null, 'data-state': 'indeterminate' } }] },
    ],
  },
  a11y: { labelRequired: true },
  policies: ['P2', 'P8'],
  flags: { agent: { tone: ['agent'] }, motionLoop: true },
  usage: ['If progress is unknown, use indeterminate. Do not invent a number.'],
});
