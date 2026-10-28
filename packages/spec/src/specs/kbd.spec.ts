import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'kbd',
  name: 'Kbd',
  category: 'primitive',
  status: 'ready',
  purpose: 'Shows a key or shortcut chord.',
  role: null,
  slots: [{ name: 'root', el: 'kbd', description: 'Key cap.' }],
  variants: {
    tone: { values: ['neutral', 'accent', 'success', 'warning', 'danger', 'info', 'agent'], default: 'neutral', description: 'Colour family of the cap (common prop). neutral = the resting key; a status tone colours the fill, text and lip per variant.' },
    variant: { values: ['solid', 'soft', 'outline', 'ghost'], default: 'outline', description: 'Emphasis (common prop). outline = well fill with a hairline and a 1px bottom lip (the resting key; hued: tint 2 fill, border 6 edge and lip); soft = soft fill, no edge (neutral: neutral.well); solid = solid 9 fill (neutral: ink); ghost = text only.' },
    radius: { values: ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full'], default: 'xs', description: 'Corner radius token of the cap (common prop). Unset keeps xs (sm at size lg).' },
    shadow: { values: ['none', '1', '2', '3', '4', '5'], default: 'none', description: 'Elevation of the cap (common prop). Unset = none: a key cap is flat; an elevation replaces the hairline and lip.' },
  },
  sizes: { values: ['xs', 'sm', 'md', 'lg'], default: 'sm' },
  props: {
    children: { type: 'ReactNode', description: 'Key label, e.g. ⌘K.' },
    tone: { type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'agent'", default: 'neutral', description: 'Colour family of the cap.' },
    variant: { type: "'solid' | 'soft' | 'outline' | 'ghost'", default: 'outline', description: 'Emphasis: solid fill, soft fill, keycap edge (default) or text only.' },
    radius: { type: "'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full'", default: 'xs', description: 'Corner radius (radius token); unset keeps xs.' },
    shadow: { type: "'none' | '1' | '2' | '3' | '4' | '5'", default: 'none', description: 'Elevation (elevation token); unset is flat.' },
    size: { type: "'xs' | 'sm' | 'md' | 'lg'", default: 'sm', description: 'Cap height and type: xs 16 / micro, sm size-kbd-h 18 / label (today), md control-2xs 20 / ui-sm, lg control-xs 24 / ui; every size adds the 0.06em chord tracking.' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'neutral.well', fg: 'text.tertiary', edge: 'border.default', radius: 'xs', height: 'size-kbd-h' }, note: 'A resting key cap: neutral.well with a border.default hairline and a 1px bottom lip in the same colour; no blur, no elevation. Type: the label role (size, line height, weight) with 0.06em tracking (the caption tracking token) so the glyphs of a chord (⌘⇧K) read apart (owner 2026-10-27, B); the text key would assert the role tracking (0), so it is not used here.' },
    { slot: 'root', when: { tone: 'accent' }, expect: { bg: 'accent.tint', fg: 'accent.text', edge: 'accent.border' } },
    { slot: 'root', when: { variant: 'solid' }, expect: { bg: 'ink.solid', fg: 'ink.on' } },
    { slot: 'root', when: { variant: 'soft', tone: 'danger' }, expect: { bg: 'danger.soft', fg: 'danger.text' } },
    { slot: 'root', when: { radius: 'full' }, expect: { radius: 'full' } },
    { slot: 'root', when: { shadow: '2' }, expect: { shadow: '2' } },
    { slot: 'root', when: { size: 'lg' }, expect: { height: 'control-xs' }, note: 'ui role with the 0.06em chord tracking.' },
  ],
  policies: ['P6'],
  usage: ['One Kbd per chord: <Kbd>⌘K</Kbd>. The glyphs carry 0.06em tracking so modifier glyphs and the key read as separate symbols.'],
});
