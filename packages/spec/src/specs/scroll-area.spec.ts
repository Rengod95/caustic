import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'scroll-area',
  name: 'ScrollArea',
  category: 'structure',
  status: 'draft',
  purpose: 'A scroll container with a token-styled thin scrollbar, optional edge fade and overflow state attributes. It keeps native scrolling (wheel, touch, keyboard, find-in-page) and replaces the Studio overlay that tracked arbitrary scroll containers.',
  description: 'One wrapper plus one native scrolling viewport; no Radix and no custom scrollbar thumb. The scrollbar is the browser\'s thin scrollbar coloured with border.strong (the same rule as the global base layer), shown on hover and focus or always. The viewport reports whether more content lies before or after the visible window through data attributes, which the edge fade and the consumer (for example a sticky shadow) read. The viewport is a keyboard-focusable region only while it actually overflows.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Relative, min-height 0 and min-width 0 so it can shrink inside a flex or grid parent; fills the space the parent gives it (the parent sets the bounded size). overflow hidden, inherits the parent\'s corner radius.' },
    { name: 'viewport', el: 'div', parent: 'root', role: 'region', description: 'The native scroller: fills the root, overflow auto on the axes named by orientation (hidden on the other), overscroll-behavior contain, scroll-behavior auto. Carries tabIndex 0 and role="region" with aria-label only while it overflows and a label is given. Data attributes data-overflow-y-start / -y-end / -x-start / -x-end ("true" when content lies before / after the visible window on that axis; present only for scrollable axes). With fade on, a mask-image fades the first and last space-6 (24px) of the overflowing axis, only on the side where content continues.' },
    { name: 'content', el: 'div', parent: 'viewport', description: 'Plain wrapper for the children, min-width 0; with horizontal scrolling it is width max-content so it can exceed the viewport.' },
  ],
  variants: {
    scrollbar: { values: ['hover', 'always'], default: 'hover', description: 'hover: the thumb is transparent until the pointer is over the area, the viewport has focus within, or it is scrolling; always: the thumb is always visible (for long reference lists).' },
  },
  states: {
    'focus-visible': { pseudo: ['focus', 'focus-visible'], target: 'viewport' },
  },
  props: {
    orientation: { type: "'vertical' | 'horizontal' | 'both'", default: 'vertical', description: 'Which axes scroll. The others are overflow hidden.' },
    scrollbar: { type: "'hover' | 'always'", default: 'hover', description: 'Scrollbar visibility.' },
    fade: { type: 'boolean', default: false, description: 'Fade the content out at the edges where more content continues (mask on the viewport, so it works on any surface colour).' },
    label: { type: 'string', description: 'Accessible name for the scrolling region. When given, the viewport is role="region" with this aria-label while it overflows. Supplied by the app so it can be translated. Provide it whenever the area is a primary reading surface (chat, layer tree, token list).' },
    viewportRef: { type: 'Ref<HTMLDivElement>', description: 'Ref to the scrolling element, for scroll-to-bottom and measuring.' },
    children: { type: 'ReactNode', description: 'Scrolled content.' },
  },
  events: {
    onScroll: { payload: 'UIEvent<HTMLDivElement>', when: 'the viewport scrolls (native scroll event, unthrottled)' },
  },
  styles: [
    { slot: 'viewport', when: { state: 'focus-visible' }, expect: { ring: 'focus' }, note: 'Focus ring is inset so the root\'s overflow hidden does not clip it.' },
    { slot: 'viewport', expect: { outline: 'none' } },
  ],
  behavior: {
    keyboard: {
      ArrowDown: 'scroll down by the native line step (focused viewport, vertical axis)',
      ArrowUp: 'scroll up',
      PageDown: 'scroll down by one viewport',
      PageUp: 'scroll up by one viewport',
      Home: 'scroll to the start',
      End: 'scroll to the end',
      'ArrowRight / ArrowLeft': 'scroll horizontally when orientation includes horizontal',
    },
    pointer: [
      'wheel, trackpad and touch scroll natively; the component never intercepts or re-dispatches them',
      'the thumb is draggable with the native scrollbar',
      'overscroll is contained so a scrolled-to-end panel does not scroll the page behind it',
      'scroll-behavior is auto: keyboard scrolling is immediate; reduced motion needs no extra handling',
    ],
    scenarios: [
      { name: 'overflow state at rest', props: { label: 'Layers' }, steps: [], expect: [{ slot: 'viewport', attr: { 'data-overflow-y-start': 'false', 'data-overflow-y-end': 'true', tabindex: '0', role: 'region', 'aria-label': 'Layers' } }] },
      { name: 'ArrowDown scrolls', props: { label: 'Layers' }, steps: [{ do: 'focus', slot: 'viewport' }, { do: 'press', key: 'ArrowDown' }], expect: [{ slot: 'viewport', attr: { 'data-overflow-y-start': 'true', 'data-overflow-y-end': 'true' } }] },
      { name: 'End reaches the end', props: { label: 'Layers' }, steps: [{ do: 'focus', slot: 'viewport' }, { do: 'press', key: 'End' }], expect: [{ slot: 'viewport', attr: { 'data-overflow-y-start': 'true', 'data-overflow-y-end': 'false' } }] },
      { name: 'Home returns to the start', props: { label: 'Layers' }, steps: [{ do: 'focus', slot: 'viewport' }, { do: 'press', key: 'End' }, { do: 'press', key: 'Home' }], expect: [{ slot: 'viewport', attr: { 'data-overflow-y-start': 'false', 'data-overflow-y-end': 'true' } }] },
      { name: 'PageDown scrolls by a page', props: { label: 'Layers' }, steps: [{ do: 'focus', slot: 'viewport' }, { do: 'press', key: 'PageDown' }], expect: [{ slot: 'viewport', attr: { 'data-overflow-y-start': 'true' } }] },
      { name: 'horizontal scrolls with ArrowRight', props: { orientation: 'horizontal', label: 'Tokens' }, steps: [{ do: 'focus', slot: 'viewport' }, { do: 'press', key: 'ArrowRight' }], expect: [{ slot: 'viewport', attr: { 'data-overflow-x-start': 'true', 'data-overflow-x-end': 'true' } }] },
      { name: 'scroll event is reported', props: { label: 'Layers' }, steps: [{ do: 'focus', slot: 'viewport' }, { do: 'press', key: 'End' }], expect: [{ event: 'onScroll' }] },
    ],
  },
  a11y: {
    labelRequired: false,
    minHit: 24,
    attrs: {},
    notes: [
      'A scrollable region must be reachable by keyboard (axe scrollable-region-focusable): the viewport takes tabIndex 0 only while content overflows, and drops it when everything fits so it does not add an empty tab stop.',
      'role="region" needs an accessible name; it is applied only when label is given. Areas that already sit inside a labelled landmark (a SidePanel body) and are not the main reading surface can omit label, in which case the viewport keeps tabIndex 0 but no region role.',
      'Native scrollbars keep platform behaviour for drag, click-to-page and assistive input; the component paints only colour and width through tokens.',
      'The edge fade is decorative and must not hide the last item: the faded band is 24px and the content keeps its own end padding.',
    ],
  },
  policies: ['P6', 'P8'],
  composition: { uses: [], radix: [] },
  examples: [],
  usage: [
    'Baselines: no HTML specimen exists. The orchestrator records baselines from the React render with `pnpm baseline:react scroll-area` after implementation; there are no examples[] entries until then.',
    'Fixture convention: render(props) renders the area in a frame 160px tall (240px wide for orientation horizontal) containing 20 rows of text (30 labelled tokens in a nowrap row for horizontal), so every scenario overflows. Row height and content are the fixture\'s concern.',
    'Replaces `StudioScrollAreas` in apps/studio/src/studio-overlays.tsx (an overlay that scanned the DOM and drew fixed-position tracks for any overflow container) and the .studio-scrollbar rules in studio-chrome.css (7px track, 2px inset thumb, 24% ink, 42% on hover, persistent variant in foundation-renewal.css). Studio containers that scroll adopt ScrollArea explicitly; the global base layer already thin-styles any remaining native scroller with border.strong.',
    'Studio places it in SidePanel bodies (layers, library, chat, inspector), tables and code blocks. Chat auto-scroll uses viewportRef; the component itself never scrolls programmatically.',
    'The scrolled size is set by the parent (a flex column child with min-height 0, or an explicit height); the area does not choose a height.',
  ],
});
