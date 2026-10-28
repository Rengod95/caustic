import { Bell } from 'lucide-react';
import { useId } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { Toast, ToastViewport, type ToastProps } from './toast.tsx';

// Each generated case renders its own region, so the label is made unique to keep landmarks distinguishable.
function CaseRegion(props: Partial<ToastProps>) {
  const id = useId();
  return (
    <ToastViewport label={`Notifications ${id}`} className="static w-80">
      <Toast title="Published v2.4" description="orbit-pay.caustic.app" {...props} />
    </ToastViewport>
  );
}

export default defineFixture({
  id: 'toast',
  render: props => <CaseRegion {...(props as Partial<ToastProps>)} />,
  examples: {
    // A failure: danger mark and text, no auto-dismiss.
    'toast-failed': () => <Toast inline tone="danger" statusLabel="Failed" title="Publish failed" description="orbit-pay.caustic.app is unreachable" actionLabel="Retry" />,
    // Every status tone: solid mark with its on-colour glyph; the action stays a ghost (text emphasis) in all of them.
    'toast-tones': () => (
      <>
        <Toast inline title="Published v2.4" description="orbit-pay.caustic.app" actionLabel="Open" />
        <Toast inline tone="info" title="Sync paused" description="Reconnects when you are back online" actionLabel="Details" />
        <Toast inline tone="warning" title="2 tokens fail AA in dark" description="text/tertiary on surface is 3.9 : 1" actionLabel="Fix" />
        <Toast inline tone="danger" statusLabel="Failed" title="Publish failed" description="orbit-pay.caustic.app is unreachable" actionLabel="Retry" />
      </>
    ),
    // The optional close button (dismissLabel): after the action, or alone at the end.
    'toast-dismiss': () => (
      <>
        <Toast inline title="Published v2.4" description="orbit-pay.caustic.app" actionLabel="Open" dismissLabel="Dismiss" />
        <Toast inline tone="info" title="Sync paused" description="Reconnects when you are back online" dismissLabel="Dismiss" />
      </>
    ),
    toasts: () => (
      <>
        <Toast inline title="Published v2.4" description="orbit-pay.caustic.app" actionLabel="Open" />
        <Toast inline tone="agent" title="Dark variant ready" description="14 tokens derived · 0 contrast issues" actionLabel="Review" />
        <Button tone="secondary" size="sm" iconStart={<Bell />} className="w-full">Show a toast</Button>
      </>
    ),
  },
});
