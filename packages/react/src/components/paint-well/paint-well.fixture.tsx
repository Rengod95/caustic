import { defineFixture } from '../../lib/fixture.ts';
import { PaintWell, type PaintWellLabels } from './paint-well.tsx';

const labels: PaintWellLabels = { well: 'Fill color', hex: 'Fill hex', alpha: 'Fill opacity', detach: 'Detach', mixed: 'Mixed' };
const hint = 'Use 3, 4, 6 or 8 hex digits.';

export default defineFixture({
  id: 'paint-well',
  render: props => <div className="w-70"><PaintWell labels={labels} message={hint} invalidMessage={hint} {...props} /></div>,
  examples: {
    'paint-well-control': () => (
      <div className="flex flex-col gap-2">
        <PaintWell labels={labels} defaultValue={{ hex: 'E2763F', alpha: 100 }} />
        <PaintWell labels={labels} defaultValue={{ hex: '5F4994', alpha: 40 }} />
        <PaintWell labels={labels} token="accent/solid" tokenColor="var(--cs-color-accent-solid)" />
        <PaintWell labels={labels} mixed />
        <PaintWell labels={labels} invalid defaultValue={{ hex: 'E2763', alpha: 100 }} message={hint} />
      </div>
    ),
  },
});
