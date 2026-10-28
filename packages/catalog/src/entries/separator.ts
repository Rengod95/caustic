import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'separator',
  intent: 'A thin rule that divides rows, toolbar groups or inline items, optionally with a centred label.',
  roles: ['layout.structure'],
  placement: ['inline', 'toolbar', 'card', 'form', 'page'],
  keywords: ['divider', 'rule', 'hr', 'hairline', 'line', 'spacer'],
  pairs: ['foundation-toolbar', 'button-group', 'menu', 'card'],
  consider: [
    { id: 'resize-handle', when: 'people should drag the line to resize the panels on each side' },
  ],
  guidance: [
    'Use a rule to divide, not to decorate; spacing is often enough when grouping is clear.',
    'A vertical rule takes its height from the row it sits in.',
  ],
});
