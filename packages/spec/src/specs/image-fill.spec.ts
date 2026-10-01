import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'image-fill',
  name: 'ImageFill',
  category: 'inspector',
  status: 'ready',
  purpose: 'Edits an image paint: a preview that shows how the image sits in its shape, a fit mode (fill, fit, crop, tile), a Replace button and the file facts.',
  description: 'Composition of a preview stage, a SegmentedControl xs and a secondary xs Button. The preview is the mode picture: the image animates between the four layouts with a spring so the difference is obvious. The image itself is data (a URL or a CSS image); nothing in this component draws a brand color.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Vertical stack, 14px gap (stage, controls, file line).' },
    { name: 'stage', el: 'div', parent: 'root', description: 'The shape the image fills: 110px high, xl radius, checkerboard (canvas.checker-a / canvas.checker-b) behind the image, overflow hidden, relative. data-mode = the current mode.' },
    { name: 'image', el: 'span', parent: 'stage', description: 'The image, absolutely positioned and animated (inset, with duration-gentle and ease-spring): fill = inset 0, square corners; fit = inset 0 22 % (letterboxed), square; crop = inset −20 % −10 % −10 % −30 % with an md radius (the image is larger than the stage); tile = inset 0 repeating at a third of the width and half the height.' },
    { name: 'crop-frame', el: 'span', parent: 'stage', description: 'Crop only (opacity 0 otherwise, fade duration-base): a dashed 1.5px canvas.handle frame inset 14px 30px, xs radius, with a 999px black 35 % shadow that dims everything outside it.' },
    { name: 'controls', el: 'div', parent: 'root', description: 'Row, space between, 8px gap, items centered.' },
    { name: 'mode', el: 'any', parent: 'controls', description: 'SegmentedControl xs (raised): Fill (default), Fit, Crop, Tile.' },
    { name: 'replace', el: 'any', parent: 'controls', description: 'Button secondary xs with the upload icon and the label "Replace".' },
    { name: 'file', el: 'div', parent: 'root', description: 'Row, 8px gap, 12px text.' },
    { name: 'file-name', el: 'span', parent: 'file', description: 'File name, mono, tertiary ("hero-photo.avif").' },
    { name: 'file-meta', el: 'span', parent: 'file', description: 'Facts, tertiary ("· 2400 × 1600 · 412 KB").' },
  ],
  variants: {
    mode: { values: ['fill', 'fit', 'crop', 'tile'], default: 'fill', description: 'How the image sits in the shape.' },
  },
  states: {
    'crop-mode': { props: { mode: 'crop' } },
  },
  props: {
    mode: { type: "'fill' | 'fit' | 'crop' | 'tile'", default: 'fill', description: 'Fit mode (controlled).' },
    defaultMode: { type: "'fill' | 'fit' | 'crop' | 'tile'", default: 'fill', description: 'Uncontrolled initial mode.' },
    src: { type: 'string', description: 'The image as a CSS image value or URL. Set through a custom property; the specimen uses a generated placeholder (radial and linear gradients).' },
    fileName: { type: 'ReactNode', description: 'File name.' },
    fileMeta: { type: 'ReactNode', description: 'Dimensions and size.' },
    disabled: { type: 'boolean', default: false, description: 'Disables the controls.' },
  },
  events: {
    onModeChange: { payload: "'fill' | 'fit' | 'crop' | 'tile'", when: 'a mode is chosen' },
    onReplace: { payload: 'void', when: 'Replace is pressed; the owner opens the file picker' },
  },
  styles: [
    { slot: 'root', expect: { gap: 14 } },
    { slot: 'stage', expect: { radius: 'xl', height: 'size-image-preview-h' } },
    { slot: 'image', when: { mode: 'crop' }, expect: { radius: 'md' } },
    { slot: 'crop-frame', when: { mode: 'crop' }, expect: { radius: 'xs', opacity: 1 }, note: '1.5px dashed canvas.handle frame, 999px black 35 % shadow. Opacity 0 in the other modes.' },
    { slot: 'controls', expect: { gap: 8 } },
    { slot: 'file', expect: { gap: 8, text: 'ui-sm', weight: 400 } },
    { slot: 'file-name', expect: { fg: 'text.tertiary', font: 'mono', text: 'mono' } },
    { slot: 'file-meta', expect: { fg: 'text.tertiary', text: 'ui-sm', weight: 400 } },
  ],
  behavior: {
    keyboard: { Tab: 'mode, Replace', 'Arrow keys': 'on the mode control: previous / next mode' },
    pointer: ['choosing a mode moves the image to that layout with a spring; the crop frame fades in for Crop only', 'Replace asks the owner to open a file picker'],
    scenarios: [
      { name: 'replace click', steps: [{ do: 'click', slot: 'replace' }], expect: [{ event: 'onReplace', calls: 1 }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    notes: ['The mode control is a radio group labelled "Image fill mode".', 'The preview is decorative (aria-hidden); the file line carries the facts as text.', 'Reduced motion: the image moves without the spring (no animation).'],
  },
  policies: ['P5', 'P6', 'P8'],
  composition: { uses: ['segmented-control', 'button'] },
  examples: [
    { id: 'image-fill', title: 'Image fill', doc: 'paint-stack#image-fill' },
  ],
  usage: [
    'Example reproduces the section (14px stack on the page): the stage in mode fill (the placeholder image fills it), the controls row (Fill selected on the left, "Replace" secondary xs with the upload icon on the right), and the file line "hero-photo.avif" (mono) · "· 2400 × 1600 · 412 KB".',
    'Fixture contract: render(props) renders mode fill with a placeholder image: radial-gradient(circle at 30% 35%, oklch(.85 .1 70), transparent 40%), radial-gradient(circle at 70% 60%, oklch(.6 .14 30), transparent 50%), linear-gradient(160deg, oklch(.75 .08 230), oklch(.45 .09 260)). These are image data, not tokens; the tile mode uses the first and last layer only at 33.33 % 50 % size.',
    'The stage in the studio shows the real image instead; the specimen image is a stand-in.',
    'Token request: size-image-preview-h 110px.',
  ],
});
