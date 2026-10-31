import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'meter',
  name: 'Meter',
  category: 'data',
  status: 'ready',
  purpose: 'A gauge for a bounded measurement that is not task progress: a budget spent, a quota left, a time used against a limit. The bar tone follows thresholds (normal, warning, danger); the label and value stay neutral text.',
  role: 'meter',
  slots: [
    { name: 'root', el: 'div', role: 'meter', description: 'The track (role="meter" with aria-valuenow, min 0, max). Needs an accessible name (aria-label).' },
    { name: 'indicator', el: 'span', parent: 'root', description: 'The filled part, width from the value over max (clamped 0 to max). Its colour is the threshold level.' },
  ],
  variants: {
    level: { values: ['normal', 'warning', 'danger'], default: 'normal', description: 'Resolved from value and thresholds unless the level prop forces it: value at or over max is danger; at or over high, or at or under low, is warning; otherwise normal. Colours the bar only.' },
  },
  sizes: { values: ['sm', 'md'], default: 'md' },
  states: {},
  props: {
    value: { type: 'number', description: 'Current measurement, 0 to max.' },
    max: { type: 'number', default: '100', description: 'Upper bound. A value at or over max reads danger.' },
    low: { type: 'number', description: 'A value at or under this reads warning (a quota that is running out).' },
    high: { type: 'number', description: 'A value at or over this reads warning (a budget that is half spent: pass 50% of max).' },
    level: { type: "'normal' | 'warning' | 'danger'", description: 'Force a level; unset resolves it from value, low, high and max.' },
    size: { type: "'sm' | 'md'", default: 'md', description: 'Bar height: sm 4px, md size-progress-h (6px).' },
    label: { type: 'string', description: 'Accessible name (aria-label).' },
    valueText: { type: 'string', description: 'Human text for the value (aria-valuetext), e.g. "6.2 of 10 hours".' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'neutral.track', radius: 'full', height: 'size-progress-h' } },
    { slot: 'indicator', expect: { bg: 'neutral.solid' } },
    { slot: 'indicator', when: { level: 'warning' }, expect: { bg: 'warning.solid' } },
    { slot: 'indicator', when: { level: 'danger' }, expect: { bg: 'danger.solid' } },
    { slot: 'root', when: { size: 'sm' }, expect: { height: 4 } },
  ],
  behavior: {
    scenarios: [
      { name: 'reports value and max', props: { value: 40, max: 80 }, steps: [], expect: [{ attr: { 'aria-valuenow': '40', 'aria-valuemax': '80', 'aria-valuemin': '0' } }] },
      { name: 'clamps to max', props: { value: 150, max: 100 }, steps: [], expect: [{ attr: { 'aria-valuenow': '100' } }] },
      { name: 'forced level shows on the root', props: { value: 10, level: 'danger' }, steps: [], expect: [{ attr: { 'data-level': 'danger' } }] },
    ],
  },
  a11y: { labelRequired: true, notes: ['The level is also in aria-valuetext when the consumer passes valueText; colour alone never carries it.'] },
  policies: ['P2', 'P6', 'P8'],
  flags: {},
  examples: [],
  usage: [
    'Use Meter for a measurement against a limit; use Progress for work that is running.',
    'Pass high as 50% of max for a budget, so half spent reads warning and the full budget reads danger.',
    'Put the value and unit in text beside the bar; the tone is only on the bar.',
  ],
});
