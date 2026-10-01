import { Undo2 } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Tooltip } from './tooltip.tsx';

export default defineFixture({
  id: 'tooltip',
  // Cases render the bubble open so anatomy and styles can be measured; behavior scenarios
  // (delayDuration 0) start from the props they set.
  render: ({ shortcut = '⌘Z', ...props }) => (
    <div className="grid h-24 w-48 place-items-end justify-center">
      <Tooltip content="Undo" shortcut={shortcut as string} inline {...props} defaultOpen={props.delayDuration === 0 ? (props.defaultOpen as boolean) : true}>
        <button type="button" aria-label="Undo" className="inline-grid size-control-md place-items-center rounded-md text-text-secondary [&_svg]:size-icon-md"><Undo2 /></button>
      </Tooltip>
    </div>
  ),
  examples: {},
});
