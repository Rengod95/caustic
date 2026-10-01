import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'review-request',
  name: 'ReviewRequest',
  category: 'agent',
  status: 'ready',
  purpose: 'The agent asks the person to review a batch of changes: orb, a count title, a one-line source, toned summary chips, the token diff, and Reject / Approve all.',
  description: 'ReviewDialog. A floating thick-glass panel (non-modal: it does not trap focus; the canvas stays usable). It is the batched counterpart of PermissionRequest: one decision for many changes, with the changes listed. Use Modal for forms and confirmations that are not an agent review.',
  role: 'dialog',
  slots: [
    { name: 'root', el: 'div', role: 'dialog', description: 'Thick glass, 3xl radius, regular inset (14 / 15), grid with 12px gap, elevation 4. aria-labelledby the title.' },
    { name: 'header', el: 'div', parent: 'root', description: 'Flex row, centered, 10px gap.' },
    { name: 'orb', el: 'span', parent: 'header', description: '22px spectrum orb with a 7px hole (between orb sm 12 and lg 28; token request). aria-hidden.' },
    { name: 'title', el: 'div', parent: 'header', description: '"Review 9 changes", title-3.' },
    { name: 'subtitle', el: 'div', parent: 'header', required: false, description: 'Source line under the title: "Caustic · Pricing refresh". Footnote, tertiary. Title and subtitle stack in one block.' },
    { name: 'summary', el: 'div', parent: 'root', required: false, description: 'Wrapping row of toned Chips (8px gap, Chip size sm): info "6 tokens", soft "3 layers", success "AA kept".' },
    { name: 'diff', el: 'div', parent: 'root', required: false, description: 'The TokenDiff block of the changed tokens.' },
    { name: 'actions', el: 'div', parent: 'root', description: 'Flex row, 8px gap, end-aligned.' },
    { name: 'reject', el: 'button', parent: 'actions', role: 'button', description: 'Button ghost sm "Reject".' },
    { name: 'approve', el: 'button', parent: 'actions', role: 'button', description: 'Button ink sm "Approve all".' },
  ],
  props: {
    title: { type: 'ReactNode', required: true, description: 'Count title, e.g. "Review 9 changes".' },
    subtitle: { type: 'ReactNode', description: 'Source line.' },
    summary: { type: 'ReactNode', description: 'Chip elements for the summary row.' },
    changes: { type: 'TokenDiffRow[]', description: 'Rows of the token diff; omit to hide the block.' },
    rejectLabel: { type: 'ReactNode', default: 'Reject', description: 'Label of the secondary action.' },
    approveLabel: { type: 'ReactNode', default: 'Approve all', description: 'Label of the primary action.' },
  },
  events: {
    onApprove: { payload: 'void', when: 'Approve all is pressed' },
    onReject: { payload: 'void', when: 'Reject is pressed' },
  },
  styles: [
    { slot: 'root', expect: { material: 'thick', radius: '3xl', shadow: '4', padX: 'inset-regular-x', padY: 'inset-regular-y', gap: 12 } },
    { slot: 'header', expect: { gap: 10 } },
    { slot: 'orb', expect: { height: 'size-orb-md', width: 'size-orb-md', radius: 'full' }, note: 'Token request: size-orb-md 22 with a 7px hole (--cs-orb-hole).' },
    { slot: 'title', expect: { text: 'title-3', fg: 'text.primary' } },
    { slot: 'subtitle', expect: { text: 'footnote', fg: 'text.tertiary' } },
    { slot: 'summary', expect: { gap: 8 } },
    { slot: 'actions', expect: { gap: 8 } },
  ],
  behavior: {
    keyboard: { Tab: 'moves through the actions in the panel', Enter: 'activate the focused action', Space: 'activate the focused action' },
    scenarios: [
      { name: 'Approve all', steps: [{ do: 'click', slot: 'approve' }], expect: [{ event: 'onApprove', calls: 1 }] },
      { name: 'Reject', steps: [{ do: 'click', slot: 'reject' }], expect: [{ event: 'onReject', calls: 1 }] },
    ],
  },
  a11y: {
    labelRequired: true,
    attrs: { root: ['aria-labelledby'] },
    notes: [
      'role="dialog" with aria-modal false: focus is not trapped and the page is not inert. Focus moves to the panel only when the person opens it from a control; Escape is the parent\'s decision (it maps to Reject only when the product says so).',
      'Chip tones carry text ("AA kept"), not color alone. The orb is decorative.',
    ],
  },
  policies: ['P1', 'P2', 'P5', 'P6', 'P8'],
  flags: { floating: true, agent: true, motionLoop: true },
  composition: { uses: ['chip', 'button', 'token-diff'] },
  examples: [{ id: 'review-request', title: 'Review request', doc: 'modal#review-request' }],
  usage: [
    'Fixture requirements for render(props): the default render has title "Review 9 changes", subtitle "Caustic · Pricing refresh", three Chips (size sm: tone info "6 tokens"; soft "3 layers"; tone success "AA kept"), the three TokenDiff rows radius.card 12 to 20, space.card.pad 24 to 32, radius.control 8 to 10, and both actions.',
    'Example "review-request": the panel rendered inline (no portal), full width of the example, on the page background. The docs section is in modal.html; this spec owns it.',
    'Approve all is the one ink action; Reject is ghost. Never use the accent tone here (P3).',
  ],
});
