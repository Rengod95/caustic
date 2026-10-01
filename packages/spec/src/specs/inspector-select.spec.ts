import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'inspector-select',
  name: 'InspectorSelect',
  category: 'inspector',
  status: 'ready',
  purpose: 'The select trigger of an inspector row: the sunken 32px field-height button that shows the current choice and opens a menu (constraints, weight, distribution).',
  description: 'The inspector twin of PickerTrigger: same job (a button that opens a picker), drawn like a NumberField (fill.hover, 32px, lg radius) instead of the 40px translucent form field. It carries no popup logic; the owner passes aria-haspopup, aria-expanded and the open handler, or wraps it with a Radix trigger via asChild. The listbox is the Select / Menu surface.',
  role: 'button',
  slots: [
    { name: 'root', el: 'button', role: 'button', description: 'Sunken field box: fill.hover, 32px high, lg radius, 10px padding, 8px gap, value left and chevron right (space between). Full width of its grid cell.' },
    { name: 'leading', el: 'any', parent: 'root', required: false, description: 'Leading 14px icon (move-horizontal, move-vertical…) in the value group, 6px before the text.' },
    { name: 'value', el: 'span', parent: 'root', description: 'Current choice, 12px, primary. Truncates with an ellipsis.' },
    { name: 'indicator', el: 'span', parent: 'root', description: 'Trailing chevron-down, 14px, in the text color (not tertiary).' },
  ],
  states: {
    hover: { pseudo: ['hover'] },
    'focus-visible': { pseudo: ['focus', 'focus-visible'] },
    disabled: { props: { disabled: true } },
  },
  props: {
    leading: { type: 'ReactNode', description: 'Content before the value.' },
    open: { type: 'boolean', default: false, description: 'Mirrors the popup state; sets aria-expanded and data-state="open".' },
    disabled: { type: 'boolean', default: false, description: 'Native disabled.' },
    asChild: { type: 'boolean', default: false, description: 'Render the child element (a Radix Trigger) with trigger styling.' },
    children: { type: 'ReactNode', description: 'The value text.' },
  },
  events: { onClick: { payload: 'React.MouseEvent<HTMLButtonElement>', when: 'activated by pointer, Enter or Space, and not disabled' } },
  styles: [
    { slot: 'root', expect: { bg: 'fill.hover', fg: 'text.primary', radius: 'lg', height: 'control-md', padX: 10, gap: 8, text: 'ui-sm', weight: 400, cursor: 'pointer' } },
    { slot: 'root', when: { state: 'hover' }, expect: { bg: 'fill.pressed' } },
    { slot: 'root', when: { state: 'focus-visible' }, expect: { bg: 'surface.base', ring: 'focus-field' } },
    { slot: 'root', when: { state: 'disabled' }, expect: { opacity: 0.42 } },
    { slot: 'leading', expect: { fg: 'text.primary', height: 'icon-sm', width: 'icon-sm' } },
    { slot: 'indicator', expect: { fg: 'text.primary', height: 'icon-sm', width: 'icon-sm' } },
  ],
  behavior: {
    keyboard: { Enter: 'activate', Space: 'activate' },
    pointer: ['pressing anywhere in the box activates it'],
    scenarios: [
      { name: 'click activates', steps: [{ do: 'click', slot: 'root' }], expect: [{ event: 'onClick', calls: 1 }] },
      { name: 'Enter activates', steps: [{ do: 'focus', slot: 'root' }, { do: 'press', key: 'Enter' }], expect: [{ event: 'onClick', calls: 1 }] },
      { name: 'disabled blocks activation', props: { disabled: true }, steps: [{ do: 'click', slot: 'root' }], expect: [{ event: 'onClick', calls: 0 }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { root: ['aria-haspopup', 'aria-expanded'] },
    notes: ['Give the trigger an accessible name that includes what it controls ("Horizontal constraint: Left and right").', 'Leading icon and chevron are aria-hidden.', 'The focus edge is the field edge (focus-field on the box).'],
  },
  policies: ['P6'],
  composition: { uses: [], radix: ['@radix-ui/react-slot'] },
  usage: [
    'No example of its own (the specimen shows it only inside other sections: constraints in position-size, "Packed" in auto-layout, "Semibold" in text-properties).',
    'Fixture contract: render(props) shows the leading move-horizontal icon, the value "Left & right" and the chevron.',
    'Specimen font size is 12px / 18px on a 13px field: role ui-sm with weight 400. Specimen draws the chevron in the primary text color, unlike PickerTrigger (tertiary).',
    'Gap: Input already has appearance="sunken" for text; PickerTrigger has no sunken appearance. If the owner prefers, PickerTrigger can gain appearance="sunken" and this spec can be dropped.',
  ],
});
