// Per-file analysis: parses consumer code with the TypeScript compiler API (no type checker, no rendering) and runs the
// rules over className strings, style objects, @caustic/react imports and the JSX that uses them.
import ts from 'typescript';
import type { Catalog, CatalogComponent, CatalogPart, CatalogProp } from '@caustic/catalog';
import { arbitraryValue, literalsIn, LENGTH_PROPS, looksLikeUtility, NON_COLOR_PROPS, splitVariants } from './classes.ts';
import { htmlAttributes, isPassThrough } from './html.ts';
import type { RuleId, Severity } from './rules.ts';
import { ruleById } from './rules.ts';
import { closest, oneLine } from './text.ts';
import type { Theme } from './theme.ts';

export type RawFinding = { rule: RuleId; severity: Severity; line: number; column: number; snippet: string; message: string; fix: string };

const PACKAGE = '@caustic/react';
// Where a literal length replaces a token (type, line height, tracking, radius, shadow): an error, not a layout warning.
const TOKENISED_ROOT = /^-?(text|leading|tracking|rounded(-[a-z]{1,2})?|shadow|inset-shadow|drop-shadow|text-shadow)$/;
const TOKENISED_PROPERTY = /^(font-size|line-height|letter-spacing|border(-[a-z]+)*-radius|box-shadow|text-shadow)$/;
const TOKENISED_STYLE = /^(fontSize|lineHeight|letterSpacing|border(\w*)Radius|boxShadow|textShadow)$/;
const CLASS_FNS = new Set(['cn', 'clsx', 'cx', 'classnames', 'classNames', 'twMerge', 'twJoin', 'cva', 'tv']);
// Exports of @caustic/react that are not components (utilities and hooks); the catalog lists components only.
const NON_COMPONENT_EXPORTS = new Set(['cn', 'useControllableState', 'useScrub', 'scrubValue']);

// ---- catalog index ----

export type CatalogIndex = {
  byExport: Map<string, CatalogComponent>;
  partByExport: Map<string, CatalogPart>;
  byName: Map<string, CatalogComponent>;
  allExports: Set<string>;
};

export function indexCatalog(catalog: Catalog): CatalogIndex {
  const byExport = new Map<string, CatalogComponent>();
  const partByExport = new Map<string, CatalogPart>();
  const byName = new Map<string, CatalogComponent>();
  for (const comp of Object.values(catalog.components)) {
    byName.set(comp.name, comp);
    for (const e of [comp.name, ...(comp.exports ?? [])]) if (!byExport.has(e)) byExport.set(e, comp);
    for (const p of comp.parts ?? []) partByExport.set(p.name, p);
  }
  return { byExport, partByExport, byName, allExports: new Set(byExport.keys()) };
}

// Raw elements a Caustic component covers, by component name (looked up in the catalog before suggesting).
const INPUT_TYPES: Record<string, string[]> = {
  checkbox: ['Checkbox'], radio: ['RadioGroup'], range: ['Slider'], number: ['NumberField', 'Input'],
  text: ['Input'], email: ['Input'], search: ['Input'], password: ['Input'], url: ['Input'], tel: ['Input'],
};
const RAW_TAGS: Record<string, string[]> = {
  button: ['Button', 'IconButton'], select: ['Select'], textarea: ['Textarea'], dialog: ['Dialog'], progress: ['Progress'],
};
const RAW_ROLES: Record<string, string[]> = { tab: ['Tabs'], switch: ['Switch'], dialog: ['Dialog'], menu: ['Menu'], tooltip: ['Tooltip'] };

// Deprecation marks on a catalog prop: `deprecated: true` for the prop, and deprecated values either as
// `deprecatedValues: string[]` or as `deprecated: string[]`; `replacement` / `replacements[value]` name the current form.
type Deprecatable = CatalogProp & { deprecated?: boolean | string[]; deprecatedValues?: string[]; replacement?: string; replacements?: Record<string, string> };
const deprecatedValues = (def: Deprecatable | undefined) =>
  new Set([...(def?.deprecatedValues ?? []), ...(Array.isArray(def?.deprecated) ? def.deprecated : [])]);
/** The current form: an explicit `replacement`, else the "Deprecated: use …" sentence of the description. */
const replacementOf = (def: Deprecatable) => def.replacement ?? def.description?.match(/^deprecated[:.]?\s*use\s+([^.]+)/i)?.[1]?.trim();

type Opening = ts.JsxOpeningElement | ts.JsxSelfClosingElement;
type Step = 'yes' | 'unknown' | 'nested' | 'skip';
type Ctx = 'yes' | 'no' | 'unknown';

export function analyzeFile(fileName: string, text: string, idx: CatalogIndex, theme: Theme | undefined, enabled: Set<RuleId>): RawFinding[] {
  const kind = /\.[jt]sx$/.test(fileName) ? ts.ScriptKind.TSX : /\.jsx?$|\.[mc]js$/.test(fileName) ? ts.ScriptKind.JSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, kind === ts.ScriptKind.JSX ? ts.ScriptKind.TSX : kind);
  const findings: RawFinding[] = [];
  const pos = (p: number) => { const lc = sf.getLineAndCharacterOfPosition(p); return { line: lc.line + 1, column: lc.character + 1 }; };
  const report = (rule: RuleId, at: number, snippet: string, message: string, fix: string, severity?: Severity) => {
    if (!enabled.has(rule)) return;
    findings.push({ rule, severity: severity ?? ruleById.get(rule)!.severity, ...pos(at), snippet: oneLine(snippet), message, fix });
  };

  // ---- imports from @caustic/react ----
  const locals = new Map<string, string>(); // local name → export name
  const namespaces = new Set<string>();
  let usesCaustic = false;
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st) || !ts.isStringLiteral(st.moduleSpecifier) || st.moduleSpecifier.text !== PACKAGE) continue;
    const clause = st.importClause;
    if (!clause || clause.isTypeOnly) continue;
    if (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings)) { namespaces.add(clause.namedBindings.name.text); usesCaustic = true; }
    if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      for (const el of clause.namedBindings.elements) {
        if (el.isTypeOnly) continue;
        usesCaustic = true;
        const imported = (el.propertyName ?? el.name).text;
        locals.set(el.name.text, imported);
        if (idx.allExports.has(imported) || NON_COMPONENT_EXPORTS.has(imported)) continue;
        const near = closest(imported, idx.allExports, 3);
        const fix = near.length ? `Did you mean ${near.join(', ')}? Run \`caustic find "<need>"\` to pick a component.` : 'Run `caustic list` or `caustic find "<need>"` to pick a component that exists.';
        // Lower-case names may be utilities (cardVariants …) the catalog does not list: advisory only.
        report('component-unknown', el.getStart(), el.getText(), `"${imported}" is not exported by @caustic/react.`, fix, /^[A-Z]/.test(imported) ? undefined : 'advisory');
      }
    }
  }

  const resolveTag = (tag: ts.JsxTagNameExpression): string | undefined => {
    if (ts.isIdentifier(tag)) return locals.get(tag.text);
    if (ts.isPropertyAccessExpression(tag) && ts.isIdentifier(tag.expression)) {
      const left = tag.expression.text, right = tag.name.text;
      if (namespaces.has(left)) return right;
      const base = locals.get(left);
      if (base && idx.allExports.has(base + right)) return base + right; // Card.Header → CardHeader
    }
    return undefined;
  };
  const isIntrinsic = (tag: ts.JsxTagNameExpression) => ts.isIdentifier(tag) && /^[a-z]/.test(tag.text);
  const tagText = (tag: ts.JsxTagNameExpression) => tag.getText(sf);

  // ---- local components (for walking up through them) ----
  const localFns = new Map<string, ts.Node>();
  const usagesOf = new Map<string, ts.Node[]>();
  const elementOf = (o: Opening): ts.Node => (ts.isJsxOpeningElement(o) ? o.parent : o);
  const scan = (n: ts.Node) => {
    if (ts.isFunctionDeclaration(n) && n.name) localFns.set(n.name.text, n);
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer) {
      let init: ts.Node = n.initializer;
      while (ts.isCallExpression(init) && init.arguments[0]) init = init.arguments[0]; // memo(forwardRef(fn))
      if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) localFns.set(n.name.text, init);
    }
    if ((ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) && ts.isIdentifier(n.tagName)) {
      const list = usagesOf.get(n.tagName.text) ?? [];
      list.push(elementOf(n));
      usagesOf.set(n.tagName.text, list);
    }
    ts.forEachChild(n, scan);
  };
  scan(sf);

  /** Name of the component a function defines (function X, const X = () =>, const X = memo(() =>)), else undefined. */
  const definedName = (fn: ts.Node): string | undefined => {
    if (ts.isFunctionDeclaration(fn)) return fn.name?.text;
    if (!ts.isArrowFunction(fn) && !ts.isFunctionExpression(fn)) return undefined;
    let p: ts.Node = fn.parent;
    while (ts.isCallExpression(p) || ts.isParenthesizedExpression(p)) p = p.parent;
    if (p !== fn.parent && !ts.isVariableDeclaration(p)) return undefined; // a callback (map, render prop): keep walking
    return ts.isVariableDeclaration(p) && ts.isIdentifier(p.name) ? p.name.text : undefined;
  };

  const rendersMatching = (fn: ts.Node, match: (exp: string | undefined) => boolean): boolean => {
    let found = false;
    const v = (n: ts.Node) => {
      if (found) return;
      if ((ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) && match(resolveTag(n.tagName))) { found = true; return; }
      ts.forEachChild(n, v);
    };
    v(fn);
    return found;
  };

  /**
   * Walks from a JSX element up its tree (through children, prop slots, callbacks such as map, and the in-file usages
   * of the local component that returns it) and asks `test` about each enclosing element.
   * 'yes' when a matching ancestor exists; 'no' when the tree is complete and has none; 'unknown' when the tree leaves
   * the file (an exported component returning it at its root, a variable, an imported wrapper component).
   */
  const contextOf = (start: ts.Node, test: (o: Opening) => Step, entryNested: Ctx, depth = 0, nestedIn = false, seen = new Set<string>()): Ctx => {
    let unknown = false, nested = nestedIn;
    let prev: ts.Node = start;
    for (let n: ts.Node | undefined = start.parent; n; prev = n, n = n.parent) {
      let o: Opening | undefined;
      if (ts.isJsxElement(n) && prev !== n.openingElement) o = n.openingElement;
      else if (ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) o = n; // reached through a prop slot
      if (o) {
        const r = test(o);
        if (r === 'yes') return 'yes';
        if (r === 'unknown') unknown = true;
        if (r === 'nested') nested = true;
        continue;
      }
      if (ts.isFunctionDeclaration(n) || ts.isArrowFunction(n) || ts.isFunctionExpression(n)) {
        const name = definedName(n);
        if (name === undefined) continue;
        if (!/^[A-Z]/.test(name) || unknown) return 'unknown';
        const uses = (usagesOf.get(name) ?? []).filter(u => !seen.has(name));
        if (!uses.length || depth >= 3) return nested ? entryNested : 'unknown';
        const next = new Set(seen).add(name);
        const results = uses.map(u => contextOf(u, test, entryNested, depth + 1, nested, next));
        if (results.includes('yes')) return 'yes';
        return results.every(r => r === 'no') ? 'no' : 'unknown';
      }
      if (ts.isVariableDeclaration(n) || ts.isSourceFile(n) || ts.isClassDeclaration(n)) return 'unknown';
    }
    return 'unknown';
  };

  /**
   * Test for compose-outside-parent: inside any export of the part's own component ('yes'). Another Caustic component
   * in between may compose the part on purpose (MessageCode in AgentRequestProse), so it makes the answer 'unknown';
   * plain elements and fragments are transparent.
   */
  const parentTest = (comp: CatalogComponent, allowed: Set<string>) => (o: Opening): Step => {
    const tag = o.tagName;
    if (isIntrinsic(tag)) return 'nested';
    const exp = resolveTag(tag);
    if (exp) return allowed.has(exp) ? 'yes' : 'unknown';
    const name = tagText(tag);
    if (name === 'Fragment' || name === 'React.Fragment') return 'skip';
    const local = ts.isIdentifier(tag) ? localFns.get(tag.text) : undefined;
    if (local) return rendersMatching(local, e => !!e && allowed.has(e)) ? 'yes' : 'nested';
    return 'unknown'; // a component from another file may render the parent
  };

  // ---- class strings ----
  const seenStrings = new Set<ts.Node>();
  /**
   * token-literal: a literal colour is an error. A literal length is a warning (page layout widths and grid tracks are
   * legitimate in a consumer's screen), except where tokens cover it: type, radius and shadow stay errors.
   */
  const reportLiterals = (lits: string[], tokenised: boolean, at: number, snippet: string, lead: string, fix: string) => {
    const lengths = lits.filter(l => /\d(px|rem)$/.test(l));
    const colours = lits.filter(l => !lengths.includes(l));
    if (colours.length) report('token-literal', at, snippet, `${lead} the colour ${colours.join(', ')}.`, fix);
    if (lengths.length) report('token-literal', at, snippet, `${lead} ${lengths.join(', ')}${tokenised ? ' where a token exists' : ''}.`, fix, tokenised ? 'error' : 'warning');
  };
  const checkClassToken = (cls: string, at: number) => {
    if (!cls || cls.length > 200) return;
    const { variants, utility } = splitVariants(cls);
    if (variants.includes('dark')) {
      report('token-dark-variant', at, cls, `"${cls}" uses the dark: variant.`, `Drop the dark: variant${variants.length > 1 || utility ? ` and keep "${[...variants.filter(v => v !== 'dark'), utility].join(':')}"` : ''}; the semantic tokens switch with the theme.`);
    }
    const arb = arbitraryValue(utility);
    if (arb && !(arb.property?.startsWith('--'))) {
      const root = utility.slice(0, utility.indexOf('-['));
      const textual = ['content', 'font', 'grid-areas', 'animate', 'transition'].includes(root) || (arb.property && /^(content|font-family|grid-template-areas|grid-area|transition-property|will-change)$/.test(arb.property));
      const lits = literalsIn(arb.value, { namedColors: !textual });
      const tokenised = arb.property ? TOKENISED_PROPERTY.test(arb.property) : TOKENISED_ROOT.test(root);
      reportLiterals(lits, tokenised, at, cls, `"${cls}" hard-codes`,
        'Use a token utility (bg-surface-base, text-ui-sm, rounded-xl, shadow-2 …) or var(--cs-*) inside the brackets. Only the hairlines 0.5px, 1px, 1.5px and 2px may be literal.');
    }
    if (theme && enabled.has('token-unknown-class') && looksLikeUtility(cls, theme.vocabulary)) {
      const v = theme.verdict(cls);
      if (v) {
        const near = theme.suggest(cls);
        if (v.kind === 'variant') {
          report('token-unknown-class', at, cls, `"${cls}": the Caustic theme has no ${v.variant ? `"${v.variant}:"` : 'such'} variant.`,
            (near.length ? `Nearest variants: ${near.join(', ')}. ` : '') + (/^(sm|md|lg|xl|\d?xl|min|max)(-|$)/.test(v.variant ?? '')
              ? 'The theme has no viewport breakpoints; size with container queries (@container on a parent, then @min-[30rem]:) or the component props.'
              : 'Use a variant the theme defines (hover:, focus-visible:, data-[state=open]:, aria-selected:, group-hover: …).'));
        } else {
          report('token-unknown-class', at, cls, `"${cls}" is not a utility of the Caustic theme.`,
            near.length ? `Nearest token utilities: ${near.join(', ')}.` : 'Run `caustic tokens` for the token utilities.');
        }
      }
    }
  };
  const tokensOf = (s: string, base: number, wholeStart: boolean, wholeEnd: boolean) => {
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(s))) {
      if (m.index === 0 && !wholeStart) continue; // glued to a ${…} before it
      if (m.index + m[0].length === s.length && !wholeEnd) continue; // glued to a ${…} after it
      checkClassToken(m[0], base + m.index);
    }
  };
  const visitClassExpr = (e: ts.Node | undefined, inFn: boolean): void => {
    if (!e) return;
    if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) {
      if (seenStrings.has(e)) return;
      seenStrings.add(e);
      tokensOf(e.text, e.getStart() + 1, true, true);
    } else if (ts.isTemplateExpression(e)) {
      if (seenStrings.has(e)) return;
      seenStrings.add(e);
      tokensOf(e.head.text, e.head.getStart() + 1, true, false);
      e.templateSpans.forEach((span, i) => {
        visitClassExpr(span.expression, inFn);
        const last = i === e.templateSpans.length - 1;
        tokensOf(span.literal.text, span.literal.getStart() + 1, false, last);
      });
    } else if (ts.isJsxExpression(e) || ts.isParenthesizedExpression(e) || ts.isAsExpression(e) || ts.isSatisfiesExpression(e) || ts.isNonNullExpression(e)) {
      visitClassExpr(e.expression, inFn);
    } else if (ts.isConditionalExpression(e)) {
      visitClassExpr(e.whenTrue, inFn); visitClassExpr(e.whenFalse, inFn);
    } else if (ts.isBinaryExpression(e)) {
      const op = e.operatorToken.kind;
      if (op === ts.SyntaxKind.AmpersandAmpersandToken) visitClassExpr(e.right, inFn);
      else if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken || op === ts.SyntaxKind.PlusToken) { visitClassExpr(e.left, inFn); visitClassExpr(e.right, inFn); }
    } else if (ts.isArrayLiteralExpression(e)) {
      e.elements.forEach(x => visitClassExpr(x, inFn));
    } else if (ts.isCallExpression(e) && ts.isIdentifier(e.expression) && CLASS_FNS.has(e.expression.text)) {
      visitClassCall(e);
    } else if (ts.isObjectLiteralExpression(e) && inFn) {
      // cn({ 'bg-x': cond }): the keys are classes.
      for (const p of e.properties) if (ts.isPropertyAssignment(p) && (ts.isStringLiteral(p.name) || ts.isNoSubstitutionTemplateLiteral(p.name))) visitClassExpr(p.name, inFn);
    }
  };
  const visitClassCall = (call: ts.CallExpression) => {
    const fn = (call.expression as ts.Identifier).text;
    if (fn === 'cva' || fn === 'tv') {
      visitClassExpr(call.arguments[0], true);
      const cfg = call.arguments[1];
      if (cfg && ts.isObjectLiteralExpression(cfg)) for (const p of cfg.properties) {
        if (!ts.isPropertyAssignment(p)) continue;
        const key = p.name.getText(sf);
        if (key === 'variants' && ts.isObjectLiteralExpression(p.initializer)) {
          for (const ax of p.initializer.properties) if (ts.isPropertyAssignment(ax) && ts.isObjectLiteralExpression(ax.initializer))
            for (const v of ax.initializer.properties) if (ts.isPropertyAssignment(v)) visitClassExpr(v.initializer, true);
        }
        if (key === 'compoundVariants' && ts.isArrayLiteralExpression(p.initializer)) {
          for (const el of p.initializer.elements) if (ts.isObjectLiteralExpression(el))
            for (const q of el.properties) if (ts.isPropertyAssignment(q) && ['className', 'class'].includes(q.name.getText(sf))) visitClassExpr(q.initializer, true);
        }
      }
      return;
    }
    for (const a of call.arguments) visitClassExpr(a, true);
  };

  // ---- style objects ----
  const checkStyle = (obj: ts.ObjectLiteralExpression) => {
    for (const p of obj.properties) {
      if (!ts.isPropertyAssignment(p)) continue;
      const key = ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) ? p.name.text : undefined;
      if (!key || key.startsWith('--')) continue; // custom properties carry runtime data: allowed
      const v = p.initializer;
      let lits: string[] = [];
      if (ts.isStringLiteral(v) || ts.isNoSubstitutionTemplateLiteral(v)) lits = literalsIn(v.text, { namedColors: !NON_COLOR_PROPS.has(key) });
      else if (ts.isTemplateExpression(v)) lits = [v.head.text, ...v.templateSpans.map(s => s.literal.text)].flatMap(t => literalsIn(t, { namedColors: false }));
      else if (LENGTH_PROPS.has(key)) {
        const num = ts.isNumericLiteral(v) ? Number(v.text) : ts.isPrefixUnaryExpression(v) && v.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(v.operand) ? -Number(v.operand.text) : undefined;
        if (num !== undefined && num !== 0 && ![0.5, 1, 1.5, 2].includes(Math.abs(num))) lits = [`${num}px`];
      }
      reportLiterals(lits, TOKENISED_STYLE.test(key), p.getStart(), p.getText(sf), `Inline style ${key} hard-codes`,
        'Use a token utility in className. Inline style may only set CSS custom properties (style={{ "--x": value }}) read back by a utility such as bg-(--x).');
    }
  };

  // ---- JSX elements ----
  const attrsOf = (o: Opening) => o.attributes.properties;
  const attrNamed = (o: Opening, name: string) => attrsOf(o).find((a): a is ts.JsxAttribute => ts.isJsxAttribute(a) && a.name.getText(sf) === name);
  const stringValues = (a: ts.JsxAttribute): { value: string; node: ts.Node }[] => {
    const init = a.initializer;
    if (!init) return [];
    if (ts.isStringLiteral(init)) return [{ value: init.text, node: init }];
    if (!ts.isJsxExpression(init) || !init.expression) return [];
    const out: { value: string; node: ts.Node }[] = [];
    const v = (e: ts.Expression) => {
      if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) out.push({ value: e.text, node: e });
      else if (ts.isConditionalExpression(e)) { v(e.whenTrue); v(e.whenFalse); }
      else if (ts.isParenthesizedExpression(e)) v(e.expression);
    };
    v(init.expression);
    return out;
  };
  const hasText = (n: ts.Node): boolean => {
    if (ts.isJsxText(n)) return n.text.trim().length > 0;
    if (ts.isJsxExpression(n)) {
      const e = n.expression;
      if (!e) return false;
      if (ts.isJsxElement(e) || ts.isJsxSelfClosingElement(e) || ts.isJsxFragment(e)) return hasText(e);
      return true; // {label}, {t('save')}, {cond ? a : b}: assume text
    }
    if (ts.isJsxElement(n) || ts.isJsxFragment(n)) return n.children.some(hasText);
    return false;
  };
  const fieldComp = idx.byName.get('Field');
  const labelTest = (o: Opening): Step => {
    const tag = o.tagName;
    if (isIntrinsic(tag)) return ts.isIdentifier(tag) && tag.text === 'label' ? 'yes' : 'nested';
    const exp = resolveTag(tag);
    if (exp) return fieldComp && idx.byExport.get(exp) === fieldComp ? 'yes' : 'nested';
    const local = ts.isIdentifier(tag) ? localFns.get(tag.text) : undefined;
    if (local) return rendersMatching(local, e => !!e && !!fieldComp && idx.byExport.get(e) === fieldComp) ? 'yes' : 'nested';
    return tagText(tag).endsWith('Fragment') ? 'skip' : 'unknown';
  };

  const checkComponent = (o: Opening, exp: string, comp: CatalogComponent) => {
    // Per-export props read from the implementation when the catalog has them; else the component-wide spec props.
    const perExport = (comp as CatalogComponent & { exportProps?: Record<string, Record<string, CatalogProp>> }).exportProps?.[exp];
    const props: Record<string, CatalogProp> = perExport ?? comp.props ?? {};
    const part = idx.partByExport.get(exp);
    const hasSpread = attrsOf(o).some(a => ts.isJsxSpreadAttribute(a));

    // prop-unknown / prop-invalid-value
    if (Object.keys(props).length) {
      const el = (part as (CatalogPart & { el?: string }) | undefined)?.el ?? (comp as CatalogComponent & { el?: string }).el;
      const html = htmlAttributes(el);
      const known = new Set([...Object.keys(props), ...Object.keys(comp.events ?? {}), ...(perExport ? [] : [...Object.keys(comp.variants ?? {}), ...(comp.sizes ? ['size'] : [])])]);
      for (const a of attrsOf(o)) {
        if (!ts.isJsxAttribute(a) || ts.isJsxNamespacedName(a.name)) continue;
        const name = a.name.text;
        if (!known.has(name) && !isPassThrough(name) && !html.has(name)) {
          const near = closest(name, known, 1);
          report('prop-unknown', a.getStart(), a.getText(sf), `<${tagText(o.tagName)}> has no prop "${name}".`,
            (near.length ? `Did you mean ${near[0]}? ` : '') + `See \`caustic show ${comp.id} --depth api\` for its props.`);
          continue;
        }
        const def = props[name] as Deprecatable | undefined;
        if (def?.deprecated === true) {
          report('prop-deprecated', a.getStart(), a.getText(sf), `<${tagText(o.tagName)}> ${name} is deprecated.`,
            `${replacementOf(def) ? `Use ${replacementOf(def)}. ` : ''}See \`caustic show ${comp.id} --depth api\` for the current name.`);
        }
        const oldValues = deprecatedValues(def);
        const values = def?.values;
        for (const { value, node } of stringValues(a)) {
          if (oldValues.has(value)) {
            const use = def?.replacements?.[value];
            report('prop-deprecated', node.getStart(), a.getText(sf), `${name}="${value}" is a deprecated value of <${tagText(o.tagName)}> ${name}.`,
              `${use ? `Use ${use}. ` : ''}Current values: ${(values ?? []).filter(v => !oldValues.has(v)).map(x => `"${x}"`).join(', ')}.`);
            continue;
          }
          if (!values?.length || values.includes(value)) continue;
          const near = closest(value, values, 1);
          report('prop-invalid-value', node.getStart(), a.getText(sf), `${name}="${value}" is not a value of <${tagText(o.tagName)}> ${name}.`,
            `${near.length ? `Use ${name}="${near[0]}". ` : ''}Values: ${values.filter(v => !oldValues.has(v)).map(x => `"${x}"`).join(', ')}.`);
        }
      }
    }

    // prop-missing-label (the component itself, not its parts)
    if (exp === comp.name && comp.a11y?.labelRequired && !hasSpread) {
      // A labelling prop of any spelling counts (label, title, inputLabel, uploadLabel, labels={…}, question, legend …),
      // and an id may be the target of <label htmlFor>.
      const labelled = attrsOf(o).some(a => ts.isJsxAttribute(a) && /label|title|legend|question|heading|^id$/i.test(a.name.getText(sf)));
      const text = ts.isJsxOpeningElement(o) && o.parent.children.some(hasText);
      if (!labelled && !text && contextOf(elementOf(o), labelTest, 'no') === 'no') {
        report('prop-missing-label', o.getStart(), o.getText(sf), `<${tagText(o.tagName)}> has no accessible name.`,
          'Add aria-label (or label / aria-labelledby), visible text, or wrap it in <Field label="…">.');
      }
    }

    // compose-outside-parent
    if (part?.parent) {
      const allowed = new Set([comp.name, ...(comp.exports ?? []).filter(e => /^[A-Z]/.test(e))]);
      allowed.delete(exp);
      const importsParent = [...locals.values()].some(e => allowed.has(e)) || namespaces.size > 0;
      const ctx = contextOf(elementOf(o), parentTest(comp, allowed), importsParent ? 'no' : 'unknown');
      if (ctx !== 'yes') {
        report('compose-outside-parent', o.getStart(), o.getText(sf).split('\n')[0]!,
          ctx === 'no' ? `<${exp}> is rendered outside <${comp.name}>.` : `<${exp}> has no <${comp.name}> around it in this file; it may be composed in another file or by another component.`,
          `Render it inside <${comp.name}>${part.parent !== comp.name ? ` (in <${part.parent}>)` : ''}. See \`caustic show ${comp.id}\` for the parts.`, ctx === 'no' ? undefined : 'advisory');
      }
    }
  };

  const suggestNames = (names: string[]) => names.map(n => idx.byName.get(n)).filter((c): c is CatalogComponent => !!c);
  const checkRaw = (o: Opening) => {
    if (!usesCaustic || !ts.isIdentifier(o.tagName)) return;
    const tag = o.tagName.text;
    let names: string[] | undefined;
    let what = `<${tag}>`;
    if (tag === 'input') {
      const type = attrNamed(o, 'type');
      const t = type ? stringValues(type)[0]?.value : 'text';
      names = t !== undefined ? INPUT_TYPES[t] : undefined;
      if (type) what = `<input type="${t}">`;
    } else names = RAW_TAGS[tag];
    const role = attrNamed(o, 'role');
    const roleValue = role ? stringValues(role)[0]?.value : undefined;
    if (!names && roleValue && RAW_ROLES[roleValue]) { names = RAW_ROLES[roleValue]; what = `<${tag} role="${roleValue}">`; }
    if (!names) return;
    const comps = suggestNames(names);
    if (!comps.length) return;
    const list = comps.map(c => `${c.name} (\`caustic show ${c.id}\`)`).join(' or ');
    report('compose-reinvented', o.getStart(), o.getText(sf).split('\n')[0]!, `Raw ${what} in a file that uses Caustic.`, `Use ${list}; it carries the tokens, states and accessibility.`);
  };

  // ---- walk ----
  const visit = (n: ts.Node) => {
    if (ts.isJsxAttribute(n) && ts.isIdentifier(n.name)) {
      const name = n.name.text;
      if (/^(className|class)$|ClassName$/.test(name) && n.initializer) visitClassExpr(n.initializer, false);
      if (name === 'style' && n.initializer && ts.isJsxExpression(n.initializer) && n.initializer.expression && ts.isObjectLiteralExpression(n.initializer.expression)) checkStyle(n.initializer.expression);
    }
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && CLASS_FNS.has(n.expression.text)) visitClassCall(n);
    if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) {
      if (isIntrinsic(n.tagName)) checkRaw(n);
      else {
        const exp = resolveTag(n.tagName);
        const comp = exp ? idx.byExport.get(exp) : undefined;
        if (exp && comp) checkComponent(n, exp, comp);
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return findings;
}
