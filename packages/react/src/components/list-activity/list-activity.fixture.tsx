import { UploadCloud, UserPlus } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Avatar } from '../avatar/avatar.tsx';
import { ListActivity, ListActivityItem, ListActivityStrong as S, type ListActivityProps } from './list-activity.tsx';

const feed = (props: Partial<ListActivityProps> = {}) => (
  <ListActivity {...props}>
    <ListActivityItem avatar={<Avatar kind="agent" name="Caustic" size="md" />} time="2 minutes ago">
      <S>Caustic</S> applied 6 token changes to <S>Pricing / Desktop</S>
    </ListActivityItem>
    <ListActivityItem avatar={<Avatar name="Mina" color="coral" size="md" />} quote="Total should be bold, not the label." time="14 minutes ago">
      <S>Mina</S> commented on <S>Pro card</S>
    </ListActivityItem>
    <ListActivityItem icon={<UploadCloud />} time="1 hour ago">
      Published <S>v2.3</S> to orbit-pay.caustic.app
    </ListActivityItem>
    <ListActivityItem icon={<UserPlus />} time="Yesterday">
      <S>Jun</S> joined as an editor
    </ListActivityItem>
  </ListActivity>
);

export default defineFixture({
  id: 'list-activity',
  render: props => feed(props as Partial<ListActivityProps>),
  examples: {
    'activity-feed': () => <div className="mx-auto w-full max-w-[calc(var(--spacing)*120)]">{feed()}</div>,
  },
});
