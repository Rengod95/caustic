import { defineFixture } from '../../lib/fixture.ts';
import { ContrastChip, type ContrastChipProps } from './contrast-chip.tsx';

export default defineFixture({
  id: 'contrast-chip',
  render: props => {
    const p = props as Partial<ContrastChipProps>;
    return <ContrastChip level="AA" {...p}>{p.result === 'fail' ? '2.9 : 1 · fails' : '5.1 : 1'}</ContrastChip>;
  },
  examples: {},
});
