import { defineFixture } from '../../lib/fixture.ts';
import { HexInput } from './hex-input.tsx';

export default defineFixture({
  id: 'hex-input',
  render: props => <div className="w-50"><HexInput aria-label="Hex" defaultValue="E2763F" {...props} /></div>,
  examples: {},
});
