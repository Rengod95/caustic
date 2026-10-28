import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'plan',
  name: 'Plan',
  category: 'agent',
  status: 'ready',
  purpose: 'The live checklist of what the agent will do: a named preset of `<Stepper variant="checklist" tone="agent">` with the plan header (title and "N of M" count).',
  description: 'Plan has no look of its own: the card, the progress edge, the step rows and their marks are Stepper\'s checklist variant (see the stepper spec). Plan adds the header from the Stepper parts and fixes the variant. Steps are data with a required id and status (done, now, todo, failed). Not interactive: the agent advances the plan; people read it.',
  role: 'group',
  slots: [
    { name: 'root', el: 'div', role: 'group', description: 'The Stepper root (variant checklist), named by the title (aria-labelledby).' },
    { name: 'header', el: 'div', parent: 'root', description: 'StepperHeader: title row, space-between; padding 4px 6px 6px.' },
    { name: 'title', el: 'span', parent: 'header', description: 'StepperTitle: plan name, semibold.' },
    { name: 'count', el: 'span', parent: 'header', description: 'StepperCount: "3 of 6", done steps over total, text from countLabel; text.placeholder (one step under tertiary, like the done rows and the end note; owner 2026-10-28, round 4), normal weight, tabular numerals.' },
  ],
  props: {
    title: { type: 'ReactNode', required: true, description: 'Plan name.' },
    steps: { type: "{ id: string; label: ReactNode; status: 'done' | 'now' | 'todo' | 'failed'; detail?: ReactNode }[]", required: true, description: 'Steps in order.' },
    countLabel: { type: '(done: number, total: number) => string', required: true, description: 'Text of the count (e.g. (d, t) => `${d} of ${t}`). No built-in default.' },
    statusLabels: { type: '{ done: string; now: string; todo: string; failed?: string }', required: true, description: 'Visually hidden status word read before each step. failed falls back to "Failed".' },
    tone: { type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'agent'", default: 'agent', description: 'Passed to Stepper: the now mark (agent = the orb).' },
    variant: { type: "'checklist'", default: 'checklist', description: 'Fixed: Plan is always the checklist.' },
    radius: { type: "'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full'", default: 'xl', description: 'Passed to Stepper: card corner.' },
    shadow: { type: "'none' | '1' | '2' | '3' | '4' | '5'", default: 'none', description: 'Passed to Stepper: card elevation (replaces the hairline).' },
    size: { type: "'xs' | 'sm' | 'md' | 'lg'", default: 'md', description: 'Passed to Stepper: step row height and type.' },
  },
  styles: [
    { slot: 'header', expect: { padX: 6, text: 'ui-sm', weight: 600, fg: 'text.primary' }, note: 'Padding is 4px 6px 6px (padY cannot express the asymmetry).' },
    { slot: 'count', expect: { fg: 'text.placeholder', weight: 400 } },
  ],
  behavior: { pointer: ['not interactive'] },
  a11y: {
    notes: [
      'No built-in English: countLabel and statusLabels are required props; the fixture and the example pass d, t => `${d} of ${t}` and { done: "Done", now: "In progress", todo: "To do", failed: "Failed" }.',
      'Status cues, aria-current and the aria-live list come from Stepper.',
    ],
  },
  policies: ['P2', 'P6', 'P8'],
  flags: { agent: true, motionLoop: true },
  composition: { uses: ['stepper'] },
  examples: [{ id: 'plan', title: 'Plan', doc: 'plan#plan' }],
  usage: [
    'Plan = `<Stepper variant="checklist" tone="agent">` with StepperHeader / StepperTitle / StepperCount. Use Plan in the agent transcript; use Stepper directly for other checklists.',
    'Example "plan": title "Build checkout flow"; steps: done "Map screens from brief", done "Pick components from library", done "Lay out Review order", now "Lay out Payment" with detail "Card form", todo "Add error and loading states", todo "Check contrast and tap targets". Count reads "3 of 6". The fixture also has "plan-failed" (Payment failed).',
  ],
});
