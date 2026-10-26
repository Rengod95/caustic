import { Info, Plus } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Badge } from '../badge/badge.tsx';
import { Button } from '../button/button.tsx';
import { CardSpacer, CardTrailing } from '../card/card.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { CardWell, CardWellFooter, CardWellHeader, CardWellMeta, CardWellPanel, CardWellTitle, type CardWellProps } from './card-well.tsx';

const bars = [30, 45, 38, 62, 54, 70, 88, 20];
const providers = [
  { id: 'a', initial: 'A', name: 'Anthropic', meta: 'Claude · default', live: true },
  { id: 'o', initial: 'O', name: 'OpenAI', meta: 'Not connected', live: false },
];

const grid = 'grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*80)),1fr))] items-start gap-3.5';

function Usage() {
  return (
    <CardWell>
      <CardWellHeader><CardWellTitle>Usage this month</CardWellTitle><CardWellMeta>Oct 2026</CardWellMeta></CardWellHeader>
      <CardWellPanel>
        <div className="grid gap-1"><span className="font-ui text-stat tabular-nums text-text-primary">3,912 <small className="text-ui-lg leading-[inherit] tracking-normal text-text-tertiary">rounds</small></span></div>
        <div className="flex h-11 items-end gap-1" aria-hidden>
          {bars.map((h, i) => (
            <i key={h + '-' + i} style={{ ['--h' as string]: `${h}%` }} className={i === 6 ? 'h-(--h) flex-1 rounded-t-xs rounded-b-[2px] bg-chart-1' : 'h-(--h) flex-1 rounded-t-xs rounded-b-[2px] bg-neutral-track'} />
          ))}
        </div>
      </CardWellPanel>
      <CardWellFooter>
        <CardWellMeta><Info />Resets Nov 1</CardWellMeta>
        <CardSpacer />
        <CardWellMeta href="#" className="text-text-link underline">Details</CardWellMeta>
      </CardWellFooter>
    </CardWell>
  );
}

export default defineFixture({
  id: 'card-well',
  frame: children => <div className="w-80 bg-bg-app p-1">{children}</div>,
  render: props => (
    <CardWell {...(props as CardWellProps)}>
      <CardWellHeader><CardWellTitle>Usage this month</CardWellTitle><CardWellMeta>Oct 2026</CardWellMeta></CardWellHeader>
      <CardWellPanel><p>3,912 rounds</p></CardWellPanel>
      <CardWellFooter><CardWellMeta><Info />Resets Nov 1</CardWellMeta><CardSpacer /><CardWellMeta href="#" className="text-text-link">Details</CardWellMeta></CardWellFooter>
    </CardWell>
  ),
  examples: {
    'well-card': () => (
      <div className={grid}>
        <Usage />
        <CardWell>
          <CardWellHeader><CardWellTitle>Connected providers</CardWellTitle><CardTrailing><IconButton size="xs" label="Add provider"><Plus /></IconButton></CardTrailing></CardWellHeader>
          <CardWellPanel>
            <div className="-mx-inset-regular-x">
              {providers.map(p => (
                <div key={p.id} className="relative flex min-h-13 items-center gap-3 px-3.5 py-2 [&+&]:before:absolute [&+&]:before:inset-x-0 [&+&]:before:left-14.5 [&+&]:before:top-0 [&+&]:before:h-px [&+&]:before:bg-border-subtle">
                  <span aria-hidden className="grid size-8 flex-none place-items-center rounded-lg bg-neutral-well font-ui text-ui-strong text-text-primary">{p.initial}</span>
                  <span className="grid min-w-0 flex-1 gap-px"><b className="truncate font-ui text-ui-md leading-4.75 text-text-primary">{p.name}</b><span className="truncate text-ui-sm font-normal leading-4.75 text-text-tertiary">{p.meta}</span></span>
                  {p.live ? <Badge tone="success" dot>Live</Badge> : <Button tone="secondary" size="xs">Connect</Button>}
                </div>
              ))}
            </div>
          </CardWellPanel>
        </CardWell>
      </div>
    ),
  },
});
