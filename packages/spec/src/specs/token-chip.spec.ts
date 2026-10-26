import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'token-chip',
  name: 'TokenChip',
  category: 'primitive',
  status: 'ready',
  purpose: 'Names a design token in binding UIs: a color swatch or a kind icon plus the token path in mono. Bound tokens take the accent soft fill.',
  description: 'Read-only. Used in token binding (alias chains), as the leading marker of combobox options (swatch only, compact) and inside a select trigger (swatch + name, compact). The editable bound-property row of the inspector is a different component (inspector-bindings).',
  role: null,
  slots: [
    { name: 'root', el: 'span', description: 'Mono token chip. Padding is 4px start / 8px end (3px / 6px compact) so the swatch sits near the edge.' },
    { name: 'swatch', el: 'span', parent: 'root', required: false, description: 'Color swatch: 16px (14px compact), xs radius, 1px inset ring. The fill is supplied by the consumer (the token color).' },
    { name: 'icon', el: 'any', parent: 'root', required: false, description: 'Kind icon for non-color tokens (space, radius…), 12px, tertiary. Use instead of a swatch.' },
    { name: 'label', el: 'span', parent: 'root', required: false, description: 'Token path or name. Omitted for swatch-only chips (combobox options, where the option text is separate).' },
  ],
  variants: {
    tone: { values: ['neutral', 'bound'], default: 'neutral', description: 'bound = the property is bound to this token (accent soft fill and accent border).' },
  },
  sizes: { values: ['sm', 'md'], default: 'md' },
  props: {
    tone: { type: "'neutral' | 'bound'", default: 'neutral', description: 'Binding state.' },
    size: { type: "'sm' | 'md'", default: 'md', description: 'Height 20 · 24.' },
    swatch: { type: 'ReactNode', description: 'Swatch fill element for color tokens.' },
    icon: { type: 'ReactNode', description: 'Kind icon for non-color tokens.' },
    children: { type: 'ReactNode', description: 'Token path or name; omit for a swatch-only chip.' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'neutral.well', fg: 'text.primary', edge: 'border.default', radius: 'md', height: 'control-xs', gap: 6, font: 'mono', text: 'mono-md' }, note: 'Specimen radius is 7px (between sm 6 and md 8); md is used. Padding-inline 4px start / 8px end cannot be expressed by padX.' },
    { slot: 'root', when: { tone: 'bound' }, expect: { bg: 'accent.soft', edge: 'accent.border-strong' }, note: 'The bound edge is accent.border-strong (step 7); accent.border is now the step 6 decorative border.' },
    { slot: 'root', when: { size: 'sm' }, expect: { height: 'control-2xs' }, note: 'Padding-inline 3px start / 6px end.' },
    { slot: 'swatch', expect: { height: 'icon-md', width: 'icon-md', radius: 'xs', edge: 'swatch.edge' } },
    { slot: 'swatch', when: { size: 'sm' }, expect: { height: 'icon-sm', width: 'icon-sm' } },
    { slot: 'icon', expect: { fg: 'text.tertiary', height: 'icon-xs', width: 'icon-xs' } },
  ],
  a11y: { notes: ['The token name is text; the swatch is decorative (aria-hidden). Do not rely on the swatch color alone to identify a token.', 'Swatch-only chips must sit next to the option text that names the token.'] },
  policies: ['P6'],
  usage: [
    'Pair a swatch with color tokens and a kind icon with dimension tokens.',
    'Use tone="bound" for the token currently bound to a property.',
    'Compact (sm) in menus and select triggers; md in alias chains and binding panels.',
    'Not an interactive control: wrap it in a button when it must be clickable.',
  ],
});
