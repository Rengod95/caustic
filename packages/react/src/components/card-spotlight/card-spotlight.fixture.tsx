import { Layers, SwatchBook, History } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { CardBody, CardHeader, CardIcon, CardTitle } from '../card/index.ts';
import { CardSpotlight, type CardSpotlightProps } from './card-spotlight.tsx';

const grid = 'grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*65)),1fr))] items-start gap-3.5';

export default defineFixture({
  id: 'card-spotlight',
  frame: children => <div className="w-80 bg-bg-canvas p-4">{children}</div>,
  render: props => (
    <CardSpotlight {...(props as Partial<CardSpotlightProps>)}>
      <CardHeader><CardIcon><Layers /></CardIcon></CardHeader>
      <CardBody>
        <CardTitle className="leading-[inherit]">Layers</CardTitle>
        <p>Tree with drop hints, instances and agent marks.</p>
      </CardBody>
    </CardSpotlight>
  ),
  examples: {
    'spotlight-card': () => (
      <div className={grid}>
        <CardSpotlight>
          <CardHeader><CardIcon><Layers /></CardIcon></CardHeader>
          <CardBody><CardTitle className="leading-[inherit]">Layers</CardTitle><p>Tree with drop hints, instances and agent marks.</p></CardBody>
        </CardSpotlight>
        <CardSpotlight>
          <CardHeader><CardIcon><SwatchBook /></CardIcon></CardHeader>
          <CardBody><CardTitle className="leading-[inherit]">Tokens</CardTitle><p>Bindings, graph and theme gallery.</p></CardBody>
        </CardSpotlight>
        <CardSpotlight>
          <CardHeader><CardIcon><History /></CardIcon></CardHeader>
          <CardBody><CardTitle className="leading-[inherit]">History</CardTitle><p>Revisions, diffs and visual compare.</p></CardBody>
        </CardSpotlight>
      </div>
    ),
  },
});
