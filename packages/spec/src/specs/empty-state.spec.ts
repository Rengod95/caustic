import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'empty-state',
  name: 'EmptyState',
  category: 'structure',
  status: 'ready',
  purpose: 'Fills a region that has no content yet (or no results): icon tile, one-line title, a short reason and the next action. Dashed outline, no fill.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Centered grid with a 1px dashed border.strong outline drawn inside the edge (outline-offset -1px).' },
    { name: 'icon', el: 'span', parent: 'root', required: false, description: 'Rounded tile with a 22px lucide glyph.' },
    { name: 'title', el: 'b', parent: 'root', description: 'What is missing.' },
    { name: 'description', el: 'p', parent: 'root', required: false, description: 'Reason and what to do; max 40ch.' },
    { name: 'actions', el: 'div', parent: 'root', required: false, description: 'One or two buttons, centered, 8px gap.' },
  ],
  variants: {
    size: { values: ['md', 'sm'], default: 'md', description: 'md = empty page or panel; sm = empty search or filter result inside a list.' },
  },
  props: {
    size: { type: "'md' | 'sm'", default: 'md', description: 'Padding, tile and title size.' },
    icon: { type: 'ReactNode', description: 'Glyph inside the tile.' },
    title: { type: 'ReactNode', required: true, description: 'Short statement of what is missing.' },
    description: { type: 'ReactNode', description: 'One or two sentences.' },
    actions: { type: 'ReactNode', description: 'Buttons.' },
  },
  styles: [
    { slot: 'root', expect: { radius: '2xl', padX: 16, padY: 28, gap: 10 }, note: 'Outline 1px dashed border.strong, offset -1px (an outline, not a border); transparent background. Text and items centered.' },
    { slot: 'root', when: { size: 'sm' }, expect: { padY: 18 } },
    { slot: 'icon', expect: { bg: 'fill.pressed', fg: 'text.secondary', radius: 'xl', height: 'control-xl', width: 'control-xl' }, note: 'Glyph is 22px: no token, see token requests (size-empty-glyph).' },
    { slot: 'icon', when: { size: 'sm' }, expect: { height: 'control-lg', width: 'control-lg' } },
    { slot: 'title', expect: { text: 'title-3', fg: 'text.primary' } },
    { slot: 'title', when: { size: 'sm' }, expect: { text: 'title-4' }, note: 'Specimen: title-3 with font-size 13.5px; token request title-4 (13.5 / 20 / 600).' },
    { slot: 'description', expect: { text: 'ui-relaxed', fg: 'text.secondary' }, note: 'max-width 40ch; margin 0.' },
    { slot: 'actions', expect: { gap: 8 } },
  ],
  a11y: {
    notes: [
      'The glyph is decorative (aria-hidden); the title carries the meaning.',
      'Not a live region; when results change after typing, announce the count elsewhere.',
    ],
  },
  policies: ['P6'],
  composition: { uses: ['button'] },
  examples: [{ id: 'empty-state', title: 'Empty state', doc: 'empty-state#empty-state' }],
  usage: [
    'Say why it is empty, then give the next step; at most one primary action.',
    'Example fixture: md with folder-open, "No projects yet", the description, Button ink sm (plus, "New project") + Button agent sm (wand-sparkles, "Describe a screen"), actions centered; then sm with search-x, `No tokens match “brnd”` (curly quotes), "Check the spelling or clear the filter." and Button secondary xs "Clear filter". The two are stacked with a 14px gap (frame).',
    '`uses: button` is for the example fixture only; EmptyState itself takes actions as children.',
  ],
});
