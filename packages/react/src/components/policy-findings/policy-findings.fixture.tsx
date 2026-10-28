import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { PolicyFindings, PolicyFindingsItem, type PolicyFindingsItemProps, type PolicyFindingsProps } from './policy-findings.tsx';

const summary = { errors: 1, warnings: 2, passes: 38 };

const findings = (severity?: PolicyFindingsItemProps['severity']) => (
  <>
    <PolicyFindingsItem
      severity={severity} title="Literal color in a component" location="Button / Ghost › hover › fill"
      action={<Button tone="agent" variant="soft" size="xs" aria-label="Fix: Literal color in a component">Fix</Button>}
    />
    <PolicyFindingsItem
      severity="warning" title="Radius not concentric" location="Card › Media · 16 inside 12"
      action={<Button tone="neutral" variant="soft" size="xs" aria-label="Show: Radius not concentric">Show</Button>}
    />
    <PolicyFindingsItem
      severity="warning" title="Deprecated token in use" location="color/brand/legacy × 4"
      action={<Button tone="neutral" variant="soft" size="xs" aria-label="Migrate: Deprecated token in use">Migrate</Button>}
    />
    <PolicyFindingsItem severity="pass" title="All text meets AA" location="42 pairs · 3 themes" />
  </>
);

export default defineFixture({
  id: 'policy-findings',
  render: props => {
    // Item-level props (severity) apply to the first finding.
    const { severity, ...rest } = props as Partial<PolicyFindingsProps> & Pick<PolicyFindingsItemProps, 'severity'>;
    return <PolicyFindings summary={summary} aria-label="Policy findings" {...rest}>{findings(severity)}</PolicyFindings>;
  },
  frame: children => <div className="w-110">{children}</div>,
  examples: {
    'policy-findings': () => <PolicyFindings summary={summary} aria-label="Policy findings">{findings()}</PolicyFindings>,
  },
});
