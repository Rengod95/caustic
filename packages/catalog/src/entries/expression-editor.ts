import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'expression-editor',
  intent: 'Edit a token value built from references to other tokens, one binding row per reference, with a raw expression fallback.',
  roles: ['property.editor', 'input.text'],
  alsoFits: ['display.code'],
  placement: ['inspector', 'end', 'form'],
  keywords: ['token alias', 'token reference', 'binding', 'formula', 'computed value', 'json expression'],
  pairs: ['alias-chain', 'token-graph', 'inspector-bindings'],
  consider: [
    { id: 'inspector-bindings', when: 'binding the properties of a layer to tokens rather than composing a token value' },
  ],
  guidance: [
    'Parsing and validation are yours; pass the error text back and it shows under the raw field.',
    'Choosing a new source clears its property; recompute the property options for that source.',
  ],
});
