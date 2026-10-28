import { defineFixture } from '../../lib/fixture.ts';
import { ImageFill } from './image-fill.tsx';

// Placeholder image data (not tokens).
const placeholder = 'radial-gradient(circle at 30% 35%, oklch(.85 .1 70), transparent 40%), radial-gradient(circle at 70% 60%, oklch(.6 .14 30), transparent 50%), linear-gradient(160deg, oklch(.75 .08 230), oklch(.45 .09 260))';

export default defineFixture({
  id: 'image-fill',
  render: props => <ImageFill src={placeholder} fileName="hero-photo.avif" fileMeta="· 2400 × 1600 · 412 KB" {...props} />,
  examples: {
    'image-fill': () => <ImageFill src={placeholder} fileName="hero-photo.avif" fileMeta="· 2400 × 1600 · 412 KB" />,
    // A real file name is longer than the specimen one: it truncates, the facts stay whole.
    // Crop in a popover (owner 2026-10-28, option 2): crop mode with the editor open in place under the stage.
    'crop-popover': () => (
      <div className="w-68">
        <ImageFill
          src={placeholder} fileName="hero-photo.avif" fileMeta="· 2400 × 1600 · 412 KB" defaultMode="crop"
          defaultCrop={{ x: 0.18, y: 0.12, w: 0.6, h: 0.7, zoom: 1.25 }} cropPopover={{ inline: true, defaultOpen: true }}
        />
      </div>
    ),
    'long-file-name': () => <div className="w-68"><ImageFill src={placeholder} fileName="2026-10-27-hero-photo-final-export@2x.avif" fileMeta="· 2400 × 1600 · 412 KB" /></div>,
  },
});
