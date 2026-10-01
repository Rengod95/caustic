import { Ruler } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { TokenChip } from './token-chip.tsx';

export default defineFixture({
  id: 'token-chip',
  render: props => <TokenChip swatch="oklch(0.62 0.16 250)" icon={<Ruler />} {...props}>color.accent.solid</TokenChip>,
  examples: {},
});
