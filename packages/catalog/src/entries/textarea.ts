import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'textarea',
  intent: 'Enter free text longer than one line, optionally with a footer of actions and a submit button.',
  roles: ['input.text'],
  alsoFits: ['agent.conversation'],
  placement: ['form', 'overlay', 'end', 'card'],
  keywords: ['multiline', 'text area', 'comment box', 'message box', 'notes', 'description field', 'reply box'],
  pairs: ['field', 'button', 'icon-button'],
  consider: [
    { id: 'input', when: 'the value fits on one line' },
    { id: 'composer', when: 'it is the prompt box of an agent conversation with attachments and a model' },
  ],
  guidance: [
    'Put the character count in the Field so it sits in the label row.',
    'Add the footer for compose-style fields (attach, mention, send); plain form fields read better without it.',
  ],
});
