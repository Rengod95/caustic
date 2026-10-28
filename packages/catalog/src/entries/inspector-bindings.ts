import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'inspector-bindings',
  intent: 'Show and edit which design tokens the selected properties are bound to, with unbind, a mixed state and a bind row.',
  roles: ['property.editor', 'collection.list'],
  alsoFits: ['display.data'],
  placement: ['inspector', 'end'],
  keywords: ['token binding', 'variables', 'design tokens', 'linked styles', 'detach', 'styles'],
  pairs: ['alias-chain', 'badge', 'expression-editor', 'inspector-panel'],
  consider: [
    { id: 'badge', when: 'a read-only token chip in a list or alias chain is enough' },
    { id: 'expression-editor', when: 'composing a token value from other tokens' },
  ],
  guidance: [
    'Opening the token picker is yours: the selector reports a pick, or pass options for a combobox per property.',
  ],
});
