import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'code-realization',
  intent: 'Follow the agent turning a design into code: phase progress, the files it will write, what it could not do, and the download.',
  roles: ['agent.plan', 'display.code'],
  alsoFits: ['navigation.steps', 'feedback.progress'],
  placement: ['end', 'transcript', 'overlay'],
  keywords: ['code export', 'handoff', 'generate code', 'design to code', 'codegen', 'download zip', 'build output'],
  pairs: ['code-diff', 'agent-request', 'plan', 'export-controls'],
  consider: [
    { id: 'export-controls', when: 'people export assets or tokens directly, without an agent writing code' },
    { id: 'code-diff', when: 'people need to read the actual lines of one file' },
    { id: 'stepper', when: 'the steps are a general sequence with no files or download' },
  ],
  guidance: [
    'File rows are summaries; open the lines of a file in a CodeDiff next to it.',
    'Give limits their own warning file row so what could not be realized is not missed.',
  ],
});
