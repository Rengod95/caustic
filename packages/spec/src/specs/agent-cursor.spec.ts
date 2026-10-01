import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'agent-cursor',
  name: 'AgentCursor',
  category: 'canvas',
  status: 'ready',
  purpose: 'The agent presence on the canvas: a spectrum-filled pointer arrow with a glass name tag ringed in spectrum, showing where the agent is acting.',
  description: 'A pointer arrow (18px, spectrum gradient fill with a white stroke and a soft drop shadow) and, 14px lower, a pill tag on thick glass with a small orb and the agent name. The tag has a rotating 1px spectrum rim.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Flex row, 2px gap, pointer-events none, above the canvas overlays.' },
    { name: 'pointer', el: 'svg', parent: 'root', description: '18px arrow path with the spectrum-1/2/3 linear gradient fill and a 1.5px white round-joined stroke.' },
    { name: 'tag', el: 'span', parent: 'root', description: 'Name tag: 22px pill on thick glass, 14px below the arrow tip, spectrum rim, elevation 3.' },
    { name: 'orb', el: 'span', parent: 'tag', description: 'The agent orb, small (12px).' },
    { name: 'label', el: 'span', parent: 'tag', description: 'The agent name.' },
  ],
  variants: {},
  props: {
    name: { type: 'string', default: 'Caustic', description: 'The agent name shown in the tag.' },
    rect: { type: 'OverlayRect', description: 'Position in px from the canvas host origin: { left | right, top | bottom }. Applied as CSS custom properties.' },
  },
  styles: [
    { slot: 'pointer', expect: { height: 'size-cursor', width: 'size-cursor' }, note: '18px; no existing token (icon-lg is 20, size-check and size-card-glyph are 18 but unrelated).' },
    { slot: 'tag', expect: { bg: 'material.thick', edge: 'material.rim', fg: 'text.primary', radius: 'full', height: 'control-compact-xs', padX: 8, gap: 6, shadow: '3', text: 'label', agentRim: true }, note: 'Padding is 0 8px 0 6px (the orb side is 6). Blur 16px in the specimen (not the thick 36). Rim ::after is 1px, spectrum conic, spinning 4.8s.' },
    { slot: 'orb', expect: { height: 12, width: 12, radius: 'full' } },
  ],
  a11y: { notes: ['Decorative and aria-hidden: the agent name and activity are in the agent activity list; the cursor only shows where.', 'The orb and rim stop spinning under prefers-reduced-motion.'] },
  policies: ['P1', 'P2', 'P7', 'P8'],
  flags: { floating: true, agent: true, motionLoop: true },
  composition: { uses: [] },
  examples: [],
  usage: [
    'Fixture convention: render(props) renders the cursor with the name “Caustic”.',
    'Used in the selection example (see AgentWorkArea) at right 4, top 140.',
    'A human collaborator cursor exists in the specimen CSS (.cursor.human: coral tag, white text, no orb) but no section renders it, so it is not specified; open question whether it should be.',
    'Token requests: size-cursor (18).',
  ],
});
