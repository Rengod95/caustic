import {
  FileImage, FolderOpen, Frame, ImagePlus, LayoutTemplate, PenTool, Plus, SearchX, Shapes, SwatchBook, Upload, WandSparkles,
} from '../../icons/index.ts';
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
    // Media in place of the tile (three icons) and three action objects on the ladder: ink, secondary, quiet.
    'empty-state-media': () => (
      <EmptyState
        media={<><Frame /><Shapes /><FileImage /></>}
        title="No frames on this page"
        description="Add a frame, import a design, or start from a template."
        actions={[
          { label: 'New frame', icon: <Plus /> },
          { label: 'Import', icon: <Upload /> },
          { label: 'Browse templates', icon: <LayoutTemplate /> },
        ]}
      />
    ),
    // The agent preset (was CanvasEmpty): orb, serif prompt, tertiary help, the canvas dot grid.
    'canvas-empty-empty-canvas': () => (
      <EmptyState
        variant="agent"
        title="What are we designing today?"
        description="Describe a screen, paste a reference, or pick a theme to start from."
        actions={(
          <>
            <Button tone="agent" size="sm" iconStart={<WandSparkles />}>Describe a screen</Button>
            <Button tone="secondary" size="sm" iconStart={<SwatchBook />}>Browse themes</Button>
          </>
        )}
      />
    ),
    // The agent preset with media in place of the orb and three action objects on the agent ladder: agent, secondary, quiet.
    'canvas-empty-empty-canvas-media': () => (
      <EmptyState
        variant="agent"
        media={<><Frame /><PenTool /><LayoutTemplate /></>}
        title="Start from a frame"
        description="Draw a frame, drop an image, or let Caustic lay out a first screen."
        actions={[
          { label: 'Describe a screen', icon: <WandSparkles /> },
          { label: 'Import image', icon: <ImagePlus /> },
          { label: 'Upload file', icon: <Upload /> },
        ]}
      />
    ),
    // Independent props: the dashed region with the orb and the serif voice (an agent empty panel, e.g. layers).
    'empty-state-mixed': () => (
      <EmptyState
        mark="orb" voice surface="dashed"
        title="Nothing on this layer yet"
        description="Ask the agent to fill it, or draw a frame."
        actions={[
          { label: 'Ask the agent', icon: <WandSparkles /> },
          { label: 'New frame', icon: <Frame /> },
        ]}
      />
    ),
  },
});
