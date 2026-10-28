import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'timeline',
  intent: 'A newest-first history on one spine: checkpoints to restore, a revision to pick, or a feed of who did what.',
  roles: ['agent.plan', 'display.change'],
  alsoFits: ['collection.list', 'choice.single'],
  placement: ['end', 'start', 'page', 'card'],
  keywords: ['version history', 'checkpoints', 'revision history', 'activity feed', 'audit log', 'changelog', 'undo history', 'restore'],
  pairs: ['avatar', 'side-panel', 'button', 'plan'],
  consider: [
    { id: 'activity-tree', when: 'the view is a live run with tool calls nested under plan steps' },
    { id: 'list', when: 'the items have no time order worth a spine' },
    { id: 'plan', when: 'the items are steps still to come rather than things that happened' },
  ],
  guidance: [
    'Use one layout per timeline: give every entry a marker or none, so the spine stays continuous.',
    'With selectionMode="single", restore from the footer; an option row cannot hold its own button.',
  ],
});
