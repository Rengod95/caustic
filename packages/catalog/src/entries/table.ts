import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'table',
  intent: 'A data table with sortable columns, row selection, row actions, a toolbar and a pager.',
  roles: ['display.data', 'collection.list'],
  placement: ['page', 'stage'],
  keywords: ['data grid', 'datatable', 'grid', 'spreadsheet', 'rows and columns', 'records'],
  pairs: ['input', 'button', 'badge', 'avatar', 'section-header', 'empty-state'],
  consider: [
    { id: 'list', when: 'the items read better as rows without columns' },
    { id: 'list-description', when: 'the facts all describe one object' },
  ],
  guidance: [
    'Numeric columns align to the end with tabular numerals.',
  ],
});
