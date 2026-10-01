import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'spinner',
  name: 'Spinner',
  category: 'primitive',
  status: 'ready',
  purpose: 'Shows that something is in progress when the duration is unknown: a ring with one dark arc turning.',
  role: 'status',
  slots: [{ name: 'root', el: 'span', role: 'status', description: 'Ring: fill.selected track, text.primary arc. Rotates linearly.' }],
  variants: { tone: { values: ['default', 'accent'], default: 'default', description: 'accent colors the arc with the accent.' } },
  sizes: { values: ['sm', 'md', 'lg'], default: 'md' },
  props: {
    size: { type: "'sm' | 'md' | 'lg'", default: 'md', description: '14 · 20 · 28 px.' },
    tone: { type: "'default' | 'accent'", default: 'default', description: 'Arc color.' },
    label: { type: 'string', default: 'Loading', description: 'Accessible name (aria-label).' },
    decorative: { type: 'boolean', default: false, description: 'aria-hidden with no role; use inside a control that already says it is busy (e.g. a loading Button).' },
  },
  styles: [
    { slot: 'root', expect: { radius: 'full', border: 'text.primary', height: 'icon-lg', width: 'icon-lg' }, note: 'Track (the other three sides) is fill.selected; only the arc color is asserted. Specimen border widths 1.75 / 2 / 2.5px compute to 1 / 2 / 2px at 1x; use the hairline classes 1.5px / 2px / 2px.' },
    { slot: 'root', when: { size: 'sm' }, expect: { height: 'icon-sm', width: 'icon-sm' } },
    { slot: 'root', when: { size: 'lg' }, expect: { height: 'size-spinner-lg', width: 'size-spinner-lg' } },
    { slot: 'root', when: { tone: 'accent' }, expect: { border: 'accent.solid' } },
  ],
  a11y: { notes: ['Named status (aria-label); announce completion elsewhere.', 'Reduced motion stops the rotation.'] },
  policies: ['P6', 'P8'],
  flags: { motionLoop: true },
  usage: [
    'Prefer Progress when the amount is known.',
    'Inside a control, use decorative and let the control carry aria-busy.',
    'Rotation is 0.7s linear infinite (Foundation has no 700ms duration token; see token requests).',
  ],
});
