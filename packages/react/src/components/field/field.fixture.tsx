import { defineFixture } from '../../lib/fixture.ts';
import { Input } from '../input/input.tsx';
import { Field } from './field.tsx';

export default defineFixture({
  id: 'field',
  render: props => <Field label="Project name" hint="Shown in the share link and the browser tab." {...props}><Input defaultValue="Orbit Pay" /></Field>,
  examples: {},
});
