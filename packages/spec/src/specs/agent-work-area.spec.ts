import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'agent-work-area',
  name: 'AgentWorkArea',
  category: 'canvas',
  status: 'ready',
  purpose: 'Marks the part of the canvas the agent is working on: a spectrum rim 3px outside the object and a soft light band that scans down it. The agent counterpart of CanvasSelection, so a person and the agent are never confused on the canvas.',
  description: 'The root is a pointer-transparent box laid exactly over the object. Its ::after draws the rotating spectrum rim (2px, inset -3px, radius 18); with scanning, its ::before sweeps a vertical agent.glow band over the object every 2.6s. Both stop under reduced motion.',
  role: null,
  slots: [{ name: 'root', el: 'div', description: 'Overlay box over the object being worked on. aria-hidden; the activity is announced in the transcript.' }],
  variants: {},
  props: {
    scanning: { type: 'boolean', default: true, description: 'Run the scan band. Without it only the rim shows (the object is claimed but idle).' },
    radius: { type: 'number', description: 'Corner radius of the object in px (the specimen object is 14). Default 16 (2xl). The rim radius follows as radius + 3.' },
    rect: { type: 'OverlayRect', description: 'Object bounds in px from the canvas host origin. Applied as CSS custom properties.' },
  },
  styles: [
    { slot: 'root', expect: { radius: '2xl', agentRim: true }, note: 'Rim (::after): spectrum conic, 2px thick, inset -3px, radius 18 in the specimen. Scan (::before): linear-gradient 180deg transparent, agent.glow at 50%, transparent; 200% tall, sliding 2.6s ease-out infinite, opacity 0.6 (the nearest opacity token is muted, 0.64).' },
  ],
  a11y: {
    notes: ['Decorative and aria-hidden. What the agent is doing is stated in the agent activity and the transcript, not by the light.', 'The scan and the rim rotation stop under prefers-reduced-motion; the static rim remains.'],
  },
  policies: ['P2', 'P7', 'P8'],
  flags: { agent: true, motionLoop: true },
  composition: { uses: ['canvas-selection', 'agent-cursor'] },
  examples: [{ id: 'selection-human-vs-agent', title: 'Selection: human vs agent', doc: 'selection#selection-human-vs-agent' }],
  usage: [
    'P7: the person selection is canvas.selection with square handles; the agent work area is the spectrum rim with the scan band. Do not put handles or the accent outline on an object the agent is editing.',
    'Fixture convention: render(props) renders a 110 × 130 box with the default rim and scan.',
    'Example selection-human-vs-agent: a stage (canvas background, radius xl, min-height 200, padding 16, positioned) holding, left, a 120 × 36 dark block (radius 9, swatch color) at (22, 30) with a CanvasSelection (handles="corners", label "120 × 36") over it; right, a 110 × 130 surface-base card (radius 14, elevation 2) at right 22, top 24 with an AgentWorkArea radius 14 over it; and an AgentCursor “Caustic” at right 4, top 140. The dark block and the card are scaffolding (swatch custom properties and surface tokens).',
    'Token requests: duration-scan 2600 (animate-scan) or reuse duration-shimmer 2200.',
    'The specimen draws the scan band with a keyframe called scan that is not in the foundation; implementers may map it to the shimmer easing.',
  ],
});
