import { defineFixture } from '../../lib/fixture.ts';
import { ColorTile, type ColorTileProps } from './color-tile.tsx';

const lum = ([r, g, b]: number[]) => {
  const f = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r!) + 0.7152 * f(g!) + 0.0722 * f(b!);
};
const contrast = (a: number[], b: number[]) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi! + 0.05) / (lo! + 0.05); };
const rgb = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

const tile = (name: string, hex: string) => {
  const c = rgb(hex);
  const w = contrast(c, [255, 255, 255]);
  const k = contrast(c, [0, 0, 0]);
  return (
    <ColorTile
      key={name} name={name} color={hex} onColor={w >= k ? '#fff' : '#000'} value={hex}
      audit={[{ against: 'White', ratio: w, pass: w >= 4.5 }, { against: 'Black', ratio: k, pass: k >= 4.5 }]}
    />
  );
};

export default defineFixture({
  id: 'color-tile',
  render: ({ result, ...props }) => (
    <ColorTile
      name="brand/600" color="#B4532A" onColor="#fff" value="#B4532A"
      audit={result === 'fail'
        ? [{ against: 'White', ratio: 4.21, pass: false }, { against: 'Black', ratio: 4.21, pass: false }]
        : [{ against: 'White', ratio: 4.99, pass: true }, { against: 'Black', ratio: 4.21, pass: false }]}
      {...(props as Partial<ColorTileProps>)}
    />
  ),
  examples: {
    'color-tiles': () => (
      <div className="grid grid-cols-2 gap-1.5">
        {tile('brand/600', '#B4532A')}
        {tile('brand/200', '#F7D0A1')}
        {tile('ink/900', '#191C20')}
        {tile('sky/400', '#56A6D9')}
      </div>
    ),
  },
});
