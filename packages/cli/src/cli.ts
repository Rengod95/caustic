// `caustic`: query the Caustic component catalog and check code against it. Every command takes --json.
// Exit codes: 0 ok, 1 bad usage or unknown id (closest ids printed), 2 the catalog (or check input) could not be read.
import { cpSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import type { Catalog, CatalogComponent, Recipe } from '@caustic/catalog';
import { closest, parseArgs, str, UsageError, type Parsed } from './args.ts';
import { find } from './find.ts';

class CatalogError extends Error {}

const DEPTHS = ['brief', 'api', 'full'] as const;
type Depth = (typeof DEPTHS)[number];

/** How an author spells each token group in a className. */
const TOKEN_USE: Record<string, string> = {
  color: 'bg-* text-* border-* fill-* stroke-* ring-* outline-* divide-*',
  size: 'h-* w-* size-* min-h-* min-w-* max-h-* max-w-* (named sizes; also p-*, gap-* where a size fits)',
  spacing: 'p-* m-* gap-* space-* inset-* (scale steps; 1 step = 4px)',
  radius: 'rounded-*',
  shadow: 'shadow-*',
  text: 'text-* (a type role sets size, line height, tracking and weight)',
  font: 'font-* (ui | voice | mono family; normal | medium | semibold weight)',
  motion: 'full utilities: duration-*, ease-*, animate-*',
  material: 'full utilities (glass and the agent spectrum only where a component allows them)',
};

const NEXT = [
  ['caustic list --tree', 'the whole component set by category and role'],
  ['caustic find "<need>"', 'route a need to fitting components'],
  ['caustic show <id…> --depth api', 'props, variants, events (full: + example code)'],
  ['caustic roles | recipes | tokens', 'the role taxonomy, screen layouts, token utilities'],
  ['caustic check <files…>', 'check code against the tokens and the component specs'],
] as const;

const HELP = `caustic: the Caustic component catalog for agents

usage
  caustic                                   status and next commands
  caustic list [--tree] [--role r] [--category c] [--placement p]
  caustic find "<need>" [--role r] [--placement p] [--limit n]
  caustic show <id…> [--depth brief|api|full]
  caustic roles [role]
  caustic recipes [id]
  caustic tokens [group]
  caustic check <files…> [--rules a,b] [--github] [--advisory] [--list-rules]
  caustic init [--dir path] [--force]     install the caustic skill (default .claude/skills/caustic)

Every command takes --json. A role filter also takes a family (--role choice).
find never drops a component for its role; --role and --placement only raise matching ones.
exit: 0 ok · 1 bad usage or unknown id · 2 catalog or input unreadable`;

// ---- catalog ----

export function loadCatalog(): Catalog {
  let path = process.env.CAUSTIC_CATALOG;
  try {
    path ??= createRequire(import.meta.url).resolve('@caustic/catalog/catalog.json');
    const catalog = JSON.parse(readFileSync(path, 'utf8')) as Catalog;
    if (!catalog.components || !catalog.roles) throw new Error('not a Caustic catalog');
    return catalog;
  } catch (e) {
    throw new CatalogError(`catalog unreadable${path ? ` (${path})` : ''}: ${(e as Error).message}. In the Caustic repo run \`pnpm catalog\`; otherwise reinstall @caustic/cli.`);
  }
}

// ---- helpers ----

const out = (lines: string[]) => process.stdout.write(`${lines.join('\n')}\n`);
const json = (v: unknown) => process.stdout.write(`${JSON.stringify(v, null, 2)}\n`);
const pad = (s: string, n: number) => s.padEnd(n);
const width = (xs: string[]) => Math.max(0, ...xs.map(x => x.length));
const valueList = (values: string[], dflt?: unknown) => values.map(v => (v === dflt ? `${v}*` : v)).join(' | ');
const fmtDefault = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v));

function component(catalog: Catalog, idOrName: string): CatalogComponent {
  const byId = catalog.components[idOrName];
  if (byId) return byId;
  const lower = idOrName.toLowerCase();
  const byName = Object.values(catalog.components).find(c => c.name.toLowerCase() === lower || c.exports.some(e => e.toLowerCase() === lower));
  if (byName) return byName;
  const ids = Object.keys(catalog.components);
  throw new UsageError(`unknown component "${idOrName}"; to search by need: caustic find "${idOrName}"`, closest(idOrName, [...ids, ...Object.values(catalog.components).map(c => c.name)]).map(n => catalog.components[n]?.id ?? Object.values(catalog.components).find(c => c.name === n)?.id ?? n).filter((v, i, a) => a.indexOf(v) === i));
}

/** Exact role, or a family prefix ("choice" → choice.*). */
function roleFilter(catalog: Catalog, role: string): (r: string) => boolean {
  const roles = Object.keys(catalog.roles);
  if (roles.includes(role)) return r => r === role;
  if (roles.some(r => r.startsWith(`${role}.`))) return r => r.startsWith(`${role}.`);
  const families = [...new Set(roles.map(r => r.split('.')[0]!))];
  throw new UsageError(`unknown role "${role}"`, closest(role, [...families, ...roles]));
}

function oneOf(kind: string, value: string, allowed: string[]): string {
  if (allowed.includes(value)) return value;
  throw new UsageError(`unknown ${kind} "${value}"`, closest(value, allowed));
}

const roleTag = (c: { roles: readonly string[]; alsoFits: readonly string[] }) => c.roles.join(', ') + (c.alsoFits.length ? ` (+${c.alsoFits.join(', ')})` : '');

// ---- commands ----

function status(catalog: Catalog, asJson: boolean) {
  const comps = Object.values(catalog.components);
  const data = {
    version: catalog.version,
    generatedFrom: catalog.generatedFrom,
    components: comps.length,
    categories: [...new Set(comps.map(c => c.category))].sort(),
    roles: Object.keys(catalog.roles).length,
    recipes: Object.keys(catalog.recipes).length,
    tokens: Object.fromEntries(Object.entries(catalog.tokens).map(([g, names]) => [g, names.length])),
    next: NEXT.map(([command, what]) => ({ command, what })),
  };
  if (asJson) return json(data);
  const w = width(NEXT.map(n => n[0]));
  out([
    `Caustic catalog ${data.version} · ${data.components} components · ${data.roles} roles · ${data.recipes} recipes · ${data.categories.length} categories`,
    `import { … } from '@caustic/react'   (${data.generatedFrom})`,
    '',
    'next:',
    ...NEXT.map(([cmd, what]) => `  ${pad(cmd, w)}  ${what}`),
  ]);
}

function list(catalog: Catalog, p: Parsed, asJson: boolean) {
  let comps = Object.values(catalog.components);
  const categories = [...new Set(comps.map(c => c.category))].sort();
  const category = str(p.flags.category) && oneOf('category', str(p.flags.category)!, categories);
  const placement = str(p.flags.placement) && oneOf('placement', str(p.flags.placement)!, Object.keys(catalog.placements));
  const roleArg = str(p.flags.role);
  const roleOk = roleArg ? roleFilter(catalog, roleArg) : undefined;
  if (category) comps = comps.filter(c => c.category === category);
  if (placement) comps = comps.filter(c => c.placement.includes(placement as never));
  // A role filter keeps primary members first, then the ones that also fit (marked ~).
  const also = new Set<string>();
  if (roleOk) {
    const primary = comps.filter(c => c.roles.some(roleOk));
    const soft = comps.filter(c => !c.roles.some(roleOk) && c.alsoFits.some(roleOk));
    soft.forEach(c => also.add(c.id));
    comps = [...primary, ...soft];
  }
  const filters = [category && `category ${category}`, roleArg && `role ${roleArg}`, placement && `placement ${placement}`].filter(Boolean).join(', ');

  if (p.flags.tree) {
    const tree: Record<string, Record<string, string[]>> = {};
    for (const c of comps) {
      const role = (roleOk && c.roles.find(roleOk)) || c.roles[0] || '-';
      ((tree[c.category] ??= {})[role] ??= []).push(c.id);
    }
    if (asJson) return json({ filters: filters || null, count: comps.length, tree });
    const lines = [`${comps.length} components${filters ? ` (${filters})` : ''}, by category → role`];
    for (const cat of Object.keys(tree).sort()) {
      const roles = tree[cat]!;
      lines.push('', `${cat} (${Object.values(roles).flat().length})`);
      for (const role of Object.keys(roles).sort()) {
        lines.push(`  ${role}`);
        for (const id of roles[role]!) {
          const c = catalog.components[id]!;
          lines.push(`    ${also.has(id) ? '~' : '-'} ${c.id} (${c.name}): ${c.intent}`);
        }
      }
    }
    lines.push('', 'next: caustic show <id> --depth api · caustic find "<need>"');
    return out(lines);
  }

  if (!roleOk) comps.sort((a, b) => a.id.localeCompare(b.id));
  if (asJson) return json({ filters: filters || null, count: comps.length, components: comps.map(c => ({ id: c.id, name: c.name, category: c.category, roles: c.roles, alsoFits: c.alsoFits, placement: c.placement, intent: c.intent, ...(also.has(c.id) ? { match: 'alsoFits' } : {}) })) });
  const wId = width(comps.map(c => c.id));
  const wName = width(comps.map(c => c.name));
  const wRole = width(comps.map(c => c.roles.join(',')));
  out([
    `${comps.length} components${filters ? ` (${filters})` : ''}${also.size ? '; ~ = also fits the role' : ''}`,
    ...comps.map(c => `${also.has(c.id) ? '~' : ' '} ${pad(c.id, wId)}  ${pad(c.name, wName)}  ${pad(c.roles.join(','), wRole)}  ${c.intent}`),
    'next: caustic show <id> --depth api · caustic list --tree',
  ]);
}

function findCmd(catalog: Catalog, p: Parsed, asJson: boolean) {
  const query = p.positionals.join(' ').trim();
  if (!query) throw new UsageError('find needs a need in words: caustic find "pick one of a few modes"');
  const roleArg = str(p.flags.role);
  if (roleArg) roleFilter(catalog, roleArg);
  const placement = str(p.flags.placement) && oneOf('placement', str(p.flags.placement)!, Object.keys(catalog.placements));
  const limitArg = str(p.flags.limit);
  const limit = limitArg ? Number(limitArg) : 8;
  if (!Number.isInteger(limit) || limit < 1) throw new UsageError(`--limit must be a positive integer, got "${limitArg}"`);
  const r = find(catalog, query, { ...(roleArg ? { role: roleArg } : {}), ...(placement ? { placement } : {}), limit });
  if (asJson) return json(r);
  const lines = [`find "${query}"${r.roles.length ? ` · roles: ${r.roles.map(x => x.role).join(', ')}` : ''}`];
  if (!r.results.length) {
    lines.push('no match. Try other words, `caustic roles` for the taxonomy, or `caustic list --tree`.');
    return out(lines);
  }
  const wId = width(r.results.map(x => x.id));
  r.results.forEach((x, i) => lines.push(`${String(i + 1).padStart(2)}. ${pad(x.id, wId)}  ${x.name} · ${roleTag(x)}`, `      ${x.intent}`));
  if (r.alsoConsider.length) {
    lines.push('also consider:');
    for (const a of r.alsoConsider) lines.push(`  - ${a.id}: ${a.when} (from ${a.from})`);
  }
  lines.push(`next: caustic show ${r.results.slice(0, 2).map(x => x.id).join(' ')} --depth api`);
  out(lines);
}

function showData(c: CatalogComponent, depth: Depth) {
  const brief = { id: c.id, name: c.name, category: c.category, status: c.status, intent: c.intent, roles: c.roles, alsoFits: c.alsoFits, placement: c.placement, import: c.import, parts: c.parts.map(p => ({ name: p.name, slot: p.slot, el: p.el, ...(p.parent ? { parent: p.parent } : {}) })) };
  if (depth === 'brief') return brief;
  const api = { ...brief, exports: c.exports, exportProps: c.exportProps, props: Object.fromEntries(Object.entries(c.props).map(([k, v]) => [k, { type: v.type, ...(v.default !== undefined ? { default: v.default } : {}), required: v.required, ...(v.values ? { values: v.values } : {}), ...(v.deprecated ? { deprecated: true } : {}) }])), variants: Object.fromEntries(Object.entries(c.variants).map(([k, v]) => [k, { values: v.values, default: v.default }])), ...(c.sizes ? { sizes: c.sizes } : {}), events: c.events, a11y: { labelRequired: c.a11y.labelRequired }, flags: c.flags };
  if (depth === 'api') return api;
  return c;
}

function showText(c: CatalogComponent, depth: Depth): string[] {
  const lines = [
    `${c.name} (${c.id}) · ${c.category} · ${c.status}`,
    c.intent,
    `roles: ${c.roles.join(', ')}${c.alsoFits.length ? ` · also fits: ${c.alsoFits.join(', ')}` : ''}`,
    `placement: ${c.placement.join(', ')}`,
    c.import,
  ];
  const parts = c.parts.filter(p => p.slot);
  const extra = c.parts.filter(p => !p.slot);
  if (parts.length) lines.push(`parts: ${parts.map(p => `${p.name}${p.parent ? ` (in ${p.parent})` : ''}`).join(', ')}`);
  if (extra.length) lines.push(`also exported: ${extra.map(p => p.name).join(', ')}`);
  if (depth === 'brief') return lines;

  const full = depth === 'full';
  const variantKeys = new Set([...Object.keys(c.variants), ...(c.sizes ? ['size'] : [])]);
  if (Object.keys(c.variants).length || c.sizes) {
    lines.push('variants (* = default):');
    for (const [k, v] of Object.entries(c.variants)) {
      lines.push(`  ${k}: ${valueList(v.values, v.default)}`);
      if (full && v.description) lines.push(`      ${v.description}`);
    }
    if (c.sizes) lines.push(`  size: ${valueList(c.sizes.values, c.sizes.default)}`);
  }
  const props = Object.entries(c.props).filter(([k]) => !variantKeys.has(k));
  if (props.length || c.exportProps?.[c.name]) {
    lines.push('props:');
    for (const [k, v] of props) {
      const type = v.values ? valueList(v.values, v.default) : v.type;
      const dflt = v.default !== undefined && !v.values ? ` = ${fmtDefault(v.default)}` : '';
      const deprecated = v.deprecated || /^deprecated/i.test(v.description) ? '  (deprecated)' : '';
      lines.push(`  ${k}${v.required ? '' : '?'}: ${type}${dflt}${deprecated}`);
      if (full && v.description && !deprecated) lines.push(`      ${v.description}`);
    }
  }
  // Props the code accepts beyond the documented ones, and each part's own props.
  const rootExtra = Object.keys(c.exportProps?.[c.name] ?? {}).filter(k => !c.props[k] && !variantKeys.has(k) && !c.events[k]);
  if (rootExtra.length) lines.push(`  also accepts: ${rootExtra.join(', ')}`);
  const partProps = c.parts.map(p => [p.name, Object.entries(c.exportProps?.[p.name] ?? {})] as const).filter(([, ps]) => ps.length);
  if (partProps.length) {
    lines.push('part props:');
    for (const [name, ps] of partProps) {
      lines.push(`  ${name}: ${ps.map(([k, v]) => (v.values && v.values.length <= 6 ? `${k}(${v.values.join('|')})` : k) + (v.deprecated ? '†' : '')).join(', ')}`);
    }
  }
  const events = Object.entries(c.events);
  if (events.length) {
    lines.push('events:');
    for (const [k, e] of events) lines.push(`  ${k}(${e.payload}): ${e.when}`);
  }
  if (c.a11y.labelRequired) lines.push('a11y: needs an accessible name (aria-label, aria-labelledby or label)');
  const flags = [c.flags.floating && 'floating (may use glass)', c.flags.agent && 'agent (may use the spectrum)', c.flags.field && 'field (owns its focus)'].filter(Boolean);
  if (flags.length) lines.push(`flags: ${flags.join(', ')}`);
  if (!full) return lines;

  const keys = Object.entries(c.keyboard);
  if (keys.length) lines.push('keyboard:', ...keys.map(([k, v]) => `  ${k}: ${v}`));
  if (c.a11y.notes.length) lines.push('a11y notes:', ...c.a11y.notes.map(n => `  - ${n}`));
  if (parts.length) lines.push('anatomy:', ...parts.map(p => `  ${p.name} [${p.slot}${p.required ? '' : ', optional'}]: ${p.description}`));
  if (c.uses.length || c.usedBy.length) lines.push(`uses: ${c.uses.join(', ') || '-'} · used by: ${c.usedBy.join(', ') || '-'}`);
  if (c.pairs.length) lines.push(`pairs with: ${c.pairs.join(', ')}`);
  if (c.consider.length) lines.push('also consider:', ...c.consider.map(k => `  - ${k.id}: ${k.when}`));
  if (c.guidance.length) lines.push('guidance:', ...c.guidance.map(g => `  - ${g}`));
  if (c.detail) lines.push('detail:', ...c.detail.trim().split('\n').map(l => `  ${l}`));
  if (c.examples.length) {
    lines.push('examples:');
    for (const ex of c.examples) {
      lines.push(`  ${ex.id}: ${ex.title}`);
      if (ex.code) lines.push('```tsx', ex.code, '```');
    }
  }
  return lines;
}

function show(catalog: Catalog, p: Parsed, asJson: boolean) {
  if (!p.positionals.length) throw new UsageError('show needs at least one id: caustic show button tabs --depth api');
  const depth = (str(p.flags.depth) ?? 'brief') as Depth;
  if (!DEPTHS.includes(depth)) throw new UsageError(`--depth must be brief, api or full, got "${depth}"`, closest(depth, DEPTHS));
  const comps = p.positionals.map(id => component(catalog, id));
  if (asJson) return json(comps.length === 1 ? showData(comps[0]!, depth) : comps.map(c => showData(c, depth)));
  const blocks = comps.map(c => showText(c, depth).join('\n'));
  const next = depth === 'brief' ? `next: caustic show ${comps.map(c => c.id).join(' ')} --depth api` : depth === 'api' ? `next: --depth full for example code, guidance and alternatives` : `next: caustic check <file> after writing the code`;
  out([blocks.join('\n\n---\n\n'), next]);
}

function rolesCmd(catalog: Catalog, p: Parsed, asJson: boolean) {
  const comps = Object.values(catalog.components);
  const arg = p.positionals[0];
  if (!arg) {
    const data = Object.entries(catalog.roles).map(([role, r]) => ({ role, description: r.description, components: r.components, alsoFits: comps.filter(c => c.alsoFits.includes(role as never)).map(c => c.id) }));
    if (asJson) return json(data);
    const w = width(data.map(d => d.role));
    return out([
      `${data.length} roles (a role is the job on screen, not the ARIA role); members are primary`,
      ...data.map(d => `${pad(d.role, w)}  ${d.description}  →  ${d.components.join(', ') || '-'}`),
      'next: caustic roles <role> · caustic list --role <role>',
    ]);
  }
  const ok = roleFilter(catalog, arg);
  const picked = Object.entries(catalog.roles).filter(([r]) => ok(r));
  const data = picked.map(([role, r]) => ({
    role,
    description: r.description,
    components: r.components.map(id => ({ id, name: catalog.components[id]?.name ?? id, intent: catalog.components[id]?.intent ?? '' })),
    alsoFits: comps.filter(c => c.alsoFits.includes(role as never)).map(c => ({ id: c.id, name: c.name, intent: c.intent })),
    recipes: Object.values(catalog.recipes).filter(rc => rc.regions.some(g => g.roles.includes(role as never))).map(rc => rc.id),
  }));
  if (asJson) return json(picked.length === 1 ? data[0] : data);
  const lines: string[] = [];
  for (const d of data) {
    lines.push(`${d.role}: ${d.description}`);
    for (const c of d.components) lines.push(`  - ${c.id} (${c.name}): ${c.intent}`);
    if (d.alsoFits.length) lines.push('  also fits:', ...d.alsoFits.map(c => `  ~ ${c.id} (${c.name}): ${c.intent}`));
    if (d.recipes.length) lines.push(`  in recipes: ${d.recipes.join(', ')}`);
    lines.push('');
  }
  lines.push('next: caustic show <id> --depth api');
  out(lines);
}

function recipeText(r: Omit<Recipe, 'reference'>): string[] {
  const lines = [`${r.title} (${r.id})`, r.intent];
  for (const g of r.regions) {
    lines.push(`  ${g.placement}: ${g.purpose}`, `      roles: ${g.roles.join(', ')}${g.suggested.length ? ` · suggested: ${g.suggested.join(', ')}` : ''}`);
  }
  if (r.notes.length) lines.push('  notes:', ...r.notes.map(n => `  - ${n}`));
  return lines;
}

function recipesCmd(catalog: Catalog, p: Parsed, asJson: boolean) {
  const recipes = Object.values(catalog.recipes);
  const arg = p.positionals[0];
  if (!arg) {
    if (asJson) return json(recipes.map(r => ({ id: r.id, title: r.title, intent: r.intent })));
    if (!recipes.length) return out(['no recipes in this catalog yet']);
    const w = width(recipes.map(r => r.id));
    return out([`${recipes.length} recipes (screen layouts by region)`, ...recipes.map(r => `${pad(r.id, w)}  ${r.title}: ${r.intent}`), 'next: caustic recipes <id>']);
  }
  const r = catalog.recipes[arg];
  if (!r) throw new UsageError(`unknown recipe "${arg}"`, closest(arg, Object.keys(catalog.recipes)));
  if (asJson) return json(r);
  out([...recipeText(r), `next: caustic show ${[...new Set(r.regions.flatMap(g => g.suggested))].slice(0, 4).join(' ') || '<id>'}`]);
}

function tokensCmd(catalog: Catalog, p: Parsed, asJson: boolean) {
  const arg = p.positionals[0];
  if (!arg) {
    if (asJson) return json(Object.fromEntries(Object.entries(catalog.tokens).map(([g, names]) => [g, { use: TOKEN_USE[g] ?? '', count: names.length, names }])));
    const w = width(Object.keys(catalog.tokens));
    return out([
      'token groups (the theme resets every Tailwind namespace: only these names compile)',
      ...Object.entries(catalog.tokens).map(([g, names]) => `${pad(g, w)}  ${String(names.length).padStart(3)}  ${TOKEN_USE[g] ?? ''}\n${' '.repeat(w + 7)}e.g. ${names.slice(0, 6).join(' ')}`),
      'no literal colours or lengths (hairlines 0.5px–2px and var(--cs-*) are fine), no dark: variant, no /alpha modifiers',
      'next: caustic tokens <group>',
    ]);
  }
  const group = oneOf('token group', arg, Object.keys(catalog.tokens));
  const names = catalog.tokens[group]!;
  if (asJson) return json({ group, use: TOKEN_USE[group] ?? '', names });
  out([`${group} (${names.length}): ${TOKEN_USE[group] ?? ''}`, names.join('  ')]);
}

async function checkCmd(catalog: Catalog, p: Parsed, asJson: boolean): Promise<number> {
  const rules = str(p.flags.rules)?.split(',').map(s => s.trim()).filter(Boolean);
  if (!p.positionals.length && !p.flags['list-rules']) throw new UsageError('check needs files: caustic check src/App.tsx');
  const { check } = await import('./check/index.ts');
  return check(p.positionals, {
    ...(rules ? { rules } : {}),
    json: asJson,
    github: Boolean(p.flags.github),
    advisory: Boolean(p.flags.advisory),
    listRules: Boolean(p.flags['list-rules']),
    cwd: process.cwd(),
  }, catalog);
}

// ---- dispatch ----

// ---- init: copy the skill into the consumer project ----

/** The skill ships inside the package (skills/, copied at prepack); in the repo it is the root skills/ folder. */
function skillSource(): string {
  for (let dir = dirname(fileURLToPath(import.meta.url)); ; dir = dirname(dir)) {
    const candidate = join(dir, 'skills/caustic');
    if (existsSync(join(candidate, 'SKILL.md'))) return candidate;
    if (dirname(dir) === dir) throw new CatalogError('the caustic skill is missing from this install');
  }
}

function init(p: Parsed, asJson: boolean) {
  const target = resolve(str(p.flags.dir) ?? '.claude/skills/caustic');
  if (existsSync(target) && !p.flags.force) throw new UsageError(`${relative('.', target) || '.'} already exists; pass --force to replace it`);
  cpSync(skillSource(), target, { recursive: true, force: true });
  if (asJson) return json({ installed: target });
  out([`installed the caustic skill in ${relative('.', target)}`, 'next: caustic   (status and the commands to run)']);
}

const COMMANDS: Record<string, { bools: string[]; values: string[] }> = {
  list: { bools: ['tree'], values: ['role', 'category', 'placement'] },
  find: { bools: [], values: ['role', 'placement', 'limit'] },
  show: { bools: [], values: ['depth'] },
  roles: { bools: [], values: [] },
  recipes: { bools: [], values: [] },
  tokens: { bools: [], values: [] },
  check: { bools: ['github', 'advisory', 'list-rules'], values: ['rules'] },
  init: { bools: ['force'], values: ['dir'] },
  help: { bools: [], values: [] },
};

export async function main(argv: string[]): Promise<number> {
  const first = argv[0];
  const isCommand = first !== undefined && !first.startsWith('-');
  const name = isCommand ? first : '';
  const spec = name ? COMMANDS[name] : { bools: [], values: [] };
  let asJson = argv.includes('--json');
  try {
    if (!spec) throw new UsageError(`unknown command "${name}"`, closest(name, Object.keys(COMMANDS)));
    const p = parseArgs(isCommand ? argv.slice(1) : argv, ['json', 'help', ...spec.bools], spec.values);
    asJson = Boolean(p.flags.json);
    if (p.flags.help || name === 'help') { out([HELP]); return 0; }
    if (name === 'init') { init(p, asJson); return 0; }
    const catalog = loadCatalog();
    switch (name) {
      case '': if (p.positionals.length) throw new UsageError(`unexpected "${p.positionals[0]}"`); status(catalog, asJson); return 0;
      case 'list': list(catalog, p, asJson); return 0;
      case 'find': findCmd(catalog, p, asJson); return 0;
      case 'show': show(catalog, p, asJson); return 0;
      case 'roles': rolesCmd(catalog, p, asJson); return 0;
      case 'recipes': recipesCmd(catalog, p, asJson); return 0;
      case 'tokens': tokensCmd(catalog, p, asJson); return 0;
      case 'check': return await checkCmd(catalog, p, asJson);
    }
    return 0;
  } catch (e) {
    if (e instanceof UsageError) {
      if (asJson) json({ error: e.message, suggestions: e.suggestions });
      else console.error(`caustic: ${e.message}${e.suggestions.length ? `\n  closest: ${e.suggestions.join(', ')}` : ''}\n  see: caustic help`);
      return 1;
    }
    if (e instanceof CatalogError) {
      if (asJson) json({ error: e.message });
      else console.error(`caustic: ${e.message}`);
      return 2;
    }
    throw e;
  }
}
