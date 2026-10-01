import { defineFixture } from '../../lib/fixture.ts';
import { FontOptions, type FontAxis, type FontFeature } from './font-options.tsx';

const axes: FontAxis[] = [
  { tag: 'wght', label: 'Weight', min: 200, max: 800 },
  { tag: 'opsz', label: 'Optical size', min: 6, max: 72 },
];
const features: FontFeature[] = [
  { tag: 'liga', label: 'Ligatures' },
  { tag: 'tnum', label: 'Tabular' },
  { tag: 'frac', label: 'Fractions' },
  { tag: 'smcp', label: 'Small caps' },
];

export default defineFixture({
  id: 'font-options',
  render: props => <FontOptions cssFamily="Newsreader, serif" axes={axes} features={features} {...props} />,
  examples: {
    'variable-axes-and-opentype': () => <FontOptions cssFamily="Newsreader, serif" axes={axes} features={features} defaultFeatures={['liga']} />,
  },
});
