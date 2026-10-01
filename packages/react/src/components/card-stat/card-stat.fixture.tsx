import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/index.ts';
import { CardFooter, CardMeta, CardSpacer } from '../card/index.ts';
import { CardStat, type CardStatProps } from './card-stat.tsx';

const grid = 'grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*65)),1fr))] items-start gap-3.5';

export default defineFixture({
  id: 'card-stat',
  frame: children => <div className="w-80 bg-bg-canvas p-4">{children}</div>,
  render: props => {
    const p = props as Partial<CardStatProps>;
    return (
      <CardStat
        label="Published views" value="48,210" delta="12.4%" deltaNote="vs last week"
        trend={[6, 8, 7, 12, 11, 16, 14, 20, 19, 25, 27]} trendLabel="Views trend, rising" unit="of 96" {...p}
      />
    );
  },
  examples: {
    'stat-card': () => (
      <div className={grid}>
        <CardStat
          label="Published views" value="48,210" delta="12.4%" deltaNote="vs last week"
          trend={[6, 8, 7, 12, 11, 16, 14, 20, 19, 25, 27]} trendLabel="Views trend, rising"
        />
        <CardStat label="Contrast issues" value="0" unit="of 96" delta="3 fixed" deltaDirection="down" deltaNote="today" />
        <CardStat
          label={<><span aria-hidden className="orb orb-dot" />Agent rounds</>} value="3,912" deltaTone="bad" delta="18%" deltaNote="over budget pace"
        >
          <CardFooter footer="divided">
            <CardMeta>Limit 5,000</CardMeta>
            <CardSpacer />
            <Button tone="ghost" size="xs">Set limit</Button>
          </CardFooter>
        </CardStat>
      </div>
    ),
  },
});
