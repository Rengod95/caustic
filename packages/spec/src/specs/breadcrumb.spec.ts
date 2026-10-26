import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'breadcrumb',
  name: 'Breadcrumb',
  category: 'navigation',
  status: 'ready',
  purpose: 'Shows where the current page sits in a hierarchy. Ancestors are links in tertiary text; the current page is primary text and not a link. A long middle path collapses into an ellipsis control.',
  role: null,
  description: 'A navigation landmark wrapping an ordered list. The consumer composes the trail from BreadcrumbItem, BreadcrumbEllipsis and BreadcrumbCurrent children; separators are inserted between them by the component.',
  slots: [
    { name: 'root', el: 'nav', role: 'navigation', description: 'The landmark. Flex row, centred, 4px gap, wraps. aria-label supplied by the consumer.' },
    { name: 'list', el: 'ol', parent: 'root', description: 'Flex row that holds the entries (display contents is acceptable: the root owns the gap and wrapping).' },
    { name: 'item', el: 'a', parent: 'list', required: false, description: 'An ancestor link: tertiary text, inline-flex, 6px gap, 3px 6px padding, sm radius. Hover lifts to primary text on neutral.hover.' },
    { name: 'icon', el: 'any', parent: 'item', required: false, description: 'Optional leading lucide icon, 14px (the home icon on the first item).' },
    { name: 'separator', el: 'span', parent: 'list', description: 'A 14px chevron-right in neutral.graphic between entries. aria-hidden.' },
    { name: 'ellipsis', el: 'button', parent: 'list', required: false, description: 'Collapsed middle path: an xs IconButton with an ellipsis icon and an aria-label such as "Show 3 more". Press reveals the hidden entries (menu or expansion is the consumer’s).' },
    { name: 'current', el: 'span', parent: 'list', description: 'The current page: primary text, medium weight, 3px 6px padding, aria-current="page". Not a link.' },
  ],
  states: {
    hover: { pseudo: ['hover'], target: 'item' },
    'focus-visible': { pseudo: ['focus', 'focus-visible'], target: 'item' },
  },
  props: {
    'aria-label': { type: 'string', required: true, description: 'Landmark label (e.g. "Breadcrumb"). Required; no built-in English default.' },
    children: { type: 'ReactNode', description: 'The trail: BreadcrumbItem, BreadcrumbEllipsis and one BreadcrumbCurrent.' },
  },
  events: {},
  styles: [
    { slot: 'root', expect: { gap: 4, text: 'ui' } },
    { slot: 'item', expect: { fg: 'text.tertiary', radius: 'sm', padX: 6, padY: 3, gap: 6, text: 'ui' } },
    { slot: 'item', when: { state: 'hover' }, expect: { fg: 'text.primary', bg: 'neutral.hover' } },
    { slot: 'item', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'icon', expect: { height: 'icon-sm', width: 'icon-sm' } },
    { slot: 'separator', expect: { fg: 'neutral.graphic', height: 'icon-sm', width: 'icon-sm' } },
    { slot: 'current', expect: { fg: 'text.primary', padX: 6, padY: 3, text: 'ui', weight: 500 } },
  ],
  behavior: {
    keyboard: { Tab: 'moves through the links and the ellipsis control', Enter: 'follows the focused link' },
    pointer: ['hover on an ancestor link fills it with neutral.hover and raises the text to primary'],
    scenarios: [],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { root: ['aria-label'], current: ['aria-current'], ellipsis: ['aria-label'] },
    notes: ['The current page carries aria-current="page" and is not a link.', 'Separators are aria-hidden; the list semantics convey the order.', 'The ellipsis control needs an accessible name that says how many entries it hides.'],
  },
  policies: ['P5', 'P6'],
  flags: { floating: false },
  composition: { uses: ['icon-button'], radix: [] },
  examples: [{ id: 'trail', title: 'Breadcrumb', doc: 'breadcrumb#breadcrumb' }],
  usage: [
    'The example stacks two Breadcrumbs (the page column gap is 14px). First: a home icon + “Orbit” link, “Pricing refresh” link, “Pages” link, current “Pricing / Desktop”. Second: “Orbit” link, an ellipsis control labelled “Show 3 more”, current “Button / Primary”. A separator sits between every pair of entries.',
    'The home icon is a lucide icon passed into the first item; the item supplies the 14px icon size and 6px gap.',
    'Fixture convention: render(props) renders Orbit, Pricing refresh, Pages and the current page “Pricing / Desktop”; the harness probes item, separator and current.',
    'Hover on the first item in the fixture needs an href so the link is focusable and hoverable.',
  ],
});
