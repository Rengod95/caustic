import { defineFixture } from '../../lib/fixture.ts';
import { PermissionRequest } from './permission-request.tsx';

export default defineFixture({
  id: 'permission-request',
  render: ({ status, ...props }) => (
    <div className="w-100">
      {status === 'allowed'
        ? <PermissionRequest status="allowed" title="Allowed once" description="Edited 12 instances · 2:41 PM" {...props} />
        : <PermissionRequest title="Edit the shared Button component?" description="12 instances in 4 frames will change. You can undo this from history." {...props} />}
    </div>
  ),
  examples: {
    'permission-request': () => (
      <div className="grid gap-3.5">
        <PermissionRequest title="Edit the shared Button component?" description="12 instances in 4 frames will change. You can undo this from history." />
        <PermissionRequest status="allowed" title="Allowed once" description="Edited 12 instances · 2:41 PM" />
      </div>
    ),
  },
});
