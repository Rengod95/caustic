import { Check, Ellipsis, GitBranch } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Badge } from '../badge/badge.tsx';
import { Button } from '../button/button.tsx';
import { CardBody, CardDescription, CardFooter, CardHeader, CardHeading, CardIcon, CardMeta, CardSpacer, CardTitle, CardTrailing } from '../card/card.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { Progress } from '../progress/progress.tsx';
import { TokenChip } from '../token-chip/token-chip.tsx';
import { CardSurface, type CardSurfaceProps } from './card-surface.tsx';

function Meter({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex justify-between text-ui-sm font-normal leading-4.75"><span>{label}</span><b className="font-semibold tabular-nums text-text-primary">{value}</b></div>
      <Progress value={pct} aria-label={label} />
    </div>
  );
}

export default defineFixture({
  id: 'card-surface',
  frame: children => <div className="w-80 bg-bg-app p-4">{children}</div>,
  render: props => (
    <CardSurface {...(props as CardSurfaceProps)}>
      <CardHeader>
        <CardHeading><CardTitle>Team plan</CardTitle><CardDescription>Billed yearly · renews Mar 2027</CardDescription></CardHeading>
      </CardHeader>
      <CardBody><p>Surface card.</p></CardBody>
    </CardSurface>
  ),
  examples: {
    'surface-card': () => (
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*80)),1fr))] items-start gap-3.5">
        <CardSurface>
          <CardHeader>
            <CardHeading><CardTitle>Team plan</CardTitle><CardDescription>Billed yearly · renews Mar 2027</CardDescription></CardHeading>
            <CardTrailing><IconButton size="sm" label="More"><Ellipsis /></IconButton></CardTrailing>
          </CardHeader>
          <CardBody>
            <Meter label="Seats" value="8 / 10" pct={80} />
            <Meter label="Agent rounds" value="3,912 / 5,000" pct={78} />
          </CardBody>
          <CardFooter footer="divided">
            <CardMeta>Resets Nov 1</CardMeta>
            <CardSpacer />
            <Button tone="ghost" size="sm">Manage</Button>
            <Button size="sm">Upgrade</Button>
          </CardFooter>
        </CardSurface>
        <CardSurface>
          <CardHeader headerAlign="center">
            <CardIcon iconTone="accent"><GitBranch /></CardIcon>
            <CardHeading><CardTitle>Lagoon Dark</CardTitle><CardDescription>Inherits Lagoon · 14 overrides</CardDescription></CardHeading>
            <CardTrailing><Badge tone="success" icon={<Check />}>AA</Badge></CardTrailing>
          </CardHeader>
          <CardBody>
            <div className="flex gap-1.5">
              <TokenChip swatch="var(--cs-accent-400)">accent/solid</TokenChip>
              <TokenChip swatch="var(--cs-neutral-900)">surface/base</TokenChip>
              <TokenChip>+12</TokenChip>
            </div>
          </CardBody>
        </CardSurface>
      </div>
    ),
  },
});
