import { defineFixture } from '../../lib/fixture.ts';
import { AliasChain, type AliasChainProps } from './alias-chain.tsx';

export default defineFixture({
  id: 'alias-chain',
  render: props => <AliasChain aria-label="Alias chain for button/bg" items={['button/bg', 'accent/solid', 'lagoon/600']} {...(props as Partial<AliasChainProps>)} />,
  examples: {},
});
