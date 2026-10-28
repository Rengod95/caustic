import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'breadcrumb',
  intent: 'Show where the current page sits in a hierarchy, with links back up to its ancestors.',
  roles: ['navigation.local'],
  alsoFits: ['navigation.global'],
  placement: ['titlebar', 'page', 'toolbar', 'start'],
  keywords: ['breadcrumbs', 'path', 'trail', 'location', 'crumbs', 'hierarchy'],
  pairs: ['tabs', 'section-header', 'app-shell', 'icon-button'],
  consider: [
    { id: 'tabs', when: 'the user moves between siblings rather than up the hierarchy' },
    { id: 'list-navigation', when: 'a side column lists the places to go' },
  ],
  guidance: [
    'Compose the trail from items, an ellipsis and the current page; the separators are added for you.',
    'Collapse a long middle path into the ellipsis control rather than truncating labels.',
  ],
});
