import { defineRecipe } from '../schema.ts';

export default defineRecipe({
  id: 'canvas-review',
  title: 'Canvas review',
  intent: 'Review a design change on the canvas: before and after, comments, where the agent worked, and the findings.',
  regions: [
    {
      placement: 'canvas',
      purpose: 'The frames under review, with comment pins and the agent work area over what it changed.',
      roles: ['canvas.surface', 'canvas.annotation', 'agent.presence'],
      suggested: ['canvas-artboard', 'frame-label', 'canvas-comment', 'agent-work-area', 'agent-cursor', 'canvas-selection'],
    },
    {
      placement: 'stage',
      purpose: 'A before and after comparison of one frame, side by side or with a split divider.',
      roles: ['canvas.surface', 'display.change'],
      suggested: ['compare-view', 'segmented-control'],
    },
    {
      placement: 'overlay',
      purpose: 'Floating review tools: comment, compare, zoom.',
      roles: ['canvas.control'],
      suggested: ['floating-bar', 'zoom-control', 'tooltip'],
    },
    {
      placement: 'end',
      purpose: 'What changed and what to decide: structural and token changes, policy and contrast findings, the approval.',
      roles: ['display.change', 'display.token', 'feedback.findings', 'agent.request'],
      suggested: ['side-panel', 'change-detail', 'token-diff', 'policy-findings', 'contrast-insight', 'reading-order', 'agent-request'],
    },
  ],
  notes: [
    'Show agent edits with AgentWorkArea and AgentCursor so they never read as the user’s own selection.',
    'Token changes read best in TokenDiff; line-level code changes belong in CodeDiff.',
    'Approve or reject through AgentRequest in the panel, close to the findings it depends on.',
  ],
});
