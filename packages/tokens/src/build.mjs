// Builds dist/ from foundation/tokens.mjs and validates the contrast policy.
// Usage: node foundation/build.mjs [--check]   (--check: validate only, write nothing)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as T from './tokens.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');
const P = T.meta.prefix;
const checkOnly = process.argv.includes('--check');
const HUE_SWEEP = Array.from({ length: 24 }, (_, i) => i * 15);

/* ── Color math (OKLCH → sRGB, CSS Color 4 chroma-reduction gamut map) ── */
function oklchToLinear(L, C, h) {
  const a = C * Math.cos(h * Math.PI / 180), b = C * Math.sin(h * Math.PI / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}
const inGamut = rgb => rgb.every(v => v >= -1e-4 && v <= 1 + 1e-4);
const enc = v => { v = Math.min(1, Math.max(0, v)); return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055; };
const dec = v => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
function toSrgb(L, C, h) {
  let rgb = oklchToLinear(L, C, h);
  if (!inGamut(rgb)) {
    let lo = 0, hi = C;
    for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (inGamut(oklchToLinear(L, mid, h))) lo = mid; else hi = mid; }
    rgb = oklchToLinear(L, lo, h);
  }
  return rgb.map(enc); // gamma-encoded 0..1
}
const lum = srgb => { const [r, g, b] = srgb.map(dec); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const over = (fg, a, bg) => fg.map((v, i) => v * a + bg[i] * (1 - a));
const hex = srgb => '#' + srgb.map(v => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('');

/* ── Primitive lookup ── */
const r4 = n => +n.toFixed(4);
function primitive(ramp, step, accentHue) {
  if (ramp === 'white') return { L: 1, C: 0, h: 0 };
  if (ramp === 'black') return { L: 0, C: 0, h: 0 };
  if (ramp === 'neutral') {
    const s = T.neutral.steps[step]; if (!s) throw new Error(`neutral.${step} missing`);
    return { L: s[0], C: s[1], h: T.neutral.hue };
  }
  const hue = T.hues[ramp]; if (!hue) throw new Error(`unknown ramp ${ramp}`);
  if (!(step in T.hueProfile.L)) throw new Error(`${ramp}.${step} missing`);
  return { L: T.hueProfile.L[step], C: T.hueProfile.C[step], h: hue.live ? accentHue : hue.hue, live: !!hue.live };
}
function parse(spec) {
  const [ref, a] = spec.split('/');
  const [ramp, step] = ref.includes('.') ? ref.split('.') : [ref, ''];
  return { ramp, step, alpha: a === undefined ? 1 : +a };
}
function cssColor(spec) {
  const { ramp, step, alpha } = parse(spec);
  const p = primitive(ramp, step, 0);
  const h = p.live ? `var(--${P}-accent-hue)` : r4(p.h);
  return `oklch(${r4(p.L)} ${r4(p.C)} ${h}${alpha < 1 ? ` / ${alpha}` : ''})`;
}

/* ── Contrast validation ── */
function resolveRgb(theme, name, accentHue) {
  const spec = T.themes[theme][name] ?? null;
  const { ramp, step, alpha } = parse(spec ?? name);
  const p = primitive(ramp, step, accentHue);
  return { rgb: toSrgb(p.L, p.C, p.h), alpha };
}
function layer(theme, expr, accentHue) {
  const parts = expr.split('@');
  let base = resolveRgb(theme, parts[parts.length - 1], accentHue);
  let rgb = base.alpha < 1 ? over(base.rgb, base.alpha, resolveRgb(theme, 'bg.app', accentHue).rgb) : base.rgb;
  for (let i = parts.length - 2; i >= 0; i--) { const top = resolveRgb(theme, parts[i], accentHue); rgb = over(top.rgb, top.alpha, rgb); }
  return rgb;
}
const results = [];
let failures = 0;
for (const theme of Object.keys(T.themes)) {
  for (const [fg, bg, min, note] of T.contrastRules) {
    const live = [fg, ...bg.split('@')].some(n => (T.themes[theme][n] ?? n).startsWith('accent.'));
    let worst = Infinity, worstHue = null;
    for (const h of live ? HUE_SWEEP : [T.hues.accent.hue]) {
      const bgRgb = layer(theme, bg, h);
      const f = resolveRgb(theme, fg, h);
      const fgRgb = f.alpha < 1 ? over(f.rgb, f.alpha, bgRgb) : f.rgb;
      const r = ratio(fgRgb, bgRgb);
      if (r < worst) { worst = r; worstHue = h; }
    }
    const pass = worst >= min;
    if (!pass) failures++;
    results.push({ theme, fg, bg, min, ratio: +worst.toFixed(2), pass, note, sweep: live, worstHue: live ? worstHue : null });
  }
}

/* ── Report ── */
const pad = (s, n) => String(s).padEnd(n);
for (const r of results.filter(r => !r.pass || process.argv.includes('--verbose')))
  console.log(`${r.pass ? 'ok  ' : 'FAIL'} ${pad(r.theme, 6)} ${pad(r.fg, 18)} on ${pad(r.bg, 30)} ${r.ratio.toFixed(2).padStart(6)} ≥ ${r.min}${r.sweep ? `  (worst hue ${r.worstHue}°)` : ''}`);
console.log(`contrast: ${results.length - failures}/${results.length} rules pass across ${Object.keys(T.themes).length} themes, accent swept over ${HUE_SWEEP.length} hues`);
if (failures) { console.error(`${failures} contrast rule(s) failed.`); process.exit(1); }
if (checkOnly) process.exit(0);

/* ── Emit CSS ── */
const v = (name, value) => `  --${P}-${name}: ${value};`;
const kebab = s => String(s).replace(/\./g, '-');
const root = [];
root.push(`  /* ${T.meta.name} ${T.meta.version} — generated by foundation/build.mjs. Do not edit. */`);
root.push(v('accent-hue', T.hues.accent.hue));
root.push('', '  /* primitives: neutral */');
for (const [s, [L, C]] of Object.entries(T.neutral.steps)) root.push(v(`neutral-${s}`, `oklch(${L} ${C} ${T.neutral.hue})`));
for (const [key, h] of Object.entries(T.hues)) {
  root.push('', `  /* primitives: ${key} (${h.name}) */`);
  for (const s of T.hueSteps) root.push(v(`${key}-${s}`, `oklch(${T.hueProfile.L[s]} ${T.hueProfile.C[s]} ${h.live ? `var(--${P}-accent-hue)` : h.hue})`));
}
root.push('', '  /* agent spectrum */');
T.spectrum.forEach((s, i) => root.push(v(`spectrum-${i + 1}`, `oklch(${s.L} ${s.C} ${s.hue === 'accent' ? `var(--${P}-accent-hue)` : s.hue})`)));
const stops = T.spectrum.map((_, i) => `var(--${P}-spectrum-${i + 1})`).concat(`var(--${P}-spectrum-1)`).join(', ');
root.push(v('spectrum-conic', `conic-gradient(from var(--${P}-spin, 0deg), ${stops})`));
root.push(v('spectrum-linear', `linear-gradient(90deg, ${stops})`));

root.push('', '  /* space */');
for (const [k, px] of Object.entries(T.space)) root.push(v(`space-${String(k).replace('.', '_')}`, `${px}px`));
root.push('', '  /* inset (container padding) */');
for (const [k, [y, x]] of Object.entries(T.inset)) { root.push(v(`inset-${k}`, `${y}px ${x}px`)); root.push(v(`inset-${k}-y`, `${y}px`)); root.push(v(`inset-${k}-x`, `${x}px`)); }
root.push('', '  /* radius */');
for (const [k, px] of Object.entries(T.radius)) root.push(v(`radius-${k}`, `${px}px`));
root.push('', '  /* size */');
for (const [k, px] of Object.entries(T.size.control)) root.push(v(`control-${k}`, `${px}px`));
for (const [k, px] of Object.entries(T.size.field)) root.push(v(`field-${k}`, `${px}px`));
for (const [k, px] of Object.entries(T.size.component)) root.push(v(`size-${k}`, `${px}px`));
for (const [k, px] of Object.entries(T.size.icon)) root.push(v(`icon-${k}`, `${px}px`));
root.push(v('hit-min', `${T.size['hit-min']}px`));
root.push('', '  /* typography */');
for (const [k, f] of Object.entries(T.font)) root.push(v(`font-${k}`, f));
for (const [k, [fam, sz, lh, w, tr]] of Object.entries(T.type)) {
  root.push(v(`text-${k}`, `${w} ${sz}px/${lh}px var(--${P}-font-${fam})`));
  root.push(v(`text-${k}-tracking`, `${tr}em`));
}
root.push('', '  /* blur, motion, opacity, z */');
for (const [k, px] of Object.entries(T.blur)) root.push(v(`blur-${k}`, `${px}px`));
for (const [k, ms] of Object.entries(T.motion.duration)) root.push(v(`duration-${k}`, `${ms}ms`));
for (const [k, e] of Object.entries(T.motion.easing)) root.push(v(`ease-${k}`, e));
for (const [k, o] of Object.entries(T.opacity)) root.push(v(`opacity-${k}`, o));
for (const [k, n] of Object.entries(T.z)) root.push(v(`z-${k}`, n));
root.push('', '  /* studio shell */');
for (const [k, px] of Object.entries(T.studio)) root.push(v(`studio-${k}`, `${px}px`));

const themeBlock = theme => {
  const out = [];
  for (const [name, spec] of Object.entries(T.themes[theme])) out.push(v(`color-${kebab(name)}`, cssColor(spec)));
  for (const [k, s] of Object.entries(T.elevation[theme])) out.push(v(`elevation-${k}`, s));
  out.push(v('focus-field', `inset 0 0 0 1.5px var(--${P}-color-focus-ring)`));
  out.push(v('focus', `0 0 0 1px var(--${P}-color-surface-base), 0 0 0 3px var(--${P}-color-focus-ring)`));
  return out.join('\n');
};

const css = `/* ${T.meta.name} foundation ${T.meta.version} — tokens. Generated; edit foundation/tokens.mjs. */
@property --${P}-spin { syntax: '<angle>'; inherits: true; initial-value: 0deg; }

:root {
  color-scheme: light;
${root.join('\n')}

  /* semantic: light */
${themeBlock('light')}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
${themeBlock('dark').replace(/^/gm, '  ')}
  }
}

:root[data-theme="dark"] {
  color-scheme: dark;
${themeBlock('dark')}
}

:root[data-density="compact"] {
${Object.entries(T.size['control-compact']).map(([k, px]) => v(`control-${k}`, `${px}px`)).join('\n')}
${Object.entries(T.size['field-compact']).map(([k, px]) => v(`field-${k}`, `${px}px`)).join('\n')}
}
`;

/* ── Emit DTCG JSON ── */
const dtcgColor = (L, C, h, alpha = 1) => {
  const rgb = toSrgb(L, C, h);
  return { colorSpace: 'oklch', components: [L, C, h], alpha, hex: hex(rgb) };
};
const core = { $description: `${T.meta.name} ${T.meta.version} primitives`, color: { neutral: {}, spectrum: {} } };
for (const [s, [L, C]] of Object.entries(T.neutral.steps)) core.color.neutral[s] = { $type: 'color', $value: dtcgColor(L, C, T.neutral.hue) };
for (const [key, h] of Object.entries(T.hues)) {
  core.color[key] = { $description: `${h.name} — ${h.role}${h.live ? ' (hue is a runtime knob)' : ''}` };
  for (const s of T.hueSteps) core.color[key][s] = { $type: 'color', $value: dtcgColor(T.hueProfile.L[s], T.hueProfile.C[s], h.hue) };
}
T.spectrum.forEach((s, i) => core.color.spectrum[i + 1] = { $type: 'color', $value: dtcgColor(s.L, s.C, s.hue === 'accent' ? T.hues.accent.hue : s.hue) });
core.space = Object.fromEntries(Object.entries(T.space).map(([k, px]) => [k, { $type: 'dimension', $value: { value: px, unit: 'px' } }]));
core.inset = Object.fromEntries(Object.entries(T.inset).map(([k, [y, x]]) => [k, { $type: 'dimension', $description: `block ${y}px, inline ${x}px`, $value: { value: y, unit: 'px' }, $extensions: { 'cs.inline': { value: x, unit: 'px' } } }]));
core.radius = Object.fromEntries(Object.entries(T.radius).map(([k, px]) => [k, { $type: 'dimension', $value: { value: px, unit: 'px' } }]));
core.size = { control: Object.fromEntries(Object.entries(T.size.control).map(([k, px]) => [k, { $type: 'dimension', $value: { value: px, unit: 'px' } }])), icon: Object.fromEntries(Object.entries(T.size.icon).map(([k, px]) => [k, { $type: 'dimension', $value: { value: px, unit: 'px' } }])) };
core.font = { family: Object.fromEntries(Object.entries(T.font).map(([k, f]) => [k, { $type: 'fontFamily', $value: f.split(',').map(s => s.trim().replace(/"/g, '')) }])) };
core.typography = Object.fromEntries(Object.entries(T.type).map(([k, [fam, sz, lh, w, tr]]) => [k, { $type: 'typography', $value: { fontFamily: `{font.family.${fam}}`, fontSize: { value: sz, unit: 'px' }, lineHeight: lh / sz, fontWeight: w, letterSpacing: { value: tr, unit: 'em' } } }]));
core.duration = Object.fromEntries(Object.entries(T.motion.duration).map(([k, ms]) => [k, { $type: 'duration', $value: { value: ms, unit: 'ms' } }]));
core.blur = Object.fromEntries(Object.entries(T.blur).map(([k, px]) => [k, { $type: 'dimension', $value: { value: px, unit: 'px' } }]));

const semantic = theme => {
  const out = { $description: `${T.meta.name} ${T.meta.version} semantic tokens — ${theme}` };
  for (const [name, spec] of Object.entries(T.themes[theme])) {
    const { ramp, step, alpha } = parse(spec);
    const [group, key] = name.split('.');
    out[group] ??= {};
    const ref = ramp === 'white' || ramp === 'black'
      ? { colorSpace: 'oklch', components: [ramp === 'white' ? 1 : 0, 0, 0], alpha }
      : alpha < 1 ? { ...core.color[ramp][step].$value, alpha } : `{color.${ramp}.${step}}`;
    out[group][key] = { $type: 'color', $value: ref };
  }
  return out;
};

if (!checkOnly) {
  mkdirSync(dist, { recursive: true });
  const base = readFileSync(join(here, 'base.css'), 'utf8');
  writeFileSync(join(dist, 'caustic.tokens.css'), css);
  writeFileSync(join(dist, 'caustic.css'), css + '\n' + base);
  writeFileSync(join(dist, 'tokens.core.json'), JSON.stringify(core, null, 2));
  writeFileSync(join(dist, 'tokens.light.json'), JSON.stringify(semantic('light'), null, 2));
  writeFileSync(join(dist, 'tokens.dark.json'), JSON.stringify(semantic('dark'), null, 2));
  const report = { version: T.meta.version, hueSweep: HUE_SWEEP, results };
  writeFileSync(join(dist, 'contrast.json'), JSON.stringify(report, null, 2));
  writeFileSync(join(dist, 'contrast.js'), `window.CS_CONTRAST = ${JSON.stringify(report)};\n`);
  const { meta, hueSteps, hueProfile, hues, neutral, spectrum, themes, space, inset, radius, size, font, type, elevation, blur, motion, opacity, z, breakpoint, studio } = T;
  const resolved = {};
  for (const theme of Object.keys(themes)) {
    resolved[theme] = {};
    for (const [name, spec] of Object.entries(themes[theme])) {
      const { ramp, step, alpha } = parse(spec);
      const p = primitive(ramp, step, hues.accent.hue);
      resolved[theme][name] = { hex: hex(toSrgb(p.L, p.C, p.h)), alpha };
    }
  }
  const primitiveHex = { neutral: Object.fromEntries(Object.entries(neutral.steps).map(([s, [L, C]]) => [s, hex(toSrgb(L, C, neutral.hue))])) };
  for (const [key, h] of Object.entries(hues)) primitiveHex[key] = Object.fromEntries(hueSteps.map(s => [s, hex(toSrgb(hueProfile.L[s], hueProfile.C[s], h.hue))]));
  const source = { meta, hueSteps, hueProfile, hues, neutral, spectrum, themes, resolved, primitiveHex, space, inset, radius, size, font, type, elevation, blur, motion, opacity, z, breakpoint, studio };
  writeFileSync(join(dist, 'tokens.js'), `window.CS_TOKENS = ${JSON.stringify(source)};\n`);
  writeFileSync(join(dist, 'tokens.mjs'), `export default ${JSON.stringify({ ...source, contrastRules: T.contrastRules }, null, 2)};\n`);
  writeFileSync(join(dist, 'theme.css'), tailwindTheme());
  writeFileSync(join(dist, 'allowlist.json'), JSON.stringify(allowlist(), null, 2));
  writeFileSync(join(dist, 'tw-merge.json'), JSON.stringify(twMergeScales(), null, 2));
  console.log('wrote dist/caustic.css, caustic.tokens.css, theme.css, allowlist.json, tokens.{core,light,dark}.json, tokens.{js,mjs}, contrast.{json,js}');
}

/* ── Tailwind 4 theme ──────────────────────────────────────────────────
   Every Tailwind namespace is reset, then re-declared from Caustic tokens
   only. A utility that is not backed by a token generates no CSS, which the
   gateway reports as a non-token class. Colors point at --cs-* variables so
   themes and the live accent hue keep working at runtime. */
function tailwindTheme() {
  const L = [];
  const add = (k, val) => L.push(`  --${k}: ${val};`);
  L.push(`/* ${T.meta.name} ${T.meta.version} — Tailwind 4 theme. Generated by packages/tokens/src/build.mjs. Do not edit. */`);
  L.push('@theme {');
  for (const ns of ['color', 'radius', 'spacing', 'shadow', 'inset-shadow', 'drop-shadow', 'text-shadow', 'font', 'text', 'tracking', 'leading', 'blur', 'breakpoint', 'ease', 'animate', 'container', 'perspective'])
    L.push(`  --${ns}-*: initial;`);
  L.push('', '  /* color: semantic tokens only (primitives are not exposed) */');
  for (const name of Object.keys(T.themes.light)) add(`color-${kebab(name)}`, `var(--${P}-color-${kebab(name)})`);
  L.push('', '  /* radius */');
  for (const k of Object.keys(T.radius)) add(`radius-${k}`, `var(--${P}-radius-${k})`);
  add('radius-window', `var(--${P}-studio-window-radius)`); add('radius-panel', `var(--${P}-studio-panel-radius)`);
  add('radius-toolbar', `var(--${P}-studio-toolbar-radius)`); add('radius-toolbar-item', `var(--${P}-studio-toolbar-item-radius)`); add('radius-toast', `var(--${P}-studio-toast-radius)`);
  L.push('', '  /* spacing: 4pt multiplier + named tokens */');
  add('spacing', '4px');
  for (const [k] of Object.entries(T.inset)) { add(`spacing-inset-${k}-x`, `var(--${P}-inset-${k}-x)`); add(`spacing-inset-${k}-y`, `var(--${P}-inset-${k}-y)`); }
  for (const k of Object.keys(T.size.control)) add(`spacing-control-${k}`, `var(--${P}-control-${k})`);
  for (const k of Object.keys(T.size.field)) add(`spacing-field-${k}`, `var(--${P}-field-${k})`);
  for (const k of Object.keys(T.size.icon)) add(`spacing-icon-${k}`, `var(--${P}-icon-${k})`);
  for (const k of Object.keys(T.size.component)) add(`spacing-${k}`, `var(--${P}-size-${k})`);
  add('spacing-hit', `var(--${P}-hit-min)`);
  for (const k of Object.keys(T.studio)) if (!k.includes('radius')) add(`spacing-studio-${k}`, `var(--${P}-studio-${k})`);
  L.push('', '  /* typography */');
  for (const k of Object.keys(T.font)) add(`font-${k}`, `var(--${P}-font-${k})`);
  for (const [k, [, sz, lh, w, tr]] of Object.entries(T.type)) {
    add(`text-${k}`, `${sz}px`); add(`text-${k}--line-height`, `${lh}px`); add(`text-${k}--letter-spacing`, `${tr}em`); add(`text-${k}--font-weight`, `${w}`);
  }
  L.push('', '  /* depth, blur, motion */');
  for (const k of Object.keys(T.elevation.light)) add(`shadow-${k}`, `var(--${P}-elevation-${k})`);
  add('shadow-focus', `var(--${P}-focus)`); add('shadow-focus-field', `var(--${P}-focus-field)`);
  for (const k of Object.keys(T.blur)) add(`blur-${k}`, `var(--${P}-blur-${k})`);
  for (const k of Object.keys(T.motion.easing)) add(`ease-${k}`, `var(--${P}-ease-${k})`);
  for (const [k, px] of Object.entries(T.breakpoint)) add(`breakpoint-${k}`, `${px}px`);
  add('animate-agent', `cs-spin var(--${P}-duration-agent) linear infinite`);
  add('animate-orb', 'cs-spin 1.6s linear infinite');
  add('animate-shimmer', `cs-shimmer var(--${P}-duration-shimmer) linear infinite`);
  add('animate-spinner', `cs-rot var(--${P}-duration-spin) linear infinite`);
  add('animate-indeterminate', `cs-indet 1.4s var(--${P}-ease-out) infinite`);
  add('animate-slide', 'cs-slide 2.4s linear infinite');
  L.push('  @keyframes cs-rot { to { transform: rotate(360deg); } }');
  L.push('  @keyframes cs-indet { from { transform: translateX(-100%); } to { transform: translateX(300%); } }');
  L.push('  @keyframes cs-slide { to { background-position: -200% 0; } }');
  L.push('}', '');
  L.push(`/* Caustic utilities: materials, agent signature, focus policy */
@utility glass {
  position: relative;
  background: var(--${P}-material, var(--${P}-color-material-regular));
  -webkit-backdrop-filter: blur(var(--${P}-material-blur, var(--${P}-blur-regular))) saturate(1.8);
  backdrop-filter: blur(var(--${P}-material-blur, var(--${P}-blur-regular))) saturate(1.8);
  box-shadow: inset 0 1px 0 var(--${P}-color-material-specular), inset 0 0 0 1px var(--${P}-color-material-rim), 0 0 0 0.5px var(--${P}-color-material-edge), var(--${P}-shadow, var(--${P}-elevation-3));
  &::before { content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none;
    background: linear-gradient(155deg, var(--${P}-color-material-specular), transparent 28%, transparent 66%, var(--${P}-color-material-sheen));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor;
    mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0); }
}
@utility glass-ultrathin { --${P}-material: var(--${P}-color-material-ultrathin); --${P}-material-blur: var(--${P}-blur-ultrathin); }
@utility glass-thin { --${P}-material: var(--${P}-color-material-thin); --${P}-material-blur: var(--${P}-blur-thin); }
@utility glass-thick { --${P}-material: var(--${P}-color-material-thick); --${P}-material-blur: var(--${P}-blur-thick); }
@utility glass-shadow-* { --${P}-shadow: --value(--shadow-*); }
@utility frost { -webkit-backdrop-filter: blur(var(--${P}-blur-control)) saturate(1.6); backdrop-filter: blur(var(--${P}-blur-control)) saturate(1.6); }
@utility agent-rim {
  position: relative;
  &::after { content: ""; position: absolute; inset: -1px; border-radius: inherit; padding: 1.5px; pointer-events: none;
    background: var(--${P}-spectrum-conic);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor;
    mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
    animation: cs-spin var(--${P}-duration-agent) linear infinite; }
}
@utility agent-glow { box-shadow: 0 8px 30px -6px var(--${P}-color-agent-glow); }
@utility orb {
  --orb: 14px; --orb-hole: 3.4px;
  width: var(--orb); height: var(--orb); border-radius: 9999px; flex: none; background: var(--${P}-spectrum-conic); animation: cs-spin 1.6s linear infinite;
  -webkit-mask: radial-gradient(circle, transparent var(--orb-hole), #000 calc(var(--orb-hole) + .5px));
  mask: radial-gradient(circle, transparent var(--orb-hole), #000 calc(var(--orb-hole) + .5px));
}
@utility orb-sm { --orb: 12px; --orb-hole: 2.8px; }
@utility orb-lg { --orb: 28px; --orb-hole: 9px; }
@utility orb-dot { --orb: 8px; -webkit-mask: none; mask: none; animation-duration: var(--${P}-duration-agent); }
@utility shimmer {
  color: var(--${P}-color-text-tertiary);
  background: linear-gradient(90deg, var(--${P}-color-text-tertiary) 0 35%, var(--${P}-color-text-primary) 50%, var(--${P}-color-text-tertiary) 65% 100%);
  background-size: 260% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  animation: cs-shimmer var(--${P}-duration-shimmer) linear infinite;
}
@utility spectrum-fill { background: var(--${P}-spectrum-conic); animation: cs-spin var(--${P}-duration-agent) linear infinite; }
@utility spectrum-line { background: var(--${P}-spectrum-linear); background-size: 200% 100%; }
@utility focus-ring { outline: none; box-shadow: var(--${P}-focus); }
@utility focus-field { box-shadow: var(--${P}-focus-field); }
@utility checker {
  background-color: var(--${P}-color-canvas-checker-a);
  background-image: conic-gradient(var(--${P}-color-canvas-checker-b) 25%, transparent 0 50%, var(--${P}-color-canvas-checker-b) 0 75%, transparent 0);
  background-size: 8px 8px;
}
@utility canvas-grid {
  background-color: var(--${P}-color-bg-canvas);
  background-image: radial-gradient(var(--${P}-color-canvas-dot) 1px, transparent 1.2px); background-size: 20px 20px;
}
@utility scrollbar-none { scrollbar-width: none; &::-webkit-scrollbar { display: none; } }
`);
  return L.join('\n');
}

// Named theme scales for tailwind-merge, so conflicting Caustic utilities resolve (last wins).
function twMergeScales() {
  const theme = tailwindTheme();
  const names = ns => [...theme.matchAll(new RegExp(`--${ns}-([a-z0-9-]+):`, 'g'))].map(m => m[1]).filter(n => !n.includes('--'));
  return { spacing: names('spacing'), text: names('text'), radius: names('radius'), shadow: names('shadow'), blur: names('blur'), color: names('color') };
}

// Numeric scales the gateway accepts for numeric utilities (p-3, duration-200, z-40, opacity-42).
function allowlist() {
  return {
    spacingSteps: Object.keys(T.space).map(Number),
    durations: Object.values(T.motion.duration),
    zIndex: Object.values(T.z),
    opacity: [0, 100, Math.round(T.opacity.disabled * 100), Math.round(T.opacity.muted * 100)],
    fontWeights: ['normal', 'medium', 'semibold'],
    arbitraryPx: ['0.5px', '1px', '1.5px', '2px'],
    semanticColors: Object.keys(T.themes.light).map(kebab),
    textRoles: Object.keys(T.type),
    radii: [...Object.keys(T.radius), 'window', 'panel', 'toolbar', 'toolbar-item', 'toast'],
  };
}
