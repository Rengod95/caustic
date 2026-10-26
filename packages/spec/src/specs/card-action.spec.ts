import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'card-action',
  name: 'CardAction',
  category: 'card',
  status: 'ready',
  purpose: 'A card that is one target: a link to somewhere (arrow in the corner) or one selectable choice (radio indicator). Lifts on hover.',
  description: 'Nothing interactive goes inside it. For a managed set of choices with arrow-key selection use ChoiceCards; CardAction in radio mode is the visual and semantic card only, grouped by the consumer in a radiogroup.',
  role: null,
  slots: [
    { name: 'root', el: 'any', description: 'Card root. kind=link: an anchor. kind=radio: a button with role=radio and aria-checked. Opaque surface with an inset hairline ring and no resting elevation (one depth cue), text left-aligned, pointer cursor.' },
    { name: 'arrow', el: 'span', parent: 'root', description: 'Link kind: arrow-up-right (14px, aria-hidden) at the trailing end of the header; moves 2px up and right on hover.' },
    { name: 'indicator', el: 'span', parent: 'root', required: false, description: 'Radio kind: decorative radio mark (18px, aria-hidden, no pointer events) at the trailing end of the header.' },
  ],
  variants: {
    kind: { values: ['link', 'radio'], default: 'link', description: 'link = the whole card navigates; radio = the whole card is one choice.' },
  },
  states: {
    hover: { pseudo: ['hover'] },
    'focus-visible': { pseudo: ['focus', 'focus-visible'] },
    selected: { props: { kind: 'radio', checked: true } },
  },
  props: {
    kind: { type: "'link' | 'radio'", default: 'link', description: 'Behaves as a link or as a radio.' },
    href: { type: 'string', description: 'Destination (link kind).' },
    checked: { type: 'boolean', description: 'Controlled selection (radio kind).' },
    defaultChecked: { type: 'boolean', default: false, description: 'Uncontrolled initial selection (radio kind).' },
    size: { type: "'regular' | 'compact'", default: 'regular', description: 'Passed to Card.' },
    children: { type: 'ReactNode', description: 'Card parts.' },
  },
  events: {
    onCheckedChange: { payload: 'boolean', when: 'a radio card is chosen by click, Enter or Space' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'surface.base', edge: 'border.subtle', radius: '3xl', padX: 'inset-regular-x', padY: 'inset-regular-y', gap: 10, fg: 'text.primary', cursor: 'pointer' }, note: 'One depth cue: at rest the card draws only the 1px inset border.subtle hairline, no elevation.' },
    { slot: 'root', when: { state: 'hover' }, expect: { shadow: 'lift' }, note: 'The lift elevation replaces the hairline (one depth cue, no edge on hover). Also translateY(-2px); transition transform + shadow with duration-base and the spring ease (ease-spring). Reduced motion keeps the shadow change and drops the transform.' },
    { slot: 'root', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'root', when: { kind: 'radio', state: 'selected' }, expect: { bg: 'surface.base', wash: 'neutral.selected', edge: 'selection.edge' }, note: 'Selection is neutral: the card stays opaque (surface.base) and the alpha neutral.selected fill is laid over it as a wash, so the stage never shows through. A 1.5px inset selection.edge replaces the hairline and the filled radio indicator is the check mark. No resting elevation.' },
    { slot: 'root', when: { kind: 'radio', checked: true, state: 'hover' }, expect: { bg: 'surface.base', wash: 'neutral.selected-hover', edge: 'selection.edge', shadow: 'lift' }, note: 'Hover on a selected card keeps the selected look, raises the wash one step (neutral.selected-hover) and adds the lift.' },
    { slot: 'root', when: { kind: 'radio', checked: true, state: 'focus-visible' }, expect: { edge: 'selection.edge', ring: 'focus' }, note: 'Selection never borrows the focus ring: a focused selected card shows the selection edge and the outer focus ring together.' },
    { slot: 'arrow', expect: { fg: 'text.tertiary', height: 'icon-sm', width: 'icon-sm' } },
    { slot: 'arrow', when: { state: 'hover' }, expect: { fg: 'text.primary' } },
    { slot: 'indicator', when: { kind: 'radio' }, expect: { height: 'size-check', width: 'size-check', radius: 'full' }, note: 'Reproduces the RadioGroup item: unselected = surface.base fill with a border.control ring; selected = accent.solid fill with a 7px accent.on dot.' },
  ],
  behavior: {
    keyboard: { Enter: 'follows the link, or chooses the radio card', Space: 'chooses the radio card' },
    pointer: ['the whole card is the target', 'hover lifts the card 2px and nudges the arrow'],
    scenarios: [
      { name: 'click chooses a radio card', props: { kind: 'radio', defaultChecked: false }, steps: [{ do: 'click', slot: 'root' }], expect: [{ event: 'onCheckedChange', args: [true] }, { slot: 'root', attr: { 'aria-checked': 'true' } }] },
      { name: 'radio card exposes its state', props: { kind: 'radio', defaultChecked: true }, steps: [{ do: 'focus', slot: 'root' }], expect: [{ slot: 'root', attr: { 'aria-checked': 'true' } }, { focused: 'root' }] },
    ],
  },
  a11y: {
    minHit: 24,
    notes: [
      'Link kind: a native anchor named by its title (and description). Radio kind: button role=radio with aria-checked; a set of them lives in a role=radiogroup with an aria-label (e.g. "Starting point"). Arrow-key movement is the group owner\'s job; use ChoiceCards when it must be built in.',
      'No other focusable element inside the card.',
      'The arrow and the indicator are aria-hidden; selection is also exposed as aria-checked, never color alone.',
    ],
  },
  policies: ['P5', 'P6', 'P8'],
  composition: { uses: ['card', 'radio-group'] },
  examples: [{ id: 'action-card', title: 'Action card', doc: 'card-action#action-card' }],
  usage: [
    'Default fixture render shows every slot marked required here, even those that product code may omit (the gateway applies default-case style rules to them).',
    'Example fixture: two grids stacked with a 14px gap. Grid 1 (260px-min auto-fill, 14px gap): link cards, href "#": accent tile with plus + a trailing arrow, then a body with a titleSize sm title "New project" and "Start blank or from a theme."; neutral tile with file-up + arrow, "Import" and "URL, HTML, JSX or Figma.". Grid 2 (same grid, role=radiogroup, aria-label "Starting point"): radio cards with a centered header: tile (monitor / smartphone), title "Desktop" / "Phone", description "1440 × 900" / "390 × 844", trailing indicator; Desktop is checked.',
    'Radio mode in the example is static (no roving tabindex, no arrow keys); the fixture only needs the checked state to render.',
  ],
});
