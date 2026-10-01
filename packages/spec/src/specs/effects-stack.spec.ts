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
    { name: 'row', el: 'any', parent: 'root', description: 'One StackRow (lead icon, actions always): the effect icon (square-stack for a drop shadow, droplet for a blur), the name, the main value in the meta ("24 px"), an empty control column, and the Hide / Show and Remove actions. A hidden effect is dimmed and shows "hidden" as its meta.' },
  ],
  props: {
    items: { type: '{ id: string; icon: ReactNode; label: ReactNode; meta?: ReactNode; hidden?: boolean }[]', required: true, description: 'The effects, top first.' },
    disabled: { type: 'boolean', default: false, description: 'Disables the actions.' },
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
    pointer: ['pressing a row selects that effect for editing', 'the visibility action dims the row'],
    scenarios: [
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
    'Example reproduces the whole section as a 14px column on the page: (1) the rows: "Drop shadow" with meta "24 px" and the square-stack icon; "Background blur" with the droplet icon, hidden (dimmed, meta "hidden", eye-off "Show") — both with actions always visible and the control column empty; then (2) the EffectEditor with preview true and the defaults (X 0, Y 12, Blur 24, Spread −6, 1F2128 at 20 %).',
    'Fixture contract: render(props) renders the two rows above.',
    'Specimen: the section has no heading or add button; both belong to the section frame in the studio and are not specified here.',
    'Specimen: the two rows are 14px apart, not 8: that is the page spacing of the specimen, and the component keeps it so the example matches.',
    'Specimen: the icon tile is 20px with an xs radius (stack-row lead icon).',
  ],
});
