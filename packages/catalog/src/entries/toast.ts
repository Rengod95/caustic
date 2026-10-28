import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'toast',
  intent: 'A short confirmation or error that floats in at the bottom end of the screen and leaves on its own.',
  roles: ['feedback.transient'],
  placement: ['overlay'],
  keywords: ['snackbar', 'notification', 'flash message', 'notice', 'popup message'],
  pairs: ['button'],
  consider: [
    { id: 'alert', when: 'the message must stay until the situation changes' },
  ],
  guidance: [
    'Mount one Toaster, then call toast({ tone, title, description, actionLabel }) from anywhere.',
    'One title, one line of detail and at most one action.',
  ],
});
