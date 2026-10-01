import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'paint-stack',
  name: 'PaintStack',
  category: 'inspector',
  status: 'ready',
  purpose: 'The Fill section of the inspector: a titled stack of paint layers (solid, gradient, token) with opacity and visibility, an add button and a styles button; or, for a multi-selection, one "Mixed paints" line with Replace all.',
  description: 'An InspectorSection whose body is a list of StackRows. Each layer shows its paint in a ColorWell sm, a name, a quiet detail and a 58px opacity field; the actions appear on hover. Pressing a swatch opens the color picker (or the gradient editor for a gradient); that is the owner’s job. Stroke and image fill are separate sections (stroke-editor, image-fill).',
  role: null,
  slots: [
    { name: 'root', el: 'section', description: 'An InspectorSection: 12px padding, 8px gap, a hairline below.' },
    { name: 'header', el: 'div', parent: 'root', description: 'Heading row of the section: title left, actions right, 24px high.' },
    { name: 'title', el: 'span', parent: 'header', description: 'Section name ("Fill", "Fill · 3 selected"), 11.5px semibold, secondary.' },
    { name: 'actions', el: 'span', parent: 'header', description: 'Flex row, 2px gap: the styles button and the add button.' },
    { name: 'styles', el: 'any', parent: 'actions', required: false, description: 'IconButton xs (grid-2x2), aria-label "Styles": opens the shared paint styles.' },
    { name: 'add', el: 'any', parent: 'actions', description: 'IconButton xs (plus), aria-label "Add fill".' },
    { name: 'row', el: 'any', parent: 'root', required: false, description: 'One StackRow per layer (rows are 36px, 8px apart).' },
    { name: 'summary', el: 'div', parent: 'root', required: false, description: 'Mixed state: a row, space between, 8px gap, items centered, 6px 8px padding, md radius, bg.inset, 12px text. Replaces the rows when the selection has differing paints.' },
    { name: 'summary-label', el: 'span', parent: 'summary', required: false, description: 'Flex row, 8px gap: a mixed ColorWell sm and the text "Mixed paints".' },
    { name: 'replace', el: 'any', parent: 'summary', required: false, description: 'Ghost xs Button "Replace all".' },
  ],
  states: {
    mixed: { props: { mixed: true } },
  },
  props: {
    title: { type: 'ReactNode', default: 'Fill', description: 'Section title. "Fill · 3 selected" for a multi-selection.' },
    items: { type: "{ id: string; color: string; split?: boolean; label: ReactNode; meta?: ReactNode; mono?: boolean; opacity: number; hidden?: boolean; checker?: boolean }[]", description: 'The layers, top first. color is any CSS color or gradient (data); mono draws the label as a token or hex name; checker puts the checkerboard under translucent colors.' },
    mixed: { type: 'boolean', default: false, description: 'Show the mixed summary instead of the rows (multi-selection with differing paints).' },
    disabled: { type: 'boolean', default: false, description: 'Disables every control.' },
  },
  events: {
    onAdd: { payload: 'void', when: 'the add button is pressed' },
    onStylesClick: { payload: 'void', when: 'the styles button is pressed' },
    onItemChange: { payload: '{ id: string; opacity?: number; hidden?: boolean }', when: 'a layer opacity is committed or its visibility toggled' },
    onRemove: { payload: 'string', when: 'a layer remove button is pressed; the payload is its id' },
    onItemOpen: { payload: 'string', when: 'a layer swatch is pressed (open the picker)' },
    onReplaceAll: { payload: 'void', when: 'Replace all is pressed on the mixed summary' },
  },
  styles: [
    { slot: 'root', expect: { padX: 12, padY: 12, gap: 8 } },
    { slot: 'title', expect: { fg: 'text.secondary', text: 'hint', weight: 600 } },
    { slot: 'actions', expect: { gap: 2 } },
    { slot: 'summary', when: { mixed: true }, expect: { bg: 'bg.inset', radius: 'md', padX: 8, padY: 6, gap: 8, text: 'ui-sm', weight: 400, fg: 'text.primary' } },
    { slot: 'summary-label', when: { mixed: true }, expect: { gap: 8 } },
  ],
  behavior: {
    keyboard: { Tab: 'styles, add, then each row (swatch, opacity, visibility, remove)' },
    pointer: ['hovering a row reveals its actions', 'pressing a swatch asks the owner to open the picker for that layer'],
    scenarios: [
      { name: 'add click', steps: [{ do: 'click', slot: 'add' }], expect: [{ event: 'onAdd', calls: 1 }] },
      { name: 'styles click', steps: [{ do: 'click', slot: 'styles' }], expect: [{ event: 'onStylesClick', calls: 1 }] },
      { name: 'replace all click', props: { mixed: true }, steps: [{ do: 'click', slot: 'replace' }], expect: [{ event: 'onReplaceAll', calls: 1 }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { add: ['aria-label'], styles: ['aria-label'] },
    notes: ['The section is labelled by its title; the list of layers is a list (role list) so the count is announced.', 'Each row exposes its paint as text (name and detail), not only through the swatch.'],
  },
  policies: ['P6'],
  composition: { uses: ['inspector-panel', 'stack-row', 'color-well', 'number-field', 'icon-button', 'button'] },
  examples: [
    { id: 'fill-stack', title: 'Fill stack', doc: 'paint-stack#fill-stack' },
  ],
  usage: [
    'Example reproduces one InspectorPanel (full width) with two PaintStacks. First: title "Fill", the styles and add buttons, three rows: (1) gradient swatch linear-gradient(90deg, #e2763f, #5f4994), label "Linear", meta "2 stops", opacity 100; (2) swatch var(--cs-color-accent-solid), label mono "accent/solid", meta "token", opacity 100; (3) hidden layer: checkerboard swatch #2b1d14 at 50 % (#2b1d1480), label mono "2B1D14", meta "hidden", opacity 50, eye-off "Show" action. Second: title "Fill · 3 selected" with mixed true: a mixed ColorWell sm, "Mixed paints" and the ghost xs "Replace all".',
    'Fixture contract: render(props) renders the first stack (three rows). The mixed state passes mixed.',
    'The first row of the specimen is a gradient: its meta says "2 stops"; for a solid paint the label is the hex.',
    'Specimen: the paint-stack has no drag handle for reordering; reorder behavior is not specified.',
    'Stroke and Image fill are the two other sections of the page and have their own specs (stroke-editor, image-fill).',
  ],
});
