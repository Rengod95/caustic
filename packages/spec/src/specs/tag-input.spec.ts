import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'tag-input',
  name: 'TagInput',
  category: 'form',
  status: 'ready',
  purpose: 'Enters a list of short strings as removable tags. Enter or comma adds the typed text; Backspace on an empty input removes the last tag.',
  description: 'The container owns the fill, edge and focus edge and wraps tags onto new lines. Tags are Chip instances (with remove) rendered directly inside root; they are not slots of this component, so Chip owns their look (26px, translucent fill with a hairline, 16px remove button).',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Field container: wrapping flex row, min height 40, translucent fill, 1px hairline edge, radius xl. Tags are rounded chips at radius sm (one step under the standalone chip) so they stay concentric with the field. Pressing anywhere in it focuses the control.' },
    { name: 'control', el: 'input', parent: 'root', role: 'textbox', description: 'The native input for the next tag. Flexes to fill the row, 90px minimum width; no border, outline or ring.' },
  ],
  states: {
    'focus-within': { pseudo: ['focus-within'] },
    invalid: { props: { invalid: true } },
    'invalid-focus': { props: { invalid: true }, pseudo: ['focus-within'] },
    disabled: { props: { disabled: true } },
    'invalid-disabled': { props: { invalid: true, disabled: true } },
  },
  props: {
    value: { type: 'string[]', description: 'Controlled tags.' },
    defaultValue: { type: 'string[]', default: [], description: 'Uncontrolled initial tags.' },
    placeholder: { type: 'string', description: 'Placeholder of the control; shown only while it is empty (text.placeholder).' },
    delimiters: { type: "readonly ('Enter' | ',')[]", default: ['Enter', ','], description: 'Keys that commit the typed text as a tag.' },
    allowDuplicates: { type: 'boolean', default: false, description: 'When false, adding an existing tag is ignored.' },
    invalid: { type: 'boolean', default: false, description: 'Danger border-strong edge; also taken from an enclosing Field with an error. Dropped while disabled.' },
    disabled: { type: 'boolean', default: false, description: 'Disables the control and the remove buttons; disabled fill, edge and text. The tags take disabled.text and a disabled.border edge, the remove glyph included.' },
  },
  events: {
    onValueChange: { payload: 'string[]', when: 'a tag is added or removed' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'surface.translucent', edge: 'border.default', radius: 'xl', minHeight: 'field-md', padX: 8, padY: 6, gap: 6, text: 'ui', cursor: 'text' }, note: 'One depth cue: the translucent fill and a 1px border.default hairline, no elevation.' },
    { slot: 'root', when: { state: 'focus-within' }, expect: { ring: 'focus-field' } },
    { slot: 'root', when: { state: 'invalid' }, expect: { edge: 'danger.border-strong' } },
    { slot: 'root', when: { state: 'invalid-focus' }, expect: { edge: 'danger.border-strong', ring: 'focus' }, note: 'Invalid + focus shows both: the danger edge stays and the outer focus ring is added.' },
    { slot: 'root', when: { state: 'disabled' }, expect: { bg: 'disabled.fill', edge: 'disabled.border' }, note: 'Disabled is a colour, not opacity: disabled fill, edge and text; the tone drops out. Tags (Chip, not slots here) take disabled.text and a disabled.border edge, the remove glyph included.' },
    { slot: 'root', when: { state: 'invalid-disabled' }, expect: { bg: 'disabled.fill', edge: 'disabled.border' }, note: 'Disabled drops the invalid tone: the danger edge gives way to the disabled edge.' },
    { slot: 'control', expect: { fg: 'text.primary', outline: 'none', height: 'size-chip-h', padX: 4, text: 'ui' } },
    { slot: 'control', when: { state: 'disabled' }, expect: { fg: 'disabled.text' } },
  ],
  behavior: {
    keyboard: {
      Enter: 'commit the trimmed text as a tag; ignored when empty or a duplicate',
      ',': 'same as Enter; the comma is not inserted',
      Backspace: 'with an empty control, remove the last tag',
    },
    pointer: ['pressing anywhere in the container focuses the control', 'pressing a tag x removes that tag and keeps focus in the control', 'pasting comma- or newline-separated text adds one tag per piece'],
    scenarios: [
      { name: 'Enter adds a tag', props: { defaultValue: ['pricing'] }, steps: [{ do: 'click', slot: 'root' }, { do: 'type', text: 'checkout' }, { do: 'press', key: 'Enter' }], expect: [{ event: 'onValueChange', args: [['pricing', 'checkout']] }, { focused: 'control' }] },
      { name: 'comma adds a tag', steps: [{ do: 'click', slot: 'root' }, { do: 'type', text: 'dark mode,' }], expect: [{ event: 'onValueChange', args: [['dark mode']] }] },
      { name: 'Backspace on empty removes the last tag', props: { defaultValue: ['pricing', 'checkout'] }, steps: [{ do: 'click', slot: 'root' }, { do: 'press', key: 'Backspace' }], expect: [{ event: 'onValueChange', args: [['pricing']] }] },
      { name: 'duplicates are ignored', props: { defaultValue: ['pricing'] }, steps: [{ do: 'click', slot: 'root' }, { do: 'type', text: 'pricing' }, { do: 'press', key: 'Enter' }], expect: [{ event: 'onValueChange', calls: 0 }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 16,
    notes: [
      'Wrap in Field; the Field label targets the control (htmlFor).',
      'The Chip remove button is 16px (below 24px); Backspace gives an equivalent keyboard path.',
      'Announce additions and removals politely (aria-live region), for example "pricing added".',
    ],
  },
  policies: ['P5', 'P6', 'P9'],
  flags: { field: true },
  composition: { uses: ['field', 'chip'] },
  examples: [{ id: 'tag-input', title: 'Tag input', doc: 'tag-input#tag-input' }],
  usage: [
    'Use for open-ended short values (keywords, emails). For a fixed choice list use a select or combobox.',
    'The hint under the field says what the tags are used for.',
  ],
});
