import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'effect-editor',
  name: 'EffectEditor',
  category: 'inspector',
  status: 'ready',
  purpose: 'Edits one shadow effect: a live stage that shows the shadow on a card, four numeric fields (X, Y, blur, spread) and the shadow color with its opacity.',
  description: 'Pure composition of NumberFields and a PaintWell around a preview stage. The stage card re-draws as any field changes (no animation beyond a short box-shadow transition), so the effect is seen while scrubbing. It edits the effect that is selected in EffectsStack; other effect kinds (inner shadow, blur) are not shown in the specimen and are not specified here.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Vertical stack, 14px gap: stage, fields, color.' },
    { name: 'stage', el: 'div', parent: 'root', required: false, description: 'Preview stage: 120px high, xl radius, bg.inset, content centered.' },
    { name: 'card', el: 'div', parent: 'stage', required: false, description: 'The sample object: 96 × 64, surface.base, 14px radius, with a 1px border.subtle ring and the edited shadow: X, Y, blur and spread in the shadow color. box-shadow transitions with duration-base.' },
    { name: 'fields', el: 'div', parent: 'root', description: 'Two-column grid, 6px gap: X, Y, Blur, Spread in that order (two rows).' },
    { name: 'x', el: 'any', parent: 'fields', description: 'NumberField, text label "X", aria-label "Shadow X".' },
    { name: 'y', el: 'any', parent: 'fields', description: 'NumberField, text label "Y", aria-label "Shadow Y".' },
    { name: 'blur', el: 'any', parent: 'fields', description: 'NumberField, text label "Blur", aria-label "Blur", min 0.' },
    { name: 'spread', el: 'any', parent: 'fields', description: 'NumberField, text label "Spread", aria-label "Spread" (negative allowed).' },
    { name: 'color', el: 'any', parent: 'root', description: 'PaintWell with aria-labels "Shadow color" and "Shadow opacity".' },
  ],
  props: {
    value: { type: '{ x: number; y: number; blur: number; spread: number; color: { hex: string; alpha: number } }', description: 'Controlled shadow.' },
    defaultValue: { type: '{ x: number; y: number; blur: number; spread: number; color: { hex: string; alpha: number } }', default: { x: 0, y: 12, blur: 24, spread: -6, color: { hex: '1F2128', alpha: 20 } }, description: 'Uncontrolled initial shadow (the specimen).' },
    preview: { type: 'boolean', default: false, description: 'Shows the preview stage above the fields.' },
    disabled: { type: 'boolean', default: false, description: 'Disables every control.' },
  },
  events: { onValueChange: { payload: '{ x: number; y: number; blur: number; spread: number; color: { hex: string; alpha: number } }', when: 'any field commits; blur is clamped to 0 or more' } },
  styles: [
    { slot: 'root', expect: { gap: 14 } },
    { slot: 'stage', when: { preview: true }, expect: { bg: 'bg.inset', radius: 'xl', height: 'size-effect-stage-h' } },
    { slot: 'card', when: { preview: true }, expect: { bg: 'surface.base', edge: 'border.subtle', radius: 'toolbar', width: 'size-pad-box', height: 64 }, note: 'Specimen radius is 14px (the toolbar radius token has that value). The edited shadow is data; the specimen draws it as 0 0 0 1px border.subtle plus X Y blur spread in oklch(.2 .02 260 / .24).' },
    { slot: 'fields', expect: { gap: 6 } },
  ],
  behavior: {
    keyboard: { Tab: 'X, Y, Blur, Spread, color, hex, opacity', 'ArrowUp / ArrowDown': 'step the focused field (Shift ×10)' },
    pointer: ['scrubbing a label redraws the card shadow live'],
    scenarios: [],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    notes: ['The stage is decorative (aria-hidden); the numbers are the real controls.', 'Every field has an aria-label (Shadow X, Shadow Y, Blur, Spread, Shadow color, Shadow opacity).'],
  },
  policies: ['P6'],
  composition: { uses: ['number-field', 'paint-well'] },
  usage: [
    'No example of its own: the effects-stack example reproduces the whole section including this editor.',
    'Fixture contract: render(props) renders the defaults (X 0, Y 12, Blur 24, Spread −6, 1F2128 at 20 %) with preview true.',
    'Specimen bug: the paint row shows 1F2128 at 20 % (well: oklch(.2 .02 260 / .2)) but the stage shadow is drawn with a hard-coded oklch(0.2 0.02 260 / 0.24), so the preview is 4 % darker than the color it claims. The component must draw the shadow from the color field; expect a small pixel difference against the baseline.',
    'Token requests: size-effect-stage-h 120px; the 96px card width can share size-pad-box (96).',
  ],
});
