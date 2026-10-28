import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'floating-bar',
  intent: 'A glass capsule toolbar floating over the canvas: tools, toggles and an optional agent action.',
  roles: ['canvas.control', 'action.group'],
  alsoFits: ['choice.single', 'action.icon'],
  placement: ['canvas', 'overlay', 'stage'],
  keywords: ['tool dock', 'toolbox', 'tool palette', 'contextual toolbar', 'action bar', 'bottom bar', 'hud'],
  pairs: ['zoom-control', 'button', 'tooltip', 'canvas-selection'],
  consider: [
    { id: 'foundation-toolbar', when: 'the toolbar sits in a panel or header on a solid surface' },
    { id: 'button-group', when: 'a few attached buttons belong inline with other content' },
  ],
  guidance: [
    'lg suits the main tool capsule, md the canvas option toggles, sm a contextual bar above a selection.',
    'Use orientation="vertical" for a dock along the canvas edge; keep ZoomControl in horizontal bars.',
  ],
});
