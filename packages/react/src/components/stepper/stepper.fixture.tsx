import { defineFixture } from '../../lib/fixture.ts';
import { Stepper, type StepperProps, type StepperStep } from './stepper.tsx';

const horizontal = [
  { label: 'Brief', description: 'Done' },
  { label: 'Theme', description: 'Lagoon' },
  { label: 'Screens', description: 'In progress' },
  { label: 'Review', description: 'Next' },
];
const vertical = [
  { label: 'Connect a provider', description: 'Anthropic connected.' },
  { label: 'Pick a starting theme', description: 'Choose from 128 themes or generate one from a prompt.' },
  { label: 'Describe your first screen', description: 'The agent drafts it; you review every change.' },
];

// The checklist (the agent plan) specimen.
const checklist: StepperStep[] = [
  { id: 'map', label: 'Map screens from brief', status: 'done' },
  { id: 'pick', label: 'Pick components from library', status: 'done' },
  { id: 'review', label: 'Lay out Review order', status: 'done' },
  { id: 'payment', label: 'Lay out Payment', status: 'now', detail: 'Card form' },
  { id: 'states', label: 'Add error and loading states', status: 'todo' },
  { id: 'contrast', label: 'Check contrast and tap targets', status: 'todo' },
];
// The run stopped at Payment: the step is failed, later steps stay to do.
const checklistFailed = checklist.map(s => (s.id === 'payment' ? { ...s, status: 'failed' as const } : s));
const countLabel = (d: number, t: number) => `${d} of ${t}`;
const statusLabels = { done: 'Done', now: 'In progress', todo: 'To do', failed: 'Failed' };

export default defineFixture({
  id: 'stepper',
  render: props => {
    const p = props as Partial<StepperProps>;
    if (p.variant === 'checklist') {
      // A state probe passes value: the statuses then follow it (value 1 = the first step now).
      const steps = p.value != null ? checklist.map(({ status: _s, ...s }) => s) : checklist;
      return <div className="w-100"><Stepper title="Build checkout flow" countLabel={countLabel} statusLabels={statusLabels} steps={steps} {...p} /></div>;
    }
    return p.orientation === 'vertical'
      ? <Stepper value={2} steps={vertical} {...p} />
      : <Stepper value={3} steps={horizontal} {...p} />;
  },
  examples: {
    stepper: () => (
      <>
        <Stepper value={3} steps={horizontal} />
        <Stepper orientation="vertical" value={2} steps={vertical} />
      </>
    ),
    'stepper-checklist': () => <Stepper variant="checklist" tone="agent" title="Build checkout flow" countLabel={countLabel} statusLabels={statusLabels} steps={checklist} />,
    'stepper-checklist-failed': () => <Stepper variant="checklist" tone="agent" title="Build checkout flow" countLabel={countLabel} statusLabels={statusLabels} steps={checklistFailed} />,
  },
});
