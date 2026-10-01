import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/index.ts';
import { CardBody, CardDescription, CardFooter, CardHeader, CardHeading, CardMeta, CardSpacer, CardTitle } from '../card/index.ts';
import { CardAgent, CardAgentOrb, type CardAgentProps } from './card-agent.tsx';

const thumbs = [
  'linear-gradient(150deg, oklch(.72 .08 220), oklch(.42 .09 260))',
  'radial-gradient(circle at 70% 30%, oklch(.82 .12 80), transparent 55%), linear-gradient(200deg, oklch(.62 .14 30), oklch(.4 .08 300))',
  'linear-gradient(120deg, oklch(.86 .08 158), oklch(.6 .1 205))',
];

const Result = (props: Partial<CardAgentProps>) => (
  <CardAgent {...props}>
    <CardHeader headerAlign="center">
      <CardAgentOrb />
      <CardHeading>
        <CardTitle>3 hero variants</CardTitle>
        <CardDescription>Generated from Lagoon · 12s</CardDescription>
      </CardHeading>
    </CardHeader>
    <CardBody>
      <div className="flex flex-nowrap gap-2">
        {thumbs.map(t => (
          <span
            key={t} aria-hidden
            className="h-thumb-md flex-1 rounded-md shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] [background:var(--thumb)]"
            style={{ ['--thumb' as string]: t }}
          />
        ))}
      </div>
    </CardBody>
    <CardFooter footer="divided">
      <CardMeta>Not applied yet</CardMeta>
      <CardSpacer />
      <Button tone="ghost" size="sm">Discard</Button>
      <Button tone="ink" size="sm">Review</Button>
    </CardFooter>
  </CardAgent>
);

export default defineFixture({
  id: 'card-agent',
  frame: children => <div className="w-80 bg-bg-canvas p-4">{children}</div>,
  render: props => <Result {...(props as Partial<CardAgentProps>)} />,
  examples: {
    'agent-card': () => (
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*80)),1fr))] items-start gap-3.5">
        <Result />
      </div>
    ),
  },
});
