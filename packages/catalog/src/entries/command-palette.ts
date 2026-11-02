import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'command-palette',
  intent: 'Let the person run any command or jump anywhere by typing, from a global shortcut, with commands in groups and their shortcuts shown.',
  roles: ['overlay.modal'],
  alsoFits: ['input.pick', 'navigation.global'],
  placement: ['overlay', 'page'],
  keywords: ['command menu', 'command k', 'quick open', 'spotlight', 'action search', 'palette'],
  pairs: ['kbd', 'app-shell', 'dialog', 'combobox'],
  consider: [
    { id: 'combobox', when: 'the person picks one value for a field rather than running a command' },
    { id: 'menu', when: 'the commands are few and belong to one trigger or one object' },
  ],
  guidance: [
    'Pass shortcut="mod+k" to bind the global key; the shortcut on each command is only displayed, bind its key yourself.',
    'Group commands under short headings; the search filters across groups.',
  ],
});
