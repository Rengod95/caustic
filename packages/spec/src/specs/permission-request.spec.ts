import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'permission-request',
  name: 'PermissionRequest',
  category: 'agent',
  status: 'ready',
  purpose: 'An inline permission prompt in the transcript: what the agent wants to do, what it affects and how to undo it, with Allow once / Always / Deny. After the answer it collapses into a quiet one-line record.',
  description: 'status="pending" is the question card (raised, warning-tinted shield tile, three actions). status="allowed" is the record that replaces it (flat, success tile, no actions). The parent owns the status: the component only reports the decision.',
  role: 'group',
  slots: [
    { name: 'root', el: 'div', role: 'group', description: 'The card: grid, 10px gap, 2xl radius, compact inset (12), elevation 2 on surface.base. Allowed: surface.raised with a 1px inset edge and no shadow.' },
    { name: 'header', el: 'div', parent: 'root', description: 'Flex row, centered, 12px gap: tile and text.' },
    { name: 'icon', el: 'span', parent: 'header', description: '36px tile (shield-check pending, check allowed), 18px glyph, aria-hidden.' },
    { name: 'text', el: 'div', parent: 'header', description: 'Title and description stack.' },
    { name: 'title', el: 'div', parent: 'text', description: 'The question ("Edit the shared Button component?") or the outcome ("Allowed once"). Accessible name of the group.' },
    { name: 'description', el: 'div', parent: 'text', required: false, description: 'What changes and how to undo, or what was done and when. 2px below the title.' },
    { name: 'actions', el: 'div', parent: 'root', required: false, description: 'Pending only. Flex row, 6px gap, wraps; a flex-1 gap element pushes Deny to the end.' },
    { name: 'allow', el: 'button', parent: 'actions', required: false, role: 'button', description: 'Button ink xs "Allow once".' },
    { name: 'always', el: 'button', parent: 'actions', required: false, role: 'button', description: 'Button ghost xs "Always for this project".' },
    { name: 'deny', el: 'button', parent: 'actions', required: false, role: 'button', description: 'Button ghost xs "Deny", at the end.' },
  ],
  variants: {
    status: { values: ['pending', 'allowed'], default: 'pending', description: 'pending = the question; allowed = the quiet record after Allow.' },
  },
  props: {
    status: { type: "'pending' | 'allowed'", default: 'pending', description: 'Question or record.' },
    title: { type: 'ReactNode', required: true, description: 'The question or the outcome.' },
    description: { type: 'ReactNode', description: 'Consequence and undo hint, or the record detail.' },
    allowLabel: { type: 'ReactNode', default: 'Allow once', description: 'Label of the allow control.' },
    alwaysLabel: { type: 'ReactNode', default: 'Always for this project', description: 'Label of the always control; pass null to hide it.' },
    denyLabel: { type: 'ReactNode', default: 'Deny', description: 'Label of the deny control.' },
  },
  events: {
    onDecision: { payload: "'allow-once' | 'allow-always' | 'deny'", when: 'one of the three actions is pressed' },
  },
  styles: [
    { slot: 'root', when: { status: 'pending' }, expect: { bg: 'surface.base', radius: '2xl', padX: 'inset-compact-x', padY: 'inset-compact-y', gap: 10, shadow: '2' } },
    { slot: 'root', when: { status: 'allowed' }, expect: { bg: 'surface.raised', edge: 'border.subtle' }, note: 'Specimen overrides the box-shadow with only the inset 1px edge: no elevation.' },
    { slot: 'header', expect: { gap: 12 } },
    { slot: 'icon', when: { status: 'pending' }, expect: { bg: 'warning.soft', fg: 'warning.text', height: 'size-card-tile', width: 'size-card-tile', radius: 'lg' } },
    { slot: 'icon', when: { status: 'allowed' }, expect: { bg: 'success.soft', fg: 'success.text' } },
    { slot: 'title', when: { status: 'pending' }, expect: { text: 'ui-strong', weight: 600, fg: 'text.primary' } },
    { slot: 'title', when: { status: 'allowed' }, expect: { weight: 500 } },
    { slot: 'description', expect: { text: 'ui-sm', weight: 400, fg: 'text.secondary' } },
    { slot: 'actions', expect: { gap: 6 } },
  ],
  behavior: {
    keyboard: { Tab: 'moves through Allow once, Always, Deny', Enter: 'activate the focused action', Space: 'activate the focused action' },
    pointer: ['pressing an action reports the decision; the parent switches status'],
    scenarios: [
      { name: 'Allow once', steps: [{ do: 'click', slot: 'allow' }], expect: [{ event: 'onDecision', args: ['allow-once'] }] },
      { name: 'Always for this project', steps: [{ do: 'click', slot: 'always' }], expect: [{ event: 'onDecision', args: ['allow-always'] }] },
      { name: 'Deny', steps: [{ do: 'click', slot: 'deny' }], expect: [{ event: 'onDecision', args: ['deny'] }] },
      { name: 'allowed has no actions', props: { status: 'allowed' }, steps: [], expect: [{ hidden: 'actions' }] },
    ],
  },
  a11y: {
    attrs: { root: ['aria-labelledby'] },
    notes: [
      'role="group" named by the title. A new request is announced because the transcript is a live region; the component never moves focus on its own.',
      'The decision is stated in text ("Allowed once"), not by the tile color alone.',
      'The consequence (how many things change) and the undo path belong in the description; do not leave it empty for a destructive request.',
    ],
  },
  policies: ['P5', 'P6'],
  composition: { uses: ['button'] },
  examples: [{ id: 'permission-request', title: 'Permission request', doc: 'permission#permission-request' }],
  usage: [
    'Fixture requirements for render(props): the default render is status pending with title "Edit the shared Button component?", description "12 instances in 4 frames will change. You can undo this from history.", all three actions and onDecision recorded. status="allowed" renders title "Allowed once", description "Edited 12 instances · 2:41 PM".',
    'Example "permission-request": a grid with 14px gap holding the pending card and, below it, the allowed record. Icons: shield-check, check. The "Allow once" button is Button tone ink (not accent): a permission prompt is not the one accent action of the view.',
    'Always for this project grants a standing permission: say so in the description when the scope is larger than this call.',
  ],
});
