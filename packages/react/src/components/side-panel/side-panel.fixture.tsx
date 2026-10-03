import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { SidePanel, type SidePanelProps } from './side-panel.tsx';

type Props = Partial<SidePanelProps>;

const rowNames = ['Header', 'Navigation', 'Footer'];

function Rows({ label }: { label: string }) {
  return (
    <div className="grid py-1">
      {rowNames.map(r => <div key={r} className="px-inset-regular-x py-2 font-ui text-ui-md text-text-secondary">{label} · {r}</div>)}
    </div>
  );
}

/** Gate cases share one page, and two landmarks with the same name fail axe; a case without a label gets one from its props. */
function caseLabel(p: Props) {
  const parts = Object.entries(p).filter(([, v]) => typeof v !== 'function' && v !== undefined).map(([k, v]) => `${k} ${String(v)}`);
  return parts.length ? `Layers ${parts.join(' ')}` : 'Layers';
}

function Frame({ side, appearance, children }: { side?: 'start' | 'end'; appearance?: 'floating' | 'docked'; children: ReactNode }) {
  return (
    <div className={`flex h-[480px] w-full bg-bg-canvas ${appearance === 'docked' ? 'p-0' : 'p-2.5'} ${side === 'end' ? 'justify-end' : 'justify-start'}`}>{children}</div>
  );
}

function Pair({ appearance }: { appearance: 'floating' | 'docked' }) {
  return (
    <div className={`flex h-[480px] w-full justify-between bg-bg-canvas ${appearance === 'docked' ? 'p-0' : 'p-2.5'}`}>
      <SidePanel label="Layers" title="Layers" appearance={appearance} size="pane" resizable resizeLabel="Panel width" collapseLabel="Hide layers panel">
        <Rows label="Layers" />
      </SidePanel>
      <SidePanel label="Inspector" title="Inspector" appearance={appearance} side="end" size="inspector" collapseLabel="Hide inspector panel">
        <Rows label="Inspector" />
      </SidePanel>
    </div>
  );
}

export default defineFixture({
  id: 'side-panel',
  render: props => {
    const p = props as Props;
    return (
      <Frame side={p.side ?? undefined} appearance={p.appearance ?? undefined}>
        <SidePanel
          title="Layers"
          collapseLabel="Hide layers panel"
          actions={<IconButton size="xs" label="Add layer"><Plus /></IconButton>}
          footer={<span className="font-ui text-ui-md text-text-tertiary">3 layers</span>}
          {...p}
          label={p.label ?? caseLabel(p)}
        >
          <Rows label="Layers" />
        </SidePanel>
      </Frame>
    );
  },
  examples: {
    floating: () => <Pair appearance="floating" />,
    docked: () => <Pair appearance="docked" />,
  },
});
