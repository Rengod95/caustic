import { defineFixture } from '../../lib/fixture.ts';
import { hexToHsv } from '../../lib/color-math.ts';
import { specimenSwatches } from '../../lib/color-specimen.ts';
import { ColorPicker } from './color-picker.tsx';

// #E2763F as hsva: the specimen state (h 22, s .72, v .89) with the digits kept exact.
const orange = { ...(hexToHsv('E2763F') ?? { h: 22, s: 0.72, v: 0.89 }), a: 1 };

export default defineFixture({
  id: 'color-picker',
  render: props => <ColorPicker value={orange} swatches={specimenSwatches} {...props} />,
  examples: {
    'picker-popover': () => (
      <div className="canvas-grid grid place-items-center rounded-xl px-3.5 py-5 [background-size:var(--cs-space-4)_var(--cs-space-4)]">
        <ColorPicker defaultValue={orange} paintType="solid" swatches={specimenSwatches} />
      </div>
    ),
  },
});
