import { defineFixture } from '../../lib/fixture.ts';
import { TokenDiff, type TokenDiffRow } from './token-diff.tsx';

export const specimenRows: TokenDiffRow[] = [
  { name: 'radius.card', from: '12', to: '20' },
  { name: 'space.card.pad', from: '24', to: '32' },
  { name: 'radius.control', from: '8', to: '10' },
];

export default defineFixture({
  id: 'token-diff',
  render: props => <div className="w-100"><TokenDiff rows={specimenRows} {...props} /></div>,
  examples: {},
});
