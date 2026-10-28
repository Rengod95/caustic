import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'list',
  intent: 'Rows in a rounded container for settings, people, media or collections, with selection, reorder and row actions.',
  roles: ['collection.list'],
  alsoFits: ['choice.single', 'choice.multi', 'property.panel', 'navigation.local'],
  placement: ['page', 'end', 'start', 'inspector', 'form'],
  keywords: ['grouped list', 'inset list', 'table view', 'rows', 'settings list', 'reorderable'],
  pairs: ['section-header', 'switch', 'avatar', 'badge', 'icon-button', 'button'],
  consider: [
    { id: 'list-navigation', when: 'the rows move between pages in a sidebar' },
    { id: 'table', when: 'the items have several columns to compare or sort' },
    { id: 'select', when: 'a long choice set should stay closed until opened' },
    { id: 'menu', when: 'the list floats over the page as actions' },
  ],
  guidance: [
    'grouped reads as a settings form; opaque is the inspector collection that ends with an add row.',
    'It is an inline surface; floating lists belong to Menu and Select.',
  ],
});
