import './react-svg-compat.ts';
import { extendTailwindMerge } from 'tailwind-merge';
import scales from '../../../tokens/dist/tw-merge.json' with { type: 'json' };

// tailwind-merge must know Caustic's named scales so conflicting utilities resolve correctly:
// h-field-md vs h-control-md (same group, last wins), text-ui (size) vs text-text-primary (color).
// The names are generated from the token build, so they never drift from the theme.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: scales.spacing,
      text: scales.text,
      radius: scales.radius,
      shadow: scales.shadow,
      blur: scales.blur,
      color: scales.color,
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
