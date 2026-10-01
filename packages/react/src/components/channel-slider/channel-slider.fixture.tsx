import { defineFixture } from '../../lib/fixture.ts';
import { ChannelSlider } from './channel-slider.tsx';

export default defineFixture({
  id: 'channel-slider',
  render: props => <div className="w-96"><ChannelSlider note="Each track paints the real color range of its channel." {...props} /></div>,
  examples: {
    oklch: () => (
      <ChannelSlider
        className="gap-3.5"
        defaultValue={{ l: 0.66, c: 0.17, h: 42 }}
        note={<span className="block leading-4.25">각 트랙은 다른 두 채널을 고정한 채 해당 채널만 바꾼 실제 색 범위를 그립니다. sRGB 밖으로 나가는 구간은 브라우저가 매핑합니다.</span>}
      />
    ),
  },
});
