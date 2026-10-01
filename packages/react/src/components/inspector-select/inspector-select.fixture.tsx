import { MoveHorizontal } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { InspectorSelect } from './inspector-select.tsx';

export default defineFixture({
  id: 'inspector-select',
  render: props => (
    <InspectorSelect aria-label="Horizontal constraint, Left and right" leading={<MoveHorizontal />} {...props}>
      {'children' in props ? (props.children as never) : 'Left & right'}
    </InspectorSelect>
  ),
  examples: {},
  frame: children => <div className="w-48">{children}</div>,
});
