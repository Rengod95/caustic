import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'gradient-editor',
  intent: 'Edit a gradient on its preview: drag handles and stops, switch linear, radial or angular, set the angle, tune each stop.',
  roles: ['input.color', 'property.editor'],
  placement: ['inspector', 'overlay', 'end'],
  keywords: ['color stops', 'linear gradient', 'radial gradient', 'conic gradient', 'angular', 'gradient picker'],
  pairs: ['color-picker', 'paint-well', 'property-stack', 'angle-dial'],
  consider: [
    { id: 'color-picker', when: 'the paint is a single flat colour' },
  ],
  guidance: [
    'Use commitMode "release" so a drag on the preview, strip or dial is one undo step.',
  ],
});
