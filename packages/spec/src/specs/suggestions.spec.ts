import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'suggestions',
  name: 'Suggestions',
  category: 'agent',
  status: 'ready',
  purpose: 'Quick prompts under the composer: a responsive row of glass cards, each with an icon, a short action and a one-line context hint.',
  description: 'Suggestions (the grid) and Suggestion (one card). A card is a button: pressing it runs the prompt (the product fills or submits the composer).',
  role: 'group',
  slots: [
    { name: 'root', el: 'div', role: 'group', description: 'Grid, 8px gap, columns auto-fit at a 150px minimum (repeat(auto-fit, minmax(150px, 1fr))).' },
    { name: 'item', el: 'button', parent: 'root', role: 'button', description: 'One suggestion: thin glass, toolbar (14px) radius, 10px 12px padding, grid with 4px gap, start-aligned text. Lifts 2px on hover (duration-base, ease-spring).' },
    { name: 'icon', el: 'any', parent: 'item', required: false, description: 'Leading lucide icon, 15px, accent text.' },
    { name: 'title', el: 'span', parent: 'item', description: 'The action, primary text.' },
    { name: 'hint', el: 'span', parent: 'item', required: false, description: 'Context hint on its own line: tertiary, small.' },
  ],
  states: {
    hover: { pseudo: ['hover'], target: 'item' },
    'focus-visible': { pseudo: ['focus', 'focus-visible'], target: 'item' },
  },
  props: {
    'aria-label': { type: 'string', default: 'Suggestions', description: 'Accessible name of the group.' },
    children: { type: 'ReactNode', required: true, description: 'Suggestion items.' },
    icon: { type: 'ReactNode', description: 'Suggestion prop. Leading icon.' },
    hint: { type: 'ReactNode', description: 'Suggestion prop. Context hint.' },
  },
  events: { onClick: { payload: 'React.MouseEvent<HTMLButtonElement>', when: 'a suggestion is activated (Suggestion prop)' } },
  styles: [
    { slot: 'root', expect: { gap: 8 } },
    { slot: 'item', expect: { material: 'thin', radius: 'toolbar', padX: 12, padY: 10, gap: 4, shadow: '1', text: 'ui-dense', fg: 'text.primary' }, note: 'Specimen font 12.5 / 17: ui-dense is 12.5 / 18. The glass shadow variable is elevation 1.' },
    { slot: 'item', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'icon', expect: { fg: 'accent.text', height: 'icon-md', width: 'icon-md' }, note: 'Specimen 15px; icon-md (16) used.' },
    { slot: 'hint', expect: { fg: 'text.tertiary', text: 'hint' } },
  ],
  behavior: {
    keyboard: { Enter: 'activate', Space: 'activate', Tab: 'moves between suggestions' },
    pointer: ['hover lifts the card 2px'],
    scenarios: [
      { name: 'click activates', steps: [{ do: 'click', slot: 'item' }], expect: [{ event: 'onClick', calls: 1 }] },
    ],
  },
  a11y: { notes: ['The accessible name of a card is its title plus hint text (the icon is aria-hidden).', 'Reduced motion removes the hover lift.'] },
  policies: ['P1', 'P6'],
  flags: { floating: true },
  usage: [
    'Fixture requirements for render(props): three Suggestion items (wand-sparkles "Generate 3 hero variants" / "from current theme"; contrast "Audit contrast" / "all frames · 3 themes"; file-code "Export to React" / "Tailwind tokens"); the first item carries the onClick handler used by probes. No example of its own: it is shown under the composer (composer#composer).',
    'Glass is allowed because the row floats over the canvas or the transcript; do not place it on an opaque inline surface.',
  ],
});
