import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'number-field',
  intent: 'The value field for numbers: scrub the label, step with arrows, commit on Enter, with mixed, locked and invalid states.',
  roles: ['input.number', 'property.editor'],
  alsoFits: ['input.text'],
  placement: ['inspector', 'form', 'toolbar', 'inline'],
  keywords: ['numeric input', 'scrubber', 'spinner', 'stepper', 'quantity', 'dimension', 'spin button'],
  pairs: ['inspector-panel', 'position-size', 'slider', 'field'],
  consider: [
    { id: 'slider', when: 'a bounded range is easier to judge by position than by number' },
    { id: 'input', when: 'the digits are free text such as a phone number or an ID' },
  ],
  guidance: [
    'Use commitMode "release" in editors so one scrub or drag commits once and makes one undo step.',
    'For small whole-number quantities in forms, use appearance="stepper".',
  ],
});
