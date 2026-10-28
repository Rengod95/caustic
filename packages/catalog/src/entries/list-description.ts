import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'list-description',
  intent: 'Show facts about one object as label and value pairs, with an optional copy button.',
  roles: ['display.data'],
  alsoFits: ['property.panel'],
  placement: ['card', 'end', 'inspector', 'page'],
  keywords: ['key value', 'description list', 'definition list', 'metadata', 'details', 'properties'],
  pairs: ['badge', 'card', 'section-header'],
  consider: [
    { id: 'table', when: 'there are many facts or several objects to compare' },
    { id: 'form-layout', when: 'people should edit the values' },
  ],
  guidance: [
    'Use mono for IDs and other machine values; copyValue adds the copy button on hover.',
  ],
});
