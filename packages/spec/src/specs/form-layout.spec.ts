import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'form-layout',
  name: 'FormLayout',
  category: 'structure',
  status: 'ready',
  purpose: 'Lays out a settings form: an optional page header, titled sections (heading on the left, fields on the right) and a save footer.',
  description: 'Pure layout. It supplies the grid, dividers and spacing; headings come from SectionHeader and every control from its own component. Sections collapse to one column on narrow containers.',
  role: null,
  slots: [
    { name: 'root', el: 'form', description: 'The form element. Vertical grid, 20px gap, full width.' },
    { name: 'header', el: 'div', parent: 'root', required: false, description: 'Page header: a SectionHeader (divided) built from title and description.' },
    { name: 'section', el: 'div', parent: 'root', description: 'Two columns (heading max 220px, fields fill), 24px gap, 20px top padding and a subtle top divider. The first child of the form has neither. One column and 12px gap at 640px or narrower. Repeats.' },
    { name: 'section-heading', el: 'div', parent: 'section', description: 'Left column: a small SectionHeader with the section title and description.' },
    { name: 'section-body', el: 'div', parent: 'section', description: 'Right column: fields stacked with 12px gap.' },
    { name: 'footer', el: 'div', parent: 'root', required: false, description: 'Action row, right-aligned, 8px gap, 4px top padding: Discard and Save changes.' },
  ],
  props: {
    title: { type: 'ReactNode', description: 'Page header title. The header renders when title is set.' },
    description: { type: 'ReactNode', description: 'Page header description.' },
    children: { type: 'ReactNode', description: 'FormLayout.Section blocks (props: title, description, children) and an optional FormLayout.Footer.' },
    onSubmit: { type: 'React.FormEventHandler<HTMLFormElement>', description: 'Native submit; the footer Save button is type submit.' },
  },
  styles: [
    { slot: 'root', expect: { gap: 20 } },
    { slot: 'section', expect: { gap: 24, border: 'border.subtle' } },
    { slot: 'section-body', expect: { gap: 12 } },
    { slot: 'footer', expect: { gap: 8 } },
  ],
  behavior: {
    keyboard: { Enter: 'in a text field submits the form (native)' },
    pointer: ['Discard is type button and never submits; Save changes is type submit'],
    scenarios: [],
  },
  a11y: {
    labelRequired: false,
    notes: [
      'Each section groups its fields: give section-body role group and aria-labelledby pointing at the section heading title.',
      'Source order is header, sections, footer; the two-column layout is visual only.',
    ],
  },
  policies: ['P3', 'P6'],
  composition: { uses: ['section-header', 'field', 'input', 'switch', 'segmented-control', 'button'] },
  examples: [{ id: 'form-layout', title: 'Form layout · settings page', doc: 'form-layout#form-layout' }],
  usage: [
    'Heading in the left column, fields in the right; below 640px they stack.',
    'A form that needs saving puts Discard and Save changes at the bottom right; Save is the single primary action.',
  ],
});
