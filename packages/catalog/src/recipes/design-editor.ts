import { defineRecipe } from '../schema.ts';

export default defineRecipe({
  id: 'design-editor',
  title: 'Design editor',
  intent: 'A canvas design tool: titlebar, pages and layers, the canvas with its marks and floating tools, and an inspector.',
  regions: [
    {
      placement: 'titlebar',
      purpose: 'File name and sync state, undo and redo, the editor mode switch, collaborators and Share.',
      roles: ['navigation.global', 'choice.single', 'display.identity', 'action.primary', 'overlay.hint'],
      suggested: ['app-shell', 'badge', 'tooltip', 'icon-button', 'segmented-control', 'avatar', 'button'],
    },
    {
      placement: 'start',
      purpose: 'Pages and the layer tree, with a filter field, in a tabbed side panel.',
      roles: ['navigation.local', 'collection.tree', 'input.text'],
      suggested: ['side-panel', 'tabs', 'list-navigation', 'input', 'layer-tree', 'section-header'],
    },
    {
      placement: 'canvas',
      purpose: 'Rulers, frames and their labels, the selection, guides, comments and the agent cursor.',
      roles: ['canvas.surface', 'canvas.annotation', 'agent.presence'],
      suggested: ['canvas-ruler', 'canvas-artboard', 'frame-label', 'canvas-selection', 'canvas-guide', 'canvas-comment', 'agent-cursor', 'agent-work-area'],
    },
    {
      placement: 'overlay',
      purpose: 'Floating tools over the canvas: the tool bar, selection actions, key hints and zoom.',
      roles: ['canvas.control', 'action.group'],
      suggested: ['floating-bar', 'button', 'canvas-hint', 'zoom-control'],
    },
    {
      placement: 'inspector',
      purpose: 'Properties of the selection in sections: frame, auto layout, fill, radius, effects, layer and export.',
      roles: ['property.panel', 'property.editor', 'action.group'],
      suggested: ['side-panel', 'inspector-panel', 'button-group', 'position-size', 'auto-layout', 'property-stack', 'corner-radius', 'slider', 'number-field'],
    },
  ],
  notes: [
    'AppShell owns the frame: put content in its Titlebar, Start, Stage, End and Overlay parts, not in your own grid.',
    'Canvas marks take canvas coordinates through rect; floating bars and hints go in AppShellOverlay.',
    'The human selection is accent with square handles; agent work is the spectrum rim plus the agent cursor.',
    'One accent action in the titlebar (Share); the rest of the chrome stays neutral.',
  ],
  reference: 'apps/docs/src/showcase/samples/editor.tsx',
});
