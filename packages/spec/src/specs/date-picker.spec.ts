import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'date-picker',
  name: 'DatePicker',
  category: 'form',
  status: 'ready',
  purpose: 'Chooses a date or a date range in a form. A field-looking trigger shows the chosen value; it opens a Calendar panel with quick-pick shortcuts.',
  description: 'Composition: Field (label) > DatePicker root > PickerTrigger (calendar icon, formatted value, chevron-down) + Calendar panel. Range value is formatted “Oct 8 – Oct 14, 2026” (start without year, en dash with spaces, end with year; both with year when the years differ); a single date is “Oct 8, 2026”; a range with from = to is shown as a single date.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Stack: trigger, then (inline) the calendar panel 16px below it. In floating mode the panel is portaled and the root holds only the trigger.' },
    { name: 'trigger', el: 'button', parent: 'root', required: false, role: 'button', description: 'The PickerTrigger, rendered with data-slot="date-picker-trigger": leading calendar icon, value or placeholder, chevron-down indicator. aria-haspopup="dialog". Styles are those of picker-trigger.' },
  ],
  states: {
    open: { props: { open: true } },
    disabled: { props: { disabled: true } },
  },
  props: {
    mode: { type: "'single' | 'range'", default: 'range', description: 'One date or a start–end range.' },
    value: { type: 'string | { from: string; to?: string }', description: 'Controlled value: ISO date (single) or { from, to } (range).' },
    defaultValue: { type: 'string | { from: string; to?: string }', description: 'Uncontrolled initial value.' },
    open: { type: 'boolean', description: 'Controlled panel visibility.' },
    defaultOpen: { type: 'boolean', description: 'Uncontrolled initial panel visibility.' },
    placeholder: { type: 'ReactNode', default: 'Select a date', description: 'Shown in the trigger until a value exists.' },
    shortcuts: { type: 'boolean | Array<{ label: string; value: string | { from: string; to?: string } }>', default: true, description: 'Passed to the Calendar footer.' },
    today: { type: 'string', description: 'Override of today (ISO date); fixtures pin 2026-10-01.' },
    disabled: { type: 'boolean', description: 'Disables the trigger.' },
    invalid: { type: 'boolean', description: 'Danger trigger edge; also taken from an enclosing Field with an error.' },
    name: { type: 'string', description: 'Form field name (ISO value; range as from/to pair of hidden inputs name-from / name-to).' },
    inline: { type: 'boolean', default: false, description: 'Render the Calendar in place under the trigger, open, without portal or positioning. For docs and specimens.' },
  },
  events: {
    onValueChange: { payload: 'string | { from: string; to?: string }', when: 'the selection changes (range: after each of the two presses; the panel closes after the end is chosen)' },
    onOpenChange: { payload: 'boolean', when: 'the trigger opens it; Escape, a completed choice or an outside press closes it' },
  },
  styles: [
    { slot: 'root', expect: { gap: 16 }, note: 'Inline only: the specimen form column stacks the trigger and the panel with 16px.' },
  ],
  behavior: {
    keyboard: {
      Enter: 'on the trigger: open the panel and focus the selected day (else today)',
      Space: 'on the trigger: open the panel',
      ArrowDown: 'on the trigger: open the panel',
      Escape: 'close the panel and return focus to the trigger',
      Tab: 'moves out of the panel and closes it (the panel is not a focus trap)',
    },
    pointer: ['pressing the trigger toggles the panel', 'choosing a single date, or the end of a range, closes the panel', 'pressing a shortcut sets the value and closes the panel', 'pressing outside closes it'],
    scenarios: [
      { name: 'trigger opens the panel', steps: [{ do: 'click', slot: 'trigger' }], expect: [{ event: 'onOpenChange', args: [true] }] },
      { name: 'Escape closes', props: { inline: true, defaultOpen: true }, steps: [{ do: 'focus', slot: 'trigger' }, { do: 'press', key: 'Escape' }], expect: [{ event: 'onOpenChange', args: [false] }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { trigger: ['aria-haspopup', 'aria-expanded'] },
    notes: [
      'Trigger aria-haspopup="dialog"; the panel is role="dialog" aria-label “Choose dates” (“Choose a date” in single mode) and returns focus to the trigger on close.',
      'Wrap in Field for the visible label. The trigger’s accessible name is label + current value.',
      'The calendar icon is aria-hidden.',
      'Typing a date into the trigger is not supported; a keyboard user uses the calendar grid.',
    ],
  },
  policies: ['P1', 'P5', 'P6'],
  flags: { floating: true },
  composition: { uses: ['field', 'picker-trigger', 'calendar'], radix: ['@radix-ui/react-popover'] },
  examples: [{ id: 'range-calendar', title: 'Date picker', doc: 'date-picker#date-picker' }],
  usage: [
    'The example reproduces: Field “Publish window”, a PickerTrigger (indicator="dropdown", calendar icon) reading “Oct 8 – Oct 14, 2026”, and, 16px below it, the inline Calendar (range, Oct 8–14 selected, today = Oct 1, shortcuts Today / Next 7 days / This month). The column is max 300px wide.',
    'Radix Popover provides the floating behavior (focus return, Escape, outside press). inline renders the Calendar in place without it. The panel itself is the Calendar surface (thick glass); the Popover Content adds no chrome of its own.',
    'Fixture convention: render(props) renders the Field, trigger and inline panel with the specimen value and today = 2026-10-01.',
    'Trigger text is formatted with the English locale and en dash; the calendar title is “October 2026”. Other locales are out of scope for this spec.',
    'Range mode: choose the start, then the end; the panel stays open between them. Using a shortcut sets both at once.',
    'Min/max and disabled dates are not part of the approved design and are not specified.',
  ],
});
