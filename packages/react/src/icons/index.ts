// Caustic icons: one import path for every glyph, two candidate sets behind it.
//
//   import { Check, Search } from '@caustic/react/icons'      (inside packages/react: '../../icons/index.ts')
//
// Names follow lucide (Check, ChevronRight, Trash2...), so the lucide call sites moved without edits. Each icon takes lucide's props
// (size, className, aria-*, strokeWidth, which is ignored) plus `emphasis` ('muted' | 'default' | 'selected'), also settable for a subtree
// with <IconEmphasisProvider>.
//
// The set is chosen at build time through the package import '#icon-set' (package.json "imports"):
//   default                      -> ./sets/phosphor.ts
//   condition caustic-icons-solar -> ./sets/solar.ts
// Vite: resolve.conditions [...defaultClientConditions, 'caustic-icons-solar'] (xeon mockups do this from CAUSTIC_ICON_SET=solar).
// Bun: bun build --conditions caustic-icons-solar. Type checking always sees the Phosphor set; sets/parity.ts keeps the names equal.
export type { Icon, IconEmphasis, IconProps, IconSetName } from './lib/types.ts';
export { IconEmphasisProvider, useIconEmphasis, type IconEmphasisProviderProps } from './lib/emphasis.tsx';
export { customIcon } from './lib/custom.tsx';
export * from '#icon-set';
