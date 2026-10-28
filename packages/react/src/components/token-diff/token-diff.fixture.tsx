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
  examples: {
    // A long diff: every second name on a neutral.well band, dotted leaders from each name to its values.
    long: () => (
      <div className="w-120">
        <TokenDiff rows={[
          ...specimenRows,
          { name: 'radius.field', from: '6', to: '8' },
          { name: 'space.stack.md', from: '12', to: '16' },
          { name: 'size.control-md', from: '32', to: '36' },
          { name: 'color.accent.solid', from: 'blue.9', to: 'indigo.9' },
        ]} />
      </div>
    ),
  },
});
