import { Sun } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { CardBody, CardDescription, CardFooter, CardHeader, CardHeading, CardIcon, CardMeta, CardTitle, CardTrailing } from '../card/card.tsx';
import { Progress } from '../progress/progress.tsx';
import { Switch } from '../switch/switch.tsx';
import { CardGlass, type CardGlassProps } from './card-glass.tsx';

// The stage art is a runtime value: it enters through a custom property.
const stage = 'radial-gradient(circle at 18% 22%, oklch(.78 .13 205 / .9), transparent 42%), radial-gradient(circle at 82% 30%, oklch(.82 .12 80 / .85), transparent 40%), radial-gradient(circle at 55% 95%, oklch(.7 .14 158 / .7), transparent 45%), var(--cs-color-bg-canvas)';
const stageStyle = { ['--stage' as string]: stage };

export default defineFixture({
  id: 'card-glass',
  frame: children => <div className="w-80 overflow-hidden rounded-3xl p-5 [background:var(--stage)]" style={stageStyle}>{children}</div>,
  render: props => (
    <CardGlass {...(props as CardGlassProps)}>
      <CardHeader><CardHeading><CardTitle>Now playing</CardTitle><CardDescription>Agent session · Pricing refresh</CardDescription></CardHeading></CardHeader>
    </CardGlass>
  ),
  examples: {
    'glass-card': () => (
      <div className="relative grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,calc(var(--spacing)*65)),1fr))] items-start gap-3.5 overflow-hidden rounded-3xl p-7 [background:var(--stage)]" style={stageStyle}>
        <CardGlass>
          <CardHeader>
            <CardHeading><CardTitle>Now playing</CardTitle><CardDescription>Agent session · Pricing refresh</CardDescription></CardHeading>
            <span aria-hidden className="orb" />
          </CardHeader>
          <CardBody>
            <Progress tone="agent" value={62} aria-label="Step 3 of 4" />
            <CardMeta className="leading-4.75">Step 3 of 4 · Apply spacing and radius</CardMeta>
          </CardBody>
          <CardFooter footer="end"><Button tone="secondary" size="sm">Pause</Button><Button size="sm">Open</Button></CardFooter>
        </CardGlass>
        <CardGlass>
          <CardHeader headerAlign="center">
            <CardIcon><Sun /></CardIcon>
            <CardHeading><CardTitle>Light theme</CardTitle><CardDescription>Preview over the canvas</CardDescription></CardHeading>
            <CardTrailing><Switch defaultChecked aria-label="Light theme" /></CardTrailing>
          </CardHeader>
        </CardGlass>
      </div>
    ),
  },
});
