import { Frame, Hand, MousePointer2, Redo2, Type, Undo2 } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { FloatingBar, FloatingBarItem, FloatingBarSeparator } from '../floating-bar/floating-bar.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { SidePanel } from '../side-panel/side-panel.tsx';
import { AppShell, AppShellEnd, AppShellOverlay, AppShellStage, AppShellStart, AppShellTitlebar, type AppShellProps } from './app-shell.tsx';

type Props = Partial<AppShellProps> & { stageLabel?: string; endCollapsed?: boolean };

const rowNames = ['Frame', 'Header', 'Navigation', 'Content'];

function Rows({ label }: { label: string }) {
  return (
    <div className="grid py-1">
      {rowNames.map(r => <div key={r} className="px-inset-regular-x py-2 font-ui text-ui-md text-text-secondary">{label} · {r}</div>)}
    </div>
  );
}

function Shell({ stageLabel = 'Design canvas', skipLabel = 'Skip to canvas', endCollapsed = false, ...p }: Props) {
  return (
    <div className="h-[480px] w-[1200px]">
      <AppShell skipLabel={skipLabel} {...p}>
        <AppShellTitlebar>
          <span className="font-ui text-title-4 text-text-primary">Axiom</span>
          <IconButton size="sm" label="Undo"><Undo2 /></IconButton>
          <IconButton size="sm" label="Redo"><Redo2 /></IconButton>
        </AppShellTitlebar>
        <AppShellStart>
          <SidePanel label="Layers" title="Layers" size="pane" collapseLabel="Hide layers panel"><Rows label="Layers" /></SidePanel>
        </AppShellStart>
        <AppShellStage stageLabel={stageLabel}>
          <div className="canvas-grid absolute inset-0 [background-size:var(--cs-space-4)_var(--cs-space-4)]" />
          <AppShellOverlay>
            <div className="absolute inset-x-0 bottom-3.5 flex justify-center">
              <FloatingBar label="Canvas tools" size="md">
                <FloatingBarItem aria-label="Move" icon={<MousePointer2 />} active />
                <FloatingBarItem aria-label="Hand" icon={<Hand />} />
                <FloatingBarSeparator />
                <FloatingBarItem aria-label="Frame" icon={<Frame />} />
                <FloatingBarItem aria-label="Text" icon={<Type />} />
              </FloatingBar>
            </div>
          </AppShellOverlay>
        </AppShellStage>
        <AppShellEnd>
          <SidePanel label="Inspector" title="Inspector" side="end" size="inspector" collapseLabel="Hide inspector panel" defaultCollapsed={endCollapsed}>
            <Rows label="Inspector" />
          </SidePanel>
        </AppShellEnd>
      </AppShell>
    </div>
  );
}

export default defineFixture({
  id: 'app-shell',
  render: props => <Shell {...(props as Props)} />,
  examples: {
    wide: () => <Shell layout="wide" />,
    compact: () => <Shell layout="compact" endCollapsed />,
  },
});
