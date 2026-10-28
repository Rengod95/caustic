import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'button-group',
  intent: 'Keep a row of related plain actions together on a small inset track, like the align bar of an inspector.',
  roles: ['action.group'],
  alsoFits: ['property.editor', 'canvas.control'],
  placement: ['inspector', 'toolbar', 'card', 'overlay'],
  keywords: ['align bar', 'alignment buttons', 'attached buttons', 'button bar', 'action group', 'distribute'],
  pairs: ['icon-button', 'button', 'section-header', 'tooltip'],
  consider: [
    { id: 'toggle-group', when: 'items stay pressed to show a state' },
    { id: 'segmented-control', when: 'the row picks one mode among several' },
    { id: 'floating-bar', when: 'it is a full toolbar of tools with shortcuts over the canvas' },
  ],
  guidance: [
    'Nothing stays pressed: each item fires its own action.',
    'Only direct Button and IconButton children take the group size; a wrapped item keeps its own.',
  ],
});
