import { defineRecipe } from '../schema.ts';

export default defineRecipe({
  id: 'workspace-settings',
  title: 'Workspace settings',
  intent: 'A settings page for a team: section navigation, forms, members, plan and billing, notifications and a danger zone.',
  regions: [
    {
      placement: 'page',
      purpose: 'Section navigation down the side, sticky on wide screens and on top on narrow ones.',
      roles: ['navigation.local'],
      suggested: ['list-navigation'],
    },
    {
      placement: 'form',
      purpose: 'Profile forms in titled sections: upload, labelled fields with hints and errors, and one save footer.',
      roles: ['layout.form', 'input.text', 'input.file'],
      suggested: ['form-layout', 'field', 'input', 'file-upload', 'alert'],
    },
    {
      placement: 'form',
      purpose: 'Invite people: a list of addresses, a role picker, the send action and the confirmation.',
      roles: ['input.text', 'input.pick', 'action.primary', 'feedback.transient'],
      suggested: ['section-header', 'field', 'tag-input', 'select', 'button', 'toast'],
    },
    {
      placement: 'page',
      purpose: 'Members and invoices as tables with identity, inline role pickers, status and row menus.',
      roles: ['collection.list', 'display.identity', 'display.status'],
      suggested: ['section-header', 'table', 'avatar', 'select', 'badge', 'menu', 'icon-button'],
    },
    {
      placement: 'card',
      purpose: 'The current plan and seat use, and read-only billing details that can be copied.',
      roles: ['layout.container', 'display.data', 'feedback.progress'],
      suggested: ['card', 'badge', 'progress', 'button', 'list-description'],
    },
    {
      placement: 'form',
      purpose: 'Notification preferences: switches with descriptions, checkbox and radio groups, a small option toggle.',
      roles: ['choice.toggle', 'choice.multi', 'choice.single', 'layout.form'],
      suggested: ['switch', 'checkbox', 'radio-group', 'toggle-group', 'field'],
    },
    {
      placement: 'overlay',
      purpose: 'A danger zone whose destructive action asks for typed confirmation in a dialog.',
      roles: ['overlay.modal', 'action.primary'],
      suggested: ['dialog', 'field', 'input', 'button'],
    },
  ],
  notes: [
    'Each section has a SectionHeader; sections are resting surfaces with a hairline, never a shadow.',
    'A switch applies at once; fields inside FormLayout save with its footer.',
    'Keep one accent action on the page (the upgrade); other actions are secondary or ghost.',
    'Destructive actions use the danger tone and confirm in a Dialog; nothing else needs a modal.',
  ],
  reference: 'apps/docs/src/showcase/samples/settings.tsx',
});
