import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'session-list',
  name: 'SessionList',
  category: 'agent',
  status: 'ready',
  purpose: 'A compact list of agent sessions with the status of each at a glance: running (spectrum orb), needs review, failed or done, with a title and a short time or status word. One session is current.',
  description: 'Rows of 32px on the sidebar surface, like navigation items but with a status glyph in a fixed 16px column. The status is the only color on the row; the current row rises with the pressed fill. Switching sessions is a button press.',
  role: 'list',
  slots: [
    { name: 'root', el: 'ul', role: 'list', description: 'The list. Grid, 1px gap. Needs an accessible name (aria-label, for example "Sessions").' },
    { name: 'item', el: 'li', parent: 'root', description: 'List item wrapper of one session.' },
    { name: 'button', el: 'button', parent: 'item', role: 'button', description: 'The row: grid of 16px / 1fr / auto, 8px gap, 32px high, 8px inline padding, lg radius, ui-dense text. aria-current="true" on the current session.' },
    { name: 'status', el: 'span', parent: 'button', description: '16px glyph column, centered. Holds the orb, a dot or a check. Decorative; the status word is text.' },
    { name: 'title', el: 'span', parent: 'button', description: 'Session title; truncates with an ellipsis.' },
    { name: 'meta', el: 'span', parent: 'button', description: 'Time or status word (now, Review, Failed, 2h, Mon). Tertiary.' },
  ],
  variants: {
    status: { values: ['running', 'review', 'failed', 'done'], default: 'done', description: 'running = 12px spectrum orb (the agent is working); review = info dot (needs a person); failed = danger dot; done = check icon.' },
  },
  states: {
    hover: { pseudo: ['hover'], target: 'button' },
    'focus-visible': { pseudo: ['focus', 'focus-visible'], target: 'button' },
    selected: { props: { current: true } },
  },
  props: {
    'aria-label': { type: 'string', required: true, description: 'Accessible name of the list.' },
    status: { type: "'running' | 'review' | 'failed' | 'done'", default: 'done', description: 'SessionListItem prop. Session status.' },
    current: { type: 'boolean', default: false, description: 'SessionListItem prop. The open session: pressed fill, medium weight, aria-current.' },
    title: { type: 'ReactNode', required: true, description: 'SessionListItem prop. Title.' },
    meta: { type: 'ReactNode', description: 'SessionListItem prop. Time or status word.' },
  },
  events: {
    onClick: { payload: 'React.MouseEvent<HTMLButtonElement>', when: 'a session is activated by pointer, Enter or Space (SessionListItem prop)' },
  },
  styles: [
    { slot: 'root', expect: { gap: 1 } },
    { slot: 'button', expect: { height: 'control-md', padX: 8, gap: 8, radius: 'lg', text: 'ui-dense', fg: 'text.primary' }, note: 'Specimen radius is 9px; mapped to lg (10). Height 32 = control-md.' },
    { slot: 'button', when: { state: 'hover' }, expect: { bg: 'fill.hover' } },
    { slot: 'button', when: { state: 'selected' }, expect: { bg: 'fill.pressed', weight: 500 } },
    { slot: 'button', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'status', expect: { height: 16, width: 16 } },
    { slot: 'status', when: { status: 'running' }, expect: { height: 16, width: 16 }, note: 'Holds the orb utility, 12px (cs-sm), the spectrum ring; rotating.' },
    { slot: 'status', when: { status: 'review' }, expect: { fg: 'info.solid' }, note: 'Contains a 7px dot (size-radio-dot) in currentColor.' },
    { slot: 'status', when: { status: 'failed' }, expect: { fg: 'danger.solid' }, note: 'Contains a 7px dot (size-radio-dot) in currentColor.' },
    { slot: 'status', when: { status: 'done' }, expect: { fg: 'text.tertiary' }, note: 'Contains a check icon of 13px (icon-sm 14 is the nearest token).' },
    { slot: 'title', expect: { fg: 'text.primary' } },
    { slot: 'meta', expect: { text: 'ui-xs', fg: 'text.tertiary' } },
  ],
  behavior: {
    keyboard: {
      Tab: 'moves through the session buttons in order',
      'Enter / Space': 'opens the session',
    },
    pointer: ['hovering a row fills it with fill.hover', 'pressing a row opens that session'],
    scenarios: [
      { name: 'click reports', steps: [{ do: 'click', slot: 'button' }], expect: [{ event: 'onClick', calls: 1 }] },
      { name: 'current item is marked', props: { current: true }, steps: [], expect: [{ slot: 'button', attr: { 'aria-current': 'true' } }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { root: ['aria-label'], status: ['aria-hidden'] },
    notes: [
      'The status is stated in text, not by color alone: running shows "now", review shows "Review", failed shows "Failed". Done shows the time. For screen readers add a visually hidden status prefix to the row name ("Running: …", "Needs review: …", "Failed: …", "Done: …").',
      'The current session uses aria-current="true"; the pressed fill is not the only cue.',
      'The orb stops rotating under reduced motion (P8); it stays visible as a static ring.',
      'Contrast: info.solid and danger.solid glyphs pass the 3:1 non-text rule on the sidebar; meta text.tertiary at 11px passes 4.5:1 on the surface (P6).',
    ],
  },
  policies: ['P2', 'P6', 'P8'],
  flags: { agent: { status: ['running'] }, motionLoop: true },
  composition: { uses: [] },
  examples: [{ id: 'sessions', title: 'Sessions', doc: 'sessions#sessions' }],
  usage: [
    'Fixture render(props): five rows. (1) running, current: "Make pricing feel premium", meta "now"; (2) review: "Dark variant for Lagoon", "Review"; (3) failed: "Export checkout to React", "Failed"; (4) done: "Onboarding empty states", "2h"; (5) done: "Audit tap targets on iOS", "Mon". Item-level props (status, current) and the pseudo-states apply to the FIRST item in probes.',
    'Example reproduces the specimen in the doc frame; the list fills the frame width.',
    'Exact strings: "Make pricing feel premium", "now", "Dark variant for Lagoon", "Review", "Export checkout to React", "Failed", "Onboarding empty states", "2h", "Audit tap targets on iOS", "Mon".',
    'Only the running status uses the spectrum, and only the orb; never color the title or the row by status.',
    'Review means a person must act (approval, proposal): it is not an agent state, so it uses info, not the spectrum.',
  ],
});
