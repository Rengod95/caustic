import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'progress',
  intent: 'Show that work is loading or running and, when known, how far it has gone: a bar or a small ring.',
  roles: ['feedback.progress'],
  alsoFits: ['display.metric'],
  placement: ['inline', 'toolbar', 'card', 'page', 'transcript'],
  keywords: ['spinner', 'loader', 'loading bar', 'progress bar', 'busy indicator', 'activity indicator'],
  pairs: ['button', 'file-upload', 'alert', 'skeleton'],
  consider: [
    { id: 'skeleton', when: 'a region is loading and its layout is already known' },
    { id: 'stepper', when: 'the progress is a sequence of named steps' },
  ],
  guidance: [
    'Leave value unset when the amount is unknown; never invent a number.',
    'The ring fits inline, in toolbars or while a region loads; the bar fits files, steps and long tasks.',
    'Inside a control, mark it decorative and let the control carry aria-busy.',
  ],
});
