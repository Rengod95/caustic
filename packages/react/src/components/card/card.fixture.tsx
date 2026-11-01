import {
  ArrowUp, ArrowUpRight, Check, ChevronRight, Clock, Contrast, Download, Ellipsis, FileCode, FileUp, GitBranch, History, Info, Layers, Mail, MessageCircle,
  Monitor, Pencil, Plus, Smartphone, Sun, SwatchBook, WandSparkles,
} from '../../icons/index.ts';
import type { CSSProperties, ReactNode } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { Avatar } from '../avatar/avatar.tsx';
import { Badge } from '../badge/badge.tsx';
import { Button } from '../button/button.tsx';
import { Checkbox } from '../checkbox/checkbox.tsx';
import { Field } from '../field/field.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { Input } from '../input/input.tsx';
import { Progress } from '../progress/progress.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { Switch } from '../switch/switch.tsx';
import {
  Card, CardArrow, CardBody, CardChoice, CardCover, CardCoverTag, CardDescription, CardEyebrow, CardFooter, CardHeader, CardHeading, CardHeadline, CardIcon,
  CardImage, CardIndicator, CardLink, CardMeta, CardOrb, CardOverlay, CardOverlayDescription, CardOverlayTag, CardOverlayTitle, CardPanel, CardSpacer,
  CardTitle, CardTrailing, CardVisual,
  type CardChoiceProps, type CardCoverProps, type CardFooterProps, type CardHeaderProps, type CardIconProps, type CardLinkProps, type CardProps,
  type CardTitleProps,
} from './card.tsx';

const grid = 'grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*65)),1fr))] items-start gap-3.5';
const gridTwo = 'grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*80)),1fr))] items-start gap-3.5';

type Axes = Pick<CardHeaderProps, 'headerAlign'> & Pick<CardIconProps, 'iconTone'> & Pick<CardTitleProps, 'titleSize'> & Pick<CardFooterProps, 'footer'>;
type CaseProps = Axes & CardProps & Pick<CardLinkProps, 'href' | 'as'> & Pick<CardChoiceProps, 'checked' | 'defaultChecked' | 'type' | 'onCheckedChange'> & {
  density?: unknown; layout?: CardCoverProps['layout'];
};

// Avatars are ringless (owner 2026-10-27); an overlapping stack cuts each one out of the card surface itself.
function Stack({ children }: { children: ReactNode }) {
  return <div className="flex [&>*]:shadow-[0_0_0_2px_var(--cs-color-surface-base)] [&>*+*]:-ml-1.5">{children}</div>;
}

const rows = [
  { id: 'a', title: 'Pricing / Desktop', meta: 'Edited 2m ago', thumb: 'linear-gradient(150deg, oklch(.72 .08 220), oklch(.42 .09 260))' },
  { id: 'b', title: 'Checkout / iOS', meta: 'Edited 1h ago', thumb: 'radial-gradient(circle at 70% 30%, oklch(.82 .12 80), transparent 55%), linear-gradient(200deg, oklch(.62 .14 30), oklch(.4 .08 300))' },
];

// ---- ported from card-surface
function Meter({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex justify-between text-ui-sm font-normal leading-4.75"><span className="text-text-secondary">{label}</span><b className="font-semibold tabular-nums text-text-primary">{value}</b></div>
      <Progress value={pct} aria-label={label} />
    </div>
  );
}

// ---- ported from card-glass: the stage art is a runtime value; it enters through a custom property.
const stage = 'radial-gradient(circle at 18% 22%, oklch(.78 .13 205 / .9), transparent 42%), radial-gradient(circle at 82% 30%, oklch(.82 .12 80 / .85), transparent 40%), radial-gradient(circle at 55% 95%, oklch(.7 .14 158 / .7), transparent 45%), var(--cs-color-bg-canvas)';
const stageStyle = { ['--stage' as string]: stage };

// ---- ported from card-outline
const axes = [
  { id: 'size', title: 'Variant axis · Size', values: 'sm, md, lg' },
  { id: 'tone', title: 'Variant axis · Tone', values: 'ink, accent, secondary' },
];

// ---- ported from card-well
const bars = [30, 45, 38, 62, 54, 70, 88, 20];
const providers = [
  { id: 'a', initial: 'A', name: 'Anthropic', meta: 'Claude · default', live: true },
  { id: 'o', initial: 'O', name: 'OpenAI', meta: 'Not connected', live: false },
];

function Usage() {
  return (
    <Card variant="well">
      <CardHeader density="shell"><CardTitle titleSize="sm">Usage this month</CardTitle><CardMeta>Oct 2026</CardMeta></CardHeader>
      <CardPanel>
        <div className="grid gap-1"><span className="font-ui text-stat tabular-nums text-text-primary">3,912 <small className="text-ui-lg leading-[inherit] tracking-normal text-text-tertiary">rounds</small></span></div>
        <div className="flex h-11 items-end gap-1" aria-hidden>
          {bars.map((h, i) => (
            <i key={h + '-' + i} style={{ ['--h' as string]: `${h}%` }} className={i === 6 ? 'h-(--h) flex-1 rounded-t-xs rounded-b-[2px] bg-chart-1' : 'h-(--h) flex-1 rounded-t-xs rounded-b-[2px] bg-neutral-track'} />
          ))}
        </div>
      </CardPanel>
      <CardFooter density="shell">
        <CardMeta><Info />Resets Nov 1</CardMeta>
        <CardSpacer />
        <CardMeta href="#" className="text-text-link underline">Details</CardMeta>
      </CardFooter>
    </Card>
  );
}

// ---- ported from card-agent
const thumbs = [
  'linear-gradient(150deg, oklch(.72 .08 220), oklch(.42 .09 260))',
  'radial-gradient(circle at 70% 30%, oklch(.82 .12 80), transparent 55%), linear-gradient(200deg, oklch(.62 .14 30), oklch(.4 .08 300))',
  'linear-gradient(120deg, oklch(.86 .08 158), oklch(.6 .1 205))',
];

const AgentResult = (props: Partial<CardProps>) => (
  <Card variant="agent" {...props}>
    <CardHeader headerAlign="center">
      <CardOrb />
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
  </Card>
);

// ---- ported from card-feature
const bento = 'grid w-full grid-cols-4 auto-rows-[minmax(calc(var(--spacing)*37.5),auto)] gap-3.5 max-[760px]:grid-cols-2 max-[460px]:grid-cols-1';

/** Mock composer: demo content, glass is not part of the feature card. */
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

// ---- ported from card-media: art is decorative and runtime-valued; it enters through custom properties.
const artA = 'radial-gradient(circle at 30% 30%, oklch(.86 .1 70), transparent 45%), radial-gradient(circle at 75% 70%, oklch(.6 .14 30), transparent 55%), linear-gradient(150deg, oklch(.72 .08 220), oklch(.38 .09 260))';
const artB = 'radial-gradient(circle at 70% 25%, oklch(.8 .13 158), transparent 45%), linear-gradient(200deg, oklch(.7 .1 205), oklch(.3 .05 240))';
const artC = 'conic-gradient(from 210deg at 60% 60%, oklch(.82 .12 80), oklch(.62 .15 28), oklch(.5 .12 300), oklch(.82 .12 80))';
const vars = (v: Record<string, string>) => v as CSSProperties;

function MediaOverlay() {
  return (
    <Card>
      <CardCover layout="overlay">
        <CardImage className="scale-120 [background:var(--art)] [filter:var(--art-filter)]" style={vars({ '--art': artC, '--art-filter': 'blur(10px) saturate(1.1)' })} />
        <CardOverlay>
          <CardOverlayTag>Template</CardOverlayTag>
          <CardOverlayTitle>Checkout flow for subscription apps</CardOverlayTitle>
          <CardOverlayDescription>6 screens · light and dark</CardOverlayDescription>
          <div className="mt-2 flex">
            <Button asChild tone="secondary" size="xs"><a href="#template">Use template</a></Button>
          </div>
        </CardOverlay>
      </CardCover>
    </Card>
  );
}

/** One instance per gateway case: the shape of the skin, the link, the choice or the media card the case asks for. */
function CaseCard(props: CaseProps) {
  const { headerAlign, iconTone, titleSize, footer, density: _density, layout, href, as, checked, defaultChecked, type, onCheckedChange, ...rest } = props;
  if (checked !== undefined || defaultChecked !== undefined || type !== undefined) {
    return (
      <CardChoice {...(rest as Partial<CardChoiceProps>)} checked={checked} defaultChecked={defaultChecked} type={type} onCheckedChange={onCheckedChange}>
        <CardHeader headerAlign="center">
          <CardIcon><Monitor /></CardIcon>
          <CardHeading><CardTitle>Desktop</CardTitle><CardDescription>1440 × 900</CardDescription></CardHeading>
          <CardIndicator />
        </CardHeader>
      </CardChoice>
    );
  }
  if (layout === 'overlay') return <MediaOverlay />;
  if (layout === 'cover') {
    return (
      <CardLink href="#" {...(rest as Partial<CardLinkProps>)}>
        <CardCover>
          <CardImage className="[background:var(--art)]" style={vars({ '--art': artA })} />
          <CardCoverTag tone="solid">Draft</CardCoverTag>
        </CardCover>
        <CardHeader><CardHeading><CardTitle>Orbit Pay · Pricing</CardTitle><CardDescription>4 frames · edited 2m ago</CardDescription></CardHeading></CardHeader>
      </CardLink>
    );
  }
  if (rest.variant === 'dashed' || as === 'button') {
    return <CardLink as="button" {...(rest as Partial<CardLinkProps>)}><Plus className="size-icon-sm" aria-hidden />Add axis</CardLink>;
  }
  if (href !== undefined) {
    return (
      <CardLink href={href} {...(rest as Partial<CardLinkProps>)}>
        <CardHeader><CardIcon iconTone="accent"><Plus /></CardIcon><CardSpacer /><CardArrow /></CardHeader>
        <CardBody><CardTitle titleSize="sm" className="leading-[inherit]">New project</CardTitle><p>Start blank or from a theme.</p></CardBody>
      </CardLink>
    );
  }
  if (rest.variant === 'well') {
    return (
      <Card {...rest}>
        <CardHeader density="shell"><CardTitle titleSize="sm">Usage this month</CardTitle><CardMeta>Oct 2026</CardMeta></CardHeader>
        <CardPanel><p>3,912 rounds</p></CardPanel>
        <CardFooter density="shell"><CardMeta><Info />Resets Nov 1</CardMeta><CardSpacer /><CardMeta href="#" className="text-text-link">Details</CardMeta></CardFooter>
      </Card>
    );
  }
  if (rest.variant === 'agent') return <AgentResult {...rest} />;
  if (rest.variant === 'feature') {
    return (
      <Card {...rest}>
        <CardHeader><CardIcon iconTone="accent"><WandSparkles /></CardIcon></CardHeader>
        <CardBody>
          <CardHeadline>Describe a screen. Review every change.</CardHeadline>
          <p>The agent drafts frames from your theme and asks before it touches anything shared.</p>
        </CardBody>
        <CardVisual><MockComposer /></CardVisual>
      </Card>
    );
  }
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
}

export default defineFixture({
  id: 'card',
  frame: children => <div className="w-80 bg-surface-base">{children}</div>,
  render: props => <CaseCard {...(props as CaseProps)} />,
  examples: {
    'header-variations': () => (
      <div className={grid}>
        <Card>
          <CardHeader><CardHeading><CardTitle>Title only</CardTitle></CardHeading></CardHeader>
          <CardBody><p>Short cards with one idea do not need a description.</p></CardBody>
        </Card>
        <Card>
          <CardHeader><CardHeading><CardTitle>Title + description</CardTitle><CardDescription>A sentence that says what this card is for.</CardDescription></CardHeading></CardHeader>
          <CardBody><p>The description sits 2px under the title; the body starts one gap below.</p></CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardHeading><CardTitle>Trailing icon</CardTitle><CardDescription>Menu, close or expand.</CardDescription></CardHeading>
            <CardTrailing><IconButton size="sm" label="More"><Ellipsis /></IconButton></CardTrailing>
          </CardHeader>
          <CardBody><p>The icon button is pulled into the corner so its hit area does not push the title down.</p></CardBody>
        </Card>
        <Card>
          <CardHeader headerAlign="center">
            <CardIcon iconTone="accent"><SwatchBook /></CardIcon>
            <CardHeading><CardTitle>Leading tile</CardTitle><CardDescription>3 themes · 128 tokens</CardDescription></CardHeading>
            <CardTrailing><Badge tone="success" icon={<Check />}>AA</Badge></CardTrailing>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader headerAlign="center">
            <CardIcon><WandSparkles /></CardIcon>
            <CardHeading><CardTitle>Trailing switch</CardTitle><CardDescription>Agent may edit tokens</CardDescription></CardHeading>
            <CardTrailing><Switch defaultChecked aria-label="Agent may edit tokens" /></CardTrailing>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardHeading><CardEyebrow>Eyebrow</CardEyebrow><CardTitle>Title with eyebrow</CardTitle></CardHeading>
            <CardTrailing><IconButton size="sm" label="Open"><ArrowUpRight /></IconButton></CardTrailing>
          </CardHeader>
        </Card>
      </div>
    ),
    'body-content': () => (
      <div className={gridTwo}>
        <Card>
          <CardHeader><CardHeading><CardTitle>Release notes</CardTitle><CardDescription>v2.4 · Oct 1</CardDescription></CardHeading></CardHeader>
          <CardBody>
            <p>Themes can now inherit from another theme. Overrides stay local, and every change is checked for contrast in both modes before it saves.</p>
            <p>The agent proposes inherited values instead of copying them.</p>
          </CardBody>
        </Card>
        <Card>
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
                <span className="relative inline-grid size-avatar-sm shrink-0 place-items-center rounded-full bg-neutral-soft font-ui text-micro text-text-secondary shadow-[0_0_0_2px_var(--cs-color-surface-base)]">+5</span>
              </Stack>
              <CardMeta>2 seats left</CardMeta>
            </div>
          </CardBody>
        </Card>
        <Card>
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
        </Card>
        <Card>
          <CardHeader>
            <CardHeading><CardTitle>Recent frames</CardTitle></CardHeading>
            <CardMeta href="#" className="underline">See all<ChevronRight /></CardMeta>
          </CardHeader>
          <CardBody className="-mx-inset-regular-x gap-0">
            {rows.map(r => (
              <div key={r.id} className="relative flex min-h-16 items-center gap-3 px-3.5 py-2 [&+&]:before:absolute [&+&]:before:inset-x-0 [&+&]:before:left-18.5 [&+&]:before:top-0 [&+&]:before:h-px [&+&]:before:bg-border-subtle">
                <span className="h-9 w-12 flex-none rounded-md shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] [background:var(--thumb)]" style={{ ['--thumb' as string]: r.thumb }} />
                <span className="grid min-w-0 flex-1 gap-px"><b className="truncate font-ui text-ui-md text-text-primary">{r.title}</b><span className="truncate text-ui-sm font-normal text-text-tertiary">{r.meta}</span></span>
                <ChevronRight className="size-icon-lg flex-none text-neutral-graphic" aria-hidden />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    ),
    'footer-variations': () => (
      <div className={grid}>
        <Card>
          <CardHeader><CardHeading><CardTitle>Actions, right</CardTitle><CardDescription>Plain footer, one gap above.</CardDescription></CardHeading></CardHeader>
          <CardFooter footer="end"><Button tone="ghost" size="sm">Dismiss</Button><Button size="sm">Apply</Button></CardFooter>
        </Card>
        <Card>
          <CardHeader><CardHeading><CardTitle>Divided footer</CardTitle><CardDescription>Body keeps its own bottom inset.</CardDescription></CardHeading></CardHeader>
          <CardBody><p>Use a divider when the footer holds controls that act on the whole card.</p></CardBody>
          <CardFooter footer="divided"><CardMeta><Clock />Saved 2m ago</CardMeta><CardSpacer /><Button tone="secondary" size="sm">Open</Button></CardFooter>
        </Card>
        <Card>
          <CardHeader><CardHeading><CardTitle>People + link</CardTitle><CardDescription>Pricing refresh</CardDescription></CardHeading></CardHeader>
          <CardFooter>
            <Stack><Avatar name="Mina Kim" color="coral" /><Avatar name="Caustic" kind="agent" /></Stack>
            <CardMeta>Mina and Caustic</CardMeta>
            <CardSpacer />
            <CardMeta href="#" className="text-text-link underline">Open<ArrowUpRight /></CardMeta>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader><CardHeading><CardTitle>Full-width action</CardTitle><CardDescription>One primary step.</CardDescription></CardHeading></CardHeader>
          <CardFooter footer="block"><Button>Continue</Button></CardFooter>
        </Card>
        <Card>
          <CardHeader><CardHeading><CardTitle>Checkbox + buttons</CardTitle></CardHeading></CardHeader>
          <CardBody><p>Publishing replaces v2.3 for everyone with the link.</p></CardBody>
          <CardFooter footer="divided">
            <span className="inline-flex items-center gap-2"><Checkbox aria-label="Don't ask again" /><span className="text-footnote text-text-secondary">Don’t ask again</span></span>
            <CardSpacer />
            <Button tone="ghost" size="sm">Cancel</Button>
            <Button size="sm">Publish</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader><CardHeading><CardTitle>Status footer</CardTitle><CardDescription>Export · React</CardDescription></CardHeading></CardHeader>
          <CardFooter footer="divided">
            <Badge tone="success" dot>Ready</Badge>
            <CardMeta>3 files · 48 KB</CardMeta>
            <CardSpacer />
            <IconButton size="sm" label="Download"><Download /></IconButton>
          </CardFooter>
        </Card>
      </div>
    ),
    // ---- ported examples: the former card-* components, now Card skins, CardLink and CardChoice.
    'card-surface-surface-card': () => (
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*80)),1fr))] items-start gap-3.5">
        <Card>
          <CardHeader>
            <CardHeading><CardTitle>Team plan</CardTitle><CardDescription>Billed yearly · renews Mar 2027</CardDescription></CardHeading>
            <CardTrailing><IconButton size="sm" label="More"><Ellipsis /></IconButton></CardTrailing>
          </CardHeader>
          <CardBody>
            <Meter label="Seats" value="8 / 10" pct={80} />
            <Meter label="Agent rounds" value="3,912 / 5,000" pct={78} />
          </CardBody>
          <CardFooter footer="divided">
            <CardMeta>Resets Nov 1</CardMeta>
            <CardSpacer />
            <Button tone="ghost" size="sm">Manage</Button>
            <Button size="sm">Upgrade</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader headerAlign="center">
            <CardIcon iconTone="accent"><GitBranch /></CardIcon>
            <CardHeading><CardTitle>Lagoon Dark</CardTitle><CardDescription>Inherits Lagoon · 14 overrides</CardDescription></CardHeading>
            <CardTrailing><Badge tone="success" icon={<Check />}>AA</Badge></CardTrailing>
          </CardHeader>
          <CardBody>
            <div className="flex gap-1.5">
              <Badge mono size="md" swatch="var(--cs-accent-5)">accent/solid</Badge>
              <Badge mono size="md" swatch="var(--cs-neutral-10)">surface/base</Badge>
              <Badge mono size="md">+12</Badge>
            </div>
          </CardBody>
        </Card>
      </div>
    ),
    'card-glass-glass-card': () => (
      <div className="relative grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,calc(var(--spacing)*65)),1fr))] items-start gap-3.5 overflow-hidden rounded-3xl p-7 [background:var(--stage)]" style={stageStyle}>
        <Card variant="glass">
          <CardHeader>
            <CardHeading><CardTitle>Now playing</CardTitle><CardDescription>Agent session · Pricing refresh</CardDescription></CardHeading>
            <span aria-hidden className="orb" />
          </CardHeader>
          <CardBody>
            <Progress tone="agent" value={62} aria-label="Step 3 of 4" />
            <CardMeta className="leading-4.75">Step 3 of 4 · Apply spacing and radius</CardMeta>
          </CardBody>
          <CardFooter footer="end"><Button tone="secondary" size="sm">Pause</Button><Button size="sm">Open</Button></CardFooter>
        </Card>
        <Card variant="glass">
          <CardHeader headerAlign="center">
            <CardIcon><Sun /></CardIcon>
            <CardHeading><CardTitle>Light theme</CardTitle><CardDescription>Preview over the canvas</CardDescription></CardHeading>
            <CardTrailing><Switch defaultChecked aria-label="Light theme" /></CardTrailing>
          </CardHeader>
        </Card>
      </div>
    ),
    'card-outline-outline-card': () => (
      <div className={grid}>
        {axes.map(a => (
          <Card key={a.id} variant="outline">
            <CardHeader>
              <CardHeading><CardTitle>{a.title}</CardTitle><CardDescription>{a.values}</CardDescription></CardHeading>
              <CardTrailing><IconButton size="sm" label="Edit"><Pencil /></IconButton></CardTrailing>
            </CardHeader>
          </Card>
        ))}
        <CardLink as="button" variant="dashed"><Plus className="size-icon-sm" aria-hidden />Add axis</CardLink>
      </div>
    ),
    'card-well-well-card': () => (
      <div className={gridTwo}>
        <Usage />
        <Card variant="well">
          <CardHeader density="shell"><CardTitle titleSize="sm">Connected providers</CardTitle><CardTrailing><IconButton size="xs" label="Add provider"><Plus /></IconButton></CardTrailing></CardHeader>
          <CardPanel>
            <div className="-mx-inset-regular-x">
              {providers.map(p => (
                <div key={p.id} className="relative flex min-h-13 items-center gap-3 px-3.5 py-2 [&+&]:before:absolute [&+&]:before:inset-x-0 [&+&]:before:left-14.5 [&+&]:before:top-0 [&+&]:before:h-px [&+&]:before:bg-border-subtle">
                  <span aria-hidden className="grid size-8 flex-none place-items-center rounded-lg bg-neutral-well font-ui text-ui-strong text-text-primary">{p.initial}</span>
                  <span className="grid min-w-0 flex-1 gap-px"><b className="truncate font-ui text-ui-md leading-4.75 text-text-primary">{p.name}</b><span className="truncate text-ui-sm font-normal leading-4.75 text-text-tertiary">{p.meta}</span></span>
                  {p.live ? <Badge tone="success" dot>Live</Badge> : <Button tone="secondary" size="xs">Connect</Button>}
                </div>
              ))}
            </div>
          </CardPanel>
        </Card>
      </div>
    ),
    'card-agent-agent-card': () => (
      <div className={gridTwo}>
        <AgentResult />
      </div>
    ),
    'card-spotlight-spotlight-card': () => (
      <div className={grid}>
        <Card variant="spotlight">
          <CardHeader><CardIcon><Layers /></CardIcon></CardHeader>
          <CardBody><CardTitle className="leading-[inherit]">Layers</CardTitle><p>Tree with drop hints, instances and agent marks.</p></CardBody>
        </Card>
        <Card variant="spotlight">
          <CardHeader><CardIcon><SwatchBook /></CardIcon></CardHeader>
          <CardBody><CardTitle className="leading-[inherit]">Tokens</CardTitle><p>Bindings, graph and theme gallery.</p></CardBody>
        </Card>
        <Card variant="spotlight">
          <CardHeader><CardIcon><History /></CardIcon></CardHeader>
          <CardBody><CardTitle className="leading-[inherit]">History</CardTitle><p>Revisions, diffs and visual compare.</p></CardBody>
        </Card>
      </div>
    ),
    'card-feature-feature-card': () => (
      <div className={bento}>
        <Card variant="feature" fill="fill" className="col-span-2 row-span-2 max-[460px]:col-auto max-[460px]:row-auto">
          <CardHeader><CardIcon iconTone="accent"><WandSparkles /></CardIcon></CardHeader>
          <CardBody>
            <CardHeadline>Describe a screen. Review every change.</CardHeadline>
            <p>The agent drafts frames from your theme and asks before it touches anything shared.</p>
          </CardBody>
          <CardBody className="flex-1">
            <CardVisual><MockComposer /></CardVisual>
          </CardBody>
        </Card>
        <Card variant="feature" className="col-span-2 max-[460px]:col-auto">
          <CardHeader headerAlign="center">
            <CardIcon><Contrast /></CardIcon>
            <CardHeading>
              <CardTitle>Contrast is a build gate</CardTitle>
              <CardDescription>96 rules · 24 hues</CardDescription>
            </CardHeading>
          </CardHeader>
        </Card>
        <Card variant="feature">
          <CardHeader><CardIcon><GitBranch /></CardIcon></CardHeader>
          <CardBody><CardTitle titleSize="sm">Theme inheritance</CardTitle><p>Override only what differs.</p></CardBody>
        </Card>
        <Card variant="feature">
          <CardHeader><CardIcon><FileCode /></CardIcon></CardHeader>
          <CardBody><CardTitle titleSize="sm">Code you review</CardTitle><p>React, SwiftUI, tokens.</p></CardBody>
        </Card>
      </div>
    ),
    'card-action-action-card': () => (
      <div className="grid gap-3.5">
        <div className={grid}>
          <CardLink href="#">
            <CardHeader><CardIcon iconTone="accent"><Plus /></CardIcon><CardSpacer /><CardArrow /></CardHeader>
            <CardBody><CardTitle titleSize="sm" className="leading-[inherit]">New project</CardTitle><p>Start blank or from a theme.</p></CardBody>
          </CardLink>
          <CardLink href="#">
            <CardHeader><CardIcon><FileUp /></CardIcon><CardSpacer /><CardArrow /></CardHeader>
            <CardBody><CardTitle titleSize="sm" className="leading-[inherit]">Import</CardTitle><p>URL, HTML, JSX or Figma.</p></CardBody>
          </CardLink>
        </div>
        <div className={grid} role="radiogroup" aria-label="Starting point">
          <CardChoice checked>
            <CardHeader headerAlign="center">
              <CardIcon><Monitor /></CardIcon>
              <CardHeading><CardTitle>Desktop</CardTitle><CardDescription>1440 × 900</CardDescription></CardHeading>
              <CardIndicator />
            </CardHeader>
          </CardChoice>
          <CardChoice checked={false}>
            <CardHeader headerAlign="center">
              <CardIcon><Smartphone /></CardIcon>
              <CardHeading><CardTitle>Phone</CardTitle><CardDescription>390 × 844</CardDescription></CardHeading>
              <CardIndicator />
            </CardHeader>
          </CardChoice>
        </div>
      </div>
    ),
    'card-media-media-card': () => (
      <div className={grid}>
        <CardLink href="#">
          <CardCover>
            <CardImage className="[background:var(--art)]" style={vars({ '--art': artA })} />
            <CardCoverTag tone="solid">Draft</CardCoverTag>
          </CardCover>
          <CardHeader><CardHeading><CardTitle>Orbit Pay · Pricing</CardTitle><CardDescription>4 frames · edited 2m ago</CardDescription></CardHeading></CardHeader>
          <CardFooter>
            <div className="flex [&>*]:shadow-[0_0_0_2px_var(--cs-color-surface-base)] [&>*+*]:-ml-1.5"><Avatar name="Mina Kim" color="coral" /><Avatar name="Caustic" kind="agent" /></div>
            <CardSpacer />
            <CardMeta><MessageCircle />3</CardMeta>
          </CardFooter>
        </CardLink>
        <CardLink href="#">
          <CardCover><CardImage className="[background:var(--art)]" style={vars({ '--art': artB })} /></CardCover>
          <CardHeader>
            <CardHeading><CardTitle>Lagoon</CardTitle><CardDescription>Caustic default · 128 tokens</CardDescription></CardHeading>
            <CardTrailing><Badge tone="success">AA</Badge></CardTrailing>
          </CardHeader>
        </CardLink>
        <MediaOverlay />
      </div>
    ),
  },
});
