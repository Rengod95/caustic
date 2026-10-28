import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'composer',
  intent: 'The box where a person writes to the agent, with context chips, attach, model, context usage and send or stop.',
  roles: ['agent.conversation', 'input.text'],
  alsoFits: ['action.primary'],
  placement: ['end', 'transcript', 'overlay', 'stage'],
  keywords: ['prompt box', 'chat input', 'ask bar', 'message input', 'prompt field', 'omnibox', 'chat box'],
  pairs: ['suggestions', 'message', 'menu', 'popover', 'context-analytics', 'chip'],
  consider: [
    { id: 'textarea', when: 'the text is a plain multi-line form field with no agent around it' },
    { id: 'input', when: 'a single-line question or search is enough' },
  ],
  guidance: [
    'The model trigger and the usage ring only display; wrap them with your own Menu or Popover.',
    'A controlled composer is not cleared on submit; clear the value yourself in onSubmit.',
  ],
});
