import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'icon-toggle',
  name: 'IconToggle',
  category: 'inspector',
  status: 'ready',
  purpose: 'A quiet icon button that stays on: lock aspect ratio, independent corners. When on it takes the accent soft fill, not the neutral selected fill of IconButton.',
  description: 'A button with aria-pressed. It looks like an xs IconButton at rest and on hover; only the pressed state differs (accent.soft fill, accent.text icon), which is how an inspector marks "this option is on" next to a field. For a labelled or neutral toggle use Chip (pressed) or ToggleGroup.',
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
    { slot: 'root', when: { state: 'hover' }, expect: { bg: 'fill.pressed', fg: 'text.primary' } },
    { slot: 'root', when: { state: 'pressed' }, expect: { bg: 'accent.soft', fg: 'accent.text' } },
    { slot: 'root', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'root', when: { state: 'disabled' }, expect: { opacity: 0.42 } },
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
    notes: ['aria-label names the option, not the state ("Lock aspect ratio", "Independent corners").', 'Accent soft with accent text passes 4.5:1 on surface.base (contrast rule accent.text over accent.soft).'],
  },
  policies: ['P6'],
  composition: { uses: [] },
  usage: [
    'Fixture contract: render(props) shows a link icon with aria-label "Lock aspect ratio"; pressed state props are defaultPressed or pressed.',
    'Only the xs size appears in the specimen (the lock next to W/H, independent corners next to the radius and smoothing fields); other sizes are not specified.',
    'Gap: IconButton (approved) marks pressed with fill.selected; this accent tint is a different treatment, so it is a separate component instead of a variant. If the owner prefers, IconButton can gain tone="accent" for pressed and this spec can be dropped.',
  ],
});
