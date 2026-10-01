import { defineFixture } from '../../lib/fixture.ts';
import { Skeleton, type SkeletonProps } from './skeleton.tsx';

export default defineFixture({
  id: 'skeleton',
  render: props => <div className="w-60"><Skeleton {...(props as SkeletonProps)} /></div>,
  examples: {},
});
