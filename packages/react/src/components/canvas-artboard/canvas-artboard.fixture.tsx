import { defineFixture } from '../../lib/fixture.ts';
import { CanvasArtboardSample, type CanvasArtboardSwatches } from './canvas-artboard.sample.tsx';
import { CanvasArtboard } from './canvas-artboard.tsx';

/** Warm neutrals of the specimen wireframes (user content, outside the token set). */
export const artboardSwatches: CanvasArtboardSwatches = {
  ink: 'oklch(.2 .02 50 / .14)',
  mute: 'oklch(.2 .02 50 / .08)',
  paper: 'oklch(.95 .01 70)',
  dark: 'oklch(.22 .02 50)',
  hair: 'oklch(.2 .02 50 / .08)',
  hairStrong: 'oklch(.2 .02 50 / .1)',
};

export default defineFixture({
  id: 'canvas-artboard',
  // The canvas host positions the sheet; the frame stands in for it.
  frame: children => <div className="relative h-80 w-160 overflow-hidden rounded-xl bg-bg-canvas">{children}</div>,
  render: props => (
    <CanvasArtboard rect={{ left: 20, top: 10, width: 560, height: 300 }} {...props}>
      <CanvasArtboardSample swatches={artboardSwatches} />
    </CanvasArtboard>
  ),
  examples: {},
});
