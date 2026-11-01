// Builds dist/ from src/tokens.mjs and validates the contrast policy.
// Usage: node packages/tokens/src/build.mjs [--check] [--verbose]   (--check: validate only, write nothing)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as T from './tokens.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');
const P = T.meta.prefix;
const checkOnly = process.argv.includes('--check');
const MODES = ['light', 'dark'];

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
// Browsers differ on out-of-gamut OKLCH: CSS Color 4 reduces chroma, Chromium clips each channel.
// Contrast is checked under both, so a pair passes however it is rendered.
let GAMUT = 'map';
function toSrgb(L, C, h) {
  let rgb = oklchToLinear(L, C, h);
  if (GAMUT === 'map' && !inGamut(rgb)) {
    let lo = 0, hi = C;
    for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (inGamut(oklchToLinear(L, mid, h))) lo = mid; else hi = mid; }
    rgb = oklchToLinear(L, lo, h);
  }
  return rgb.map(enc); // gamma-encoded 0..1
}
const lum = srgb => { const [r, g, b] = srgb.map(dec); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
// Browsers blend CSS colours in gamma-encoded sRGB, so alpha layers are mixed there.
const over = (fg, a, bg) => fg.map((v, i) => v * a + bg[i] * (1 - a));
const hex = srgb => '#' + srgb.map(v => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('');

/* ── Ramp generation: the builder's hueRamp() (apps/docs/src/showcase/builder/language.ts + color.ts) ── */
const gInGamut = lch => oklchToLinear(...lch).every(v => v >= -0.0005 && v <= 1.0005);
function gamutMap(c) {
  if (gInGamut(c)) return c;
  let lo = 0, hi = c[1];
  for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (gInGamut([c[0], mid, c[2]])) lo = mid; else hi = mid; }
  return [c[0], lo, c[2]];
}
const lumOf = c => { const [r, g, b] = oklchToLinear(...gamutMap(c)).map(v => Math.min(1, Math.max(0, v))); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrastOf = (a, b) => { const x = lumOf(a), y = lumOf(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
/** Move lightness away from `bg` until `target` contrast is reached (chroma kept, gamut-mapped). */
function ensure(c, bg, target) {
  if (contrastOf(c, bg) >= target) return c;
  const dir = lumOf(bg) > 0.4 ? -1 : 1;
  let L = c[0];
  for (let i = 0; i < 200; i++) {
    L += dir * 0.005;
    if (L <= 0.02 || L >= 0.99) break;
    const cand = gamutMap([L, c[1], c[2]]);
    if (contrastOf(cand, bg) >= target) return cand;
  }
  return [L, c[1], c[2]];
}
/** Step 10: the solid's hover. */
const hoverOf = (solid, mode) => {
  const dl = mode === 'light' ? (solid[0] < 0.4 ? 0.12 : -0.05) : (solid[0] > 0.9 ? -0.08 : 0.05);
  return gamutMap([Math.min(0.97, Math.max(0.05, solid[0] + dl)), solid[1], solid[2]]);
};
/** A hued ramp for one mode, anchored so step 9 is the authored solid. */
function hueRamp(pick, mode, surface, textPick) {
  const { fixedL, chromaShare, textMin, textMargin } = T.rampRule;
  const solid = gamutMap(pick);
  const [L9, C9, H] = solid;
  const out = [];
  // A solid at or past step 5 (light warning L .905) squeezes the tints 2–5 between step 1 and the solid, so the ramp
  // still runs one way; otherwise 1–5 keep their fixed lightness and line up across hues.
  const squeeze = mode === 'light' ? L9 > fixedL[mode][4] - 0.04 : L9 < fixedL[mode][4] + 0.04;
  const tintL = i => (squeeze && i > 0 ? fixedL[mode][0] + (L9 - fixedL[mode][0]) * [0, 0.15, 0.3, 0.45, 0.6][i] : fixedL[mode][i]);
  for (let i = 0; i < 5; i++) out.push(gamutMap([tintL(i), C9 * chromaShare[mode][i], H]));
  // The ramp runs one way from the authored solid: steps 6–8 sit in order between step 5 and step 9. Step 6 keeps its
  // fixed lightness unless the solid is at or past it (a light solid such as danger L .82), then it moves between 5 and 9.
  const L5 = tintL(4), F6 = fixedL[mode][5];
  const L6 = (mode === 'light' ? F6 > L9 + 0.03 : F6 < L9 - 0.03) ? F6 : L5 + (L9 - L5) * 0.26;
  out.push(gamutMap([L6, C9 * chromaShare[mode][5], H]));
  out.push(gamutMap([L6 + (L9 - L6) * 0.4, C9 * chromaShare[mode][6], H]));
  // Step 8 follows the solid too (owner 2026-10-26): it is no longer pushed to 3:1, which made it darker than 9.
  out.push(gamutMap([L6 + (L9 - L6) * 0.7, C9 * chromaShare[mode][7], H]));
  out.push(solid);
  out.push(hoverOf(solid, mode));
  const hover = out[9];
  // An authored text step (solids[name].text[mode]) replaces the derived one as is: it is not fitted, so the rounding
  // margin below does not move it (design over contrast). The contrast rules check it at textMin like a derived step,
  // and a pass inside the margin is reported (see the check below).
  if (textPick) { out.push(gamutMap(textPick)); return out; }
  let text = gamutMap([mode === 'light' ? Math.max(0.05, Math.min(L9, hover[0]) - 0.04) : Math.min(0.97, Math.max(L9, hover[0]) + 0.04), C9, H]);
  // Fit text a little above the floor: emitted L/C are rounded and browsers quantise to 8 bits, so a pair fitted
  // exactly at 4.5 can render at 4.48 (light warning text on soft-pressed did). The contrast rules still check 4.5.
  for (const bg of [surface, out[2], out[3], out[4]]) text = ensure(text, bg, textMin + textMargin);
  out.push(gamutMap(text));
  return out;
}

/* ── Ramps ── RAMP[name][mode] = 11 × [L, C, h] (as emitted: L and C at 4 decimals, chroma floored into gamut) */
const r4 = n => +n.toFixed(4);
const emitLch = ([L, C, h]) => [r4(L), Math.floor(C * 1e4) / 1e4, r4(h)];
const RAMP = { neutral: Object.fromEntries(MODES.map(m => [m, T.neutral[m].map(step => [...step])])) };
const parse = spec => {
  if (spec.startsWith('=')) return { ref: spec.slice(1), alpha: 1 };
  const [refPart, a] = spec.split('/');
  const dot = refPart.lastIndexOf('.');
  const [ramp, step] = dot < 0 ? [refPart, ''] : [refPart.slice(0, dot), refPart.slice(dot + 1)];
  return { ramp, step, alpha: a === undefined ? 1 : +a };
};
// surface.base of each mode anchors the ramp rule (graphic 3:1 and text 4.5:1 are measured on it)
const SURFACE = Object.fromEntries(MODES.map(m => {
  const { ramp, step } = parse(T.themes[m]['surface.base']);
  if (ramp !== 'neutral') throw new Error('surface.base must read the neutral ramp');
  return [m, RAMP.neutral[m][step - 1]];
}));
for (const [name, s] of Object.entries(T.solids)) RAMP[name] = Object.fromEntries(MODES.map(m => [m, hueRamp(s[m], m, SURFACE[m], s.text?.[m]).map(emitLch)]));
// Labels on fills read the light ramp's two ends in both modes, so a label never picks up hue.
const INK = RAMP.neutral.light[10], PAPER = RAMP.neutral.light[0];
const ON = Object.fromEntries(Object.keys(RAMP).map(name => [name, Object.fromEntries(MODES.map(m => {
  const solid = RAMP[name][m][8];
  return [m, contrastOf(INK, solid) >= contrastOf(PAPER, solid) ? INK : PAPER];
}))]));
const ON_NAME = (name, m) => (ON[name][m] === INK ? 'neutral-light.11' : 'neutral-light.1');
const RAMP_NAMES = Object.keys(RAMP);

/* ── Primitive lookup ── */
function rampOf(ramp, mode) {
  for (const m of MODES) if (ramp.endsWith(`-${m}`) && RAMP[ramp.slice(0, -m.length - 1)]) return [ramp.slice(0, -m.length - 1), m];
  if (RAMP[ramp]) return [ramp, mode];
  throw new Error(`unknown ramp ${ramp}`);
}
function primitive(spec, mode) {
  const { ramp, step } = parse(spec);
  if (ramp === 'white') return [1, 0, 0];
  if (ramp === 'black') return [0, 0, 0];
  const [name, m] = rampOf(ramp, mode);
  if (step === 'on') return ON[name][m];
  const c = RAMP[name][m][+step - 1]; if (!c) throw new Error(`${spec} missing`);
  return c;
}
const oklch = ([L, C, h], alpha = 1) => `oklch(${r4(L)} ${r4(C)} ${r4(h)}${alpha < 1 ? ` / ${alpha}` : ''})`;
/** Follows "=" references to the final primitive spec. */
function finalSpec(theme, name, seen = []) {
  const spec = T.themes[theme][name];
  if (spec === undefined) throw new Error(`${theme}: unknown semantic color ${name}${seen.length ? ` (from ${seen.join(' → ')})` : ''}`);
  if (seen.includes(name)) throw new Error(`${theme}: reference cycle ${[...seen, name].join(' → ')}`);
  return spec.startsWith('=') ? finalSpec(theme, spec.slice(1), [...seen, name]) : spec;
}
function cssColor(theme, spec) {
  const p = parse(spec);
  if (p.ref) { finalSpec(theme, p.ref); return `var(--${P}-color-${kebab(p.ref)})`; }
  return oklch(primitive(spec, theme), p.alpha);
}
const kebab = s => String(s).replace(/\./g, '-');

// Every spec must resolve in both themes before anything is emitted.
for (const theme of MODES) for (const name of Object.keys(T.themes[theme])) primitive(finalSpec(theme, name), theme);
for (const name of Object.keys(T.themes.light)) if (!(name in T.themes.dark)) throw new Error(`dark is missing ${name}`);
for (const name of Object.keys(T.themes.dark)) if (!(name in T.themes.light)) throw new Error(`light is missing ${name}`);

/* ── Contrast validation ── */
function resolveRgb(theme, name) {
  const spec = name in T.themes[theme] ? finalSpec(theme, name) : name;
  const { alpha } = parse(spec);
  return { rgb: toSrgb(...primitive(spec, theme)), alpha };
}
function layer(theme, expr) {
  const parts = expr.split('@');
  const base = resolveRgb(theme, parts[parts.length - 1]);
  let rgb = base.alpha < 1 ? over(base.rgb, base.alpha, resolveRgb(theme, 'bg.app').rgb) : base.rgb;
  for (let i = parts.length - 2; i >= 0; i--) { const top = resolveRgb(theme, parts[i]); rgb = over(top.rgb, top.alpha, rgb); }
  return rgb;
}
/* Surface-relative opaque fills (owner 2026-10-26: no translucent backgrounds). The neutral interaction fills are
   authored as alpha in tokens.mjs, but never painted as alpha: each is emitted as the opaque colour it makes over a
   surface. Per theme, --<fill>--on-<surface> holds that composite; the fill token itself defaults to the composite over
   bg.app, and an element carrying a surface background class re-points the fill tokens at its own surface (SURFACE_RULE
   below), so a hover inside a raised card is the hover-over-raised colour, opaque. */
const FILLS = ['neutral.hover', 'neutral.pressed', 'neutral.selected', 'neutral.selected-hover', 'neutral.track', 'neutral.well', 'bg.inset'];
const UNDER = {
  'bg.app': ['bg-bg-app'], 'bg.canvas': ['bg-bg-canvas'],
  'surface.base': ['bg-surface-base', 'cs-solid'], 'surface.raised': ['bg-surface-raised'],
  'surface.translucent': ['bg-surface-translucent'], 'surface.raised-translucent': ['bg-surface-raised-translucent'],
  'material.regular': ['bg-material-regular', 'glass', 'cs-glass'], 'material.thin': ['bg-material-thin', 'glass-thin', 'cs-thin'],
  'material.thick': ['bg-material-thick', 'glass-thick', 'cs-thick'], 'material.ultrathin': ['bg-material-ultrathin', 'glass-ultrathin', 'cs-ultrathin'],
  'control.raised': ['bg-control-raised'],
  // the inverted selected item (the selected utility re-points the fills itself; no static class)
  'selection.fill': [],
};
const fillAliases = f => Object.entries(T.aliases).filter(([, to]) => to === f).map(([from]) => from);
const onVar = (f, u) => `${P}-color-${kebab(f)}--on-${kebab(u)}`;
// Over the inverted selection the fill direction flips too: it reads the dark theme's fill (paper alpha) on the ink.
const opaqueOver = (theme, f, u) => {
  const rgb = u === 'selection.fill' ? (fd => over(fd.rgb, fd.alpha, layer(theme, u)))(resolveRgb('dark', f)) : layer(theme, `${f}@${u}`);
  const [r, g, b] = rgb.map(x => Math.round(Math.min(1, Math.max(0, x)) * 255)); return `rgb(${r} ${g} ${b})`;
};

// A derived text step is fitted to textMin + textMargin; an authored one is not (design over contrast), so a pass inside
// that margin can render just under textMin once browsers quantise to 8 bits. It is reported, never failing.
const authoredTextStep = (theme, fg) => {
  if (!(fg in T.themes[theme])) return false;
  const { ramp, step } = parse(finalSpec(theme, fg));
  if (ramp === 'white' || ramp === 'black' || +step !== T.slotSteps.text) return false;
  const [name, m] = rampOf(ramp, theme);
  return Boolean(T.solids[name]?.text?.[m]);
};
const results = [];
let failures = 0;
for (const theme of MODES) {
  for (const [fg, bg, min, note, level] of T.contrastRules) {
    let worst = Infinity;
    for (const mode of ['map', 'clip']) {
      GAMUT = mode;
      const bgRgb = layer(theme, bg);
      const f = resolveRgb(theme, fg);
      const fgRgb = f.alpha < 1 ? over(f.rgb, f.alpha, bgRgb) : f.rgb;
      worst = Math.min(worst, ratio(fgRgb, bgRgb));
    }
    GAMUT = 'map';
    // level 'warn': a design-over-contrast pair the owner chose; reported, never failing. 'warn:<mode>[,<mode>]' waives
    // only those modes (an authored text step is the owner's colour only in the modes it is authored for).
    const warn = level === 'warn' || (typeof level === 'string' && level.startsWith('warn:') && level.slice(5).split(',').includes(theme));
    const pass = worst >= min;
    if (!pass && !warn) failures++;
    const margin = pass && worst < min + T.rampRule.textMargin && authoredTextStep(theme, fg);
    results.push({ theme, fg, bg, min, ratio: +worst.toFixed(2), pass, warn, margin, note, sweep: false, worstHue: null });
  }
}

/* ── Report ── */
const pad = (s, n) => String(s).padEnd(n);
for (const r of results.filter(r => !r.pass || r.margin || process.argv.includes('--verbose')))
  console.log(`${r.margin || (!r.pass && r.warn) ? 'WARN' : r.pass ? 'ok  ' : 'FAIL'} ${pad(r.theme, 6)} ${pad(r.fg, 22)} on ${pad(r.bg, 34)} ${r.ratio.toFixed(2).padStart(6)} ≥ ${r.min}${r.margin ? ` (authored text inside the ${T.rampRule.textMargin} margin)` : ''}`);
console.log(`contrast: ${results.length - failures}/${results.length} rules pass (${results.filter(r => (r.warn && !r.pass) || r.margin).length} design-over-contrast warnings) across ${MODES.length} themes (${RAMP_NAMES.length} ramps per mode, ${Object.keys(T.themes.light).length} semantic colors)`);
if (failures) { console.error(`${failures} contrast rule(s) failed.`); process.exit(1); }
if (checkOnly) process.exit(0);

/* ── Motion ── a spring is a CSS linear() curve and a settle time, so `ease-spring duration-spring` always pair. */
const LOOPS = new Set(['spin', 'indeterminate', 'orb', 'shimmer', 'slide', 'scan', 'agent']);
const UI_DURATIONS = Object.keys(T.motion.duration).filter(k => !LOOPS.has(k));
/** A damped spring (mass 1, ω0 = √stiffness, ζ = damping) from rest to a unit step: its linear() easing and settle time. */
function springCurve({ stiffness, damping: z }) {
  const w = Math.sqrt(stiffness);
  const x = t => {
    if (z < 1) { const wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t)); }
    if (z === 1) return 1 - Math.exp(-w * t) * (1 + w * t);
    const wr = w * Math.sqrt(z * z - 1); return 1 - Math.exp(-z * w * t) * (Math.cosh(wr * t) + (z * w / wr) * Math.sinh(wr * t));
  };
  // Settle: the first ms after which |x - 1| stays under 0.005, rounded up to 10 ms.
  let last = 0;
  for (let ms = 0; ms <= 10000; ms++) if (Math.abs(x(ms / 1000) - 1) >= 0.005) last = ms;
  const settle = Math.ceil((last + 1) / 10) * 10;
  const N = 40;
  const pts = Array.from({ length: N + 1 }, (_, i) => (i === N ? 1 : +x((i * settle) / N / 1000).toFixed(4)));
  return { ms: settle, easing: `linear(${pts.join(', ')})`, points: pts.length };
}
const SPRINGS = Object.fromEntries(Object.entries(T.motion.spring).map(([k, s]) => [k, springCurve(s)]));
for (const [k, s] of Object.entries(SPRINGS)) console.log(`spring ${k}: settle ${s.ms} ms, linear() ${s.points} points, ${s.easing.length} chars`);

/* ── Emit CSS ── */
const v = (name, value) => `  --${P}-${name}: ${value};`;
const root = [];
root.push(`  /* ${T.meta.name} ${T.meta.version} — generated by packages/tokens/src/build.mjs. Do not edit. */`);
for (const name of RAMP_NAMES) {
  const label = name === 'neutral' ? T.neutral.name : T.solids[name].name;
  for (const m of MODES) {
    root.push('', `  /* primitives: ${name}-${m} (${label}${name === 'neutral' ? '' : `, solid = step 9`}) */`);
    RAMP[name][m].forEach((c, i) => root.push(v(`${name}-${m}-${i + 1}`, oklch(c))));
  }
}
const stop = i => `var(--${P}-color-agent-stop-${i})`;
root.push(v('spectrum-conic', `conic-gradient(from var(--${P}-spin, 0deg), ${stop(1)}, ${stop(2)}, ${stop(3)}, ${stop(1)})`));
root.push(v('spectrum-linear', `linear-gradient(90deg, ${stop(1)}, ${stop(2)}, ${stop(3)}, ${stop(1)})`));

root.push('', '  /* space */');
for (const [k, px] of Object.entries(T.space)) root.push(v(`space-${String(k).replace('.', '_')}`, `${px}px`));
root.push('', '  /* inset (container padding) */');
for (const [k, [y, x]] of Object.entries(T.inset)) { root.push(v(`inset-${k}`, `${y}px ${x}px`)); root.push(v(`inset-${k}-y`, `${y}px`)); root.push(v(`inset-${k}-x`, `${x}px`)); }
root.push('', '  /* radius */');
for (const [k, px] of Object.entries(T.radius)) root.push(v(`radius-${k}`, `${px}px`));
root.push('', '  /* size */');
for (const [k, px] of Object.entries(T.size.control)) root.push(v(`control-${k}`, `${px}px`));
for (const [k, px] of Object.entries(T.size.field)) root.push(v(`field-${k}`, `${px}px`));
// The compact steps also exist as fixed sizes (they do not follow density): a 22px badge is 22px everywhere.
for (const [k, px] of Object.entries(T.size['control-compact'])) root.push(v(`control-compact-${k}`, `${px}px`));
for (const [k, px] of Object.entries(T.size['field-compact'])) root.push(v(`field-compact-${k}`, `${px}px`));
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
for (const [k, s] of Object.entries(SPRINGS)) root.push(v(`duration-${k}`, `${s.ms}ms`));
for (const [k, e] of Object.entries(T.motion.easing)) root.push(v(`ease-${k}`, e));
for (const [k, s] of Object.entries(SPRINGS)) root.push(v(`ease-${k}`, s.easing));
for (const [k, n] of Object.entries(T.motion.scale)) root.push(v(`scale-${k}`, n));
for (const [k, px] of Object.entries(T.motion.shift)) root.push(v(`shift-${k}`, `${px}px`));
root.push(v('stagger', `${T.motion.stagger.step}ms`));
for (const [k, o] of Object.entries(T.opacity)) root.push(v(`opacity-${k}`, o));
for (const [k, n] of Object.entries(T.z)) root.push(v(`z-${k}`, n));
root.push('', '  /* studio shell */');
for (const [k, px] of Object.entries(T.studio)) root.push(v(`studio-${k}`, `${px}px`));

const themeBlock = theme => {
  const out = [];
  out.push(`  /* primitives: the ${theme} ramps under mode-following names (--${P}-<ramp>-<step>) */`);
  for (const name of RAMP_NAMES) for (const s of T.rampSteps) out.push(v(`${name}-${s}`, `var(--${P}-${name}-${theme}-${s})`));
  out.push('  /* legacy primitive names, for data swatches in fixtures only */');
  for (const [legacy, name] of Object.entries(T.legacyRamps)) for (const s of T.rampSteps) out.push(v(`${legacy}-${s}`, `var(--${P}-${name}-${theme}-${s})`));
  out.push('  /* agent spectrum (the agent.stop-* tokens) */');
  for (const i of [1, 2, 3]) out.push(v(`spectrum-${i}`, `var(--${P}-color-agent-stop-${i})`));
  out.push(`  /* semantic: ${theme} */`);
  for (const [name, spec] of Object.entries(T.themes[theme])) out.push(v(`color-${kebab(name)}`, FILLS.includes(name) ? `var(--${onVar(name, 'bg.app')})` : cssColor(theme, spec)));
  out.push('  /* opaque interaction fills over each surface (see FILLS) */');
  for (const f of FILLS) for (const u of Object.keys(UNDER)) out.push(`  --${onVar(f, u)}: ${opaqueOver(theme, f, u)};`);
  for (const [k, s] of Object.entries(T.elevation[theme])) out.push(v(`elevation-${k}`, s));
  // A focused text field keeps its resting border.default hairline; the fill change (neutral.well on a white field,
  // surface.base on a grey one) is the focus cue (owner 2026-10-28, field/input proposal 2: no black 1.5px edge).
  out.push(v('focus-field', `inset 0 0 0 0.5px var(--${P}-color-border-default)`));
  out.push(v('focus', `0 0 0 1px var(--${P}-color-focus-offset), 0 0 0 3px var(--${P}-color-focus-ring)`));
  return out.join('\n');
};


// Corner smoothing: progressive enhancement. Where CSS corner-shape exists (Chromium 139+), base.css turns
// rounded corners into squircles. A squircle corner bulges toward the box corner, so it reads smaller than a
// circular arc of the same radius; the radius tokens are scaled up by corner-scale to compensate.
// Browsers without corner-shape (Safari, Firefox) keep circular corners at the nominal radius.
const CORNER_SCALE = 1.2;
const cornerScaled = [
  ...Object.entries(T.radius).filter(([k]) => k !== 'none' && k !== 'full').map(([k, px]) => v(`radius-${k}`, `calc(${px}px * var(--${P}-corner-scale))`)),
  ...Object.entries(T.studio).filter(([k]) => k.includes('radius')).map(([k, px]) => v(`studio-${k}`, `calc(${px}px * var(--${P}-corner-scale))`)),
].join('\n');

// Korean tracking per role: mono keeps its grid, `except` wins, otherwise the first size step the role reaches.
const hangulTracking = ([fam, sz, , , tr], k) => {
  if (fam === 'mono') return tr;
  if (k in T.hangul.except) return T.hangul.except[k];
  return T.hangul.tracking.find(([from]) => sz >= from)[1];
};
const trackingDecls = fn => Object.entries(T.type).flatMap(([k, t]) => [v(`text-${k}-tracking`, `${fn(t, k)}em`), `  --text-${k}--letter-spacing: var(--${P}-text-${k}-tracking);`]).join('\n');
// Korean weight per role (hangul.heavier): ui roles at or above `from` px swap weight; returns the default weight otherwise.
const hangulWeight = ([fam, sz, , w]) => (fam === 'ui' && sz >= T.hangul.heavier.from && T.hangul.heavier.weights[w]) || w;
// Roles whose weight differs between the two blocks re-declare the font shorthand and the Tailwind weight twin.
const weightDecls = fn => Object.entries(T.type).filter(([, t]) => hangulWeight(t) !== t[3]).flatMap(([k, t]) => {
  const [fam, sz, lh] = t;
  return [v(`text-${k}`, `${fn(t)} ${sz}px/${lh}px var(--${P}-font-${fam})`), `  --text-${k}--font-weight: ${fn(t)};`];
}).join('\n');
const fillDecls = u => FILLS.flatMap(f => [f, ...fillAliases(f)].flatMap(name => [`--${P}-color-${kebab(name)}`, `--color-${kebab(name)}`].map(k => `  ${k}: var(--${onVar(f, u)});`)));
const SURFACE_RULE = Object.entries(UNDER).filter(([, classes]) => classes.length).map(([u, classes]) => {
  const decl = FILLS.flatMap(f => [f, ...fillAliases(f)].flatMap(name => [`--${P}-color-${kebab(name)}`, `--color-${kebab(name)}`].map(k => `  ${k}: var(--${onVar(f, u)});`)));
  return `:where(${classes.map(c => `[class~="${c}"]`).join(', ')}) {\n${decl.join('\n')}\n}`;
}).join('\n');

const css = `/* ${T.meta.name} foundation ${T.meta.version} — tokens. Generated; edit foundation/tokens.mjs. */
@property --${P}-spin { syntax: '<angle>'; inherits: true; initial-value: 0deg; }
@property --${P}-progress { syntax: '<percentage>'; inherits: false; initial-value: 0%; }

:root {
  color-scheme: light;
${root.join('\n')}

  /* semantic: light */
${themeBlock('light')}
}

@supports (corner-shape: squircle) {
  :root {
${v('corner-scale', CORNER_SCALE)}
${cornerScaled}
  }
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

/* Korean tracking (tokens.mjs hangul, DP-11). Attribute selectors, so only the elements that carry lang declare these:
   the Korean block on a ko root or subtree, the Latin block on any other lang subtree (an en island inside a ko page).
   Both the --cs- tracking and its Tailwind twin are re-declared, because a custom property inherits its resolved value. */
:where([lang|="${T.hangul.lang}"]) {
${trackingDecls(hangulTracking)}
${weightDecls(hangulWeight)}
}
:where([lang]:not([lang|="${T.hangul.lang}"])) {
${trackingDecls(([, , , , tr]) => tr)}
${weightDecls(([, , , w]) => w)}
}

/* Surface-relative opaque fills: a surface re-points the interaction fills (and their aliases and the Tailwind
   --color-* twins) at the composite over itself. Static surface classes only; zero specificity. */
${SURFACE_RULE}
`;


/* ── Emit DTCG JSON ── */
const dtcgColor = ([L, C, h], alpha = 1) => ({ colorSpace: 'oklch', components: [L, C, h], alpha, hex: hex(toSrgb(L, C, h)) });
const core = { $description: `${T.meta.name} ${T.meta.version} primitives: one 1–11 ramp per colour per mode`, color: {} };
for (const name of RAMP_NAMES) for (const m of MODES) {
  const key = `${name}-${m}`;
  core.color[key] = { $description: name === 'neutral' ? `${T.neutral.name} neutral, ${m}` : `${T.solids[name].name} — ${T.solids[name].role}, ${m} (step 9 is the authored solid)` };
  RAMP[name][m].forEach((c, i) => { core.color[key][i + 1] = { $type: 'color', $value: dtcgColor(c) }; });
}
core.space = Object.fromEntries(Object.entries(T.space).map(([k, px]) => [k, { $type: 'dimension', $value: { value: px, unit: 'px' } }]));
core.inset = Object.fromEntries(Object.entries(T.inset).map(([k, [y, x]]) => [k, { $type: 'dimension', $description: `block ${y}px, inline ${x}px`, $value: { value: y, unit: 'px' }, $extensions: { 'cs.inline': { value: x, unit: 'px' } } }]));
core.radius = Object.fromEntries(Object.entries(T.radius).map(([k, px]) => [k, { $type: 'dimension', $value: { value: px, unit: 'px' } }]));
core.size = { control: Object.fromEntries(Object.entries(T.size.control).map(([k, px]) => [k, { $type: 'dimension', $value: { value: px, unit: 'px' } }])), icon: Object.fromEntries(Object.entries(T.size.icon).map(([k, px]) => [k, { $type: 'dimension', $value: { value: px, unit: 'px' } }])) };
core.font = { family: Object.fromEntries(Object.entries(T.font).map(([k, f]) => [k, { $type: 'fontFamily', $value: f.split(',').map(s => s.trim().replace(/"/g, '')) }])) };
core.typography = Object.fromEntries(Object.entries(T.type).map(([k, [fam, sz, lh, w, tr]]) => [k, { $type: 'typography', $value: { fontFamily: `{font.family.${fam}}`, fontSize: { value: sz, unit: 'px' }, lineHeight: lh / sz, fontWeight: w, letterSpacing: { value: tr, unit: 'em' } } }]));
core.duration = Object.fromEntries(Object.entries(T.motion.duration).map(([k, ms]) => [k, { $type: 'duration', $value: { value: ms, unit: 'ms' } }]));
core.blur = Object.fromEntries(Object.entries(T.blur).map(([k, px]) => [k, { $type: 'dimension', $value: { value: px, unit: 'px' } }]));

/** DTCG reference for a primitive spec in a theme: {color.<ramp>-<mode>.<step>} or an inline value with alpha. */
function dtcgRef(theme, spec) {
  const p = parse(spec);
  if (p.ref) return `{${p.ref}}`;
  if (p.ramp === 'white' || p.ramp === 'black') return { colorSpace: 'oklch', components: [p.ramp === 'white' ? 1 : 0, 0, 0], alpha: p.alpha };
  const [name, m] = rampOf(p.ramp, theme);
  const ref = p.step === 'on' ? parse(ON_NAME(name, m)) : { ramp: `${name}-${m}`, step: p.step };
  const [rn, rm] = rampOf(ref.ramp, theme);
  const key = `${rn}-${rm}`;
  return p.alpha < 1 ? { ...core.color[key][ref.step].$value, alpha: p.alpha } : `{color.${key}.${ref.step}}`;
}
const semantic = theme => {
  const out = { $description: `${T.meta.name} ${T.meta.version} semantic tokens — ${theme}` };
  for (const [name, spec] of Object.entries(T.themes[theme])) {
    const [group, key] = name.split('.');
    out[group] ??= {};
    out[group][key] = { $type: 'color', $value: dtcgRef(theme, spec) };
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
  const report = { version: T.meta.version, hueSweep: [], results };
  writeFileSync(join(dist, 'contrast.json'), JSON.stringify(report, null, 2));
  writeFileSync(join(dist, 'contrast.js'), `window.CS_CONTRAST = ${JSON.stringify(report)};\n`);
  const { meta, rampSteps, rampRule, solids, neutral, slotSteps, tones, aliases, themes, space, inset, radius, size, font, fontHref, fontFaces, hangul, type, elevation, blur, motion, opacity, z, breakpoint, studio } = T;
  const resolved = {};
  for (const theme of MODES) {
    resolved[theme] = {};
    for (const name of Object.keys(themes[theme])) {
      const spec = finalSpec(theme, name);
      resolved[theme][name] = { hex: hex(toSrgb(...primitive(spec, theme))), alpha: parse(spec).alpha };
    }
  }
  // Generated ramps, as emitted. `hues` / `primitiveHex` keep the shape the docs foundation page reads
  // (primitiveHex is the light ramp; the swatches use the mode-following --cs-<ramp>-<step> variables).
  const ramps = Object.fromEntries(RAMP_NAMES.map(name => [name, {
    name: name === 'neutral' ? neutral.name : solids[name].name,
    light: RAMP[name].light, dark: RAMP[name].dark,
    hex: Object.fromEntries(MODES.map(m => [m, RAMP[name][m].map(c => hex(toSrgb(...c)))])),
    on: Object.fromEntries(MODES.map(m => [m, ON_NAME(name, m)])),
  }]));
  const hues = Object.fromEntries(Object.entries(solids).map(([k, s]) => [k, { name: s.name, hue: s.light[2], live: false, role: s.role }]));
  const primitiveHex = Object.fromEntries(RAMP_NAMES.map(name => [name, Object.fromEntries(ramps[name].hex.light.map((h, i) => [i + 1, h]))]));
  const source = { meta, hueSteps: rampSteps, rampSteps, rampRule, solids, hues, neutral, ramps, slotSteps, tones, aliases, themes, resolved, primitiveHex, space, inset, radius, size, font, fontHref, fontFaces, hangul, type, elevation, blur, motion, opacity, z, breakpoint, studio };
  writeFileSync(join(dist, 'tokens.js'), `window.CS_TOKENS = ${JSON.stringify(source)};\n`);
  writeFileSync(join(dist, 'tokens.mjs'), `export default ${JSON.stringify({ ...source, contrastRules: T.contrastRules }, null, 2)};\n`);
  writeFileSync(join(dist, 'theme.css'), tailwindTheme());
  // fonts.css holds only self-hosted faces: no remote @import (an app must not call a third party at load). Apps that want the Google
  // faces put fontHref in a <link> themselves.
  const face = f => `@font-face {\n  font-family: "${f.family}";\n  src: url("${f.src}") format("${f.format}");\n  font-weight: ${f.weight};\n  font-style: normal;\n  font-display: swap;\n  unicode-range: ${f.unicodeRange};\n}\n`;
  writeFileSync(join(dist, 'fonts.css'), `/* ${T.meta.name} ${T.meta.version} — web fonts. Generated by packages/tokens/src/build.mjs. Do not edit. */\n\n${T.fontFaces.map(f => `/* ${f.version}, ${f.license} */\n${face(f)}`).join('\n')}`);
  writeFileSync(join(dist, 'allowlist.json'), JSON.stringify(allowlist(), null, 2));
  writeFileSync(join(dist, 'tw-merge.json'), JSON.stringify(twMergeScales(), null, 2));
  console.log('wrote dist/caustic.css, caustic.tokens.css, theme.css, fonts.css, allowlist.json, tw-merge.json, tokens.{core,light,dark}.json, tokens.{js,mjs}, contrast.{json,js}');
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
  for (const k of Object.keys(T.size['control-compact'])) add(`spacing-control-compact-${k}`, `var(--${P}-control-compact-${k})`);
  for (const k of Object.keys(T.size['field-compact'])) add(`spacing-field-compact-${k}`, `var(--${P}-field-compact-${k})`);
  for (const k of Object.keys(T.size.icon)) add(`spacing-icon-${k}`, `var(--${P}-icon-${k})`);
  for (const k of Object.keys(T.size.component)) add(`spacing-${k}`, `var(--${P}-size-${k})`);
  add('spacing-hit', `var(--${P}-hit-min)`);
  for (const k of Object.keys(T.studio)) if (!k.includes('radius')) add(`spacing-studio-${k}`, `var(--${P}-studio-${k})`);
  L.push('', '  /* typography */');
  for (const k of Object.keys(T.font)) add(`font-${k}`, `var(--${P}-font-${k})`);
  for (const [k, [, sz, lh, w, tr]] of Object.entries(T.type)) {
    add(`text-${k}`, `${sz}px`); add(`text-${k}--line-height`, `${lh}px`); add(`text-${k}--letter-spacing`, `var(--${P}-text-${k}-tracking)`); add(`text-${k}--font-weight`, `${w}`);
  }
  L.push('', '  /* depth, blur, motion */');
  for (const k of Object.keys(T.elevation.light)) add(`shadow-${k}`, `var(--${P}-elevation-${k})`);
  add('shadow-focus', `var(--${P}-focus)`); add('shadow-focus-field', `var(--${P}-focus-field)`);
  for (const k of Object.keys(T.blur)) add(`blur-${k}`, `var(--${P}-blur-${k})`);
  // Durations and curves for transitions; springs (move only) are named with the curves. Tailwind 4 reads duration-* from
  // --transition-duration-*, so the names must be spelt that way.
  for (const k of [...UI_DURATIONS, ...Object.keys(SPRINGS)]) add(`transition-duration-${k}`, `var(--${P}-duration-${k})`);
  for (const k of [...Object.keys(T.motion.easing), ...Object.keys(SPRINGS)]) add(`ease-${k}`, `var(--${P}-ease-${k})`);
  add('default-transition-duration', `var(--${P}-duration-swift)`); add('default-transition-timing-function', `var(--${P}-ease-out)`);
  for (const [k, px] of Object.entries(T.breakpoint)) add(`breakpoint-${k}`, `${px}px`);
  add('animate-agent', `cs-spin var(--${P}-duration-agent) linear infinite`);
  add('animate-orb', `cs-spin var(--${P}-duration-orb) linear infinite`);
  add('animate-shimmer', `cs-shimmer var(--${P}-duration-shimmer) linear infinite`);
  add('animate-spinner', `cs-rot var(--${P}-duration-spin) linear infinite`);
  add('animate-indeterminate', `cs-indet var(--${P}-duration-indeterminate) var(--${P}-ease-out) infinite`);
  add('animate-slide', `cs-slide var(--${P}-duration-slide) linear infinite`);
  // Agent scanning a region: a glow band sweeping down a 200%-tall gradient.
  add('animate-scan', `cs-scan var(--${P}-duration-scan) var(--${P}-ease-out) infinite`);
  // Presets (motion v2). Enter and exit take their offset and scale from the --cs-enter-* variables set by the modifiers.
  add('animate-enter', `cs-enter var(--${P}-duration-swift) var(--${P}-ease-out) backwards`);
  add('animate-exit', `cs-exit var(--${P}-duration-quick) var(--${P}-ease-out) both`);
  add('animate-enter-dialog', `cs-enter var(--${P}-duration-gentle) var(--${P}-ease-out) backwards`);
  add('animate-enter-panel', `cs-enter var(--${P}-duration-gentle) var(--${P}-ease-drawer) backwards`);
  add('animate-exit-panel', `cs-exit var(--${P}-duration-base) var(--${P}-ease-drawer) both`);
  add('animate-collapse-open', `cs-collapse-open var(--${P}-duration-base) var(--${P}-ease-out)`);
  add('animate-collapse-close', `cs-collapse-close var(--${P}-duration-base) var(--${P}-ease-out) forwards`);
  add('animate-rise', `cs-rise var(--${P}-duration-swift) var(--${P}-ease-out) backwards`);
  add('animate-pop', `cs-pop var(--${P}-duration-snappy) var(--${P}-ease-snappy) backwards`);
  L.push('  @keyframes cs-rot { to { transform: rotate(360deg); } }');
  L.push('  @keyframes cs-scan { from { background-position: 0 100%; } to { background-position: 0 -100%; } }');
  L.push('  @keyframes cs-indet { from { transform: translateX(-100%); } to { transform: translateX(300%); } }');
  L.push('  @keyframes cs-slide { to { background-position: -200% 0; } }');
  // Enter and exit move with transform, so they compose with the translate/scale properties (centring, press, lift).
  L.push(`  @keyframes cs-enter { from { opacity: 0; transform: translate(var(--${P}-enter-x, 0), var(--${P}-enter-y, 0)) scale(var(--${P}-enter-scale, 1)); } }`);
  L.push(`  @keyframes cs-exit { to { opacity: 0; transform: translate(var(--${P}-enter-x, 0), var(--${P}-enter-y, 0)) scale(var(--${P}-enter-scale, 1)); } }`);
  L.push(`  @keyframes cs-collapse-open { from { height: 0; padding-block: 0; opacity: 0; } to { height: var(--${P}-collapse-height, var(--radix-accordion-content-height, var(--radix-collapsible-content-height, auto))); } }`);
  L.push(`  @keyframes cs-collapse-close { from { height: var(--${P}-collapse-height, var(--radix-accordion-content-height, var(--radix-collapsible-content-height, auto))); } to { height: 0; padding-block: 0; opacity: 0; } }`);
  L.push(`  @keyframes cs-rise { from { opacity: 0; transform: translateY(var(--${P}-shift-enter)); } }`);
  L.push('  @keyframes cs-pop { from { opacity: 0; transform: scale(0.6); } }');
  L.push('}', '');
  L.push(`/* Caustic utilities: materials, agent signature, focus policy */
@utility glass {
  /* Solid floating surface (name kept for spec compatibility): flat fill + one elevation shadow. No blur, no hairline, no specular. */
  position: relative;
  background: var(--${P}-material, var(--${P}-color-material-regular));
  box-shadow: var(--${P}-shadow, var(--${P}-elevation-3));
  /* Focus gaps and avatar rings inside take the material, not surface.base (F9). */
  --${P}-focus-offset: var(--${P}-material, var(--${P}-color-material-regular));
}
@utility glass-ultrathin { --${P}-material: var(--${P}-color-material-ultrathin); }
@utility glass-thin { --${P}-material: var(--${P}-color-material-thin); }
@utility glass-thick { --${P}-material: var(--${P}-color-material-thick); }
@utility glass-shadow-* { --${P}-shadow: --value(--shadow-*); }
/* The rim is the host's own outer 1.5px (inset 0, same radius and corner shape), so it stays concentric with the fill. */
@utility agent-rim {
  position: relative;
  &::after { content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1.5px; pointer-events: none;
    background: var(--${P}-spectrum-conic);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor;
    mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
    animation: cs-spin var(--${P}-duration-agent) linear infinite; }
}
/* A selected item (owner 2026-10-26, proposal B): the ink fill with paper text, no edge. Descendants invert with it:
   text roles, the accent pair (a check box or tick inside reads paper on ink) and the control border are re-pointed,
   in both the --${P}-color-* and the Tailwind --color-* names. */
@utility selected {
  background-color: var(--${P}-color-selection-fill); background-image: none; color: var(--${P}-color-selection-on);
  --${P}-focus-offset: var(--${P}-color-selection-fill);
${[['text-primary', 'selection-on'], ['text-secondary', 'selection-on-secondary'], ['text-tertiary', 'selection-on-tertiary']]
  .flatMap(([k, to]) => [`  --${P}-color-${k}: var(--${P}-color-${to});`, `  --color-${k}: var(--${P}-color-${to});`]).join('\n')}
  /* controls inside (checks, ticks, boxes) read the Tailwind twins; the raw --${P}-color-* stay, so a swatch that shows a
     token's colour as content keeps the real colour */
${[['accent-text', 'selection-on'], ['accent-solid', 'selection-on'], ['accent-on', 'selection-fill'], ['border-control', 'selection-on-secondary'],
  ['surface-base', 'selection-fill']]
  .map(([k, to]) => `  --color-${k}: var(--${P}-color-${to});`).join('\n')}
  /* fields and wells inside a selected item read the fills composited over the ink */
${fillDecls('selection.fill').join('\n')}
}
/* Line cell grid: each cell draws only its top and left line; the layer's clip trims the outer edge, so lines never double. */
@utility line-cell { box-shadow: inset 0 1px 0 0 var(--${P}-color-grid-line), inset 1px 0 0 0 var(--${P}-color-grid-line); }
/* An empty cell: -45 degree, 1px lines every 6px. */
@utility line-cell-hatch { background-image: repeating-linear-gradient(-45deg, var(--${P}-color-grid-hatch) 0 1px, transparent 1px 6px); }
/* A list row separator: 1px dots every 6px along the bottom edge. */
@utility dotted-rule { background-image: repeating-linear-gradient(90deg, var(--${P}-color-grid-line) 0 1px, transparent 1px 6px); background-size: 100% 1px; background-repeat: no-repeat; background-position: bottom; }
/* Page rails beside showcase content. */
@utility page-rails { box-shadow: -1px 0 0 0 var(--${P}-color-divider-rail), 1px 0 0 0 var(--${P}-color-divider-rail); }
@utility agent-glow { box-shadow: 0 8px 30px -6px var(--${P}-color-agent-glow); }
@utility orb {
  --orb: 14px; --orb-hole: 3.4px;
  width: var(--orb); height: var(--orb); border-radius: var(--${P}-radius-full); flex: none; background: var(--${P}-spectrum-conic); animation: cs-spin var(--${P}-duration-orb) linear infinite;
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
/* Motion presets. Scale and translate are their own properties in Tailwind 4, so a transition list names them (or uses
   transition-control). press and lift only move when the user allows motion; reduced motion is global (base.css). */
/* Colour and opacity change on quick/out; scale and translate (press release, lift) settle on the spring, so a release
   eases back instead of snapping. press and press-sm take the press-in itself on swift/out (the transition of the state
   being entered applies). The lists follow the property order. */
@utility transition-control {
  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, box-shadow, opacity, scale, translate;
  transition-duration: var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-spring), var(--${P}-duration-spring);
  transition-timing-function: var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-spring), var(--${P}-ease-spring);
}
@utility press {
  @media (prefers-reduced-motion: no-preference) {
    &:active:not(:disabled, [aria-disabled="true"], [data-disabled], :has(:is(button, a, input, [role="button"]):active)) { scale: var(--${P}-scale-press); }
    &:is(.transition-control):active { transition-duration: var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-swift), var(--${P}-duration-spring); transition-timing-function: var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-spring); }
  }
}
@utility press-sm {
  @media (prefers-reduced-motion: no-preference) {
    &:active:not(:disabled, [aria-disabled="true"], [data-disabled], :has(:is(button, a, input, [role="button"]):active)) { scale: var(--${P}-scale-press-sm); }
    &:is(.transition-control):active { transition-duration: var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-quick), var(--${P}-duration-swift), var(--${P}-duration-spring); transition-timing-function: var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-out), var(--${P}-ease-spring); }
  }
}
@utility lift {
  @media (prefers-reduced-motion: no-preference) {
    &:hover:not(:disabled, [aria-disabled="true"]) { translate: 0 calc(var(--${P}-shift-lift) * -1); }
  }
}
@utility enter-scale { --${P}-enter-scale: var(--${P}-scale-enter); }
@utility enter-from-side {
  &[data-side=bottom] { --${P}-enter-y: calc(var(--${P}-shift-enter) * -1); }
  &[data-side=top] { --${P}-enter-y: var(--${P}-shift-enter); }
  &[data-side=left] { --${P}-enter-x: var(--${P}-shift-enter); }
  &[data-side=right] { --${P}-enter-x: calc(var(--${P}-shift-enter) * -1); }
}
@utility enter-up { --${P}-enter-y: var(--${P}-shift-enter); }
@utility enter-from-end { --${P}-enter-x: 100%; &:dir(rtl) { --${P}-enter-x: -100%; } }
@utility enter-from-start { --${P}-enter-x: -100%; &:dir(rtl) { --${P}-enter-x: 100%; } }
@utility enter-from-bottom { --${P}-enter-y: 100%; }
@utility stagger { animation-delay: calc(min(var(--${P}-stagger-index, 0), ${T.motion.stagger.max}) * var(--${P}-stagger)); }
/* Collapse without a Radix height variable: the content stays mounted, the grid row opens. */
@utility reveal {
  display: grid; grid-template-rows: 0fr;
  transition-property: grid-template-rows, opacity, visibility;
  transition-duration: var(--${P}-duration-base);
  transition-timing-function: var(--${P}-ease-out);
  opacity: 0; visibility: hidden;
  &:is([data-state=open], [data-open=true]) { grid-template-rows: 1fr; opacity: 1; visibility: visible; }
  & > * { min-height: 0; overflow: hidden; }
}
@utility spectrum-fill { background: var(--${P}-spectrum-conic); animation: cs-spin var(--${P}-duration-agent) linear infinite; }
@utility spectrum-line { background: var(--${P}-spectrum-linear); background-size: 200% 100%; }
@utility focus-ring { outline: none; box-shadow: 0 0 0 1px var(--${P}-focus-offset, var(--${P}-color-focus-offset)), 0 0 0 3px var(--${P}-color-focus-ring); }
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

// Numeric scales the gateway accepts for numeric utilities (p-3, z-40, opacity-42). Durations are named (durationNames).
function allowlist() {
  return {
    spacingSteps: Object.keys(T.space).map(Number),
    durations: Object.values(T.motion.duration),
    durationNames: [...UI_DURATIONS, ...Object.keys(T.motion.spring)],
    zIndex: Object.values(T.z),
    opacity: [0, 100, Math.round(T.opacity.disabled * 100), Math.round(T.opacity.muted * 100)],
    fontWeights: ['normal', 'medium', 'semibold'],
    arbitraryPx: ['0.5px', '1px', '1.5px', '2px'],
    semanticColors: Object.keys(T.themes.light).map(kebab),
    textRoles: Object.keys(T.type),
    radii: [...Object.keys(T.radius), 'window', 'panel', 'toolbar', 'toolbar-item', 'toast'],
  };
}
