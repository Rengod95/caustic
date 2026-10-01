import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'canvas-empty',
  name: 'CanvasEmpty',
  category: 'canvas',
  status: 'ready',
  purpose: 'The first question on a blank canvas: the agent orb, a serif prompt ("What are we designing today?"), one line of help and two ways to start (ask the agent, browse themes).',
  description: 'Sits centered on the canvas dot grid, no border or fill of its own. The prompt is in the agent voice (serif); the actions are an agent Button and a secondary Button.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Centered grid on the canvas background with the dot grid, 28px block and 16px inline padding, 10px gap, text centered.' },
    { name: 'orb', el: 'span', parent: 'root', description: 'Large agent orb (28px).' },
    { name: 'title', el: 'div', parent: 'root', description: 'The prompt, in the voice (serif) type.' },
    { name: 'description', el: 'div', parent: 'root', required: false, description: 'One line of help, tertiary, max 34ch.' },
    { name: 'actions', el: 'div', parent: 'root', required: false, description: 'Two Buttons, centered, wrapping, 8px gap.' },
  ],
  props: {
    title: { type: 'ReactNode', required: true, description: 'The prompt.' },
    description: { type: 'ReactNode', description: 'One line of help.' },
    actions: { type: 'ReactNode', description: 'Buttons (Button tone="agent" size="sm" first, then secondary).' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'bg.canvas', radius: 'xl', padX: 16, padY: 28, gap: 10 }, note: 'Background is the cs-canvas-grid dot pattern (canvas.dot dots on bg.canvas).' },
    { slot: 'orb', expect: { height: 28, width: 28, radius: 'full' } },
    { slot: 'title', expect: { font: 'voice', text: 'voice-lg', fg: 'text.primary' }, note: 'Specimen: voice 19px / 26px, regular. Token request voice-lg.' },
    { slot: 'description', expect: { fg: 'text.tertiary', text: 'ui-sm', weight: 400 }, note: 'max-width 34ch.' },
    { slot: 'actions', expect: { gap: 8 } },
  ],
  a11y: { notes: ['The orb is decorative (aria-hidden); the prompt is text.', 'The agent Button is the primary path; the second action is secondary, so there is no accent button here.'] },
  policies: ['P2', 'P3', 'P4', 'P6', 'P8'],
  flags: { agent: true, motionLoop: true },
  composition: { uses: ['button'] },
  examples: [{ id: 'empty-canvas', title: 'Empty canvas', doc: 'empty-canvas#empty-canvas' }],
  usage: [
    'Fixture convention: render(props) renders the prompt, the help line and the two actions below.',
    'Example empty-canvas: title “What are we designing today?”, description “Describe a screen, paste a reference, or pick a theme to start from.”, actions Button tone="agent" size="sm" (wand-sparkles) “Describe a screen” and Button tone="secondary" size="sm" (swatch-book) “Browse themes”. The stage is centered with min-height from its content (padding 28 / 16).',
    'P4: the prompt is agent prose, so voice type is allowed; the help text and buttons are the interface voice.',
    'Token requests: voice-lg (voice 19 / 26 / 400).',
    'Near-duplicate: title-feature is ui 19 / 24 / 600; no sans role matches because the specimen is serif.',
  ],
});
