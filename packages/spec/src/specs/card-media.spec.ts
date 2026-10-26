import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'card-media',
  name: 'CardMedia',
  category: 'card',
  status: 'ready',
  purpose: 'Image-led card. Cover layout: a 16:9 image on top, then a header and an optional footer. Overlay layout: a 4:5 image with a scrim and the text laid over it. The whole card is one link.',
  description: 'The cover bleeds to the card edge and the card clips it to the corner radius. The header starts one inset (14px) below the cover, not one gap. In the overlay layout there are no header or footer sections.',
  role: null,
  slots: [
    { name: 'root', el: 'any', description: 'Card root: a link (a) when href is set, otherwise a div. Opaque surface with a 1px border.subtle hairline ring and no resting elevation (one depth cue); overflow hidden. On focus the hairline gives way to the focus ring and elevation 2.' },
    { name: 'cover', el: 'div', parent: 'root', description: 'Full-bleed media box: aspect 16/9 (cover) or 4/5 (overlay), overflow hidden.' },
    { name: 'image', el: 'any', parent: 'cover', description: 'The picture (an img, or a decorative element), filling the cover. Scales to 1.04 on card hover (duration-slow, ease-out).' },
    { name: 'tag', el: 'any', parent: 'cover', description: 'Cover layout only: a Badge pinned 12px from the top-left corner (solid tone for Draft).' },
    { name: 'overlay', el: 'div', parent: 'cover', required: false, description: 'Overlay layout only: bottom-anchored stack over a scrim (dark gradient from transparent at 40% to 78% black), 16px padding, 4px gap, white text.' },
    { name: 'overlay-tag', el: 'any', parent: 'overlay', required: false, description: 'Badge over the image: 20% white chip (media.chip), white text (media.on).' },
    { name: 'overlay-title', el: 'b', parent: 'overlay', required: false, description: 'Large headline over the image.' },
    { name: 'overlay-description', el: 'span', parent: 'overlay', required: false, description: 'Supporting line, 82% white.' },
  ],
  variants: {
    layout: { values: ['cover', 'overlay'], default: 'cover', description: 'cover = image above header and footer; overlay = text over the image on a scrim.' },
  },
  states: {
    hover: { pseudo: ['hover'] },
    'focus-visible': { pseudo: ['focus-visible'] },
  },
  props: {
    layout: { type: "'cover' | 'overlay'", default: 'cover', description: 'Layout.' },
    href: { type: 'string', description: 'Makes the root a link.' },
    size: { type: "'regular' | 'compact'", default: 'regular', description: 'Passed to Card.' },
    children: { type: 'ReactNode', description: 'CardMediaCover first, then optional header and footer parts (cover layout).' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'surface.base', edge: 'border.subtle', radius: '3xl', padX: 'inset-regular-x', padY: 'inset-regular-y', gap: 10, fg: 'text.primary' }, note: 'One depth cue: at rest the card draws the 1px hairline ring and no elevation. The cover pulls out to the edge with a negative margin equal to the inset; the card clips it. 14px between cover and header (4px extra under the cover).' },
    { slot: 'root', when: { state: 'focus-visible' }, expect: { ring: 'focus', shadow: '2' }, note: 'Focus replaces the hairline with the focus ring plus elevation 2.' },
    { slot: 'root', when: { layout: 'overlay' }, expect: { fg: 'media.on' }, note: 'Text over the scrim is white (media.on) in both themes. The cover aspect is 4/5.' },
    { slot: 'tag', expect: { radius: 'full' }, note: 'The badge keeps its own Badge styles; this slot only positions it (left 12, top 12, z above the image).' },
    { slot: 'overlay', when: { layout: 'overlay' }, expect: { padX: 16, padY: 16, gap: 4, fg: 'media.on' }, note: 'Scrim: linear-gradient(180deg, transparent 40%, black 78%). No token, see token requests (gradient-media-scrim). A chip row sits above the title and an action row 8px below the description.' },
    { slot: 'overlay-tag', when: { layout: 'overlay' }, expect: { bg: 'media.chip', fg: 'media.on', radius: 'full' }, note: 'The component owns the chip colour; the fixture passes no bg / text classes. Its contrast is read over the media (the art plus media.scrim-strong), not over surface.base.' },
    { slot: 'overlay-title', when: { layout: 'overlay' }, expect: { text: 'title-overlay', fg: 'media.on' } },
    { slot: 'overlay-description', when: { layout: 'overlay' }, expect: { text: 'ui-dense', fg: 'media.on-muted' }, note: 'Specimen is 12.5px at 82% opacity; use the color token, not an opacity.' },
  ],
  behavior: {
    pointer: ['the image scales to 1.04 while the card is hovered or focused', 'the whole card is the click target'],
  },
  a11y: {
    notes: [
      'When href is set the root is a single link; its accessible name is the title text. Do not put buttons or links inside it (the overlay "Use template" is a visual affordance, not a second link).',
      'Overlay text always sits on the gradient scrim so white text keeps its contrast over any image.',
      'Informative images need alt; decorative covers use alt="".',
    ],
  },
  policies: ['P5', 'P6', 'P8'],
  composition: { uses: ['card', 'badge', 'avatar', 'button'] },
  examples: [{ id: 'media-card', title: 'Media card', doc: 'card-media#media-card' }],
  usage: [
    'Default fixture render shows every slot marked required here, even those that product code may omit (the gateway applies default-case style rules to them).',
    'Use for items that are recognized by their picture (projects, templates).',
    'Example fixture: 260px-min auto-fill grid, 14px gap, three cards (links, href "#"). 1 cover: gradient art (fixture literal), solid Badge "Draft" as the tag, header "Orbit Pay · Pricing" / "4 frames · edited 2m ago", footer: Avatar sm person + Avatar sm agent overlapped by -6px, spacer, meta with a message-circle icon "3". 2 cover: art b, header "Lagoon" / "Caustic default · 128 tokens" with a success Badge "AA" trailing. 3 overlay: art c blurred and scaled 1.2, overlay with the overlay tag "Template" (media.chip 20% white, media.on text), title "Checkout flow for subscription apps", description "6 screens · light and dark", a stock Button secondary xs "Use template" (no colour override).',
    'Art backgrounds are decorative gradients defined in the fixture; a real card supplies an img.',
  ],
});
