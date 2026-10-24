import { defineFixture } from '../../lib/fixture.ts';
import { TokenChip } from '../token-chip/token-chip.tsx';
import { ListDescription, ListDescriptionRow, type ListDescriptionProps, type ListDescriptionRowProps } from './list-description.tsx';

const theme = <TokenChip swatch="var(--cs-accent-6)">Lagoon</TokenChip>;

export default defineFixture({
  id: 'list-description',
  render: raw => {
    const { mono, copyValue, onCopy, term: _term, ...rest } = raw as ListDescriptionProps & Partial<Pick<ListDescriptionRowProps, 'mono' | 'copyValue' | 'onCopy' | 'term'>>;
    return (
      <ListDescription {...rest}>
        <ListDescriptionRow term="Workspace ID" mono={mono} copyValue={copyValue ?? 'ws_8f2a91c4'} onCopy={onCopy}>ws_8f2a91c4</ListDescriptionRow>
        <ListDescriptionRow term="Plan">Team · billed yearly</ListDescriptionRow>
        <ListDescriptionRow term="Default theme">{theme}</ListDescriptionRow>
        <ListDescriptionRow term="Created">Mar 14, 2026 by Mina Kang</ListDescriptionRow>
      </ListDescription>
    );
  },
  examples: {
    'description-list': () => (
      <div className="mx-auto w-full max-w-[calc(var(--spacing)*120)] py-[1em] text-ui">
        <ListDescription>
          <ListDescriptionRow term="Workspace ID" mono copyValue="ws_8f2a91c4">ws_8f2a91c4</ListDescriptionRow>
          <ListDescriptionRow term="Plan">Team · billed yearly</ListDescriptionRow>
          <ListDescriptionRow term="Default theme">{theme}</ListDescriptionRow>
          <ListDescriptionRow term="Created">Mar 14, 2026 by Mina Kang</ListDescriptionRow>
        </ListDescription>
      </div>
    ),
  },
});
