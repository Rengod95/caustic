import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'color-well',
  name: 'ColorWell',
  category: 'inspector',
  status: 'ready',
  purpose: 'A swatch of the current paint: a flat color, a gradient or an alpha color over a checkerboard, with a diagonal split when the color is translucent and a hatch when the value is mixed.',
  description: 'The visual unit of every paint control: the left edge of PaintWell, the leading marker of a fill row, a gradient stop and a color preview. It draws what it is given: the paint is data (a CSS color or gradient passed through a custom property), never a token color. It is a button when it opens a picker (onClick or asChild), a plain span otherwise.',
  role: null,
  slots: [
    { name: 'root', el: 'span', description: 'Square swatch with an inset hairline edge (swatch.edge, black at 10%), overflow hidden, never shrinks. md = 32px / md radius; sm = 20px / sm radius. A button when interactive.' },
    { name: 'paint', el: 'span', parent: 'root', description: 'The color layer: fills the swatch with --cs-well-color (any CSS color or gradient) and repeats the 1px inset hairline. With split, only the bottom-right triangle (clip-path polygon(100% 0, 100% 100%, 0 100%)).' },
    { name: 'solid', el: 'span', parent: 'root', required: false, description: 'Split only: the opaque version of the color (--cs-well-solid) in the top-left triangle (clip-path polygon(0 0, 100% 0, 0 100%)), above the paint layer. Shows what the color is without alpha.' },
    { name: 'check', el: 'span', parent: 'root', required: false, description: 'Selected only (not while mixed): a check glyph (lucide Check, stroke 3, text.primary) on a round surface.base badge with a 1px inset selection.fill (ink) hairline, in the bottom-right corner above the paint so it reads on any user colour; md 14px, sm 10px; aria-hidden.' },
  ],
  variants: {
    appearance: { values: ['flat', 'checker'], default: 'flat', description: 'flat = the paint on the swatch; checker = a canvas.checker-a / canvas.checker-b checkerboard (8px cells, the cs-checker utility) behind the paint so alpha reads. Use checker for any paint that can be translucent.' },
  },
  sizes: { values: ['sm', 'md'], default: 'md' },
  states: {
    hover: { pseudo: ['hover'] },
    selected: { props: { selected: true } },
    'focus-visible': { pseudo: ['focus', 'focus-visible'] },
    mixed: { props: { mixed: true } },
    disabled: { props: { 'aria-disabled': true } },
  },
  props: {
    size: { type: "'sm' | 'md'", default: 'md', description: 'Swatch size 20 · 32.' },
    appearance: { type: "'flat' | 'checker'", default: 'flat', description: 'Checkerboard behind translucent paints.' },
    color: { type: 'string', description: 'CSS color or gradient to paint, e.g. "#e2763f", "linear-gradient(90deg, #e2763f, #5f4994)" or "var(--cs-color-accent-solid)". Set as the --cs-well-color custom property.' },
    solidColor: { type: 'string', description: 'With split: the opaque color of the top-left triangle (--cs-well-solid).' },
    split: { type: 'boolean', default: false, description: 'Draw the diagonal split: opaque top-left, translucent bottom-right. Use for colors with alpha below 100%.' },
    mixed: { type: 'boolean', default: false, description: 'A multi-selection with differing paints: no color, a 135° hatch of neutral.selected stripes (3px on, 3px off).' },
    selected: { type: 'boolean', default: false, description: 'This swatch is the active one: a 2px surface.base gap then a 1.5px selection.fill (ink) ring, and a check badge in the bottom-right corner (never the focus ring; a focused selected swatch shows the focus ring inside the ink ring). The paint is the content, so the swatch never inverts.' },
    asChild: { type: 'boolean', default: false, description: 'Render the child (a popover trigger) with swatch styling.' },
  },
  events: { onClick: { payload: 'React.MouseEvent<HTMLElement>', when: 'pressed; providing the handler makes the swatch a button with a pointer cursor' } },
  styles: [
    { slot: 'root', expect: { edge: 'swatch.edge', radius: 'md', height: 'control-md', width: 'control-md', cursor: 'pointer' } },
    { slot: 'root', when: { size: 'sm' }, expect: { radius: 'sm', height: 'control-2xs', width: 'control-2xs' } },
    { slot: 'root', when: { state: 'selected' }, expect: { edge: 'selection.fill', ring: 'none' }, note: 'Ink selection ring + check badge (owner 2026-10-26: all selection reads one colour; the paint is the content, so no inversion): 2px surface.base then 1.5px selection.fill (outer radius 3.5px); not the focus ring.' },
    { slot: 'check', when: { state: 'selected' }, expect: { bg: 'surface.base', fg: 'text.primary', edge: 'selection.fill', radius: 'full', height: 14, width: 14 }, note: 'sm: 10px badge.' },
    { slot: 'root', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'paint', expect: { radius: 'md', edge: 'swatch.edge' }, note: 'Inherits the swatch radius.' },
    { slot: 'paint', when: { state: 'disabled' }, expect: { edge: 'disabled.border' }, note: 'Disabled is colour, not opacity: the user paint keeps its colours and the paint (and split solid) layer draws the disabled.border edge; the root edge is covered by the paint.' },
  ],
  behavior: {
    keyboard: { Enter: 'open the picker (button form)', Space: 'open the picker (button form)' },
    pointer: ['press opens the picker owned by the parent control'],
    scenarios: [
      { name: 'click', steps: [{ do: 'click', slot: 'root' }], expect: [{ event: 'onClick', calls: 1 }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 20,
    notes: ['When interactive, give it an aria-label that names the paint ("Fill color E2763F"); a swatch that is only decoration is aria-hidden.', 'A swatch never carries information alone: the hex or token name sits next to it.', 'The sm swatch is 20px, below the 24px default target; inside a stack row the whole row is the larger target.'],
  },
  policies: ['P6'],
  composition: { uses: [] },
  usage: [
    'No example of its own: paint-well (default, token, mixed, invalid) and paint-stack show every look.',
    'Fixture contract: render(props) renders md with color "#e2763f" and appearance "checker". The mixed state sets mixed: true; sm uses size sm.',
    'Paint is data: pass --cs-well-color / --cs-well-solid as custom properties (inline style may only set custom properties).',
    'Specimen: the colors are runtime data (#e2763f, #5f4994 at 40 %, var(--cs-color-accent-solid), #2b1d14 at 50 %); the half swatch uses color-mix(in oklab, #5f4994 40%, transparent) for the paint and #5f4994 for the solid half.',
    'Specimen detail: the well border-radius is 8px (md) at 32px and 6px (sm) at 20px.',
  ],
});
