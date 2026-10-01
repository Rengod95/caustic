import { Lock, RotateCw, SquareDashed, X } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Avatar } from '../avatar/avatar.tsx';
import { Button } from '../button/button.tsx';
import { NumberField } from './number-field.tsx';

export default defineFixture({
  id: 'number-field',
  render: props => <div className="w-50"><NumberField aria-label="X" label="X" unit="px" defaultValue={360} {...props} /></div>,
  examples: {
    states: () => (
      <>
        <div className="grid grid-cols-2 gap-1.5">
          <NumberField label="X" defaultValue={360} aria-label="X" />
          <NumberField label="Y" defaultValue={96} aria-label="Y" />
          <NumberField label={<RotateCw />} defaultValue={0} unit="°" aria-label="Rotation" />
          <NumberField label={<SquareDashed />} defaultValue={12} unit="px" aria-label="Gap" />
          <NumberField label="W" mixed aria-label="Width" />
          <NumberField label="H" defaultValue={-8} invalid aria-label="Height" />
          <NumberField label="R" defaultValue={12} locked trailing={<Lock />} aria-label="Radius" />
          <NumberField label="LH" defaultValue={1.5} trailing={<X />} aria-label="Line height" />
        </div>
        <div className="flex items-center gap-1.5 text-hint text-text-secondary">
          <Avatar name="Mina Kang" size="xs" />Radius is being edited by Mina in another window.
          <Button tone="ghost" size="xs" className="ml-auto">Retry</Button>
        </div>
        <span className="text-hint text-danger-text">Height can’t be negative.</span>
      </>
    ),
  },
});
