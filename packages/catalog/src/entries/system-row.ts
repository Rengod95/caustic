import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'system-row',
  intent: 'Show something the system did in a chat transcript as one quiet line with a muted icon and at most one action.',
  roles: ['agent.conversation'],
  placement: ['transcript'],
  keywords: ['system message', 'event row', 'transcript event', 'signal', 'handover', 'notice line'],
  pairs: ['message', 'activity-tree'],
  consider: [
    { id: 'message', when: 'the line is spoken by a person or the agent' },
    { id: 'alert', when: 'the notice needs attention and should stay visible above the transcript' },
  ],
  guidance: [
    'Keep it to one line; the detail belongs in what the single action opens.',
  ],
});
