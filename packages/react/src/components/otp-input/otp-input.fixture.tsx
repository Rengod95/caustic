import { defineFixture } from '../../lib/fixture.ts';
import { Field } from '../field/field.tsx';
import { OtpInput } from './otp-input.tsx';

export default defineFixture({
  id: 'otp-input',
  render: props => <OtpInput aria-label="Verification code" {...props} />,
  examples: {
    'otp-input': () => (
      <div className="grid w-full max-w-[calc(var(--cs-size-dialog-md)-var(--cs-size-control-lg))] justify-items-start gap-4">
        <Field group label="Verification code" hint={<>Sent to mina@orbit.co · <a href="#" className="text-text-link">Resend in 0:42</a></>}>
          <OtpInput defaultValue="42" separatorAfter={3} />
        </Field>
      </div>
    ),
  },
});
