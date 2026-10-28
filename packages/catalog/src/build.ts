// Generates dist/catalog.json and dist/llms.txt from the specs, the component sources, the fixtures, the tokens and the
// authored entries and recipes. Everything the code can say is derived here; entries only add routing data.
//   pnpm catalog          write dist (missing entries are listed, not fatal)
//   pnpm catalog:check    write nothing; exit 1 when dist is stale, an entry or recipe is invalid, a spec has no entry
//                         or an entry has no spec
// Spec `usage` is never read: it mixes internal history with guidance.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import { ComponentSpec } from '@caustic/spec';
import { readSpec, specIds } from '@caustic/spec/node';
import { placements, roles, type Placement, type Role } from './roles.ts';
import { CatalogEntry, Recipe, type Catalog, type CatalogComponent, type CatalogPart, type CatalogProp } from './schema.ts';

const here = dirname(fileURLToPath(import.meta.url));
const pkgDir = join(here, '..');
const root = join(pkgDir, '..', '..');
const componentsDir = join(root, 'packages/react/src/components');
const tokensDist = join(root, 'packages/tokens/dist');
const distDir = join(pkgDir, 'dist');
const EXAMPLE_MAX_LINES = 60;

const checkMode = process.argv.includes('--check');
const problems = { invalid: [] as string[], missing: [] as string[], orphan: [] as string[] };
const rel = (f: string) => relative(root, f);

// ---- sources ----

const readJson = (f: string) => JSON.parse(readFileSync(f, 'utf8'));
const tsFiles = (dir: string) => (existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.ts')).sort() : []);
const loadDefault = async (file: string) => (await import(pathToFileURL(file).href)).default as unknown;

async function loadSpecs(): Promise<Map<string, ComponentSpec>> {
  const out = new Map<string, ComponentSpec>();
  for (const id of specIds()) {
    try {
      const parsed = ComponentSpec.safeParse(await readSpec(id));
      if (parsed.success) out.set(id, parsed.data);
      else problems.invalid.push(`spec ${id}: ${parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
    } catch (e) {
      problems.invalid.push(`spec ${id}: ${(e as Error).message}`);
    }
  }
  return out;
}

async function loadAuthored<T>(dir: string, schema: { safeParse(v: unknown): { success: true; data: T } | { success: false; error: { issues: { path: PropertyKey[]; message: string }[] } } }, kind: string) {
  const out = new Map<string, T>();
  for (const file of tsFiles(dir)) {
    const path = join(dir, file);
    const fileId = file.slice(0, -3);
    try {
      const parsed = schema.safeParse(await loadDefault(path));
      if (!parsed.success) {
        problems.invalid.push(`${kind} ${rel(path)}: ${parsed.error.issues.map(i => `${i.path.join('.') || '(root)'}: ${i.message}`).join('; ')}`);
        continue;
      }
      const id = (parsed.data as { id: string }).id;
      if (id !== fileId) { problems.invalid.push(`${kind} ${rel(path)}: id "${id}" does not match the file name`); continue; }
      out.set(id, parsed.data);
    } catch (e) {
      problems.invalid.push(`${kind} ${rel(path)}: ${(e as Error).message}`);
    }
  }
  return out;
}

// ---- TypeScript source analysis ----

const sourceFile = (file: string) => ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);

/** Value exports (not types) of a component's index.ts, in source order. */
function valueExports(file: string): string[] {
  if (!existsSync(file)) return [];
  const sf = sourceFile(file);
  const out: string[] = [];
  const isExported = (n: ts.Node) => ts.canHaveModifiers(n) && (ts.getModifiers(n) ?? []).some(m => m.kind === ts.SyntaxKind.ExportKeyword);
  for (const st of sf.statements) {
    if (ts.isExportDeclaration(st)) {
      if (st.isTypeOnly || !st.exportClause || !ts.isNamedExports(st.exportClause)) continue;
      for (const el of st.exportClause.elements) if (!el.isTypeOnly) out.push(el.name.text);
    } else if ((ts.isFunctionDeclaration(st) || ts.isClassDeclaration(st)) && st.name && isExported(st)) {
      out.push(st.name.text);
    } else if (ts.isVariableStatement(st) && isExported(st)) {
      for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name)) out.push(d.name.text);
    }
  }
  return [...new Set(out)];
}

/** Source of a node range with its real column: the text before it on its first line becomes spaces, then the common
 *  indentation is removed. */
function sourceOf(sf: ts.SourceFile, start: number, end: number): string {
  const lineStart = sf.text.lastIndexOf('\n', start - 1) + 1;
  const text = ' '.repeat(start - lineStart) + sf.text.slice(start, end);
  const lines = text.split('\n');
  const indents = lines.filter(l => l.trim()).map(l => l.match(/^ */)![0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map(l => l.slice(min)).join('\n').trim();
}

/** JSX source of each fixture example, keyed by example id, as candidates from most to least complete: the example
 *  with the fixture-local helpers it references (constants, small components), then the example alone. Block bodies
 *  keep their statements unless they only return. */
function fixtureExamples(file: string): Map<string, string[]> {
  const out = new Map<string, string[]>();
  if (!existsSync(file)) return out;
  const sf = sourceFile(file);
  const consts = new Map<string, ts.Expression>();
  const visitConsts = (n: ts.Node) => {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer) consts.set(n.name.text, n.initializer);
    ts.forEachChild(n, visitConsts);
  };
  visitConsts(sf);
  // Top-level declarations other than the fixture itself, for helpers an example refers to.
  const topLevel = new Map<string, ts.Statement>();
  for (const st of sf.statements) {
    if (ts.isExportAssignment(st) || ts.isImportDeclaration(st)) continue;
    if (ts.isFunctionDeclaration(st) && st.name) topLevel.set(st.name.text, st);
    if (ts.isVariableStatement(st)) for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name)) topLevel.set(d.name.text, st);
  }
  const helpersOf = (node: ts.Node): ts.Statement[] => {
    const used = new Set<ts.Statement>();
    const queue: ts.Node[] = [node];
    while (queue.length) {
      const walk = (n: ts.Node) => {
        if (ts.isIdentifier(n)) {
          const st = topLevel.get(n.text);
          if (st && !used.has(st) && !(st.pos <= node.pos && node.end <= st.end)) { used.add(st); queue.push(st); }
        }
        ts.forEachChild(n, walk);
      };
      walk(queue.shift()!);
    }
    return sf.statements.filter(st => used.has(st));
  };
  const resolve = (e: ts.Expression | undefined): ts.Expression | undefined => (e && ts.isIdentifier(e) ? consts.get(e.text) : e);
  const keyText = (name: ts.PropertyName) => (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name) ? name.text : undefined);
  const candidates = (fn: ts.Node | undefined): string[] => {
    if (!fn || !(ts.isArrowFunction(fn) || ts.isFunctionExpression(fn) || ts.isMethodDeclaration(fn)) || !fn.body) return [];
    let body: ts.Node = fn.body;
    let code: string | undefined;
    if (ts.isBlock(body)) {
      const only = body.statements.length === 1 ? body.statements[0] : undefined;
      if (only && ts.isReturnStatement(only) && only.expression) body = only.expression;
      else if (body.statements.length) code = sourceOf(sf, body.statements[0]!.getStart(sf), body.statements[body.statements.length - 1]!.getEnd());
      else return [];
    }
    if (code === undefined) {
      while (ts.isParenthesizedExpression(body)) body = body.expression;
      code = sourceOf(sf, body.getStart(sf), body.getEnd());
    }
    const helpers = helpersOf(fn).map(st => sourceOf(sf, st.getStart(sf), st.getEnd()));
    return helpers.length ? [[...helpers, code].join('\n\n'), code] : [code];
  };
  const visit = (n: ts.Node) => {
    if (ts.isPropertyAssignment(n) && keyText(n.name) === 'examples') {
      const obj = resolve(n.initializer);
      if (obj && ts.isObjectLiteralExpression(obj)) {
        for (const p of obj.properties) {
          const key = p.name && keyText(p.name);
          if (!key) continue;
          const fn = ts.isPropertyAssignment(p) ? resolve(p.initializer) : ts.isMethodDeclaration(p) ? p : ts.isShorthandPropertyAssignment(p) ? consts.get(p.name.text) : undefined;
          const code = candidates(fn);
          if (code.length) out.set(key, code);
        }
      }
      return;
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}

// ---- derivation ----

/** String-literal members of a union type written as text, or undefined when any member is not a string literal. */
function literalValues(type: string): string[] | undefined {
  const members = type.split('|').map(s => s.trim()).filter(Boolean);
  if (!members.length) return undefined;
  const values: string[] = [];
  for (const m of members) {
    const lit = m.match(/^'([^']*)'$|^"([^"]*)"$/);
    if (!lit) return undefined;
    values.push(lit[1] ?? lit[2] ?? '');
  }
  return values;
}

const pascal = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
const truthy = (v: unknown) => (typeof v === 'object' && v !== null ? Object.keys(v).length > 0 : Boolean(v));

/** Compound part exports matched to slots by name (Root + PascalCase(slot)); a part's parent is the nearest ancestor
 *  slot that has an export, or the root component. Exports that match no slot are listed without a slot or parent. */
function deriveParts(spec: ComponentSpec, exports: string[]): CatalogPart[] {
  const slotByExport = new Map<string, ComponentSpec['slots'][number]>();
  for (const slot of spec.slots) if (slot.name !== 'root') slotByExport.set(spec.name + pascal(slot.name), slot);
  const exportBySlot = new Map<string, string>([['root', spec.name]]);
  for (const [name, slot] of slotByExport) if (exports.includes(name)) exportBySlot.set(slot.name, name);
  const slots = new Map(spec.slots.map(s => [s.name, s]));
  const parentOf = (slotName: string): string | undefined => {
    let cur = slots.get(slotName)?.parent;
    for (let guard = 0; cur && guard < 20; guard++) {
      const name = exportBySlot.get(cur);
      if (name) return name;
      cur = slots.get(cur)?.parent;
    }
    return undefined;
  };
  const parts: CatalogPart[] = [];
  for (const name of exports) {
    if (name === spec.name || !/^[A-Z]/.test(name)) continue;
    const slot = slotByExport.get(name);
    if (slot && exports.includes(name)) {
      const parent = parentOf(slot.name);
      parts.push({ name, slot: slot.name, el: slot.el, ...(parent ? { parent } : {}), required: slot.required, description: slot.description });
    } else {
      parts.push({ name, slot: '', el: '', required: false, description: '' });
    }
  }
  return parts;
}

type ImplProp = { type: string; required: boolean; values?: string[] };

/** Props each PascalCase export of every component accepts, read with the TypeScript checker from the first parameter
 *  of its call signature. Props declared only by @types/react (HTML attributes, key, ref …) are left out. */
function implementationProps(ids: string[]): Map<string, Record<string, Record<string, ImplProp>>> {
  const files = ids.map(id => join(componentsDir, id, 'index.ts')).filter(existsSync);
  const program = ts.createProgram(files, {
    jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, moduleResolution: ts.ModuleResolutionKind.Bundler,
    allowImportingTsExtensions: true, noEmit: true, skipLibCheck: true, strict: true, types: [],
  });
  const tc = program.getTypeChecker();
  const out = new Map<string, Record<string, Record<string, ImplProp>>>();
  for (const id of ids) {
    const sf = program.getSourceFile(join(componentsDir, id, 'index.ts'));
    const mod = sf && tc.getSymbolAtLocation(sf);
    if (!mod) continue;
    const byExport: Record<string, Record<string, ImplProp>> = {};
    for (const exp of tc.getExportsOfModule(mod)) {
      if (!/^[A-Z]/.test(exp.name)) continue;
      const sym = exp.flags & ts.SymbolFlags.Alias ? tc.getAliasedSymbol(exp) : exp;
      const decl = sym.valueDeclaration;
      const sig = decl && tc.getTypeOfSymbolAtLocation(sym, decl).getCallSignatures()[0];
      const param = sig?.parameters[0];
      if (!decl || !param) continue;
      const props: Record<string, ImplProp> = {};
      for (const p of tc.getTypeOfSymbolAtLocation(param, decl).getProperties()) {
        if ((p.declarations ?? []).every(d => d.getSourceFile().fileName.includes('@types/react'))) continue;
        const t = tc.getNonNullableType(tc.getTypeOfSymbolAtLocation(p, decl));
        const members = t.isUnion() ? t.types : [t];
        const values = members.every(m => m.isStringLiteral()) ? members.map(m => (m as ts.StringLiteralType).value) : undefined;
        props[p.name] = { type: tc.typeToString(t), required: !(p.flags & ts.SymbolFlags.Optional), ...(values ? { values } : {}) };
      }
      byExport[exp.name] = Object.fromEntries(Object.entries(props).sort(([a], [b]) => a.localeCompare(b)));
    }
    out.set(id, byExport);
  }
  return out;
}

/** Implementation props merged with the spec's documentation: type text and values from the code, description,
 *  default and deprecation from the spec when it documents the prop. */
function mergeProps(spec: ComponentSpec, impl: Record<string, ImplProp>): Record<string, CatalogProp> {
  const out: Record<string, CatalogProp> = {};
  for (const [name, p] of Object.entries(impl)) {
    // The spec documents props for the whole component; its note applies to this export only when the values agree
    // (CardLink's as="a" | "button" says nothing about CardTitle's as="h2" …).
    const spec_ = spec.props[name];
    const docValues = spec_ && literalValues(spec_.type);
    const fits = !p.values || !docValues || (docValues.some(v => p.values!.includes(v)) && (typeof spec_?.default !== 'string' || p.values.includes(spec_.default)));
    const doc = fits ? spec_ : undefined;
    const type = doc && (p.type.length > 100 || p.type === 'any') ? doc.type : p.type;
    out[name] = {
      type,
      ...(doc?.default !== undefined ? { default: doc.default } : {}),
      required: p.required,
      description: doc?.description ?? '',
      ...(p.values ? { values: p.values } : {}),
      ...(doc && /^deprecated/i.test(doc.description) ? { deprecated: true } : {}),
    };
    // Values the code still accepts but the spec no longer lists are legacy aliases (Button tone="secondary").
    const legacy = doc && docValues && p.values?.filter(v => !docValues.includes(v));
    if (legacy?.length) out[name]!.deprecatedValues = legacy;
  }
  return out;
}

function deriveComponent(spec: ComponentSpec, entry: CatalogEntry, impl: Record<string, Record<string, ImplProp>>): CatalogComponent {
  const dir = join(componentsDir, spec.id);
  const exports = valueExports(join(dir, 'index.ts'));
  const parts = deriveParts(spec, exports);
  const props: Record<string, CatalogProp> = {};
  for (const [name, p] of Object.entries(spec.props)) {
    const values = literalValues(p.type);
    props[name] = { type: p.type, ...(p.default !== undefined ? { default: p.default } : {}), required: p.required, description: p.description, ...(values ? { values } : {}), ...(/^deprecated/i.test(p.description) ? { deprecated: true } : {}) };
  }
  const exportProps = Object.fromEntries(Object.entries(impl).map(([name, ps]) => [name, mergeProps(spec, ps)]));
  const code = fixtureExamples(join(dir, `${spec.id}.fixture.tsx`));
  const examples = spec.examples.map(ex => {
    const src = code.get(ex.id)?.find(c => c.split('\n').length < EXAMPLE_MAX_LINES);
    return { id: ex.id, title: ex.title, ...(src ? { code: src } : {}) };
  });
  const importNames = [spec.name, ...parts.map(p => p.name)];
  return {
    id: spec.id,
    name: spec.name,
    category: spec.category,
    status: spec.status,
    intent: entry.intent,
    roles: entry.roles,
    alsoFits: entry.alsoFits,
    placement: entry.placement,
    keywords: entry.keywords,
    pairs: entry.pairs,
    consider: entry.consider,
    guidance: entry.guidance,
    ...(entry.detail ? { detail: entry.detail } : {}),
    import: `import { ${importNames.join(', ')} } from '@caustic/react';`,
    exports,
    el: spec.slots.find(sl => sl.name === 'root')?.el ?? spec.slots[0]?.el ?? 'any',
    props,
    exportProps,
    variants: spec.variants,
    ...(spec.sizes ? { sizes: spec.sizes } : {}),
    parts,
    events: spec.events,
    keyboard: spec.behavior.keyboard,
    a11y: { labelRequired: spec.a11y.labelRequired, notes: spec.a11y.notes },
    flags: { agent: truthy(spec.flags.agent), floating: truthy(spec.flags.floating), field: spec.flags.field },
    uses: [...spec.composition.uses].sort(),
    usedBy: [],
    examples,
  };
}

/** Token names an author writes after a utility prefix, grouped. Read from the built Tailwind theme and allowlist. */
function deriveTokens(): Record<string, string[]> {
  const css = readFileSync(join(tokensDist, 'theme.css'), 'utf8');
  const allow = readJson(join(tokensDist, 'allowlist.json')) as { spacingSteps: number[]; durations: number[]; fontWeights: string[] };
  const theme = css.slice(css.indexOf('@theme'), css.indexOf('\n}', css.indexOf('@theme')));
  const ns = (prefix: string) => [...theme.matchAll(new RegExp(`^\\s*--${prefix}-([a-z0-9][a-z0-9-]*?)(?:--[a-z-]+)?:`, 'gm'))].map(m => m[1] ?? '');
  const uniq = (xs: string[]) => [...new Set(xs)];
  const utilities = [...css.matchAll(/^@utility ([a-z][a-z0-9-]*(?:-\*)?) \{/gm)].map(m => m[1] ?? '');
  const byNumber = (a: number, b: number) => a - b;
  return {
    color: uniq(ns('color')),
    size: uniq(ns('spacing')),
    spacing: [...allow.spacingSteps].sort(byNumber).map(String),
    radius: uniq(ns('radius')),
    shadow: uniq(ns('shadow')),
    text: uniq(ns('text')),
    font: uniq([...ns('font'), ...allow.fontWeights]),
    motion: uniq([...[...allow.durations].sort(byNumber).map(ms => `duration-${ms}`), ...ns('ease').map(n => `ease-${n}`), ...ns('animate').map(n => `animate-${n}`)]),
    material: uniq(utilities),
  };
}

// ---- assembly ----

async function build() {
  const specs = await loadSpecs();
  const entries = await loadAuthored<CatalogEntry>(join(here, 'entries'), CatalogEntry, 'entry');
  const recipes = await loadAuthored<Recipe>(join(here, 'recipes'), Recipe, 'recipe');
  const known = new Set([...specs.keys(), ...specIds()]);

  for (const id of specIds()) if (!entries.has(id)) problems.missing.push(id);
  for (const id of entries.keys()) if (!known.has(id)) problems.orphan.push(id);
  for (const [id, e] of entries) {
    const bad = [...e.pairs, ...e.consider.map(c => c.id)].filter(ref => !known.has(ref));
    if (bad.length) problems.invalid.push(`entry ${id}: unknown component ids ${bad.join(', ')}`);
    if (e.consider.some(c => c.id === id) || e.pairs.includes(id)) problems.invalid.push(`entry ${id}: refers to itself`);
  }
  for (const [id, r] of recipes) {
    const bad = r.regions.flatMap(g => g.suggested).filter(ref => !known.has(ref));
    if (bad.length) problems.invalid.push(`recipe ${id}: unknown component ids ${bad.join(', ')}`);
    if (r.reference && !existsSync(join(root, r.reference))) problems.invalid.push(`recipe ${id}: reference ${r.reference} does not exist`);
  }

  const components: Record<string, CatalogComponent> = {};
  const ids = [...entries.keys()].filter(id => specs.has(id)).sort();
  const impl = implementationProps(ids);
  for (const id of ids) {
    const spec = specs.get(id);
    const entry = entries.get(id);
    if (spec && entry) components[id] = deriveComponent(spec, entry, impl.get(id) ?? {});
  }
  for (const c of Object.values(components)) for (const dep of c.uses) components[dep]?.usedBy.push(c.id);
  for (const c of Object.values(components)) c.usedBy.sort();

  const roleIndex: Catalog['roles'] = {};
  for (const [role, description] of Object.entries(roles)) {
    roleIndex[role] = { description, components: Object.values(components).filter(c => c.roles.includes(role as Role)).map(c => c.id) };
  }
  const placementIndex: Catalog['placements'] = {};
  for (const [p, description] of Object.entries(placements)) {
    placementIndex[p] = { description, components: Object.values(components).filter(c => c.placement.includes(p as Placement)).map(c => c.id) };
  }

  const pkg = readJson(join(pkgDir, 'package.json')) as { version: string };
  const reactPkg = readJson(join(root, 'packages/react/package.json')) as { version: string };
  const tokensPkg = readJson(join(root, 'packages/tokens/package.json')) as { version: string };
  const catalog: Catalog = {
    version: pkg.version,
    generatedFrom: `@caustic/react ${reactPkg.version}, @caustic/tokens ${tokensPkg.version}`,
    roles: roleIndex,
    placements: placementIndex,
    components,
    // `reference` is a repo-internal path: validated above, never shipped.
    recipes: Object.fromEntries([...recipes].sort(([a], [b]) => a.localeCompare(b)).map(([id, { reference: _reference, ...r }]) => [id, r])),
    tokens: deriveTokens(),
  };
  return { catalog, llms: llmsText(catalog) };
}

function llmsText(catalog: Catalog): string {
  const lines = [
    '# Caustic components',
    '',
    `> ${Object.keys(catalog.components).length} React components for agent-native design tools, imported from '@caustic/react'.`,
    '',
    'Use the `caustic` CLI (package @caustic/cli) for detail instead of guessing:',
    '- `caustic find "<need>"` routes a need to fitting components; `caustic list --tree` shows the whole set.',
    '- `caustic show <id> --depth api` gives props, variants and events; `--depth full` adds example code.',
    '- `caustic tokens [group]` lists the token utilities; `caustic recipes` lists screen layouts.',
    '- `caustic check <files>` checks code against the tokens and the component specs.',
    'Every command takes `--json`. Full data: @caustic/catalog/catalog.json.',
    '',
  ];
  for (const [role, { description }] of Object.entries(catalog.roles)) {
    const members = Object.values(catalog.components).filter(c => c.roles[0] === role);
    if (!members.length) continue;
    lines.push(`## ${role}: ${description}`, '');
    for (const c of members) lines.push(`- ${c.name} (${c.id}): ${c.intent}`);
    lines.push('');
  }
  return lines.join('\n');
}

// ---- main ----

const { catalog, llms } = await build();
const json = `${JSON.stringify(catalog, null, 2)}\n`;
const outputs: [string, string][] = [[join(distDir, 'catalog.json'), json], [join(distDir, 'llms.txt'), llms]];
const stale = outputs.filter(([f, text]) => !existsSync(f) || readFileSync(f, 'utf8') !== text).map(([f]) => rel(f));

const report = (label: string, items: string[]) => {
  if (items.length) console.error(`${label} (${items.length}):\n${items.map(i => `  - ${i}`).join('\n')}`);
};
report('invalid', problems.invalid);
report('specs without an entry (add packages/catalog/src/entries/<id>.ts)', problems.missing);
report('entries without a spec', problems.orphan);

const count = Object.keys(catalog.components).length;
if (checkMode) {
  report('stale (run pnpm catalog)', stale);
  const failed = problems.invalid.length + problems.missing.length + problems.orphan.length + stale.length > 0;
  console.error(failed ? 'catalog:check failed' : `catalog:check ok (${count} components)`);
  process.exit(failed ? 1 : 0);
}
mkdirSync(distDir, { recursive: true });
for (const [f, text] of outputs) if (stale.includes(rel(f))) writeFileSync(f, text);
console.error(`catalog: ${count} components, ${Object.keys(catalog.recipes).length} recipes${stale.length ? `; wrote ${stale.join(', ')}` : '; up to date'}`);
process.exit(problems.invalid.length + problems.orphan.length ? 1 : 0);
