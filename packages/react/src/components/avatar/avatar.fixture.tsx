import { defineFixture } from '../../lib/fixture.ts';
import { Avatar } from './avatar.tsx';

export default defineFixture({ id: 'avatar', render: props => <Avatar name="Mina Kang" {...props} />, examples: {} });
