import { defineFixture } from '../../lib/fixture.ts';
import { ImportPanel, type ImportPanelProps } from './import-panel.tsx';

const Import = (props: Partial<ImportPanelProps>) => <ImportPanel defaultUrl="https://orbit-pay.com/pricing" {...props} />;

export default defineFixture({
  id: 'import-panel',
  frame: children => <div className="w-200">{children}</div>,
  render: props => <Import {...(props as Partial<ImportPanelProps>)} />,
  examples: {
    import: () => <Import />,
  },
});
