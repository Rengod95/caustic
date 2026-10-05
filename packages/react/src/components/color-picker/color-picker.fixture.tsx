import { defineFixture } from '../../lib/fixture.ts';
import { hexToHsv } from '../../lib/color-math.ts';
import { specimenSwatches } from '../../lib/color-specimen.ts';
import { ColorPicker, type ColorPickerLabels, type ColorPickerProps } from './color-picker.tsx';

// #E2763F as hsva: the specimen state (h 22, s .72, v .89) with the digits kept exact.
const orange = { ...(hexToHsv('E2763F') ?? { h: 22, s: 0.72, v: 0.89 }), a: 1 };

const labels: ColorPickerLabels = {
  dialog: 'Color picker',
  tabsGroup: 'Color source',
  tabs: { custom: 'Custom', tokens: 'Tokens' },
  close: 'Close',
  typesGroup: 'Paint type',
  types: { solid: 'Solid', linear: 'Linear', radial: 'Radial', angular: 'Angular', diamond: 'Diamond', image: 'Image' },
  plane: 'Saturation and brightness',
  planeValueText: (saturation, brightness) => `Saturation ${saturation} %, brightness ${brightness} %`,
  eyedropper: 'Eyedropper',
  hue: 'Hue',
  alpha: 'Alpha',
  format: 'Color format',
  hex: 'Hex',
  alphaField: 'Alpha',
  swatchesTitle: 'On this page',
  addSwatch: 'Add swatch',
  mixed: 'Mixed',
};

export default defineFixture({
  id: 'color-picker',
  render: props => <ColorPicker value={orange} swatches={specimenSwatches} labels={labels} {...(props as Partial<ColorPickerProps>)} />,
  examples: {
    'picker-popover': () => (
      <div className="canvas-grid grid place-items-center rounded-xl px-3.5 py-5 [background-size:var(--cs-space-4)_var(--cs-space-4)]">
        <ColorPicker defaultValue={orange} paintType="solid" swatches={specimenSwatches} labels={labels} />
      </div>
    ),
  },
});
