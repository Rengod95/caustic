import { FileUp, Monitor, Plus, Smartphone } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { CardBody, CardDescription, CardHeader, CardHeading, CardIcon, CardSpacer, CardTitle } from '../card/index.ts';
import { CardAction, CardActionArrow, CardActionIndicator, type CardActionProps } from './card-action.tsx';

const grid = 'grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*65)),1fr))] items-start gap-3.5';

export default defineFixture({
  id: 'card-action',
  frame: children => <div className="w-80 bg-bg-canvas p-4">{children}</div>,
  render: props => {
    const p = props as Partial<CardActionProps>;
    if (p.kind === 'radio') {
      return (
        <CardAction {...p}>
          <CardHeader headerAlign="center">
            <CardIcon><Monitor /></CardIcon>
            <CardHeading><CardTitle>Desktop</CardTitle><CardDescription>1440 × 900</CardDescription></CardHeading>
            <CardActionIndicator />
          </CardHeader>
        </CardAction>
      );
    }
    return (
      <CardAction href="#" {...p}>
        <CardHeader><CardIcon iconTone="accent"><Plus /></CardIcon><CardSpacer /><CardActionArrow /></CardHeader>
        <CardBody><CardTitle titleSize="sm" className="leading-[inherit]">New project</CardTitle><p>Start blank or from a theme.</p></CardBody>
      </CardAction>
    );
  },
  examples: {
    'action-card': () => (
      <div className="grid gap-3.5">
        <div className={grid}>
          <CardAction href="#">
            <CardHeader><CardIcon iconTone="accent"><Plus /></CardIcon><CardSpacer /><CardActionArrow /></CardHeader>
            <CardBody><CardTitle titleSize="sm" className="leading-[inherit]">New project</CardTitle><p>Start blank or from a theme.</p></CardBody>
          </CardAction>
          <CardAction href="#">
            <CardHeader><CardIcon><FileUp /></CardIcon><CardSpacer /><CardActionArrow /></CardHeader>
            <CardBody><CardTitle titleSize="sm" className="leading-[inherit]">Import</CardTitle><p>URL, HTML, JSX or Figma.</p></CardBody>
          </CardAction>
        </div>
        <div className={grid} role="radiogroup" aria-label="Starting point">
          <CardAction kind="radio" checked>
            <CardHeader headerAlign="center">
              <CardIcon><Monitor /></CardIcon>
              <CardHeading><CardTitle>Desktop</CardTitle><CardDescription>1440 × 900</CardDescription></CardHeading>
              <CardActionIndicator />
            </CardHeader>
          </CardAction>
          <CardAction kind="radio" checked={false}>
            <CardHeader headerAlign="center">
              <CardIcon><Smartphone /></CardIcon>
              <CardHeading><CardTitle>Phone</CardTitle><CardDescription>390 × 844</CardDescription></CardHeading>
              <CardActionIndicator />
            </CardHeader>
          </CardAction>
        </div>
      </div>
    ),
  },
});
