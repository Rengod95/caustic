import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'popover',
  intent: 'A small panel anchored to an element: compact controls on press, or a read-only preview on hover.',
  roles: ['overlay.anchored'],
  alsoFits: ['property.editor', 'display.identity'],
  placement: ['overlay', 'toolbar', 'inspector'],
  keywords: ['hover card', 'flyout', 'popup', 'callout', 'dropdown panel', 'peek'],
  pairs: ['button', 'icon-button', 'number-field', 'color-picker', 'avatar'],
  consider: [
    { id: 'dialog', when: 'the panel asks for a blocking decision' },
    { id: 'menu', when: 'the panel is a list of actions' },
    { id: 'tooltip', when: 'it only names an icon control or shows its shortcut' },
  ],
  guidance: [
    'Width comes from size, not content; lay out the inner grid or rows yourself.',
    'trigger="hover" suits read-only previews such as a person card; controls belong behind a press.',
  ],
});
