import { defineFixture } from '../../lib/fixture.ts';
import { Field } from '../field/field.tsx';
import { TagInput } from './tag-input.tsx';

export default defineFixture({
  id: 'tag-input',
  // Wide enough that the centre of the container is the control, not a tag.
  render: props => <div className="w-dialog-md"><TagInput aria-label="Keywords" placeholder="Add keyword" {...props} /></div>,
  examples: {
    'tag-input': () => (
      <div className="grid w-full max-w-[calc(var(--cs-size-dialog-md)-var(--cs-size-control-lg))] gap-4">
        <Field label="Keywords" hint="The agent uses keywords to find related frames.">
          <TagInput defaultValue={['pricing', 'checkout', 'dark mode']} placeholder="Add keyword" />
        </Field>
      </div>
    ),
  },
});
