import { useId } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { Pagination, type PaginationProps } from './pagination.tsx';

// Each generated case renders its own landmark, so the label is made unique to keep landmarks distinguishable.
function CaseNav(props: Partial<PaginationProps>) {
  const label = `Pagination ${useId()}`;
  return props.layout === 'compact'
    ? <div className="w-96"><Pagination aria-label={label} total={236} pageSize={20} itemLabel="tokens" defaultValue={2} {...props} /></div>
    : <Pagination aria-label={label} pageCount={12} defaultValue={2} {...props} />;
}

export default defineFixture({
  id: 'pagination',
  render: props => <CaseNav {...(props as Partial<PaginationProps>)} />,
  examples: {
    pagination: () => (
      <>
        <Pagination pageCount={12} value={2} />
        <Pagination layout="compact" total={236} pageSize={20} itemLabel="tokens" value={2} />
      </>
    ),
  },
});
