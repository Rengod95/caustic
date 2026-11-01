import { defineFixture } from '../../lib/fixture.ts';
import { LineGrid, LineGridBlock, LineGridCell, LineGridEmpty, LineGridMetric } from './line-grid.tsx';

const columns = [{ id: 'start', label: 'Start' }, { id: 'model', label: 'Model' }, { id: 'tools', label: 'Tools' }];
const rows = [{ id: 'group', label: 'Group', hint: 'L3', group: 'a' }, { id: 'hook', label: 'Hook', hint: 'L2', group: 'a' }, { id: 'core', label: 'Core', hint: 'L1', group: 'b' }];
const data: Record<string, { items: { id: string; label: string; dot?: 'danger' }[] }> = {
  'group:start': { items: [{ id: 'helm', label: 'Helm' }] },
  'group:tools': { items: [{ id: 'review', label: 'Review', dot: 'danger' }] },
  'hook:model': { items: [{ id: 'guard', label: 'Guard' }, { id: 'memory', label: 'Memory' }] },
  'core:start': { items: [{ id: 'loop', label: 'Loop' }] },
  'core:tools': { items: [{ id: 'exec', label: 'Exec' }] },
};
const matrix = (props: Record<string, unknown>) => (
  <div className="w-160">
    <LineGrid label="Layers and stages" columns={columns} rows={rows} cell={(r, c) => data[`${r}:${c}`] ?? null} {...props} />
  </div>
);

export default defineFixture({
  id: 'line-grid',
  render: props => matrix(props),
  examples: {
    matrix: () => matrix({ selected: { row: 'hook', col: 'model' } }),
    metrics: () => (
      <div className="w-160">
        <LineGridBlock columns={3}>
          <LineGridMetric value="12" metricLabel="Plugins on" />
          <LineGridMetric value="3" metricLabel="Waiting" />
          <LineGridEmpty />
          <LineGridCell head span={2}>Compare</LineGridCell>
          <LineGridCell>Current</LineGridCell>
        </LineGridBlock>
      </div>
    ),
  },
});
