import { Link } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { IconToggle } from './icon-toggle.tsx';

export default defineFixture({
  id: 'icon-toggle',
  render: props => <IconToggle aria-label="Lock aspect ratio" {...props}><Link /></IconToggle>,
  examples: {},
});
