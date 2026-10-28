import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'agent-cursor',
  intent: 'Show where the agent is acting on the canvas with a pointer and its name tag.',
  roles: ['agent.presence'],
  alsoFits: ['display.identity', 'canvas.annotation'],
  placement: ['canvas', 'overlay'],
  keywords: ['ai cursor', 'multiplayer cursor', 'pointer', 'presence', 'live cursor', 'collaborator'],
  pairs: ['agent-work-area', 'canvas-selection', 'canvas-artboard'],
  consider: [
    { id: 'agent-work-area', when: 'the point is which object the agent is editing, not where it points' },
    { id: 'avatar', when: 'the agent is shown in a list or header rather than on the canvas' },
  ],
  guidance: [
    'Place it next to the object the agent is working on, usually beside its AgentWorkArea.',
  ],
});
