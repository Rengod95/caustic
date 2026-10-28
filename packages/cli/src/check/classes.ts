// Class-string helpers: splitting variants, deciding whether a token looks like a Tailwind utility, and finding literal
// colours and lengths in arbitrary values and style values.
import { distance } from './text.ts';

/** Splits `hover:data-[state=open]:!bg-x` at top-level colons (not inside [] or ()). */
export function splitVariants(cls: string): { variants: string[]; utility: string; important: boolean } {
  const parts: string[] = [];
  let depth = 0, start = 0;
  for (let i = 0; i < cls.length; i++) {
    const ch = cls[i];
    if (ch === '[' || ch === '(') depth++;
    else if (ch === ']' || ch === ')') depth = Math.max(0, depth - 1);
    else if (ch === ':' && depth === 0) { parts.push(cls.slice(start, i)); start = i + 1; }
  }
  let utility = cls.slice(start);
  const important = utility.startsWith('!') || utility.endsWith('!');
  utility = utility.replace(/^!|!$/g, '');
  return { variants: parts, utility, important };
}

// Utility roots whose values come from the theme (or that people misspell), longest first so `min-w` beats `m`.
const PREFIXES = [
  'inset-shadow', 'drop-shadow', 'backdrop-blur', 'underline-offset', 'outline-offset', 'ring-offset', 'line-clamp',
  'grid-cols', 'grid-rows', 'col-span', 'row-span', 'col-start', 'col-end', 'row-start', 'row-end', 'auto-cols', 'auto-rows',
  'space-x', 'space-y', 'gap-x', 'gap-y', 'inset-x', 'inset-y', 'translate-x', 'translate-y', 'scale-x', 'scale-y',
  'min-w', 'min-h', 'max-w', 'max-h', 'scroll-m', 'scroll-p', 'text-shadow',
  'rounded-tl', 'rounded-tr', 'rounded-bl', 'rounded-br', 'rounded-ss', 'rounded-se', 'rounded-es', 'rounded-ee',
  'rounded-t', 'rounded-r', 'rounded-b', 'rounded-l', 'rounded-s', 'rounded-e',
  'border-t', 'border-r', 'border-b', 'border-l', 'border-x', 'border-y', 'border-s', 'border-e',
  'bg', 'text', 'border', 'rounded', 'shadow', 'ring', 'outline', 'divide', 'fill', 'stroke', 'from', 'via', 'to',
  'decoration', 'accent', 'caret', 'placeholder', 'font', 'leading', 'tracking', 'indent',
  'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'ps', 'pe', 'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'ms', 'me', 'gap',
  'w', 'h', 'size', 'inset', 'top', 'right', 'bottom', 'left', 'start', 'end', 'z', 'opacity', 'basis', 'order',
  'duration', 'delay', 'ease', 'animate', 'blur', 'rotate', 'scale', 'aspect', 'columns',
].sort((a, b) => b.length - a.length);

// Values Tailwind users write that the default theme has: palette names, the t-shirt scale and common keywords.
export const PALETTE = /^(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(-\d{2,3})?$/;
const KEYWORDS = new Set([
  'xs', 'sm', 'md', 'lg', 'xl', '2xs', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', 'base', 'full', 'auto', 'px',
  'screen', 'min', 'max', 'fit', 'none', 'inner', 'prose', 'svh', 'dvh', 'lvh', 'tight', 'tighter', 'snug', 'normal',
  'relaxed', 'loose', 'wide', 'wider', 'widest', 'thin', 'light', 'medium', 'semibold', 'bold', 'extrabold', 'black',
  'sans', 'serif', 'mono', 'linear', 'in', 'out', 'in-out', 'spin', 'ping', 'pulse', 'bounce', 'square', 'video',
  'transparent', 'current', 'inherit',
]);

/** The theme-dependent root of a utility (`text` for text-primary), or undefined for anything else. */
export function utilityRoot(utility: string): { root: string; value: string } | undefined {
  const bare = utility.replace(/^-/, '');
  for (const p of PREFIXES) if (bare.startsWith(p + '-') && bare.length > p.length + 1) return { root: p, value: bare.slice(p.length + 1) };
  return undefined;
}

// Theme namespaces a utility root reads its named values from.
const COLOR = ['color'];
const SPACE = ['spacing', 'container'];
const NAMESPACES: Record<string, string[]> = {
  bg: COLOR, border: COLOR, ring: COLOR, outline: COLOR, divide: COLOR, fill: COLOR, stroke: COLOR, from: COLOR, via: COLOR,
  to: COLOR, decoration: COLOR, accent: COLOR, caret: COLOR, placeholder: COLOR,
  text: ['color', 'text'], shadow: ['shadow', 'color'], 'inset-shadow': ['inset-shadow', 'color'], 'drop-shadow': ['drop-shadow', 'color'],
  'text-shadow': ['color'], rounded: ['radius'], font: ['font', 'font-weight'], leading: ['leading'], tracking: ['tracking'],
  ease: ['ease'], animate: ['animate'], blur: ['blur'], 'backdrop-blur': ['blur'], aspect: ['aspect'],
};
const namespacesOf = (root: string) =>
  NAMESPACES[root] ?? (/^(border|rounded)-/.test(root) ? NAMESPACES[root.split('-')[0]!]! : /^(z|opacity|duration|delay|order|columns|rotate|scale|line-clamp|grid-|col-|row-|auto-)/.test(root) ? [] : SPACE);

/**
 * Whether a class token is meant as a Tailwind utility. A consumer's own class names (card-title, top-bar, text-block)
 * must not be reported, so a token counts only when it has a variant colon, or a theme-dependent root followed by a
 * value Tailwind or the Caustic theme would use: a number, an arbitrary value, a palette colour, a scale keyword, or a
 * theme key of the root's namespace, whole or as its leading or trailing words (text-primary for text.text-primary,
 * bg-surface for surface-base), or one or two letters away from one (bg-surfase-base).
 */
export function looksLikeUtility(cls: string, vocabulary: Map<string, Set<string>>): boolean {
  if (!/^[!@a-z0-9[(-]/i.test(cls) || /[{}<>"'`;=]/.test(cls.replace(/\[.*?\]/g, ''))) return false;
  const { variants, utility } = splitVariants(cls);
  if (variants.length) return variants.every(v => v.length > 0) && utility.length > 0 && !/^https?$/.test(variants[0]!);
  const r = utilityRoot(utility);
  if (!r) return false;
  const value = r.value.replace(/\/[\w.[\]()-]+$/, '');
  if (/^-?\d|^\[|^\(|^\d+\/\d+$/.test(value)) return true;
  if (PALETTE.test(value) || KEYWORDS.has(value)) return true;
  for (const ns of namespacesOf(r.root)) for (const key of vocabulary.get(ns) ?? []) {
    if (key === value || key.endsWith('-' + value) || key.startsWith(value + '-')) return true;
    if (value.length >= 6 && Math.abs(key.length - value.length) <= 2 && distance(key, value) <= (value.length >= 9 ? 2 : 1)) return true;
  }
  return false;
}

/** The arbitrary value of a utility (`[...]`), or of an arbitrary property `[prop:value]`. */
export function arbitraryValue(utility: string): { value: string; property?: string } | undefined {
  const prop = utility.match(/^\[([a-z-]+):(.+)\]$/);
  if (prop) return { property: prop[1]!, value: prop[2]! };
  const m = utility.match(/-\[(.+)\]$/);
  return m ? { value: m[1]! } : undefined;
}

// CSS named colours (transparent, currentColor and the keywords are fine).
const NAMED = new Set(('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood ' +
  'cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen ' +
  'darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray ' +
  'darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia ' +
  'gainsboro ghostwhite gold goldenrod gray grey green greenyellow honeydew hotpink indianred indigo ivory khaki lavender ' +
  'lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink ' +
  'lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta ' +
  'maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise ' +
  'mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid ' +
  'palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red ' +
  'rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow ' +
  'springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen').split(' '));

const COLOR_FN = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\(/;
const HAIRLINES = new Set(['0.5px', '1px', '1.5px', '2px']);

/** Removes var(--cs-*) references (and var(--x) without a fallback), so only literal text remains. */
const stripVars = (v: string) => v.replace(/var\(--[a-zA-Z0-9-]+\)/g, ' ');

/** Literal colours and non-hairline px/rem lengths in a CSS value; `words` splits identifiers for named colours. */
export function literalsIn(value: string, opts: { namedColors: boolean }): string[] {
  const v = stripVars(value).replace(/_/g, ' ');
  const out: string[] = [];
  const fn = v.match(new RegExp(COLOR_FN.source, 'g'));
  if (fn) out.push(...fn.map(f => (f.startsWith('#') ? f : f + '…)')));
  for (const m of v.matchAll(/(^|[^\w.#-])(-?\d*\.?\d+)(px|rem)\b/g)) {
    const len = m[2]!.replace(/^-/, '') + m[3];
    if (Number(m[2]) === 0 || (m[3] === 'px' && HAIRLINES.has(len))) continue;
    out.push(m[2]! + m[3]);
  }
  if (opts.namedColors) for (const w of v.toLowerCase().split(/[^a-z]+/)) if (NAMED.has(w)) out.push(w);
  return [...new Set(out)];
}

/** Properties whose numeric React style values are lengths (React appends px). */
export const LENGTH_PROPS = new Set([
  'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 'top', 'right', 'bottom', 'left', 'inset',
  'insetInline', 'insetBlock', 'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'marginInline',
  'marginBlock', 'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'paddingInline', 'paddingBlock',
  'gap', 'rowGap', 'columnGap', 'fontSize', 'borderRadius', 'borderWidth', 'borderTopWidth', 'borderBottomWidth',
  'borderLeftWidth', 'borderRightWidth', 'letterSpacing', 'flexBasis', 'outlineWidth', 'outlineOffset',
]);
/** Style properties where a colour name is text, not a colour. */
export const NON_COLOR_PROPS = new Set(['content', 'fontFamily', 'gridTemplateAreas', 'gridArea', 'transitionProperty', 'animationName', 'willChange', 'viewTransitionName', 'anchorName', 'positionAnchor']);
