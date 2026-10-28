import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'canvas-comment',
  intent: 'A comment pinned to a spot on the canvas, by a person or the agent, that opens into a speech bubble.',
  roles: ['canvas.annotation'],
  alsoFits: ['agent.conversation', 'display.identity', 'feedback.inline'],
  placement: ['canvas', 'overlay'],
  keywords: ['comment pin', 'annotation', 'sticky note', 'review note', 'feedback pin', 'thread', 'callout'],
  pairs: ['frame-label', 'canvas-artboard', 'avatar', 'message'],
  consider: [
    { id: 'message', when: 'the remark belongs to the conversation, not to a place on the design' },
    { id: 'tooltip', when: 'the text is a short hint on a control rather than an authored note' },
  ],
  guidance: [
    'Set author="agent" for agent comments so the two authors read apart on the canvas.',
  ],
});
