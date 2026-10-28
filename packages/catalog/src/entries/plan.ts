import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'plan',
  intent: 'The live checklist of what the agent will do, with a title and an "N of M" count.',
  roles: ['agent.plan', 'feedback.progress'],
  alsoFits: ['navigation.steps'],
  placement: ['transcript', 'end', 'card'],
  keywords: ['todo list', 'task list', 'checklist', 'agent steps', 'roadmap', 'to-do'],
  pairs: ['message', 'activity-tree', 'tool-call', 'agent-request'],
  consider: [
    { id: 'stepper', when: 'the checklist is not the agent\'s work, such as onboarding or a setup flow' },
    { id: 'activity-tree', when: 'people also need the tool calls made under each step' },
  ],
  guidance: [
    'People read it; the agent advances it, so update step statuses rather than adding controls.',
  ],
});
