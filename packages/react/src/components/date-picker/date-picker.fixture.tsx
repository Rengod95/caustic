import { defineFixture } from '../../lib/fixture.ts';
import { Field } from '../field/field.tsx';
import { DatePicker } from './date-picker.tsx';

const range = { from: '2026-10-08', to: '2026-10-14' };

// Cases render the closed picker so the trigger can be clicked; inline cases and the example render the open panel.
export default defineFixture({
  id: 'date-picker',
  render: ({ inline, ...props }) => (
    <div className="w-75"><Field label="Publish window"><DatePicker today="2026-10-01" defaultValue={range} {...props} inline={Boolean(inline)} /></Field></div>
  ),
  examples: {
    'range-calendar': () => (
      <div className="grid w-full max-w-75 gap-4">
        <Field label="Publish window"><DatePicker inline defaultOpen today="2026-10-01" defaultValue={range} /></Field>
      </div>
    ),
  },
});
