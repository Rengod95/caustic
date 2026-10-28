import { defineRecipe } from '../schema.ts';

export default defineRecipe({
  id: 'theme-editor',
  title: 'Theme and token editor',
  intent: 'Pick a theme, inspect how tokens resolve, edit colours and bindings, and review and export the change.',
  regions: [
    {
      placement: 'start',
      purpose: 'The themes to start from, as selectable preview cards.',
      roles: ['choice.single'],
      suggested: ['side-panel', 'theme-gallery'],
    },
    {
      placement: 'stage',
      purpose: 'The token map: ramps as colour tiles, the alias graph and the chain of one selected token.',
      roles: ['display.token'],
      suggested: ['color-tile', 'token-graph', 'alias-chain', 'tabs'],
    },
    {
      placement: 'inspector',
      purpose: 'Edit the selected token: its colour, its binding or expression, and its contrast against its pairs.',
      roles: ['input.color', 'property.editor', 'property.panel', 'feedback.findings'],
      suggested: ['inspector-panel', 'color-well', 'color-picker', 'hex-input', 'inspector-bindings', 'expression-editor', 'contrast-insight'],
    },
    {
      placement: 'overlay',
      purpose: 'Review the token changes, then import or export the theme in a dialog.',
      roles: ['overlay.modal', 'display.change', 'action.primary'],
      suggested: ['dialog', 'token-diff', 'export-controls', 'import-panel', 'button'],
    },
  ],
  notes: [
    'Swatch colours are data, set through a CSS custom property; the chrome around them still uses tokens.',
    'ColorPicker is the popover a ColorWell opens; reach for the well first, not an inline picker.',
  ],
});
