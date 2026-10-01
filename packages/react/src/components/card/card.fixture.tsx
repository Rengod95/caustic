import { ArrowUpRight, Check, ChevronRight, Clock, Download, Ellipsis, Mail, SwatchBook, WandSparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { Avatar } from '../avatar/avatar.tsx';
import { Badge } from '../badge/badge.tsx';
import { Button } from '../button/button.tsx';
import { CardSurface } from '../card-surface/card-surface.tsx';
import { Checkbox } from '../checkbox/checkbox.tsx';
import { Field } from '../field/field.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { Input } from '../input/input.tsx';
import { Progress } from '../progress/progress.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { Switch } from '../switch/switch.tsx';
import {
  Card, CardBody, CardDescription, CardEyebrow, CardFooter, CardHeader, CardHeading, CardIcon, CardMeta, CardSpacer, CardTitle, CardTrailing,
  type CardFooterProps, type CardHeaderProps, type CardIconProps, type CardProps, type CardTitleProps,
} from './card.tsx';

const grid = 'grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*65)),1fr))] items-start gap-3.5';
const gridTwo = 'grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*80)),1fr))] items-start gap-3.5';

type Axes = Pick<CardHeaderProps, 'headerAlign'> & Pick<CardIconProps, 'iconTone'> & Pick<CardTitleProps, 'titleSize'> & Pick<CardFooterProps, 'footer'>;

function Stack({ children }: { children: ReactNode }) {
  return <div className="flex [&>*+*]:-ml-1.5">{children}</div>;
}

const rows = [
  { id: 'a', title: 'Pricing / Desktop', meta: 'Edited 2m ago', thumb: 'linear-gradient(150deg, oklch(.72 .08 220), oklch(.42 .09 260))' },
  { id: 'b', title: 'Checkout / iOS', meta: 'Edited 1h ago', thumb: 'radial-gradient(circle at 70% 30%, oklch(.82 .12 80), transparent 55%), linear-gradient(200deg, oklch(.62 .14 30), oklch(.4 .08 300))' },
];

export default defineFixture({
  id: 'card',
  frame: children => <div className="w-80 bg-surface-base">{children}</div>,
  render: props => {
    const { headerAlign, iconTone, titleSize, footer, ...rest } = props as Axes & CardProps;
    return (
      <Card {...rest}>
        <CardHeader headerAlign={headerAlign}>
          <CardIcon iconTone={iconTone}><SwatchBook /></CardIcon>
          <CardHeading>
            <CardEyebrow>Eyebrow</CardEyebrow>
            <CardTitle titleSize={titleSize}>Card title</CardTitle>
            <CardDescription>One sentence about the card.</CardDescription>
          </CardHeading>
          <CardTrailing><IconButton size="sm" label="More"><Ellipsis /></IconButton></CardTrailing>
        </CardHeader>
        <CardBody><p>Body text sits one gap below the header.</p></CardBody>
        <CardFooter footer={footer}>
          <CardMeta><Clock />Saved 2m ago</CardMeta>
          <CardSpacer />
          <Button tone="secondary" size="sm">Open</Button>
        </CardFooter>
      </Card>
    );
  },
  examples: {
    'header-variations': () => (
      <div className={grid}>
        <CardSurface>
          <CardHeader><CardHeading><CardTitle>Title only</CardTitle></CardHeading></CardHeader>
          <CardBody><p>Short cards with one idea do not need a description.</p></CardBody>
        </CardSurface>
        <CardSurface>
          <CardHeader><CardHeading><CardTitle>Title + description</CardTitle><CardDescription>A sentence that says what this card is for.</CardDescription></CardHeading></CardHeader>
          <CardBody><p>The description sits 2px under the title; the body starts one gap below.</p></CardBody>
        </CardSurface>
        <CardSurface>
          <CardHeader>
            <CardHeading><CardTitle>Trailing icon</CardTitle><CardDescription>Menu, close or expand.</CardDescription></CardHeading>
            <CardTrailing><IconButton size="sm" label="More"><Ellipsis /></IconButton></CardTrailing>
          </CardHeader>
          <CardBody><p>The icon button is pulled into the corner so its hit area does not push the title down.</p></CardBody>
        </CardSurface>
        <CardSurface>
          <CardHeader headerAlign="center">
            <CardIcon iconTone="accent"><SwatchBook /></CardIcon>
            <CardHeading><CardTitle>Leading tile</CardTitle><CardDescription>3 themes · 128 tokens</CardDescription></CardHeading>
            <CardTrailing><Badge tone="success" icon={<Check />}>AA</Badge></CardTrailing>
          </CardHeader>
        </CardSurface>
        <CardSurface>
          <CardHeader headerAlign="center">
            <CardIcon><WandSparkles /></CardIcon>
            <CardHeading><CardTitle>Trailing switch</CardTitle><CardDescription>Agent may edit tokens</CardDescription></CardHeading>
            <CardTrailing><Switch defaultChecked aria-label="Agent may edit tokens" /></CardTrailing>
          </CardHeader>
        </CardSurface>
        <CardSurface>
          <CardHeader>
            <CardHeading><CardEyebrow>Eyebrow</CardEyebrow><CardTitle>Title with eyebrow</CardTitle></CardHeading>
            <CardTrailing><IconButton size="sm" label="Open"><ArrowUpRight /></IconButton></CardTrailing>
          </CardHeader>
        </CardSurface>
      </div>
    ),
    'body-content': () => (
      <div className={gridTwo}>
        <CardSurface>
          <CardHeader><CardHeading><CardTitle>Release notes</CardTitle><CardDescription>v2.4 · Oct 1</CardDescription></CardHeading></CardHeader>
          <CardBody>
            <p>Themes can now inherit from another theme. Overrides stay local, and every change is checked for contrast in both modes before it saves.</p>
            <p>The agent proposes inherited values instead of copying them.</p>
          </CardBody>
        </CardSurface>
        <CardSurface>
          <CardHeader>
            <CardHeading><CardTitle>Seats</CardTitle><CardDescription>Team plan</CardDescription></CardHeading>
            <CardTrailing><Badge>8 / 10</Badge></CardTrailing>
          </CardHeader>
          <CardBody>
            <Progress value={80} aria-label="Seats used" />
            <div className="flex items-center justify-between gap-2">
              <Stack>
                <Avatar name="Mina Kim" color="coral" />
                <Avatar name="Jin Soo" color="iris" />
                <Avatar name="Dae Ho" color="mint" />
                <span className="relative inline-grid size-avatar-sm shrink-0 place-items-center rounded-full bg-fill-selected font-ui text-micro text-text-secondary shadow-[0_0_0_2px_var(--cs-color-surface-base)]">+5</span>
              </Stack>
              <CardMeta>2 seats left</CardMeta>
            </div>
          </CardBody>
        </CardSurface>
        <CardSurface>
          <CardHeader><CardHeading><CardTitle>Invite a teammate</CardTitle><CardDescription>They join as an editor.</CardDescription></CardHeading></CardHeader>
          <CardBody>
            <Field label="Email" className="[&_[data-slot=field-label]]:leading-4.75"><Input prefix={<Mail />} placeholder="name@company.com" /></Field>
            <div className="flex items-center justify-between gap-2">
              <span className="text-footnote text-text-secondary">Role</span>
              <SegmentedControl size="xs" aria-label="Role" defaultValue="editor">
                <SegmentedControlItem value="viewer">Viewer</SegmentedControlItem>
                <SegmentedControlItem value="editor">Editor</SegmentedControlItem>
              </SegmentedControl>
            </div>
          </CardBody>
          <CardFooter footer="end"><Button size="sm">Send invite</Button></CardFooter>
        </CardSurface>
        <CardSurface>
          <CardHeader>
            <CardHeading><CardTitle>Recent frames</CardTitle></CardHeading>
            <CardMeta href="#" className="underline">See all<ChevronRight /></CardMeta>
          </CardHeader>
          <CardBody className="-mx-inset-regular-x gap-0">
            {rows.map(r => (
              <div key={r.id} className="relative flex min-h-16 items-center gap-3 px-3.5 py-2 [&+&]:before:absolute [&+&]:before:inset-x-0 [&+&]:before:left-18.5 [&+&]:before:top-0 [&+&]:before:h-px [&+&]:before:bg-border-subtle">
                <span className="h-9 w-12 flex-none rounded-md shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] [background:var(--thumb)]" style={{ ['--thumb' as string]: r.thumb }} />
                <span className="grid min-w-0 flex-1 gap-px"><b className="truncate font-ui text-ui-md text-text-primary">{r.title}</b><span className="truncate text-ui-sm font-normal text-text-tertiary">{r.meta}</span></span>
                <ChevronRight className="size-icon-lg flex-none text-text-disabled" aria-hidden />
              </div>
            ))}
          </CardBody>
        </CardSurface>
      </div>
    ),
    'footer-variations': () => (
      <div className={grid}>
        <CardSurface>
          <CardHeader><CardHeading><CardTitle>Actions, right</CardTitle><CardDescription>Plain footer, one gap above.</CardDescription></CardHeading></CardHeader>
          <CardFooter footer="end"><Button tone="ghost" size="sm">Dismiss</Button><Button size="sm">Apply</Button></CardFooter>
        </CardSurface>
        <CardSurface>
          <CardHeader><CardHeading><CardTitle>Divided footer</CardTitle><CardDescription>Body keeps its own bottom inset.</CardDescription></CardHeading></CardHeader>
          <CardBody><p>Use a divider when the footer holds controls that act on the whole card.</p></CardBody>
          <CardFooter footer="divided"><CardMeta><Clock />Saved 2m ago</CardMeta><CardSpacer /><Button tone="secondary" size="sm">Open</Button></CardFooter>
        </CardSurface>
        <CardSurface>
          <CardHeader><CardHeading><CardTitle>People + link</CardTitle><CardDescription>Pricing refresh</CardDescription></CardHeading></CardHeader>
          <CardFooter>
            <Stack><Avatar name="Mina Kim" color="coral" /><Avatar name="Caustic" kind="agent" /></Stack>
            <CardMeta>Mina and Caustic</CardMeta>
            <CardSpacer />
            <CardMeta href="#" className="text-text-link underline">Open<ArrowUpRight /></CardMeta>
          </CardFooter>
        </CardSurface>
        <CardSurface>
          <CardHeader><CardHeading><CardTitle>Full-width action</CardTitle><CardDescription>One primary step.</CardDescription></CardHeading></CardHeader>
          <CardFooter footer="block"><Button>Continue</Button></CardFooter>
        </CardSurface>
        <CardSurface>
          <CardHeader><CardHeading><CardTitle>Checkbox + buttons</CardTitle></CardHeading></CardHeader>
          <CardBody><p>Publishing replaces v2.3 for everyone with the link.</p></CardBody>
          <CardFooter footer="divided">
            <span className="inline-flex items-center gap-2"><Checkbox aria-label="Don't ask again" /><span className="text-footnote text-text-secondary">Don’t ask again</span></span>
            <CardSpacer />
            <Button tone="ghost" size="sm">Cancel</Button>
            <Button size="sm">Publish</Button>
          </CardFooter>
        </CardSurface>
        <CardSurface>
          <CardHeader><CardHeading><CardTitle>Status footer</CardTitle><CardDescription>Export · React</CardDescription></CardHeading></CardHeader>
          <CardFooter footer="divided">
            <Badge tone="success" dot>Ready</Badge>
            <CardMeta>3 files · 48 KB</CardMeta>
            <CardSpacer />
            <IconButton size="sm" label="Download"><Download /></IconButton>
          </CardFooter>
        </CardSurface>
      </div>
    ),
  },
});
