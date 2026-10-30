import { customIcon } from './lib/custom.tsx';
import type { Icon } from './lib/types.ts';

// Caustic-drawn glyphs for names Solar has no fitting glyph for. Stroke 1.5 on the 24 grid with round caps, to sit with Solar Linear;
// selected thickens to 2 (customIcon). Hand, LoaderCircle and CornerUpRight follow Lucide's outlines (ISC); see ICONS-NOTICE.md.

/** Text alignment: four lines, the short ones placed by the alignment. */
const lines = (short: 'left' | 'center' | 'right' | 'none') => {
  const x = short === 'left' ? 'M4 10h10M4 18h10' : short === 'right' ? 'M10 10h10M10 18h10' : short === 'center' ? 'M7 10h10M7 18h10' : 'M4 10h16M4 18h16';
  return <path d={`M4 6h16M4 14h16${x}`} />;
};
export const AlignLeft: Icon = customIcon('AlignLeft', lines('left'));
export const AlignCenter: Icon = customIcon('AlignCenter', lines('center'));
export const AlignRight: Icon = customIcon('AlignRight', lines('right'));
export const AlignJustify: Icon = customIcon('AlignJustify', lines('none'));

/** Two overlapping circles (blend modes). */
export const Blend: Icon = customIcon('Blend', (
  <>
    <circle cx="9" cy="12" r="6" />
    <circle cx="15" cy="12" r="6" />
  </>
));

export const Circle: Icon = customIcon('Circle', <circle cx="12" cy="12" r="8.5" />);

/** Four diamonds in a cross (a component). */
export const Component: Icon = customIcon('Component', (
  <path d="M12 3.5l2.5 2.5L12 8.5 9.5 6zM18 9.5l2.5 2.5-2.5 2.5-2.5-2.5zM6 9.5l2.5 2.5L6 14.5 3.5 12zM12 15.5l2.5 2.5-2.5 2.5L9.5 18z" />
));

/** A circle with its right half filled. */
export const Contrast: Icon = customIcon('Contrast', (
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none" />
  </>
));

export const CornerUpRight: Icon = customIcon('CornerUpRight', (
  <>
    <path d="M15 14l5-5-5-5" />
    <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
  </>
));

export const Diamond: Icon = customIcon('Diamond', <path d="M12 3l9 9-9 9-9-9z" />);

export const Hand: Icon = customIcon('Hand', (
  <>
    <path d="M18 11V6a2 2 0 0 0-4 0" />
    <path d="M14 10V4a2 2 0 0 0-4 0v2" />
    <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
  </>
));

export const LoaderCircle: Icon = customIcon('LoaderCircle', <path d="M21 12a9 9 0 1 1-6.219-8.56" />);

export const Octagon: Icon = customIcon('Octagon', <path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3z" />);

/** A triangle, a square and a circle. */
export const Shapes: Icon = customIcon('Shapes', (
  <>
    <path d="M7.5 3.5l4 7h-8z" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    <circle cx="17" cy="7" r="3.5" />
  </>
));

/** A bezier curve between two anchor squares. */
export const Spline: Icon = customIcon('Spline', (
  <>
    <rect x="3" y="16" width="5" height="5" rx="1" />
    <rect x="16" y="3" width="5" height="5" rx="1" />
    <path d="M5.5 16C5.5 9 12 5.5 16 5.5" />
  </>
));

/** The letter T (text tool). */
export const Type: Icon = customIcon('Type', <path d="M5 7V5h14v2M12 5v14M9 19h6" />);
