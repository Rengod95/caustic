import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'slider',
  intent: 'Set a number on a range by dragging, or step through a few named levels.',
  roles: ['input.number', 'property.editor'],
  alsoFits: ['input.color', 'choice.single'],
  placement: ['inspector', 'form', 'toolbar', 'overlay'],
  keywords: ['range slider', 'range input', 'fader', 'scrubber', 'opacity slider', 'hue slider', 'step slider', 'level picker', 'effort'],
  pairs: ['number-field', 'property-stack', 'section-header', 'color-picker'],
  consider: [
    { id: 'number-field', when: 'the exact value matters more than the feel of dragging' },
    { id: 'segmented-control', when: 'a few levels should all be readable as labels at once' },
    { id: 'channel-slider', when: 'it edits one channel of a colour inside a colour picker' },
  ],
  guidance: [
    'label with field makes the inspector row with a synced number field; bare, it is the control alone.',
    'Gradient and alpha tracks show the sampled colour in the thumb; pass thumbColor for the current value.',
  ],
});
