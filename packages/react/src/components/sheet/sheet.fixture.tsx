import { Copy, PanelBottom, PanelRight } from '../../icons/index.ts';
import type { ReactNode } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { Checkbox } from '../checkbox/checkbox.tsx';
import { Input } from '../input/input.tsx';
import { Switch } from '../switch/switch.tsx';
import { Sheet } from './sheet.tsx';

// Canvas stage with a scrim over it; the sheet sits inside it. Sizes are token arithmetic.
const sideStage = 'relative h-[calc(var(--cs-size-dialog-sm)-var(--cs-space-5))] w-full overflow-hidden rounded-xl bg-bg-canvas canvas-grid [background-size:var(--cs-space-4)_var(--cs-space-4)]';
const caseStage = 'relative h-[calc(var(--cs-size-dialog-sm)-var(--cs-space-5))] w-[calc(var(--cs-size-sheet-md)*2)] overflow-hidden rounded-xl bg-bg-canvas canvas-grid [background-size:var(--cs-space-4)_var(--cs-space-4)]';
const bottomStage = 'relative mx-auto h-[var(--cs-size-popover-md)] w-full max-w-[calc(var(--cs-size-sheet-md)-var(--cs-space-5))] overflow-hidden rounded-xl bg-bg-canvas canvas-grid [background-size:var(--cs-space-4)_var(--cs-space-4)]';
const scrim = <div aria-hidden className="absolute inset-0 bg-bg-scrim" />;

const Row = ({ children }: { children: ReactNode }) => <div className="flex min-h-7 items-center gap-2.5">{children}</div>;
const Count = ({ children }: { children: ReactNode }) => <span className="text-hint tabular-nums text-text-tertiary">{children}</span>;

export default defineFixture({
  id: 'sheet',
  render: props => (
    <div className={caseStage}>
      {scrim}
      <Sheet
        inline defaultOpen title="Filters"
        footer={<><Button tone="ghost" size="sm">Reset</Button><Button size="sm">Apply</Button></>}
        {...props}
      >
        <p className="text-ui text-text-secondary">Components</p>
      </Sheet>
    </div>
  ),
  examples: {
    side: () => (
      <>
        <div className={sideStage}>
          {scrim}
          <Sheet
            inline defaultOpen title="Filters"
            footer={<><Button tone="ghost" size="sm">Reset</Button><Button size="sm">Show 51</Button></>}
          >
            <Row><Checkbox defaultChecked aria-label="Components" /><span className="min-w-0 flex-1">Components</span><Count>42</Count></Row>
            <Row><Checkbox aria-label="Frames" /><span className="min-w-0 flex-1">Frames</span><Count>18</Count></Row>
            <Row><Checkbox defaultChecked aria-label="Edited by agent" /><span className="min-w-0 flex-1">Edited by agent</span><Count>9</Count></Row>
          </Sheet>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button tone="secondary" size="sm" iconStart={<PanelRight />}>Open side sheet</Button>
          <Button tone="secondary" size="sm" iconStart={<PanelBottom />}>Open bottom sheet</Button>
        </div>
      </>
    ),
    bottom: () => (
      <div className={bottomStage}>
        {scrim}
        <Sheet inline defaultOpen side="bottom" title="Share “Pricing refresh”">
          <Input addons aria-label="Link" prefix="caustic.app/" defaultValue="orbit/pricing" suffix={<button type="button" className="inline-flex items-center gap-1.5 text-ui-strong text-text-primary [&_svg]:size-icon-sm"><Copy />Copy</button>} />
          <Row><span className="min-w-0 flex-1">Anyone with the link can view</span><Switch size="sm" aria-label="Public link" /></Row>
        </Sheet>
      </div>
    ),
  },
});
