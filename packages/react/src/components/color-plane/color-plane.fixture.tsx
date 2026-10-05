import { defineFixture } from '../../lib/fixture.ts';
import { ColorPlane } from './color-plane.tsx';

export default defineFixture({
  id: 'color-plane',
  render: props => <div className="w-62"><ColorPlane label="Saturation and brightness" valueText={(s, v) => `Saturation ${s} %, brightness ${v} %`} hue={22} pickedColor="#E2763F" defaultValue={{ s: 0.72, v: 0.89 }} {...props} /></div>,
  examples: {},
});
