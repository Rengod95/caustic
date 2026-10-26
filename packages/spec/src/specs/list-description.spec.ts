import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'list-description',
  name: 'ListDescription',
  category: 'list',
  status: 'ready',
  purpose: 'Label and value pairs on the grouped surface: a muted term in a fixed column, the value beside it and an optional copy button that appears on hover. For facts about one object (ID, plan, created by); the value may be text, mono text or a small component such as a TokenChip.',
  description: 'Own component because the semantics and layout differ from List: a native description list (dl, dt, dd) with a three-column grid per row instead of a leading and trailing layout. It shares the List surface. Below 480px the term sits on its own line above the value.',
  role: null,
  slots: [
    { name: 'root', el: 'dl', description: 'Description list and the list surface (same as List root): translucent fill, a 1px inset border.subtle hairline (one depth cue, no elevation), 2xl radius, clips its rows. Margin 0.' },
    { name: 'row', el: 'div', parent: 'root', description: 'One term/value group (a div wrapper is valid inside dl). Grid: 140px term, flexible value, auto action; 12px gap; 14px inline padding; 44px minimum height. A 1px border.subtle line on its top edge except the first row.' },
    { name: 'term', el: 'dt', parent: 'row', description: 'The label. Tertiary text; one line.' },
    { name: 'value', el: 'dd', parent: 'row', description: 'The value. Primary text, margin 0, one line, truncates. Mono for identifiers (mono prop) or any node (a TokenChip).' },
    { name: 'action', el: 'div', parent: 'row', required: false, description: 'Third column, holding one IconButton xs (copy). Opacity 0 until the row is hovered or has focus inside; always visible on devices without hover. An empty third column is kept on rows without an action so the value column stays aligned.' },
  ],
  states: {
    hover: { pseudo: ['hover'], target: 'row' },
  },
  props: {
    mono: { type: 'boolean', default: false, description: 'ListDescriptionRow prop. Set the value in the mono voice (ids, hashes, paths).' },
    copyValue: { type: 'string', description: 'ListDescriptionRow prop. Text to copy; adds the action column with a copy IconButton xs (aria-label "Copy <term>").' },
    term: { type: 'ReactNode', required: true, description: 'ListDescriptionRow prop. The label.' },
    children: { type: 'ReactNode', required: true, description: 'ListDescriptionRow prop. The value content.' },
    'aria-label': { type: 'string', description: 'Accessible name of the list when it needs one.' },
  },
  events: {
    onCopy: { payload: 'string', when: 'the copy button is activated; the argument is copyValue. The component also writes it to the clipboard when the API is available (ListDescriptionRow prop)' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'surface.translucent', edge: 'border.subtle', radius: '2xl' }, note: 'Identical to List root: one depth cue (d8f79e8), the 1px inset hairline and no elevation; no frost (542df1d).' },
    { slot: 'row', expect: { minHeight: 'control-compact-xl', padX: 14, padY: 6, gap: 12, text: 'ui', fg: 'text.primary' }, note: 'Grid columns: size-list-term (140), minmax(0, 1fr), auto. At 480px and narrower: columns 1fr and auto, the term spans the first row.' },
    { slot: 'term', expect: { fg: 'text.tertiary', text: 'ui' } },
    { slot: 'value', expect: { fg: 'text.primary', text: 'ui' } },
    { slot: 'value', when: { mono: true }, expect: { font: 'mono', text: 'mono' } },
    { slot: 'action', expect: { opacity: 0 } },
    { slot: 'action', when: { state: 'hover' }, expect: { opacity: 1 } },
  ],
  behavior: {
    keyboard: {
      Tab: 'moves to the copy buttons; focusing one shows it (focus within the row reveals the action)',
      'Enter / Space': 'activates the focused copy button',
    },
    pointer: ['hovering a row reveals its copy button (quick duration)', 'pressing the copy button copies the value and reports onCopy'],
    scenarios: [
      { name: 'copy reports the value', props: { copyValue: 'ws_8f2a91c4' }, steps: [{ do: 'hover', slot: 'row' }, { do: 'click', slot: 'action' }], expect: [{ event: 'onCopy', args: ['ws_8f2a91c4'] }] },
    ],
  },
  a11y: {
    labelRequired: false,
    minHit: 24,
    attrs: { action: ['role'] },
    notes: [
      'Native dl with term and value in div groups; assistive technology reads term then value. Do not replace dt and dd with spans.',
      'The copy button is an IconButton xs with aria-label "Copy <term>"; reveal on hover must also work on focus-within and be visible on touch devices.',
      'Meta text on the translucent surface is text.tertiary at 4.5:1; the value is text.primary.',
      'A truncated value keeps its full text in the DOM; offer a Tooltip or title for long ones.',
    ],
  },
  policies: ['P4', 'P5', 'P6'],
  composition: { uses: ['icon-button', 'token-chip'] },
  examples: [{ id: 'description-list', title: 'Description list', doc: 'list-description#description-list' }],
  usage: [
    'Imports the List surface variants; it renders its own slots (data-slot list-description-*).',
    'Fixture requirements for render(props): four rows. (1) term "Workspace ID", value "ws_8f2a91c4" with mono and copyValue "ws_8f2a91c4" (the FIRST row: mono and copyValue apply to it); (2) "Plan", "Team · billed yearly"; (3) "Default theme" with a TokenChip (swatch, label Lagoon, 22px high in the specimen); (4) "Created", "Mar 14, 2026 by Mina Kang". Rows 2 to 4 render an empty action column. The default render has the copy button on the first row; the mono state (when mono: true) must change the first value only. The example is exactly these four rows at 480px, centered.',
    'The specimen mono value is 12px (the mono role); the other values are 13px (ui).',
    'The specimen row has min-height 44 with 6px block padding: the 22px TokenChip row stays 44.',
    'Token requests: size-list-term (140px, the term column width).',
    'For a longer sheet of facts use a Table; for editable facts use a form (Field).',
  ],
});
