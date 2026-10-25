import { defineFixture } from '../../lib/fixture.ts';
import { Chip } from '../chip/chip.tsx';
import type { TokenDiffRow } from '../token-diff/token-diff.tsx';
import { ReviewRequest } from './review-request.tsx';

const summary = (
  <>
    <Chip size="sm" tone="info">6 tokens</Chip>
    <Chip size="sm" appearance="soft">3 layers</Chip>
    <Chip size="sm" tone="success">AA kept</Chip>
  </>
);
const changes: TokenDiffRow[] = [
  { name: 'radius.card', from: '12', to: '20' },
  { name: 'space.card.pad', from: '24', to: '32' },
  { name: 'radius.control', from: '8', to: '10' },
];

export default defineFixture({
  id: 'review-request',
  render: props => (
    <div className="w-100 max-w-full"><ReviewRequest title="Review 9 changes" subtitle="Caustic · Pricing refresh" summary={summary} changes={changes} {...props} /></div>
  ),
  examples: {
    'review-request': () => <ReviewRequest title="Review 9 changes" subtitle="Caustic · Pricing refresh" summary={summary} changes={changes} />,
  },
});
