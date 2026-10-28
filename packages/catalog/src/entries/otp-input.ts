import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'otp-input',
  intent: 'Enter a short verification code one character per cell; pasting fills every cell.',
  roles: ['input.text'],
  placement: ['form', 'overlay', 'page'],
  keywords: ['one-time password', 'verification code', '2FA', 'MFA', 'pin code', 'pin input', 'auth code', 'sign-in code'],
  pairs: ['field', 'button', 'dialog'],
  consider: [
    { id: 'input', when: 'the code is long, free form or pasted from elsewhere as one string' },
  ],
  guidance: [
    'Six cells split 3–3 is the usual pattern.',
    'Put where the code was sent and when it can be resent in the Field hint under the group.',
    'Mark every cell invalid together and keep the message in the Field, not inside a cell.',
  ],
});
