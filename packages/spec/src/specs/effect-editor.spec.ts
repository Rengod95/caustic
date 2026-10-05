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
    disabled: { type: "boolean | Partial<Record<'x' | 'y' | 'blur' | 'spread' | 'color', boolean>>", default: false, description: 'true disables every control; a record disables the named fields.' },
    commitMode: { type: "'live' | 'release'", default: 'live', description: 'live (default): the behavior before K2d. release: the NumberField value model for every numeric field of this part, and one commit per continuous gesture. blur is still clamped to 0 or more in live mode and reported as a range error in release mode.' },
    mixed: { type: "Partial<Record<'x' | 'y' | 'blur' | 'spread' | 'color', boolean>>", description: 'Fields whose selection values differ; each shows labels.mixed in place of a value (text fields as placeholder, toggles with aria-pressed "mixed", selects as the select value) and never a substituted first value.' },
    reserved: { type: "Partial<Record<'x' | 'y' | 'blur' | 'spread' | 'color', boolean>>", description: 'Fields that are being written or held by another window: read-only, aria-busy="true", data-reserved, focus and draft kept, no event while reserved.' },
    labels: { type: '{ x: string; y: string; blur: string; spread: string; xShort: string; yShort: string; blurShort: string; spreadShort: string; color: { well: string; hex: string; alpha: string; detach: string; mixed: string }; mixed: string }', required: true, description: 'Every text and accessible name of the part and of the PaintWell it composes; no English default. The specimen values: "Shadow X", "Shadow Y", Blur, Spread (aria-labels), the visible X, Y, Blur, Spread, "Shadow color", "Shadow hex", "Shadow opacity" and Mixed.' },
  },
  events: {
    onDraftChange: { payload: "{ field: 'x' | 'y' | 'blur' | 'spread'; text: string; value: number | null; error: 'empty' | 'syntax' | 'range' | null; dirty: boolean }", when: 'a numeric field text changes (NumberField contract: error empty, syntax or range, dirty while it differs from the committed value). field names the field. The color paint well drafts are forwarded with field color.' },
    onPreviewChange: { payload: '{ x: number; y: number; blur: number; spread: number; color: { hex: string; alpha: number } } | null', when: 'commitMode release only: a scrub or drag gesture is in progress, with the value being previewed (not a commit); null when it ends or Escape cancels it. onValueChange follows once on release. The preview stage follows it.' },
    onValueChange: { payload: '{ x: number; y: number; blur: number; spread: number; color: { hex: string; alpha: number } }', when: 'any field commits; blur is clamped to 0 or more' } },
  styles: [
    { slot: 'root', expect: { gap: 14 } },
    { slot: 'stage', when: { preview: true }, expect: { bg: 'bg.inset', radius: 'xl', height: 'size-effect-stage-h' } },
    { slot: 'card', when: { preview: true }, expect: { bg: 'surface.base', edge: 'border.subtle', radius: 'toolbar', width: 'size-pad-box', height: 64 }, note: 'Specimen radius is 14px (the toolbar radius token has that value). The edited shadow is data; the specimen draws it as 0 0 0 1px border.subtle plus X Y blur spread in oklch(.2 .02 260 / .24).' },
    { slot: 'fields', expect: { gap: 6 } },
  ],
  behavior: {
    keyboard: { Tab: 'X, Y, Blur, Spread, color, hex, opacity', 'ArrowUp / ArrowDown': 'step the focused field (Shift ×10)' },
    pointer: ['scrubbing a label redraws the card shadow live'],
    scenarios: [
      { name: 'reserved blur is busy', props: { reserved: { blur: true } }, steps: [], expect: [{ slot: 'blur', attr: { 'aria-busy': 'true' } }] },
      ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    notes: ['The stage is decorative (aria-hidden); the numbers are the real controls.', 'Every field has an aria-label (Shadow X, Shadow Y, Blur, Spread, Shadow color, Shadow opacity).'],
  },
  policies: ['P6'],
  composition: { uses: ['number-field', 'paint-well'] },
  usage: [
    'K2d inspector value model (defined on NumberField): onValueChange is the commit; commitMode "release" turns every continuous gesture into onPreviewChange while it runs and one onValueChange when it ends, and keeps typed text as a draft (onDraftChange, aria-invalid, never clamped or dropped) until a valid Enter or blur; discrete choices (toggle, segment, select option, arrow key, preset, swatch) commit at once; mixed fields show the mixed label with no invented value; a reserved field is read-only with aria-busy and data-reserved and keeps focus and its draft; disabled may be a boolean or a per-field record. Fields: \'x\' | \'y\' | \'blur\' | \'spread\' | \'color\'.',
    'K2d labels: every string is labels.*; the fixture passes the specimen strings, so the baseline stays identical.',
    'No example of its own: the effects-stack example reproduces the whole section including this editor.',
    'Fixture contract: render(props) renders the defaults (X 0, Y 12, Blur 24, Spread −6, 1F2128 at 20 %) with preview true.',
    'Specimen bug: the paint row shows 1F2128 at 20 % (well: oklch(.2 .02 260 / .2)) but the stage shadow is drawn with a hard-coded oklch(0.2 0.02 260 / 0.24), so the preview is 4 % darker than the color it claims. The component must draw the shadow from the color field; expect a small pixel difference against the baseline.',
    'Token requests: size-effect-stage-h 120px; the 96px card width can share size-pad-box (96).',
  ],
});
