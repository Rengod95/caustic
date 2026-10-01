import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'swatch-strip',
  name: 'SwatchStrip',
  category: 'inspector',
  status: 'ready',
  purpose: 'A single row of palette swatches under a color picker: the colors already used on the page plus bound tokens. Pressing one picks that color; token swatches carry a small accent dot.',
  description: 'A radio group of equal square swatches on a grid. The number of columns sets the swatch size (9 columns in the full picker, 8 in the compact one). The colors are data: each item brings its CSS color and its accessible name; whether it is a token is a flag, not a color.',
  role: 'radiogroup',
  slots: [
    { name: 'root', el: 'div', role: 'radiogroup', description: 'Grid of equal columns (repeat(columns, 1fr)), 6px gap.' },
    { name: 'item', el: 'button', parent: 'root', role: 'radio', description: 'One swatch: square (aspect ratio 1), sm radius, a 1px inset swatch.edge hairline over its color. About 22px wide at 9 columns in a 248px picker.' },
    { name: 'token-dot', el: 'span', parent: 'item', required: false, description: 'Token marker: a 7px accent.solid dot with a 1.5px surface.base ring, at the bottom-right corner, sticking out 2px.' },
  ],
  states: {
    hover: { pseudo: ['hover'], target: 'item' },
    selected: { props: { defaultValue: 'orange' } },
    'focus-visible': { pseudo: ['focus', 'focus-visible'], target: 'item' },
  },
  props: {
    items: { type: '{ id: string; color: string; label: string; token?: boolean }[]', required: true, description: 'The swatches. color is any CSS color (a hex or a var(--cs-…) token color) set as --cs-swatch; label is the aria-label.' },
    value: { type: 'string', description: 'Controlled id of the picked swatch.' },
    defaultValue: { type: 'string', description: 'Uncontrolled initial pick.' },
    columns: { type: 'number', default: 9, description: 'Grid columns; 9 in the full picker, 8 in the compact picker.' },
  },
  events: { onValueChange: { payload: 'string', when: 'a swatch is chosen by click or arrow key' } },
  styles: [
    { slot: 'root', expect: { gap: 6 } },
    { slot: 'item', expect: { radius: 'sm', edge: 'swatch.edge' } },
    { slot: 'item', when: { state: 'selected' }, expect: { ring: 'focus' }, note: 'Specimen: 2px surface.base gap, then a 1.5px focus.ring ring.' },
    { slot: 'item', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'token-dot', expect: { bg: 'accent.solid', edge: 'surface.base', radius: 'full', height: 7, width: 7 }, note: 'Ring is 1.5px.' },
  ],
  behavior: {
    keyboard: { ArrowRight: 'select the next swatch', ArrowLeft: 'select the previous swatch', Tab: 'moves focus to the selected swatch, then out (roving tabindex)' },
    pointer: ['click picks a swatch and reports its id'],
    scenarios: [
      { name: 'click picks', props: { defaultValue: 'brown' }, steps: [{ do: 'click', slot: 'item' }], expect: [{ event: 'onValueChange', args: ['orange'] }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 22,
    attrs: { item: ['aria-checked', 'aria-label'] },
    notes: ['Every swatch needs an aria-label with the color or token name ("Orange", "accent"); the token dot is not announced separately, so token labels should say it ("accent token").', 'About 22px targets at 9 columns: just under the 24px default; the 6px gaps keep them separate.'],
  },
  policies: ['P6'],
  composition: { uses: [] },
  usage: [
    'No example of its own: it is inside the color-picker examples.',
    'Fixture contract: render(props) renders the nine specimen swatches in order — Orange #e2763f (id orange), Brown #2b1d14 (brown), accent (token, var(--cs-accent-600)), mint (token, var(--cs-mint-500)), Paper #f4ede4, Iris #5f4994, Sun #ffcf5a, Ink #111317, coral (token, var(--cs-coral-500)) — with orange selected through defaultValue "orange" in the example; the plain render has no selection.',
    'Specimen: the compact picker uses the same strip with 8 columns and no token dots; its swatches have a black 8 % hairline (swatch.edge is 10 %).',
  ],
});
