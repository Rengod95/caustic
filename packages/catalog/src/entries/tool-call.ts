import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'tool-call',
  intent: 'One tool the agent ran, shown in the transcript as running, done with its time, or failed with a reason.',
  roles: ['agent.conversation', 'feedback.progress'],
  alsoFits: ['display.code', 'display.status'],
  placement: ['transcript', 'end'],
  keywords: ['function call', 'tool use', 'action', 'step', 'command run', 'api call'],
  pairs: ['message', 'thinking', 'code-diff', 'activity-tree'],
  consider: [
    { id: 'activity-tree', when: 'many calls are grouped under the plan steps that made them' },
    { id: 'progress', when: 'the work is not an agent tool, just a running task' },
  ],
  guidance: [
    'Pass progress only when the tool reports it; never simulate a percentage.',
    'Put the result (a diff, a log line, the failure detail) in children to make the call expandable.',
  ],
});
