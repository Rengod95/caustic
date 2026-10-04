import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'toast',
  name: 'Toast',
  category: 'overlay',
  status: 'ready',
  purpose: 'Transient confirmation that floats at the bottom end of the screen: translucent glass, at least 60px high, 22px (toast) radius, a status mark, a title with one line of detail and an optional action. Springs in, auto-dismisses.',
  description: 'Toast is the item; Toaster is the fixed region that stacks items (bottom end, 16px inset, 8px gap, width min(360px, 100% - 32px)) and an imperative toast() helper feeds it. Set `inline` to render an item in place, without the region, for docs and tests.',
  role: 'status',
  slots: [
    { name: 'viewport', el: 'div', required: false, description: 'Toaster region: position fixed, bottom-end, grid with 8px gap, z toast; role="region", aria-live="polite" and aria-label from the label prop (ToastViewport / Toaster part). Not rendered in inline mode.' },
    { name: 'root', el: 'div', description: 'The glass item (role="status").' },
    { name: 'icon', el: 'span', parent: 'root', required: false, description: 'Success mark: 28px circle filled success.solid with a check glyph. Present when tone="success".' },
    { name: 'orb', el: 'span', parent: 'root', required: false, description: 'Agent mark: 14px spectrum orb. Present when tone="agent".' },
    { name: 'main', el: 'div', parent: 'root', description: 'Title and detail stack; takes the free width.' },
    { name: 'title', el: 'div', parent: 'main', description: 'Weight 500.' },
    { name: 'description', el: 'div', parent: 'main', required: false, description: 'One line of detail, tertiary.' },
    { name: 'action', el: 'any', parent: 'root', required: false, description: 'A Button xs: ghost for success, ink for agent.' },
  ],
  variants: {
    tone: { values: ['success', 'agent'], default: 'success', description: 'success = something finished; agent = something the agent made or did (spectrum rim and orb).' },
  },
  props: {
    tone: { type: "'success' | 'agent'", default: 'success', description: 'Status mark and rim.' },
    title: { type: 'ReactNode', required: true, description: 'What happened.' },
    description: { type: 'ReactNode', description: 'One line of detail.' },
    actionLabel: { type: 'string', description: 'Label of the action button; omit for none.' },
    duration: { type: 'number', default: 3600, description: 'Milliseconds before auto-dismiss; 0 keeps it until dismissed. Paused while hovered or focused.' },
    inline: { type: 'boolean', default: false, description: 'Render in place (no Toaster, no fixed positioning, no auto-dismiss).' },
    label: { type: 'string', required: true, description: 'ToastViewport / Toaster prop: aria-label of the region (e.g. "Notifications"). No built-in default.' },
  },
  events: {
    onAction: { payload: 'void', when: 'the action button is activated' },
    onDismiss: { payload: 'void', when: 'the duration elapses, Escape is pressed on a focused toast, or the item is swiped away' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'material.regular', radius: 'toast', minHeight: 60, padX: 14, padY: 10, gap: 12, shadow: '4', text: 'ui' }, note: 'Fill is material.regular but the blur is the thick one (blur-thick): the specimen mixes them, so the full `material` check cannot be used. Padding-inline-end is 12px (xs button). The glass rim, specular and edge come from the glass utility.' },
    { slot: 'root', when: { tone: 'agent' }, expect: { agentRim: true } },
    { slot: 'icon', expect: { bg: 'success.solid', fg: 'accent.on', radius: 'full', height: 'control-sm', width: 'control-sm' }, note: 'Glyph is 15px with a 2.5 stroke; icon-md (16) is used, within 1px.' },
    { slot: 'orb', when: { tone: 'agent' }, expect: { height: 'icon-sm', width: 'icon-sm' }, note: 'Shape comes from the orb utility.' },
    { slot: 'title', expect: { text: 'ui-strong', fg: 'text.primary' } },
    { slot: 'description', expect: { text: 'ui-sm', weight: 400, fg: 'text.tertiary' } },
    { slot: 'viewport', expect: { gap: 8 }, note: 'Motion: items enter with the spring easing over the slow duration (translate and fade); exit is a 300ms fade and 8px drop. Reduced motion: fade only.' },
  ],
  behavior: {
    keyboard: { Escape: 'dismiss a focused toast', Tab: 'reaches the action button in DOM order' },
    pointer: ['hover or focus pauses the auto-dismiss timer', 'clicking the action calls onAction'],
    scenarios: [
      { name: 'action fires', props: { actionLabel: 'Open', duration: 0 }, steps: [{ do: 'click', slot: 'action' }], expect: [{ event: 'onAction', calls: 1 }] },
      { name: 'Escape dismisses', props: { duration: 0 }, steps: [{ do: 'focus', slot: 'root' }, { do: 'press', key: 'Escape' }], expect: [{ event: 'onDismiss', calls: 1 }] },
    ],
  },
  a11y: {
    attrs: { root: ['role'], viewport: ['aria-live', 'aria-label'] },
    notes: [
      'The Toaster region is a polite live region named by its label prop (examples: "Notifications"); each toast is role="status". Never move focus to a toast.',
      'Auto-dismiss pauses on hover and focus-within; a toast with an action should use a longer duration or 0.',
      'Text is text.primary and text.tertiary over regular glass; contrast is checked against the glass fill.',
      'Under prefers-reduced-transparency the glass falls back to an opaque surface (provided by the glass utility).',
    ],
  },
  policies: ['P1', 'P2', 'P5', 'P6', 'P8'],
  flags: { floating: true, agent: { tone: ['agent'] } },
  composition: { uses: ['button'], radix: [] },
  examples: [{ id: 'toasts', title: 'Toasts', doc: 'toast#toasts' }],
  usage: [
    'No Radix: the Toaster is a small custom region (store + useSyncExternalStore) because the design needs inline rendering and no swipe or hotkey chrome. Export Toast, Toaster and toast({ tone, title, description, actionLabel, onAction, duration }).',
    'Example fixture, items in inline mode stacked with a 14px gap: success toast (check, "Published v2.4", "orbit-pay.caustic.app", Button ghost xs "Open"); agent toast (orb, "Dark variant ready", "14 tokens derived · 0 contrast issues", Button ink xs "Review"); then Button secondary sm with a bell icon "Show a toast", stretched to the full container width (it is a grid child in the specimen), that calls toast() (the fixture may render an inert button; nothing in the baseline depends on a toast being open).',
    'Each toast is full width of its container in inline mode (flex, min-width 0).',
    '`uses: button` — the action is a Button xs; success uses tone ghost, agent uses tone ink. Only one accent or ink fill per view still applies (P3): ink on the agent toast is the single one in the example.',
  ],
});
