import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'paint-well',
  name: 'PaintWell',
  category: 'inspector',
  status: 'ready',
  purpose: 'One solid paint in a row: a color well, its hex digits and its alpha. The same row shows a token-bound paint (token name and Detach), a mixed multi-selection and an invalid hex with a message.',
  description: 'Pure composition: ColorWell (md), HexInput and a NumberField for alpha, in a 3-column grid. Pressing the well opens the color picker (owned by the parent). Bound to a token, the hex field becomes the accent chip and the alpha column becomes a Detach button, so a bound paint cannot be edited by accident.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Vertical stack, 8px gap: the row, then the message when there is one.' },
    { name: 'row', el: 'div', parent: 'root', description: 'Grid: auto column (the well), 1fr (hex), 58px (alpha or Detach), 6px gap, items centered. 32px high.' },
    { name: 'well', el: 'any', parent: 'row', description: 'ColorWell md. Checker appearance for literal paints (split when alpha is below 100 %), flat for a token paint, mixed for differing values.' },
    { name: 'hex', el: 'any', parent: 'row', description: 'HexInput; bound, mixed and invalid states are passed through.' },
    { name: 'alpha', el: 'any', parent: 'row', required: false, description: 'NumberField without a label, unit "%", aria-label "Alpha", 0–100, 58px wide. Not rendered while a token is bound. Mixed shows the placeholder "Mixed".' },
    { name: 'detach', el: 'any', parent: 'row', required: false, description: 'IconButton xs (unlink icon), aria-label "Detach", in the third column of a bound row.' },
    { name: 'message', el: 'span', parent: 'root', required: false, description: 'Error line under an invalid row: "Use 3, 4, 6 or 8 hex digits." in danger.text.' },
  ],
  states: {
    bound: { props: { token: 'accent/solid' } },
    mixed: { props: { mixed: true } },
    invalid: { props: { invalid: true } },
  },
  props: {
    label: { type: 'string', default: 'Fill', description: 'Names the paint for assistive tech: the well is "<label> color", the fields "<label> hex" and "<label> opacity" (e.g. Shadow, Stroke).' },
    value: { type: '{ hex: string; alpha: number }', description: 'Controlled paint: hex digits without # and alpha 0–100.' },
    defaultValue: { type: '{ hex: string; alpha: number }', default: { hex: 'E2763F', alpha: 100 }, description: 'Uncontrolled initial paint.' },
    token: { type: 'string', description: 'Token path the paint is bound to; shows the bound chip and Detach.' },
    tokenColor: { type: 'string', description: 'CSS color of the bound token (e.g. "var(--cs-color-accent-solid)") painted in the well while bound.' },
    mixed: { type: 'boolean', default: false, description: 'Differing paints in the selection.' },
    invalid: { type: 'boolean', default: false, description: 'The typed hex is not 3, 4, 6 or 8 digits.' },
    message: { type: 'ReactNode', description: 'Error text for an invalid row.' },
    disabled: { type: 'boolean', default: false, description: 'Disables the row.' },
  },
  events: {
    onValueChange: { payload: '{ hex: string; alpha: number }', when: 'hex or alpha commits a valid value' },
    onWellClick: { payload: 'void', when: 'the well is pressed; the owner opens the color picker' },
    onDetach: { payload: 'void', when: 'Detach is pressed on a bound row' },
  },
  styles: [
    { slot: 'root', expect: { gap: 8 } },
    { slot: 'row', expect: { gap: 6, height: 'control-md' } },
    { slot: 'alpha', expect: { width: 'size-field-alpha-w' } },
    { slot: 'message', when: { invalid: true }, expect: { fg: 'danger.text', text: 'hint' } },
  ],
  behavior: {
    keyboard: { Tab: 'well, hex, alpha (or well, Detach when bound)', Enter: 'commit the focused field / open the picker from the well' },
    pointer: ['press the well to open the picker', 'bound: press Detach to turn the token paint into the literal color it resolves to'],
    scenarios: [
      { name: 'well click', steps: [{ do: 'click', slot: 'well' }], expect: [{ event: 'onWellClick', calls: 1 }] },
      { name: 'detach click', props: { token: 'accent/solid' }, steps: [{ do: 'click', slot: 'detach' }], expect: [{ event: 'onDetach', calls: 1 }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { detach: ['aria-label'] },
    notes: ['Hex and alpha need aria-labels (Hex / Alpha, or the property: "Stroke color", "Shadow color", "Shadow opacity"). The well is labelled with the paint.', 'The invalid message is linked to the hex input with aria-describedby.'],
  },
  policies: ['P6'],
  composition: { uses: ['color-well', 'hex-input', 'number-field', 'icon-button'] },
  examples: [
    { id: 'paint-well-control', title: 'Paint well control', doc: 'paint-well#paint-well-control' },
  ],
  usage: [
    'Example reproduces five rows in an 8px stack: (1) E2763F at 100 %; (2) 5F4994 at 40 % (well split: paint color-mix(in oklab, #5f4994 40%, transparent), solid #5f4994); (3) bound: token "accent/solid", well flat in var(--cs-color-accent-solid), Detach; (4) mixed: well mixed, hex and alpha with the placeholder "Mixed"; (5) invalid: hex "E2763" with aria-invalid and, after the rows, the message "Use 3, 4, 6 or 8 hex digits." (hint role, danger.text).',
    'Fixture contract: render(props) renders the defaults (E2763F, 100 %). The message line is part of the row stack: in the specimen it follows the fifth row at the same 8px gap.',
    'The invalid message in the specimen is a sibling of the five rows; here it belongs to the invalid row (8px below it), which renders identically.',
    'Token request: size-field-alpha-w 58px (alpha / opacity column; also used by paint-stack and effect-editor).',
  ],
});
