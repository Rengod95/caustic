import { defineFixture } from '../../lib/fixture.ts';
import { Chip } from '../chip/chip.tsx';
import { ChoiceGroup, ChoiceGroupItem } from '../choice-group/choice-group.tsx';
import { TokenDiff, type TokenDiffRow } from '../token-diff/token-diff.tsx';
import { AgentRequest, AgentRequestCount, AgentRequestProse, AgentRequestSummary, type AgentRequestKind } from './agent-request.tsx';

// ---- kind proposal (was Proposal)
const proposalBody = (
  <>
    <AgentRequestProse>I’ll add a list of up to three saved cards above the form, with an “Add card” row.</AgentRequestProse>
    <AgentRequestSummary>
      <Chip size="sm" appearance="soft">+ 1 component</Chip>
      <Chip size="sm" appearance="soft">4 layers</Chip>
    </AgentRequestSummary>
  </>
);

// ---- kind review (was ReviewRequest)
const reviewTitle = <>Review <AgentRequestCount>9</AgentRequestCount> changes</>;
const changes: TokenDiffRow[] = [
  { name: 'radius.card', from: '12', to: '20' },
  { name: 'space.card.pad', from: '24', to: '32' },
  { name: 'radius.control', from: '8', to: '10' },
];
const reviewBody = (
  <>
    <AgentRequestSummary>
      <Chip size="sm" tone="info">6 tokens</Chip>
      <Chip size="sm" appearance="soft">3 layers</Chip>
      <Chip size="sm" tone="success">AA kept</Chip>
    </AgentRequestSummary>
    <TokenDiff rows={changes} />
  </>
);

const Proposal = (props: Record<string, unknown>) => (
  <AgentRequest kind="proposal" title="Add saved cards" badge="Plan mode" {...props}>{proposalBody}</AgentRequest>
);
const Review = (props: Record<string, unknown>) => (
  <AgentRequest kind="review" title={reviewTitle} subtitle="Caustic · Pricing refresh" {...props}>{reviewBody}</AgentRequest>
);
const Question = (props: Record<string, unknown>) => (
  <AgentRequest kind="question" lead="Question" title="Expiry date" subtitle="Cards chat · 2:41 PM" {...props}>
    <ChoiceGroup appearance="answer" question="Should saved cards show the expiry date?" defaultValue="show">
      <ChoiceGroupItem value="show" title="Show expiry" description="“Visa •••• 4242 · 08/27”" />
      <ChoiceGroupItem value="hide" title="Hide expiry" description="Shorter rows, details on tap" />
    </ChoiceGroup>
  </AgentRequest>
);
const Permission = (props: Record<string, unknown>) => (
  <AgentRequest kind="permission" title="Edit the shared Button component?" subtitle="12 instances in 4 frames will change. You can undo this from history." {...props} />
);

export default defineFixture({
  id: 'agent-request',
  // Cases: kind picks the content; any status other than pending renders the one-line record of that request.
  render: ({ kind, status, ...props }) => {
    const k = (kind ?? 'proposal') as AgentRequestKind;
    if (status != null && status !== 'pending') {
      return (
        <div className="w-100 max-w-full">
          <AgentRequest kind={k} status={status as 'answered'} title="Allowed once" subtitle="Edited 12 instances · 2:41 PM" {...props} />
        </div>
      );
    }
    return <div className="w-100 max-w-full">{k === 'review' ? <Review {...props} /> : k === 'permission' ? <Permission {...props} /> : k === 'question' ? <Question {...props} /> : <Proposal {...props} />}</div>;
  },
  examples: {
    'proposal-proposal-and-clarification': () => (
      <div className="grid gap-3.5">
        <Proposal />
        <ChoiceGroup appearance="answer" question="Should saved cards show the expiry date?" defaultValue="show">
          <ChoiceGroupItem value="show" title="Show expiry" description="“Visa •••• 4242 · 08/27”" />
          <ChoiceGroupItem value="hide" title="Hide expiry" description="Shorter rows, details on tap" />
        </ChoiceGroup>
      </div>
    ),
    'review-request-review-request': () => <Review />,
    'permission-request-permission-request': () => (
      <div className="grid gap-3.5">
        <Permission />
        <AgentRequest kind="permission" status="allowed" title="Allowed once" subtitle="Edited 12 instances · 2:41 PM" />
      </div>
    ),
  },
});
