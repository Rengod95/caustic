import { defineFixture } from '../../lib/fixture.ts';
import { ChangeDetail, ChangeDetailItem, type ChangeDetailItemProps, type ChangeDetailProps } from './change-detail.tsx';

const Changes = ({ kind, ...props }: Partial<ChangeDetailProps> & Pick<Partial<ChangeDetailItemProps>, 'kind'>) => (
  <ChangeDetail aria-label="Changes in this revision" {...props}>
    <ChangeDetailItem kind={kind} path="Pro › fill" from="2B1D14" fromSwatch="#2b1d14" to="accent/solid" toSwatch="var(--cs-color-accent-solid)" />
    <ChangeDetailItem path="Cards › radius" from="12" to="20" />
    <ChangeDetailItem kind="add" path="Pro › Badge" to="Popular" />
    <ChangeDetailItem kind="del" path="Team › Divider" from="Rectangle 14" />
  </ChangeDetail>
);

export default defineFixture({
  id: 'change-detail',
  frame: children => <div className="w-200">{children}</div>,
  render: props => <Changes {...(props as Partial<ChangeDetailProps>)} />,
  examples: {
    'change-detail': () => <Changes />,
  },
});
