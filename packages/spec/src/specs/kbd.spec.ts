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
  styles: [{ slot: 'root', expect: { bg: 'fill.hover', fg: 'text.tertiary', radius: 'xs', height: 'size-kbd-h', text: 'label', frost: true } }],
  policies: ['P6'],
  usage: ['One Kbd per chord: <Kbd>⌘K</Kbd>.'],
});
