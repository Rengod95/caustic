import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'icon-toggle',
  name: 'IconToggle',
  category: 'inspector',
  status: 'ready',
  purpose: 'A quiet icon button that stays on: lock aspect ratio, independent corners. When on it takes the neutral selected fill with the selection edge (colour language decision 3).',
  description: 'A button with aria-pressed. It looks like an xs IconButton at rest and on hover; only the pressed state differs (neutral.selected fill, text.primary icon and a 1px selection.edge), which is how an inspector marks "this option is on" next to a field. For a labelled or neutral toggle use Chip (pressed) or ToggleGroup.',
  role: 'button',
  slots: [
    { name: 'root', el: 'button', role: 'button', description: 'Square hit target, type="button", aria-pressed. 24px, sm radius.' },
    { name: 'icon', el: 'any', parent: 'root', description: 'lucide icon, 14px. Some toggles swap the icon with the state (link / unlink); the label stays the same.' },
  ],
  states: {
    hover: { pseudo: ['hover'] },
    pressed: { props: { pressed: true } },
    'focus-visible': { pseudo: ['focus', 'focus-visible'] },
    disabled: { props: { disabled: true } },
  },
  props: {
    pressed: { type: 'boolean', description: 'Controlled on state.' },
    defaultPressed: { type: 'boolean', default: false, description: 'Uncontrolled initial state.' },
    disabled: { type: 'boolean', default: false, description: 'Disables the toggle.' },
    children: { type: 'ReactNode', required: true, description: 'The icon.' },
  },
  events: { onPressedChange: { payload: 'boolean', when: 'pressed by pointer, Enter or Space' } },
  styles: [
    { slot: 'root', expect: { bg: 'transparent', fg: 'text.secondary', radius: 'sm', height: 'control-xs', width: 'control-xs' } },
    { slot: 'root', when: { state: 'hover' }, expect: { bg: 'neutral.hover', fg: 'text.primary' } },
    { slot: 'root', when: { state: 'pressed' }, expect: { bg: 'neutral.selected', fg: 'text.primary', edge: 'selection.edge' }, note: 'Selected + hover: neutral.selected-hover. Selected + focus shows the selection edge and the focus ring together.' },
    { slot: 'root', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'root', when: { state: 'disabled' }, expect: { bg: 'transparent', fg: 'disabled.text', opacity: 1 }, note: 'Disabled is a colour, not opacity. A disabled toggle that is on takes disabled.fill with a disabled.border edge and a disabled.text icon.' },
    { slot: 'root', when: { pressed: true, state: 'disabled' }, expect: { bg: 'disabled.fill', fg: 'disabled.text', edge: 'disabled.border', opacity: 1 }, note: 'On + disabled: the tone and the selection drop out; the glyph takes disabled.text.' },
    { slot: 'icon', expect: { height: 'icon-sm', width: 'icon-sm' } },
  ],
  behavior: {
    keyboard: { Enter: 'toggle', Space: 'toggle' },
    pointer: ['click toggles'],
    scenarios: [
      { name: 'click turns it on', props: { defaultPressed: false }, steps: [{ do: 'click', slot: 'root' }], expect: [{ event: 'onPressedChange', args: [true] }, { slot: 'root', attr: { 'aria-pressed': 'true' } }] },
      { name: 'click turns it off', props: { defaultPressed: true }, steps: [{ do: 'click', slot: 'root' }], expect: [{ event: 'onPressedChange', args: [false] }, { slot: 'root', attr: { 'aria-pressed': 'false' } }] },
      { name: 'disabled ignores click', props: { disabled: true }, steps: [{ do: 'click', slot: 'root' }], expect: [{ event: 'onPressedChange', calls: 0 }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { root: ['aria-pressed', 'aria-label'] },
    notes: ['aria-label names the option, not the state ("Lock aspect ratio", "Independent corners").', 'text.primary on neutral.selected passes 4.5:1 on every surface; the on state is also carried by aria-pressed and the selection edge.'],
  },
  policies: ['P6'],
  composition: { uses: [] },
  usage: [
    'Fixture contract: render(props) shows a link icon with aria-label "Lock aspect ratio"; pressed state props are defaultPressed or pressed.',
    'Only the xs size appears in the specimen (the lock next to W/H, independent corners next to the radius and smoothing fields); other sizes are not specified.',
    'IconButton marks pressed with neutral.selected only; IconToggle adds the selection edge because it sits next to fields where a fill alone is too quiet.',
  ],
});
