import { defineRecipe } from '../schema.ts';

export default defineRecipe({
  id: 'agent-session',
  title: 'Agent session',
  intent: 'A coding or design session with an agent: past sessions, the live transcript and a review pane for what changed.',
  regions: [
    {
      placement: 'start',
      purpose: 'Sessions grouped by day, with run status, plus checkpoints the user can restore.',
      roles: ['navigation.local', 'display.change', 'action.icon'],
      suggested: ['side-panel', 'list-navigation', 'timeline', 'icon-button'],
    },
    {
      placement: 'stage',
      purpose: 'A slim header over the transcript: session title, where it runs, its live status and options.',
      roles: ['layout.structure', 'display.status', 'action.icon'],
      suggested: ['chip', 'icon-button', 'menu'],
    },
    {
      placement: 'transcript',
      purpose: 'The exchange itself: messages, reasoning, tool calls, the plan, diffs and requests for approval.',
      roles: ['agent.conversation', 'agent.plan', 'agent.request', 'display.code'],
      suggested: ['scroll-area', 'message', 'thinking', 'tool-call', 'plan', 'activity-tree', 'agent-request', 'choice-group', 'code-diff'],
    },
    {
      placement: 'transcript',
      purpose: 'The prompt area pinned under the transcript: suggested next prompts and the composer with context chips.',
      roles: ['agent.conversation', 'agent.suggestion'],
      suggested: ['suggestions', 'composer', 'chip'],
    },
    {
      placement: 'end',
      purpose: 'Review of the agent work: preview, revisions, structural changes, policy findings, context use and model.',
      roles: ['display.change', 'feedback.findings', 'agent.plan', 'input.pick'],
      suggested: ['side-panel', 'timeline', 'change-detail', 'policy-findings', 'context-analytics', 'combobox', 'button'],
    },
  ],
  notes: [
    'Keep the transcript in one centred column (about 42rem) so prose, tool calls and diffs share one reading line.',
    'Agent tone and spectrum light appear only on agent things: its messages, requests, cursor and its own actions.',
    'Questions the agent asks inline use ChoiceGroup appearance="answer"; approvals use AgentRequest, not a dialog.',
    'Hide the side panels at narrow widths before shrinking the transcript.',
  ],
  reference: 'apps/docs/src/showcase/samples/agent.tsx',
});
