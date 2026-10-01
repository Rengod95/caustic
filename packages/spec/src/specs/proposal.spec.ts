import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'proposal',
  name: 'Proposal',
  category: 'agent',
  status: 'ready',
  purpose: 'The plan-mode proposal card: the agent says in one or two sentences what it will build, summarises the footprint with chips, and waits for Build it or Edit plan.',
  description: 'An unapplied agent result, so it wears the spectrum rim (like CardAgent). Header: orb, "Proposal · <title>" and a mode badge. Body: serif summary and a chip row. Footer band: Build it (ink) and Edit plan (ghost). A clarification question may follow it in the transcript (see Clarification).',
  role: 'group',
  slots: [
    { name: 'root', el: 'div', role: 'group', description: 'Card: surface.base, xl radius, elevation 2, spectrum rim (agent-rim), overflow hidden.' },
    { name: 'header', el: 'div', parent: 'root', description: 'Flex row, centered, 8px gap, 10px 12px padding.' },
    { name: 'orb', el: 'span', parent: 'header', description: '12px spectrum orb, aria-hidden.' },
    { name: 'title', el: 'span', parent: 'header', description: '"Proposal · " followed by the title; semibold. Accessible name of the group.' },
    { name: 'badge', el: 'span', parent: 'header', required: false, description: 'Badge tone info ("Plan mode"), pushed to the end (margin-inline-start auto).' },
    { name: 'body', el: 'div', parent: 'root', description: 'Grid, 8px gap, padding 0 12px 10px.' },
    { name: 'summary', el: 'p', parent: 'body', description: 'What the agent will do: voice-sm serif.' },
    { name: 'chips', el: 'div', parent: 'body', required: false, description: 'Footprint chips ("+ 1 component", "4 layers"): wrapping row, 8px gap, Chip size sm soft.' },
    { name: 'footer', el: 'div', parent: 'root', description: 'Band: flex, 6px gap, 8px 12px padding, surface.raised fill, 1px top border in border.subtle.' },
    { name: 'build', el: 'button', parent: 'footer', role: 'button', description: 'Button ink xs "Build it".' },
    { name: 'edit', el: 'button', parent: 'footer', required: false, role: 'button', description: 'Button ghost xs "Edit plan".' },
  ],
  props: {
    title: { type: 'ReactNode', required: true, description: 'Proposal name; the component prefixes "Proposal · ".' },
    badge: { type: 'ReactNode', description: 'Header badge text (Badge tone info), e.g. "Plan mode".' },
    chips: { type: 'ReactNode', description: 'Chip elements for the footprint row.' },
    buildLabel: { type: 'ReactNode', default: 'Build it', description: 'Label of the primary action.' },
    editLabel: { type: 'ReactNode', default: 'Edit plan', description: 'Label of the secondary action; pass null to hide it.' },
    children: { type: 'ReactNode', required: true, description: 'The summary sentence(s).' },
  },
  events: {
    onBuild: { payload: 'void', when: 'the primary action is pressed' },
    onEdit: { payload: 'void', when: 'the secondary action is pressed' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'surface.base', radius: 'xl', shadow: '2', agentRim: true } },
    { slot: 'header', expect: { padX: 12, padY: 10, gap: 8, text: 'ui-dense', weight: 600, fg: 'text.primary' } },
    { slot: 'orb', expect: { height: 12, width: 12, radius: 'full' } },
    { slot: 'body', expect: { padX: 12, gap: 8 }, note: 'Padding is 0 12px 10px (padY cannot express the asymmetry).' },
    { slot: 'summary', expect: { font: 'voice', text: 'voice-sm', fg: 'text.primary' } },
    { slot: 'chips', expect: { gap: 8 } },
    { slot: 'footer', expect: { bg: 'surface.raised', border: 'border.subtle', padX: 12, padY: 8, gap: 6 } },
  ],
  behavior: {
    keyboard: { Tab: 'moves to Build it then Edit plan', Enter: 'activate', Space: 'activate' },
    scenarios: [
      { name: 'Build it', steps: [{ do: 'click', slot: 'build' }], expect: [{ event: 'onBuild', calls: 1 }] },
      { name: 'Edit plan', steps: [{ do: 'click', slot: 'edit' }], expect: [{ event: 'onEdit', calls: 1 }] },
    ],
  },
  a11y: {
    attrs: { root: ['aria-labelledby'] },
    notes: [
      'Provenance is also stated in text ("Proposal"); the rim and orb are decorative. Reduced motion freezes both.',
      'The summary is agent prose in the voice serif; the chips are plain read-only labels (not buttons).',
    ],
  },
  policies: ['P2', 'P4', 'P6', 'P8'],
  flags: { agent: true, motionLoop: true },
  composition: { uses: ['button', 'badge', 'chip', 'clarification'] },
  examples: [{ id: 'proposal-and-clarification', title: 'Proposal & clarification', doc: 'proposal#proposal-and-clarification' }],
  usage: [
    'Fixture requirements for render(props): the default render has title "Add saved cards", badge "Plan mode", the summary "I’ll add a list of up to three saved cards above the form, with an “Add card” row.", two chips (Chip size sm soft: "+ 1 component", "4 layers") and both actions.',
    'Example "proposal-and-clarification": a grid with 14px gap holding the Proposal above and a Clarification with question "Should saved cards show the expiry date?" and options "Show expiry" / "“Visa •••• 4242 · 08/27”" (selected) and "Hide expiry" / "Shorter rows, details on tap". The curly quotes and bullets are literal text.',
    'The proposal exists only in plan mode. Once the person presses Build it, the parent replaces it with the plan and tool calls; do not keep the rim on a built proposal.',
  ],
});
