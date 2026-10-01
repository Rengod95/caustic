import { FolderOpen, Plus, SearchX, WandSparkles } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { EmptyState, type EmptyStateProps } from './empty-state.tsx';

export default defineFixture({
  id: 'empty-state',
  render: props => (
    <EmptyState
      icon={<FolderOpen />} title="No projects yet"
      description="Projects hold your frames, themes and agent sessions. Start from a theme or describe a screen."
      actions={<Button size="sm">New project</Button>}
      {...(props as Partial<EmptyStateProps>)}
    />
  ),
  examples: {
    'empty-state': () => (
      <>
        <EmptyState
          icon={<FolderOpen />} title="No projects yet"
          description="Projects hold your frames, themes and agent sessions. Start from a theme or describe a screen."
          actions={(
            <>
              <Button tone="ink" size="sm" iconStart={<Plus />}>New project</Button>
              <Button tone="agent" size="sm" iconStart={<WandSparkles />}>Describe a screen</Button>
            </>
          )}
        />
        <EmptyState
          size="sm" icon={<SearchX />} title="No tokens match “brnd”"
          description="Check the spelling or clear the filter."
          actions={<Button tone="secondary" size="xs">Clear filter</Button>}
        />
      </>
    ),
  },
});
