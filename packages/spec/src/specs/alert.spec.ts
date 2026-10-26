import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'alert',
  name: 'Alert',
  category: 'structure',
  status: 'ready',
  purpose: 'Inline notice inside a card, panel or form in the subtle emphasis (tint fill with the tone border), a tone icon, a message (optionally with a bold lead-in) and an optional action. Flat; for page-level notices use Banner.',
  role: 'status',
  slots: [
    { name: 'root', el: 'div', description: 'Three-column grid (icon, body, action). Danger uses role="alert"; the other tones role="status".' },
    { name: 'icon', el: 'any', parent: 'root', description: '16px lucide icon in the tone graphic color (info, circle-check, triangle-alert, circle-alert).' },
    { name: 'body', el: 'div', parent: 'root', description: 'Message in the tone text color (inherited from the root); a <b> lead-in is weight 600.' },
    { name: 'action', el: 'any', parent: 'root', required: false, description: 'A Button xs. The column collapses when empty.' },
  ],
  variants: {
    tone: { values: ['info', 'success', 'warning', 'danger'], default: 'info', description: 'Subtle emphasis: tint fill, 1px tone border inside the edge, tone text (11) message, tone graphic icon.' },
  },
  props: {
    tone: { type: "'info' | 'success' | 'warning' | 'danger'", default: 'info', description: 'Meaning; also selects the default icon and the live-region role.' },
    icon: { type: 'ReactNode', description: 'Replaces the default tone icon.' },
    children: { type: 'ReactNode', description: 'The message.' },
    action: { type: 'ReactNode', description: 'Action button.' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'info.tint', edge: 'info.border', fg: 'info.text', radius: 'xl', minHeight: 44, padX: 12, padY: 10, gap: 10, text: 'ui-dense' }, note: '44px has no control token; field-lg is also 44 and may be used.' },
    { slot: 'root', when: { action: true }, expect: { padStart: 12, padEnd: 10 }, note: 'With an action the end padding is 10px so the xs button sits concentric with the 12px corner.' },
    { slot: 'root', when: { tone: 'success' }, expect: { bg: 'success.tint', edge: 'success.border', fg: 'success.text' } },
    { slot: 'root', when: { tone: 'warning' }, expect: { bg: 'warning.tint', edge: 'warning.border', fg: 'warning.text' } },
    { slot: 'root', when: { tone: 'danger' }, expect: { bg: 'danger.tint', edge: 'danger.border', fg: 'danger.text' } },
    { slot: 'icon', expect: { fg: 'info.graphic', height: 'icon-md', width: 'icon-md' } },
    { slot: 'icon', when: { tone: 'success' }, expect: { fg: 'success.graphic' } },
    { slot: 'icon', when: { tone: 'warning' }, expect: { fg: 'warning.graphic' } },
    { slot: 'icon', when: { tone: 'danger' }, expect: { fg: 'danger.graphic' } },
    { slot: 'body', expect: { text: 'ui-dense' } },
  ],
  a11y: {
    notes: [
      'Info, success and warning render role="status"; danger renders role="alert".',
      'The tone is carried by the message text; the icon is aria-hidden.',
      'The message uses the tone text (step 11), which keeps 4.5 : 1 on the tint fill; the icon uses the tone graphic (step 8, 3 : 1). The action Button sets its own color.',
    ],
  },
  policies: ['P5', 'P6'],
  composition: { uses: ['button', 'progress', 'skeleton'] },
  examples: [{ id: 'feedback', title: 'Alerts, progress, skeleton', doc: 'feedback#feedback' }],
  usage: [
    'Inline only; use Banner at page level and Toast for transient confirmations.',
    'The example covers the whole feedback section, stacked with a 14px gap (frame): warning alert (triangle-alert, `<b>2 tokens fail AA in dark.</b> text/tertiary on surface is 3.9 : 1.`, Button ghost xs "Fix"), info alert (info, "Theme changes apply to all 3 themes.", no action), then a column with an 8px gap holding three Progress bars (value 64; indeterminate; tone agent value 100), then a Skeleton row (see skeleton spec).',
    '`uses: button, progress, skeleton` are for the example fixture only.',
  ],
});
