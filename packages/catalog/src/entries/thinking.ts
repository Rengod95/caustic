import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'thinking',
  intent: 'Show the agent reasoning as a collapsible aside that shimmers while the agent is still thinking.',
  roles: ['agent.conversation', 'feedback.progress'],
  alsoFits: ['layout.container'],
  placement: ['transcript'],
  keywords: ['reasoning', 'chain of thought', 'thoughts', 'scratchpad', 'deliberation', 'working'],
  pairs: ['message', 'tool-call', 'plan'],
  consider: [
    { id: 'tool-call', when: 'the agent is running a tool rather than reasoning' },
    { id: 'accordion', when: 'the collapsible text is ordinary content, not agent reasoning' },
  ],
  guidance: [
    'Switch to status="done" with a duration label as soon as the thought ends, so nothing finished shimmers.',
  ],
});
