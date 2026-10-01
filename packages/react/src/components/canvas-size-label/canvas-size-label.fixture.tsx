import { defineFixture } from '../../lib/fixture.ts';
import { CanvasSizeLabel } from './canvas-size-label.tsx';

export default defineFixture({
  id: 'canvas-size-label',
  render: ({ children = '180 × 44', ...props }) => <CanvasSizeLabel {...props}>{children as string}</CanvasSizeLabel>,
  examples: {},
});
