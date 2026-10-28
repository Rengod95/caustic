// Small text helpers: edit distance and nearest names.

export function distance(a: string, b: string): number {
  if (a === b) return 0;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let last = prev[0]!;
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]!;
      prev[j] = Math.min(prev[j]! + 1, prev[j - 1]! + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = tmp;
    }
  }
  return prev[b.length]!;
}

/** Up to `n` names nearest to `word`, closest first; only those within roughly half the word's length. */
export function closest(word: string, names: Iterable<string>, n = 1): string[] {
  const max = Math.max(2, Math.ceil(word.length / 2));
  const lower = word.toLowerCase();
  return [...new Set(names)]
    .map(name => {
      const other = name.toLowerCase();
      const d = distance(lower, other);
      // A name that contains the word (primary → text-primary) counts as near, for words long enough to mean something.
      return { name, d: lower.length >= 4 && other.includes(lower) ? Math.min(d, 1) : d };
    })
    .filter(x => x.d <= max)
    .sort((a, b) => a.d - b.d || a.name.length - b.name.length || a.name.localeCompare(b.name))
    .slice(0, n)
    .map(x => x.name);
}

export const oneLine = (s: string, max = 100) => {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
};
