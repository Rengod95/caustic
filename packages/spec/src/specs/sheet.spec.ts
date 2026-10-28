import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'sheet',
  name: 'Sheet',
  category: 'overlay',
  status: 'ready',
  purpose: 'A named preset over Dialog for panels at an edge: settings, filters and short sharing flows that keep the page visible behind a scrim. side="right" is the desktop drawer; side="bottom" is the mobile sheet with a grabber.',
  description: 'Sheet renders <Dialog placement={side} showClose closeLabel="Close" … /> and carries data-slot="sheet" on the surface. It has no surface, overlay or band implementation of its own: the edge placement, the header, body and footer bands, the grabber, dividers, the title steps and the common props are specified by Dialog (placement right / bottom rows).',
  role: 'dialog',
  slots: [
    { name: 'root', el: 'div', role: 'dialog', description: 'The Dialog surface at placement side, re-tagged data-slot="sheet". Its parts keep the dialog-* slot names (dialog-header, dialog-title, dialog-body, dialog-footer, dialog-close, dialog-grabber, dialog-overlay).' },
  ],
  props: {
    side: { type: "'right' | 'bottom'", default: 'right', description: 'Edge the sheet is attached to: Dialog placement right, or bottom with the grabber.' },
    tone: { type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'agent'", default: 'neutral', description: 'Common prop, passed to Dialog.' },
    variant: { type: "'solid' | 'soft' | 'outline' | 'ghost'", default: 'solid', description: 'Common prop, passed to Dialog.' },
    radius: { type: "'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full' | 'panel'", description: 'Common prop, passed to Dialog. Unset keeps the side radius (right: panel; bottom: 28px top, panel bottom).' },
    shadow: { type: "'none' | '1' | '2' | '3' | '4' | '5'", description: 'Common prop, passed to Dialog. Unset = 5 (ghost: none).' },
    size: { type: "'xs' | 'sm' | 'md' | 'lg'", default: 'md', description: 'Common prop, passed to Dialog: steps the band padding, the body gap and the title.' },
    open: { type: 'boolean', description: 'Controlled open state.' },
    defaultOpen: { type: 'boolean', description: 'Uncontrolled initial state. Inline defaults to open.' },
    trigger: { type: 'ReactNode', description: 'Element that opens the sheet (rendered with asChild).' },
    title: { type: 'ReactNode', required: true, description: 'Header title.' },
    description: { type: 'ReactNode', description: 'Header supporting text.' },
    dividers: { type: 'boolean', default: false, description: 'Hairlines under the header and above the footer (off by default, owner 2026-10-28).' },
    showClose: { type: 'boolean', default: true, description: 'Close IconButton at the end of the header.' },
    closeLabel: { type: 'string', default: 'Close', description: 'aria-label of the close button.' },
    footer: { type: 'ReactNode', description: 'Footer content, usually buttons.' },
    children: { type: 'ReactNode', description: 'Body content.' },
    inline: { type: 'boolean', default: false, description: 'Render the surface open, in place, without portal or overlay, positioned absolutely inside the nearest positioned ancestor (right: 56% of it wide). For docs and specimens.' },
  },
  events: { onOpenChange: { payload: 'boolean', when: 'Escape, the close control, the overlay or a footer action closes it' } },
  styles: [
    { slot: 'root', expect: { material: 'thick', radius: 'panel', shadow: '5' } },
    { slot: 'root', when: { side: 'bottom' }, expect: { radius: '4xl' }, note: 'Dialog placement bottom: 28px top corners. The radius probe checks the top-left corner.' },
  ],
  behavior: {
    keyboard: { Escape: 'close', Tab: 'cycles inside while open (focus is trapped)' },
    pointer: ['pressing the overlay closes it', 'slides in from its edge (Dialog placement motion)'],
    scenarios: [
      { name: 'Escape closes', props: { inline: true, defaultOpen: true, title: 'Filters' }, steps: [{ do: 'focus', slot: 'root' }, { do: 'press', key: 'Escape' }], expect: [{ event: 'onOpenChange', args: [false] }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { root: ['aria-labelledby'] },
    notes: ['Title is always rendered. The grabber is decorative; it is not a drag handle in this version.', 'Focus returns to the trigger on close.'],
  },
  policies: ['P1', 'P5', 'P6'],
  flags: { floating: true },
  composition: { uses: ['dialog', 'button', 'checkbox', 'switch', 'input'], radix: [] },
  examples: [
    { id: 'side', title: 'Sheet side', doc: 'sheet#sheet-side' },
    { id: 'bottom', title: 'Sheet bottom', doc: 'sheet#sheet-bottom' },
  ],
  usage: [
    'Example "side": a canvas stage (full width, 300px tall, xl radius, canvas dot grid on bg.canvas, scrim over it, overflow hidden) holding an inline right Sheet “Filters”. Body: three rows (flex, 10px gap, min-height 28px): a Checkbox, a flex-1 label and a tabular count in text.tertiary at 11.5px: Components 42 (checked), Frames 18 (unchecked), Edited by agent 9 (checked). Footer: a ghost sm “Reset” and an ink sm “Show 51”. Below the stage, a row of two secondary sm Buttons: “Open side sheet” (panel-right icon) and “Open bottom sheet” (panel-bottom icon). The triggers need no behavior in the fixture.',
    'Example "bottom": a stage 280px tall, max-width 360, centred in the page column (same canvas dots and scrim), holding an inline bottom Sheet (no dividers, the default) with no footer and a title-2 title, title “Share “Pricing refresh””. Body: an Input with addons (prefix “caustic.app/”, input value “orbit/pricing”, a trailing “Copy” button with a copy icon) and a row with the label “Anyone with the link can view” and an sm Switch “Public link” (off).',
    'Fixture convention: render(props) renders an inline sheet inside a relatively positioned 300px frame, with a title, a one-line body and a footer.',
    'Sheet is the same component as <Dialog placement="right|bottom">; use whichever name reads better at the call site. Use a centred Dialog for a blocking decision.',
  ],
});
