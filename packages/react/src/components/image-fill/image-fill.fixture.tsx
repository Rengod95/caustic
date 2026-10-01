import { defineFixture } from '../../lib/fixture.ts';
import { ImageFill } from './image-fill.tsx';

// Placeholder image data (not tokens).
const placeholder = 'radial-gradient(circle at 30% 35%, oklch(.85 .1 70), transparent 40%), radial-gradient(circle at 70% 60%, oklch(.6 .14 30), transparent 50%), linear-gradient(160deg, oklch(.75 .08 230), oklch(.45 .09 260))';

export default defineFixture({
  id: 'image-fill',
  render: props => <ImageFill src={placeholder} fileName="hero-photo.avif" fileMeta="· 2400 × 1600 · 412 KB" {...props} />,
  examples: {
    'image-fill': () => <ImageFill src={placeholder} fileName="hero-photo.avif" fileMeta="· 2400 × 1600 · 412 KB" />,
  },
});
