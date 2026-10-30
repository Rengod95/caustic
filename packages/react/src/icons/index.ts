// Caustic icons: one import path for every glyph. The set is Solar (owner 2026-10-30): Linear for muted and default, Bold for selected.
//
//   import { Check, Search } from '@caustic/react/icons'      (inside packages/react: '../../icons/index.ts')
//
// Names follow lucide (Check, ChevronRight, Trash2...), so the lucide call sites moved without edits. Each icon takes lucide's props
// (size, className, aria-*, strokeWidth, which is ignored) plus `emphasis` ('muted' | 'default' | 'selected'), also settable for a subtree
// with <IconEmphasisProvider>. Names Solar has no glyph for are caustic-drawn (./gaps.tsx). Solar is CC BY 4.0: see ICONS-NOTICE.md.
export type { Icon, IconEmphasis, IconProps, IconSetName } from './lib/types.ts';
export { IconEmphasisProvider, useIconEmphasis, type IconEmphasisProviderProps } from './lib/emphasis.tsx';
export { customIcon } from './lib/custom.tsx';
export * from './sets/solar.ts';
