import { Calendar } from 'lucide-react';
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
  examples: {},
});
