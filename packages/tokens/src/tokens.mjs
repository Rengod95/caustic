// Caustic foundation — single source of truth.
// Layers: primitive (ramps, scales) → semantic (per theme) → studio (layout metrics).
// Edit here, then run `node foundation/build.mjs`. Never edit dist/ by hand.

export const meta = {
  name: 'Caustic',
  version: '1.0.0',
  prefix: 'cs',
};

/* ── Color primitives ─────────────────────────────────────────────
   Every hued ramp shares one lightness/chroma profile, so step N has the
   same contrast behaviour in every hue. Only the hue angle differs.     */
export const hueSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
export const hueProfile = {
  L: { 1: .965, 2: .93, 3: .88, 4: .815, 5: .735, 6: .635, 7: .525, 8: .465, 9: .385, 10: .30, 11: .23 },
  C: { 1: .024, 2: .045, 3: .075, 4: .105, 5: .13, 6: .142, 7: .135, 8: .118, 9: .095, 10: .07, 11: .05 },
};

// `live: true` means the hue is a runtime knob (--cs-accent-hue); the build
// validates every contrast rule involving it across a full hue sweep.
export const hues = {
  accent: { name: 'Lagoon', hue: 205, live: true, role: 'Accent, selection, focus' },
  mint: { name: 'Mint', hue: 158, role: 'Success, diff add' },
  amber: { name: 'Amber', hue: 72, role: 'Warning, permission' },
  coral: { name: 'Coral', hue: 25, role: 'Danger, diff remove, canvas guides' },
  iris: { name: 'Iris', hue: 295, role: 'Info, review, components' },
};

// Graphite: a true neutral gray (chroma 0, so hue is irrelevant). Eleven steps, 1 = lightest, 11 = darkest.
// Light and dark share the ramp: dark surfaces are 11 canvas, 10 app, 9 base, 8 raised/float.
export const neutral = {
  name: 'Graphite',
  hue: 0,
  steps: {
    1: [.995, 0], 2: [.975, 0], 3: [.93, 0], 4: [.78, 0], 5: [.66, 0], 6: [.53, 0],
    7: [.41, 0], 8: [.285, 0], 9: [.23, 0], 10: [.175, 0], 11: [.105, 0],
  },
};

// Caustic spectrum: the agent signature. Decorative light, never text.
export const spectrum = [
  { L: .80, C: .13, hue: 'accent' },
  { L: .86, C: .15, hue: 158 },
  { L: .87, C: .14, hue: 80 },
];

/* ── Semantic color, per theme ────────────────────────────────────
   Value grammar: "<ramp>.<step>" | "<ramp>.<step>/<alpha>" | "white/<a>" | "black/<a>"
   ramps: neutral, accent, mint, amber, coral, iris                    */
export const themes = {
  light: {
    'bg.app': 'neutral.2',
    'bg.canvas': 'neutral.3',
    'bg.inset': 'neutral.11/0.04',
    'bg.scrim': 'neutral.11/0.24',

    'surface.base': 'neutral.1',
    'surface.raised': 'neutral.1',
    'surface.raised-translucent': 'neutral.1',
    'surface.translucent': 'neutral.1',

    // Solid floating surfaces. rim/edge/specular/sheen are kept as zero-alpha tokens so specs keep resolving.
    'material.ultrathin': 'neutral.1',
    'material.thin': 'neutral.1',
    'material.regular': 'neutral.1',
    'material.thick': 'neutral.1',
    'material.rim': 'white/0',
    'material.edge': 'neutral.11/0',
    'material.specular': 'white/0',
    'material.sheen': 'white/0',

    'text.primary': 'neutral.11',
    'text.secondary': 'neutral.8',
    'text.tertiary': 'neutral.7',
    'text.placeholder': 'neutral.7',
    'text.disabled': 'neutral.5',
    'text.inverse': 'neutral.1',
    'text.link': 'accent.8',

    'border.subtle': 'neutral.11/0.05',
    'border.default': 'neutral.11/0.08',
    'border.strong': 'neutral.11/0.13',
    'border.control': 'neutral.5',

    'fill.hover': 'neutral.11/0.045',
    'fill.pressed': 'neutral.11/0.075',
    'fill.selected': 'neutral.11/0.11',
    'control.off': 'neutral.5',
    'control.thumb': 'neutral.1',
    'control.raised': 'neutral.1',
    'control.raised-hover': 'neutral.2',
    'control.edge': 'neutral.11/0.07',

    'ink.solid': 'neutral.10',
    'ink.hover': 'neutral.8',
    'ink.on': 'neutral.1',
    'ink.on-muted': 'neutral.1/0.75',
    'ink.kbd': 'white/0.09',
    'swatch.edge': 'black/0.1',
    'media.on': 'white/1',
    'media.on-muted': 'white/0.82',
    'media.scrim': 'black/0.55',
    'media.scrim-strong': 'black/0.78',
    'media.shade': 'black/1',
    'chart.1': 'accent.6',
    'chart.2': 'iris.7',
    'chart.3': 'mint.7',
    'chart.4': 'amber.7',

    'accent.solid': 'accent.7',
    'accent.hover': 'accent.8',
    'accent.on': 'neutral.1',
    'accent.text': 'accent.8',
    'accent.soft': 'accent.5/0.14',
    'accent.tint': 'accent.5/0.084',
    'accent.border': 'accent.5/0.5',
    'accent.glow': 'accent.6/0.2',
    'accent.fill': 'accent.8',
    'accent.fill-hover': 'accent.9',

    'success.solid': 'mint.7', 'success.on': 'neutral.1', 'success.text': 'mint.8', 'success.soft': 'mint.4/0.22',
    'warning.solid': 'amber.6', 'warning.on': 'neutral.11', 'warning.text': 'amber.8', 'warning.soft': 'amber.4/0.3',
    'danger.solid': 'coral.7', 'danger.on': 'neutral.1', 'danger.text': 'coral.8', 'danger.soft': 'coral.4/0.2',
    'info.solid': 'iris.7', 'info.on': 'neutral.1', 'info.text': 'iris.8', 'info.soft': 'iris.4/0.2',

    'diff.add': 'mint.5/0.18',
    'diff.remove': 'coral.5/0.16',
    'focus.ring': 'accent.7',

    'canvas.dot': 'neutral.11/0.13',
    'canvas.selection': 'accent.7',
    'canvas.handle': 'neutral.1',
    'canvas.selection-on': 'neutral.1',
    'canvas.guide': 'coral.7',
    'canvas.guide-on': 'neutral.1',
    'canvas.guide-user': 'iris.7',
    'canvas.hover': 'accent.6/0.6',
    'canvas.marquee': 'accent.5/0.12',
    'canvas.label': 'neutral.7',
    'canvas.checker-a': 'neutral.1',
    'canvas.checker-b': 'neutral.3',
    'canvas.artboard': 'neutral.1',

    'agent.glow': 'accent.4/0.45',
    'identity.coral': 'coral.7',
    'identity.iris': 'iris.7',
    'identity.mint': 'mint.8',
    'identity.amber': 'amber.8',
    'identity.slate': 'neutral.7',
    'identity.on': 'neutral.1',
  },
  dark: {
    'bg.app': 'neutral.10',
    'bg.canvas': 'neutral.11',
    'bg.inset': 'black/0.3',
    'bg.scrim': 'black/0.5',

    'surface.base': 'neutral.9',
    'surface.raised': 'neutral.8',
    'surface.raised-translucent': 'neutral.8',
    'surface.translucent': 'neutral.9',

    // Solid floating surfaces: one step lighter than surface.base, which is the only depth cue in dark.
    'material.ultrathin': 'neutral.8',
    'material.thin': 'neutral.8',
    'material.regular': 'neutral.8',
    'material.thick': 'neutral.8',
    'material.rim': 'white/0',
    'material.edge': 'black/0',
    'material.specular': 'white/0',
    'material.sheen': 'white/0',

    'text.primary': 'neutral.2',
    'text.secondary': 'neutral.4',
    'text.tertiary': 'neutral.5',
    'text.placeholder': 'neutral.5',
    'text.disabled': 'neutral.6',
    'text.inverse': 'neutral.10',
    'text.link': 'accent.4',

    'border.subtle': 'white/0.05',
    'border.default': 'white/0.07',
    'border.strong': 'white/0.12',
    'border.control': 'neutral.6',

    'fill.hover': 'white/0.05',
    'fill.pressed': 'white/0.08',
    'fill.selected': 'white/0.12',
    'control.off': 'neutral.6',
    'control.thumb': 'neutral.1',
    'control.raised': 'neutral.8',
    'control.raised-hover': 'neutral.7',
    'control.edge': 'white/0.06',

    'ink.solid': 'neutral.7',
    'ink.hover': 'neutral.6',
    'ink.on': 'neutral.1',
    'ink.on-muted': 'neutral.1/0.75',
    'ink.kbd': 'white/0.09',
    'swatch.edge': 'black/0.1',
    'media.on': 'white/1',
    'media.on-muted': 'white/0.82',
    'media.scrim': 'black/0.55',
    'media.scrim-strong': 'black/0.78',
    'media.shade': 'black/1',
    'chart.1': 'accent.6',
    'chart.2': 'iris.5',
    'chart.3': 'mint.5',
    'chart.4': 'amber.5',

    'accent.solid': 'accent.5',
    'accent.hover': 'accent.4',
    'accent.on': 'neutral.11',
    'accent.text': 'accent.4',
    'accent.soft': 'accent.5/0.17',
    'accent.tint': 'accent.5/0.102',
    'accent.border': 'accent.5/0.45',
    'accent.glow': 'accent.5/0.2',
    'accent.fill': 'accent.5',
    'accent.fill-hover': 'accent.4',

    'success.solid': 'mint.5', 'success.on': 'neutral.11', 'success.text': 'mint.4', 'success.soft': 'mint.6/0.2',
    'warning.solid': 'amber.5', 'warning.on': 'neutral.11', 'warning.text': 'amber.4', 'warning.soft': 'amber.6/0.2',
    'danger.solid': 'coral.5', 'danger.on': 'neutral.11', 'danger.text': 'coral.4', 'danger.soft': 'coral.6/0.2',
    'info.solid': 'iris.5', 'info.on': 'neutral.11', 'info.text': 'iris.4', 'info.soft': 'iris.6/0.2',

    'diff.add': 'mint.6/0.18',
    'diff.remove': 'coral.6/0.18',
    'focus.ring': 'accent.5',

    'canvas.dot': 'white/0.08',
    'canvas.selection': 'accent.6',
    'canvas.handle': 'neutral.1',
    'canvas.selection-on': 'neutral.11',
    'canvas.guide': 'coral.6',
    'canvas.guide-on': 'neutral.11',
    'canvas.guide-user': 'iris.5/0.8',
    'canvas.hover': 'accent.6/0.6',
    'canvas.marquee': 'accent.5/0.14',
    'canvas.label': 'neutral.5',
    'canvas.checker-a': 'neutral.8',
    'canvas.checker-b': 'neutral.7',
    'canvas.artboard': 'neutral.1',

    'agent.glow': 'accent.5/0.35',
    'identity.coral': 'coral.7',
    'identity.iris': 'iris.7',
    'identity.mint': 'mint.8',
    'identity.amber': 'amber.8',
    'identity.slate': 'neutral.6',
    'identity.on': 'neutral.1',
  },
};

/* ── Contrast policy ──────────────────────────────────────────────
   [foreground, background, minimum, note]. Alpha tokens are composited over
   the background. A background may be "<token>@<token>" (alpha layer over
   a base). The build fails if any rule fails in any theme or accent hue. */
const surfaces = ['surface.base', 'surface.raised', 'bg.app'];
export const contrastRules = [
  ...surfaces.map(bg => ['text.primary', bg, 7, 'AAA body']),
  ...surfaces.map(bg => ['text.secondary', bg, 4.5, 'AA body']),
  ...surfaces.map(bg => ['text.tertiary', bg, 4.5, 'AA meta text']),
  ['text.placeholder', 'surface.base', 4.5, 'placeholder carries meaning'],
  ['text.tertiary', 'fill.hover@bg.app', 4.5, 'meta text on a hover/sunken fill (inspector fields, kbd)'],
  ['text.tertiary', 'fill.pressed@bg.app', 4.5, 'meta text on a pressed fill'],
  ['text.placeholder', 'fill.hover@bg.app', 4.5, 'placeholder in a sunken field'],
  ['text.disabled', 'surface.base', 3, 'disabled, non-essential'],
  ['text.link', 'surface.base', 4.5, 'AA link'],
  ['text.secondary', 'material.regular@bg.canvas', 4.5, 'panel text over canvas'],
  ['text.tertiary', 'material.thick@bg.canvas', 4.5, 'menu meta over canvas'],
  ['text.primary', 'material.regular@accent.5', 4.5, 'panel over saturated content'],
  ['text.primary', 'fill.selected@surface.base', 7, 'selected row'],
  ['ink.on', 'ink.solid', 7, 'primary button'],
  ['ink.on', 'ink.hover', 4.5, 'primary button hover'],
  ['ink.on-muted', 'ink.kbd@ink.solid', 4.5, 'tooltip shortcut'],
  ['text.secondary', 'accent.soft@surface.base', 4.5, 'selected choice card text'],
  ['text.secondary', 'accent.tint@surface.base', 4.5, 'selected action card'],
  ['media.on', 'media.scrim@surface.base', 4.5, 'badge over media'],
  ['text.primary', 'control.raised', 7, 'secondary button, segmented thumb'],
  ['text.primary', 'control.raised-hover', 7, 'secondary button hover'],
  ['text.primary', 'surface.translucent', 7, 'translucent list, field, card'],
  ['text.tertiary', 'surface.translucent', 4.5, 'meta text on translucent surface'],
  ['text.primary', 'surface.translucent@accent.5', 4.5, 'translucent surface over saturated content'],
  ['accent.on', 'accent.solid', 4.5, 'accent button'],
  ['accent.on', 'accent.fill', 4.5, 'accent button (frosted fill)'],
  ['accent.on', 'accent.fill-hover', 4.5, 'accent button hover'],
  ['accent.text', 'surface.base', 4.5, 'accent text'],
  ['accent.text', 'accent.soft@surface.base', 4.5, 'selected/bound chip'],
  ['success.text', 'success.soft@surface.base', 4.5, 'status badge'],
  ['warning.text', 'warning.soft@surface.base', 4.5, 'status badge'],
  ['danger.text', 'danger.soft@surface.base', 4.5, 'status badge'],
  ['info.text', 'info.soft@surface.base', 4.5, 'status badge'],
  ['success.on', 'success.solid', 3, 'status icon'],
  ['warning.on', 'warning.solid', 3, 'status icon'],
  ['danger.on', 'danger.solid', 4.5, 'destructive button'],
  ['info.on', 'info.solid', 3, 'status icon'],
  ['text.primary', 'diff.add@surface.base', 7, 'diff line'],
  ['text.primary', 'diff.remove@surface.base', 7, 'diff line'],
  ['success.text', 'diff.add@surface.base', 4.5, 'diff sign / syntax'],
  ['danger.text', 'diff.remove@surface.base', 4.5, 'diff sign'],
  ['info.text', 'diff.add@surface.base', 4.5, 'diff syntax'],
  ['info.text', 'diff.remove@surface.base', 4.5, 'diff syntax'],
  ['accent.text', 'diff.add@surface.base', 4.5, 'diff syntax'],
  ['accent.text', 'diff.remove@surface.base', 4.5, 'diff syntax'],
  ['text.secondary', 'diff.add@surface.base', 4.5, 'diff comment'],
  ['text.secondary', 'diff.remove@surface.base', 4.5, 'diff comment'],
  ['canvas.guide-user', 'bg.canvas', 3, 'user guide on canvas'],
  ['chart.1', 'surface.base', 3, 'chart series'], ['chart.2', 'surface.base', 3, 'chart series'],
  ['chart.3', 'surface.base', 3, 'chart series'], ['chart.4', 'surface.base', 3, 'chart series'],
  ['border.control', 'surface.base', 3, 'checkbox/radio boundary (1.4.11)'],
  ['control.off', 'surface.base', 3, 'switch off track (1.4.11)'],
  ['focus.ring', 'surface.base', 3, 'focus indicator (2.4.11)'],
  ['focus.ring', 'bg.canvas', 3, 'focus indicator on canvas'],
  ['canvas.selection', 'bg.canvas', 3, 'selection outline'],
  ['canvas.selection', 'canvas.artboard', 3, 'selection on white artboard'],
  ['canvas.guide', 'canvas.artboard', 3, 'smart guide on artboard'],
  ['canvas.guide', 'bg.canvas', 3, 'smart guide on canvas'],
  ['canvas.handle', 'canvas.selection', 3, 'handle fill vs outline'],
  ['canvas.guide-on', 'canvas.guide', 4.5, 'measurement label'],
  ['canvas.selection-on', 'canvas.selection', 4.5, 'selection size label'],
  ['canvas.label', 'bg.canvas', 4.5, 'frame label'],
  ['identity.on', 'identity.coral', 4.5, 'avatar initials'],
  ['identity.on', 'identity.iris', 4.5, 'avatar initials'],
  ['identity.on', 'identity.mint', 4.5, 'avatar initials'],
  ['identity.on', 'identity.amber', 4.5, 'avatar initials'],
  ['identity.on', 'identity.slate', 4.5, 'avatar initials'],
];

/* ── Dimension & effect scales ───────────────────────────────────── */
// Quarter steps (0.25–1.75) exist for dense controls: chips, badges and segmented items sit on 5 / 7px.
export const space = { 0: 0, 0.25: 1, 0.5: 2, 0.75: 3, 1: 4, 1.25: 5, 1.5: 6, 1.75: 7, 2: 8, 2.25: 9, 2.5: 10, 3: 12, 3.5: 14, 4: 16, 4.5: 18, 5: 20, 6: 24, 6.5: 26, 7: 28, 8: 32, 10: 40, 12: 48, 16: 64, 18: 72 };

// Container insets. Compact for nested lists and inline cards; regular for cards,
// dialogs and panels. 14 / 15 is off the 4pt grid on purpose: the block inset
// sits optically even with the inline inset around 13/18 text.
export const inset = { compact: [12, 12], regular: [14, 15] };

export const radius = { none: 0, xs: 4, sm: 6, md: 8, lg: 10, xl: 12, '2xl': 16, '3xl': 22, '4xl': 28, '5xl': 32, 'well-inner': 18, '2xs': 2, full: 999 };

export const size = {
  control: { '2xs': 20, xs: 24, sm: 28, md: 32, lg: 40, xl: 48 },
  'control-compact': { '2xs': 18, xs: 22, sm: 24, md: 28, lg: 36, xl: 44 },
  field: { sm: 36, md: 40, lg: 44 },
  'field-compact': { sm: 32, md: 36, lg: 40 },
  icon: { xs: 12, sm: 14, md: 16, lg: 20, xl: 24 },
  // Fixed component geometry. Every dimension a component uses is a token.
  component: {
    check: 18, 'radio-dot': 7, 'kbd-h': 18, 'progress-h': 6, 'tool-icon': 24, presence: 8,
    'switch-md-w': 46, 'switch-md-h': 28, 'switch-md-thumb': 24, 'switch-md-travel': 18, 'switch-md-press': 30,
    'switch-sm-w': 38, 'switch-sm-h': 23, 'switch-sm-thumb': 19, 'switch-sm-travel': 15, 'switch-sm-press': 24,
    'avatar-xs': 16, 'avatar-sm': 24, 'avatar-md': 32, 'avatar-lg': 36,
    'dialog-sm': 320, 'dialog-md': 480, 'dialog-lg': 640, 'modal-sm': 380, 'sheet-md': 380, 'empty-glyph': 22,
    'card-tile': 36, 'card-glyph': 18, 'card-add': 76, 'card-spark': 64, 'spotlight-glow': 320, 'spotlight-rim': 200,
    'list-row': 52, 'list-tile': 30, 'list-term': 140, 'nav-indent': 36,
    // Layout widths: form columns, header text minimum, stepper and tag-input bounds, toast height.
    'form-heading-w': 220, 'form-body-min': 400, 'section-text-min': 160, 'stepper-max': 420, 'tag-input-min': 90, 'toast-min': 60, 'toast-w': 360,
    'usage-ring': 22, 'orb-md': 22, 'orb-md-hole': 7, 'stop-glyph': 9,
    'toolbar-item': 34, 'toolbar-item-md': 30, cursor: 18, 'orb-xs': 10, 'comment-max': 160,
    // Fixed geometry found during implementation: feature visual, analytics columns, model menu, thumbnails, badges.
    'feature-visual-min': 80, 'rounds-h': 80, 'model-menu-w': 300, 'thumb-md': 56, 'thumb-h': 44, 'suggestion-min': 150, 'index-badge': 22,
    // Structure & tokens views: tree indent, graph, tiles, gallery, contrast sample, compare stage, option tiles.
    'tree-indent': 14, 'graph-h': 330, 'graph-node-w': 150, 'tile-swatch-h': 74, 'theme-card-min': 170, 'theme-preview-h': 120,
    'contrast-sample-w': 92, 'contrast-sample-h': 64, 'compare-h': 210, 'option-tile-h': 54, 'option-tile-icon-h': 62, 'target-w': 150,
    // Inspector: alignment pad, previews, field columns, color picker, gradient, effects, motion.
    'pad-box': 96, 'layout-preview': 96, 'add-row': 38, 'radius-preview-w': 120, 'radius-preview-h': 84, 'field-alpha-w': 58,
    'color-plane-h': 150, 'color-picker-w': 268, 'color-preview': 30, 'picker-format-w': 78, 'picker-alpha-w': 52,
    'gradient-preview-h': 188, 'gradient-angle-w': 66, 'image-preview-h': 110, 'effect-stage-h': 120, 'axis-field-w': 56, 'motion-stage-h': 56,
    'curve-w': 280, 'duration-field-w': 84, 'timeline-label-w': 110, 'chevron-xs': 10,
    // Sheet grabber and table geometry.
    'grabber-w': 36, 'table-head-h': 38, 'table-select-w': 36, 'table-min-w': 560,
    'chip-h': 26, 'chip-icon': 13, 'spinner-lg': 28, 'control-inline': 26, 'tab-h': 34,
    'textarea-min': 92, 'otp-w': 44, 'otp-h': 52,
    'slider-ruler-h': 30, 'slider-label-w': 52,
    'menu-item': 30, 'menu-min': 220, 'listbox-max': 220,
    'popover-sm': 240, 'popover-md': 280, 'popover-arrow': 12,
    'calendar': 284, 'calendar-day': 36, 'icon-send': 15,
  },
  'hit-min': 24,
};

export const font = {
  ui: '"Geist", "SUIT", "Pretendard Variable", "Pretendard", "Noto Sans KR", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  voice: '"Newsreader", "Noto Serif KR", ui-serif, Georgia, serif',
  mono: '"Geist Mono", ui-monospace, "SF Mono", "Cascadia Code", Consolas, monospace',
};

// [family, size, lineHeight, weight, tracking(em), extra]
export const type = {
  display: ['ui', 40, 44, 600, -0.035],
  'title-1': ['ui', 26, 32, 600, -0.022],
  'title-2': ['ui', 20, 26, 600, -0.016],
  'title-3': ['ui', 15, 20, 600, -0.01],
  'title-4': ['ui', 13.5, 20, 600, -0.01],
  'title-feature': ['ui', 19, 24, 600, -0.02],
  'title-overlay': ['ui', 18, 22, 600, -0.015],
  stat: ['ui', 30, 34, 600, -0.035],
  'stat-lg': ['ui', 34, 34, 600, -0.03],
  sample: ['ui', 22, 26, 600, -0.02],
  body: ['ui', 14, 21, 400, -0.003],
  ui: ['ui', 13, 18, 400, -0.003],
  'ui-strong': ['ui', 13, 18, 500, -0.003],
  'ui-sm': ['ui', 12, 18, 500, 0],
  'ui-lg': ['ui', 14, 20, 500, -0.003],
  footnote: ['ui', 12, 16, 400, 0],
  caption: ['ui', 11, 14, 500, 0.06, 'uppercase'],
  label: ['ui', 11.5, 14, 500, 0],
  voice: ['voice', 16, 25, 400, -0.003],
  'voice-sm': ['voice', 15, 23, 400, -0.003],
  thought: ['voice', 14, 22, 400, 0, 'italic'],
  mono: ['mono', 12, 18, 400, 0],
  'mono-sm': ['mono', 11, 16, 500, 0],
  'mono-strong': ['mono', 12, 18, 500, 0],
  'ui-dense': ['ui', 12.5, 18, 400, -0.003],
  hint: ['ui', 11.5, 18, 400, 0],
  micro: ['ui', 11, 14, 600, 0],
  // Weight variants of a role use the weight override (font-normal / font-medium / font-semibold),
  // so roles below only add new size / line-height pairs.
  'ui-xs': ['ui', 11, 18, 400, 0],
  'ui-md': ['ui', 13.5, 18, 500, -0.003],
  'ui-relaxed': ['ui', 13, 19, 400, -0.003],
  'ui-dense-relaxed': ['ui', 12.5, 19, 400, -0.003],
  figure: ['ui', 20, 18, 600, -0.02],
  'mono-md': ['mono', 11.5, 18, 500, 0],
  'mono-relaxed': ['mono', 12, 20, 400, 0],
  'ui-md-relaxed': ['ui', 13.5, 20, 400, -0.003],
  'mono-lg': ['mono', 20, 20, 600, 0],
  // Canvas chrome: ruler numerals and toolbar shortcut hints.
  'mono-ruler': ['mono', 9.5, 12, 500, 0],
  'mono-micro': ['mono', 8, 10, 600, 0],
  'voice-lg': ['voice', 19, 26, 400, 0],
};

// Elevation: a short contact shadow + a long diffuse one. Values per theme.
export const elevation = {
  light: {
    1: '0 1px 2px oklch(0.2 0 0 / 0.06)',
    2: '0 1px 2px oklch(0.2 0 0 / 0.05), 0 4px 12px -2px oklch(0.2 0 0 / 0.08)',
    3: '0 2px 4px oklch(0.2 0 0 / 0.04), 0 12px 28px -6px oklch(0.2 0 0 / 0.12)',
    4: '0 4px 8px oklch(0.2 0 0 / 0.05), 0 24px 48px -12px oklch(0.2 0 0 / 0.18)',
    5: '0 8px 16px oklch(0.2 0 0 / 0.06), 0 40px 80px -16px oklch(0.2 0 0 / 0.28)',
    // Control thumbs (sliders, steppers): a hairline, a contact shadow and a short lift. Same in both themes.
    thumb: '0 1px 2px oklch(0 0 0 / 0.16), 0 3px 8px oklch(0 0 0 / 0.12)',
    'thumb-sm': '0 2px 6px oklch(0 0 0 / 0.2)',
    'thumb-swatch': '0 0 0 3px var(--cs-color-control-thumb), 0 2px 8px oklch(0 0 0 / 0.25)',
    // Surfaces with their own depth: resting card, hover lift, inset well panel, agent glow.
    card: '0 1px 2px oklch(0 0 0 / 0.05), 0 12px 32px -16px oklch(0.2 0 0 / 0.18)',
    lift: '0 14px 30px -14px oklch(0.2 0 0 / 0.3)',
    well: '0 1px 2px oklch(0 0 0 / 0.05), 0 6px 18px -10px oklch(0.2 0 0 / 0.25)',
    agent: '0 8px 30px -12px var(--cs-color-agent-glow)',
    artboard: '0 6px 20px -8px oklch(0 0 0 / 0.2)',
  },
  dark: {
    1: '0 1px 2px oklch(0 0 0 / 0.3)',
    2: '0 1px 2px oklch(0 0 0 / 0.3), 0 4px 12px -2px oklch(0 0 0 / 0.35)',
    3: '0 2px 4px oklch(0 0 0 / 0.25), 0 12px 28px -6px oklch(0 0 0 / 0.45)',
    4: '0 4px 8px oklch(0 0 0 / 0.25), 0 24px 48px -12px oklch(0 0 0 / 0.55)',
    5: '0 8px 16px oklch(0 0 0 / 0.3), 0 40px 80px -16px oklch(0 0 0 / 0.65)',
    // Control thumbs (sliders, steppers): a hairline, a contact shadow and a short lift. Same in both themes.
    thumb: '0 1px 2px oklch(0 0 0 / 0.16), 0 3px 8px oklch(0 0 0 / 0.12)',
    'thumb-sm': '0 2px 6px oklch(0 0 0 / 0.2)',
    'thumb-swatch': '0 0 0 3px var(--cs-color-control-thumb), 0 2px 8px oklch(0 0 0 / 0.25)',
    // Surfaces with their own depth: resting card, hover lift, inset well panel, agent glow.
    card: '0 1px 2px oklch(0 0 0 / 0.4), 0 12px 32px -16px oklch(0 0 0 / 0.6)',
    lift: '0 14px 30px -14px oklch(0 0 0 / 0.7)',
    well: '0 1px 2px oklch(0 0 0 / 0.4), 0 6px 18px -10px oklch(0 0 0 / 0.55)',
    agent: '0 8px 30px -12px var(--cs-color-agent-glow)',
    artboard: '0 6px 20px -8px oklch(0 0 0 / 0.5)',
  },
};

// control: the light frost under buttons, tooltips, list rows and fields.
export const blur = { control: 12, ultrathin: 14, thin: 20, regular: 24, thick: 36, overlay: 40 };

export const motion = {
  duration: { instant: 0, quick: 120, base: 200, gentle: 320, slow: 480, spin: 700, indeterminate: 1400, orb: 1600, shimmer: 2200, slide: 2400, scan: 2600, agent: 4800 },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    out: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'linear(0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017, 1.077, 1.121, 1.149 24.3%, 1.159, 1.163, 1.161, 1.154 29.9%, 1.129 32.8%, 1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%, 0.974 53.8%, 0.975 57.1%, 0.997 69.8%, 1.003 76.9%, 1)',
    linear: 'linear',
  },
};

export const opacity = { disabled: 0.42, muted: 0.64 };

export const z = { canvas: 0, 'canvas-overlay': 10, chrome: 20, sticky: 30, popover: 40, dialog: 60, toast: 80, tooltip: 90, palette: 100 };

export const breakpoint = { compact: 720, medium: 1100, wide: 1440 };

// Studio shell metrics. Window radius minus inset equals panel radius (concentric).
export const studio = {
  'window-radius': 32, 'window-inset': 10, 'panel-radius': 22, 'titlebar-h': 44,
  'rail-w': 48, 'pane-w': 352, 'pane-min': 320, 'pane-max': 480,
  'inspector-w': 272, 'inspector-min': 240, 'inspector-max': 360, 'toolbar-h': 42,
  // Toolbars are squircle-ish: rounder than a card, never a full pill. Items stay concentric (14 − 4 = 10).
  'toolbar-radius': 14, 'toolbar-item-radius': 10, 'toast-radius': 22,
};
