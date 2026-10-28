import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'card',
  intent: 'Group related content into one surface: a static card, a whole-card link or a whole-card choice.',
  roles: ['layout.container'],
  alsoFits: ['choice.single', 'navigation.local', 'display.metric', 'agent.request'],
  placement: ['page', 'stage', 'end', 'start', 'card'],
  keywords: ['tile', 'panel', 'box', 'surface', 'feature card', 'link card'],
  pairs: ['card-stat', 'button', 'badge', 'avatar', 'section-header', 'list'],
  consider: [
    { id: 'card-stat', when: 'the card shows one KPI with a delta and a sparkline' },
    { id: 'list', when: 'many similar items should read as rows rather than tiles' },
    { id: 'empty-state', when: 'the card is an add or empty placeholder with next steps' },
  ],
  guidance: [
    'CardLink makes the whole card one target; CardChoice makes the whole card one choice.',
    'variant="glass" floats over a stage; variant="agent" marks content an agent produced.',
    'The root sets the inset and the gap between sections; parts carry no outer padding.',
  ],
});
