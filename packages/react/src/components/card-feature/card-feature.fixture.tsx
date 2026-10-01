import { ArrowUp, Contrast, FileCode, GitBranch, WandSparkles } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { CardBody, CardDescription, CardHeader, CardHeading, CardIcon, CardTitle } from '../card/index.ts';
import { CardFeature, CardFeatureHeadline, CardFeatureVisual, type CardFeatureProps } from './card-feature.tsx';

const bento = 'grid w-full grid-cols-4 auto-rows-[minmax(calc(var(--spacing)*37.5),auto)] gap-3.5 max-[760px]:grid-cols-2 max-[460px]:grid-cols-1';

/** Mock composer: demo content, glass is not part of CardFeature. */
const MockComposer = () => (
  <div className="glass glass-shadow-2 grid w-[86%] gap-1.5 rounded-2xl p-2 font-ui">
    <span className="p-1.5 text-ui-sm text-text-secondary">Make the pricing cards feel premium</span>
    <div className="flex items-center gap-1">
      <span className="flex-1" />
      <button type="button" aria-label="Send" className="grid size-control-sm place-items-center rounded-full bg-ink-solid text-ink-on [&_svg]:size-icon-md">
        <ArrowUp />
      </button>
    </div>
  </div>
);

export default defineFixture({
  id: 'card-feature',
  frame: children => <div className="w-80 bg-bg-canvas p-4">{children}</div>,
  render: props => (
    <CardFeature {...(props as Partial<CardFeatureProps>)}>
      <CardHeader><CardIcon iconTone="accent"><WandSparkles /></CardIcon></CardHeader>
      <CardBody>
        <CardFeatureHeadline>Describe a screen. Review every change.</CardFeatureHeadline>
        <p>The agent drafts frames from your theme and asks before it touches anything shared.</p>
      </CardBody>
      <CardFeatureVisual><MockComposer /></CardFeatureVisual>
    </CardFeature>
  ),
  examples: {
    'feature-card': () => (
      <div className={bento}>
        <CardFeature fill="fill" className="col-span-2 row-span-2 max-[460px]:col-auto max-[460px]:row-auto">
          <CardHeader><CardIcon iconTone="accent"><WandSparkles /></CardIcon></CardHeader>
          <CardBody>
            <CardFeatureHeadline>Describe a screen. Review every change.</CardFeatureHeadline>
            <p>The agent drafts frames from your theme and asks before it touches anything shared.</p>
          </CardBody>
          <CardBody className="flex-1">
            <CardFeatureVisual><MockComposer /></CardFeatureVisual>
          </CardBody>
        </CardFeature>
        <CardFeature className="col-span-2 max-[460px]:col-auto">
          <CardHeader headerAlign="center">
            <CardIcon><Contrast /></CardIcon>
            <CardHeading>
              <CardTitle>Contrast is a build gate</CardTitle>
              <CardDescription>96 rules · 24 hues</CardDescription>
            </CardHeading>
          </CardHeader>
        </CardFeature>
        <CardFeature>
          <CardHeader><CardIcon><GitBranch /></CardIcon></CardHeader>
          <CardBody><CardTitle titleSize="sm">Theme inheritance</CardTitle><p>Override only what differs.</p></CardBody>
        </CardFeature>
        <CardFeature>
          <CardHeader><CardIcon><FileCode /></CardIcon></CardHeader>
          <CardBody><CardTitle titleSize="sm">Code you review</CardTitle><p>React, SwiftUI, tokens.</p></CardBody>
        </CardFeature>
      </div>
    ),
  },
});
