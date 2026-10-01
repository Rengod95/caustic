import { MessageCircle } from 'lucide-react';
import type { CSSProperties } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { Avatar } from '../avatar/avatar.tsx';
import { Badge } from '../badge/badge.tsx';
import { buttonVariants } from '../button/button.variants.ts';
import { cn } from '../../lib/cn.ts';
import { CardDescription, CardFooter, CardHeader, CardHeading, CardMeta, CardSpacer, CardTitle, CardTrailing } from '../card/card.tsx';
import {
  CardMedia, CardMediaCover, CardMediaImage, CardMediaOverlay, CardMediaOverlayDescription, CardMediaOverlayTitle, CardMediaTag, type CardMediaProps,
} from './card-media.tsx';

// Art is decorative and runtime-valued: it enters through custom properties.
const artA = 'radial-gradient(circle at 30% 30%, oklch(.86 .1 70), transparent 45%), radial-gradient(circle at 75% 70%, oklch(.6 .14 30), transparent 55%), linear-gradient(150deg, oklch(.72 .08 220), oklch(.38 .09 260))';
const artB = 'radial-gradient(circle at 70% 25%, oklch(.8 .13 158), transparent 45%), linear-gradient(200deg, oklch(.7 .1 205), oklch(.3 .05 240))';
const artC = 'conic-gradient(from 210deg at 60% 60%, oklch(.82 .12 80), oklch(.62 .15 28), oklch(.5 .12 300), oklch(.82 .12 80))';
const vars = (v: Record<string, string>) => v as CSSProperties;

function Overlay() {
  return (
    <CardMedia layout="overlay" href="#">
      <CardMediaCover>
        <CardMediaImage className="scale-120 [background:var(--art)] [filter:var(--art-filter)]" style={vars({ '--art': artC, '--art-filter': 'blur(10px) saturate(1.1)' })} />
        <CardMediaOverlay>
          <Badge className="justify-self-start bg-(--chip) text-(color:--chip-on)" style={vars({ '--chip': 'oklch(1 0 0 / .2)', '--chip-on': 'oklch(1 0 0)' })}>Template</Badge>
          <CardMediaOverlayTitle>Checkout flow for subscription apps</CardMediaOverlayTitle>
          <CardMediaOverlayDescription>6 screens · light and dark</CardMediaOverlayDescription>
          <div className="mt-2 flex">
            <span className={cn(buttonVariants({ tone: 'secondary', size: 'xs' }), 'bg-(--btn) text-(color:--btn-on)')} style={vars({ '--btn': 'oklch(1 0 0 / .9)', '--btn-on': 'oklch(.2 .01 260)' })}>Use template</span>
          </div>
        </CardMediaOverlay>
      </CardMediaCover>
    </CardMedia>
  );
}

export default defineFixture({
  id: 'card-media',
  frame: children => <div className="w-80 bg-bg-app p-1">{children}</div>,
  render: props => {
    const p = props as CardMediaProps;
    if (p.layout === 'overlay') return <Overlay />;
    return (
      <CardMedia href="#" {...p}>
        <CardMediaCover>
          <CardMediaImage className="[background:var(--art)]" style={vars({ '--art': artA })} />
          <CardMediaTag tone="solid">Draft</CardMediaTag>
        </CardMediaCover>
        <CardHeader><CardHeading><CardTitle>Orbit Pay · Pricing</CardTitle><CardDescription>4 frames · edited 2m ago</CardDescription></CardHeading></CardHeader>
      </CardMedia>
    );
  },
  examples: {
    'media-card': () => (
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*65)),1fr))] items-start gap-3.5">
        <CardMedia href="#">
          <CardMediaCover>
            <CardMediaImage className="[background:var(--art)]" style={vars({ '--art': artA })} />
            <CardMediaTag tone="solid">Draft</CardMediaTag>
          </CardMediaCover>
          <CardHeader><CardHeading><CardTitle>Orbit Pay · Pricing</CardTitle><CardDescription>4 frames · edited 2m ago</CardDescription></CardHeading></CardHeader>
          <CardFooter>
            <div className="flex [&>*+*]:-ml-1.5"><Avatar name="Mina Kim" color="coral" /><Avatar name="Caustic" kind="agent" /></div>
            <CardSpacer />
            <CardMeta><MessageCircle />3</CardMeta>
          </CardFooter>
        </CardMedia>
        <CardMedia href="#">
          <CardMediaCover><CardMediaImage className="[background:var(--art)]" style={vars({ '--art': artB })} /></CardMediaCover>
          <CardHeader>
            <CardHeading><CardTitle>Lagoon</CardTitle><CardDescription>Caustic default · 128 tokens</CardDescription></CardHeading>
            <CardTrailing><Badge tone="success">AA</Badge></CardTrailing>
          </CardHeader>
        </CardMedia>
        <Overlay />
      </div>
    ),
  },
});
