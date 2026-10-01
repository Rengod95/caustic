import type { CSSProperties } from 'react';

const sw = (v: Record<string, string>) => v as CSSProperties;

/** Sample colors are user content outside the token set: the fixtures pass them in and they reach the shapes as custom properties. */
export interface CanvasArtboardSwatches { ink: string; mute: string; paper: string; dark: string; hair: string; hairStrong: string }

/**
 * Sample wireframes for fixtures: rounded bars, a card and two buttons inside a 560 x 300 artboard.
 * Drawn as SVG so the user content keeps its own corner radii (the artboard itself is a sharp sheet).
 */
export const CanvasArtboardSample = ({ swatches: c }: { swatches: CanvasArtboardSwatches }) => (
  <svg aria-hidden className="absolute inset-0 size-full" viewBox="0 0 560 300">
    <rect x="28" y="26" width="180" height="12" rx="6" className="fill-(--c)" style={sw({ '--c': c.ink })} />
    <rect x="28" y="50" width="260" height="8" rx="4" className="fill-(--c)" style={sw({ '--c': c.mute })} />
    <rect x="28.5" y="104.5" width="209" height="149" rx="13.5" className="fill-(--c) stroke-(--s)" style={sw({ '--c': c.paper, '--s': c.hair })} />
    <rect x="238" y="104" width="180" height="44" rx="10" className="fill-(--c)" style={sw({ '--c': c.dark })} />
    <rect x="238.5" y="160.5" width="179" height="43" rx="9.5" className="fill-(--c) stroke-(--s)" style={sw({ '--c': c.paper, '--s': c.hairStrong })} />
  </svg>
);
