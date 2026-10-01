import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'card-well',
  name: 'CardWell',
  category: 'card',
  status: 'ready',
  purpose: 'Double-bezel card: a pale shell holds an inset panel. Title and secondary information live on the shell; the key value or content lives in the panel.',
  description: 'The shell replaces the card inset with a 4px bezel and positions its own header and footer. Inner panel radius = outer radius minus 4 (concentric, P5).',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Shell: fill.pressed fill, 1px inset border.subtle ring, radius 3xl, 4px padding, no gap.' },
    { name: 'header', el: 'div', parent: 'root', description: 'Shell header, center-aligned row, 12px gap: title (flexible) and optional trailing meta or IconButton xs. Padding 10px 12px 12px.' },
    { name: 'title', el: 'span', parent: 'header', description: 'Shell title, small.' },
    { name: 'meta', el: 'span', parent: 'root', description: 'Tertiary 12px line with an optional icon, in the header or the footer; links use text.link.' },
    { name: 'panel', el: 'div', parent: 'root', description: 'Inset surface panel holding the content (a Card body: 10px gap). May bleed list rows to its edges.' },
    { name: 'footer', el: 'div', parent: 'root', description: 'Shell footer, 8px gap: meta on the left, link or action on the right. Padding 10px 12px 8px.' },
  ],
  props: {
    children: { type: 'ReactNode', description: 'Header, panel and footer sections.' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'fill.pressed', edge: 'border.subtle', radius: '3xl', padX: 4, padY: 4, gap: 0, fg: 'text.primary' } },
    { slot: 'header', expect: { padX: 12, gap: 12 }, note: 'Block padding is 10 above and 12 below (asymmetric; not asserted).' },
    { slot: 'title', expect: { text: 'title-4', fg: 'text.primary' }, note: 'Specimen forces 13px on title-3 (20px line, 600). title-4 is 13.5, within 1px.' },
    { slot: 'meta', expect: { text: 'ui-sm', weight: 400, fg: 'text.tertiary', gap: 6 } },
    { slot: 'panel', expect: { bg: 'surface.base', edge: 'border.subtle', shadow: 'well', radius: 'well-inner', padX: 'inset-regular-x', padY: 'inset-regular-y', gap: 10 }, note: 'Radius is 22 - 4 = 18 (concentric); no token, see token requests. Ring 0 0 0 1px border.subtle plus the well elevation.' },
    { slot: 'footer', expect: { padX: 12, gap: 8 }, note: 'Block padding is 10 above and 8 below (asymmetric; not asserted).' },
  ],
  a11y: { notes: ['Static container. Keep the shell title short; the panel carries the value so a screen reader reads title, then value.'] },
  policies: ['P5', 'P6'],
  composition: { uses: ['card', 'icon-button', 'badge', 'button'] },
  examples: [{ id: 'well-card', title: 'Well card', doc: 'card-well#well-card' }],
  usage: [
    'Default fixture render shows every slot marked required here, even those that product code may omit (the gateway applies default-case style rules to them).',
    'Shell title 13px, key figure in the panel.',
    'The shell header, title, meta and footer are CardWell-specific slots (data-slot card-well-header, card-well-title, card-well-meta, card-well-footer, card-well-panel); they may be built on the card parts with different padding.',
    'Example fixture: 320px-min two-column grid, 14px gap. Card 1: header "Usage this month" + meta "Oct 2026"; panel with a 30px / 34 / 600 figure "3,912" and a 14px "rounds" unit (the card-stat value styles; fixture markup) and a mini bar chart (8 equal-flex bars, 44px high, 4px gap, fill.selected, top corners 4 / bottom 2; heights 30, 45, 38, 62, 54, 70, 88, 20 percent; the seventh bar accent.solid; fixture markup); footer: meta with an info icon "Resets Nov 1", spacer, text.link "Details". Card 2: header "Connected providers" + IconButton xs (plus, "Add provider"); panel bleeds two list rows (32px tile, name + secondary line, trailing Badge success dot "Live" / Button secondary xs "Connect"). The list rows are hand-built in the fixture (52px min height, 8px 14px padding, 12px gap) until the list agent\'s item is approved.',
  ],
});
