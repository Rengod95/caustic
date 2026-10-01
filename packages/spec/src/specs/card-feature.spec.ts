import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'card-feature',
  name: 'CardFeature',
  category: 'card',
  status: 'ready',
  purpose: 'Bento-grid tile of mixed sizes with a very quiet accent glow in one corner. Holds an icon, a headline, a sentence and optionally a visual.',
  description: 'The card fills its grid cell. In the fill layout the content blocks are spread top to bottom and the visual takes the remaining height.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Card root: Card layout on an opaque surface; overflow hidden. A decorative glow (an accent.soft radial gradient, 80% wide, offset -30% right and -40% top) sits behind the content.' },
    { name: 'headline', el: 'span', parent: 'root', description: 'Large title (balanced wrapping) used in the hero tile; small tiles use the card title (titleSize sm).' },
    { name: 'visual', el: 'div', parent: 'root', description: 'Inset visual well: xl radius, bg.inset fill, at least 80px tall, content centered, pushed to the bottom (margin-top auto), fills the remaining height.' },
  ],
  variants: {
    fill: { values: ['hug', 'fill'], default: 'hug', description: 'fill spreads the sections with space-between so a tall tile aligns its visual to the bottom.' },
  },
  props: {
    fill: { type: "'hug' | 'fill'", default: 'hug', description: 'Distribution of sections.' },
    size: { type: "'regular' | 'compact'", default: 'regular', description: 'Passed to Card.' },
    children: { type: 'ReactNode', description: 'Card parts, headline and visual.' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'surface.base', edge: 'border.subtle', shadow: '1', radius: '3xl', padX: 'inset-regular-x', padY: 'inset-regular-y', gap: 10, fg: 'text.primary' } },
    { slot: 'headline', expect: { text: 'title-feature', fg: 'text.primary' }, note: '19 / 24 / 600, tracking -0.02em. title-2 is 20 / 26: 2px taller per line, so a new role is requested.' },
    { slot: 'visual', expect: { bg: 'bg.inset', radius: 'xl', minHeight: 80 } },
  ],
  a11y: { notes: ['Static tile. Make the headline a heading only when the page structure wants it.', 'The glow is decorative and never carries text.'] },
  policies: ['P5', 'P6'],
  composition: { uses: ['card', 'icon-button'] },
  examples: [{ id: 'feature-card', title: 'Feature card · bento', doc: 'card-feature#feature-card-bento' }],
  usage: [
    'Default fixture render shows every slot marked required here, even those that product code may omit (the gateway applies default-case style rules to them).',
    'Use in marketing or overview grids; not for dense data.',
    'Example fixture: a four-column grid with 14px gap and rows of at least 150px (2 columns under 760px, 1 under 460px; fixture markup, not a component). Tile 1 spans 2 columns and 2 rows, fill layout: accent tile with wand-sparkles; body: headline "Describe a screen. Review every change." and the paragraph "The agent drafts frames from your theme and asks before it touches anything shared."; a flexible body holding a visual that contains a mock composer (glass box 86% wide, placeholder "Make the pricing cards feel premium", circular send button; fixture markup). Tile 2 spans 2 columns: centered header, neutral tile with contrast, title "Contrast is a build gate", description "96 rules · 24 hues". Tiles 3 and 4 are one cell each: tile + a body with a titleSize sm title ("Theme inheritance" / "Code you review") and a paragraph ("Override only what differs." / "React, SwiftUI, tokens.").',
    'The grid and the mock composer are fixture markup. The composer has no spec, so it is hand-built from tokens in the fixture; the glass in it is demo content, not part of CardFeature.',
  ],
});
