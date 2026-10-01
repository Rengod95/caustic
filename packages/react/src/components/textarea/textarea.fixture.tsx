import { ArrowUp, AtSign, Paperclip } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Field } from '../field/field.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { Textarea } from './textarea.tsx';

const toolbar = (
  <>
    <IconButton label="Attach" size="xs"><Paperclip /></IconButton>
    <IconButton label="Mention" size="xs"><AtSign /></IconButton>
  </>
);
const send = <IconButton label="Send" tone="ink" shape="circle" size="sm"><ArrowUp /></IconButton>;

export default defineFixture({
  id: 'textarea',
  render: props => <Textarea aria-label="Message" placeholder="Describe the change you want" actions={toolbar} submit={send} {...props} />,
  examples: {
    textarea: () => (
      <div className="grid w-full max-w-[calc(var(--cs-size-dialog-md)-var(--cs-size-control-lg))] gap-4">
        <Field label="Description" count="58 / 200" hint="Shown to the agent as guidance when it edits this component.">
          <Textarea maxLength={200} rows={3} defaultValue="Primary call to action. Use once per view, never stacked." />
        </Field>
        <Field label="Ask Caustic">
          <Textarea rows={2} placeholder="Describe the change you want" actions={toolbar} submit={send} />
        </Field>
      </div>
    ),
  },
});
