import { defineFixture } from '../../lib/fixture.ts';
import { GridTracks, type GridTracksProps } from './grid-tracks.tsx';

// The Auto track comes first so the first unit item (probed by the base rule) is an inactive one;
// the selected state passes its own tracks.
const tracks = [{ size: null, unit: 'auto' as const }, { size: 1, unit: 'fr' as const }, { size: 240, unit: 'px' as const }];

export default defineFixture({
  id: 'grid-tracks',
  render: props => (
    <div className="w-68">
      <GridTracks heading="Grid tracks" addLabel="Add column" trackLabel={n => `Track ${n}`} unitLabel={n => `Track ${n} unit`} removeLabel={n => `Remove track ${n}`} autoLabel="Auto" defaultTracks={tracks} {...(props as Partial<GridTracksProps>)} />
    </div>
  ),
  examples: {},
});
