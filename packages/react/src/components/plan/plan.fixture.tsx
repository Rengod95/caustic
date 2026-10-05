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

const countLabel = (d: number, t: number) => `${d} of ${t}`;
const statusLabels = { done: 'Done', now: 'In progress', todo: 'To do' };

export default defineFixture({
  id: 'plan',
  render: ({ status, ...props }) => {
    const steps = status ? specimen.map((s, i) => (i === 0 ? { ...s, status: status as PlanStep['status'] } : s)) : specimen;
    return <div className="w-100"><Plan title="Build checkout flow" steps={steps} countLabel={countLabel} statusLabels={statusLabels} {...props} /></div>;
  },
  examples: {
    plan: () => <Plan title="Build checkout flow" steps={specimen} countLabel={countLabel} statusLabels={statusLabels} />,
  },
});
