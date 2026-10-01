import { Plus, Sparkles } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { InspectorPanel, InspectorSection, InspectorSectionHeader } from './inspector-panel.tsx';

export default defineFixture({
  id: 'inspector-panel',
  render: props => (
    <InspectorPanel aria-label="Inspector" {...props}>
      <InspectorSection>
        <InspectorSectionHeader
          title="Fill"
          actions={<><IconButton size="xs" label="Styles"><Sparkles /></IconButton><IconButton size="xs" label="Add fill"><Plus /></IconButton></>}
        />
        <div className="h-control-md" />
      </InspectorSection>
      <InspectorSection>
        <InspectorSectionHeader title="Effects" />
        <div className="h-control-md" />
      </InspectorSection>
    </InspectorPanel>
  ),
  examples: {},
  frame: children => <div className="w-68">{children}</div>,
});
