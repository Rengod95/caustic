import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { Banner, type BannerProps } from './banner.tsx';

export default defineFixture({
  id: 'banner',
  render: props => (
    <Banner dismissLabel="Dismiss" {...(props as Partial<BannerProps>)}>
      <b>New:</b> themes can now inherit from another theme.
    </Banner>
  ),
  examples: {
    banner: () => (
      <>
        <Banner tone="info" dismissible dismissLabel="Dismiss" action={<Button tone="ghost" size="xs">Learn more</Button>}>
          <b>New:</b> themes can now inherit from another theme.
        </Banner>
        <Banner tone="warning" action={<Button tone="secondary" size="xs">Upgrade</Button>}>
          Your trial ends in 3 days. Projects stay read-only after that.
        </Banner>
        <Banner tone="danger" action={<Button tone="ghost" size="xs">Retry</Button>}>
          Anthropic is not responding. Agent runs are paused.
        </Banner>
        <Banner tone="success" dismissible dismissLabel="Dismiss">Published v2.4 to orbit-pay.caustic.app.</Banner>
      </>
    ),
  },
});
