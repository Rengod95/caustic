import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'dialog',
  intent: 'Ask for a decision, a short input or a form on top of the page, or hold a secondary task at an edge.',
  roles: ['overlay.modal'],
  alsoFits: ['agent.request'],
  placement: ['overlay'],
  keywords: ['modal', 'confirm', 'alert dialog', 'prompt', 'popup', 'lightbox'],
  pairs: ['button', 'field', 'input', 'tag-input', 'token-diff'],
  consider: [
    { id: 'sheet', when: 'the task belongs at the right or bottom edge with the page still in view' },
    { id: 'popover', when: 'a few compact controls belong next to the element that opened them' },
    { id: 'alert', when: 'the message needs no decision and can stay on the page' },
  ],
  guidance: [
    'A destructive confirm (kind="alert") says in its description how to undo.',
    'The compact form fits a two-line decision; pass title for a form with a header, body and several actions.',
  ],
});
