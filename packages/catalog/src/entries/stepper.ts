import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'stepper',
  intent: 'Show progress through a sequence of steps, or the live checklist of what the agent will do.',
  roles: ['navigation.steps', 'agent.plan'],
  alsoFits: ['feedback.progress'],
  placement: ['page', 'overlay', 'card', 'transcript', 'end'],
  keywords: ['steps', 'wizard', 'step indicator', 'progress steps', 'onboarding', 'checklist', 'task list'],
  pairs: ['dialog', 'button', 'card', 'progress'],
  consider: [
    { id: 'plan', when: 'it is the agent plan with its header' },
    { id: 'tabs', when: 'the user moves freely between sections in any order' },
    { id: 'timeline', when: 'it records what already happened, newest first' },
  ],
  guidance: [
    'It only shows progress; pair it with buttons or tabs for moving between steps.',
    'The checklist look with tone="agent" lights the running step; the spectrum stays for agent work.',
  ],
});
