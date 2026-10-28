import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'avatar',
  intent: 'Show who someone is with an identity colour and initials, or mark the agent with its spectrum core.',
  roles: ['display.identity'],
  alsoFits: ['agent.presence', 'display.status'],
  placement: ['card', 'transcript', 'titlebar', 'inline', 'canvas'],
  keywords: ['profile picture', 'user icon', 'initials', 'persona', 'avatar stack', 'collaborators', 'facepile'],
  pairs: ['message', 'list', 'badge', 'canvas-comment', 'tooltip'],
  consider: [
    { id: 'agent-cursor', when: 'it shows where the agent is working on the canvas' },
  ],
  guidance: [
    'People get identity colours; the spectrum core is for the agent.',
    'Overlapping stacks touch without a ring; give the stack its own gap when it needs separation.',
  ],
});
