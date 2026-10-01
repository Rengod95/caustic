import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'canvas-selection',
  name: 'CanvasSelection',
  category: 'canvas',
  status: 'ready',
  purpose: 'The human selection on the canvas: a 1.5px accent outline with square resize handles, an optional rotate handle and a size chip, or (mode hover) just the hover ring. Always accent, never spectrum, so a person selection is distinct from agent work.',
  description: 'The outline hugs the selected object exactly (no gap). Handles are 7px squares centered on the corners and edge midpoints; the rotate handle is a 14px circle 26px above the top edge, joined by a 12px stem. The size chip is a CanvasSizeLabel 24px below. mode="hover" draws a 1.5px canvas.hover ring around the hovered object and nothing else.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Positioned box over the selected object: 1.5px solid canvas.selection outline, no offset. For mode hover, a 1.5px canvas.hover ring.' },
    { name: 'handle', el: 'i', parent: 'root', required: false, description: 'A resize handle (up to eight: tl tm tr ml mr bl bm br). 7px square, canvas.handle fill, 1.5px canvas.selection border, 2px radius, centered on its corner or edge midpoint.' },
    { name: 'rotate', el: 'span', parent: 'root', required: false, description: 'Rotate handle: 14px circle, canvas.handle fill with a 1.5px canvas.selection ring, 26px above the top edge, with a 1.5px by 12px stem down to the box.' },
    { name: 'label', el: 'span', parent: 'root', required: false, description: 'The size chip (CanvasSizeLabel), centered 24px below the bottom edge.' },
  ],
  variants: {
    mode: { values: ['selected', 'hover'], default: 'selected', description: 'selected = outline, handles, label; hover = ring only.' },
  },
  states: {
    dragging: { props: { dragging: true } },
  },
  props: {
    mode: { type: "'selected' | 'hover'", default: 'selected', description: 'Selection or hover ring.' },
    handles: { type: "'all' | 'corners' | 'none'", default: 'all', description: 'Which resize handles: all eight, the four corners (the selection page), or none (a locked object).' },
    rotate: { type: 'boolean', default: false, description: 'Show the rotate handle above the top edge.' },
    label: { type: 'ReactNode', description: 'Size chip text, e.g. "180 × 44". Omit to hide it.' },
    radius: { type: 'number', description: 'Corner radius of the hovered or selected object in px (the hover ring follows it; the specimen hovers a 14px object). Default 2.' },
    rect: { type: 'OverlayRect', description: 'The object bounds in px from the canvas host origin. Applied as CSS custom properties.' },
    dragging: { type: 'boolean', default: false, description: 'A handle is being dragged: the size chip stays visible and the handles keep the pressed state.' },
  },
  events: {
    onHandlePointerDown: { payload: "{ handle: 'tl' | 'tm' | 'tr' | 'ml' | 'mr' | 'bl' | 'bm' | 'br' | 'rotate'; event: React.PointerEvent }", when: 'a handle is pressed; the canvas host starts the resize or rotate gesture' },
  },
  styles: [
    { slot: 'root', when: { mode: 'hover' }, expect: { edge: 'canvas.hover', radius: '2xs' }, note: 'Ring: box-shadow 0 0 0 1.5px canvas.hover; radius follows the hovered object (radius prop). Selected mode: outline 1.5px solid canvas.selection, offset 0 (an outline, not a border or shadow; the gateway has no probe for outline color); pointer-events none on the box, only handles take the pointer.' },
    { slot: 'handle', when: { mode: 'selected' }, expect: { bg: 'canvas.handle', border: 'canvas.selection', radius: '2xs', height: 7, width: 7 } },
    { slot: 'rotate', when: { rotate: true }, expect: { bg: 'canvas.handle', edge: 'canvas.selection', radius: 'full', height: 'icon-sm', width: 'icon-sm' }, note: 'Ring is 1.5px (box-shadow 0 0 0 1.5px canvas.selection). Stem: 1.5px by 12px canvas.selection, ::after.' },
    { slot: 'label', when: { mode: 'selected' }, expect: { bg: 'canvas.selection', fg: 'canvas.selection-on', height: 18 } },
  ],
  behavior: {
    keyboard: {},
    pointer: [
      'pressing a corner or edge handle starts a resize; Shift keeps the aspect ratio and Alt resizes from the center (see CanvasHint)',
      'pressing the rotate handle starts a rotation; the box and size chip follow',
      'the outline and hover ring never take the pointer (pointer-events none)',
    ],
    scenarios: [
      { name: 'pressing a handle reports it', props: { mode: 'selected', handles: 'all' }, steps: [{ do: 'click', slot: 'handle' }], expect: [{ event: 'onHandlePointerDown', calls: 1 }] },
    ],
  },
  a11y: {
    minHit: 7,
    notes: [
      'Drawn by the canvas for pointer use: aria-hidden, not focusable. Keyboard equivalents (arrow nudge, resize, rotate) are canvas commands, not part of this overlay.',
      'Contrast: canvas.selection on bg.canvas and canvas.artboard passes 3:1; canvas.handle against canvas.selection passes 3:1 (Foundation rules).',
      'Hit size: the handles are 7px, below the 24px default; minHit is lowered to 7 to match the specimen. The canvas host should enlarge the pointer target (transparent hit area) without changing the drawing.',
    ],
  },
  policies: ['P5', 'P6', 'P7'],
  composition: { uses: ['canvas-size-label', 'canvas-ruler', 'canvas-guide', 'canvas-marquee', 'canvas-artboard', 'frame-label', 'floating-bar', 'zoom-control', 'canvas-hint', 'button'] },
  examples: [{ id: 'overlay-set', title: 'Overlay set', doc: 'canvas-overlays#overlay-set' }],
  usage: [
    'Human selection is accent outline plus handles; agent work is spectrum rim plus scan band (AgentWorkArea). Never mix them on one object.',
    'Fixture convention: render(props) renders a 180 × 44 box with the full handle set, no rotate, label "180 × 44".',
    'Example overlay-set reproduces the whole canvas in one host: a relative box 420px tall, radius 2xl, overflow hidden, with the cs-canvas-grid background (this host is scaffolding in the fixture, like frame, not a component). Back to front: CanvasRuler corner, horizontal (marks 0..800 at left 80..880 step 100, band left 338 width 180) and vertical (marks 0..300 at top 60..360 step 100, band top 168 height 44); a vertical user CanvasGuide at left 600; a FrameLabel kind="artboard" “Checkout / Desktop” “960 × 600” at (100, 46); a CanvasArtboard at (100, 64) 560 × 300 holding sample wireframes in children (rounded bars and cards in light warm neutrals, passed as swatch custom properties because tokens do not define them); a hover CanvasSelection at (128, 168) 210 × 150 radius 14; a selected CanvasSelection at (338, 168) 180 × 44 with all handles, rotate and label “180 × 44”; a horizontal smart guide at top 168, left 128, width 400; two snap marks at (338, 168) and (128, 168); a horizontal measurement “142” (518, 190, 142 wide) and a vertical one “104” (428, 64, 104 tall); a size-sm FloatingBar at (452, 112) with an agent pill xs Button “Ask Caustic”, then the items “Create component”, “Auto layout”, “More”; a CanvasMarquee kind="marquee" at (700, 250) 120 × 90; a CanvasMarquee kind="draw" at (720, 84) 150 × 96 with label “150 × 96”; a glass ZoomControl at right 14, top 34 reading “100%”; and a CanvasHint at the bottom center with “⇧ constrain”, “⌥ from center”, “esc cancel”.',
    'The page also has an h2 Usage note (selection is accent, smart guides and measurements coral, user guides iris); it is not an example and is skipped.',
    'Open question: positions are px relative to the host, passed as rect. If implementers prefer left/top props instead of one rect object, the spec can be adjusted before approval.',
  ],
});
