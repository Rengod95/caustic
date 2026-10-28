import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'tooltip',
  intent: 'Name an icon-only control and show its keyboard shortcut on hover or focus.',
  roles: ['overlay.hint'],
  placement: ['overlay', 'toolbar', 'inline', 'titlebar'],
  keywords: ['hint', 'hover text', 'info tip', 'title text', 'label tip'],
  pairs: ['icon-button', 'kbd', 'foundation-toolbar', 'button-group'],
  consider: [
    { id: 'popover', when: 'the content is longer or holds links or controls' },
    { id: 'canvas-hint', when: 'the hint points at something on the design canvas' },
  ],
  guidance: [
    'Pass the shortcut prop instead of building Kbds by hand.',
    'The trigger keeps its own aria-label; the tooltip only adds to it.',
    'Keep essential instructions out of it; touch users never see a tooltip.',
  ],
});
