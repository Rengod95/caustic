import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'activity-tree',
  intent: 'Show an agent run as its plan steps with each tool call nested under the step that made it.',
  roles: ['agent.plan', 'collection.tree'],
  alsoFits: ['feedback.progress', 'display.data'],
  placement: ['end', 'transcript', 'card'],
  keywords: ['run log', 'trace', 'execution tree', 'task tree', 'agent steps', 'worker status'],
  pairs: ['plan', 'tool-call', 'message', 'timeline'],
  consider: [
    { id: 'plan', when: 'people only need the steps and their progress, not the calls behind them' },
    { id: 'tool-call', when: 'one call is shown on its own in the transcript, with its result' },
    { id: 'timeline', when: 'the view is a history of finished checkpoints or revisions' },
  ],
  guidance: [
    'Pass nodes in run order; a call that matches no step stays where it ran and reads as unassigned.',
    'Only live work shimmers, so a finished run shows no active step and no worker line.',
  ],
});
