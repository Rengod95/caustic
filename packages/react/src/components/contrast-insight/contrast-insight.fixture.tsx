import { defineFixture } from '../../lib/fixture.ts';
import { Alert } from '../alert/alert.tsx';
import { Button } from '../button/button.tsx';
import { ContrastInsight, type ContrastInsightProps } from './contrast-insight.tsx';

const sample = { background: '#b4532a', foreground: '#fff' };

const suggestion = (
  <>
    Darken the fill to <span className="font-mono text-mono">brand/700</span> to reach <b className="font-semibold text-text-primary">7.1 : 1</b> (AAA) without changing the hue.
  </>
);

const actions = (
  <>
    <Button tone="ink" size="xs">Apply</Button>
    <Button tone="ghost" size="xs">Compare</Button>
  </>
);

const note = <Alert tone="info">Text over the hero photo uses a composite background. Check it separately.</Alert>;

export default defineFixture({
  id: 'contrast-insight',
  render: props => {
    // Level-level props (result) apply to the first level.
    const { result, ...rest } = props as Partial<ContrastInsightProps> & { result?: 'pass' | 'warning' | 'fail' };
    return (
      <ContrastInsight
        ratio={4.62} sample={sample} suggestion={suggestion} actions={actions} note={note}
        levels={[{ label: 'AA', pass: result !== 'fail', ...(result ? { result } : {}) }, { label: 'AA large', pass: true }, { label: 'AAA', pass: false }]}
        {...rest}
      />
    );
  },
  frame: children => <div className="w-110">{children}</div>,
  examples: {
    // 3.42 : 1 reaches AA only for large text: that level is the warning badge.
    'text-contrast-large': () => (
      <ContrastInsight
        ratio={3.42} sample={sample}
        levels={[{ label: 'AA', pass: false }, { label: 'AA large', pass: true, result: 'warning' }, { label: 'AAA', pass: false }]}
      />
    ),
    'text-contrast': () => (
      <ContrastInsight
        ratio={4.62} sample={sample} suggestion={suggestion} actions={actions} note={note}
        levels={[{ label: 'AA', pass: true }, { label: 'AA large', pass: true }, { label: 'AAA', pass: false }]}
      />
    ),
  },
});
