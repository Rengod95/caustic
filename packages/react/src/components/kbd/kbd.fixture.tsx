import { defineFixture } from '../../lib/fixture.ts';
import { Kbd } from './kbd.tsx';

export default defineFixture({ id: 'kbd', render: props => <Kbd {...props}>⌘K</Kbd>, examples: {} });
