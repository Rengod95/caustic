import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge must know Caustic's custom scales so conflicting classes resolve correctly
// (e.g. text-ui vs text-text-primary are different groups: font-size vs color).
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['display', 'title-1', 'title-2', 'title-3', 'body', 'ui', 'ui-strong', 'ui-sm', 'ui-lg', 'footnote', 'caption', 'label', 'voice', 'voice-sm', 'thought', 'mono', 'mono-sm'],
      radius: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', 'full', 'window', 'panel', 'toolbar', 'toolbar-item', 'toast'],
      shadow: ['1', '2', '3', '4', '5', 'focus', 'focus-field'],
      blur: ['control', 'ultrathin', 'thin', 'regular', 'thick', 'overlay'],
    },
  },
});

type ClassValue = string | number | null | undefined | false | ClassValue[] | Record<string, boolean | null | undefined>;

function flatten(input: ClassValue, out: string[]) {
  if (!input) return;
  if (typeof input === 'string' || typeof input === 'number') out.push(String(input));
  else if (Array.isArray(input)) input.forEach(v => flatten(v, out));
  else for (const [k, v] of Object.entries(input)) if (v) out.push(k);
}

/** Joins class values and resolves Tailwind conflicts (last wins). */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  inputs.forEach(v => flatten(v, out));
  return twMerge(out.join(' '));
}
