import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'avatar',
  name: 'Avatar',
  category: 'primitive',
  status: 'ready',
  purpose: 'Identifies a person (identity color + initials) or the agent (spectrum core).',
  role: 'img',
  slots: [
    { name: 'root', el: 'span', role: 'img', description: 'Circle; aria-label is the name.' },
    { name: 'presence', el: 'span', parent: 'root', required: false, description: 'Online dot.' },
  ],
  variants: {
    kind: { values: ['person', 'agent'], default: 'person' },
    color: { values: ['coral', 'iris', 'mint', 'amber', 'slate'], default: 'coral', description: 'Identity color for people.' },
  },
  sizes: { values: ['xs', 'sm', 'md', 'lg'], default: 'sm' },
  props: {
    name: { type: 'string', required: true, description: 'Accessible name; initials derive from it.' },
    presence: { type: 'boolean', default: false, description: 'Presence dot.' },
    kind: { type: "'person' | 'agent'", default: 'person', description: 'Agent shows the spectrum core.' },
    color: { type: "'coral' | 'iris' | 'mint' | 'amber' | 'slate'", default: 'coral', description: 'Identity color.' },
    size: { type: "'xs' | 'sm' | 'md' | 'lg'", default: 'sm', description: '16 · 24 · 32 · 36.' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'identity.coral', fg: 'identity.on-coral', radius: 'full', height: 'size-avatar-sm', width: 'size-avatar-sm', text: 'micro' }, note: 'Identity family: the hue\'s solid 9 per mode with its own on colour.' },
    { slot: 'root', when: { color: 'iris' }, expect: { bg: 'identity.iris', fg: 'identity.on-iris' } },
    { slot: 'root', when: { color: 'slate' }, expect: { bg: 'identity.slate', fg: 'identity.on-slate' } },
    { slot: 'root', when: { size: 'md' }, expect: { height: 'size-avatar-md', text: 'ui-sm' } },
    { slot: 'root', when: { size: 'xs' }, expect: { height: 'size-avatar-xs' } },
    { slot: 'root', when: { kind: 'agent' }, expect: { bg: 'surface.base' } },
    { slot: 'presence', when: { presence: true }, expect: { bg: 'success.solid', radius: 'full', height: 'size-presence' } },
  ],
  policies: ['P2', 'P6'],
  flags: { agent: { kind: ['agent'] }, motionLoop: false },
  usage: ['People get identity colors; only the agent gets the spectrum.'],
});
