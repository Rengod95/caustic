import { defineRecipe } from '../schema.ts';

export default defineRecipe({
  id: 'design-to-code',
  title: 'Design to code',
  intent: 'An agent turns a frame into code: its phases, the rendered result against the design, and the code it wrote.',
  regions: [
    {
      placement: 'transcript',
      purpose: 'The request and the agent’s progress through its phases, with tool calls as they run.',
      roles: ['agent.conversation', 'agent.plan', 'feedback.progress'],
      suggested: ['message', 'code-realization', 'tool-call', 'thinking'],
    },
    {
      placement: 'stage',
      purpose: 'The design frame next to the rendered code, to judge fidelity.',
      roles: ['canvas.surface', 'display.change'],
      suggested: ['compare-view', 'frame-label'],
    },
    {
      placement: 'end',
      purpose: 'The generated code as a diff the user accepts or rejects, and the export settings.',
      roles: ['display.code', 'display.change', 'agent.request'],
      suggested: ['side-panel', 'code-diff', 'agent-request', 'export-controls'],
    },
  ],
  notes: [
    'CodeRealization carries the phase strip; a separate Stepper beside it would repeat it.',
    'Keep the accept action on the diff itself so the decision sits next to the code.',
  ],
});
