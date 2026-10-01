import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'alert',
  name: 'Alert',
  category: 'structure',
  status: 'ready',
  purpose: 'Inline notice inside a card, panel or form: soft tinted fill, a tone icon, a message (optionally with a bold lead-in) and an optional action. Flat; for page-level notices use Banner.',
  role: 'status',
  slots: [
    { name: 'root', el: 'div', description: 'Three-column grid (icon, body, action). Danger uses role="alert"; the other tones role="status".' },
    { name: 'icon', el: 'any', parent: 'root', description: '16px lucide icon in the tone text color (info, triangle-alert, circle-alert).' },
    { name: 'body', el: 'div', parent: 'root', description: 'Message; a <b> lead-in is weight 600.' },
    { name: 'action', el: 'any', parent: 'root', required: false, description: 'A Button xs. The column collapses when empty.' },
  ],
  variants: {
    tone: { values: ['info', 'warning', 'danger'], default: 'info', description: 'Soft tint plus matching icon color.' },
  },
  props: {
    tone: { type: "'info' | 'warning' | 'danger'", default: 'info', description: 'Meaning; also selects the default icon and the live-region role.' },
    icon: { type: 'ReactNode', description: 'Replaces the default tone icon.' },
    children: { type: 'ReactNode', description: 'The message.' },
    action: { type: 'ReactNode', description: 'Action button.' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'info.soft', fg: 'text.primary', radius: 'xl', minHeight: 44, padX: 12, padY: 10, gap: 10, text: 'ui-dense' }, note: 'Padding-inline-end is 10px (xs button sits concentric with the 12px corner). 44px has no control token; field-lg is also 44 and may be used.' },
    { slot: 'root', when: { tone: 'warning' }, expect: { bg: 'warning.soft' } },
    { slot: 'root', when: { tone: 'danger' }, expect: { bg: 'danger.soft' } },
    { slot: 'icon', expect: { fg: 'info.text', height: 'icon-md', width: 'icon-md' } },
    { slot: 'icon', when: { tone: 'warning' }, expect: { fg: 'warning.text' } },
    { slot: 'icon', when: { tone: 'danger' }, expect: { fg: 'danger.text' } },
    { slot: 'body', expect: { text: 'ui-dense' } },
  ],
  a11y: {
    notes: [
      'Warning and info render role="status"; danger renders role="alert".',
      'The tone is carried by the message text; the icon is aria-hidden.',
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
