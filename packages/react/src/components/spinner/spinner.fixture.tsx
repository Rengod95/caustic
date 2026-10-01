import { defineFixture } from '../../lib/fixture.ts';
import { Spinner } from './spinner.tsx';

export default defineFixture({ id: 'spinner', render: props => <Spinner {...props} />, examples: {} });
