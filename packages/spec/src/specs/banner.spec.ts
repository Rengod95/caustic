import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'banner',
  name: 'Banner',
  category: 'structure',
  status: 'ready',
  purpose: 'Page-level notice that spans the whole region in the subtle emphasis (tint fill with the tone border), a tone icon, one line of text, an optional action and an optional dismiss. Flat; never glass.',
  description: 'For inline notices inside a card or form use Alert; for transient confirmations use Toast.',
  role: 'status',
  slots: [
    { name: 'root', el: 'div', description: 'Full-width flex row. Danger uses role="alert"; the other tones role="status".' },
    { name: 'icon', el: 'any', parent: 'root', description: '16px lucide icon in the tone graphic color (info, circle-check, triangle-alert, circle-alert).' },
    { name: 'message', el: 'span', parent: 'root', description: 'Takes the free width; tone text color (inherited from the root); bold lead-ins use weight 600.' },
    { name: 'action', el: 'any', parent: 'root', required: false, description: 'A Button xs (ghost or secondary).' },
    { name: 'dismiss', el: 'button', parent: 'root', required: false, description: 'IconButton xs with an x icon; aria-label from the dismissLabel prop.' },
  ],
  variants: {
    tone: { values: ['info', 'success', 'warning', 'danger'], default: 'info', description: 'Subtle emphasis: tint fill, 1px tone border inside the edge, tone text (11) message, tone graphic icon.' },
  },
  props: {
    tone: { type: "'info' | 'success' | 'warning' | 'danger'", default: 'info', description: 'Meaning; also selects the default icon and the live-region role.' },
    icon: { type: 'ReactNode', description: 'Replaces the default tone icon.' },
    children: { type: 'ReactNode', description: 'The message.' },
    action: { type: 'ReactNode', description: 'Action button.' },
    dismissible: { type: 'boolean', default: false, description: 'Shows the dismiss button. The banner does not hide itself; the owner removes it in onDismiss.' },
    dismissLabel: { type: 'string', description: 'aria-label of the dismiss button (e.g. "Dismiss"). Required whenever dismissible is true; no built-in default. Optional in the type only because it is unused when dismissible is false.' },
  },
  events: { onDismiss: { payload: 'void', when: 'the dismiss button is activated' } },
  styles: [
    { slot: 'root', expect: { bg: 'info.tint', edge: 'info.border', fg: 'info.text', radius: 'xl', minHeight: 'control-xl', padX: 14, padY: 8, gap: 12, text: 'ui' }, note: 'Width 100%.' },
    { slot: 'root', when: { dismissible: true }, expect: { padStart: 14, padEnd: 8 }, note: 'With a trailing xs control the end padding is 8px so it sits concentric with the 12px corner.' },
    { slot: 'root', when: { tone: 'success' }, expect: { bg: 'success.tint', edge: 'success.border', fg: 'success.text' } },
    { slot: 'root', when: { tone: 'warning' }, expect: { bg: 'warning.tint', edge: 'warning.border', fg: 'warning.text' } },
    { slot: 'root', when: { tone: 'danger' }, expect: { bg: 'danger.tint', edge: 'danger.border', fg: 'danger.text' } },
    { slot: 'icon', expect: { fg: 'info.graphic', height: 'icon-md', width: 'icon-md' } },
    { slot: 'icon', when: { tone: 'success' }, expect: { fg: 'success.graphic' } },
    { slot: 'icon', when: { tone: 'warning' }, expect: { fg: 'warning.graphic' } },
    { slot: 'icon', when: { tone: 'danger' }, expect: { fg: 'danger.graphic' } },
    { slot: 'message', expect: { text: 'ui' } },
  ],
  behavior: {
    keyboard: { Enter: 'activates a focused action or dismiss button', Space: 'activates a focused action or dismiss button' },
    pointer: ['clicking dismiss calls onDismiss'],
    scenarios: [
      { name: 'dismiss', props: { dismissible: true, dismissLabel: 'Dismiss' }, steps: [{ do: 'click', slot: 'dismiss' }], expect: [{ event: 'onDismiss', calls: 1 }] },
    ],
  },
  a11y: {
    attrs: { dismiss: ['aria-label'] },
    notes: [
      'Info, success and warning render role="status" (polite); danger renders role="alert" (assertive).',
      'The tone is carried by the message text, not by color alone; the icon is aria-hidden.',
      'The message uses the tone text (step 11, 4.5 : 1 on the tint fill); the icon uses the tone graphic color (step 8, 3 : 1 on the surface). The action and dismiss buttons set their own colors.',
    ],
  },
  policies: ['P5', 'P6'],
  composition: { uses: ['button', 'icon-button'] },
  examples: [{ id: 'banner', title: 'Banner', doc: 'banner#banner' }],
  usage: [
    'Page-level only; at most one banner per tone per view.',
    'Example fixture (stacked, 14px gap): info with `<b>New:</b> themes can now inherit from another theme.`, Button ghost xs "Learn more", dismissible; warning with "Your trial ends in 3 days. Projects stay read-only after that." and Button secondary xs "Upgrade"; danger with "Anthropic is not responding. Agent runs are paused." and Button ghost xs "Retry"; success with "Published v2.4 to orbit-pay.caustic.app." dismissible.',
    'The fixture passes dismissLabel "Dismiss" to every dismissible banner. With dismissible and no dismissLabel the button has no accessible name; the implementation does not invent an English one (the a11y attrs gate sees the missing aria-label).',
    'Banner itself imports IconButton (dismiss); Button in `uses` is for the example fixture.',
    'The specimen CSS also has a neutral surface tone that the page does not show; it is not specified.',
  ],
});
