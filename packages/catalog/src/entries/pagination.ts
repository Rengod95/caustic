import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'pagination',
  intent: 'Move between pages of a long result, with page numbers or a compact range and arrows.',
  roles: ['navigation.local'],
  alsoFits: ['collection.list'],
  placement: ['page', 'card', 'end'],
  keywords: ['pager', 'page numbers', 'next page', 'previous page', 'paging', 'results'],
  pairs: ['table', 'list', 'card'],
  consider: [
    { id: 'scroll-area', when: 'the result reads better as one continuous scroll' },
  ],
  guidance: [
    'The compact layout suits tables and lists where only forward and back matter.',
  ],
});
