import { customIcon } from './lib/custom.tsx';
import type { Icon } from './lib/types.ts';

// Glyphs Solar does not draw (caustic-specific shapes).

/** The space bar (a tray under the baseline). */
export const Space: Icon = customIcon('Space', <path d="M4 14v3.5h16V14" />);

/** Activity-tree call arrow: lucide corner-down-right (ISC) with a tighter 1.5 elbow (owner 2026-10-27). See ICONS-NOTICE.md. */
export const CallArrow: Icon = customIcon('CallArrow', (
  <>
    <path d="M15 10l5 5-5 5" />
    <path d="M4 4v9.5a1.5 1.5 0 0 0 1.5 1.5H20" />
  </>
));
