import { defineFixture } from '../../lib/fixture.ts';
import { Chip } from '../chip/chip.tsx';
import { Clarification, ClarificationOption } from '../clarification/clarification.tsx';
import { Proposal } from './proposal.tsx';

const chips = (
  <>
    <Chip size="sm" appearance="soft">+ 1 component</Chip>
    <Chip size="sm" appearance="soft">4 layers</Chip>
  </>
);

export default defineFixture({
  id: 'proposal',
  render: props => (
    <div className="w-100 max-w-full">
      <Proposal title="Add saved cards" badge="Plan mode" chips={chips} {...props}>I’ll add a list of up to three saved cards above the form, with an “Add card” row.</Proposal>
    </div>
  ),
  examples: {
    'proposal-and-clarification': () => (
      <div className="grid gap-3.5">
        <Proposal title="Add saved cards" badge="Plan mode" chips={chips}>I’ll add a list of up to three saved cards above the form, with an “Add card” row.</Proposal>
        <Clarification question="Should saved cards show the expiry date?" defaultValue="show">
          <ClarificationOption value="show" label="Show expiry" hint="“Visa •••• 4242 · 08/27”" />
          <ClarificationOption value="hide" label="Hide expiry" hint="Shorter rows, details on tap" />
        </Clarification>
      </div>
    ),
  },
});
