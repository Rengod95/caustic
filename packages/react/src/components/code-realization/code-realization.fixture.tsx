import { defineFixture } from '../../lib/fixture.ts';
import { CodeRealization, CodeRealizationFile, type CodeRealizationFileProps, type CodeRealizationProps } from './code-realization.tsx';

type Probe = Pick<Partial<CodeRealizationFileProps>, 'tone'> & { phase?: 'done' | 'now' | 'todo' };

const labels = [['requested', 'Requested'], ['proposed', 'Proposed'], ['reviewing', 'Reviewing'], ['downloaded', 'Downloaded']] as const;

const Realization = ({ phase, tone, ...props }: Partial<CodeRealizationProps> & Probe) => (
  <CodeRealization
    // The first phase takes the probed state; without a probe the strip follows `current`.
    phases={labels.map(([id, label], i) => ({ id, label, ...(i === 0 && phase ? { phase } : {}) }))}
    current="reviewing" target="web-react" {...props}
  >
    <CodeRealizationFile tone={tone} name="PricingCard.tsx" added={48} removed={6} />
    <CodeRealizationFile name="tokens.css" added={112} />
    <CodeRealizationFile tone="warning" name="limits.md" note="2 limits" />
  </CodeRealization>
);

export default defineFixture({
  id: 'code-realization',
  frame: children => <div className="w-200">{children}</div>,
  render: props => <Realization {...(props as Partial<CodeRealizationProps> & Probe)} />,
  examples: {
    'code-realization': () => <Realization />,
  },
});
