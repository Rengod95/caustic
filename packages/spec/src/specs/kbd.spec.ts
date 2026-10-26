import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'kbd',
  name: 'Kbd',
  category: 'primitive',
  status: 'ready',
  purpose: 'Shows a key or shortcut chord.',
  role: null,
  slots: [{ name: 'root', el: 'kbd', description: 'Key cap.' }],
  props: { children: { type: 'ReactNode', description: 'Key label, e.g. ⌘K.' } },
  styles: [{ slot: 'root', expect: { bg: 'neutral.well', fg: 'text.tertiary', edge: 'border.default', radius: 'xs', height: 'size-kbd-h', text: 'label' }, note: 'A resting key cap: neutral.well with a border.default hairline and a 1px bottom lip in the same colour; no blur, no elevation.' }],
  policies: ['P6'],
  usage: ['One Kbd per chord: <Kbd>⌘K</Kbd>.'],
});
