// G2 · Static source checks over components/<id>/*. No rendering; parses TypeScript.
import ts from 'typescript';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { slotAttr, type ComponentSpec } from '@caustic/spec';
import { Collector } from '../report.ts';
import { componentsDir, root } from '../paths.ts';
import { tokenIndex } from '../tokens.ts';
import { unknownClasses } from '../tw.ts';

const LITERAL_COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color-mix)\(/;
const BASE_IMPORTS = new Set(['react', 'react/jsx-runtime', 'lucide-react', 'class-variance-authority']);

interface ClassUse { cls: string; file: string; line: number; context: string }

export const pascal = (id: string) => id.split('-').map(s => s[0]!.toUpperCase() + s.slice(1)).join('');

export async function g2(c: Collector, spec: ComponentSpec) {
  const dir = join(componentsDir, spec.id);
  if (!existsSync(dir)) { c.fail({ gate: 'G2', check: 'files', message: `components/${spec.id}/ does not exist.` }); return; }
  const files = readdirSync(dir).filter(f => /\.(tsx?|css)$/.test(f)).map(f => join(dir, f));
  const impl = files.filter(f => !f.includes('.fixture.'));
  const main = join(dir, `${spec.id}.tsx`);
  if (!existsSync(main)) { c.fail({ gate: 'G2', check: 'files', message: `Missing components/${spec.id}/${spec.id}.tsx.` }); return; }
  const t = await tokenIndex();

  const uses: ClassUse[] = [];
  const slotsFound = new Set<string>();
  const variantConfigs: { file: string; variants: Record<string, string[]>; defaults: Record<string, string> }[] = [];

  for (const file of impl) {
    const text = readFileSync(file, 'utf8');
    const rel = relative(root, file).replace(/\\/g, '/');
    if (file.endsWith('.css')) { c.fail({ gate: 'G2', check: 'no-css-files', where: rel, message: 'Components style with Tailwind utilities only; no component CSS files.' }); continue; }
    const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const lineOf = (n: ts.Node) => sf.getLineAndCharacterOfPosition(n.getStart()).line + 1;
    if (file === main && !/^['"]use client['"]/.test(text.trimStart())) c.fail({ gate: 'G2', check: 'use-client', where: rel, message: 'Component module must start with "use client".' });

    const collectStrings = (n: ts.Node, context: string) => {
      const visit = (m: ts.Node) => {
        if (ts.isStringLiteral(m) || ts.isNoSubstitutionTemplateLiteral(m)) {
          // Object keys are names, except in cn({ 'class': condition }).
          if (ts.isPropertyAssignment(m.parent) && m.parent.name === m && context !== 'cn') return;
          // Operands of comparisons (orientation === 'horizontal') are values, not classes.
          if (ts.isBinaryExpression(m.parent) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken].includes(m.parent.operatorToken.kind)) return;
          if (ts.isCaseClause(m.parent)) return;
          for (const cls of m.text.split(/\s+/).filter(Boolean)) uses.push({ cls, file: rel, line: lineOf(m), context });
        } else if (ts.isTemplateExpression(m)) {
          c.fail({ gate: 'G2', check: 'dynamic-class', where: `${rel}:${lineOf(m)}`, message: 'Template-literal class names cannot be verified.', fix: 'Use cva variants or cn() with static strings.' });
        }
        ts.forEachChild(m, visit);
      };
      visit(n);
    };

    const visit = (n: ts.Node) => {
      // literal colors anywhere in string content
      if ((ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) && LITERAL_COLOR.test(n.text)) {
        c.fail({ gate: 'G2', check: 'literal-color', where: `${rel}:${lineOf(n)}`, message: 'Literal color in component source.', actual: n.text.slice(0, 120), fix: 'Use a semantic color utility (bg-surface-base, text-text-primary…) or var(--cs-color-*).' });
      }
      if (ts.isCallExpression(n) && ts.isIdentifier(n.expression)) {
        const fn = n.expression.text;
        if (fn === 'cn') collectStrings(n, fn);
        if (fn === 'cva') {
          // Classes live in: the base (arg 0), variant values, and compoundVariants[].className.
          if (n.arguments[0]) collectStrings(n.arguments[0], 'cva');
          const cfg0 = n.arguments[1];
          if (cfg0 && ts.isObjectLiteralExpression(cfg0)) for (const p of cfg0.properties) {
            if (!ts.isPropertyAssignment(p)) continue;
            const key = p.name.getText(sf);
            if (key === 'variants' && ts.isObjectLiteralExpression(p.initializer)) {
              for (const ax of p.initializer.properties) if (ts.isPropertyAssignment(ax) && ts.isObjectLiteralExpression(ax.initializer))
                for (const v of ax.initializer.properties) if (ts.isPropertyAssignment(v)) collectStrings(v.initializer, 'cva');
            }
            if (key === 'compoundVariants' && ts.isArrayLiteralExpression(p.initializer)) {
              for (const el of p.initializer.elements) if (ts.isObjectLiteralExpression(el))
                for (const q of el.properties) if (ts.isPropertyAssignment(q) && ['className', 'class'].includes(q.name.getText(sf))) collectStrings(q.initializer, 'cva');
            }
          }
          const cfg = n.arguments[1];
          if (cfg && ts.isObjectLiteralExpression(cfg)) {
            const variants: Record<string, string[]> = {}; const defaults: Record<string, string> = {};
            for (const p of cfg.properties) {
              if (!ts.isPropertyAssignment(p) || !ts.isObjectLiteralExpression(p.initializer)) continue;
              const key = p.name.getText(sf);
              if (key === 'variants') for (const ax of p.initializer.properties) {
                if (ts.isPropertyAssignment(ax) && ts.isObjectLiteralExpression(ax.initializer))
                  variants[ax.name.getText(sf).replace(/['"]/g, '')] = ax.initializer.properties.map(v => v.name!.getText(sf).replace(/['"]/g, ''));
              }
              if (key === 'defaultVariants') for (const d of p.initializer.properties) if (ts.isPropertyAssignment(d)) defaults[d.name.getText(sf)] = d.initializer.getText(sf).replace(/['"]/g, '');
            }
            variantConfigs.push({ file: rel, variants, defaults });
          }
        }
      }
      if (ts.isJsxAttribute(n)) {
        const name = n.name.getText(sf);
        if (name === 'className' && n.initializer) collectStrings(n.initializer, 'className');
        if (name === 'data-slot' && n.initializer && ts.isStringLiteral(n.initializer)) slotsFound.add(n.initializer.text);
        if (name === 'style' && n.initializer && ts.isJsxExpression(n.initializer) && n.initializer.expression && ts.isObjectLiteralExpression(n.initializer.expression)) {
          for (const p of n.initializer.expression.properties) {
            const key = p.name?.getText(sf).replace(/['"]/g, '') ?? '';
            if (!key.startsWith('--')) c.fail({ gate: 'G2', check: 'inline-style', where: `${rel}:${lineOf(p)}`, message: `Inline style "${key}". Only CSS custom properties may be set inline (for runtime values such as positions).`, fix: 'Move the value to a token-backed utility.' });
          }
        }
      }
      if (ts.isImportDeclaration(n) && ts.isStringLiteral(n.moduleSpecifier)) {
        const m = n.moduleSpecifier.text;
        const ok = m.startsWith('./') || m.startsWith('../../lib/') || m.startsWith('../../hooks/') || BASE_IMPORTS.has(m)
          || spec.composition.radix.includes(m)
          || spec.composition.uses.some(u => m.startsWith(`../${u}/`) && !m.includes('.fixture'));
        if (!ok) c.fail({ gate: 'G2', check: 'imports', where: `${rel}:${lineOf(n)}`, message: `Import "${m}" is not allowed.`, fix: 'Allowed: local files, ../../lib, ../../hooks, react, lucide-react, cva, spec.composition.radix and components listed in spec.composition.uses.' });
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }

  // Class rules
  const tw: string[] = [];
  for (const u of uses) {
    const where = `${u.file}:${u.line}`;
    const parts = u.cls.split(':'); const util = parts.pop()!.replace(/^!/, ''); const variants = parts;
    if (u.cls.includes('!')) c.fail({ gate: 'G2', check: 'important', where, message: `"${u.cls}" uses !important.` });
    if (variants.includes('dark')) c.fail({ gate: 'G2', check: 'no-dark-variant', where, message: `"${u.cls}": themes come from tokens; dark: is not allowed.` });
    const arb = util.match(/\[(.+)\]/);
    if (arb) {
      const v = arb[1]!;
      const stripped = v.replace(/var\(--cs-[a-z0-9-]+\)/g, '').replace(/var\(--[a-z0-9-]+\)/g, '');
      const lengths = stripped.match(/-?\d*\.?\d+(px|rem|em|vh|vw|ms|s)\b/g) ?? [];
      const badLen = lengths.filter(l => !t.allow.arbitraryPx.includes(l.replace(/^-/, '')) && !/^0(px)?$/.test(l));
      if (badLen.length) c.fail({ gate: 'G2', check: 'arbitrary-value', where, message: `"${u.cls}" hard-codes ${badLen.join(', ')}.`, fix: 'Use a token utility or var(--cs-*). Only 0.5px, 1px, 1.5px and 2px hairlines are allowed as literals.' });
      if (LITERAL_COLOR.test(v)) c.fail({ gate: 'G2', check: 'arbitrary-value', where, message: `"${u.cls}" contains a literal color.` });
    }
    const num = util.match(/^-?(p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y|inset|inset-x|inset-y|top|right|bottom|left|w|h|size|min-w|min-h|max-w|max-h)-(\d+(?:\.\d+)?)$/);
    if (num && !t.allow.spacingSteps.includes(Number(num[2]))) c.fail({ gate: 'G2', check: 'space-scale', where, message: `"${u.cls}" = ${Number(num[2]) * 4}px is off the space scale (${t.allow.spacingSteps.map(s => s * 4).join(', ')}).`, fix: 'Use a scale step or a named token (px-inset-regular-x, h-field-md…).' });
    const dur = util.match(/^duration-(\d+)$/); if (dur && !t.allow.durations.includes(Number(dur[1]))) c.fail({ gate: 'G2', check: 'motion-token', where, message: `"${u.cls}" is not a duration token (${t.allow.durations.join(', ')}).` });
    const z = util.match(/^-?z-(\d+)$/); if (z && !t.allow.zIndex.includes(Number(z[1]))) c.fail({ gate: 'G2', check: 'z-token', where, message: `"${u.cls}" is not a z-index token (${t.allow.zIndex.join(', ')}).` });
    const op = util.match(/^opacity-(\d+)$/); if (op && !t.allow.opacity.includes(Number(op[1]))) c.fail({ gate: 'G2', check: 'opacity-token', where, message: `"${u.cls}" is not an opacity token (${t.allow.opacity.join(', ')}).` });
    const fw = util.match(/^font-(thin|extralight|light|bold|extrabold|black)$/); if (fw) c.fail({ gate: 'G2', check: 'font-weight', where, message: `"${u.cls}": weights come from type roles (400/500/600).` });
    if (/^(bg|text|border|ring|outline|fill|stroke|shadow|from|to|via|decoration|accent|caret|divide)-[a-z0-9-]+\/\d+$/.test(util)) c.fail({ gate: 'G2', check: 'color-alpha', where, message: `"${u.cls}" adds alpha to a token. Alpha lives in tokens.` });
    tw.push(u.cls);
  }
  const unknown = await unknownClasses(tw);
  for (const cls of unknown) {
    const u = uses.find(x => x.cls === cls)!;
    c.fail({ gate: 'G2', check: 'non-token-class', where: `${u.file}:${u.line}`, message: `"${cls}" is not generated by the Caustic theme.`, fix: 'Only token-backed utilities exist; check the class name against dist/theme.css.' });
  }

  // data-slot coverage
  for (const s of spec.slots) {
    const attr = slotAttr(spec, s.name);
    if (!slotsFound.has(attr)) c.fail({ gate: 'G2', check: 'data-slot', message: `No element carries data-slot="${attr}" (slot "${s.name}").` });
  }
  for (const found of slotsFound) {
    const known = spec.slots.some(s => slotAttr(spec, s.name) === found);
    if (!known) c.warn({ gate: 'G2', check: 'data-slot', message: `data-slot="${found}" is not in the spec anatomy.` });
  }

  // Variants vs spec
  const specAxes: Record<string, { values: string[]; default: string }> = { ...spec.variants };
  if (spec.sizes) specAxes.size = spec.sizes;
  const merged: Record<string, string[]> = {}; const defaults: Record<string, string> = {};
  for (const vc of variantConfigs) { Object.assign(merged, vc.variants); Object.assign(defaults, vc.defaults); }
  for (const [axis, def] of Object.entries(specAxes)) {
    const got = merged[axis];
    if (!got) { c.fail({ gate: 'G2', check: 'variants', message: `cva has no "${axis}" axis.`, expected: def.values.join(' | ') }); continue; }
    const missing = def.values.filter(v => !got.includes(v)), extra = got.filter(v => !def.values.includes(v));
    if (missing.length || extra.length) c.fail({ gate: 'G2', check: 'variants', message: `cva "${axis}" values differ from the spec.`, expected: def.values.join(' | '), actual: got.join(' | ') });
    if (defaults[axis] !== def.default) c.fail({ gate: 'G2', check: 'variants', message: `defaultVariants.${axis} differs from the spec.`, expected: def.default, actual: defaults[axis] ?? '(none)' });
  }

  // Props interface vs spec (type checker)
  checkProps(c, spec, main);
}

function checkProps(c: Collector, spec: ComponentSpec, main: string) {
  const program = ts.createProgram([main], { jsx: ts.JsxEmit.ReactJSX, strict: true, skipLibCheck: true, moduleResolution: ts.ModuleResolutionKind.Bundler, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, allowImportingTsExtensions: true, noEmit: true });
  const checker = program.getTypeChecker();
  const sf = program.getSourceFile(main); if (!sf) return;
  const exportName = pascal(spec.id);
  const sym = checker.getSymbolAtLocation(sf);
  const exp = sym && checker.getExportsOfModule(sym).find(e => e.name === exportName);
  if (!exp) { c.fail({ gate: 'G2', check: 'export', message: `components/${spec.id}/${spec.id}.tsx does not export ${exportName}.` }); return; }
  const fnType = checker.getTypeOfSymbolAtLocation(exp, sf);
  const sig = fnType.getCallSignatures()[0];
  const param = sig?.getParameters()[0];
  if (!param) { c.fail({ gate: 'G2', check: 'props', message: `${exportName} takes no props.` }); return; }
  const propsType = checker.getTypeOfSymbolAtLocation(param, sf);
  const want = { ...spec.props, ...Object.fromEntries(Object.entries(spec.events).map(([k, v]) => [k, { type: v.payload, description: v.when, required: false }])) };
  for (const [name, def] of Object.entries(want)) {
    const p = propsType.getProperty(name);
    if (!p) { c.fail({ gate: 'G2', check: 'props', message: `Prop "${name}" from the spec is missing on ${exportName}.`, expected: (def as any).type }); continue; }
    const propType = checker.getTypeOfSymbolAtLocation(p, sf);
    const typeText = checker.typeToString(propType);
    // Expand aliases, unions and callback parameters into the string literals they accept.
    const accepted = new Set<string>();
    const walk = (t: ts.Type, depth = 0) => {
      if (depth > 6) return;
      if (t.isStringLiteral()) accepted.add(t.value);
      if (t.isUnion() || t.isIntersection()) t.types.forEach(x => walk(x, depth + 1));
      for (const sg of t.getCallSignatures()) for (const prm of sg.getParameters()) walk(checker.getTypeOfSymbolAtLocation(prm, sf), depth + 1);
    };
    walk(propType);
    const literals = [...String((def as any).type).matchAll(/'([^']+)'/g)].map(m => m[1]!);
    const missing = literals.filter(l => !accepted.has(l));
    if (missing.length) c.fail({ gate: 'G2', check: 'props', message: `Prop "${name}" does not accept ${missing.map(m => `"${m}"`).join(', ')}.`, expected: (def as any).type, actual: typeText });
  }
}
