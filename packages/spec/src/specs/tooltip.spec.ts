import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'tooltip',
  name: 'Tooltip',
  category: 'overlay',
  status: 'ready',
  purpose: 'Names an icon-only control and shows its shortcut on hover or keyboard focus. Ink bubble with a small arrow; never interactive.',
  description: 'Wraps its trigger (asChild). Short text only, optionally followed by one Kbd chord.',
  role: 'tooltip',
  slots: [
    { name: 'root', el: 'div', role: 'tooltip', description: 'The bubble (Radix Content, portaled). Solid ink fill with elevation 3.' },
    { name: 'trigger', el: 'any', required: false, description: 'The element that owns the tooltip (the child). Receives data-slot="tooltip-trigger" and aria-describedby while open.' },
    { name: 'shortcut', el: 'kbd', parent: 'root', required: false, description: 'A Kbd chord after the text, recolored for the ink bubble.' },
    { name: 'arrow', el: 'span', parent: 'root', description: '8px square rotated 45deg, same fill as the bubble, pointing at the trigger.' },
  ],
  states: {
    open: { props: { open: true } },
    closed: { props: { open: false } },
  },
  props: {
    content: { type: 'ReactNode', required: true, description: 'The text.' },
    shortcut: { type: 'string', description: 'Chord shown in a Kbd after the text, e.g. ⌘Z.' },
    side: { type: "'top' | 'right' | 'bottom' | 'left'", default: 'top', description: 'Preferred side; flips on collision.' },
    align: { type: "'start' | 'center' | 'end'", default: 'center', description: 'Alignment against the trigger.' },
    sideOffset: { type: 'number', default: 10, description: 'Distance between trigger and bubble in px (includes the 4px arrow).' },
    delayDuration: { type: 'number', default: 400, description: 'Hover delay in ms before opening.' },
    open: { type: 'boolean', description: 'Controlled open state.' },
    defaultOpen: { type: 'boolean', default: false, description: 'Uncontrolled initial open state.' },
    children: { type: 'ReactElement', required: true, description: 'The trigger element.' },
  },
  events: { onOpenChange: { payload: 'boolean', when: 'the bubble opens or closes' } },
  styles: [
    { slot: 'root', when: { state: 'open' }, expect: { bg: 'ink.solid', fg: 'ink.on', radius: 'md', minHeight: 'control-sm', padX: 8, padY: 5, gap: 8, text: 'ui-sm', shadow: '3' }, note: 'Floating surface: solid ink fill + one elevation (3), no blur.' },
    { slot: 'shortcut', when: { state: 'open', shortcut: '⌘Z' }, expect: { bg: 'ink.kbd', fg: 'ink.on-muted' }, note: 'Kbd inside the bubble: ink.kbd fill, ink.on-muted text, no edge or inset shadow.' },
    { slot: 'arrow', when: { state: 'open' }, expect: { bg: 'ink.solid' } },
  ],
  behavior: {
    keyboard: { Escape: 'close', Tab: 'focus shows the tooltip; leaving focus hides it' },
    pointer: ['hover opens after delayDuration; leaving the trigger or the bubble closes it', 'the bubble is not interactive but stays open while the pointer is over it'],
    scenarios: [
      { name: 'hover opens', props: { delayDuration: 0 }, steps: [{ do: 'hover', slot: 'trigger' }], expect: [{ visible: 'root' }, { event: 'onOpenChange', args: [true] }] },
      { name: 'focus opens', props: { delayDuration: 0 }, steps: [{ do: 'focus', slot: 'trigger' }], expect: [{ visible: 'root' }] },
      { name: 'Escape closes', props: { delayDuration: 0, defaultOpen: true }, steps: [{ do: 'focus', slot: 'trigger' }, { do: 'press', key: 'Escape' }], expect: [{ hidden: 'root' }] },
    ],
  },
  a11y: {
    notes: ['The trigger keeps its own accessible name; the tooltip only supplements it (aria-describedby).', 'Text must not be the only place information appears; no links or buttons inside.'],
  },
  policies: ['P1', 'P6', 'P8'],
  flags: { floating: true },
  composition: { uses: ['kbd'], radix: ['@radix-ui/react-tooltip'] },
  usage: [
    'One short line. Add a shortcut with the shortcut prop, not by hand-built Kbds.',
    'Do not use a tooltip for essential instructions or for touch-only controls.',
    'In the specimen the bubble is centered over a whole toolbar group; wrap the group in the Tooltip to reproduce that.',
  ],
});
