import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'frame-label',
  name: 'FrameLabel',
  category: 'canvas',
  status: 'ready',
  purpose: 'The name and size of a frame, written above it on the canvas: a marker, the frame name and its dimensions.',
  description: 'kind="artboard" is the label of an artboard on the canvas (diamond marker, canvas.label color, mono size). kind="frame" is the quieter label of a frame in a comment context (frame icon, tertiary text, size in the same type). The label is positioned by the canvas host above the top-left corner of the frame.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Flex row, centered, no wrap. Absolutely placed by the canvas host, 18px above the frame.' },
    { name: 'marker', el: 'span', parent: 'root', description: 'artboard: a 7px diamond (rotated square, 1.5px current-color ring, 2px radius). frame: a 12px lucide frame icon.' },
    { name: 'name', el: 'span', parent: 'root', description: 'The frame name, e.g. "Checkout / Desktop".' },
    { name: 'size', el: 'span', parent: 'root', required: false, description: 'The dimensions, e.g. "960 × 600" (U+00D7).' },
  ],
  variants: {
    kind: { values: ['artboard', 'frame'], default: 'artboard', description: 'artboard = canvas label with a diamond and mono size; frame = quiet label with a frame icon and sans size.' },
  },
  states: {
    selected: { props: { selected: true } },
  },
  props: {
    kind: { type: "'artboard' | 'frame'", default: 'artboard', description: 'Which label.' },
    name: { type: 'string', required: true, description: 'Frame name.' },
    size: { type: 'string', description: 'Dimensions text.' },
    selected: { type: 'boolean', default: false, description: 'The frame is selected: the label takes the accent text color (artboard only; defined in the specimen CSS, not rendered by a section).' },
    rect: { type: 'OverlayRect', description: 'Position in px from the canvas host origin. Applied as CSS custom properties.' },
  },
  styles: [
    { slot: 'root', when: { kind: 'artboard' }, expect: { fg: 'canvas.label', gap: 5, text: 'ui-xs', weight: 500 }, note: 'Specimen 11px / 500. ui-xs is 11 / 18 / 400, with the weight override.' },
    { slot: 'root', when: { kind: 'frame' }, expect: { fg: 'text.tertiary', gap: 6, text: 'ui-xs', weight: 500 } },
    { slot: 'root', when: { kind: 'artboard', state: 'selected' }, expect: { fg: 'accent.text' } },
    { slot: 'marker', when: { kind: 'artboard' }, expect: { height: 7, width: 7, radius: '2xs' }, note: 'Diamond: rotate 45°, inset 1.5px ring in the text color.' },
    { slot: 'marker', when: { kind: 'frame' }, expect: { fg: 'text.tertiary', height: 'icon-xs', width: 'icon-xs' } },
    { slot: 'size', when: { kind: 'artboard' }, expect: { fg: 'text.disabled', font: 'mono', text: 'mono-sm' }, note: 'Specimen: mono-sm role at 10px (mono-sm is 11px), text.disabled.' },
    { slot: 'size', when: { kind: 'frame' }, expect: { fg: 'text.tertiary' } },
  ],
  a11y: { notes: ['The marker and icon are decorative; the label is text. In the product the name is also the layer name, so the label itself is aria-hidden over the canvas.', 'text.disabled on size is below the 4.5:1 text threshold in the specimen (decorative secondary label; Foundation lists canvas.label for the name only).'] },
  policies: ['P6'],
  composition: { uses: [] },
  examples: [],
  usage: [
    'Fixture convention: render(props) renders the artboard label "Checkout / Desktop" with the size "960 × 600"; kind="frame" renders the icon "frame" with "Checkout / iOS" and "390 × 844".',
    'Near-duplicates mapped: ab-label (artboard) and frame-label (frame) differ in gap (5 / 6), color (canvas.label / text.tertiary) and marker, so they are two kinds of one component.',
    'Used by the canvas-overlays example (artboard) and the comments example (frame); see CanvasSelection and CommentPin.',
  ],
});
