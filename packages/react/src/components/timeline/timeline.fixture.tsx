import { UploadCloud, UserPlus } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { Avatar } from '../avatar/avatar.tsx';
import { Timeline, TimelineItem, TimelineStrong as S, type TimelineItemProps, type TimelineProps } from './timeline.tsx';

type First = Pick<Partial<TimelineItemProps>, 'author' | 'selected' | 'confirmMessage'>;

/** Checkpoints (was CheckpointTimeline): node layout with the item Restore on the selected entry. */
const checkpoints = ({ author, selected, confirmMessage }: First = {}) => (
  <>
    <TimelineItem author={author ?? 'agent'} selected={selected} confirmMessage={confirmMessage} running title="Caustic · spacing and radius" detail="6 tokens · 3 layers" time="now" />
    <TimelineItem selected title="Mina · Pro card copy" detail="2 layers" />
    <TimelineItem author="agent" title="Caustic · contrast fixes" detail="2 tokens" time="14m" />
    <TimelineItem author="system" title="Published v2.3" detail="orbit-pay.caustic.app" time="1h" />
  </>
);

/** Revisions (was RevisionHistory): single choice with the footer Restore. */
const Revisions = ({ author, selected, confirmMessage: _confirm, ...props }: Partial<TimelineProps> & First) => (
  <Timeline aria-label="Revisions" selectionMode="single" restore="footer" defaultValue="pro-card-copy" note="Restore is blocked while a field is being edited." {...props}>
    <TimelineItem itemId="spacing-radius" author={author ?? 'agent'} selected={selected} title="Caustic · spacing and radius" detail="6 tokens · 3 layers" time="2:41" />
    <TimelineItem itemId="pro-card-copy" title="Mina · Pro card copy" detail="2 layers" time="2:36" />
    <TimelineItem itemId="contrast-fixes" author="agent" title="Caustic · contrast fixes" detail="2 tokens" time="2:12" />
    <TimelineItem itemId="v2-3" author="system" title="Published v2.3" detail="orbit-pay.caustic.app" time="1:20" />
    <TimelineItem itemId="figma-import" author="system" title="Imported from Figma" detail="14 frames" time="Mon" />
  </Timeline>
);

/** Activity (was ListActivity): marker layout with avatars, icon discs and a quote. */
const Feed = (props: Partial<TimelineProps>) => (
  <Timeline aria-label="Activity" {...props}>
    <TimelineItem marker={<Avatar kind="agent" name="Caustic" size="md" />} time="2 minutes ago">
      <S>Caustic</S> applied 6 token changes to <S>Pricing / Desktop</S>
    </TimelineItem>
    <TimelineItem marker={<Avatar name="Mina" color="coral" size="md" />} quote="Total should be bold, not the label." time="14 minutes ago">
      <S>Mina</S> commented on <S>Pro card</S>
    </TimelineItem>
    <TimelineItem icon={<UploadCloud />} time="1 hour ago">
      Published <S>v2.3</S> to orbit-pay.caustic.app
    </TimelineItem>
    <TimelineItem icon={<UserPlus />} time="Yesterday">
      <S>Jun</S> joined as an editor
    </TimelineItem>
  </Timeline>
);

export default defineFixture({
  id: 'timeline',
  frame: children => <div className="w-200">{children}</div>,
  // Cases: the checkpoints with restore="item" by default; selectionMode="single" renders the revisions (footer Restore);
  // any marker value renders the activity feed. Item-level props (author, selected, confirmMessage) reach the FIRST entry.
  render: ({ selectionMode, marker, author, selected, confirmMessage, ...props }) => {
    const first = { author, selected, confirmMessage } as First;
    if (selectionMode === 'single') return <Revisions {...(props as Partial<TimelineProps>)} {...first} />;
    if (marker != null) return <Feed {...(props as Partial<TimelineProps>)} />;
    return <Timeline aria-label="Project history" restore="item" {...(props as Partial<TimelineProps>)}>{checkpoints(first)}</Timeline>;
  },
  examples: {
    'checkpoint-timeline-timeline': () => <Timeline aria-label="Project history" restore="item">{checkpoints()}</Timeline>,
    // The confirm step of the destructive action, open.
    'checkpoint-timeline-restore-confirm': () => (
      <Timeline aria-label="Project history" restore="item">
        <TimelineItem
          selected defaultConfirming title="Mina · Pro card copy" detail="2 layers"
          confirmMessage="Everything changed after this checkpoint is undone. Restoring saves a new checkpoint, so you can undo it from history."
        />
        <TimelineItem author="agent" title="Caustic · contrast fixes" detail="2 tokens" time="14m" />
      </Timeline>
    ),
    'revision-history-revisions': () => <Revisions />,
    'list-activity-activity-feed': () => <div className="mx-auto w-full max-w-[calc(var(--spacing)*120)]"><Feed /></div>,
  },
});
