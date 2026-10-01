import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'constraints-control',
  name: 'ConstraintsControl',
  category: 'inspector',
  status: 'ready',
  purpose: 'Pins a frame to its parent: a 96px box with six clickable edge and center pins, and two selects that name the horizontal and the vertical constraint in words.',
  description: 'The box is the picture, the selects are the same choice as text, and a one-sentence note explains what resizing the parent will do. Pins and selects edit one value: { horizontal, vertical }. Left + right become "Left & right"; the center pin is exclusive with the edge pins of its axis.',
  role: 'group',
  slots: [
    { name: 'root', el: 'div', role: 'group', description: 'Grid: 96px box column, 1fr column, 12px gap, items centered.' },
    { name: 'box', el: 'div', parent: 'root', description: '96px square picture of the parent: fill.hover, lg radius, hairline inset edge. Pins are absolutely positioned inside it.' },
    { name: 'frame', el: 'span', parent: 'box', description: 'The child frame: a 36px square inset 30px from every side, surface.base, xs radius, 1.5px inset border.control edge. Decorative.' },
    { name: 'pin', el: 'button', parent: 'box', role: 'button', description: 'Six toggle pins, aria-pressed: top and bottom (4px wide, 16px tall, centered on the vertical axis, 8px from the box edge), left and right (16px wide, 4px tall, 8px from the edge), center-x (20px wide, 2px tall, at the box center) and center-y (2px wide, 20px tall). Off: border.strong; on: accent.solid. 2px radius.' },
    { name: 'column', el: 'div', parent: 'root', description: 'Vertical stack, 8px gap, holding the two selects and the note.' },
    { name: 'horizontal', el: 'any', parent: 'column', description: 'InspectorSelect with a move-horizontal icon and the horizontal constraint name (Left, Right, Left & right, Center, Scale).' },
    { name: 'vertical', el: 'any', parent: 'column', description: 'InspectorSelect with a move-vertical icon and the vertical constraint name (Top, Bottom, Top & bottom, Center, Scale).' },
    { name: 'note', el: 'p', parent: 'column', required: false, description: 'Footnote: what resizing the parent does with the current constraints.' },
  ],
  states: {
    'pin-hover': { pseudo: ['hover'], target: 'pin' },
    'pin-focus': { pseudo: ['focus', 'focus-visible'], target: 'pin' },
    'pin-on': { props: { defaultValue: { horizontal: 'left', vertical: 'top' } } },
  },
  props: {
    value: { type: "{ horizontal: 'left' | 'right' | 'left-right' | 'center' | 'scale'; vertical: 'top' | 'bottom' | 'top-bottom' | 'center' | 'scale' }", description: 'Controlled constraints.' },
    defaultValue: { type: "{ horizontal: 'left' | 'right' | 'left-right' | 'center' | 'scale'; vertical: 'top' | 'bottom' | 'top-bottom' | 'center' | 'scale' }", default: { horizontal: 'scale', vertical: 'scale' }, description: 'Uncontrolled initial constraints. The default is Scale on both axes (no pin on), so the plain render shows every pin off.' },
    note: { type: 'ReactNode', description: 'Footnote under the selects.' },
    disabled: { type: 'boolean', default: false, description: 'Disables pins and selects (a frame with no parent).' },
  },
  events: {
    onValueChange: { payload: "{ horizontal: string; vertical: string }", when: 'a pin is toggled or a select picks a constraint' },
  },
  styles: [
    { slot: 'root', expect: { gap: 12 } },
    { slot: 'box', expect: { bg: 'fill.hover', edge: 'border.subtle', radius: 'lg', height: 'size-pad-box', width: 'size-pad-box' } },
    { slot: 'frame', expect: { bg: 'surface.base', edge: 'border.control', radius: 'xs', height: 36, width: 36 }, note: 'Edge is a 1.5px inset ring. Inset 30px on every side.' },
    { slot: 'pin', expect: { bg: 'border.strong', radius: '2xs' } },
    { slot: 'pin', when: { state: 'pin-hover' }, expect: { bg: 'text.secondary' } },
    { slot: 'pin', when: { state: 'pin-on' }, expect: { bg: 'accent.solid' } },
    { slot: 'pin', when: { state: 'pin-focus' }, expect: { ring: 'focus' } },
    { slot: 'column', expect: { gap: 8 } },
    { slot: 'note', expect: { fg: 'text.tertiary', text: 'hint' }, note: 'Specimen is 11.5px / 17px; hint is 11.5px / 18px (1px line-height difference, same as channel-slider note).' },
  ],
  behavior: {
    keyboard: { Tab: 'pins then selects in reading order', Enter: 'toggle the focused pin', Space: 'toggle the focused pin' },
    pointer: [
      'pressing a pin toggles it',
      'left + right on means Left & right; top + bottom on means Top & bottom; a center pin turns off the two edge pins of its axis and vice versa',
      'choosing a constraint in a select updates the pins',
    ],
    scenarios: [
      { name: 'pin click', props: { defaultValue: { horizontal: 'scale', vertical: 'scale' } }, steps: [{ do: 'click', slot: 'pin' }], expect: [{ event: 'onValueChange', calls: 1 }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { pin: ['aria-pressed', 'aria-label'] },
    notes: [
      'The group has aria-label "Constraints"; pins are labelled Top, Bottom, Left, Right, Center X, Center Y.',
      'The pins are 2 to 4px wide: extend each hit area to 24px with a transparent pseudo-element so the pointer target stays usable (pins are 8px apart, so the extended areas must not overlap the neighbours).',
      'The selects repeat the same information as text so the picture is never the only cue.',
    ],
  },
  policies: ['P6'],
  composition: { uses: ['inspector-select'] },
  examples: [
    { id: 'alignment-and-constraints', title: 'Alignment & constraints', doc: 'position-size#alignment-and-constraints' },
  ],
  usage: [
    'Example reproduces the whole section (a 14px gap stack): (1) row, space between: an AlignBar with six items and a separator (Align left, Align horizontal centers, Align right | Align top, Align vertical centers, Align bottom) on the left and a neutral Badge "3 frames" on the right; (2) row with an 8px gap of three xs Buttons: secondary "Distribute H" (align-horizontal-distribute-center), secondary "Distribute V" (align-vertical-distribute-center), ghost "Fit to selection" (scan); (3) this component with value { horizontal: "left-right", vertical: "center" } and the note "Resizing the parent stretches width and keeps the frame centered vertically."',
    'In the specimen the on pins are left, right and the 2px-wide center-y bar (the vertical line). Geometry per specimen: center-x is the 20×2 horizontal bar and center-y the 2×20 vertical bar.',
    'Specimen oddity: the pin named "Center Y" draws a vertical line (it is on for the vertical constraint Center). A vertical constraint would more naturally draw the horizontal bar; the spec follows the specimen.',
    'Fixture contract: render(props) renders the defaults (Scale, Scale: every pin off) with the note; the pin-on state turns on the first pin in DOM order (top), so DOM order is top, bottom, left, right, center-x, center-y.',
    'Token request: size-pad-box 96px (also used by alignment-pad).',
  ],
});
