import { defineFixture } from '../../lib/fixture.ts';
import { CheckpointTimeline, CheckpointTimelineItem, type CheckpointTimelineItemProps } from './checkpoint-timeline.tsx';

const items = ({ author, selected, onRestore }: Partial<CheckpointTimelineItemProps> = {}) => (
  <>
    <CheckpointTimelineItem author={author ?? 'agent'} selected={selected} running title="Caustic · spacing and radius" detail="6 tokens · 3 layers" time="now" onRestore={onRestore} />
    <CheckpointTimelineItem selected title="Mina · Pro card copy" detail="2 layers" />
    <CheckpointTimelineItem author="agent" title="Caustic · contrast fixes" detail="2 tokens" time="14m" />
    <CheckpointTimelineItem title="Published v2.3" detail="orbit-pay.caustic.app" time="1h" />
  </>
);

export default defineFixture({
  id: 'checkpoint-timeline',
  render: ({ author, selected, onRestore, ...props }) => (
    <CheckpointTimeline aria-label="Project history" {...props}>{items({ author, selected, onRestore } as Partial<CheckpointTimelineItemProps>)}</CheckpointTimeline>
  ),
  examples: {
    // The confirm step of the destructive action, open.
    'restore-confirm': () => (
      <CheckpointTimeline aria-label="Project history">
        <CheckpointTimelineItem
          selected defaultConfirming title="Mina · Pro card copy" detail="2 layers"
          confirmMessage="Everything changed after this checkpoint is undone. Restoring saves a new checkpoint, so you can undo it from history."
        />
        <CheckpointTimelineItem author="agent" title="Caustic · contrast fixes" detail="2 tokens" time="14m" />
      </CheckpointTimeline>
    ),
    timeline: () => <CheckpointTimeline aria-label="Project history">{items()}</CheckpointTimeline>,
  },
});
