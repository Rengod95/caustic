import { defineFixture } from '../../lib/fixture.ts';
import { Checkbox } from './checkbox.tsx';

export default defineFixture({ id: 'checkbox', render: props => <Checkbox aria-label="High contrast" {...props} />, examples: {} });
