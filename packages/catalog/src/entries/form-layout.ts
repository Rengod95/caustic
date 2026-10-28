import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'form-layout',
  intent: 'Lay out a settings page: a header, titled sections with fields beside them and a save footer.',
  roles: ['layout.form', 'layout.structure'],
  alsoFits: ['property.panel'],
  placement: ['page', 'form'],
  keywords: ['settings page', 'preferences', 'form sections', 'two-column form', 'account settings'],
  pairs: ['field', 'input', 'switch', 'section-header', 'segmented-control', 'button'],
  consider: [
    { id: 'dialog', when: 'the form is short and part of one focused decision' },
    { id: 'inspector-panel', when: 'the fields edit a selected object beside a canvas' },
  ],
  guidance: [
    'Put Discard and Save changes at the bottom right; Save is the single primary action.',
    'Headings sit to the left of their fields and stack above them on narrow screens.',
  ],
});
