import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'canvas-marquee',
  name: 'CanvasMarquee',
  category: 'canvas',
  status: 'ready',
  purpose: 'The rectangle a person drags on the canvas: the marquee that selects what it touches, or the ghost of a shape being drawn, with its size chip.',
  description: 'Both are a tinted canvas.marquee fill with a selection-colored edge. The marquee has a solid 1px inset edge and square corners; the draw ghost has a dashed 1.5px edge, a 2px radius and a size chip centered 24px below it.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'The dragged rectangle.' },
    { name: 'label', el: 'span', parent: 'root', required: false, description: 'Size chip (CanvasSizeLabel), centered 24px below the bottom edge. Draw only.' },
  ],
  variants: {
    kind: { values: ['marquee', 'draw'], default: 'marquee', description: 'marquee = selection rectangle; draw = ghost of the shape being created.' },
  },
  props: {
    kind: { type: "'marquee' | 'draw'", default: 'marquee', description: 'Which rectangle.' },
    label: { type: 'ReactNode', description: 'Size chip text for draw, e.g. "150 × 96".' },
    rect: { type: 'OverlayRect', description: 'Rectangle bounds in px from the canvas host origin. Applied as CSS custom properties.' },
  },
  styles: [
    { slot: 'root', when: { kind: 'marquee' }, expect: { bg: 'canvas.marquee', edge: 'canvas.selection', radius: 'none' }, note: 'Edge is an inset 1px box-shadow in canvas.selection.' },
    { slot: 'root', when: { kind: 'draw' }, expect: { bg: 'canvas.marquee', border: 'canvas.selection', radius: '2xs' }, note: 'Border is 1.5px dashed canvas.selection.' },
    { slot: 'label', when: { kind: 'draw' }, expect: { bg: 'canvas.selection', fg: 'canvas.selection-on', height: 18 } },
  ],
  behavior: {
    keyboard: { Escape: 'cancel the drag (the canvas host handles it; see CanvasHint)', Shift: 'constrain to a square while drawing', Alt: 'draw from the center' },
    pointer: ['drag on empty canvas draws the marquee; release selects the objects it touches', 'with a shape tool, drag draws the ghost; release creates the shape'],
  },
  a11y: { notes: ['Drawn by the canvas for pointer use: aria-hidden and not focusable.'] },
  policies: ['P6', 'P7'],
  composition: { uses: ['canvas-size-label'] },
  examples: [],
  usage: [
    'Fixture convention: render(props) renders a 120 × 90 marquee; kind="draw" renders 150 × 96 with the label "150 × 96".',
    'Both appear in the canvas-overlays example (see CanvasSelection): marquee at (700, 250) 120 × 90, draw ghost at (720, 84) 150 × 96.',
  ],
});
