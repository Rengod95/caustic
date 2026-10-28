import { defineFixture } from '../../lib/fixture.ts';
import { Plan, type PlanStep } from './plan.tsx';

const specimen: PlanStep[] = [
  { id: 'map', label: 'Map screens from brief', status: 'done' },
  { id: 'pick', label: 'Pick components from library', status: 'done' },
  { id: 'review', label: 'Lay out Review order', status: 'done' },
  { id: 'payment', label: 'Lay out Payment', status: 'now', detail: 'Card form' },
  { id: 'states', label: 'Add error and loading states', status: 'todo' },
  { id: 'contrast', label: 'Check contrast and tap targets', status: 'todo' },
];

// The run stopped at Payment: the step is failed, later steps stay to do.
const failedSpecimen: PlanStep[] = specimen.map(s => (s.id === 'payment' ? { ...s, status: 'failed', detail: 'Card form' } : s));

const countLabel = (d: number, t: number) => `${d} of ${t}`;
const statusLabels = { done: 'Done', now: 'In progress', todo: 'To do', failed: 'Failed' };

export default defineFixture({
  id: 'plan',
  render: props => <div className="w-100"><Plan title="Build checkout flow" steps={specimen} countLabel={countLabel} statusLabels={statusLabels} {...props} /></div>,
  examples: {
    'plan-failed': () => <Plan title="Build checkout flow" steps={failedSpecimen} countLabel={countLabel} statusLabels={statusLabels} />,
    plan: () => <Plan title="Build checkout flow" steps={specimen} countLabel={countLabel} statusLabels={statusLabels} />,
  },
});
