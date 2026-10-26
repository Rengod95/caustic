import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { Progress } from '../progress/progress.tsx';
import { Skeleton } from '../skeleton/skeleton.tsx';
import { Alert, type AlertProps } from './alert.tsx';

export default defineFixture({
  id: 'alert',
  render: props => (
    <div className="w-96">
      <Alert {...(props as Partial<AlertProps>)}>
        <b>2 tokens fail AA in dark.</b> text/tertiary on surface is 3.9 : 1.
      </Alert>
    </div>
  ),
  examples: {
    // All four tones in the subtle emphasis: tint fill, tone border, tone text, graphic icon.
    'alert-tones': () => (
      <>
        <Alert tone="info">Theme changes apply to all 3 themes.</Alert>
        <Alert tone="success"><b>Published v2.4.</b> 42 pairs still meet AA.</Alert>
        <Alert tone="warning"><b>2 tokens fail AA in dark.</b> text/tertiary on surface is 3.9 : 1.</Alert>
        <Alert tone="danger"><b>Export failed.</b> The token file could not be written.</Alert>
      </>
    ),
    feedback: () => (
      <>
        <Alert tone="warning" action={<Button tone="ghost" size="xs">Fix</Button>}>
          <b>2 tokens fail AA in dark.</b> text/tertiary on surface is 3.9 : 1.
        </Alert>
        <Alert tone="info">Theme changes apply to all 3 themes.</Alert>
        <div className="flex flex-col gap-2">
          <Progress aria-label="Upload" value={64} />
          <Progress aria-label="Processing" indeterminate />
          <Progress aria-label="Agent" tone="agent" value={100} />
        </div>
        <div className="flex flex-nowrap items-center gap-2.5">
          <Skeleton width={32} height={32} radius="lg" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton height={10} width="70%" />
            <Skeleton height={10} width="45%" />
          </div>
        </div>
      </>
    ),
  },
});
