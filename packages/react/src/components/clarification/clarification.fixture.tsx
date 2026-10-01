import { defineFixture } from '../../lib/fixture.ts';
import { Clarification, ClarificationOption } from './clarification.tsx';

export default defineFixture({
  id: 'clarification',
  render: ({ defaultValue, ...props }) => (
    <div className="w-100">
      <Clarification question="Should saved cards show the expiry date?" defaultValue={defaultValue as string | undefined} {...props}>
        <ClarificationOption value="show" label="Show expiry" hint="“Visa •••• 4242 · 08/27”" />
        <ClarificationOption value="hide" label="Hide expiry" hint="Shorter rows, details on tap" />
      </Clarification>
    </div>
  ),
  examples: {},
});
