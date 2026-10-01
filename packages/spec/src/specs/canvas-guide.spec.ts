import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'canvas-guide',
  name: 'CanvasGuide',
  category: 'canvas',
  status: 'ready',
  purpose: 'Alignment aids drawn over the canvas: a smart guide (coral, appears while dragging), a user guide (iris, dragged out of a ruler), a distance measurement with its value, and the snap mark where two edges meet.',
  description: 'One component, four kinds. Smart guides and measurements use the coral canvas.guide color, user guides the iris canvas.guide-user color, so a guide you placed never reads as one the canvas offered. All are 1px hairlines drawn by the canvas host and never take focus.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'The line (smart, user), the measurement (line plus two 9px end caps) or the snap mark (7px square rotated 45°, with a 9px cross).' },
    { name: 'label', el: 'b', parent: 'root', required: false, description: 'Measurement value (e.g. 142), centered on the line. Measure only.' },
  ],
  variants: {
    kind: { values: ['smart', 'user', 'measure', 'snap'], default: 'smart', description: 'smart = coral snap guide; user = iris guide placed by the person; measure = distance with a value label; snap = the mark at a snapped corner.' },
    orientation: { values: ['horizontal', 'vertical'], default: 'horizontal', description: 'Line direction. Ignored for snap.' },
  },
  props: {
    kind: { type: "'smart' | 'user' | 'measure' | 'snap'", default: 'smart', description: 'Which aid.' },
    orientation: { type: "'horizontal' | 'vertical'", default: 'horizontal', description: 'Line direction.' },
    rect: { type: 'OverlayRect', description: 'Position and length in px from the canvas host origin: { left, top, width | height }. Applied as CSS custom properties (not inline layout styles).' },
    children: { type: 'ReactNode', description: 'Measure only: the value text.' },
  },
  styles: [
    { slot: 'root', when: { kind: 'smart', orientation: 'horizontal' }, expect: { bg: 'canvas.guide', height: 1 } },
    { slot: 'root', when: { kind: 'smart', orientation: 'vertical' }, expect: { bg: 'canvas.guide', width: 1 } },
    { slot: 'root', when: { kind: 'user', orientation: 'horizontal' }, expect: { bg: 'canvas.guide-user', height: 1 }, note: 'Specimen iris-500 at 0.8 opacity: token request canvas.guide-user with the alpha built in.' },
    { slot: 'root', when: { kind: 'user', orientation: 'vertical' }, expect: { bg: 'canvas.guide-user', width: 1 } },
    { slot: 'root', when: { kind: 'measure', orientation: 'horizontal' }, expect: { bg: 'canvas.guide', height: 1 }, note: 'End caps are 1px by 9px lines in canvas.guide, centered on each end (::before and ::after).' },
    { slot: 'root', when: { kind: 'measure', orientation: 'vertical' }, expect: { bg: 'canvas.guide', width: 1 } },
    { slot: 'label', when: { kind: 'measure' }, expect: { bg: 'canvas.guide', fg: 'canvas.guide-on', font: 'mono', text: 'mono-sm', weight: 600, padX: 4, radius: 'xs', height: 16 }, note: 'Specimen 600 10px / 16px mono; mono-sm is 11 / 16 / 500, so size is 1px larger.' },
    { slot: 'root', when: { kind: 'snap' }, expect: { height: 7, width: 7 }, note: 'Rotated 45° about its center and centered on the point. The 9px by 1.5px cross lines are canvas.guide (::before and ::after).' },
  ],
  a11y: { notes: ['Decorative and aria-hidden; the measured distance is also a number in the inspector.', 'Guide hairlines are 1px by design (not a pointer target); dragging a user guide is done from the ruler.'] },
  policies: ['P6', 'P7'],
  composition: { uses: [] },
  examples: [],
  usage: [
    'Fixture convention: render(props) renders one guide line 120px long; kind="measure" renders a 142px line with the label "142"; kind="snap" renders the mark.',
    'The overlays are placed in the canvas-overlays example (see CanvasSelection): a vertical user guide at left 600, a horizontal smart guide at top 168 (left 128, width 400), two snap marks at (338,168) and (128,168), a horizontal measurement “142” at (518,190) 142 wide, a vertical measurement “104” at (428,64) 104 tall.',
    'Token requests: canvas.guide-user (iris.500 at 0.8 alpha, both themes; passes 3:1 on bg.canvas and canvas.artboard).',
    'Color rule: selection is accent, smart guides and measurements are coral, user guides are iris (specimen usage note, translated).',
  ],
});
