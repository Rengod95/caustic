import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'color-plane',
  name: 'ColorPlane',
  category: 'inspector',
  status: 'ready',
  purpose: 'Picks saturation (horizontal) and brightness (vertical) of one hue by dragging a thumb on a color plane. The hue slider and alpha slider sit next to it in the picker.',
  description: 'A 2D slider drawn from the current hue: white to the pure hue from left to right, with a transparent-to-black layer from top to bottom. The thumb is a ring that shows the picked color. The hue, the picked color and the thumb position are data (custom properties), never tokens.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'The plane: full width of its column, 150px high, xl radius, hairline inset edge, overflow hidden, crosshair cursor, touch-action none. Paints two layers: --cs-plane-hue to the right over white, and black from the bottom.' },
    { name: 'thumb', el: 'span', parent: 'root', role: 'slider', description: 'The 16px ring thumb at (saturation, 1 − brightness). 2.5px white border, fill is the picked color, soft shadow. Pointer events pass through it to the plane.' },
  ],
  states: {
    'focus-visible': { pseudo: ['focus', 'focus-visible'], target: 'thumb' },
    disabled: { props: { disabled: true } },
  },
  props: {
    value: { type: '{ s: number; v: number }', description: 'Controlled saturation and brightness, both 0–1.' },
    defaultValue: { type: '{ s: number; v: number }', description: 'Uncontrolled initial value.' },
    hue: { type: 'number', default: 0, description: 'Hue in degrees (0–360); the plane shows hsl(hue 100% 50%) on its right edge. Set as the --cs-plane-hue custom property.' },
    pickedColor: { type: 'string', description: 'CSS color at the current value, painted inside the thumb (--cs-plane-picked).' },
    disabled: { type: 'boolean', default: false, description: 'Disables the plane.' },
  },
  events: {
    onValueChange: { payload: '{ s: number; v: number }', when: 'pointer down, drag or an arrow key moves the thumb' },
    onValueCommit: { payload: '{ s: number; v: number }', when: 'the pointer is released or a key step ends' },
  },
  styles: [
    { slot: 'root', expect: { radius: 'xl', height: 'size-color-plane-h', edge: 'swatch.edge', cursor: 'crosshair' }, note: 'Layers: linear-gradient(0deg, black, transparent) over linear-gradient(90deg, white, hue). Black is the media.shade color token, white is media.on.' },
    { slot: 'thumb', expect: { radius: 'full', height: 'icon-md', width: 'icon-md', shadow: 'thumb-sm' }, note: 'Fill = pickedColor; 2.5px border in media.on (white); specimen shadow is 0 0 0 .5px black/.3 and 0 2px 6px black/.35 (thumb-sm is .12 / .2).' },
    { slot: 'thumb', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'root', when: { state: 'disabled' }, expect: { opacity: 0.42 } },
  ],
  behavior: {
    keyboard: { ArrowRight: 'saturation +1 %', ArrowLeft: 'saturation −1 %', ArrowUp: 'brightness +1 %', ArrowDown: 'brightness −1 %', 'Shift+Arrow': 'steps of 10 %', Home: 'saturation 0', End: 'saturation 100 %' },
    pointer: ['pressing anywhere on the plane moves the thumb there and starts a drag', 'the thumb stays inside the plane while dragging past its edge (values clamp to 0–1)'],
    scenarios: [
      { name: 'ArrowRight raises saturation', props: { defaultValue: { s: 0.5, v: 0.5 } }, steps: [{ do: 'focus', slot: 'thumb' }, { do: 'press', key: 'ArrowRight' }], expect: [{ event: 'onValueChange', args: [{ s: 0.51, v: 0.5 }] }] },
      { name: 'disabled ignores keys', props: { defaultValue: { s: 0.5, v: 0.5 }, disabled: true }, steps: [{ do: 'focus', slot: 'thumb' }, { do: 'press', key: 'ArrowRight' }], expect: [{ event: 'onValueChange', calls: 0 }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { thumb: ['aria-label', 'aria-valuetext'] },
    notes: ['The thumb is role="slider" with aria-label "Saturation and brightness" and aria-valuetext like "Saturation 95 %, brightness 89 %".', 'Color alone must not be the only cue: the picker always shows the hex field next to it.'],
  },
  policies: ['P6'],
  composition: { uses: [] },
  usage: [
    'No example of its own: it is inside the color-picker examples.',
    'Fixture contract: render(props) renders hue 22 with value { s: 0.72, v: 0.89 } and pickedColor "#E2763F" (the specimen picker).',
    'Specimen: plane 248 × 150 in the 268px picker; the thumb of the specimen sits at (72 %, 11 %).',
    'Tokens: size-color-plane-h 150px and media.shade (black) now exist.',
  ],
});
