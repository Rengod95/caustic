// Weighted lexical routing: a need in plain words → ranked components. Roles only ever add score; a component whose
// role differs is never hidden, so applied design can still pick it.
// Weights per query word (times its rarity): name/id 5, keywords and primary roles 3, intent 2, alsoFits and guidance 1.
// The query is also matched against the role descriptions ("pick one" → choice.single); a matched role adds to its
// components like one strong word (alsoFits: like one soft word).
import type { Catalog, CatalogComponent } from '@caustic/catalog';

const STOP = new Set(['a', 'an', 'the', 'to', 'of', 'for', 'and', 'or', 'in', 'on', 'at', 'with', 'that', 'this', 'is', 'are', 'be',
  'it', 'its', 'i', 'me', 'my', 'we', 'you', 'your', 'need', 'want', 'some', 'something', 'thing', 'like', 'use', 'using', 'can',
  'should', 'after', 'before', 'which', 'where', 'when', 'what', 'how', 'from', 'into', 'by', 'as', 'so', 'let', 'lets', 'user', 'users', 'component',
  // Verbs every role description starts with; they say nothing about which role.
  'show', 'display', 'make', 'get', 'add']);

export function stem(w: string): string {
  if (w.length > 4 && w.endsWith('ies')) return `${w.slice(0, -3)}y`;
  if (w.length > 4 && /(ss|x|ch|sh)es$/.test(w)) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
  if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith('ed')) w = w.slice(0, -2);
  else if (w.length > 6 && /(al|ion)$/.test(w)) w = w.replace(/(al|ion)$/, '');
  // approve, approval, approved → approv; a trailing e never decides a match.
  return w.length > 4 && w.endsWith('e') ? w.slice(0, -1) : w;
}

export function words(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(w => w && !STOP.has(w))
    .map(stem);
}

const set = (...texts: string[]) => new Set(texts.flatMap(words));

type Fields = { name: Set<string>; strong: Set<string>; intent: Set<string>; soft: Set<string>; keywords: string[] };
const fieldsOf = (c: CatalogComponent): Fields => ({
  name: set(c.id, c.name),
  strong: set(...c.keywords, ...c.roles),
  intent: set(c.intent),
  soft: set(...c.alsoFits, ...c.guidance),
  keywords: c.keywords.map(k => words(k).join(' ')).filter(k => k.includes(' ')),
});

export type FindOptions = { role?: string; placement?: string; limit: number };
export type FindResult = {
  query: string;
  roles: { role: string; score: number }[];
  results: { id: string; name: string; score: number; roles: string[]; alsoFits: string[]; placement: string[]; intent: string }[];
  alsoConsider: { id: string; when: string; from: string }[];
};

export function find(catalog: Catalog, query: string, opts: FindOptions): FindResult {
  const comps = Object.values(catalog.components);
  const q = [...new Set(words(query))];
  const qPhrase = ` ${words(query).join(' ')} `;
  const fields = new Map(comps.map(c => [c.id, fieldsOf(c)]));

  const idf = (df: number, n: number) => Math.log(1 + n / Math.max(df, 1));
  const compIdf = new Map(q.map(w => {
    const df = comps.filter(c => { const f = fields.get(c.id)!; return f.name.has(w) || f.strong.has(w) || f.intent.has(w) || f.soft.has(w); }).length;
    return [w, idf(df, comps.length)];
  }));

  // Role mapping: query words against each role's id and description.
  const roleEntries = Object.entries(catalog.roles).map(([role, r]) => ({ role, words: set(role, r.description) }));
  const roleIdf = new Map(q.map(w => [w, idf(roleEntries.filter(r => r.words.has(w)).length, roleEntries.length)]));
  const roleRaw = roleEntries
    .map(r => ({ role: r.role, score: q.filter(w => r.words.has(w)).reduce((s, w) => s + roleIdf.get(w)!, 0) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);
  const best = roleRaw[0]?.score ?? 0;
  const matchedRoles = roleRaw.filter(r => r.score >= best * 0.6).slice(0, 3);

  const scored = comps.map(c => {
    const f = fields.get(c.id)!;
    let score = 0;
    for (const w of q) {
      const weight = f.name.has(w) ? 5 : f.strong.has(w) ? 3 : f.intent.has(w) ? 2 : f.soft.has(w) ? 1 : 0;
      score += weight * compIdf.get(w)!;
    }
    for (const k of f.keywords) if (qPhrase.includes(` ${k} `)) score += 3;
    const whole = query.trim().toLowerCase();
    if (whole === c.id || whole === c.name.toLowerCase()) score += 10;
    // A matched role counts like one strong word (3 × a typical rarity of 3), scaled by how well it matched.
    for (const r of matchedRoles) {
      const strength = r.score / best;
      if (c.roles.includes(r.role as never)) score += 9 * strength;
      else if (c.alsoFits.includes(r.role as never)) score += 3 * strength;
    }
    if (opts.role) {
      const hit = (rs: string[]) => rs.some(r => r === opts.role || r.startsWith(`${opts.role}.`));
      if (hit(c.roles)) score += 5;
      else if (hit(c.alsoFits)) score += 2;
    }
    if (opts.placement && c.placement.includes(opts.placement as never)) score += 2;
    return { c, score: Math.round(score * 10) / 10 };
  });

  const ranked = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score || a.c.id.localeCompare(b.c.id)).slice(0, opts.limit);
  const shown = new Set(ranked.map(r => r.c.id));
  const alsoConsider: FindResult['alsoConsider'] = [];
  for (const { c } of ranked.slice(0, 3)) {
    for (const k of c.consider) {
      if (shown.has(k.id) || alsoConsider.some(a => a.id === k.id)) continue;
      alsoConsider.push({ id: k.id, when: k.when, from: c.id });
    }
  }
  return {
    query,
    roles: matchedRoles.map(r => ({ role: r.role, score: Math.round(r.score * 10) / 10 })),
    results: ranked.map(({ c, score }) => ({ id: c.id, name: c.name, score, roles: c.roles, alsoFits: c.alsoFits, placement: c.placement, intent: c.intent })),
    alsoConsider: alsoConsider.slice(0, 5),
  };
}
