import { defineFixture } from '../../lib/fixture.ts';
import { RevisionHistory, RevisionHistoryItem, type RevisionHistoryItemProps, type RevisionHistoryProps } from './revision-history.tsx';

const History = ({ author, selected, ...props }: Partial<RevisionHistoryProps> & Pick<Partial<RevisionHistoryItemProps>, 'author' | 'selected'>) => (
  <RevisionHistory aria-label="Revisions" defaultValue="pro-card-copy" note="Restore is blocked while a field is being edited." {...props}>
    <RevisionHistoryItem itemId="spacing-radius" author={author ?? 'agent'} selected={selected} title="Caustic · spacing and radius" detail="6 tokens · 3 layers" time="2:41" />
    <RevisionHistoryItem itemId="pro-card-copy" title="Mina · Pro card copy" detail="2 layers" time="2:36" />
    <RevisionHistoryItem itemId="contrast-fixes" author="agent" title="Caustic · contrast fixes" detail="2 tokens" time="2:12" />
    <RevisionHistoryItem itemId="v2-3" title="Published v2.3" detail="orbit-pay.caustic.app" time="1:20" />
    <RevisionHistoryItem itemId="figma-import" title="Imported from Figma" detail="14 frames" time="Mon" />
  </RevisionHistory>
);

export default defineFixture({
  id: 'revision-history',
  frame: children => <div className="w-200">{children}</div>,
  render: props => <History {...(props as Partial<RevisionHistoryProps>)} />,
  examples: {
    revisions: () => <History />,
  },
});
