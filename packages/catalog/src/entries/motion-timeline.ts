import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'motion-timeline',
  intent: 'A keyframe timeline: a ruler in seconds, one lane per animated layer or property, a playhead and a player bar.',
  roles: ['property.editor', 'display.data'],
  alsoFits: ['collection.list'],
  placement: ['inspector', 'overlay', 'stage'],
  keywords: ['animation', 'keyframes', 'timeline editor', 'scrubber', 'playhead', 'motion design', 'prototyping'],
  pairs: ['easing-curve', 'inspector-panel', 'dialog'],
  consider: [
    { id: 'easing-curve', when: 'tuning a single transition curve' },
    { id: 'timeline', when: 'showing events over time without editing them' },
  ],
  guidance: [
    'Playback starts only on user action and honours reduced motion; you can drive the playhead yourself.',
  ],
});
