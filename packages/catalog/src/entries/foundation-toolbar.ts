import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'foundation-toolbar',
  intent: 'The dock of a token workspace: switch families of views, pick a domain and reach add and host actions.',
  roles: ['navigation.local', 'action.group'],
  alsoFits: ['canvas.control', 'navigation.global'],
  placement: ['stage', 'toolbar', 'overlay'],
  keywords: ['dock', 'token toolbar', 'domain switcher', 'workspace bar', 'category bar', 'tool dock'],
  pairs: ['segmented-control', 'combobox', 'icon-button', 'button', 'floating-bar'],
  consider: [
    { id: 'floating-bar', when: 'it is a general toolbar of canvas tools' },
    { id: 'tabs', when: 'a plain row of views swaps a panel underneath' },
  ],
  guidance: [
    'It knows no domains: pass the families and domains and apply the choices it reports.',
    'Pass no domains to hide the domain row, for example while a family has none.',
  ],
});
