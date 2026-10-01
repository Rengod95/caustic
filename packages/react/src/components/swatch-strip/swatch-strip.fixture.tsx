import { defineFixture } from '../../lib/fixture.ts';
import { specimenSwatches } from '../../lib/color-specimen.ts';
import { SwatchStrip } from './swatch-strip.tsx';

export default defineFixture({
  id: 'swatch-strip',
  render: props => <div className="w-62"><SwatchStrip items={specimenSwatches} {...props} /></div>,
  examples: {},
});
