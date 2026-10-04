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
    toasts: () => (
      <>
        <Toast inline title="Published v2.4" description="orbit-pay.caustic.app" actionLabel="Open" />
        <Toast inline tone="agent" title="Dark variant ready" description="14 tokens derived · 0 contrast issues" actionLabel="Review" />
        <Button tone="secondary" size="sm" iconStart={<Bell />} className="w-full">Show a toast</Button>
      </>
    ),
  },
});
