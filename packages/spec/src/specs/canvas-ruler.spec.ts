import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'canvas-ruler',
  name: 'CanvasRuler',
  category: 'canvas',
  status: 'ready',
  purpose: 'The measuring strips along the top and left edge of the canvas, plus the square corner where they meet: tick marks every 10 and 100 units, number labels, and a band that shows the range of the current selection.',
  description: 'One component renders one strip. orientation="horizontal" is the top ruler, "vertical" the left ruler and "corner" the 20 × 20 block between them. The strips sit on a thick glass fill over the canvas, with a hairline on the inner edge. Selection range is a tinted band bounded by two selection-colored lines.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'The strip (or corner). Absolutely placed by the canvas host: horizontal left 20 / right 0 / top 0 / height 20; vertical top 20 / bottom 0 / left 0 / width 20; corner left 0 / top 0 / 20 × 20. Corner sits above the strips.' },
    { name: 'mark', el: 'span', parent: 'root', required: false, description: 'A number label at a position along the strip (0, 100, 200…). Vertical labels are rotated to read bottom-to-top (vertical-rl, 180°).' },
    { name: 'band', el: 'span', parent: 'root', required: false, description: 'The selection range: accent.soft fill, 1px canvas.selection line on both ends.' },
  ],
  variants: {
    orientation: { values: ['horizontal', 'vertical', 'corner'], default: 'horizontal', description: 'Which strip.' },
  },
  props: {
    orientation: { type: "'horizontal' | 'vertical' | 'corner'", default: 'horizontal', description: 'Which strip.' },
    marks: { type: '{ at: number; label: string }[]', description: 'Labels and their positions along the strip, in px from its start. Ticks are drawn by the strip itself: a 5px tick every 10px and a 9px tick every 100px.' },
    band: { type: '{ start: number; size: number }', description: 'Selection range in px along the strip.' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'material.thick', border: 'border.default', fg: 'text.tertiary', font: 'mono', text: 'mono-ruler' }, note: 'Fill is material.thick with a 16px backdrop blur (no saturate); the specimen blur is between ultrathin (14) and thin (20), so implement with the ultrathin blur. The hairline is 1px border.default on the inner edge only (bottom for horizontal, right for vertical, both for the corner).' },
    { slot: 'root', when: { orientation: 'horizontal' }, expect: { height: 'control-2xs' } },
    { slot: 'root', when: { orientation: 'vertical' }, expect: { width: 'control-2xs' } },
    { slot: 'root', when: { orientation: 'corner' }, expect: { height: 'control-2xs', width: 'control-2xs' } },
    { slot: 'mark', expect: { fg: 'text.tertiary', font: 'mono', text: 'mono-ruler' }, note: 'Horizontal labels sit 2px from the top edge; vertical labels 2px from the left edge. Ticks: 1px lines in border.strong (every 10) and text.tertiary (every 100).' },
    { slot: 'band', expect: { bg: 'accent.soft' }, note: 'Inset 1px lines in canvas.selection on the two ends (box-shadow), so the band reads as the same range as the selection outline.' },
  ],
  a11y: { notes: ['Decorative: the rulers are drawn for sighted pointer users and are aria-hidden. Exact positions and sizes are available in the inspector.'] },
  policies: ['P1', 'P6'],
  flags: { floating: true },
  composition: { uses: [] },
  examples: [],
  usage: [
    'Fixture convention: render(props) renders the horizontal ruler with marks 0..800 every 100 (left 80, 180 … 880) and a band { start: 338, size: 180 }; orientation="vertical" uses marks 0, 100, 200, 300 at 60, 160, 260, 360 and a band { start: 168, size: 44 }; the corner renders no marks or band.',
    'The ruler is also part of the canvas-overlays example (see CanvasSelection).',
    'Token requests: mono-ruler (mono 9.5 / 12 / 500; no existing role within 1px, mono-sm is 11).',
    'Specimen bug candidate: the strips use backdrop-filter blur(16px) but not the glass saturate; every other floating surface uses material.* with the saturate(1.8) filter.',
  ],
});
