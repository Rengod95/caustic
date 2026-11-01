import { SquareStack } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { ColorWell } from '../color-well/color-well.tsx';
import { NumberField } from '../number-field/number-field.tsx';
import { StackRow } from './stack-row.tsx';

export default defineFixture({
  id: 'stack-row',
  render: ({ lead, leading, ...props }) => (
    <StackRow
      hideLabel="Hide" showLabel="Show" removeLabel="Remove"
      title="Linear"
      meta="2 stops"
      lead={lead === 'icon' ? 'icon' : 'swatch'}
      leading={lead === 'icon' ? <SquareStack /> : <ColorWell size="sm" color="linear-gradient(90deg, #e2763f, #5f4994)" />}
      control={lead === 'icon' ? undefined : <NumberField aria-label="Opacity" unit="%" defaultValue={100} containerClassName="w-field-alpha-w" />}
      {...props}
    />
  ),
  examples: {},
});
