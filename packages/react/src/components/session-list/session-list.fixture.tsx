import { defineFixture } from '../../lib/fixture.ts';
import { SessionList, SessionListItem, type SessionListItemProps } from './session-list.tsx';

const rows = ({ status, current, onClick }: Partial<SessionListItemProps> = {}) => (
  <>
    <SessionListItem status={status ?? 'running'} current={current ?? status === undefined} title="Make pricing feel premium" meta="now" onClick={onClick} />
    <SessionListItem status="review" title="Dark variant for Lagoon" meta="Review" />
    <SessionListItem status="failed" title="Export checkout to React" meta="Failed" />
    <SessionListItem status="done" title="Onboarding empty states" meta="2h" />
    <SessionListItem status="done" title="Audit tap targets on iOS" meta="Mon" />
  </>
);

export default defineFixture({
  id: 'session-list',
  render: ({ status, current, onClick, ...props }) => (
    <SessionList aria-label="Sessions" {...props}>{rows({ status, current, onClick } as Partial<SessionListItemProps>)}</SessionList>
  ),
  examples: {
    sessions: () => <SessionList aria-label="Sessions">{rows()}</SessionList>,
  },
});
