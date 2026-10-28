import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'message',
  intent: 'One turn of the agent conversation: the person in a bubble, the agent in prose with a meta row to copy or retry.',
  roles: ['agent.conversation'],
  alsoFits: ['display.identity'],
  placement: ['transcript', 'end'],
  keywords: ['chat bubble', 'reply', 'turn', 'chat message', 'response', 'assistant message', 'transcript'],
  pairs: ['thinking', 'tool-call', 'composer', 'plan', 'agent-request', 'suggestions'],
  consider: [
    { id: 'canvas-comment', when: 'the remark belongs to a spot on the canvas rather than the conversation' },
    { id: 'timeline', when: 'the turns are a feed of who did what, not a conversation' },
  ],
  guidance: [
    'Place Thinking as its own component between the person message and the agent reply.',
    'Write inline code in agent prose with MessageCode so it takes the mono voice.',
  ],
});
