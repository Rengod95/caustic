import { Calendar, MoveHorizontal, MoveVertical } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { PickerTrigger } from './picker-trigger.tsx';

export default defineFixture({
  id: 'picker-trigger',
  render: props => (
    <PickerTrigger aria-label="Theme" leading={<Calendar />} placeholder="Choose a theme" {...props}>
      {'children' in props ? (props.children as never) : (
        <>
          Oct 8 – Oct 14, 2026
          {/* Probe node: lets the rest case measure the placeholder slot color next to a value. */}
          <span data-slot="picker-trigger-placeholder" hidden className="text-text-placeholder">Choose a theme</span>
        </>
      )}
    </PickerTrigger>
  ),
  examples: {
    // Was InspectorSelect: the soft (inspector) appearance in a 192px inspector column, the chevron-down indicator.
    'inspector-select': () => (
      <div className="grid w-48 gap-2">
        <PickerTrigger variant="soft" indicator="dropdown" aria-label="Horizontal constraint, Left and right" leading={<MoveHorizontal />}>Left & right</PickerTrigger>
        <PickerTrigger variant="soft" indicator="dropdown" aria-label="Vertical constraint, Top" leading={<MoveVertical />}>Top</PickerTrigger>
        <PickerTrigger variant="soft" indicator="dropdown" aria-label="Distribution, Packed">Packed</PickerTrigger>
      </div>
    ),
  },
});
