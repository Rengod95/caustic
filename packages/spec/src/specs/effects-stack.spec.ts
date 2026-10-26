import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'effects-stack',
  name: 'EffectsStack',
  category: 'inspector',
  status: 'ready',
  purpose: 'The list of effects on a layer (drop shadow, background blur…): one row per effect with an icon, a name and its main value, and visibility and remove actions that stay visible.',
  description: 'A column of StackRows in the icon form with actions always shown. The effect that is being edited is edited by EffectEditor below the list. The section heading, add button and panel frame belong to InspectorSection; the specimen shows only the rows.',
  role: 'list',
  slots: [
    { name: 'root', el: 'div', role: 'list', description: 'Vertical stack of rows, 14px gap (the specimen section spacing).' },
    { name: 'row', el: 'any', parent: 'root', description: 'One StackRow (lead icon, actions always): the effect icon (square-stack for a drop shadow, droplet for a blur), the name, the main value in the meta ("24 px"), an empty control column, and the Hide / Show and Remove actions. A hidden effect takes the disabled colour (name, meta and icon in disabled.text, PROPOSAL A9) and shows "hidden" as its meta.' },
  ],
  props: {
    items: { type: '{ id: string; icon: ReactNode; label: ReactNode; name?: string; meta?: ReactNode; hidden?: boolean }[]', required: true, description: 'The effects, top first. name is the plain text passed to the labels functions when label is not a string.' },
    disabled: { type: 'boolean | Record<string, boolean>', default: false, description: 'true disables the actions of every row; a record keyed by effect id disables that row.' },
    reserved: { type: 'boolean | Record<string, boolean>', description: 'true reserves every row; a record keyed by effect id reserves that row: its actions are inert with aria-busy="true" and data-reserved; selecting the row for editing still works.' },
    labels: { type: '{ list: string; hide: (name: string) => string; show: (name: string) => string; remove: (name: string) => string; moveUp: (name: string) => string; moveDown: (name: string) => string }', required: true, description: 'Every accessible name; no English default. list names the list ("Effects"); the four functions build the aria-label of a row action from the row name (e.g. n => "Hide " + n).' },
    onMove: { type: '(change: { id: string; direction: "up" | "down" }) => void', description: 'Shows the move up and move down actions of StackRow (K2d). Omit for the specimen look.' },
  },
  events: {
    onItemChange: { payload: '{ id: string; hidden: boolean }', when: 'an effect visibility is toggled' },
    onRemove: { payload: 'string', when: 'an effect remove button is pressed; the payload is its id' },
    onSelect: { payload: 'string', when: 'a row is pressed; the owner shows that effect in the editor' },
  },
  styles: [
    { slot: 'root', expect: { gap: 14 } },
  ],
  behavior: {
    keyboard: { Tab: 'each row: visibility, remove' },
    pointer: ['pressing a row selects that effect for editing', 'the visibility action gives the row the disabled colour'],
    scenarios: [
      { name: 'reserved list is busy', props: { reserved: true }, steps: [], expect: [{ slot: 'row', attr: { 'aria-busy': 'true' } }] },
      { name: 'row click selects', steps: [{ do: 'click', slot: 'row' }], expect: [{ event: 'onSelect', calls: 1 }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    notes: ['The list is labelled "Effects"; each row is a list item whose actions are labelled "Hide drop shadow" / "Show background blur" (the row name is part of the label).'],
  },
  policies: ['P6'],
  composition: { uses: ['stack-row', 'effect-editor'] },
  examples: [
    { id: 'effects-stack-and-shadow', title: 'Effects stack & shadow', doc: 'effects#effects-stack-and-shadow' },
  ],
  usage: [
    'K2d: this part has no typed field, so there is no commitMode, onDraftChange or onPreviewChange; the value model reduces to disabled and reserved per effect id, plus the optional move actions. The effect values are edited in EffectEditor.',
    'K2d labels: no built-in English; the fixture passes "Effects" and the Hide / Show / Remove builders so the baseline stays identical. onMove and the labels moveUp and moveDown are used only when the owner reorders effects.',
    'Example reproduces the whole section as a 14px column on the page: (1) the rows: "Drop shadow" with meta "24 px" and the square-stack icon; "Background blur" with the droplet icon, hidden (disabled colour, meta "hidden", eye-off "Show") — both with actions always visible and the control column empty; then (2) the EffectEditor with preview true and the defaults (X 0, Y 12, Blur 24, Spread −6, 1F2128 at 20 %).',
    'Fixture contract: render(props) renders the two rows above.',
    'Specimen: the section has no heading or add button; both belong to the section frame in the studio and are not specified here.',
    'Specimen: the two rows are 14px apart, not 8: that is the page spacing of the specimen, and the component keeps it so the example matches.',
    'Specimen: the icon tile is 20px with an xs radius (stack-row lead icon).',
  ],
});
