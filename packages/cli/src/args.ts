// Hand-rolled argv parsing: `--flag`, `--key value`, `--key=value`, `-h`. `--` ends the flags.

export class UsageError extends Error {
  constructor(message: string, readonly suggestions: string[] = []) { super(message); }
}

export type Parsed = { positionals: string[]; flags: Record<string, string | true> };

/** `bools` take no value; `values` take one. Anything else is a usage error. */
export function parseArgs(argv: string[], bools: readonly string[], values: readonly string[]): Parsed {
  const positionals: string[] = [];
  const flags: Record<string, string | true> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === '--') { positionals.push(...argv.slice(i + 1)); break; }
    if (arg === '-h') { flags.help = true; continue; }
    if (!arg.startsWith('--') || arg === '--') { positionals.push(arg); continue; }
    const eq = arg.indexOf('=');
    const key = arg.slice(2, eq === -1 ? undefined : eq);
    if (bools.includes(key)) {
      if (eq !== -1) throw new UsageError(`--${key} takes no value`);
      flags[key] = true;
    } else if (values.includes(key)) {
      const value = eq === -1 ? argv[++i] : arg.slice(eq + 1);
      if (value === undefined || value === '' || (eq === -1 && value.startsWith('--'))) throw new UsageError(`--${key} needs a value`);
      flags[key] = value;
    } else {
      throw new UsageError(`unknown option --${key}`, closest(key, [...bools, ...values]).map(k => `--${k}`));
    }
  }
  return { positionals, flags };
}

export const str = (v: string | true | undefined) => (typeof v === 'string' ? v : undefined);

function distance(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]!;
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const up = prev[j]!;
      prev[j] = Math.min(up + 1, prev[j - 1]! + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = up;
    }
  }
  return prev[b.length]!;
}

/** Up to `limit` candidates close to `input`: substring and word overlap first, then edit distance. */
export function closest(input: string, candidates: readonly string[], limit = 5): string[] {
  const q = input.toLowerCase();
  const words = q.split(/[^a-z0-9]+/).filter(w => w.length > 1);
  const scored = candidates.map(c => {
    const l = c.toLowerCase();
    const d = distance(q, l);
    let score = d / Math.max(q.length, l.length, 1);
    if (l.includes(q) || q.includes(l)) score -= 1;
    score -= 0.3 * words.filter(w => l.includes(w)).length;
    return { c, score, d };
  });
  return scored
    .filter(s => s.score < 0.5 || s.d <= 2)
    .sort((a, b) => a.score - b.score || a.c.localeCompare(b.c))
    .slice(0, limit)
    .map(s => s.c);
}
